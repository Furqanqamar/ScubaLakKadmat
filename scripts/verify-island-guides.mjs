import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const content = JSON.parse(await readFile(new URL('src/app/data/island-guides.json', root), 'utf8'));
const source = await readFile(new URL('src/app/data/island-media.generated.ts', root), 'utf8');
const media = JSON.parse(source.slice(source.indexOf(' = ') + 3).trim().replace(/;$/, ''));
const originalSource = await readFile(new URL('src/app/data/original-image-info.generated.ts', root), 'utf8');
const originals = JSON.parse(originalSource.slice(originalSource.indexOf(' = ') + 3).trim().replace(/;$/, ''));
const slugs = content.islands.map(island => island.slug);
assert.equal(slugs.length, 15);
assert.equal(new Set(slugs).size, 15);
assert.equal(content.islands.filter(island => island.category === 'inhabited').length, 10);
assert.equal(content.islands.filter(island => island.category === 'visitor').length, 2);
assert.equal(content.islands.filter(island => island.category === 'atoll').length, 3);
const output = new URL('dist/scuba-lak/browser/', root);
const atlas = await readFile(new URL('lakshadweep/index.html', output), 'utf8');
assert.equal((atlas.match(/<a\b[^>]*class="island-guide-card"/g) ?? []).length, 15, 'All cards are full, semantic links');
let photographs = 0;
for (const island of content.islands) {
  assert.match(island.slug, /^[a-z]+(?:-[a-z]+)*$/);
  assert.ok(island.sections.length >= 3);
  assert.equal(new Set(island.sections.map(section => section.id)).size, island.sections.length);
  for (const relative of island.related) assert.ok(slugs.includes(relative), relative);
  for (const citation of island.sources) assert.equal(new URL(citation.url).protocol, 'https:');
  const image = media[island.slug];
  assert.ok(image, island.slug);
  const html = await readFile(new URL(`lakshadweep/${island.slug}/index.html`, output), 'utf8');
  assert.ok(html.includes(image.src), `Guide and card must share artwork: ${island.slug}`);
  const hero = html.match(/<figure class="island-story__illustration">([\s\S]*?)<\/figure>/)?.[1];
  assert.match(hero, /loading="eager"/);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /srcset="/);
  assert.ok(html.includes('stylised, not to scale'), 'Do not imply artwork is documentary');
  const graph = JSON.parse(html.match(/id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.some(item => item['@type'] === 'Article'));
  assert.ok(graph.some(item => item['@type'] === 'Place' && item.name === island.name));
  assert.equal(graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement.length, 3);
  for (const section of island.sections) {
    assert.ok(html.includes(`id="${section.id}"`));
    assert.ok(section.paragraphs.every(paragraph => paragraph.length > 80));
    if (section.photo) {
      photographs++;
      assert.ok(html.includes('class="island-story__photo"'), island.slug);
      if (!section.photo.endsWith('-original')) {
        assert.ok(media[section.photo]?.credit && media[section.photo]?.licenseUrl);
        assert.ok(html.includes(media[section.photo].sourceUrl.replaceAll('&', '&amp;')));
      }
    }
  }
}
let total = 0;
for (const image of Object.values(media)) {
  assert.ok(image.placeholder.startsWith('data:image/webp;base64,'));
  for (const variant of image.srcset.split(', ')) {
    const [path, width] = variant.split(' ');
    const buffer = await readFile(new URL(`public/${path}`, root));
    assert.ok(path.includes(createHash('sha256').update(buffer).digest('hex').slice(0, 12)));
    assert.match(width, /^\d+w$/);
    assert.ok(buffer.length < 500 * 1024, `Image budget exceeded: ${path}`);
    total += (await stat(new URL(`public/${path}`, root))).size;
  }
}
assert.ok(Object.keys(originals).length > 0);
console.log(`Island checks passed: 15 guides, 10 inhabited islands, 5 visitor/atoll subjects, shared artwork, ${photographs} verified photographs, linked sources, responsive fingerprints and ${(total / 1048576).toFixed(1)} MB across all island delivery sizes.`);
