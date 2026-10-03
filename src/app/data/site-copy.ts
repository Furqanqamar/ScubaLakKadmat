export const SITE_COPY = {
  imagery: {
    illustration: 'AI-generated illustration',
    islandNote: 'Selected island scenes are AI-generated interpretations, not photographs of the exact locations.'
  },
  brand: {
    name: 'Scuba Lak',
    tagline: 'Kadmat Lakshadweep',
    logoSrc: 'media/scuba-lak-logo.png',
    faviconSrc: 'media/scuba-lak-logo-white.png',
    homeLabel: 'Scuba Lak, Kadmat Lakshadweep home'
  },
  navigation: {
    primaryLabel: 'Primary navigation',
    toggleLabel: 'Toggle navigation',
    experiences: 'Experiences',
    courses: 'PADI courses',
    island: 'Know island',
    about: 'About us',
    gallery: 'Gallery',
    accommodation: 'Kadmat accommodation',
    tripPlanning: 'Plan your island trip',
    contact: 'Contact',
    contactDesk: 'Contact the dive desk',
    planDive: 'Plan your dive'
  },
  actions: {
    explore: 'Explore',
    exploreExperiences: 'Explore experiences',
    knowKadmat: 'Know Kadmat',
    buildTrip: 'Build this trip',
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
  footer: {
    imageNote: 'Our team photographs and hero film are original Scuba Lak media. Other scenes include AI-generated illustrations inspired by island life, diving and travel; these are not documentary photographs or a guarantee of specific facilities.',
    legal: 'Scuba Lak · Kadmat Island · Lakshadweep · Dive softly · travel lightly · © 2026',
    socialNote: 'Social links are ready for your official handles'
  },
  common: {
    kadmatLocation: 'Kadmat Island · Lakshadweep',
    emailClient: 'Open your email client',
    fastestResponse: 'Fastest response · day or night',
    continueWhatsApp: 'Continue in WhatsApp',
    sendEnquiry: 'Send enquiry',
    dismiss: 'Dismiss'
  },
  seo: {
    home: {
      title: 'Scuba Diving in Kadmat, Lakshadweep | Scuba Lak',
      description: 'Explore scuba diving in Kadmat, Lakshadweep with Scuba Lak. Discover lagoon dives, PADI courses, snorkelling, kayaking and island-trip planning.'
    },
    about: {
      title: 'About Scuba Lak, Kadmat Lakshadweep',
      description: 'Meet the local-led Scuba Lak team, our PADI standards, island history and reef-minded approach.'
    },
    lakshadweep: {
      title: 'Lakshadweep island guide | Scuba Lak',
      description: 'Explore Lakshadweep’s coral islands, culture, nature, permits, tourism and responsible travel notes.'
    },
    kadmat: {
      title: 'Kadmat Island guide | Scuba Lak, Lakshadweep',
      description: 'Plan a Kadmat Island visit with lagoon attractions, reef locations, transport options and island context.'
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
      description: 'Contact Scuba Lak for diving, PADI courses, permits, island stays, transport and water sports.'
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
