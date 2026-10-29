import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
const removed = ['deep-diver', 'digital-underwater-photographer', 'enriched-air-nitrox', 'night-diver', 'adaptive-support-diver', 'delayed-surface-marker-buoy', 'underwater-navigator', 'wreck-diver', 'peak-performance-buoyancy', 'emergency-first-response', 'emergency-oxygen-provider'];
const home = await readFile(new URL('index.html', output), 'utf8');
const courses = await readFile(new URL('courses/index.html', output), 'utf8');
const accommodation = await readFile(new URL('kadmat-accommodation/index.html', output), 'utf8');
const planning = await readFile(new URL('lakshadweep-trip-planning/index.html', output), 'utf8');
const contact = await readFile(new URL('contact/index.html', output), 'utf8');
const gallery = await readFile(new URL('gallery/index.html', output), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');

assert.equal((courses.match(/<a\b[^>]*class="course-card\b/g) ?? []).length, 11);
assert.doesNotMatch(courses, /Specialty diver courses|First aid &amp; safety|First aid & safety/);
assert.match(courses, /\/courses\/emergency-first-response-instructor/, 'Owner confirmed EFR Instructor stays');
assert.match(courses, /\/courses\/rescue-diver/, 'Owner confirmed Rescue Diver stays');
for (const id of removed) {
  assert.ok(!new RegExp(`/courses/${id}(?:["/?#])`).test(courses), `Removed course still advertised: ${id}`);
  assert.ok(!sitemap.includes(`/courses/${id}/`), `Removed course still indexed: ${id}`);
  await assert.rejects(access(new URL(`courses/${id}/index.html`, output)), { code: 'ENOENT' }, `Removed course still prerendered: ${id}`);
}
assert.doesNotMatch(home, /id="packages"|package-tab|Barefoot basecamp|Blue room retreat|kind=package|Standard beachfront lodging|Private beach-facing AC villa/);
assert.match(home, /id="where-to-stay"/);
assert.match(home, /Third-party resorts/);
assert.match(home, /local homestays/i);
assert.match(home, /interest=accommodation#enquiry/);
assert.match(home, /booked independently with the property/);
assert.match(accommodation, /Where to stay in Kadmat/);
assert.match(accommodation, /do not sell accommodation packages/);
assert.match(accommodation, /booking directly with the property/);
for (const html of [home, accommodation, planning, contact]) {
  assert.doesNotMatch(html, /accommodation-and-diving proposal|Budget and premium|Build this trip|Barefoot basecamp|Blue room retreat|kind=package|package:budget|package:premium/);
  assert.doesNotMatch(html, /"@type":"(?:Hotel|Resort|LodgingBusiness|Offer)"/);
}
const enquiryForm = contact.match(/<form\b[^>]*id="enquiry-form"[^>]*>([\s\S]*?)<\/form>/)?.[1];
assert.ok(enquiryForm, 'Keep the simple contact form');
assert.deepEqual([...enquiryForm.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)].map(field => field[1]).filter(name => name !== 'website'), ['name', 'email', 'phone', 'message'], 'No accommodation or trip selectors in the simplified form; the hidden spam trap is not a visible question');
assert.match(contact, /Can Scuba Lak help me find accommodation\?/);
assert.match(contact, /third-party resorts or homestay hosts/);
assert.match(contact, /Accommodation is provided and booked independently with the property/);
assert.doesNotMatch(gallery, /gallery-blue-villa|Blue room mornings/);
console.log('Offering checks passed: 9 specialty and 2 safety courses removed from listings, detail pages and sitemap; 11 confirmed courses remain, including EFR Instructor and Rescue Diver; no accommodation packages.');
