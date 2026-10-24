import { readFile, readdir, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 36);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
const documents = new Map();
const decodeAttribute = value => value.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
let checkedLinks = 0;
let checkedAnchors = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname.replace('/ScubaLakKadmat/', '');
  const html = await readFile(new URL(pathname + 'index.html', output), 'utf8');
  documents.set(new URL(url).pathname, html);
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
for (const [pathname, html] of documents) {
  const base = html.match(/<base href="([^"]+)"/)?.[1] ?? '/';
  if (pathname.replace(/^\/ScubaLakKadmat/, '') === '/') {
    const hero = html.match(/<video\b[^>]*background-video__image[^>]*>/)?.[0];
    assert.ok(hero, 'Hero video must be present without requiring a Play action');
    for (const attribute of ['autoplay', 'muted', 'loop', 'playsinline']) assert.match(hero, new RegExp(`\\b${attribute}(?:[\\s=>])`));
    assert.doesNotMatch(hero, /\bcontrols(?:[\s=>])/);
    assert.ok(!html.includes('background-video__control'), 'Hero Play/Pause control must remain removed');
  }
  const detail = pathname.match(/\/(courses|experiences)\/([^/]+)\/$/);
  if (detail) {
    const kind = detail[1] === 'courses' ? 'course' : 'experience';
    assert.ok(html.includes(`kind=${kind}&amp;item=${detail[2]}#enquiry`) || html.includes(`kind=${kind}&item=${detail[2]}#enquiry`), `Missing enquiry context: ${pathname}`);
  }
  const localPage = new URL(pathname.replace(/^\/ScubaLakKadmat\//, base), 'https://local.test');
  const resolvePage = async path => {
    const relative = path.replace(/^\/ScubaLakKadmat\//, '').replace(/^\//, '').replace(/\/$/, '');
    return readFile(new URL((relative ? relative + '/' : '') + 'index.html', output), 'utf8');
  };
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = decodeAttribute(match[1]);
    assert.ok(href.trim() && href !== '#', `Empty navigation destination: ${pathname}`);
    const target = new URL(href, href.startsWith('#') || href.startsWith('?') ? localPage : new URL(base, localPage));
    if (target.origin !== localPage.origin) continue;
    assert.ok(base === '/' || target.pathname.startsWith(base), `Link escapes deployment base: ${href}`);
    if (/\.[a-z0-9]+$/i.test(target.pathname)) continue;
    const destination = await resolvePage(target.pathname);
    checkedLinks++;
    if (target.hash) {
      const anchor = decodeURIComponent(target.hash.slice(1));
      assert.ok([...destination.matchAll(/\bid="([^"]+)"/g)].some(item => item[1] === anchor), `Missing #${anchor}: ${pathname} -> ${href}`);
      checkedAnchors++;
    }
  }
  assert.ok(!/AI-generated|not documentary photographs|Team member [456]|hello@scubalak\.com|scubalak@gamil\.com/.test(html), `Unapproved public content: ${pathname}`);
  assert.match(html, /scubalak@gmail\.com/);
  assert.match(html, /919447982559/);
}
const notFound = await readFile(new URL('404.html', output), 'utf8');
assert.match(notFound, /content="noindex, follow"/);
for (const file of await readdir(output)) {
  if (!file.endsWith('.css')) continue;
  const css = await readFile(new URL(file, output), 'utf8');
  assert.ok(!css.includes('./ScubaLakKadmat/media/'), 'Corrupt font URL');
}
console.log(`SEO checks passed: 36 static pages, unique titles, one H1, canonicals, structured data, ${checkedLinks} internal links, ${checkedAnchors} anchor targets, confirmed contact details, verification tag and noindex 404.`);
