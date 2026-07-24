import {
  CompanyMilestone,
  ContactDetails,
  DestinationBriefing,
  GalleryItem,
  IslandProfile,
  KadmatAttraction,
  MarineService,
  PadiCourse,
  SocialLink,
  TeamMember,
  Testimonial,
  TransportOption,
  TourPackage
} from '../models/site-data.model';

const LOCAL_IMAGE_BASE = 'media/lakshadweep';

const REAL_IMAGE_ASSETS: Readonly<Record<string, string>> = {
  'photo-1500534623283-312aade485b7': 'optimized/agatti-beach.jpg',
  'photo-1507525428034-b723cf961d3e': 'optimized/kadmat-reference.jpg',
  'photo-1510414842594-a61c69b5ae57': 'optimized/agatti-sunset.jpg',
  'photo-1493552152660-f915ab47ae9d': 'optimized/island-view-1.jpg',
  'photo-1500375592092-40eb2168fd21': 'optimized/island-view-2.jpg',
  'photo-1544551763-46a013bb70d5': 'optimized/agatti-shallow-boat.jpg',
  'photo-1530053969600-caed2596d242': 'optimized/underwater-1.jpg',
  'photo-1473116763249-2faaef81ccda': 'optimized/kadmat-kayaks.jpg',
  'photo-1529156069898-49953e39b3ac': 'optimized/island-view-3.jpg',
  'photo-1500530855697-b586d89ba3ee': 'optimized/island-view-4.jpg',
  'photo-1469474968028-56623f02e42e': 'optimized/island-view-2.jpg',
  'photo-1436491865332-7a61a109cc05': 'optimized/agatti-airport.jpg',
  'photo-1474302770737-173ee21bab63': 'optimized/island-view-3.jpg',
  'photo-1508614589041-895b88991e3e': 'optimized/island-view-4.jpg',
  'photo-1559757175-0eb30cd8c063': 'optimized/underwater-2.jpg',
  'photo-1560275619-4662e36fa65c': 'optimized/underwater-1.jpg',
  'photo-1518495973542-4542c06a5843': 'optimized/underwater-1.jpg',
  'photo-1516280440614-37939bbacd81': 'optimized/underwater-2.jpg',
  'photo-1544551763-77ef2d0cfc6c': 'optimized/underwater-2.jpg',
  'photo-1539635278303-d4002c07eae3': 'optimized/kadmat-kayaks.jpg',
  'photo-1576091160399-112ba8d25d1d': 'optimized/underwater-1.jpg',
  'photo-1497250681960-ef046c08a56e': 'optimized/kadmat-wind-boat.jpg',
  'photo-1518709268805-4e9042af9f23': 'optimized/underwater-2.jpg',
  'photo-1531058020387-3be344556be6': 'optimized/kadmat-water-sports.jpg',
  'photo-1521791136064-7986c2920216': 'optimized/underwater-1.jpg',
  'photo-1521737711867-e3b97375f902': 'optimized/underwater-2.jpg',
  'photo-1504159506876-f8338247a14a': 'optimized/kadmat-kayaks.jpg',
  'photo-1544550285-f813152fb2fd': 'optimized/underwater-2.jpg'
};

const image = (id: string, width = 1200): string => {
  const localAsset = REAL_IMAGE_ASSETS[id];
  if (localAsset) {
    return `${LOCAL_IMAGE_BASE}/${localAsset}`;
  }

  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
};

export const LAKSHADWEEP_ISLANDS: readonly IslandProfile[] = [
  {
    name: 'Agatti',
    type: 'Airport island',
    orientation: 'Gateway atoll',
    description: 'A slender coral island with the territory’s main air gateway, lagoon beaches and easy access to reef time.',
    highlight: 'The easiest first hello to Lakshadweep.',
    imageUrl: image('photo-1500534623283-312aade485b7')
  },
  {
    name: 'Amini',
    type: 'Inhabited island',
    orientation: 'Craft & lagoon life',
    description: 'A close-knit island known for traditional craft, coconut groves and the everyday rhythm of a lagoon community.',
    highlight: 'Local life with a soft blue horizon.',
    imageUrl: image('photo-1507525428034-b723cf961d3e')
  },
  {
    name: 'Andrott',
    type: 'Inhabited island',
    orientation: 'History & culture',
    description: 'The largest inhabited island, with a deeper cultural history, broad island roads and a more settled mainland feeling.',
    highlight: 'A window into island memory.',
    imageUrl: image('photo-1510414842594-a61c69b5ae57')
  },
  {
    name: 'Bangaram',
    type: 'Uninhabited resort island',
    orientation: 'Barefoot escape',
    description: 'A picture-book atoll of sand, reef and open sky, visited for its quiet beaches and feeling of being far away.',
    highlight: 'The castaway chapter.',
    imageUrl: image('photo-1493552152660-f915ab47ae9d')
  },
  {
    name: 'Bitra',
    type: 'Inhabited island',
    orientation: 'Small-island quiet',
    description: 'The smallest inhabited island is intimate and low-key, with the reef close to daily life and few distractions.',
    highlight: 'Small scale, big sky.',
    imageUrl: image('photo-1500375592092-40eb2168fd21')
  },
  {
    name: 'Chetlat',
    type: 'Inhabited island',
    orientation: 'Northern atoll',
    description: 'A northern coral island shaped by coconut palms, turquoise shallows and a community that still moves with the sea.',
    highlight: 'A slower northern tide.',
    imageUrl: image('photo-1544551763-46a013bb70d5')
  },
  {
    name: 'Kadmat',
    type: 'Diving island',
    orientation: 'Western lagoon',
    description: 'An eight-kilometre ribbon of silver sand and turquoise water, built for reef visibility, water sports and long walks.',
    highlight: 'The Scuba Lak home base.',
    imageUrl: `${LOCAL_IMAGE_BASE}/optimized/kadmat-reference.jpg`
  },
  {
    name: 'Kalpeni',
    type: 'Inhabited island',
    orientation: 'Lagoon & sandbanks',
    description: 'A broad lagoon setting with sandbanks, water time and a strong connection between village life and the reef edge.',
    highlight: 'Big lagoon, gentle pace.',
    imageUrl: image('photo-1473116763249-2faaef81ccda')
  },
  {
    name: 'Kavaratti',
    type: 'Capital island',
    orientation: 'Culture & administration',
    description: 'The administrative capital pairs calm lagoons with mosques, food, local stories and the most visible civic life in the territory.',
    highlight: 'The cultural centre of the chain.',
    imageUrl: image('photo-1529156069898-49953e39b3ac')
  },
  {
    name: 'Kiltan',
    type: 'Inhabited island',
    orientation: 'Northern reef life',
    description: 'A narrow northern island where reef flats, palms and community life meet in a particularly uncluttered horizon.',
    highlight: 'A quiet edge of the archipelago.',
    imageUrl: image('photo-1500530855697-b586d89ba3ee')
  },
  {
    name: 'Minicoy',
    type: 'Inhabited island',
    orientation: 'Southern culture',
    description: 'Distinctive language, dance, boat traditions and Maldivian cultural links give Minicoy a character all its own.',
    highlight: 'A different rhythm within Lakshadweep.',
    imageUrl: image('photo-1469474968028-56623f02e42e')
  }
];

export const KADMAT_ATTRACTIONS: readonly KadmatAttraction[] = [
  {
    id: 'western-lagoon',
    title: 'The western turquoise lagoon',
    location: 'West coast · Kadmat',
    description: 'A long, shallow blue room for first dives, glass boats, snorkelling and the kind of sunset that turns the water silver.',
    imageUrl: image('photo-1507525428034-b723cf961d3e', 1400)
  },
  {
    id: 'silver-sands',
    title: 'Silver sand shoreline',
    location: 'Island-wide beach line',
    description: 'Walk the island by tide line, with coconut shade inland and a reef horizon that keeps opening in front of you.',
    imageUrl: image('photo-1510414842594-a61c69b5ae57', 1400)
  },
  {
    id: 'outer-reef',
    title: 'Outer-reef blue walls',
    location: 'West reef edge',
    description: 'Experienced divers can meet the drop-off, where the protected lagoon gives way to deeper open-ocean life and changing currents.',
    imageUrl: image('photo-1544550285-f813152fb2fd', 1400)
  },
  {
    id: 'reef-life',
    title: 'Coral gardens & marine life',
    location: 'Lagoon and reef sites',
    description: 'Look for reef fish, branching coral and the small, bright details that make slow, low-impact exploration so rewarding.',
    imageUrl: image('photo-1530053969600-caed2596d242', 1400)
  },
  {
    id: 'island-culture',
    title: 'Island culture in the everyday',
    location: 'Village and harbour',
    description: 'The island is not a backdrop. Notice the boats, food, faith, coconut crafts and the warm, practical hospitality of Kadmat life.',
    imageUrl: image('photo-1529156069898-49953e39b3ac', 1400)
  },
  {
    id: 'lagoon-paddle',
    title: 'Paddle at the tide’s pace',
    location: 'South lagoon',
    description: 'Kayak across glassy shallows, pause above the reef and let the island show you its quieter side.',
    imageUrl: image('photo-1473116763249-2faaef81ccda', 1400)
  }
];

export const KADMAT_TRANSPORT: readonly TransportOption[] = [
  {
    id: 'ship',
    mode: 'Ship',
    title: 'Passenger ship from Kochi',
    duration: 'Approx. 14–18 hours, vessel and sea conditions dependent',
    cost: 'Planning range: ₹3,500–₹8,500 one way',
    booking: 'Book through authorised Lakshadweep Tourism / SPORTS channels or a permitted local operator after your entry permit is arranged.',
    note: 'The most atmospheric route. Sailings are seasonal and schedules change with weather.',
    imageUrl: image('photo-1544551763-46a013bb70d5', 1400)
  },
  {
    id: 'flight',
    mode: 'Flight / plane',
    title: 'Fly to Agatti, then transfer',
    duration: 'Kochi to Agatti is usually around 1.5 hours; add the authorised boat or onward transfer to Kadmat.',
    cost: 'Planning range: ₹6,000–₹14,000 for the flight, plus permits and island transfers',
    booking: 'Reserve the flight with the operating airline, then coordinate the Agatti–Kadmat transfer through an authorised Lakshadweep operator.',
    note: 'Fastest scheduled option, but the final island leg must be planned as one itinerary.',
    imageUrl: image('photo-1436491865332-7a61a109cc05', 1400)
  },
  {
    id: 'seaplane',
    mode: 'Seaplane',
    title: 'Seasonal seaplane connection',
    duration: 'Often around 1–2 hours including water transfer, subject to the current route',
    cost: 'Quote on request; availability and fares are seasonal',
    booking: 'Ask an authorised Lakshadweep tourism operator to confirm whether a seaplane service is operating for your dates.',
    note: 'A beautiful option when operating, but never assume it is available year-round.',
    imageUrl: image('photo-1474302770737-173ee21bab63', 1400)
  },
  {
    id: 'helicopter',
    mode: 'Helicopter',
    title: 'Helicopter or medical / charter transfer',
    duration: 'Route and flight time vary; weather and operational clearance apply',
    cost: 'Quote on request; not a standard scheduled tourist transfer',
    booking: 'Use only official or authorised channels. Your island operator can advise whether a charter or permitted transfer is possible.',
    note: 'Availability is operational, not guaranteed. Never book through an unverified broker.',
    imageUrl: image('photo-1508614589041-895b88991e3e', 1400)
  }
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Instagram', handle: 'Add your official handle', href: 'https://www.instagram.com/', icon: 'fa-brands fa-instagram' },
  { label: 'Facebook', handle: 'Add your official page', href: 'https://www.facebook.com/', icon: 'fa-brands fa-facebook-f' },
  { label: 'WhatsApp', handle: 'Message the dive desk', href: 'https://wa.me/919447XXXXXX', icon: 'fa-brands fa-whatsapp' }
];

export const CONTACT_DETAILS: ContactDetails = {
  address: 'Scuba Lak, Kadmat Island',
  area: 'Lakshadweep, India · Arabian Sea',
  phone: '+91 9447 XX XX XX',
  email: 'hello@scubalak.com',
  officeHours: 'Every day · 08:00–20:00 IST',
  responseTime: 'Usually within one working day'
};

export const MARINE_SERVICES: readonly MarineService[] = [
  {
    id: 'lagoon-diving',
    category: 'Diving',
    icon: 'lagoon',
    eyebrow: 'Soft entry',
    title: 'Lagoon diving',
    description: 'A calm, shallow introduction to Kadmat\'s living coral garden - made for first breaths and non-swimmers.',
    detailedDescription: 'Move slowly through warm, sheltered water with a PADI professional beside you. At five metres, the lagoon opens up a luminous world of coral bommies, butterflyfish and shy reef life without the pressure of the open sea.',
    depth: '5 m',
    audience: 'Beginners & non-swimmers',
    duration: '2.5 hrs',
    badge: 'Beginner favourite',
    imageUrl: image('photo-1544551763-46a013bb70d5'),
    highlights: ['Full safety briefing', 'PADI pro in the water', 'Shallow coral exploration']
  },
  {
    id: 'deep-sea-diving',
    category: 'Diving',
    icon: 'deep-sea',
    eyebrow: 'Open ocean',
    title: 'Deep sea diving',
    description: 'Go where the reef wall falls away: blue-water drops, marine walls and the wild rhythm of the open ocean.',
    detailedDescription: 'For certified divers ready to meet the outer reef, Kadmat\'s western edge delivers dramatic walls, eagle rays and schools of pelagic life. The plan is always matched to your logged experience, comfort and the day\'s sea conditions.',
    depth: '30 m',
    audience: 'Advanced PADI divers',
    duration: '3.5 hrs',
    badge: 'Outer reef',
    imageUrl: image('photo-1544550285-f813152fb2fd'),
    highlights: ['Outer reef wall sites', 'Small group departures', 'Top-tier dive equipment']
  },
  {
    id: 'padi-courses',
    category: 'Course',
    icon: 'course',
    eyebrow: 'Get certified',
    title: 'PADI courses',
    description: 'Trade the holiday feeling for a new skill set. Learn at your pace with Open Water and Advanced Open Water tracks.',
    detailedDescription: 'From your first pool session to advanced navigation and deep-diving skills, our courses pair international PADI standards with the clarity of learning in a real island environment. Small groups keep every question welcome.',
    depth: '18 m',
    audience: 'New & certified divers',
    duration: '2-4 days',
    badge: 'Learn for life',
    imageUrl: image('photo-1530053969600-caed2596d242'),
    highlights: ['Open Water certification', 'Advanced Open Water', 'Flexible island schedule']
  },
  {
    id: 'water-sports',
    category: 'Water sports',
    icon: 'sports',
    eyebrow: 'Surface stories',
    title: 'Water sports',
    description: 'Keep the salt on your skin with glass-bottom boat rides, kayaking, snorkelling and deep sea fishing.',
    detailedDescription: 'Not every adventure needs a tank. Drift above the reef, paddle the lagoon at golden hour or head offshore with a local crew who knows the water\'s moods. Build your own mix of slow mornings and big blue afternoons.',
    depth: 'Surface',
    audience: 'Every kind of explorer',
    duration: '1-6 hrs',
    badge: 'Easygoing',
    imageUrl: image('photo-1500375592092-40eb2168fd21'),
    highlights: ['Glass boat ride', 'Guided kayaking', 'Lagoon snorkelling', 'Deep sea fishing']
  }
];

export const TOUR_PACKAGES: readonly TourPackage[] = [
  {
    id: 'budget',
    tone: 'sand',
    name: 'Barefoot basecamp',
    kicker: 'Budget friendly framework',
    tagline: 'Everything you need. Nothing you don\'t.',
    priceLabel: 'From INR 18,500',
    priceNote: 'per person - 3 nights / 4 days',
    description: 'A considered island escape that keeps the focus on clear water, slow mornings and the reef right outside your door.',
    idealFor: 'First-time island travellers, curious couples and small groups.',
    inclusions: ['Standard beachfront lodging', 'Guided lagoon snorkelling', 'Glass boat cruise', 'Entry permit processing', 'Breakfast and island transfers']
  },
  {
    id: 'premium',
    tone: 'coral',
    name: 'Blue room retreat',
    kicker: 'Premium luxury framework',
    tagline: 'A private side of the island.',
    priceLabel: 'From INR 42,000',
    priceNote: 'per person - 4 nights / 5 days',
    description: 'A slower, more spacious way into Kadmat, with the best gear, private guidance and meals shaped around the coast.',
    idealFor: 'Experienced divers, milestone trips and guests who want the island to themselves.',
    featured: true,
    inclusions: ['Private beach-facing AC villa', 'Multiple deep sea dives with top-tier gear', 'Private kayaking guide', 'Custom coastal meals', 'Priority permit and island transfers']
  }
];

export const DESTINATION_BRIEFINGS: readonly DestinationBriefing[] = [
  {
    id: 'lakshadweep',
    index: '01',
    label: 'The archipelago',
    title: 'Lakshadweep is still wonderfully hard to reach.',
    teaser: 'An exotic coral archipelago with a raw, untouched marine ecosystem and a deliberately limited number of visitors.',
    body: 'Lakshadweep is a chain of coral atolls and islands in the Arabian Sea, where turquoise water, reef flats and coconut-lined shores still set the pace. Restricted permit access protects the ecosystem and makes every arrival feel considered.',
    detail: 'Come with curiosity, patience and a light footprint. The quiet is part of the luxury.'
  },
  {
    id: 'kadmat',
    index: '02',
    label: 'Your island',
    title: 'Kadmat is eight kilometres of pure blue perspective.',
    teaser: 'A slim island jewel with a massive western lagoon, soft sand and the kind of reef visibility divers remember for years.',
    body: 'Kadmat\'s long, narrow shape gives the island a rare sense of horizon. Its western turquoise lagoon is made for easy water time, while the outer reef drops into deeper blue for experienced divers.',
    detail: 'Watch the light change across the lagoon. It never looks the same twice.'
  },
  {
    id: 'why-us',
    index: '03',
    label: 'Our standard',
    title: 'The good stuff is in the details.',
    teaser: 'Elite PADI professionals, top-tier oxygen and safety standards, and a deep commitment to leaving the reef better than we found it.',
    body: 'Our team brings international diving discipline to local knowledge. Every briefing is unhurried, every kit is checked, and every route considers the reef, the weather and the humans in our care.',
    detail: 'Small groups. Honest conditions. A respectful relationship with the sea.'
  }
];

export const PADI_COURSES: readonly PadiCourse[] = [
  {
    id: 'scuba-diver', category: 'Beginner certifications', eyebrow: 'Entry-level certification', title: 'PADI Scuba Diver',
    shortDescription: 'A shorter entry-level certification for people with limited time or who expect to dive mainly under professional supervision.',
    about: 'PADI Scuba Diver covers part of the full Open Water Diver programme and can later be upgraded to Open Water Diver. Certified Scuba Divers may dive to 12 metres, but only under the direct supervision of a PADI Divemaster, Assistant Instructor or Instructor.',
    duration: 'Usually 2 days', minimumAge: '10 years for Junior Scuba Diver', depth: '12 m / 40 ft under direct professional supervision',
    prerequisite: 'No previous scuba experience. Adequate swimming ability, general physical fitness and completed medical and liability documentation.',
    structure: ['3 knowledge-development sections', '3 confined-water training sessions', '2 open-water training dives'],
    taught: ['Pressure and equipment basics', 'Safe breathing and equalisation', 'Equipment assembly and use', 'Mask clearing and regulator recovery', 'Buoyancy, entries, exits and buddy procedures', 'Air monitoring, communication and basic emergency skills'],
    outcome: 'A recognised supervised-diving certification that can be upgraded to PADI Open Water Diver.', imageUrl: image('photo-1544551763-46a013bb70d5')
  },
  {
    id: 'open-water-diver', category: 'Beginner certifications', eyebrow: 'The complete first step', title: 'PADI Open Water Diver',
    shortDescription: 'The world\'s most recognised recreational scuba certification - your passport to diving with a certified buddy.',
    about: 'Open Water Diver develops the knowledge and practical skills required to plan and conduct dives with a certified buddy, within training and experience limits, without direct professional supervision.',
    duration: 'Usually 3-4 days with eLearning completed in advance', minimumAge: '10 years for Junior Open Water; adult rating normally from 15', depth: 'Adults normally up to 18 m / 60 ft; junior limits apply',
    prerequisite: 'No previous diving certification. Adequate swimming ability, suitable physical health, completed medical questionnaire and required forms.',
    structure: ['5 knowledge-development sections', '5 confined-water sessions', '4 open-water certification dives', 'Water-skills assessment including swim and survival float or tread-water exercise'],
    taught: ['Diving physics and physiology', 'Dive planning and no-decompression limits', 'Equipment care, assembly and pre-dive checks', 'Mask, regulator and alternate-air-source skills', 'Buoyancy, hovering, navigation and controlled ascents', 'Emergency procedures and responsible environmental awareness'],
    outcome: 'Certification to dive with another appropriately certified diver, generally to 18 metres, subject to local conditions, law, training and experience.', imageUrl: image('photo-1530053969600-caed2596d242')
  },
  {
    id: 'advanced-open-water', category: 'Continuing education', eyebrow: 'Five ways to go further', title: 'PADI Advanced Open Water Diver',
    shortDescription: 'Build practical confidence through five Adventure Dives, with Deep and Underwater Navigation as the required core.',
    about: 'Advanced Open Water is experience-led rather than classroom-heavy. Deep Diving and Underwater Navigation are compulsory, while three additional Adventure Dives are selected around your interests and local conditions.',
    duration: 'Usually 2-3 days with 5 open-water dives', minimumAge: '12 years for Junior Advanced Open Water', depth: 'Adults generally up to 30 m / 100 ft; junior depth limits continue',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or a qualifying certification from another recognised training organisation.',
    structure: ['Deep Adventure Dive', 'Underwater Navigation Adventure Dive', '3 elective Adventure Dives such as buoyancy, night, wreck, photography, nitrox or fish identification'],
    taught: ['Deep-dive planning and narcosis awareness', 'Gas consumption and depth effects', 'Compass and natural navigation', 'Improved buoyancy and trim', 'Specialised communication, photography, search or boat skills depending on electives'],
    outcome: 'A stronger recreational foundation and a pathway toward a 30 metre maximum recreational depth for eligible adult divers.', imageUrl: image('photo-1544550285-f813152fb2fd')
  },
  {
    id: 'emergency-first-response', category: 'First aid & safety', eyebrow: 'Ready above and below water', title: 'Emergency First Response Primary & Secondary Care',
    shortDescription: 'CPR and first-aid training for divers and non-divers, built around real-world emergency response skills.',
    about: 'Emergency First Response teaches how to respond to immediately life-threatening and non-life-threatening conditions. It is commonly required before PADI Rescue Diver and should generally be current within the preceding 24 months for Rescue eligibility.',
    duration: 'Usually 1 day / approximately 4-8 hours', minimumAge: 'No universal diving-related minimum age', depth: 'No water session required',
    prerequisite: 'No scuba certification or diving experience. Participants must be capable of understanding and performing the skills.',
    structure: ['Independent knowledge development', 'Instructor demonstrations', 'Hands-on skill practice', 'Emergency scenarios'],
    taught: ['Scene safety and barrier use', 'Responsiveness assessment and CPR', 'Rescue breathing and AED use', 'Serious bleeding, shock and choking response', 'Injury and illness assessment', 'Bandaging, splinting, monitoring and escalation to medical help'],
    outcome: 'Current CPR and first-aid competence for everyday emergencies and progression into Rescue Diver where applicable.', imageUrl: image('photo-1559757175-0eb30cd8c063')
  },
  {
    id: 'rescue-diver', category: 'Continuing education', eyebrow: 'Look out for the whole team', title: 'PADI Rescue Diver',
    shortDescription: 'Develop awareness, problem-solving ability and confidence to recognise and assist other divers.',
    about: 'Rescue Diver shifts your attention from managing only your own needs to recognising and managing diver stress, minor problems and emergencies before they become serious.',
    duration: 'Usually 2-3 days, excluding EFR training', minimumAge: '12 years for Junior Rescue Diver', depth: 'Training limits set by instructor and conditions',
    prerequisite: 'PADI Adventure Diver with Underwater Navigation, or qualifying certification; current CPR and first-aid training within the previous 24 months. Advanced Open Water is strongly recommended.',
    structure: ['Knowledge development', 'Rescue-skill practice sessions', 'Open-water rescue exercises', 'At least 2 comprehensive rescue scenarios', 'Emergency-assistance plan'],
    taught: ['Self-rescue review and diver stress', 'Tired, panicked and distressed diver assistance', 'Missing-diver searches', 'Surfacing and removing an unresponsive diver', 'In-water rescue breathing and emergency coordination', 'Accident prevention and risk management'],
    outcome: 'A major confidence and safety milestone, and an important prerequisite for PADI Divemaster.', imageUrl: image('photo-1560275619-4662e36fa65c')
  },
  {
    id: 'deep-diver', category: 'Specialty diver courses', eyebrow: 'Go beyond the familiar', title: 'PADI Deep Diver',
    shortDescription: 'Plan and conduct recreational dives beyond the normal Open Water range, progressively reaching 40 metres.',
    about: 'Deep Diver builds gas-management, planning, narcosis-awareness, buddy-contact, buoyancy and safety skills for recreational diving beyond the Open Water depth range.',
    duration: 'Usually 2 days', minimumAge: '15 years', depth: 'Progressively up to 40 m / 130 ft',
    prerequisite: 'PADI Adventure Diver or a qualifying certification.',
    structure: ['Knowledge development', '4 open-water deep dives', 'Deep Adventure Dive may count as the first specialty dive when applicable'],
    taught: ['Deep-dive planning and gas management', 'Nitrogen narcosis awareness', 'No-decompression limits and emergency gas planning', 'Buoyancy control, buddy contact and safety stops', 'Special equipment and depth procedures'],
    outcome: 'PADI Deep Diver specialty certification within recreational standards and instructor judgement.', imageUrl: image('photo-1544550285-f813152fb2fd')
  },
  {
    id: 'digital-underwater-photographer', category: 'Specialty diver courses', eyebrow: 'Make the blue memorable', title: 'PADI Digital Underwater Photographer',
    shortDescription: 'Create clearer, better-composed and more colourful underwater photographs while protecting marine life.',
    about: 'Learn camera-system choice, housing care, composition, colour management, lighting and backscatter reduction so your images show the reef as you experienced it.',
    duration: 'Usually 1-2 days', minimumAge: 'Normally 10 years', depth: 'Set by training environment and diver qualification',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification. Adapted confined-water versions may have different requirements.',
    structure: ['Knowledge development', '2 open-water dives', 'Confined-water adapted versions may be available'],
    taught: ['Camera and housing preparation', 'Leak prevention and maintenance', 'Composition and getting close safely', 'White balance, strobes and camera settings', 'Backscatter reduction and image review', 'Responsible behaviour around marine life'],
    outcome: 'A practical foundation for producing more intentional underwater images.', imageUrl: image('photo-1518495973542-4542c06a5843')
  },
  {
    id: 'enriched-air-nitrox', category: 'Specialty diver courses', eyebrow: 'More time in the right places', title: 'PADI Enriched Air Diver - Nitrox',
    shortDescription: 'Learn to plan and use enriched air with a higher oxygen percentage and lower nitrogen load than standard air.',
    about: 'The course covers benefits, limitations, oxygen exposure, operating depth, cylinder analysis, labelling and dive-computer settings for nitrox.',
    duration: 'Usually half a day to 1 day', minimumAge: '12 years', depth: 'Maximum operating depth determined by gas analysis and training',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification.',
    structure: ['Knowledge development', 'Oxygen-analysis and cylinder-management exercises', 'Optional enriched-air dives; open-water dives are not always required'],
    taught: ['Benefits and limitations of enriched air', 'Oxygen-toxicity risk and maximum operating depth', 'Cylinder analysis, labelling and documentation', 'Nitrox dive planning and computer settings', 'Safe handling and equipment considerations'],
    outcome: 'The knowledge and practical skills to use enriched air safely within training limits.', imageUrl: image('photo-1516280440614-37939bbacd81')
  },
  {
    id: 'night-diver', category: 'Specialty diver courses', eyebrow: 'Meet the reef after sunset', title: 'PADI Night Diver',
    shortDescription: 'Discover night-active marine life while building confidence with lights, communication and navigation in limited visibility.',
    about: 'Night Diver trains divers to plan, organise and conduct dives after sunset, with careful attention to controlled descents, ascents, light failure and protecting night-active marine life.',
    duration: 'Usually 2-3 evenings', minimumAge: '12 years', depth: 'Set by instructor, site and diver experience',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification.',
    structure: ['Knowledge development', '3 night dives'],
    taught: ['Primary and backup-light selection', 'Light signals and buddy communication', 'Navigation and orientation at night', 'Safe entries, exits, descents and ascents', 'Limited-visibility and light-failure management'],
    outcome: 'PADI Night Diver specialty certification and a more confident after-dark dive routine.', imageUrl: image('photo-1544551763-77ef2d0cfc6c')
  },
  {
    id: 'adaptive-support-diver', category: 'Specialty diver courses', eyebrow: 'Buddy better', title: 'PADI Adaptive Support Diver',
    shortDescription: 'Become a more capable, respectful buddy for divers with physical or mental challenges.',
    about: 'Adaptive Support Diver focuses on awareness, respectful communication and practical assistance without unnecessarily reducing another diver\'s independence.',
    duration: 'Usually 1-2 days', minimumAge: 'Normally 15 years', depth: 'Set by training environment and participant readiness',
    prerequisite: 'PADI Open Water Diver or qualifying certification, plus current EFR Primary and Secondary Care within the previous 24 months.',
    structure: ['Knowledge development', 'Confined-water skill practice', '2 open-water dives'],
    taught: ['Individual-ability assessment', 'Respectful communication and support planning', 'Adaptive buddy procedures', 'Equipment, entry and exit assistance', 'Alternative underwater communication', 'Diver stress, balance and trim support'],
    outcome: 'A practical, human-centred approach to inclusive buddying.', imageUrl: image('photo-1539635278303-d4002c07eae3')
  },
  {
    id: 'adaptive-techniques', category: 'Professional development', eyebrow: 'Inclusive teaching', title: 'PADI Adaptive Techniques',
    shortDescription: 'Professional-development training for PADI Divemasters and Instructors who want to support more students well.',
    about: 'Adaptive Techniques helps dive professionals modify communication, teaching and skill-development techniques for students with physical or mental challenges while protecting dignity and independence.',
    duration: 'Usually 1-2 days', minimumAge: 'Set by professional rating eligibility', depth: 'Set by participant rating, instructor and programme format',
    prerequisite: 'Entry requirements vary for PADI Divemasters, Assistant Instructors or Instructors. Current CPR and first-aid training may also be required.',
    structure: ['Individualised student assessment', 'Inclusive teaching workshops', 'Equipment and confined-water adaptations', 'Risk-assessment and training-plan exercises'],
    taught: ['Alternative communication methods', 'Adapting equipment configurations', 'Modifying confined-water skills', 'Entry and exit assistance', 'Support-diver coordination', 'Maintaining student dignity and independence'],
    outcome: 'Professional techniques for building a more inclusive dive-learning environment.', imageUrl: image('photo-1529156069898-49953e39b3ac')
  },
  {
    id: 'delayed-surface-marker-buoy', category: 'Specialty diver courses', eyebrow: 'Be seen from below', title: 'PADI Delayed Surface Marker Buoy Diver',
    shortDescription: 'Deploy a DSMB safely from underwater as a boat-visible position marker and ascent reference.',
    about: 'This specialty builds confidence with DSMB selection, reel management, neutral deployment, controlled ascent and safety-stop procedures.',
    duration: 'Usually 1 day', minimumAge: 'Normally 12 years', depth: 'Set by training environment and diver qualification',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification.',
    structure: ['Knowledge development', 'Confined-water or surface practice where appropriate', '2 open-water dives'],
    taught: ['DSMB and reel selection', 'Preparation and inflation', 'Entanglement prevention', 'Line tension and buoyancy control', 'Safety-stop reference use', 'Emergency release and uncontrolled-ascent prevention'],
    outcome: 'A safer, more deliberate surface-signalling skill for boat and current environments.', imageUrl: image('photo-1469474968028-56623f02e42e')
  },
  {
    id: 'emergency-oxygen-provider', category: 'First aid & safety', eyebrow: 'Respond before help arrives', title: 'PADI Emergency Oxygen Provider',
    shortDescription: 'Recognise diving-related injuries and provide emergency oxygen while professional medical care is activated.',
    about: 'Suitable for divers, boat crew, lifeguards, freedivers and aquatic professionals. No water session is required.',
    duration: 'Usually half a day', minimumAge: 'No formal age restriction; participants must understand and perform the skills', depth: 'No water session required',
    prerequisite: 'No diving certification or previous medical training required.',
    structure: ['Knowledge development', 'Instructor demonstrations', 'Hands-on oxygen equipment practice', 'Emergency scenarios'],
    taught: ['Recognising decompression illness and lung-overexpansion injury', 'When emergency oxygen may be needed', 'Oxygen-unit assembly and disassembly', 'Non-rebreather mask and demand-inhalator use', 'Patient monitoring and emergency-service activation'],
    outcome: 'A practical first-response skill set for suspected diving injuries while awaiting professional care.', imageUrl: image('photo-1576091160399-112ba8d25d1d')
  },
  {
    id: 'underwater-navigator', category: 'Specialty diver courses', eyebrow: 'Find your way home', title: 'PADI Underwater Navigator',
    shortDescription: 'Combine compass, natural-navigation and distance skills to move with purpose underwater.',
    about: 'Underwater Navigator improves your ability to determine position, direction and distance while maintaining buddy contact and correcting navigation errors.',
    duration: 'Usually 1-2 days', minimumAge: '10 years', depth: 'Set by training environment and diver qualification',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification.',
    structure: ['Knowledge development', '3 open-water dives', 'Advanced Open Water Navigation Adventure Dive may count as the first specialty dive where applicable'],
    taught: ['Compass headings and reciprocal headings', 'Square and pattern navigation', 'Kick-cycle and time distance measurement', 'Natural references and underwater mapping', 'Object relocation and error management'],
    outcome: 'More confident, independent navigation within your certified experience limits.', imageUrl: image('photo-1497250681960-ef046c08a56e')
  },
  {
    id: 'wreck-diver', category: 'Specialty diver courses', eyebrow: 'Explore responsibly', title: 'PADI Wreck Diver',
    shortDescription: 'Survey and explore wrecks responsibly with hazard awareness, navigation and limited-penetration discipline.',
    about: 'Wreck Diver covers wreck assessment, navigation, entanglement awareness, line-and-reel use, specialised finning and limited penetration where conditions allow.',
    duration: 'Usually 2 days', minimumAge: '15 years', depth: 'Set by wreck, instructor and recreational limits',
    prerequisite: 'PADI Adventure Diver or qualifying certification.',
    structure: ['Knowledge development', '4 open-water wreck dives', 'Wreck Adventure Dive may count as the first specialty dive where applicable'],
    taught: ['Wreck history and condition research', 'Exterior survey and hazard identification', 'Sharp-metal and entanglement avoidance', 'Reels, penetration lines and exit contact', 'Gas-management limits and protected-site respect'],
    outcome: 'PADI Wreck Diver specialty certification. It does not authorise unrestricted overhead-environment penetration.', imageUrl: image('photo-1518709268805-4e9042af9f23')
  },
  {
    id: 'peak-performance-buoyancy', category: 'Specialty diver courses', eyebrow: 'Move like the water', title: 'PADI Peak Performance Buoyancy',
    shortDescription: 'Refine weighting, trim and breathing control to use less air and protect the reef beneath you.',
    about: 'Peak Performance Buoyancy helps divers improve comfort, air consumption and environmental awareness by making every movement more intentional.',
    duration: 'Usually 1 day', minimumAge: '10 years', depth: 'Set by training environment and diver qualification',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or qualifying certification.',
    structure: ['Knowledge development', '2 open-water dives'],
    taught: ['Correct weighting and weight distribution', 'Horizontal trim and breath control', 'BCD buoyancy fine-tuning', 'Hovering, streamlining and efficient finning', 'Avoiding accidental coral contact'],
    outcome: 'A calmer, more efficient and more reef-friendly diving style.', imageUrl: image('photo-1507525428034-b723cf961d3e')
  },
  {
    id: 'divemaster', category: 'Professional development', eyebrow: 'Lead the way', title: 'PADI Divemaster',
    shortDescription: 'The first professional PADI rating: develop leadership, supervision, problem-solving and instructional-assistance skills.',
    about: 'Divemaster is the start of the PADI professional pathway. It develops dive leadership, supervision, site management, emergency planning and professional conduct for guiding certified divers and assisting instructors.',
    duration: 'Intensive 2-4 weeks or internship-style several weeks to months', minimumAge: '18 years', depth: 'Set by professional training standards and environment',
    prerequisite: 'PADI Advanced Open Water and Rescue Diver or qualifying certifications, current EFR within 24 months, at least 40 logged dives to begin, medical clearance, swimming ability and fitness.',
    structure: ['Watermanship and stamina assessments', 'Rescue evaluation', 'Dive-skill demonstration circuits', 'Underwater mapping', 'Search and recovery', 'Deep-dive scenarios', 'Site setup, briefings and supervised guiding'],
    taught: ['Supervising certified and student divers', 'Dive briefings and site management', 'Physics, physiology and decompression theory', 'Equipment and recreational dive planning', 'Emergency planning, environmental awareness and industry conduct'],
    outcome: 'Professional Divemaster certification normally requires a minimum of 60 logged dives and opens the route toward instructor development.', imageUrl: image('photo-1531058020387-3be344556be6')
  },
  {
    id: 'emergency-first-response-instructor', category: 'Professional development', eyebrow: 'Teach life-saving skills', title: 'Emergency First Response Instructor - EFRI',
    shortDescription: 'Qualify to teach EFR Primary Care, Secondary Care and related programmes within your authorised instructor scope.',
    about: 'EFR Instructor training is designed for eligible dive professionals and, in some pathways, non-diving candidates. It builds teaching, evaluation and course-administration skills for emergency response programmes.',
    duration: 'Usually 1-2 days', minimumAge: 'Set by current EFR and instructor eligibility standards', depth: 'No water session required',
    prerequisite: 'Requirements depend on professional status and regional EFR standards. Current adult CPR and first-aid training is normally required.',
    structure: ['Independent preparation', 'Instructor-led knowledge development', 'Teaching workshops', 'Skill demonstrations', 'Practice teaching assignments', 'Final evaluation'],
    taught: ['EFR philosophy and standards', 'Teaching CPR and first aid', 'Knowledge-development facilitation', 'Medical-skill demonstrations', 'Emergency-scenario coaching', 'Student evaluation and certification administration'],
    outcome: 'Authorisation to conduct the EFR programmes within your active teaching status and scope.', imageUrl: image('photo-1521791136064-7986c2920216')
  },
  {
    id: 'assistant-instructor', category: 'Professional development', eyebrow: 'Start teaching', title: 'PADI Assistant Instructor',
    shortDescription: 'The first teaching-level stage of the PADI Instructor Development Course, building on Divemaster leadership.',
    about: 'Assistant Instructor introduces the PADI system of diver education. It permits additional instructional duties within current standards, but does not provide the full independent teaching authority of an Open Water Scuba Instructor.',
    duration: 'Usually 3-4 days separately or the first portion of a longer IDC', minimumAge: '18 years', depth: 'Set by professional training standards and environment',
    prerequisite: 'PADI Divemaster or qualifying leadership certification, certified diver status for at least 6 months, at least 60 logged dives to begin the IDC, current EFR, medical clearance and EFR Instructor qualification before the full pathway.',
    structure: ['Knowledge and teaching philosophy', 'Confined-water presentations', 'Open-water teaching assignments', 'Standards, evaluation and course administration'],
    taught: ['PADI teaching philosophy', 'Knowledge-development presentations', 'Confined-water skill teaching', 'Open-water assignments', 'Risk management and professional conduct'],
    outcome: 'A teaching-level PADI rating and a path into the Open Water Scuba Instructor portion of the IDC and PADI Instructor Examination.', imageUrl: image('photo-1521737711867-e3b97375f902')
  },
  {
    id: 'bubblemaker', category: 'Youth & introductory', eyebrow: 'Little explorers', title: 'PADI Bubblemaker',
    shortDescription: 'A joyful first taste of breathing underwater in shallow, controlled conditions for children aged 8 and up.',
    about: 'Bubblemaker is an introductory experience, not an independent diver certification. Children use scuba equipment, practise basic movement and learn simple underwater signals in pool-like conditions.',
    duration: 'Usually 1-2 hours', minimumAge: '8 years', depth: 'Generally no deeper than 2 m / 6 ft',
    prerequisite: 'No previous experience. Parental or guardian approval, water comfort and completed medical and participation forms.',
    structure: ['Equipment introduction', 'Supervised breathing underwater', 'Basic movement and equalisation awareness', 'Games and activities'],
    taught: ['Scuba equipment use', 'Underwater breathing', 'Simple hand signals', 'Safe movement and environmental respect'],
    outcome: 'A supervised participation experience and a positive first memory of scuba - not a certification.', imageUrl: image('photo-1544551763-46a013bb70d5')
  },
  {
    id: 'seal-team', category: 'Youth & introductory', eyebrow: 'AquaMissions', title: 'PADI Seal Team',
    shortDescription: 'A pool-based scuba programme for children aged 8 and up, built around themed AquaMissions.',
    about: 'Seal Team develops comfort, confidence and basic scuba skills in a controlled environment. AquaMissions 1-5 create the core recognition; specialty missions add themes such as photography, navigation and search and recovery.',
    duration: 'Each AquaMission is approximately 1 hour; the full programme is scheduled over multiple sessions', minimumAge: '8 years', depth: 'Generally no deeper than 4 m / 12 ft',
    prerequisite: 'No prior certification; participation follows instructor screening, guardian approval and required forms.',
    structure: ['AquaMissions 1-5 for Seal Team recognition', 'Optional specialty AquaMissions', 'Master Seal Team recognition after required specialty missions'],
    taught: ['Equipment use and breathing underwater', 'Mask clearing and regulator skills', 'Buoyancy and underwater communication', 'Environmental responsibility', 'Optional photography, navigation, search, night and wreck simulations'],
    outcome: 'Youth programme recognition, not an open-water diver certification.', imageUrl: image('photo-1504159506876-f8338247a14a')
  },
  {
    id: 'discover-scuba-diving', category: 'Youth & introductory', eyebrow: 'Try the blue', title: 'PADI Discover Scuba Diving',
    shortDescription: 'A supervised introductory scuba experience for people who want to try diving before committing to certification.',
    about: 'Discover Scuba Diving combines a safety and knowledge briefing, confined-water practice and, depending on the selected programme, a closely supervised open-water dive. It does not provide an independent diver certification.',
    duration: 'Pool-only 2-3 hours; open-water programme half a day or a longer full-day format', minimumAge: '10 years', depth: 'Open-water experience dives generally limited to 12 m / 40 ft',
    prerequisite: 'No previous certification. Basic comfort in the water, suitable medical fitness and completed required forms.',
    structure: ['Safety and knowledge briefing', 'Confined-water skills', 'Optional supervised open-water dive'],
    taught: ['Equipment use and safety rules', 'Equalisation and underwater breathing', 'Regulator and mask clearing', 'Basic buoyancy and hand signals', 'Responsible environmental interaction'],
    outcome: 'A memorable supervised experience. Training may sometimes be credited toward Scuba Diver or Open Water when PADI requirements and timing allow.', imageUrl: image('photo-1544551763-46a013bb70d5')
  }
];

export const TEAM_MEMBERS: readonly TeamMember[] = [
  { name: 'Shamsudheen', role: 'Senior instructor', bio: 'Brings calm discipline and years of water experience to every briefing, first breath and reef descent.', initials: 'S', imageUrl: 'media/team/shamsudheen.jpg' },
  { name: 'Mohammed Sadique', role: 'Dive team', bio: 'Helps guests settle into the water with patient guidance, practical knowledge and a genuine love for Kadmat.', initials: 'MS', imageUrl: 'media/team/mohammed-sadique.jpg' },
  { name: 'Jamhar', role: 'Dive team', bio: 'Keeps every day on the water welcoming, observant and connected to the lagoon’s changing conditions.', initials: 'J', imageUrl: 'media/team/jamhar.jpg' },
  { name: 'Team member 4', role: 'Boat & safety team', bio: 'Supports smooth boat days, careful preparation and the safety details that let guests stay present.', initials: '04', imageUrl: 'media/team/team-member-4.jpg' },
  { name: 'Team member 5', role: 'Water sports team', bio: 'Helps shape relaxed, memorable time on the lagoon, from surface activities to island-side sessions.', initials: '05', imageUrl: 'media/team/team-member-5.jpg' },
  { name: 'Team member 6', role: 'Guest experience team', bio: 'Adds the local ease that turns a well-planned visit into a warm Scuba Lak memory.', initials: '06', imageUrl: 'media/team/team-member-6.jpg' }
];

export const TEAM_GROUP_PHOTO = 'media/team/team-group-boat.jpg';
export const TEAM_BEACH_GROUP_PHOTO = 'media/team/team-group-beach.jpg';

export const TEAM_STORY = {
  eyebrow: 'The Scuba Lak way',
  title: 'People first. Reef always.',
  description: 'Scuba Lak is a local-led diving and water sports team built around the character of Kadmat Island. We bring careful PADI standards, patient teaching and deep island knowledge to every experience - from a first breath in the blue lagoon to a deeper day along the outer reef. The work is shared: instructors, boat crew, water sports guides and guest hosts all help create days that feel safe, personal and genuinely connected to Lakshadweep.',
  imageUrl: TEAM_GROUP_PHOTO,
  imageAlt: 'Scuba Lak team members together aboard a dive boat in Kadmat lagoon'
} as const;

export const TESTIMONIALS: readonly Testimonial[] = [
  { quote: 'I arrived nervous and left already planning my next dive. The team made every step feel unhurried and completely safe.', name: 'Rhea Kapoor', detail: 'Open Water Diver · Mumbai', accent: 'mint' },
  { quote: 'Kadmat is the rare place where the photographs do not quite prepare you. The outer reef was quietly extraordinary.', name: 'Daniel Thomas', detail: 'Deep sea guest · London', accent: 'coral' },
  { quote: 'The whole week felt personal - from the permit help to the last sunset kayak. It was luxury in the most human sense.', name: 'Ananya & Karan', detail: 'Blue room retreat · Bengaluru', accent: 'sand' },
  { quote: 'My instructor noticed the tiny things and gave me room to learn. I feel like a real diver now, not someone who passed a test.', name: 'Ishaan Shah', detail: 'PADI Advanced Open Water · Delhi', accent: 'mint' }
];

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  { id: 'scuba-lak-team', title: 'The people behind the bubbles', description: 'Three of the Scuba Lak team between dives, surrounded by Kadmat’s clear lagoon and the easy camaraderie that shapes every day on the water.', location: 'Kadmat lagoon · Scuba Lak', imageUrl: TEAM_GROUP_PHOTO, size: 'tall' },
  { id: 'scuba-lak-on-the-sands', title: 'Local knowledge, shared', description: 'The wider Scuba Lak crew on Kadmat’s silver sands - a local-led team bringing careful standards, warm island hospitality and a deep respect for the reef.', location: 'Kadmat Island beach', imageUrl: TEAM_BEACH_GROUP_PHOTO, size: 'tall' },
  { id: 'glass-water', title: 'Glass water, first light', description: 'The western lagoon before the wind arrives - the quietest hour on the island.', location: 'Western lagoon', imageUrl: image('photo-1507525428034-b723cf961d3e', 1600), size: 'wide' },
  { id: 'reef-wall', title: 'Where the reef falls away', description: 'Blue turns to depth on an outer-reef descent with the day\'s visibility wide open.', location: 'Outer reef', imageUrl: image('photo-1544550285-f813152fb2fd', 1200), size: 'tall' },
  { id: 'shoreline', title: 'Eight kilometres of shoreline', description: 'A slow walk between palms, tide lines and the sea that keeps changing colour.', location: 'Kadmat Island', imageUrl: image('photo-1500534623283-312aade485b7', 1200), size: 'standard' },
  { id: 'boat-day', title: 'Out past the lagoon', description: 'The dive boat heading for the edge of the island, where the water gets honest.', location: 'Dive jetty', imageUrl: image('photo-1544551763-46a013bb70d5', 1200), size: 'wide' },
  { id: 'palm-shadow', title: 'The long afternoon', description: 'A little shade, a little salt and nowhere else to be.', location: 'Beachfront', imageUrl: image('photo-1510414842594-a61c69b5ae57', 1200), size: 'standard' },
  { id: 'underwater-light', title: 'Light under the surface', description: 'Coral gardens, a calm breath and the feeling of being invited in.', location: 'Lagoon dive site', imageUrl: image('photo-1530053969600-caed2596d242', 1200), size: 'tall' },
  { id: 'blue-villa', title: 'Blue room mornings', description: 'A private beach-facing start before the first boat leaves the jetty.', location: 'Scuba Lak', imageUrl: image('photo-1564501049412-61c2a3083791', 1200), size: 'standard' },
  { id: 'shore-paddle', title: 'The soft way out', description: 'Kayaking through the lagoon at the pace of the tide.', location: 'South lagoon', imageUrl: image('photo-1473116763249-2faaef81ccda', 1200), size: 'wide' }
];

export const COMPANY_MILESTONES: readonly CompanyMilestone[] = [
  { year: '01', title: 'A small idea in a big blue place', description: 'Scuba Lak began with a simple belief: the best diving experiences are built on patience, local knowledge and a genuine respect for the reef.' },
  { year: '02', title: 'From guiding to teaching', description: 'As more guests arrived curious and unqualified, the dive desk grew into a PADI learning space for first certifications, new confidence and professional pathways.' },
  { year: '03', title: 'More care in every direction', description: 'Today, safety, marine awareness and small-group attention shape every programme - from a first lagoon breath to an outer-reef deep dive.' }
];

export const ABOUT_STATS = [
  { value: '1,200+', label: 'certifications & experiences delivered' },
  { value: '7 yrs', label: 'of island-led dive culture' },
  { value: '4:1', label: 'guest-to-guide focus on courses' },
  { value: '30 m', label: 'of blue to explore responsibly' }
] as const;
