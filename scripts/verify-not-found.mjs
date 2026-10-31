import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { once } from 'node:events';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const html = await readFile(new URL('404.html', output), 'utf8');
assert.equal(html, await readFile(new URL('404/index.html', output), 'utf8'), 'Host fallback must contain the complete prerendered page');
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.match(html, /Lost in<br[^>]*><em[^>]*>the blue\.<\/em>/);
assert.match(html, /name="robots" content="noindex, follow"/);
assert.match(html, /data-page-hero/);
const image = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('lost-sea__image'));
assert.ok(image, 'The generated illustration must be prerendered');
assert.match(image, /loading="eager"/);
assert.match(image, /fetchpriority="high"/);
assert.match(html, /Back to the surface/);
assert.match(html, /Explore Kadmat/);
assert.doesNotMatch(await readFile(new URL('sitemap.xml', output), 'utf8'), /\/404(?:\/|<)/);
const css = await readFile(new URL('src/app/pages/not-found/not-found.component.css', root), 'utf8');
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /animation: none/);
assert.match(css, /:focus-visible/);
for (const width of [800, 1280, 1672]) {
  const filename = `media/illustrations/lost-in-the-blue-${width}-61cd6283243c.webp`;
  assert.ok(html.includes(filename), `${width}px responsive image is in the document`);
  assert.ok((await stat(new URL(filename, output))).size < 300_000, `${width}px export must stay lightweight`);
}

const base = html.match(/<base href="([^"]+)"/)?.[1] ?? '/';
const server = spawn(process.execPath, ['scripts/preview-server.mjs'], { cwd: root, env: { ...process.env, PORT: '0', PREVIEW_BASE_PATH: base }, stdio: ['ignore', 'pipe', 'pipe'] });
const lines = createInterface({ input: server.stdout });
try {
  const origin = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server startup timed out')), 10_000);
    lines.on('line', line => {
      const url = line.match(/Production preview: (http:\/\/localhost:\d+\/)/)?.[1];
      if (url) { clearTimeout(timer); resolve(url); }
    });
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Preview server exited: ${code}`)); });
  });
  for (const path of ['lost-in-the-sea', 'some/very/deep/wrong/path', 'courses/not-a-course', 'experiences/not-an-activity', 'lakshadweep/not-an-island', 'missing.html', 'missing.with.dots']) {
    const response = await fetch(`${origin}${base.slice(1)}${path}`, { headers: { Accept: 'text/html' } });
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get('location'), null, 'Do not turn missing pages into redirects or soft 404s');
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /class="lost-sea"/, path);
  }
  const missingAsset = await fetch(`${origin}${base.slice(1)}media/no-such-photo.webp`, { headers: { Accept: 'image/webp' } });
  assert.equal(missingAsset.status, 404);
  assert.match(missingAsset.headers.get('content-type'), /text\/plain/, 'Missing assets must not receive an HTML document');
  const existing = await fetch(`${origin}${base.slice(1)}kadmat/`);
  assert.equal(existing.status, 200, 'Valid pages retain their successful status');
  console.log(`Creative 404 checks passed: responsive illustration, reduced motion, accessible controls, noindex, seven HTTP 404 paths and valid-page/asset handling (${base}).`);
} finally {
  lines.close();
  server.kill();
  await once(server, 'exit');
}
