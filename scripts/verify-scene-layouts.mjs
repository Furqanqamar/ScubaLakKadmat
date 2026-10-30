import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const holding = await readFile('public/status-pages/holding.css', 'utf8');
const lost = await readFile('src/app/pages/not-found/not-found.component.css', 'utf8');
for (const css of [holding, lost]) {
  assert.match(css, /min-height: 100svh; min-height: 100dvh/, 'Scenes follow the available screen height');
  assert.doesNotMatch(css, /min-height:\s*max\(\d+px,\s*100svh\)/, 'No forced 760–980px canvas on shorter screens');
  assert.doesNotMatch(css, /padding[^;]*\b(?:320|360|420)px/, 'Do not reserve an extra off-screen illustration area on mobile');
  assert.doesNotMatch(css, /(?:html|body)\s*\{[^}]*overflow\s*:\s*(?:hidden|clip)/, 'Zoomed text and unusually long configured copy must remain scrollable, not be cut off');
  assert.match(css, /@media \(max-height: 500px\) and \(min-width: 560px\)/, 'Short landscape screens have a compact layout');
  assert.match(css, /min-height: 44px/, 'Keep usable touch targets');
  assert.match(css, /prefers-reduced-motion: reduce/);
}
assert.match(holding, /\.holding__main[^}]*padding: clamp/, 'Space around the story responds to viewport height');
assert.match(holding, /\.holding__contacts[^}]*flex-wrap: wrap/, 'Contacts can wrap rather than overflow when text is enlarged');

const output = 'dist/scuba-lak/browser/';
const notFound = await readFile(output + '404/index.html', 'utf8');
assert.doesNotMatch(notFound, /<app-(?:site-footer|breadcrumbs|floating-navigator)\b/, 'The immersive 404 must not add the normal full-site footer below its scene');
assert.match(notFound, /<app-site-header\b/, 'Keep the useful site navigation');
assert.match(notFound, /Back to the surface/);
for (const page of ['index.html', 'gallery/index.html', 'contact/index.html']) {
  const html = await readFile(output + page, 'utf8');
  assert.match(html, /<app-site-footer\b/, `Ordinary pages must retain their footer: ${page}`);
}
const routes = await readFile('src/app/app.routes.ts', 'utf8');
for (const path of ['404', '**']) assert.ok(routes.includes(`path: '${path}', data: { layout: 'scene' }`), 'Both explicit and unknown routes use the immersive scene');
console.log('Scene layout checks passed: viewport-led sizing, compact mobile/landscape spacing, no clipping of zoomed copy, 44px controls, immersive 404 and unchanged ordinary-page footers.');
