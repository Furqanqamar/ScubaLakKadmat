import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const generated = await readFile(new URL('src/app/data/hero-media.generated.ts', root), 'utf8');
const media = JSON.parse(generated.match(/HERO_MEDIA = ([\s\S]*?) as const;/)[1]);
const backup = JSON.parse(await readFile(new URL('scripts/hero-video-backup.json', root), 'utf8'));
const output = new URL('dist/scuba-lak/browser/', root);
const html = await readFile(new URL('index.html', output), 'utf8');

function boxes(data) {
  const result = [];
  for (let offset = 0; offset + 8 <= data.length;) {
    let length = data.readUInt32BE(offset), header = 8;
    if (length === 1) { length = Number(data.readBigUInt64BE(offset + 8)); header = 16; }
    if (length === 0) length = data.length - offset;
    assert.ok(length >= header && offset + length <= data.length, 'Valid MP4 box boundaries');
    result.push({ type: data.toString('ascii', offset + 4, offset + 8), offset, data: data.subarray(offset + header, offset + length) });
    offset += length;
  }
  return result;
}
const box = (data, type) => { const found = boxes(data).find(item => item.type === type); assert.ok(found, `Missing MP4 ${type}`); return found.data; };
function verifyMp4(data, variant, expectedDuration) {
  const top = boxes(data), moov = top.find(item => item.type === 'moov');
  assert.ok(moov && moov.offset < top.find(item => item.type === 'mdat').offset, 'MP4 metadata must precede video bytes for fast start');
  const tracks = boxes(moov.data).filter(item => item.type === 'trak');
  assert.equal(tracks.length, 1, 'Exactly one video track, with no audio');
  assert.equal(box(box(tracks[0].data, 'mdia'), 'hdlr').toString('ascii', 8, 12), 'vide');
  const header = box(tracks[0].data, 'tkhd');
  assert.equal(header.readUInt32BE(header.length - 8) / 65536, variant.width);
  assert.equal(header.readUInt32BE(header.length - 4) / 65536, variant.height);
  assert.deepEqual(Array.from({ length: 9 }, (_, index) => header.readInt32BE(header.length - 44 + index * 4)), [65536, 0, 0, 0, 65536, 0, 0, 0, 1073741824], 'Rotation must be baked into the pixels, without leftover display rotation');
  assert.ok(tracks[0].data.includes(Buffer.from('avc1')), 'H.264 MP4 fallback');
  const movie = box(moov.data, 'mvhd');
  const scale = movie.readUInt32BE(movie[0] === 1 ? 20 : 12);
  const duration = movie[0] === 1 ? Number(movie.readBigUInt64BE(24)) : movie.readUInt32BE(16);
  assert.ok(Math.abs(duration / scale - expectedDuration) < .1, 'Preserve the complete approved clip');
}
function ebmlElements(data) {
  const result = [];
  for (let offset = 0; offset < data.length;) {
    let idLength = 1, marker = 128;
    while (!(data[offset] & marker) && idLength < 4) { idLength++; marker >>= 1; }
    const id = data.readUIntBE(offset, idLength);
    let sizeOffset = offset + idLength, sizeLength = 1;
    marker = 128;
    while (!(data[sizeOffset] & marker) && sizeLength < 8) { sizeLength++; marker >>= 1; }
    let size = BigInt(data[sizeOffset] & (marker - 1));
    for (let index = 1; index < sizeLength; index++) size = size * 256n + BigInt(data[sizeOffset + index]);
    const start = sizeOffset + sizeLength;
    const end = size === (1n << BigInt(7 * sizeLength)) - 1n ? data.length : start + Number(size);
    assert.ok(end > offset && end <= data.length, 'Valid WebM element boundaries');
    result.push({ id, data: data.subarray(start, end) });
    offset = end;
  }
  return result;
}
const element = (data, id) => { const found = ebmlElements(data).find(item => item.id === id); assert.ok(found, `Missing WebM element ${id}`); return found.data; };
function verifyWebm(data, variant, expectedDuration) {
  const segment = element(data, 0x18538067);
  const info = element(segment, 0x1549a966);
  const duration = element(info, 0x4489);
  const durationValue = duration.length === 8 ? duration.readDoubleBE(0) : duration.readFloatBE(0);
  const scaleElement = ebmlElements(info).find(item => item.id === 0x2ad7b1)?.data;
  const scale = scaleElement ? scaleElement.readUIntBE(0, scaleElement.length) : 1000000;
  assert.ok(Math.abs(durationValue * scale / 1e9 - expectedDuration) < .1, 'WebM must retain the complete approved clip');
  const tracks = element(segment, 0x1654ae6b);
  const entries = ebmlElements(tracks).filter(item => item.id === 0xae);
  assert.equal(entries.length, 1, 'WebM must not contain an audio track');
  assert.equal(element(entries[0].data, 0x83)[0], 1);
  assert.equal(element(entries[0].data, 0x86).toString(), 'V_VP9');
  const video = element(entries[0].data, 0xe0);
  for (const [id, expected] of [[0xb0, variant.width], [0xba, variant.height]]) {
    const value = element(video, id);
    assert.equal(value.readUIntBE(0, value.length), expected);
  }
}

assert.equal(media.rotation, 'already landscape; no additional rotation');
assert.equal(media.sourceName, 'scuba-lak-hero-preview-v2-clean.mp4');
assert.match(media.sourceSha256, /^[a-f0-9]{64}$/);
assert.ok(Math.abs(media.duration - 41.033333) < .001, 'Use the full approved watermark-cleaned edit');
assert.equal(media.frameRate, '30/1');
assert.deepEqual([media.desktop.width, media.desktop.height], [1280, 720]);
assert.deepEqual([media.mobile.width, media.mobile.height], [720, 720]);
for (const id of ['desktop', 'mobile']) {
  for (const extension of ['mp4', 'webm']) {
    const path = media[id][extension];
    const data = await readFile(new URL('public/' + path, root));
    assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)), 'Fingerprint must match the video bytes');
    assert.ok(data.length < media.sourceBytes * (id === 'desktop' ? .8 : .5), 'Delivery videos must be materially smaller than the upload');
    const budget = { desktop: { mp4: 13, webm: 9 }, mobile: { mp4: 7.5, webm: 5.5 } };
    assert.ok(data.length < budget[id][extension] * 1048576, 'Keep each responsive delivery version within its loading budget');
    if (extension === 'mp4') verifyMp4(data, media[id], media.duration); else verifyWebm(data, media[id], media.duration);
    assert.ok(html.includes(`src="${path}"`));
    await readFile(new URL(path, output));
  }
}
assert.equal(backup.duration, 35.166667);
assert.equal(backup.rotation, '90 degrees anticlockwise');
for (const id of ['desktop', 'mobile']) {
  for (const extension of ['mp4', 'webm']) {
    const path = backup[id][extension];
    assert.match(path, /^media\/hero\/kadmat-original-backup-/, 'Give the original video a clearly different backup filename');
    const data = await readFile(new URL('public/' + path, root));
    assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)), 'Keep the original backup bytes unchanged');
    assert.notEqual(path, media[id][extension]);
    assert.ok(!html.includes(path), 'The backup must not be preloaded or used as a second hero');
    if (extension === 'mp4') verifyMp4(data, backup[id], backup.duration); else verifyWebm(data, backup[id], backup.duration);
    await readFile(new URL(path, output));
  }
}
for (const path of [backup.poster, backup.socialPoster]) {
  assert.match(path, /^media\/hero\/kadmat-original-backup-poster-/);
  const data = await readFile(new URL('public/' + path, root));
  assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)), 'Retain the original poster backups unchanged');
}
const sources = [...html.matchAll(/<source\b[^>]*>/g)].map(item => item[0]);
assert.equal(sources.length, 4, 'Offer mobile/desktop WebM with MP4 fallbacks');
for (const source of sources.slice(0, 2)) assert.match(source, /media="\(max-width: 767px\)"/);
for (const source of sources.slice(2)) assert.doesNotMatch(source, /\smedia=/);
for (const path of [media.poster, media.socialPoster]) {
  const data = await readFile(new URL('public/' + path, root));
  assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0, 12)));
  assert.ok(data.length < 200000, 'Keep the loading poster lightweight');
}
assert.ok(html.includes(`poster="${media.poster}"`));
assert.ok(html.includes(`href="${media.poster}"`));
assert.ok(html.includes(`src="${media.poster}"`));
assert.ok(html.includes(`ScubaLakKadmat/${media.socialPoster}`));
const video = html.match(/<video\b[^>]*>/)[0];
for (const attribute of ['autoplay', 'muted', 'loop', 'playsinline']) assert.match(video, new RegExp(`\\b${attribute}(?:[\\s=>])`));
assert.doesNotMatch(video, /\bcontrols(?:[\s=>])/);
assert.match(html, /The reef<br[^>]*><em[^>]*>starts here\./);
assert.doesNotMatch(html, /media\/kadmat-hero|kadmat-1129128f8403|kadmat-17a4a11379a9/);
console.log('Hero video checks passed: approved 41-second cleaned edit, silent H.264/VP9, correct landscape orientation, responsive delivery budgets, fast-start MP4, matching poster and unchanged autoplay/caption; original 35-second hero retained as an unloaded, byte-verified backup.');
