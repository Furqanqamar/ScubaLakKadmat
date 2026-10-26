import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const root = new URL('../', import.meta.url);
const css = (await Promise.all(['src/styles.css', 'src/styles/kadmat-diving.css', 'src/styles/media.css', 'src/styles/island-guides.css'].map(path => readFile(new URL(path, root), 'utf8')))).join('\n');
const serviceCard = await readFile(new URL('src/app/common/components/service-card/service-card.component.ts', root), 'utf8');
const staticCards = ['service-card', 'island-card', 'attraction-card', 'transport-card', 'team-card', 'dive-spot-card', 'kadmat-reason'];

postcss.parse(css).walkRules(rule => {
  for (const name of staticCards) {
    assert.doesNotMatch(rule.selector, new RegExp(`\\.${name}(?:__[\\w-]+)?:(?:hover|focus-within)\\b`), `${name} must not imply that its entire surface is interactive`);
  }
  const cardHover = /(?:^|,)\s*\.(gallery-card|gallery-teaser|course-card|island-guide-card|contact-social-card):(?:hover|focus-visible)\s*(?:,|$)/;
  if (cardHover.test(rule.selector)) {
    rule.walkDecls(/^(?:transform|translate|scale|top|left|margin)/, declaration => assert.fail(`Whole-card hover motion is not allowed: ${rule.selector} ${declaration.prop}`));
  }
});

assert.match(css, /\.gallery-card:hover img/);
assert.match(css, /\.course-card:hover \.course-card__image-source/);
assert.match(css, /\.gallery-teaser:hover img/);
assert.match(css, /\.island-guide-card:hover \.island-guide-card__art img/);
assert.match(css, /transform: scale\(1\.035\)/, 'Keep zoom subtle and inside the clipped image container');
assert.match(css, /\(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\)/, 'Avoid sticky hover effects on touch screens and respect reduced motion');

const article = serviceCard.match(/<article\b[^>]*>/)?.[0];
assert.ok(article, 'Missing service-card article');
assert.doesNotMatch(article, /data-cursor|\(click\)|tabindex|role=|\bgroup\b/, 'Only the Explore link should be interactive');
assert.doesNotMatch(serviceCard, /group-hover:/, 'Hovering the Explore link must not animate the card image');
assert.equal((serviceCard.match(/<a\b/g) ?? []).length, 1, 'Each service card should expose one Explore link');
assert.match(serviceCard, /\[routerLink\]="\['\/experiences', service\(\)\.id\]"/);
assert.match(serviceCard, /hover:bg-\[#b8f2df\]/, 'Preserve feedback on the actual Explore link');
assert.match(serviceCard, /focus:ring-2/, 'Preserve keyboard focus on the actual Explore link');
const spotList = await readFile(new URL('src/app/common/components/kadmat-dive-spots/kadmat-dive-spots.component.ts', root), 'utf8');
assert.match(spotList, /<ol\b[^>]*class="kadmat-spots__list"/);
assert.doesNotMatch(spotList.match(/<li\b[^>]*>/)?.[0] ?? '', /\(click\)|tabindex|data-cursor|role=/, 'Dive-spot list rows stay static; only their enquiry arrows are links');

const courses = await readFile(new URL('src/app/pages/courses/courses.component.html', root), 'utf8');
const gallery = await readFile(new URL('src/app/common/components/media-collection/media-collection.component.ts', root), 'utf8');
assert.match(courses, /<a class="course-card\b/, 'Course cards remain genuine whole-card links');
assert.match(gallery, /<button[^>]*class="gallery-card"/, 'Gallery cards remain genuine whole-card buttons');

console.log('Card interaction checks passed: stationary clickable cards with restrained image-only zoom; static cards have no hover affordance; touch/reduced-motion safeguards; Explore links and real card actions retained.');
