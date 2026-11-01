import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const [scale, theme, main, usability, header, service] = await Promise.all([
  'src/styles/typography.css', 'src/styles/theme.css', 'src/styles.css', 'src/styles/usability.css',
  'src/app/common/components/site-header/site-header.component.ts', 'src/app/common/components/service-card/service-card.component.ts'
].map(read));

const tokens = new Map();
postcss.parse(scale).walkDecls(/^--text-/, declaration => tokens.set(declaration.prop, declaration.value));
for (const [name, pixels] of [['label', 12], ['caption', 13], ['control', 14], ['small', 15], ['body', 16]]) {
  assert.equal(Number.parseFloat(tokens.get('--text-' + name)) * 16, pixels, `${name}: consistent reading scale`);
}
const css = postcss.parse(main);
function declaration(selector, property) {
  const matches = [];
  css.walkRules(rule => { if (rule.selector.split(',').some(item => item.trim() === selector)) rule.walkDecls(property, item => matches.push(item.value)); });
  return matches.at(-1);
}
for (const selector of ['.eyebrow', '.course-card__category', '.course-card__copy small', '.gallery-card__copy small', '.fact-card span']) {
  assert.equal(declaration(selector, 'font-size'), 'var(--text-label)', `${selector}: readable shared label size`);
}
assert.equal(declaration('.course-card__copy p', 'font-size'), 'var(--text-small)');
assert.equal(declaration('.course-card__meta', 'font-size'), 'var(--text-caption)');
assert.equal(declaration('.course-filter button', 'font-size'), 'var(--text-control)');
assert.equal(declaration('.course-filter button', 'min-height'), '44px');
assert.equal(declaration('.course-filter', 'flex-wrap'), 'wrap', 'Filters remain reachable without horizontal scrolling');
assert.match(main, /@supports \(grid-template-rows: subgrid\)/, 'Align card rows without fixing text-container heights');
assert.equal(declaration('.course-card', 'container-type'), undefined, 'Layout containment prevents a card from sharing its parent subgrid rows');
assert.equal(declaration('.course-card__image', 'container-type'), 'inline-size', 'Keep responsive icon sizing on the inner image container');
assert.equal(declaration('.button-link', 'min-height'), '44px');
assert.match(header, /\.nav-link\s*\{[^}]*min-height: 44px[^}]*font-size: var\(--text-control\)/);
assert.doesNotMatch(usability.replace(/\.skip-link\s*\{[^}]*\}/g, ''), /font-size:|\.course-filter|\.eyebrow|\.course-card__copy/, 'Do not reintroduce competing typography overrides');
assert.doesNotMatch(service, /text-\[0\./, 'Service metadata uses the shared reading scale');
assert.match(service, /flex-wrap items-end/);
assert.match(service, /min-h-11[^\n]*text-control/, 'Explore action stays comfortably sized');

function rgb(hex) { return hex.slice(1).match(/../g).map(value => Number.parseInt(value, 16)); }
function luminance(color) {
  return color.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
}
function ratio(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function composite(front, back, alpha) { return front.map((value, index) => value * alpha + back[index] * (1 - alpha)); }
const palette = [];
postcss.parse(theme).walkRules(rule => {
  if (!rule.selector.includes("[data-theme='lagoon']") && !rule.selector.includes("[data-theme='midnight']")) return;
  const values = {};
  rule.walkDecls(/^--theme-/, declaration => { if (/^#[\da-f]{6}$/i.test(declaration.value)) values[declaration.prop] = rgb(declaration.value); });
  palette.push(values);
});
for (const colors of palette) {
  for (const surface of ['sand', 'clay']) for (const foreground of ['ink', 'gold-text', 'muted-text']) {
    const contrast = ratio(colors['--theme-' + foreground], colors['--theme-' + surface]);
    assert.ok(contrast >= 4.5, `${foreground} on ${surface}: ${contrast.toFixed(2)}:1`);
  }
}
const onDark = rgb(tokens.get('--text-on-dark'));
for (const background of ['#061419', '#10282d']) assert.ok(ratio(onDark, rgb(background)) >= 4.5);
// Contrast of photo badges even when the underlying photograph is pure white.
assert.ok(ratio(rgb('#ffffff'), composite(rgb('#031116'), rgb('#ffffff'), .86)) >= 4.5);
console.log('Readability checks passed: shared 12/13/14/15/16px scale, non-conflicting styles, wrapping filters, 44px controls and AA text-token contrast in both themes.');
