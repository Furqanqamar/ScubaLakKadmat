import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
for (const page of ['index.html', 'about/index.html', 'gallery/index.html', 'contact/index.html']) {
  const html = await readFile(new URL(page, output), 'utf8');
  const main = html.match(/<script\b[^>]*src="(main-[\w-]+\.js)"[^>]*type="module"/)[1];
  const preloadNames = [...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g)].map(match => match[1]);
  const preloads = new Set(preloadNames);
  assert.equal(preloadNames.length, preloads.size, 'No duplicate module preloads');
  const seen = new Set();
  async function check(name) {
    if (seen.has(name)) return;
    seen.add(name);
    const source = await readFile(new URL(name, output), 'utf8');
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*)(['"])(\.\/(?:chunk|main)-[\w-]+\.js)\1/g)) {
      const dependency = match[2].slice(2);
      assert.ok(preloads.has(dependency), `${page}: startup waterfall at ${dependency}`);
      await check(dependency);
    }
  }
  await check(main);
  for (const name of preloads) await readFile(new URL(name, output));
}
console.log('Startup preload checks passed: complete static entry-module graph, valid assets, no duplicate hints and route-specific prerendering retained.');
