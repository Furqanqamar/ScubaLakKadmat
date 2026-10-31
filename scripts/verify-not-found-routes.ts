import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import type { Route, UrlSegment } from '@angular/router';
import { ISLAND_GUIDES } from '../src/app/data/island-guides';
import { MARINE_SERVICES, PADI_COURSES } from '../src/app/data/site-content';
import { matchCourse, matchExperience, matchIsland } from '../src/app/route-matchers';

const source = await readFile('src/app/app.routes.ts', 'utf8');
for (const [path, matcher, identifiers] of [
  ['lakshadweep/:islandSlug', matchIsland, ISLAND_GUIDES.map(item => item.slug)],
  ['courses/:courseId', matchCourse, PADI_COURSES.map(item => item.id)],
  ['experiences/:serviceId', matchExperience, MARINE_SERVICES.map(item => item.id)]
] as const) {
  const route: Route = { path };
  const matcherName = path.startsWith('lakshadweep') ? 'matchIsland' : path.startsWith('courses') ? 'matchCourse' : 'matchExperience';
  assert.ok(source.includes(`path: '${path}',\n    canMatch: [${matcherName}]`), `${path}: apply the catalogue guard`);
  const segment = (value: string) => ({ path: value, parameters: {} } as UrlSegment);
  const segments = (id: string) => [segment(path.split('/')[0]), segment(id)];
  for (const id of identifiers) assert.equal(matcher(route, segments(id)), true, `Keep the valid page: ${id}`);
  for (const id of ['not-a-real-entry', 'undefined', '', 'KADMAT']) assert.equal(matcher(route, segments(id)), false, `Reject unknown entry: ${id}`);
  assert.equal(matcher(route, [...segments(identifiers[0]), segment('extra')]), false, 'Reject extra path segments');
}
assert.match(source, /\{ path: '\*\*', data: \{ layout: 'scene' \}, loadComponent: [^\n]+NotFoundComponent[^\n]+\}\s*\];/, 'Keep the immersive component-based wildcard fallback last, without a redirect');
console.log('404 routing passed: all 32 catalogue entries retained; invalid entries and extra segments fall through to the creative 404.');
