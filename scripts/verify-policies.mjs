import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const policies = ['privacy-policy', 'booking-cancellation-policy'];
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
for (const route of policies) {
  const html = await readFile(new URL(route + '/index.html', output), 'utf8');
  const main = html.match(/<main\b[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, `${route}: prerendered policy content`);
  assert.equal((main.match(/class="policy-section"/g) ?? []).length, 9);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(main, /<img\b|<video\b|<iframe\b|<form\b/, 'No extra media or duplicate enquiry form');
  assert.doesNotMatch(text(main), /Cloudflare|GoDaddy|SMTP|HTTPS|hashed|metadata|mail server|rate.limit|diagnostics|six months|seven business days|72.hour|24.hour|50%|100%|fully compliant|propose|draft/i, 'Publish plain-language current policies only, not technical details or unconfirmed proposals');
  assert.ok(text(main).includes('Last updated 31 October 2026'));
  for (const number of ['+919447982559', '+919400205847']) assert.ok(main.includes(`href="tel:${number}"`));
  assert.ok(main.includes('href="mailto:hello@scubalak.com"'));
  const sections = [...main.matchAll(/<section\b[^>]*class="policy-section"[^>]*>/g)].map(match => match[0]);
  for (const section of sections) {
    const id = section.match(/\bid="([^"]+)"/)?.[1];
    assert.ok(id && main.includes(`href="/${route}#${id}"`), `${route}: table-of-contents link for ${id}`);
    assert.ok(section.includes('tabindex="-1"'), 'Focus destination after topic navigation');
  }
}
const privacy = text(await readFile(new URL('privacy-policy/index.html', output), 'utf8'));
for (const phrase of ['We do not sell enquiry information.', 'Some service providers may handle information outside India.', 'request deletion', 'withdraw permission', 'required to retain', 'parent or guardian']) assert.ok(privacy.includes(phrase), phrase);
const booking = text(await readFile(new URL('booking-cancellation-policy/index.html', output), 'utf8'));
for (const phrase of ['written confirmation from Scuba Lak', 'by phone or WhatsApp', 'automatic reply is not confirmation', 'local dive transport', 'inter-island transfers', 'guest and team are ready to begin', 'operator cancellation for unsafe conditions', 'No universal processing deadline', 'Nothing in this policy limits your rights under applicable law.']) assert.ok(booking.includes(phrase), phrase);

const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.scubalak\.com\/(.*?)<\/loc>/g)].map(match => match[1]);
for (const route of routes) {
  const html = await readFile(new URL(route + 'index.html', output), 'utf8');
  const nav = html.match(/<nav\b[^>]*aria-label="Policies"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  for (const policy of policies) assert.ok(nav?.includes(`href="/${policy}"`), `Footer policy access: ${route || '/'}`);
}
for (const policy of policies) assert.ok(sitemap.includes(`https://www.scubalak.com/${policy}/`));
const contact = await readFile(new URL('contact/index.html', output), 'utf8');
const notice = contact.match(/<nav\b[^>]*aria-label="Enquiry policies"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
for (const policy of policies) assert.ok(notice?.includes(`href="/${policy}"`));
assert.ok(contact.includes('We do not sell enquiry information.'));
assert.doesNotMatch(text(contact), /mail server/);
for (const route of ['faq', 'experiences/lagoon-diving', 'experiences/deep-sea-diving', 'experiences/padi-courses', 'experiences/water-sports']) {
  const html = await readFile(new URL(route + '/index.html', output), 'utf8');
  assert.ok(html.includes('written confirmation from Scuba Lak'));
  assert.ok(html.includes('by phone or WhatsApp'));
}
console.log(`Policy checks passed: two lightweight prerendered pages, plain-language privacy, explicit written/call/WhatsApp booking confirmation, owner-confirmed cancellation rules, no superseded refund tiers or unconfirmed deadlines, enquiry links and footer access across ${routes.length} canonical pages.`);
