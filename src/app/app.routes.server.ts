import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { MARINE_SERVICES, PADI_COURSES } from './data/site-content';

export const serverRoutes: ServerRoute[] = [
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
