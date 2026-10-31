import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const content = JSON.parse(await readFile(new URL('src/app/data/kadmat-diving.json', root), 'utf8'));
const names = ['Secret Garden', 'The Cave', 'Double Reef', 'Family Hut', 'Tunnel', 'The Wall', 'Turtle Town', 'North Cave', 'North Tip', 'Dolphin Head', 'Masjith Point', '7 Huts Reef', 'Potato Patch', 'East Gallery', 'Fish Soup', 'Sting Ray City', 'Jack Point', 'Junior Shark Ali', 'Cross Current'];
assert.deepEqual(content.sites.map(site => site.name), names, 'Preserve all 19 team-supplied names');
assert.equal(new Set(content.sites.map(site => site.id)).size, 19);
assert.equal(content.reasons.length, 6);
for (const site of content.sites) {
  assert.ok(/^[a-z0-9-]+$/.test(site.id));
  assert.deepEqual(Object.keys(site).sort(), ['id', 'name'], 'Keep the directory free of invented site details and unused card data');
}
const home = await readFile(new URL('index.html', output), 'utf8');
const kadmat = await readFile(new URL('kadmat/index.html', output), 'utf8');
const redirect = await readFile(new URL('kadmat-dive-sites/index.html', output), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const base = home.match(/<base href="([^"]+)"/)[1];
assert.match(home, /The reef/);
assert.match(home, /starts here\./);
assert.match(home, /Your pace/);
assert.match(home, /dive-centre-evening-/);
assert.doesNotMatch(home, /agatti-from-vessel|id="packages"|selectedBriefing|app-kadmat-dive-spots/);
for (const html of [home, kadmat]) {
  assert.equal((html.match(/class="kadmat-reason"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /dive-spot-card|app-dive-site-collection|href="[^"]*kadmat-dive-sites/);
  assert.ok(html.includes('href="' + base + 'kadmat#dive-spots"'));
}
assert.match(kadmat, /id="dive-spots"/);
assert.match(kadmat, /<ol[^>]+class="kadmat-spots__list"/);
assert.match(kadmat, /media\/islands\/kadmat-[^"]+\.webp/);
assert.match(kadmat, /an illustration, not a dive-site map/);
assert.ok(kadmat.includes('href="' + base + 'lakshadweep"'));
assert.match(kadmat, /Explore other Lakshadweep islands/);
for (const site of content.sites) {
  assert.ok(kadmat.includes('id="spot-' + site.id + '"'));
  assert.ok(kadmat.includes('>' + site.name + '</span>'));
  assert.ok(kadmat.includes('kind=dive-site&amp;item=' + site.id + '#enquiry'));
}
assert.doesNotMatch(sitemap, /\/kadmat-dive-sites\//);
assert.match(redirect, /http-equiv="refresh"/);
const target = redirect.match(/content="0; url=([^"]+)"/)[1];
assert.equal(target, base + 'kadmat#dive-spots', 'Legacy redirect must respect the deployment base');
const graph = JSON.parse(kadmat.match(/<script[^>]+id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
const itemList = graph.find(item => item['@type'] === 'ItemList');
assert.equal(itemList.numberOfItems, 19);
assert.deepEqual(itemList.itemListElement.map(item => item.name), names);
for (const item of itemList.itemListElement) assert.match(item.url, /\/kadmat\/#spot-/);
const source = await readFile(new URL('src/app/common/components/kadmat-dive-spots/kadmat-dive-spots.component.ts', root), 'utf8');
assert.doesNotMatch(source.match(/<li\b[^>]*>/)?.[0] ?? '', /\(click\)|tabindex|data-cursor/);
assert.doesNotMatch(source, /<foreignObject|<script|\[innerHTML\]/i);
console.log('Kadmat checks passed: 19 listed spots beside the island illustration, no spot cards or separate menu, contextual enquiries, other-island link, structured data and legacy redirect.');
