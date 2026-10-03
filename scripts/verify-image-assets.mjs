import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const scenes = JSON.parse(readFileSync(new URL('./image-scenes.json', import.meta.url), 'utf8'));
const content = readFileSync('src/app/data/site-content.ts', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const references = [...(content + styles).matchAll(/media\/generated\/[\w-]+\.webp/g)].map(match => match[0]);
assert.equal(references.length, Object.keys(scenes).length, 'Every scene must have exactly one content or banner mapping');
assert.equal(new Set(references).size, references.length, 'Unrelated subjects must not share an image');
const hashes = new Set();
let bytes = 0;
for (const id of Object.keys(scenes)) {
  const path = `public/media/generated/${id}.webp`;
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
