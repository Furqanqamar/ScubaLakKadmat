import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const output = 'dist/scuba-lak/browser/';
const planning = await readFile(output + 'lakshadweep-trip-planning/index.html', 'utf8');
const text = planning.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
for (const phrase of [
  'First, arrange your entry permit', 'By ship: the budget-first option', 'By air: arrive on Agatti',
  'Connect from Agatti to Kadmat', 'Find a stay that suits your visit',
  'at least 15 days', 'not a government processing guarantee', 'approval can take longer',
  'Kochi–Agatti', 'Bengaluru–Agatti', 'Goa–Agatti', 'Alliance Air', 'IndiGo', 'FLY91',
  'permit application number', 'web check-in', 'only airport', 'same-day transfer',
  'Early booking does not guarantee a lower fare', 'Foreign visitors', 'separate',
  'do not sell accommodation packages'
]) assert.ok(text.toLowerCase().includes(phrase.toLowerCase()), `Missing travel guidance: ${phrase}`);

// A changing fleet and date-specific schedule must not become a fixed availability promise.
assert.doesNotMatch(text, /(?:five|seven|5|7) passenger ships|guaranteed approval|operates? (?:daily|every day)|Air India\s*\(Alliance Air\)/i);
assert.doesNotMatch(planning, /<video\b|<iframe\b|<app-travel-faq\b/, 'Keep this guide light and avoid repeating its travel FAQs');
assert.equal((planning.match(/id="reach-permits"/g) ?? []).length, 1, 'Preserve one deep-link target after removing duplicate FAQ block');
assert.equal((planning.match(/<article\b/g) ?? []).length, 6, 'Six compact planning sections, not a new set of landing pages');

for (const url of [
  'https://lak.e-permit.utl.gov.in/', 'https://lakshadweep.irctc.co.in/',
  'https://allianceair.in/schedule', 'https://www.goindigo.in/domestic-flights/flights-to-agatti.html',
  'https://fly91.in/'
]) {
  const links = [...planning.matchAll(/<a\b[^>]*>/g)].map(match => match[0]).filter(link => link.includes(`href="${url}"`));
  assert.ok(links.length, `Missing official link: ${url}`);
  for (const link of links) {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /min-h-11/, 'Official links should retain mobile-sized touch targets');
  }
}
for (const route of ['kadmat', 'kadmat-accommodation', 'contact']) {
  const html = await readFile(output + route + '/index.html', 'utf8');
  assert.match(html, /https:\/\/lak\.e-permit\.utl\.gov\.in\//);
  assert.match(html, /https:\/\/lakshadweep\.irctc\.co\.in\//);
  assert.match(html, /not a guaranteed government processing time/);
  assert.match(html, /local tour operator/);
}
console.log('Travel checks passed: six lightweight sections, official reservation links, qualified fleet/permit advice, approved-permit and return-transfer reminders, consistent shared FAQs and independent stay introductions.');
