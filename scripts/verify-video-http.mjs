import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const base = process.argv[2];
if (!base || !/^https?:\/\//.test(base) || !base.endsWith('/')) throw Error('Provide an http(s) base URL ending with /');
const directory = resolve(process.argv[3] ?? 'dist/scuba-lak/browser');
const source = await readFile(resolve(directory, '_worker.js'), 'utf8');
const files = JSON.parse(source.match(/export default createVideoDelivery\((\{[^\n]+\})\);/)[1]);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const get = (path, options = {}) => fetch(new URL(path.slice(1), base), { ...options, signal: AbortSignal.timeout(30000) });
let ranges = 0, fullFiles = 0;
for (const [path, size] of Object.entries(files)) {
  const expected = await readFile(resolve(directory, '.' + path));
  for (const [range, start, end] of [['bytes=0-1', 0, 1], ['bytes=-32', size - 32, size - 1], ['bytes=1000-1063', 1000, 1063]]) {
    const response = await get(path, { headers: { Range: range } });
    assert.equal(response.status, 206, `${path}: ${range}`);
    assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${size}`);
    assert.equal(response.headers.get('Content-Length'), String(end - start + 1));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.subarray(start, end + 1));
    ranges++;
  }
  const invalid = await get(path, { headers: { Range: `bytes=${size}-` } });
  assert.equal(invalid.status, 416); assert.equal(invalid.headers.get('Content-Range'), `bytes */${size}`);
  await invalid.arrayBuffer();
  if (path.startsWith('/media/hero/') || !fullFiles) {
    const response = await get(path); assert.equal(response.status, 200);
    assert.equal(digest(Buffer.from(await response.arrayBuffer())), digest(expected), 'Never alter the approved video bytes');
    fullFiles++;
  }
}
const home = await get('/'); assert.equal(home.status, 200); assert.match(await home.text(), /<app-root/);
const missing = await get('/this-page-does-not-exist/'); assert.equal(missing.status, 404);
console.log(`Video HTTP checks passed at ${base}: ${ranges} exact byte ranges, ${Object.keys(files).length} unsatisfiable ranges, ${fullFiles} byte-identical full files and unchanged HTML/404 routing.`);
