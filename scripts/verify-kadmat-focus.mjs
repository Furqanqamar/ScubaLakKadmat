import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/scuba-lak/browser/', root);
const content = JSON.parse(await readFile(new URL('src/app/data/kadmat-diving.json', root), 'utf8'));
const names = ['Secret Garden', 'The Cave', 'Double Reef', 'Family Hut', 'Tunnel', 'The Wall', 'Turtle Town', 'North Cave', 'North Tip', 'Dolphin Head', 'Masjith Point', '7 Huts Reef', 'Potato Patch', 'East Gallery', 'Fish Soup', 'Sting Ray City', 'Jack Point', 'Junior Shark Ali', 'Cross Current'];
assert.deepEqual(content.sites.map(site => site.name), names, 'Preserve all 19 team-supplied names');
assert.equal(new Set(content.sites.map(site => site.id)).size, 19);
assert.equal(content.sites.filter(site => site.featured).length, 6);
assert.equal(content.reasons.length, 6);
for (const site of content.sites) {
  assert.ok(/^[a-z0-9-]+$/.test(site.id));
  if (site.photo) {
    assert.match(site.photo.src, /^media\//, 'Site photographs must use approved local media');
    assert.ok(site.photo.alt && site.photo.width > 0 && site.photo.height > 0);
  }
  for (const field of ['depth', 'coordinates', 'latitude', 'longitude', 'level']) assert.ok(!(field in site), `Do not invent ${field} for ${site.name}`);
}
const home = await readFile(new URL('index.html', output), 'utf8');
const kadmat = await readFile(new URL('kadmat/index.html', output), 'utf8');
const collection = await readFile(new URL('kadmat-dive-sites/index.html', output), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
assert.match(home, /Dive into/);
assert.match(home, /Your pace/);
assert.match(home, /dive-centre-evening-/);
assert.doesNotMatch(home, /agatti-from-vessel|id="packages"|selectedBriefing/);
for (const html of [home, kadmat]) {
  assert.equal((html.match(/class="kadmat-reason"/g) ?? []).length, 6);
  assert.equal((html.match(/class="dive-spot-card"/g) ?? []).length, 6);
  assert.match(html, /href="(?:\/ScubaLakKadmat)?\/kadmat-dive-sites"/);
}
assert.equal((collection.match(/class="dive-spot-card"/g) ?? []).length, 19);
for (const site of content.sites) {
  assert.ok(collection.includes(`id="spot-${site.id}"`));
  assert.ok(collection.includes(`>${site.name}</h3>`));
  assert.ok(collection.includes(`kind=dive-site&amp;item=${site.id}#enquiry`));
}
assert.match(collection, /type="search"/);
assert.match(collection, /Reef graphics are illustrations/);
assert.match(collection, /Wildlife encounters and overhead access are not promised/);
assert.match(collection, /way-to-the-reef-/);
assert.match(sitemap, /\/kadmat-dive-sites\//);
const graph = JSON.parse(collection.match(/<script[^>]+id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
const itemList = graph.find(item => item['@type'] === 'ItemList');
assert.equal(itemList.numberOfItems, 19);
assert.deepEqual(itemList.itemListElement.map(item => item.name), names);
const source = await readFile(new URL('src/app/common/components/dive-site-collection/dive-site-collection.component.ts', root), 'utf8');
assert.doesNotMatch(source.match(/<article\b[^>]*>/)?.[0] ?? '', /\(click\)|tabindex|data-cursor/);
assert.doesNotMatch(source, /<foreignObject|<script|\[innerHTML\]/i);
console.log('Kadmat checks passed: 19 named sites, 6 visual previews, 6 reasons, contextual enquiry links, honest illustrations, original photography, static cards and indexed collection page.');
