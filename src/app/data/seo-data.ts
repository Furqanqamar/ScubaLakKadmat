import { MARINE_SERVICES, PADI_COURSES } from './site-content';
import { SITE_COPY } from './site-copy';

// Update when the permanent domain is ready; regenerate the static build.
export const SITE_URL = 'https://furqanqamar.github.io/ScubaLakKadmat/';
export interface PageSeo { readonly title: string; readonly description: string; readonly label: string; readonly image?: string; }
export const SEO_PAGES: Readonly<Record<string, PageSeo>> = {
  '/': { ...SITE_COPY.seo.home, label: 'Home' },
  '/about': { ...SITE_COPY.seo.about, label: 'About Scuba Lak' },
  '/lakshadweep': { ...SITE_COPY.seo.lakshadweep, label: 'Lakshadweep island guide' },
  '/kadmat': { ...SITE_COPY.seo.kadmat, label: 'Kadmat Island guide' },
  '/experiences': { ...SITE_COPY.seo.experiences, label: 'Diving & water sports' },
  '/courses': { ...SITE_COPY.seo.courses, label: 'PADI diving courses' },
  '/gallery': { ...SITE_COPY.seo.gallery, label: 'Gallery' },
  '/contact': { ...SITE_COPY.seo.contact, label: 'Contact' },
  '/kadmat-accommodation': { title: 'Kadmat Accommodation & Diving Stay Planning | Scuba Lak', description: 'Plan accommodation for a Kadmat diving holiday in Lakshadweep. Compare stay priorities, transfers and package inclusions before requesting a tailored quote.', label: 'Kadmat accommodation' },
  '/lakshadweep-trip-planning': { title: 'Lakshadweep Trip Planning: Kadmat Travel Guide | Scuba Lak', description: 'Plan a Kadmat Island holiday around diving, water sports and accommodation. Find questions to ask about Lakshadweep permits, arrivals, transfers and trip costs.', label: 'Lakshadweep trip planning' }
};
export function canonicalUrl(path: string): string {
  return new URL(path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/', SITE_URL).href;
}
export function pageSeo(path: string): PageSeo | undefined {
  const course = PADI_COURSES.find(item => path === `/courses/${item.id}`);
  if (course) return { title: `${course.title} in Kadmat | Scuba Lak`, description: `Explore ${course.title} in Kadmat, Lakshadweep. Review prerequisites, duration, training skills and course structure before planning your dive trip.`, label: course.title, image: course.imageUrl };
  const service = MARINE_SERVICES.find(item => path === `/experiences/${item.id}`);
  if (service) return { title: `${service.title} in Kadmat, Lakshadweep | Scuba Lak`, description: service.description, label: service.title, image: service.imageUrl };
  return SEO_PAGES[path];
}
export function breadcrumbs(path: string): readonly { label: string; path: string }[] {
  const items = [{ label: 'Home', path: '/' }];
  if (path.startsWith('/courses/')) items.push({ label: 'PADI courses', path: '/courses' });
  if (path.startsWith('/experiences/')) items.push({ label: 'Experiences', path: '/experiences' });
  if (path !== '/') items.push({ label: pageSeo(path)?.label ?? 'Page not found', path });
  return items;
}
