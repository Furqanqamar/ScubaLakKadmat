import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const root = new URL('../', import.meta.url);
const css = await readFile(new URL('src/styles.css', root), 'utf8') + await readFile(new URL('src/styles/kadmat-diving.css', root), 'utf8');
const serviceCard = await readFile(new URL('src/app/common/components/service-card/service-card.component.ts', root), 'utf8');
const staticCards = ['service-card', 'island-card', 'attraction-card', 'transport-card', 'team-card', 'dive-spot-card', 'kadmat-reason'];

postcss.parse(css).walkRules(rule => {
  for (const name of staticCards) {
    assert.doesNotMatch(rule.selector, new RegExp(`\\.${name}(?:__[\\w-]+)?:(?:hover|focus-within)\\b`), `${name} must not imply that its entire surface is interactive`);
  }
});

const article = serviceCard.match(/<article\b[^>]*>/)?.[0];
assert.ok(article, 'Missing service-card article');
assert.doesNotMatch(article, /data-cursor|\(click\)|tabindex|role=|\bgroup\b/, 'Only the Explore link should be interactive');
assert.doesNotMatch(serviceCard, /group-hover:/, 'Hovering the Explore link must not animate the card image');
assert.equal((serviceCard.match(/<a\b/g) ?? []).length, 1, 'Each service card should expose one Explore link');
assert.match(serviceCard, /\[routerLink\]="\['\/experiences', service\(\)\.id\]"/);
assert.match(serviceCard, /hover:bg-\[#b8f2df\]/, 'Preserve feedback on the actual Explore link');
assert.match(serviceCard, /focus:ring-2/, 'Preserve keyboard focus on the actual Explore link');

const courses = await readFile(new URL('src/app/pages/courses/courses.component.html', root), 'utf8');
const gallery = await readFile(new URL('src/app/common/components/media-collection/media-collection.component.ts', root), 'utf8');
assert.match(courses, /<a class="course-card\b/, 'Course cards remain genuine whole-card links');
assert.match(gallery, /<button[^>]*class="gallery-card"/, 'Gallery cards remain genuine whole-card buttons');

console.log('Card interaction checks passed: static cards have no hover affordance; Explore links retain hover and focus feedback; course and gallery cards retain their real actions.');
