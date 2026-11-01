import assert from 'node:assert/strict';
import { COURSE_ICONS, CYLINDER_GEOMETRY, DIVE_ICONS, DIVE_ICON_STYLE, KAYAK_GEOMETRY, SERVICE_HIGHLIGHT_ICONS, SERVICE_ICONS } from '../src/app/data/dive-icons';
import { SITE_BENEFITS } from '../src/app/data/site-benefits';
import { MARINE_SERVICES, PADI_COURSES } from '../src/app/data/site-content';

assert.equal(Object.keys(DIVE_ICONS).length, 13);
assert.deepEqual(SITE_BENEFITS.map(benefit => benefit.icon), ['kayak', 'schedule', 'mask', 'tanks', 'coral', 'instructor']);
for (const [name, paths] of Object.entries(DIVE_ICONS)) {
  assert.ok(paths.length > 0, `Missing artwork: ${name}`);
  for (const path of paths) {
    assert.match(path.d, /^M[\d .,-]/, `Missing starting point: ${name}`);
    assert.match(path.d, /^[MmLlHhVvCcSsQqTtAaZz\d .,\-]+$/, `Unsupported SVG path token: ${name}`);
    if (path.transform) assert.match(path.transform, /^rotate\(-?[\d.]+ [\d.]+ [\d.]+\)$/, `Unexpected transform: ${name}`);
  }
}
assert.equal(KAYAK_GEOMETRY.axis, 40);
assert.equal(CYLINDER_GEOMETRY.axis, 40);
assert.match(CYLINDER_GEOMETRY.left[0], /M22 25V33/, 'The left neck must connect the manifold to the shoulder');
assert.match(CYLINDER_GEOMETRY.right[0], /M52 25V33/, 'The right neck must connect the manifold to the shoulder');
assert.equal(DIVE_ICON_STYLE.strokeWidth, 1.8);
for (const service of MARINE_SERVICES) {
  assert.ok(DIVE_ICONS[SERVICE_ICONS[service.icon]], `Missing service icon: ${service.id}`);
  const highlights = SERVICE_HIGHLIGHT_ICONS[service.id];
  assert.equal(highlights?.length, service.highlights.length, `Highlight icons out of sync: ${service.id}`);
  for (const icon of highlights) assert.ok(DIVE_ICONS[icon]);
}
for (const course of PADI_COURSES) {
  assert.ok(DIVE_ICONS[COURSE_ICONS[course.category]], `Missing course icon: ${course.id}`);
}
console.log('Diving icon checks passed: 13 SVG designs, six reference motifs, all services, activity highlights and PADI course categories.');
