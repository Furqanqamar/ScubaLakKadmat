import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const output = 'dist/scuba-lak/browser/';
const [styles, media] = await Promise.all(['src/styles.css', 'src/styles/media.css'].map(read));
const css = postcss.parse(styles + '\n' + media);
css.walkRules(rule => {
  assert.doesNotMatch(rule.selector, /\.page-hero__watermark|\.page-hero::after/, 'Do not restore decorative hero lettering or the dotted texture');
});
assert.match(media, /\.page-hero--real::before\s*\{[^}]*linear-gradient/, 'Keep the photo contrast overlay');
assert.match(styles, /\.detail-hero__wash\s*\{[^}]*linear-gradient/, 'Keep the detail-page photo contrast overlay');
assert.match(styles, /\.destination-hero__wash\s*\{[^}]*linear-gradient\(90deg,[^;]+\);/, 'Use one restrained destination photo wash');
assert.match(styles, /\.detail-hero--course \.detail-hero__wash, \.destination-hero__wash\s*\{[^}]*rgba\(3,17,22,\.72\)/, 'Keep narrow-screen copy readable over bright island photography');

const expected = [
  ['about', 'Island people. Ocean hearts.', 'dive-centre-evening-'],
  ['courses', 'Learn to dive. Here in Kadmat.', 'sunlit-blue-diver-'],
  ['experiences', 'Your Kadmat water day.', 'open-blue-dive-'],
  ['gallery', 'The island in frames.', 'coral-and-light-'],
  ['contact', 'Start with a good question.', 'crew-on-the-lagoon-'],
  ['kadmat', 'A little island. A lot of blue.'],
  ['lakshadweep', 'Lakshadweep, left beautifully alone.'],
  ['courses/open-water-diver', 'PADI Open Water Diver'],
  ['experiences/lagoon-diving', 'Lagoon diving']
];
const text = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
for (const [route, heading, photograph] of expected) {
  const html = await read(output + route + '/index.html');
  const hero = html.match(/<(section|header)\b[^>]*\bdata-page-hero\b[^>]*>([\s\S]*?)<\/\1>/)?.[0];
  assert.ok(hero, `${route}: explicit hero boundary retained`);
  assert.equal(text(hero.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''), heading, `${route}: headline unchanged`);
  assert.match(hero, /class="eyebrow/, `${route}: readable page identity retained`);
  assert.doesNotMatch(hero, /app-hero-watermark|page-hero__watermark|ABOUT \/ SCUBA LAK|CONTACT \/ BLUE|FIELD NOTES/);
  if (photograph) {
    assert.ok(hero.includes(photograph), `${route}: original hero photograph retained`);
    assert.match(hero, /loading="eager"/);
    assert.match(hero, /fetchpriority="high"/);
  }
}
const home = await read(output + 'index.html');
assert.match(home, /<h1\b[^>]*>The reef<br[^>]*><em[^>]*>starts here\.<\/em><\/h1>/);
assert.match(home, /<video\b[^>]*background-video__image/);
assert.match(home, /class="hero-copy-wash/);
assert.match(styles, /\.destination-hero--kadmat\s*\{[^}]*kadmat-reference\.jpg/);
assert.match(styles, /\.destination-hero--lakshadweep\s*\{[^}]*banner-lakshadweep\.webp/);
console.log('Clean-hero checks passed: no oversized lettering or dotted hero texture; original headlines, photographs, contrast overlays, readiness boundaries and homepage video retained.');
