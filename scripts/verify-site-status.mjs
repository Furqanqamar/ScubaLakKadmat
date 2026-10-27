import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { once } from 'node:events';
import { resolve, dirname } from 'node:path';
import { applySiteMode, safeOutputPath } from './site-status-lib.mjs';
import { mayRefreshStatus, validateSiteStatus, whatsappUrl } from '../public/status-pages/status-config.mjs';

const output = resolve('dist/scuba-lak/browser');
const config = validateSiteStatus(JSON.parse(await readFile('public/site-status.json', 'utf8')));
const manifest = JSON.parse(await readFile(resolve(output, 'site-release.json'), 'utf8'));
const base = manifest.base;
const css = await readFile('public/status-pages/holding.css', 'utf8');
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /focus-visible/);
assert.match(css, /min-height: 44px/);
assert.throws(() => validateSiteStatus({ ...config, mode: 'unknown' }));
assert.throws(() => validateSiteStatus({ ...config, contact: { ...config.contact, whatsapp: [] } }));
assert.throws(() => validateSiteStatus({ ...config, contact: { ...config.contact, instagram: 'javascript:alert(1)' } }));
assert.throws(() => safeOutputPath(output, '../outside.html'));
assert.equal(new URL(whatsappUrl('919447982559', 'Hello & blue 🌊')).searchParams.get('text'), 'Hello & blue 🌊');
assert.equal(mayRefreshStatus(null, 'live', 1000), true);
assert.equal(mayRefreshStatus({ mode: 'live', at: 1000 }, 'live', 2000), false, 'Stale CDN HTML must not cause a reload loop');
assert.equal(mayRefreshStatus({ mode: 'live', at: 1000 }, 'live', 61000), true);
assert.equal(mayRefreshStatus({ mode: 'live', at: 1000 }, 'maintenance', 2000), true);
const module = await readFile('public/status-pages/holding.mjs', 'utf8');
assert.doesNotMatch(module, /innerHTML|eval\(/, 'Copy must be inserted as plain text');
assert.match(module, /cache: 'no-store'/);
assert.match(module, /if \(!gated \|\| stopped \|\| document.hidden\) return/);
assert.match(module, /location\.reload\(\)/, 'A gated deep link should reopen itself after mode changes');
const workflow = await readFile('.github/workflows/site-mode.yml', 'utf8');
assert.doesNotMatch(workflow, /npm ci|npm run build|ng build/);
assert.match(workflow, /download-artifact/);
assert.match(workflow, /compareCommitsWithBasehead/);
assert.match(workflow, /head_branch !== branch/);

const sceneHashes = { 'coming-soon': '9b332d1c1517', maintenance: '19069de94e5c' };
for (const mode of ['coming-soon', 'maintenance']) {
  const html = await readFile(resolve(output, mode, 'index.html'), 'utf8');
  assert.ok(html.includes(`<base href="${base}">`), 'Standalone base must match the app deployment');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.match(html, /class="status-intro"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /fetchpriority="high"/);
  assert.doesNotMatch(html, /<app-root|routerLink|<form\b|countdown|<nav\b|main-[A-Z0-9]+\.js/i);
  for (const phone of config.contact.whatsapp) assert.ok(html.includes(`https://wa.me/${phone.number}`));
  for (const width of [800, 1280, 1672]) assert.ok((await stat(resolve(output, `media/illustrations/${mode}-${width}-${sceneHashes[mode]}.webp`))).size < 180_000);
}
assert.doesNotMatch(await readFile(resolve(output, 'sitemap.xml'), 'utf8'), /\/(coming-soon|maintenance)\//);

await mkdir('tmp', { recursive: true });
const fixture = await mkdtemp(resolve('tmp/status-mode-test-'));
let server;
let lines;
try {
  const exported = spawnSync(process.execPath, ['scripts/export-status-pages.mjs', resolve(fixture, 'exports')], { encoding: 'utf8' });
  assert.equal(exported.status, 0, exported.stderr);
  for (const mode of ['coming-soon', 'maintenance']) {
    const directory = resolve(fixture, 'exports', mode);
    const html = await readFile(resolve(directory, 'index.html'), 'utf8');
    assert.match(html, /href="\.\/#main-content"/);
    assert.equal(JSON.parse(await readFile(resolve(directory, 'site-status.json'), 'utf8')).mode, mode);
    for (const match of html.matchAll(/(?:src|href)="((?:media|status-pages)\/[^\"]+)"/g)) await stat(resolve(directory, match[1]));
    assert.doesNotMatch(html, /<app-root/);
  }
  const originals = new Map();
  for (const path of manifest.documents) {
    const html = await readFile(safeOutputPath(output, path), 'utf8');
    originals.set(path, html);
    await mkdir(dirname(safeOutputPath(fixture, path)), { recursive: true });
    await writeFile(safeOutputPath(fixture, path), html);
  }
  for (const path of ['coming-soon', 'maintenance', 'status-pages', 'site-release.json', 'site-status.json']) await cp(resolve(output, path), resolve(fixture, path), { recursive: true });
  server = spawn(process.execPath, ['scripts/preview-server.mjs'], { env: { ...process.env, PORT: '0', PREVIEW_OUTPUT: fixture, PREVIEW_BASE_PATH: base }, stdio: ['ignore', 'pipe', 'pipe'] });
  lines = createInterface({ input: server.stdout });
  const origin = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 10000);
    lines.on('line', line => { const url = line.match(/Production preview: (http:\/\/localhost:\d+\/)/)?.[1]; if (url) { clearTimeout(timeout); resolve(url); } });
    server.once('error', error => { clearTimeout(timeout); reject(error); });
  });
  const restore = async () => { for (const [path, html] of originals) await writeFile(safeOutputPath(fixture, path), html); };
  for (const mode of ['coming-soon', 'maintenance', 'live', 'maintenance', 'live']) {
    await restore();
    const changed = await applySiteMode(fixture, { ...config, mode });
    assert.equal(changed.documents, manifest.documents.length);
    for (const path of ['', 'gallery/', 'courses/open-water-diver/', 'unknown/deep/link']) {
      const response = await fetch(`${origin}${base.slice(1)}${path}`, { headers: { Accept: 'text/html' } });
      const html = await response.text();
      if (mode === 'live') {
        assert.equal(response.status, path.startsWith('unknown') ? 404 : 200);
        assert.doesNotMatch(html, /data-site-gated="true"/);
        assert.match(html, /<app-root/);
      } else {
        assert.equal(response.status, mode === 'maintenance' ? 503 : 200);
        assert.match(html, new RegExp(`data-status-page="${mode}"`));
        assert.match(html, /data-site-gated="true"/);
        assert.doesNotMatch(html, /<app-root/);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        if (mode === 'maintenance') assert.equal(response.headers.get('retry-after'), '300');
      }
    }
    for (const standalone of ['coming-soon', 'maintenance']) {
      const response = await fetch(`${origin}${base.slice(1)}${standalone}/`);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(`data-status-page="${standalone}"`), 'Both standalone previews remain accessible in every mode');
    }
    assert.match((await fetch(`${origin}${base.slice(1)}status-pages/holding.mjs`)).headers.get('content-type'), /javascript/);
    assert.equal((await fetch(`${origin}${base.slice(1)}site-status.json`)).headers.get('cache-control'), 'no-store');
    if (mode !== 'live') await assert.rejects(() => applySiteMode(fixture, { ...config, mode: 'live' }), /clean release/);
  }
  for (const [path, html] of originals) assert.equal(await readFile(safeOutputPath(fixture, path), 'utf8'), html, 'Returning to live preserves each original document byte-for-byte');
  console.log(`Site status checks passed: two independent pages, responsive artwork, both contacts, safe editable copy, no fake countdown, first-paint/no-JS fallbacks, reduced motion, five build-free switches across all ${manifest.documents.length} documents, deep-link coverage and byte-exact live restoration (${base}).`);
} finally {
  lines?.close();
  if (server && server.exitCode === null) { server.kill(); await once(server, 'exit'); }
  await rm(fixture, { recursive: true, force: true });
}
