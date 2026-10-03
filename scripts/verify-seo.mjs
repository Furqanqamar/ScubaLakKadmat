import { readFile, readdir, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 36);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
for (const url of urls) {
  const pathname = new URL(url).pathname.replace('/ScubaLakKadmat/', '');
  const html = await readFile(new URL(pathname + 'index.html', output), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, url);
  assert.ok(!titles.has(title), `Duplicate title: ${title}`); titles.add(title);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, url);
  assert.ok(html.includes(`href="${url}"`), `Canonical: ${url}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="noindex/.test(html), url);
  assert.match(html, /name="google-site-verification"/);
  const json = html.match(/<script[^>]+id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, `Structured data: ${url}`);
  const graph = JSON.parse(json)['@graph'];
  assert.ok(graph.some(item => item['@type'] === 'WebPage'));
  for (const match of html.matchAll(/href="([^"#]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.replace(/^\/ScubaLakKadmat/, '').replace(/^\//, '').split(/[?#]/)[0];
    if (/\.[a-z0-9]+$/i.test(target)) continue;
    await access(new URL(target.replace(/\/$/, '') + (target ? '/' : '') + 'index.html', output));
  }
}
const notFound = await readFile(new URL('404.html', output), 'utf8');
assert.match(notFound, /content="noindex, follow"/);
for (const file of await readdir(output)) {
  if (!file.endsWith('.css')) continue;
  const css = await readFile(new URL(file, output), 'utf8');
  assert.ok(!css.includes('./ScubaLakKadmat/media/'), 'Corrupt font URL');
}
console.log('SEO checks passed: 36 static pages, unique titles, one H1, canonicals, structured data, internal links, verification tag and noindex 404.');
