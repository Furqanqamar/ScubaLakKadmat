import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const html = await readFile(new URL('about/index.html', output), 'utf8');
const cards = [...html.matchAll(/<article\b[^>]*class="team-card"[^>]*>([\s\S]*?)<\/article>/g)];
const expected = [
  ['shamsudheen', 'Shamsudheen', 'media/team/shamsudheen.jpg'],
  ['mohammed-sadique', 'Mohammed Sadique', 'media/team/mohammed-sadique.jpg'],
  ['jamhar', 'Jamhar', 'media/team/jamhar.jpg'],
  ['al-ameen', 'Al Ameen', 'media/team/team-member-4.jpg'],
  ['saheer', 'Saheer', 'media/team/team-member-5.jpg'],
  ['lukman', 'Lukman', 'media/team/team-member-6.jpg'],
  ['amjad-khan', 'Amjad Khan'],
  ['thoufeque', 'Thoufeque']
];
assert.equal(cards.length, expected.length);
for (const [index, [id, name, image]] of expected.entries()) {
  const card = cards[index][0];
  assert.ok(card.includes(`aria-labelledby="team-member-${id}"`), `Card order: ${name}`);
  const heading = card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/);
  assert.equal(heading?.[1], name);
  assert.ok(heading?.[0].includes(`id="team-member-${id}"`));
  assert.doesNotMatch(card, /<p\b|<span\b|Senior instructor|\srole=/, 'Show names only, without positions or initials badges');
  assert.match(card, /loading="lazy"/);
  assert.match(card, /decoding="async"/);
  assert.match(card, /sizes="[^"]*286px"/);
  if (image) {
    assert.ok(card.includes(`src="${image}"`), `Keep the confirmed portrait for ${name}`);
    await readFile(new URL('public/' + image, root));
  }
}

const generated = await readFile(new URL('src/app/data/team-portraits.generated.ts', root), 'utf8');
const portraits = JSON.parse(generated.match(/TEAM_PORTRAITS = ([\s\S]*?) as const;/)[1]);
for (const [id, index, dimensions, position] of [
  ['amjad-khan', 6, [1200, 1600], '50% 30%'],
  ['thoufeque', 7, [1280, 1600], '50% 50%']
]) {
  const portrait = portraits[id], card = cards[index][0];
  assert.ok(card.includes(`src="${portrait.imageUrl}"`));
  assert.ok(card.includes(`srcset="${portrait.srcset}"`));
  assert.ok(card.includes(portrait.placeholder));
  assert.ok(card.includes(`object-position: ${position}`));
  assert.deepEqual([portrait.width, portrait.height], dimensions);
  assert.equal(portrait.srcset.split(', ').length, 3);
  let totalBytes = 0;
  for (const variant of portrait.srcset.split(', ')) {
    const [path, width] = variant.split(' ');
    const data = await readFile(new URL('public/' + path, root));
    totalBytes += data.length;
    assert.ok(Number.parseInt(width) <= portrait.width, 'Do not upscale the supplied portrait');
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)));
    assert.ok(data.length < 350000, 'Keep each portrait delivery size reasonable');
    for (let offset = 12; offset + 8 <= data.length;) {
      const kind = data.toString('ascii', offset, offset + 4), length = data.readUInt32LE(offset + 4);
      assert.ok(!['EXIF', 'XMP '].includes(kind), 'Do not publish private photo metadata');
      offset += 8 + length + length % 2;
    }
  }
  assert.ok(totalBytes < 450000);
}
const portraitManifest = JSON.parse(await readFile(new URL('scripts/team-photos.json', root), 'utf8'));
assert.deepEqual(portraitManifest.find(item => item.id === 'thoufeque').crop, { x: 1100, y: 1600, width: 1280, height: 1600 }, 'Use the subject-focused portrait crop, not the empty sky or black borders');
const template = await readFile(new URL('src/app/pages/about/about.component.html', root), 'utf8');
assert.match(template, /class="team-grid"/);
assert.doesNotMatch(template, /member\.(?:role|bio|initials)/);
const styles = await readFile(new URL('src/styles.css', root), 'utf8');
assert.match(styles, /\.team-grid\s*\{[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center;/);
assert.match(styles, /@media \(min-width: 640px\)\s*\{\s*\.team-card\s*\{[^}]*\/ 2\)/);
assert.match(styles, /@media \(min-width: 1024px\)\s*\{\s*\.team-card\s*\{[^}]*\/ 4\)/);
console.log('Team checks passed: eight names in confirmed order, Thoufeque after Amjad Khan, all original portraits retained, responsive WebP portraits with placeholders and no photo metadata, names-only cards and 4+4 / tablet / phone layout rules.');
