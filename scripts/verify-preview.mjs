import assert from 'node:assert/strict';
const base = process.env.PREVIEW_URL ?? 'http://localhost:4004';
for (const path of ['/', '/about', '/courses', '/experiences', '/gallery', '/contact', '/lakshadweep', '/kadmat']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.match(await response.text(), /<app-root/);
}
const video = await fetch(`${base}/media/kadmat-hero.mp4`, { headers: { Range: 'bytes=0-1023' } });
assert.equal(video.status, 206);
assert.equal((await video.arrayBuffer()).byteLength, 1024);
const optimizedHero = await fetch(`${base}/media/hero/kadmat-1129128f8403.mp4`, { method: 'HEAD' });
assert.equal(optimizedHero.status, 200);
assert.match(optimizedHero.headers.get('cache-control') ?? '', /max-age=31536000, immutable/);
assert.equal(optimizedHero.headers.get('content-type'), 'video/mp4');
const logo = await fetch(`${base}/media/scuba-lak-logo-white.png`);
assert.doesNotMatch(logo.headers.get('cache-control') ?? '', /immutable/);
const etag = logo.headers.get('etag');
assert.ok(etag);
await logo.body?.cancel();
assert.equal((await fetch(`${base}/media/scuba-lak-logo-white.png`, { headers: { 'If-None-Match': etag } })).status, 304);
assert.equal((await fetch(`${base}/%ZZ`)).status, 400);
assert.equal((await fetch(`${base}/missing.webp`)).status, 404);
console.log('Preview checks passed: routes, video ranges, cache revalidation, malformed URLs and missing files.');
