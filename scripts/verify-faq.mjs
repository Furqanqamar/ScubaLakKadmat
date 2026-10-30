import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const html = await readFile(new URL('faq/index.html', output), 'utf8');
const main = html.match(/<main\b[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/)?.[1];
assert.ok(main, 'FAQ must be a prerendered page, not a client-only modal');
assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
assert.equal((main.match(/<details\b/g) ?? []).length, 39, 'Keep the full set of shared common questions');
assert.equal((main.match(/<summary\b/g) ?? []).length, 39, 'Native, keyboard-accessible accordions');
assert.doesNotMatch(main, /<img\b|<picture\b|<video\b|<iframe\b|<input\b/, 'Keep this route lightweight; no new media, embeds or duplicate enquiry form');

const topics = ['booking', 'first-dive', 'training', 'activities', 'travel', 'stays', 'conditions'];
for (const topic of topics) {
  assert.equal((main.match(new RegExp(`id="faq-${topic}"`, 'g')) ?? []).length, 1);
  assert.match(main, new RegExp(`href="[^"]*faq#faq-${topic}"`), `Topic navigation: ${topic}`);
  const section = main.match(new RegExp(`<section\\b[^>]*id="faq-${topic}"[^>]*>`))?.[0];
  assert.ok(section?.includes('tabindex="-1"') && section.includes(`aria-labelledby="faq-heading-${topic}"`), 'Topic targets support focus after navigation');
}
const questions = [...main.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/g)].map(match => match[1].replace(/<[^>]+>/g, '').trim());
assert.equal(new Set(questions).size, questions.length, 'No repeated questions across groups');

const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
for (const phrase of [
  'season, group size', 'local dive transport', 'entry-permit fees are separate',
  'enquiry alone is not a confirmed', '15–20 minutes', '30–40 minutes',
  'certification courses', 'not guaranteed', '15 days',
  'not a guaranteed government processing time', 'do not sell accommodation packages',
  'guest and team are ready to begin', 'unsafe conditions',
  'Still wondering', 'contact page or call', 'dive times are arranged separately'
]) assert.ok(text.toLowerCase().includes(phrase.toLowerCase()), `Missing confirmed answer or contact guidance: ${phrase}`);
assert.doesNotMatch(text, /100% refund|72.hours|24.hours|guaranteed (?:certification|visibility|permit|approval)|₹\s*\d/i, 'Do not introduce unapproved prices, refund tiers or guarantees');

const contact = main.match(/<section\b[^>]*aria-labelledby="faq-contact-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
assert.ok(contact, 'End with a dedicated unanswered-question invitation');
assert.match(contact, /href="[^"]*contact#enquiry"/);
for (const number of ['+919447982559', '+919400205847']) assert.ok(contact.includes(`href="tel:${number}"`), `Direct call action: ${number}`);

const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.scubalak\.com\/(.*?)<\/loc>/g)].map(match => match[1]);
for (const route of routes) {
  const page = await readFile(new URL(route + 'index.html', output), 'utf8');
  const footer = page.match(/<nav\b[^>]*aria-label="Footer navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(footer?.match(/href="[^"]*\/faq"[^>]*>FAQs<\/a>/), `FAQ link in shared footer: ${route || '/'}`);
}
assert.match(sitemap, /<loc>https:\/\/www\.scubalak\.com\/faq\/<\/loc>/);
console.log(`FAQ checks passed: 7 topic groups, 39 prerendered native accordions, confirmed shared answers, both direct-call links, contact enquiry action, no new page media and footer access across ${routes.length} canonical pages.`);
