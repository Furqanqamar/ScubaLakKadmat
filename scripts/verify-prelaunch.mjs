import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const output = 'dist/scuba-lak/browser/';
const source = await readFile('src/index.html', 'utf8');
assert.doesNotMatch(source, /https:\/\/fonts\.(?:googleapis|gstatic)\.com/);
assert.match(source, /id="local-font-faces"/);
assert.match(source, /size-adjust: 104\.68%/);
assert.match(source, /ascent-override:/, 'Fallback metrics should settle text geometry before the web font arrives');
for (const match of source.matchAll(/fonts\/([^'"()]+\.woff2)/g)) {
  const bytes = await readFile('public/fonts/' + match[1]);
  assert.equal(bytes.toString('ascii', 0, 4), 'wOF2');
  assert.ok(match[1].includes(createHash('sha256').update(bytes).digest('hex').slice(0, 12)));
}
for (const name of ['inter', 'playfairdisplay']) assert.match(await readFile(`public/fonts/${name}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE/);
assert.doesNotMatch(await readFile('src/styles.css', 'utf8'), /@fortawesome\/fontawesome-free\/css/);
const cssFiles = (await readdir(output)).filter(name => name.startsWith('styles-') && name.endsWith('.css'));
for (const name of cssFiles) assert.doesNotMatch(await readFile(output + name, 'utf8'), /fa-solid-900|fa-brands-400|Font Awesome 6/);
for (const id of ['lagoon-diving', 'deep-sea-diving', 'padi-courses', 'water-sports']) {
  const html = await readFile(`${output}experiences/${id}/index.html`, 'utf8');
  for (const phrase of ['Time to allow', 'Who can join', 'season, group size', 'Flights or ferries', 'An enquiry alone is not a confirmed place', 'ready to begin the scheduled dive']) assert.ok(html.includes(phrase), `${id}: ${phrase}`);
  assert.doesNotMatch(html, /<img\b[^>]*loading="lazy"/, 'Images needed before reveal should start in prerendered HTML, not wait for hydration');
  assert.doesNotMatch(html, /₹\s*3,?500|₹\s*500|19 km|Murudeshwar|Netrani|full advance refund/i, 'Do not import reference-specific prices, logistics or refund promises');
  assert.doesNotMatch(html, /home-hero-poster-preload/, 'Inner pages must not download the home video poster');
}
for (const page of ['kadmat-visit-planning', 'kadmat-beyond-diving']) {
  const html = await readFile(`${output}${page}/index.html`, 'utf8');
  assert.match(html, /Reviewed 30 October 2026/);
  assert.match(html, /"@type":"Article"/);
  assert.doesNotMatch(html, /<video\b|<iframe\b|app-travel-faq/, 'New editorial guides do not need extra media or duplicated travel FAQs');
  const related = html.match(/<nav\b[^>]*aria-label="Related island planning"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.equal((related?.match(/<a\b/g) ?? []).length, 3);
}
const home = await readFile(output + 'index.html', 'utf8');
const gallery = await readFile(output + 'gallery/index.html', 'utf8');
assert.doesNotMatch(gallery, /<img\b[^>]*loading="lazy"/);
assert.doesNotMatch(home, /<img\b[^>]*loading="lazy"/);
assert.match(home, /home-hero-poster-preload/);
const contact = await readFile(output + 'contact/index.html', 'utf8');
assert.match(contact, /Please do not include passport copies, payment details or medical records/);
const headers = await readFile('public/_headers', 'utf8');
assert.doesNotMatch(headers, /^\/\*\.(?:js|css)\s*$/m, 'Stable holding-page scripts/styles must not receive immutable caching');
assert.match(headers, /\/site-status\.json\s+Cache-Control: no-store/);
assert.match(headers, /\/media\/originals\/\*\s+Cache-Control: public, max-age=31536000, immutable/);
const readiness = await readFile('src/app/common/services/page-media-readiness.service.ts', 'utf8');
assert.match(readiness, /document\.fonts\?\.ready/);
console.log('Pre-launch checks passed: local licensed fonts, no icon-font downloads, confirmed booking facts without reference-specific promises, compact prerendered guides, enquiry data notice and immutable-only cache rules.');
