import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const index = await readFile(new URL('src/index.html', root), 'utf8');
const critical = index.match(/<style id="initial-loader-critical">([\s\S]*?)<\/style>/)?.[1];
assert.ok(critical, 'First-paint cover CSS must be inline in the document head');
assert.match(critical, /position:\s*fixed;\s*inset:\s*0;\s*z-index:\s*90/);
assert.match(critical, /background:\s*#061419/);
assert.match(critical, /:not\(\.page-transition--reveal\)[^}]+animation:\s*none/);
assert.match(critical, /html \.page-transition\.page-transition--initial:not/, 'First-paint rule must outrank scoped Angular cover styles');
assert.ok(index.indexOf('initial-loader-critical') < index.indexOf('fonts.googleapis.com'), 'The cover must not depend on external fonts or app styles');
assert.match(index, /<noscript><style>\.page-transition--initial\s*\{\s*display:\s*none !important;/, 'No-JS visitors must still see the prerendered website');

const script = index.match(/<script>([\s\S]*?scuba-lak:initial-ready[\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'A startup failure must not leave the initial cover stuck');
function startupHarness() {
  const timers = new Map();
  const classes = new Set();
  let ready;
  runInNewContext(script, {
    window: {
      setTimeout: (callback, delay) => { timers.set(1, { callback, delay }); return 1; },
      clearTimeout: id => timers.delete(id)
    },
    document: {
      documentElement: { classList: { add: name => classes.add(name) } },
      addEventListener: (name, callback, options) => {
        assert.equal(name, 'scuba-lak:initial-ready');
        assert.equal(options.once, true);
        ready = callback;
      }
    }
  });
  return { timers, classes, ready: () => ready() };
}
const loaded = startupHarness();
assert.equal(loaded.classes.size, 0, 'Startup script must not reveal the website before media readiness');
loaded.ready();
assert.equal(loaded.timers.size, 0, 'Normal first reveal cancels the emergency timeout');
const stalled = startupHarness();
assert.equal(stalled.timers.get(1).delay, 35000, 'Allow the normal 30-second media fail-safe to complete first');
stalled.timers.get(1).callback();
assert.ok(stalled.classes.has('initial-loader-failed'));
const main = await readFile(new URL('src/main.ts', root), 'utf8');
assert.match(main, /catch[\s\S]+classList\.add\('initial-loader-failed'\)/, 'Bootstrap errors should release the first cover immediately');

async function verifyPages(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) { count += await verifyPages(file); continue; }
    if (entry.name !== 'index.html') continue;
    const html = await readFile(file, 'utf8');
    if (/<meta\b[^>]+http-equiv="refresh"/i.test(html)) continue;
    assert.match(html, /class="page-transition page-transition--initial"/, `Missing prerendered initial cover: ${file}`);
    assert.match(html, /id="initial-loader-critical"/, `Missing first-paint critical CSS: ${file}`);
    assert.match(html, /<noscript>/, `Missing no-JS fallback: ${file}`);
    assert.ok(html.indexOf('<app-page-transition') < html.indexOf('<app-site-header'), 'Parse the loader before any visible site content, including streamed HTML');
    assert.ok(html.indexOf('initial-loader-critical') < html.indexOf('<body'), 'Critical cover style must precede the page');
    count++;
  }
  return count;
}
const count = await verifyPages(new URL('dist/scuba-lak/browser/', root));
assert.ok(count >= 40, 'Check all prerendered routes, not just the home page');
console.log(`Initial loader checks passed: ${count} prerendered routes, blocking first-paint CSS, no incoming initial animation, successful handoff, no-JS fallback and startup failure recovery.`);
