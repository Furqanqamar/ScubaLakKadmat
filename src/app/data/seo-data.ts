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

type SearchCopy = Pick<PageSeo, 'title' | 'description'>;

const COURSE_SEARCH_COPY: Readonly<Record<string, SearchCopy>> = {
  'scuba-diver': {
    title: 'PADI Scuba Diver Course in Kadmat | Scuba Lak',
    description: 'Explore PADI Scuba Diver training in Kadmat, Lakshadweep: an entry-level certification for supervised diving. Check prerequisites and your course plan.'
  },
  'open-water-diver': {
    title: 'PADI Open Water Course in Kadmat, Lakshadweep | Scuba Lak',
    description: 'Learn to scuba dive with the PADI Open Water course in Kadmat, Lakshadweep. Review swimming requirements, four open-water dives and course planning.'
  },
  'advanced-open-water': {
    title: 'PADI Advanced Open Water in Kadmat | Scuba Lak',
    description: 'Build experience with five Adventure Dives on the PADI Advanced Open Water course in Kadmat, Lakshadweep. Review entry requirements and training options.'
  },
  'rescue-diver': {
    title: 'PADI Rescue Diver Course in Kadmat | Scuba Lak',
    description: 'Develop diver awareness and rescue skills in Kadmat, Lakshadweep. Review PADI Rescue Diver prerequisites, practice scenarios and indicative duration.'
  },
  'adaptive-techniques': {
    title: 'PADI Adaptive Techniques in Kadmat | Scuba Lak',
    description: 'Explore PADI Adaptive Techniques training in Kadmat, Lakshadweep. Review professional entry requirements and approaches to more inclusive dive teaching.'
  },
  'divemaster': {
    title: 'PADI Divemaster Training in Kadmat | Scuba Lak',
    description: 'Plan PADI Divemaster training in Kadmat, Lakshadweep. Review logged-dive prerequisites, watermanship, guiding skills and indicative training formats.'
  },
  'emergency-first-response-instructor': {
    title: 'EFR Instructor Training in Kadmat | Scuba Lak',
    description: 'Explore EFR Instructor training in Kadmat, Lakshadweep. Review eligibility, teaching workshops and the programmes covered by active instructor status.'
  },
  'assistant-instructor': {
    title: 'PADI Assistant Instructor in Kadmat | Scuba Lak',
    description: 'Explore PADI Assistant Instructor training in Kadmat, Lakshadweep. Review prerequisites, teaching presentations and the instructor-development pathway.'
  },
  'bubblemaker': {
    title: 'PADI Bubblemaker in Kadmat: Children’s Scuba | Scuba Lak',
    description: 'Discover PADI Bubblemaker in Kadmat, Lakshadweep: a supervised shallow-water scuba experience for children aged eight and up. Check suitability with the team.'
  },
  'seal-team': {
    title: 'PADI Seal Team in Kadmat: Kids’ Scuba Skills | Scuba Lak',
    description: 'Explore PADI Seal Team in Kadmat, Lakshadweep: pool-based AquaMissions for children aged eight and up. Review supervision, suitability and programme structure.'
  },
  'discover-scuba-diving': {
    title: 'PADI Discover Scuba Diving in Kadmat | Scuba Lak',
    description: 'Try PADI Discover Scuba Diving in Kadmat, Lakshadweep before choosing certification. Review supervised practice, suitability and available programme formats.'
  }
};

const EXPERIENCE_SEARCH_COPY: Readonly<Record<string, SearchCopy>> = {
  'lagoon-diving': {
    title: 'Beginner Scuba Diving in Kadmat, Lakshadweep | Scuba Lak',
    description: 'Try a guided lagoon dive in Kadmat, Lakshadweep. Explore a shallow first dive, suitability, included equipment and photos, and a personalised quote.'
  },
  'deep-sea-diving': {
    title: 'Deep Sea Diving in Kadmat, Lakshadweep | Scuba Lak',
    description: 'Already certified? Plan a guided dive on Kadmat’s outer reefs in Lakshadweep. Check experience requirements, dive time, equipment and local transport.'
  },
  'padi-courses': {
    title: 'Learn to Dive in Kadmat: Choose Your PADI Path | Scuba Lak',
    description: 'New to diving or already certified? Find your PADI starting point in Kadmat, Lakshadweep, then compare course prerequisites, schedules and training with Scuba Lak.'
  },
  'water-sports': {
    title: 'Snorkelling, Kayaking & Water Sports in Kadmat | Scuba Lak',
    description: 'Explore snorkelling, kayaking, glass-bottom boat rides and fishing in Kadmat, Lakshadweep. Ask Scuba Lak about suitability, availability and your activity plan.'
  }
};

export function canonicalUrl(path: string): string {
  return new URL(path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/', SITE_URL).href;
}
export function pageSeo(path: string): PageSeo | undefined {
  const island = path.startsWith('/lakshadweep/') ? islandGuide(path.slice('/lakshadweep/'.length)) : undefined;
  if (island) return { title: `${island.name}: Island Story & Travel Notes | Scuba Lak`, description: island.summary, label: island.name, image: islandIllustration(island.slug).src };
  const course = PADI_COURSES.find(item => path === `/courses/${item.id}`);
  if (course) return {
    ...(COURSE_SEARCH_COPY[course.id] ?? { title: `${course.title} in Kadmat | Scuba Lak`, description: `${course.shortDescription} Train with Scuba Lak in Kadmat, Lakshadweep.` }),
    label: course.title,
    image: course.imageUrl
  };
  const service = MARINE_SERVICES.find(item => path === `/experiences/${item.id}`);
  if (service) return {
    ...(EXPERIENCE_SEARCH_COPY[service.id] ?? { title: `${service.title} in Kadmat, Lakshadweep | Scuba Lak`, description: service.description }),
    label: service.title,
    image: service.imageUrl
  };
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
