import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createVideoDelivery } from '../services/video-delivery/worker.mjs';

const bytes = Uint8Array.from({ length: 1027 }, (_, index) => index % 251);
const path = '/media/hero/test-0123456789ab.mp4';
let calls = 0;
const worker = createVideoDelivery({ [path]: bytes.length });
const env = { ASSETS: { async fetch(request) {
  calls++;
  assert.equal(request.headers.get('Range'), null);
  if (new URL(request.url).pathname !== path) return new Response('Not found', { status: 404 });
  if (request.headers.get('If-None-Match') === '"test"') return new Response(null, { status: 304 });
  let offset = 0;
  const body = new ReadableStream({ pull(controller) {
    if (offset === bytes.length) { controller.close(); return; }
    const end = Math.min(offset + 17, bytes.length);
    controller.enqueue(bytes.slice(offset, end)); offset = end;
  } });
  return new Response(request.method === 'HEAD' ? null : body, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(bytes.length), ETag: '"test"' } });
} } };
async function request(range, headers = {}, method = 'GET') {
  return worker.fetch(new Request('https://www.scubalak.com' + path, { method, headers: { ...(range ? { Range: range } : {}), ...headers } }), env);
}
for (const [range, start, end] of [['bytes=0-1', 0, 1], ['bytes=16-35', 16, 35], ['bytes=1000-', 1000, 1026], ['bytes=-23', 1004, 1026], ['bytes=1020-99999', 1020, 1026], ['bytes=-99999', 0, 1026]]) {
  const response = await request(range);
  assert.equal(response.status, 206, range);
  assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${bytes.length}`);
  assert.equal(response.headers.get('Content-Length'), String(end - start + 1));
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.slice(start, end + 1));
}
for (const range of ['bytes=1027-', 'bytes=40-10', 'bytes=-0']) {
  const response = await request(range); assert.equal(response.status, 416);
  assert.equal(response.headers.get('Content-Range'), 'bytes */1027'); assert.equal(await response.text(), '');
}
for (const range of [null, 'bytes=1-2,4-5', 'items=0-1', 'bytes=-', 'bytes=' + '9'.repeat(200) + '-']) {
  const response = await request(range); assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
}
for (const validator of ['"changed"', 'W/"test"']) {
  const response = await request('bytes=0-1', { 'If-Range': validator });
  assert.equal(response.status, 200); await response.body.cancel();
}
assert.equal((await request('bytes=0-1', { 'If-Range': '"test"' })).status, 206);
assert.equal((await request('bytes=0-1', { 'If-None-Match': '"test"' })).status, 304);
const head = await request('bytes=0-1', {}, 'HEAD'); assert.equal(head.status, 200); assert.equal(await head.text(), '');
assert.equal(head.headers.get('Accept-Ranges'), 'bytes'); assert.equal(head.headers.get('Content-Length'), '1027');
assert.equal((await worker.fetch(new Request('https://www.scubalak.com/missing'), env)).status, 404);
assert.ok(calls > 10);

const directory = resolve(process.argv[2] ?? 'dist/scuba-lak/browser');
const routes = JSON.parse(await readFile(resolve(directory, '_routes.json'), 'utf8'));
const source = await readFile(resolve(directory, '_worker.js'), 'utf8');
const files = JSON.parse(source.match(/export default createVideoDelivery\((\{[^\n]+\})\);/)[1]);
assert.deepEqual(routes, { version: 1, include: Object.keys(files), exclude: [] });
assert.ok(routes.include.length >= 4 && routes.include.length <= 100);
for (const [path, size] of Object.entries(files)) {
  assert.match(path, /^\/media\/(hero|originals)\/[\w-]+-[a-f0-9]{12}\.(mp4|webm)$/);
  assert.equal((await stat(resolve(directory, '.' + path))).size, size);
}
console.log(`Video delivery checks passed: exact streamed ranges, suffix/open-ended ranges, 416, validators, HEAD and ${routes.include.length} video-only production routes.`);
