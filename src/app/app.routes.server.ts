import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { MARINE_SERVICES, PADI_COURSES } from './data/site-content';
import { ISLAND_GUIDES } from './data/island-guides';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'lakshadweep/:islandSlug', renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    getPrerenderParams: async () => ISLAND_GUIDES.map(island => ({ islandSlug: island.slug }))
  },
  {
    path: 'courses/:courseId', renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    getPrerenderParams: async () => PADI_COURSES.map(course => ({ courseId: course.id }))
  },
  {
    path: 'experiences/:serviceId', renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    getPrerenderParams: async () => MARINE_SERVICES.map(service => ({ serviceId: service.id }))
  },
  { path: '**', renderMode: RenderMode.Prerender }
];
