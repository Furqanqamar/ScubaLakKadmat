import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const generated = await readFile(new URL('src/app/data/brand-assets.generated.ts', root), 'utf8');
const assets = JSON.parse(generated.match(/BRAND_ASSETS = ([\s\S]*?) as const;/)[1]);
const directory = new URL('public/media/brand/', root);

// Small PNG decoder for round-corner checks; no extra runtime/test dependency.
function pngPixels(png) {
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  assert.equal(png[24], 8, 'Use 8-bit channels');
  assert.equal(png[25], 6, 'Icons must have RGBA transparency');
  assert.equal(png[28], 0, 'Use non-interlaced PNG');
  const parts = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset), type = png.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') parts.push(png.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(parts));
  const stride = width * 4, pixels = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const p = a + b - c, x = Math.abs(p - a), y = Math.abs(p - b), z = Math.abs(p - c);
    return x <= y && x <= z ? a : y <= z ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    assert.ok(filter >= 0 && filter <= 4);
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x;
      const a = x >= 4 ? pixels[index - 4] : 0;
      const b = y ? pixels[index - stride] : 0;
      const c = x >= 4 && y ? pixels[index - stride - 4] : 0;
      const predictor = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      pixels[index] = (raw[y * (stride + 1) + 1 + x] + predictor) & 255;
    }
  }
  return { width, height, pixels };
}

let total = 0;
for (const file of await readdir(directory)) {
  const data = await readFile(new URL(file, directory));
  total += data.length;
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
  assert.ok(file.includes(`-${hash}.`), `Cache fingerprint must match ${file}`);
  if (file.endsWith('.ico')) {
    assert.equal(data.readUInt16LE(2), 1);
    assert.equal(data.readUInt16LE(4), 3);
    for (let index = 0; index < 3; index++) {
      const position = 6 + index * 16;
      assert.equal(data[position], [16, 32, 48][index]);
      const size = data.readUInt32LE(position + 8), offset = data.readUInt32LE(position + 12);
      assert.equal(pngPixels(data.subarray(offset, offset + size)).width, data[position]);
    }
    continue;
  }
  const { width, height, pixels } = pngPixels(data);
  assert.equal(width, Number(file.match(/round-(\d+)-/)[1]));
  assert.equal(width, height);
  for (const [x, y] of [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]]) {
    assert.equal(pixels[(y * width + x) * 4 + 3], 0, `${file}: corners must be transparent, not square white`);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const radius = Math.hypot(x + .5 - width / 2, y + .5 - height / 2);
      const alpha = pixels[(y * width + x) * 4 + 3];
      if (radius > width / 2 + 1) assert.equal(alpha, 0, `${file}: pixels outside the circle`);
      if (radius < width / 2 - 2) assert.equal(alpha, 255, `${file}: white badge must stay opaque`);
    }
  }
  if (width === 96) assert.ok(data.length < 16000, 'Header logo must stay small');
  if (width === 192) assert.ok(data.length < 45000, 'Retina logo must stay small');
}
assert.ok(total < 360000, 'Do not ship the full-resolution upload');
for (const [role, path] of Object.entries(assets)) {
  if (role !== 'logoSrcset') await readFile(new URL(path, output));
}

const manifest = JSON.parse(await readFile(new URL('site.webmanifest', output), 'utf8'));
assert.deepEqual(manifest.icons.map(icon => [icon.src, icon.sizes]), [[assets.appIcon192, '192x192'], [assets.appIcon512, '512x512']]);
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
for (const url of urls) {
  const path = new URL(url).pathname.replace(/^\/(?:ScubaLakKadmat\/)?/, '');
  const html = await readFile(new URL(`${path}index.html`, output), 'utf8');
  const logos = [...html.matchAll(/<img\b[^>]*class="brand-lockup__logo"[^>]*>/g)];
  assert.equal(logos.length, 2, `${path}: header and footer must share the new logo`);
  for (const [logo] of logos) {
    assert.ok(logo.includes(`src="${assets.logoSrc}"`));
    assert.ok(logo.includes(`srcset="${assets.logoSrcset}"`));
    assert.match(logo, /sizes="48px"/);
    assert.match(logo, /width="48"/);
    assert.match(logo, /height="48"/);
  }
  for (const asset of [assets.faviconSrc, assets.favicon96, assets.faviconIco, assets.appleTouchIcon]) {
    assert.ok(html.includes(`href="${asset}"`), `${path}: missing browser/app icon ${asset}`);
  }
  const graph = JSON.parse(html.match(/<script[^>]+id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.find(item => item['@type'] === 'LocalBusiness').logo.endsWith(assets.organizationLogo));
  assert.doesNotMatch(html, /media\/scuba-lak-logo(?:-white)?\.png/, 'Old artwork must not remain in displayed logos or browser/SEO metadata');
}
console.log(`Brand checks passed: circular PNG/ICO transparency, fingerprints, responsive header/footer artwork and browser/app/SEO icons on ${urls.length} pages.`);
