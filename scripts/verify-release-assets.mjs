import assert from 'node:assert/strict';
import { readFile, readdir, stat, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pruneReleaseMedia, referencedMedia } from './release-assets.mjs';

const output = resolve(process.argv[2] ?? 'dist/scuba-lak/browser');
const { paths, referenced } = await referencedMedia(output);
const media = paths.filter(path => path.startsWith('media/'));
assert.equal(media.length, referenced.size, 'Release contains referenced media only');
let bytes = 0;
for (const path of media) {
  const [source, built] = await Promise.all([readFile(resolve('public', path)), readFile(resolve(output, path))]);
  assert.equal(createHash('sha256').update(built).digest('hex'), createHash('sha256').update(source).digest('hex'), path);
  bytes += built.length;
}
const backup = JSON.parse(await readFile('scripts/hero-video-backup.json', 'utf8'));
for (const path of [backup.desktop.mp4, backup.desktop.webm, backup.mobile.mp4, backup.mobile.webm, backup.poster, backup.socialPoster]) {
  assert.ok((await stat(resolve('public', path))).isFile(), 'Keep the original hero backup');
  assert.ok(!paths.includes(path), 'Backups must not be published');
}
for (const path of ['fonts/inter-OFL.txt', 'fonts/playfairdisplay-OFL.txt', 'fonts/permanent-marker-LICENSE.txt', 'licenses/fontawesome.txt', '3rdpartylicenses.txt']) {
  assert.ok((await stat(resolve(output, path))).isFile(), `Keep licence notice: ${path}`);
}
assert.ok(!paths.some(path => /(?:^|\/)(?:tmp|output|docs|reports|node_modules)(?:\/|$)|\.map$|(?:^|\/)\.env/.test(path)), 'No development files in the release');
assert.ok(!paths.some(path => / \d+\.[^/]+$|\.(?:bak|old|orig)$/.test(path)), 'No duplicate or backup copies in the release');
for (const path of paths.filter(path => /^main-[\w-]+\.js$/.test(path) || /^chunk-[\w-]+\.js$/.test(path))) {
  assert.doesNotMatch(await readFile(resolve(output, path), 'utf8'), /sourceSha256|sourceName|scuba-lak-hero-preview|\.codex\//, 'Keep production assets separate from preparation history');
}
const fixture = await mkdtemp(resolve(tmpdir(), 'scuba-release-assets-'));
try {
  await mkdir(resolve(fixture, 'media/generated'), { recursive: true });
  await writeFile(resolve(fixture, 'index.html'), '<img src="media/generated/active.webp">');
  await writeFile(resolve(fixture, 'main-fixture.js'), '');
  for (const name of ['active.webp', 'active-480.webp', 'active-800.webp', 'unused.webp']) await writeFile(resolve(fixture, 'media/generated', name), name);
  const result = await pruneReleaseMedia(fixture);
  assert.deepEqual(result.removed.map(item => item.path), ['media/generated/unused.webp']);
  assert.equal((await readdir(resolve(fixture, 'media/generated'))).length, 3, 'Keep dynamically derived responsive candidates');
  await writeFile(resolve(fixture, 'index.html'), '<img src="/ScubaLakKadmat/media/generated/active.webp">');
  assert.equal((await pruneReleaseMedia(fixture)).removedFiles, 0, 'Subfolder deployments retain their media');
  await writeFile(resolve(fixture, 'index.html'), '<img src="media/generated/missing.webp">');
  await assert.rejects(pruneReleaseMedia(fixture), /Missing release media/, 'Missing references fail before any removal');
} finally { await rm(fixture, { recursive: true, force: true }); }
console.log(`Release checks passed: ${media.length} referenced media files (${(bytes / 1048576).toFixed(1)} MB), exact source bytes, source backups retained, licences present and no preparation metadata or development files.`);
