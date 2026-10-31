import { CanMatchFn } from '@angular/router';
import { ISLAND_GUIDES } from './data/island-guides';
import { MARINE_SERVICES, PADI_COURSES } from './data/site-content';

/** Unknown catalogue entries fall through to the same wildcard 404 as other bad URLs. */
export function matchCatalogue(values: readonly string[]): CanMatchFn {
  const known = new Set(values);
  return (_route, segments) => segments.length === 2 && known.has(segments[1].path);
}

export const matchIsland = matchCatalogue(ISLAND_GUIDES.map(island => island.slug));
export const matchCourse = matchCatalogue(PADI_COURSES.map(course => course.id));
export const matchExperience = matchCatalogue(MARINE_SERVICES.map(service => service.id));
