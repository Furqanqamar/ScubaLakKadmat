import { MARINE_SERVICES, PADI_COURSES } from './site-content';
import { SITE_COPY } from './site-copy';
import { islandGuide, islandIllustration } from './island-guides';

// Canonicals always belong to production; the GitHub QA build is noindex.
export const SITE_URL = 'https://www.scubalak.com/';
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
  '/faq': { title: 'Kadmat Diving FAQs: Booking, Travel & Permits | Scuba Lak', description: 'Find answers about Kadmat diving prices, first dives, PADI courses, Lakshadweep permits, travel, stays and changes. Still unsure? Ask the Scuba Lak team.', label: 'Frequently asked questions' },
  '/privacy-policy': { title: 'Privacy Policy | Scuba Lak Kadmat', description: 'How Scuba Lak Kadmat uses and protects enquiry information, your privacy choices, and how to contact the team with a question or deletion request.', label: 'Privacy policy' },
  '/booking-cancellation-policy': { title: 'Booking, Payment & Cancellation Policy | Scuba Lak Kadmat', description: 'Read how Scuba Lak confirms bookings, agrees prices and payments, and handles guest cancellations, weather changes and refund questions.', label: 'Booking & cancellation policy' },
  '/kadmat-accommodation': { title: 'Where to Stay in Kadmat: Independent Resorts & Homestays | Scuba Lak', description: 'Arrange Kadmat accommodation directly with third-party resorts or homestays. Scuba Lak focuses on diving and can help you contact local accommodation providers.', label: 'Where to stay in Kadmat' },
  '/lakshadweep-trip-planning': { title: 'Lakshadweep Travel: Ships, Agatti Flights & Permits | Scuba Lak', description: 'Plan a Kadmat visit by ship or flight to Agatti. Find official permit and ship-booking links, island-transfer advice and independent stay guidance from Scuba Lak.', label: 'Lakshadweep transport and Kadmat trip planning' },
  '/kadmat-visit-planning': { title: 'When to Plan Kadmat Diving: Weather & Preparation | Scuba Lak', description: 'Plan your Kadmat diving dates with practical notes on sea conditions, activity timing, what to bring and booking flexibility. Confirm current arrangements with Scuba Lak.', label: 'When to plan Kadmat diving' },
  '/kadmat-beyond-diving': { title: 'Kadmat Beyond Diving: Island Life & Responsible Visits | Scuba Lak', description: 'Make room for Kadmat’s shore and lagoon. Read simple island etiquette, reef-care and activity-planning guidance for a considerate Lakshadweep visit.', label: 'Kadmat beyond diving' }
};
export function canonicalUrl(path: string): string {
  return new URL(path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/', SITE_URL).href;
}
export function pageSeo(path: string): PageSeo | undefined {
  const island = path.startsWith('/lakshadweep/') ? islandGuide(path.slice('/lakshadweep/'.length)) : undefined;
  if (island) return { title: `${island.name}: Island Story & Travel Notes | Scuba Lak`, description: island.summary, label: island.name, image: islandIllustration(island.slug).src };
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
  if (path.startsWith('/lakshadweep/')) items.push({ label: 'Lakshadweep island atlas', path: '/lakshadweep' });
  if (path !== '/') items.push({ label: pageSeo(path)?.label ?? 'Page not found', path });
  return items;
}
