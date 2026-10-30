import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const source = await readFile(new URL('src/app/data/additional-media.generated.ts', root), 'utf8');
const photos = JSON.parse(source.split(' = ')[1].split(' as const satisfies')[0]);
const infoSource = await readFile(new URL('src/app/data/additional-image-info.generated.ts', root), 'utf8');
const metadata = JSON.parse(infoSource.split(' = ')[1].trim().replace(/;$/, ''));
const manifest = JSON.parse(await readFile(new URL('scripts/additional-photos.json', root), 'utf8'));
const reviews = JSON.parse(await readFile(new URL('src/app/data/guest-reviews.json', root), 'utf8'));
assert.equal(Object.keys(photos).length, 8);
assert.deepEqual(Object.keys(photos), manifest.map(item => item.id));
const gallery = await readFile(new URL('gallery/index.html', output), 'utf8');
let bytes = 0;
for (const photo of Object.values(photos)) {
  assert.equal(photo.kind, 'image');
  const info = metadata[photo.imageUrl];
  assert.ok(info && info.placeholder.startsWith('data:image/webp;base64,'));
  assert.match(info.objectPosition, /^\d+% \d+%$/);
  assert.ok(gallery.includes(`id="${photo.id}"`), `Photo missing from gallery: ${photo.id}`);
  const sizes = info.srcset.split(', ').map(item => item.split(' '));
  assert.ok(sizes.length >= 5, 'Native-source intermediate sizes prevent large srcset jumps');
  assert.ok(sizes.some(([, width]) => width === '704w'), 'Retina mobile cards need a 704px option');
  for (const [path, width] of sizes) {
    assert.ok(Number.parseInt(width) <= photo.width, 'Do not upscale the supplied photographs');
    const file = await readFile(new URL('public/' + path, root));
    assert.equal(file.toString('ascii', 0, 4), 'RIFF');
    assert.equal(file.toString('ascii', 8, 12), 'WEBP');
    assert.ok(path.includes(createHash('sha256').update(file).digest('hex').slice(0, 12)));
    assert.ok(file.length < (Number.parseInt(width) <= 480 ? 170 : Number.parseInt(width) <= 800 ? 350 : 700) * 1024, `Image delivery budget: ${path}`);
    for (let offset = 12; offset + 8 <= file.length;) {
      assert.ok(!['EXIF', 'XMP '].includes(file.toString('ascii', offset, offset + 4)), 'Remove private photo metadata');
      const size = file.readUInt32LE(offset + 4); offset += 8 + size + size % 2;
    }
    bytes += file.length;
  }
}
assert.ok(bytes < 12 * 1048576, 'All sizes combined, not the per-page download');
assert.doesNotMatch(gallery, /media\/generated\/gallery-/);
assert.equal(reviews.reviews.length, 3);
assert.ok(reviews.reviews.reduce((sum, review) => sum + review.quote.split(/\s+/).length, 0) <= 25, 'Keep selected Google excerpts brief');
for (const page of ['index.html', 'about/index.html']) {
  const html = await readFile(new URL(page, output), 'utf8');
  assert.equal((html.match(/class="guest-review"/g) ?? []).length, 3);
  for (const review of reviews.reviews) {
    assert.ok(html.includes(review.name) && html.includes(review.quote));
    assert.match(review.sourceUrl, /^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+$/);
    assert.ok(html.includes(`href="${review.sourceUrl}"`));
    assert.equal(review.rating, 5);
  }
  assert.match(html, /not a live review feed/);
  assert.match(html, /25 Oct 2026/);
  assert.doesNotMatch(html, /Rhea Kapoor|Daniel Thomas|Ananya &amp; Karan|Ishaan Shah/);
}
const home = await readFile(new URL('index.html', output), 'utf8');
assert.match(home, /<h1\b[^>]*>The reef<br[^>]*><em[^>]*>starts here\.<\/em><\/h1>/);
assert.match(home, /Scuba diving in Kadmat, Lakshadweep: explore lagoon dives, PADI courses, snorkelling and kayaking with the Scuba Lak island team\./);
for (const page of ['experiences', 'courses', 'contact']) {
  const html = await readFile(new URL(`${page}/index.html`, output), 'utf8');
  assert.match(html, /class="page-hero__photo[^"]*"/);
  assert.match(html, /fetchpriority="high"/);
}
console.log(`Real-content checks passed: 8 supplied photos with native-source responsive sizes (${(bytes / 1048576).toFixed(1)} MB across all sizes), placeholders, focal points, fingerprints, metadata stripping, restored hero and 3 attributed Google excerpts.`);
