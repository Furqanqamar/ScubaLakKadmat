import { readFile, readdir, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const islandContent = JSON.parse(await readFile(new URL('../src/app/data/island-guides.json', import.meta.url), 'utf8'));
assert.equal(urls.length, 36 + islandContent.islands.length);
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
  const heroLabels = { '/lakshadweep/': '36 Islands', '/experiences/': '4 Experiences', '/courses/': 'PADI Courses', '/kadmat/': 'Kadmat Island' };
  const heroLabel = heroLabels[pathname.replace(/^\/ScubaLakKadmat/, '')];
  if (heroLabel) {
    const watermark = html.match(/<app-hero-watermark\b[^>]*>([\s\S]*?)<\/app-hero-watermark>/);
    assert.ok(watermark, `Missing shared hero label: ${pathname}`);
    assert.match(watermark[0], /aria-hidden="true"/, `Hero watermark must remain decorative: ${pathname}`);
    assert.equal(watermark[1].replace(/<[^>]*>/g, '').trim(), heroLabel, `Unclear hero label: ${pathname}`);
    assert.doesNotMatch(html, /LAGOON \/ 36|04 \/ 04|PADI \/ 22|KADMAT \/ 08/, `Legacy hero code: ${pathname}`);
  }
  const diveIcons = [...html.matchAll(/<app-dive-icon\b[^>]*data-dive-icon="([^"]+)"[^>]*>([\s\S]*?)<\/app-dive-icon>/g)];
  for (const icon of diveIcons) {
    assert.match(icon[0], /aria-hidden="true"/, `Decorative icon must not repeat nearby text: ${pathname}`);
    assert.match(icon[0], /data-icon-context="(?:benefit|benefit-detail|service|course|detail|activity)"/, `Every icon needs a context-specific responsive size: ${pathname}`);
    assert.match(icon[2], /viewBox="0 0 80 80"/, `Inconsistent SVG artboard: ${pathname}`);
    assert.match(icon[2], /stroke="currentColor"/, `SVG must inherit the theme: ${pathname}`);
    assert.match(icon[2], /<path\b[^>]*\bd="M/, `Missing SVG paths: ${pathname}`);
    assert.doesNotMatch(icon[2], /<image\b|<foreignObject\b|<script\b|\bonload=/i, `Unsafe or raster icon: ${pathname}`);
  }
  if (pathname.replace(/^\/ScubaLakKadmat/, '') === '/') {
    const hero = html.match(/<video\b[^>]*background-video__image[^>]*>/)?.[0];
    assert.ok(hero, 'Hero video must be present without requiring a Play action');
    for (const attribute of ['autoplay', 'muted', 'loop', 'playsinline']) assert.match(hero, new RegExp(`\\b${attribute}(?:[\\s=>])`));
    assert.doesNotMatch(hero, /\bcontrols(?:[\s=>])/);
    assert.ok(!html.includes('background-video__control'), 'Hero Play/Pause control must remain removed');
    assert.equal((html.match(/class="benefit-item"/g) ?? []).length, 6, 'Home must show all six benefits');
    assert.deepEqual(diveIcons.map(icon => icon[1]), ['lagoon', 'deep-diver', 'certification', 'kayak', 'kayak', 'schedule', 'mask', 'tanks', 'coral', 'instructor'], 'Home service and benefit cards must use the shared SVG icons');
    assert.deepEqual(diveIcons.map(icon => icon[0].match(/data-icon-context="([^"]+)"/)?.[1]), [...Array(4).fill('service'), ...Array(6).fill('benefit')], 'Home icons must use the correct size hierarchy');
  }
  if (pathname.replace(/^\/ScubaLakKadmat/, '') === '/about/') {
    assert.equal((html.match(/class="team-card"/g) ?? []).length, 6, 'All six original team portraits must remain visible');
    assert.equal((html.match(/class="benefit-item"/g) ?? []).length, 6, 'About must explain all six benefits');
    for (const index of [4, 5, 6]) assert.ok(html.includes(`media/team/team-member-${index}.jpg`), `Missing original portrait ${index}`);
    assert.deepEqual(diveIcons.map(icon => icon[1]), ['kayak', 'schedule', 'mask', 'tanks', 'coral', 'instructor'], 'About must use the same benefit artwork as Home');
    for (const icon of diveIcons) assert.match(icon[0], /data-icon-context="benefit-detail"/, 'About icons need the detailed-layout size');
  }
  if (pathname.replace(/^\/ScubaLakKadmat/, '') === '/courses/') {
    assert.equal(diveIcons.length, 22, 'Every PADI course card needs a matching SVG icon');
    for (const icon of diveIcons) assert.match(icon[0], /data-icon-context="course"/, 'Course cards need compact icons');
  }
  for (const social of html.matchAll(/<a\b[^>]*class="social-link"[^>]*>([\s\S]*?)<\/a>/g)) {
    assert.equal(social[1].replace(/<[^>]*>/g, '').trim(), '', 'Footer social links must be icon-only');
  }
  const detail = pathname.match(/\/(courses|experiences)\/([^/]+)\/$/);
  if (detail) {
    const kind = detail[1] === 'courses' ? 'course' : 'experience';
    assert.equal(diveIcons.length, kind === 'course' ? 1 : detail[2] === 'water-sports' ? 5 : 4, `Missing shared detail-page icons: ${pathname}`);
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
console.log(`SEO checks passed: ${urls.length} static pages, unique titles, one H1, canonicals, structured data, ${checkedLinks} internal links, ${checkedAnchors} anchor targets, confirmed contact details, verification tag and noindex 404.`);
