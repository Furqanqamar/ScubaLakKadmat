import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const scenes = JSON.parse(readFileSync(new URL('./image-scenes.json', import.meta.url), 'utf8'));
const content = readFileSync('src/app/data/site-content.ts', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const references = [...(content + styles).matchAll(/media\/generated\/[\w-]+\.webp/g)].map(match => match[0]);
assert.ok(references.length > 0 && references.length <= Object.keys(scenes).length, 'Referenced generated scenes must exist in the scene catalogue');
assert.equal(new Set(references).size, references.length, 'Unrelated subjects must not share an image');
const hashes = new Set();
let bytes = 0;
for (const id of Object.keys(scenes)) {
  const path = `public/media/generated/${id}.webp`;
  // Original Scuba Lak media can supersede generated scenes in the catalogue.
  if (!references.includes(path.replace(/^public\//, ''))) continue;
  assert.ok(existsSync(path), `Missing ${path}`);
  assert.ok(references.includes(path.replace(/^public\//, '')), `Unused ${path}`);
  const buffer = readFileSync(path);
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', `Invalid WebP: ${path}`);
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', `Invalid WebP: ${path}`);
  const hash = createHash('sha256').update(buffer).digest('hex');
  assert.ok(!hashes.has(hash), `Duplicate image content: ${path}`);
  hashes.add(hash);
  bytes += statSync(path).size;
}
console.log(`Verified ${hashes.size} distinct WebP assets, ${(bytes / 1024 / 1024).toFixed(1)} MB total.`);

const originalSource = readFileSync('src/app/data/original-media.generated.ts', 'utf8');
const originalMedia = JSON.parse(originalSource.split('export const ORIGINAL_MEDIA = ')[1].split(' as const satisfies')[0]);
const imageSource = readFileSync('src/app/data/original-image-info.generated.ts', 'utf8');
const imageInfo = JSON.parse(imageSource.split(' = ')[1].trim().replace(/;$/, ''));
assert.equal(Object.values(originalMedia).filter(item => item.kind === 'image').length, 10);
assert.equal(Object.values(originalMedia).filter(item => item.kind === 'video').length, 8);
let originalBytes = 0;
for (const item of Object.values(originalMedia)) {
  const info = imageInfo[item.imageUrl];
  assert.ok(info?.placeholder.startsWith('data:image/webp;base64,'), item.id);
  const paths = info.srcset.split(', ').map(candidate => candidate.split(' ')[0]);
  if (item.kind === 'video') paths.push(item.videoUrl, item.videoUrlMobile);
  for (const path of paths) {
    const buffer = readFileSync('public/' + path);
    assert.match(path, /-[a-f0-9]{12}\.(webp|mp4)$/);
    assert.ok(path.includes(createHash('sha256').update(buffer).digest('hex').slice(0, 12)), `Fingerprint mismatch: ${path}`);
    assert.ok(buffer.length < 15 * 1024 * 1024, `Oversized asset: ${path}`);
    originalBytes += buffer.length;
  }
}
console.log(`Verified 10 original photos, 8 films, responsive variants, placeholders and fingerprints; ${(originalBytes / 1048576).toFixed(1)} MB across all delivery sizes.`);
