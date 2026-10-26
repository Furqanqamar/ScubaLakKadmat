import { BRAND_ASSETS } from './brand-assets.generated';

export const SITE_COPY = {
  brand: {
    name: 'Scuba Lak',
    tagline: 'Kadmat Lakshadweep',
    logoSrc: BRAND_ASSETS.logoSrc,
    logoSrcset: BRAND_ASSETS.logoSrcset,
    homeLabel: 'Scuba Lak, Kadmat Lakshadweep home'
  },
  navigation: {
    primaryLabel: 'Primary navigation',
    toggleLabel: 'Toggle navigation',
    closeLabel: 'Close navigation',
    menuTitle: 'Explore Scuba Lak',
    experiences: 'Experiences',
    courses: 'PADI courses',
    island: 'Kadmat',
    archipelago: 'Lakshadweep atlas',
    about: 'About us',
    gallery: 'Gallery',
    accommodation: 'Where to stay',
    tripPlanning: 'Plan your island trip',
    contact: 'Contact',
    contactDesk: 'Contact the dive desk',
    planDive: 'Plan your dive'
  },
  actions: {
    explore: 'Explore',
    exploreExperiences: 'Explore experiences',
    knowKadmat: 'Know Kadmat',
    askIslandTeam: 'Ask the island team',
    scrollToTop: 'Scroll to top',
    returnHome: 'Return to home page'
  },
  transition: {
    loading: 'Loading the next page',
    defaultLabel: 'Into the blue',
    home: 'The reef starts here',
    kadmat: 'Kadmat Island',
    lakshadweep: 'Lakshadweep',
    courses: 'The course desk',
    experiences: 'Choose your depth',
    gallery: 'Frames of Kadmat',
    contact: 'The island desk',
    about: 'The people behind the bubbles',
    coordinate: '11° 13′ N · 72° 46′ E'
  },
  courseBookingNote: {
    eyebrow: 'A note before you book',
    body: 'Course schedules, equipment inclusion, boat arrangements and minimum participant numbers can vary. Contact our dive team to plan your course around your dates and group. All participants complete the required PADI medical and administrative forms; certification depends on satisfactory performance, not only the number of days or dives.'
  },
  footer: {
    navigationLabel: 'Footer navigation',
    socialLabel: 'Scuba Lak social profiles',
    legal: 'Scuba Lak · Kadmat Island · Lakshadweep · Dive softly · travel lightly · © 2026',
  },
  common: {
    kadmatLocation: 'Kadmat Island · Lakshadweep',
    emailClient: 'Open your email client',
    continueWhatsApp: 'Continue in WhatsApp',
    sendEnquiry: 'Send enquiry',
    dismiss: 'Dismiss'
  },
  seo: {
    home: {
      title: 'Scuba Diving in Kadmat, Lakshadweep | Scuba Lak',
      description: 'Dive Kadmat with Scuba Lak: lagoon experiences, PADI courses, 19 named dive spots, snorkelling and kayaking with a friendly island team in Lakshadweep.'
    },
    about: {
      title: 'About Scuba Lak, Kadmat Lakshadweep',
      description: 'Meet Scuba Lak in Kadmat, Lakshadweep, and explore the team, diving experiences and island life.'
    },
    lakshadweep: {
      title: 'Lakshadweep island guide | Scuba Lak',
      description: 'Explore Lakshadweep’s coral islands, culture, nature, permits, tourism and responsible travel notes.'
    },
    kadmat: {
      title: 'Kadmat Island Diving & Water Activities | Scuba Lak',
      description: 'Explore Kadmat Island diving with Scuba Lak: 19 named dive spots, lagoon experiences, water activities and a friendly local team in Lakshadweep.'
    },
    experiences: {
      title: 'Diving and water sports | Scuba Lak, Kadmat',
      description: 'Choose lagoon diving, deep sea diving, PADI training or water sports on Kadmat Island.'
    },
    courses: {
      title: 'PADI Diving Courses in Kadmat, Lakshadweep | Scuba Lak',
      description: 'Compare PADI courses in Kadmat, Lakshadweep: Open Water, Advanced, Rescue and more. Explore prerequisites, duration and skills before choosing your training.'
    },
    gallery: {
      title: 'Kadmat Island gallery | Scuba Lak',
      description: 'See the lagoon, reef, silver sands, boats and everyday island beauty of Kadmat, Lakshadweep.'
    },
    contact: {
      title: 'Contact Scuba Lak dive desk | Kadmat Lakshadweep',
      description: 'Contact Scuba Lak in Kadmat for diving, PADI courses and water sports. Ask for introductions to independent resorts or homestay hosts if needed.'
    },
    detail: {
      title: 'Experience details | Scuba Lak, Kadmat Lakshadweep',
      description: 'Explore the details, preparation, safety and inclusions for a Scuba Lak experience in Kadmat.'
    },
    courseDetail: {
      title: 'PADI course details | Scuba Lak, Kadmat Lakshadweep',
      description: 'Review prerequisites, duration, training structure, skills taught and outcomes for this PADI course.'
    }
  }
} as const;

export type SiteCopy = typeof SITE_COPY;
