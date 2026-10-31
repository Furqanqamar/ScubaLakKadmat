import { ORIGINAL_MEDIA } from './original-media.generated';
import { ADDITIONAL_MEDIA } from './additional-media.generated';
import { TEAM_PORTRAITS } from './team-portraits.generated';

import {
  GalleryItem,
  MarineService,
  PadiCourse,
  TeamMember
} from '../models/site-data.model';


export const MARINE_SERVICES: readonly MarineService[] = [
  {
    id: 'lagoon-diving',
    category: 'Diving',
    icon: 'lagoon',
    eyebrow: 'Soft entry',
    title: 'Lagoon diving',
    description: 'Your first underwater breath, guided gently in Kadmat’s shallow lagoon. Beginners and non-swimmers welcome.',
    detailedDescription: 'Move slowly through warm, sheltered water with a PADI professional beside you. At five metres, the lagoon opens up a luminous world of coral bommies, butterflyfish and shy reef life without the pressure of the open sea.',
    depth: '5 m',
    audience: 'Beginners & non-swimmers',
    duration: '',
    badge: 'First-time divers',
    imageUrl: ORIGINAL_MEDIA['young-diver-preparation'].imageUrl,
    highlights: ['Full safety briefing', 'PADI pro in the water', 'Shallow coral exploration']
  },
  {
    id: 'deep-sea-diving',
    category: 'Diving',
    icon: 'deep-sea',
    eyebrow: 'Open ocean',
    title: 'Deep sea diving',
    description: 'Explore Kadmat’s outer reefs with a dive plan matched to your certification, experience and the conditions.',
    detailedDescription: 'For certified divers ready to meet the outer reef, Kadmat\'s western edge delivers dramatic walls, eagle rays and schools of pelagic life. The plan is always matched to your logged experience, comfort and the day\'s sea conditions.',
    depth: '30 m',
    audience: 'Advanced PADI divers',
    duration: '',
    badge: 'Outer reef',
    imageUrl: ADDITIONAL_MEDIA['reef-diver-coral'].imageUrl,
    highlights: ['Outer reef wall sites', 'Small group departures', 'Top-tier dive equipment']
  },
  {
    id: 'padi-courses',
    category: 'Course',
    icon: 'course',
    eyebrow: 'Get certified',
    title: 'PADI courses',
    description: 'Build confidence with PADI training, from Open Water to the next step in your diving journey.',
    detailedDescription: 'From your first pool session to advanced navigation and deep-diving skills, our courses pair international PADI standards with the clarity of learning in a real island environment. Small groups keep every question welcome.',
    depth: 'Course-specific',
    audience: 'New & certified divers',
    duration: '',
    badge: 'Learn for life',
    imageUrl: ORIGINAL_MEDIA['dive-preparation'].imageUrl,
    highlights: ['Open Water certification', 'Advanced Open Water', 'Flexible island schedule']
  },
  {
    id: 'water-sports',
    category: 'Water sports',
    icon: 'sports',
    eyebrow: 'Surface stories',
    title: 'Water sports',
    description: 'Snorkel, kayak, ride a glass-bottom boat or head out for deep sea fishing with the island crew.',
    detailedDescription: 'Not every adventure needs a tank. Drift above the reef, paddle the lagoon at golden hour or head offshore with a local crew who knows the water\'s moods. Build your own mix of slow mornings and big blue afternoons.',
    depth: 'Surface',
    audience: 'Every kind of explorer',
    duration: '',
    badge: 'Easygoing',
    imageUrl: ORIGINAL_MEDIA['enjoying-clear-water'].imageUrl,
    highlights: ['Glass boat ride', 'Guided kayaking', 'Lagoon snorkelling', 'Deep sea fishing']
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
    outcome: 'A recognised supervised-diving certification that can be upgraded to PADI Open Water Diver.', imageUrl: ORIGINAL_MEDIA['mask-fitting-training'].imageUrl
  },
  {
    id: 'open-water-diver', category: 'Beginner certifications', eyebrow: 'The complete first step', title: 'PADI Open Water Diver',
    shortDescription: 'The world\'s most recognised recreational scuba certification - your passport to diving with a certified buddy.',
    about: 'Open Water Diver develops the knowledge and practical skills required to plan and conduct dives with a certified buddy, within training and experience limits, without direct professional supervision.',
    duration: 'Usually 3-4 days with eLearning completed in advance', minimumAge: '10 years for Junior Open Water; adult rating normally from 15', depth: 'Adults normally up to 18 m / 60 ft; junior limits apply',
    prerequisite: 'No previous diving certification. Adequate swimming ability, suitable physical health, completed medical questionnaire and required forms.',
    structure: ['5 knowledge-development sections', '5 confined-water sessions', '4 open-water certification dives', 'Water-skills assessment including swim and survival float or tread-water exercise'],
    taught: ['Diving physics and physiology', 'Dive planning and no-decompression limits', 'Equipment care, assembly and pre-dive checks', 'Mask, regulator and alternate-air-source skills', 'Buoyancy, hovering, navigation and controlled ascents', 'Emergency procedures and responsible environmental awareness'],
    outcome: 'Certification to dive with another appropriately certified diver, generally to 18 metres, subject to local conditions, law, training and experience.', imageUrl: ORIGINAL_MEDIA['shore-training'].imageUrl
  },
  {
    id: 'advanced-open-water', category: 'Continuing education', eyebrow: 'Five ways to go further', title: 'PADI Advanced Open Water Diver',
    shortDescription: 'Build practical confidence through five Adventure Dives, with Deep and Underwater Navigation as the required core.',
    about: 'Advanced Open Water is experience-led rather than classroom-heavy. Deep Diving and Underwater Navigation are compulsory, while three additional Adventure Dives are selected around your interests and local conditions.',
    duration: 'Usually 2-3 days with 5 open-water dives', minimumAge: '12 years for Junior Advanced Open Water', depth: 'Adults generally up to 30 m / 100 ft; junior depth limits continue',
    prerequisite: 'PADI Open Water Diver, Junior Open Water Diver or a qualifying certification from another recognised training organisation.',
    structure: ['Deep Adventure Dive', 'Underwater Navigation Adventure Dive', '3 elective Adventure Dives such as buoyancy, night, wreck, photography, nitrox or fish identification'],
    taught: ['Deep-dive planning and narcosis awareness', 'Gas consumption and depth effects', 'Compass and natural navigation', 'Improved buoyancy and trim', 'Specialised communication, photography, search or boat skills depending on electives'],
    outcome: 'A stronger recreational foundation and a pathway toward a 30 metre maximum recreational depth for eligible adult divers.', imageUrl: ADDITIONAL_MEDIA['blue-water-diver'].imageUrl
  },
  {
    id: 'rescue-diver', category: 'Continuing education', eyebrow: 'Look out for the whole team', title: 'PADI Rescue Diver',
    shortDescription: 'Develop awareness, problem-solving ability and confidence to recognise and assist other divers.',
    about: 'Rescue Diver shifts your attention from managing only your own needs to recognising and managing diver stress, minor problems and emergencies before they become serious.',
    duration: 'Usually 2-3 days, excluding EFR training', minimumAge: '12 years for Junior Rescue Diver', depth: 'Training limits set by instructor and conditions',
    prerequisite: 'PADI Adventure Diver with Underwater Navigation, or qualifying certification; current CPR and first-aid training within the previous 24 months. Advanced Open Water is strongly recommended.',
    structure: ['Knowledge development', 'Rescue-skill practice sessions', 'Open-water rescue exercises', 'At least 2 comprehensive rescue scenarios', 'Emergency-assistance plan'],
    taught: ['Self-rescue review and diver stress', 'Tired, panicked and distressed diver assistance', 'Missing-diver searches', 'Surfacing and removing an unresponsive diver', 'In-water rescue breathing and emergency coordination', 'Accident prevention and risk management'],
    outcome: 'A major confidence and safety milestone, and an important prerequisite for PADI Divemaster.', imageUrl: 'media/generated/course-rescue-diver.webp'
  },
  {
    id: 'adaptive-techniques', category: 'Professional development', eyebrow: 'Inclusive teaching', title: 'PADI Adaptive Techniques',
    shortDescription: 'Professional-development training for PADI Divemasters and Instructors who want to support more students well.',
    about: 'Adaptive Techniques helps dive professionals modify communication, teaching and skill-development techniques for students with physical or mental challenges while protecting dignity and independence.',
    duration: 'Usually 1-2 days', minimumAge: 'Set by professional rating eligibility', depth: 'Set by participant rating, instructor and programme format',
    prerequisite: 'Entry requirements vary for PADI Divemasters, Assistant Instructors or Instructors. Current CPR and first-aid training may also be required.',
    structure: ['Individualised student assessment', 'Inclusive teaching workshops', 'Equipment and confined-water adaptations', 'Risk-assessment and training-plan exercises'],
    taught: ['Alternative communication methods', 'Adapting equipment configurations', 'Modifying confined-water skills', 'Entry and exit assistance', 'Support-diver coordination', 'Maintaining student dignity and independence'],
    outcome: 'Professional techniques for building a more inclusive dive-learning environment.', imageUrl: 'media/generated/course-adaptive-techniques.webp'
  },
  {
    id: 'divemaster', category: 'Professional development', eyebrow: 'Lead the way', title: 'PADI Divemaster',
    shortDescription: 'The first professional PADI rating: develop leadership, supervision, problem-solving and instructional-assistance skills.',
    about: 'Divemaster is the start of the PADI professional pathway. It develops dive leadership, supervision, site management, emergency planning and professional conduct for guiding certified divers and assisting instructors.',
    duration: 'Intensive 2-4 weeks or internship-style several weeks to months', minimumAge: '18 years', depth: 'Set by professional training standards and environment',
    prerequisite: 'PADI Advanced Open Water and Rescue Diver or qualifying certifications, current EFR within 24 months, at least 40 logged dives to begin, medical clearance, swimming ability and fitness.',
    structure: ['Watermanship and stamina assessments', 'Rescue evaluation', 'Dive-skill demonstration circuits', 'Underwater mapping', 'Search and recovery', 'Deep-dive scenarios', 'Site setup, briefings and supervised guiding'],
    taught: ['Supervising certified and student divers', 'Dive briefings and site management', 'Physics, physiology and decompression theory', 'Equipment and recreational dive planning', 'Emergency planning, environmental awareness and industry conduct'],
    outcome: 'Professional Divemaster certification normally requires a minimum of 60 logged dives and opens the route toward instructor development.', imageUrl: ADDITIONAL_MEDIA['guided-group-dive'].imageUrl
  },
  {
    id: 'emergency-first-response-instructor', category: 'Professional development', eyebrow: 'Teach life-saving skills', title: 'Emergency First Response Instructor - EFRI',
    shortDescription: 'Qualify to teach EFR Primary Care, Secondary Care and related programmes within your authorised instructor scope.',
    about: 'EFR Instructor training is designed for eligible dive professionals and, in some pathways, non-diving candidates. It builds teaching, evaluation and course-administration skills for emergency response programmes.',
    duration: 'Usually 1-2 days', minimumAge: 'Set by current EFR and instructor eligibility standards', depth: 'No water session required',
    prerequisite: 'Requirements depend on professional status and regional EFR standards. Current adult CPR and first-aid training is normally required.',
    structure: ['Independent preparation', 'Instructor-led knowledge development', 'Teaching workshops', 'Skill demonstrations', 'Practice teaching assignments', 'Final evaluation'],
    taught: ['EFR philosophy and standards', 'Teaching CPR and first aid', 'Knowledge-development facilitation', 'Medical-skill demonstrations', 'Emergency-scenario coaching', 'Student evaluation and certification administration'],
    outcome: 'Authorisation to conduct the EFR programmes within your active teaching status and scope.', imageUrl: 'media/generated/course-emergency-first-response-instructor.webp'
  },
  {
    id: 'assistant-instructor', category: 'Professional development', eyebrow: 'Start teaching', title: 'PADI Assistant Instructor',
    shortDescription: 'The first teaching-level stage of the PADI Instructor Development Course, building on Divemaster leadership.',
    about: 'Assistant Instructor introduces the PADI system of diver education. It permits additional instructional duties within current standards, but does not provide the full independent teaching authority of an Open Water Scuba Instructor.',
    duration: 'Usually 3-4 days separately or the first portion of a longer IDC', minimumAge: '18 years', depth: 'Set by professional training standards and environment',
    prerequisite: 'PADI Divemaster or qualifying leadership certification, certified diver status for at least 6 months, at least 60 logged dives to begin the IDC, current EFR, medical clearance and EFR Instructor qualification before the full pathway.',
    structure: ['Knowledge and teaching philosophy', 'Confined-water presentations', 'Open-water teaching assignments', 'Standards, evaluation and course administration'],
    taught: ['PADI teaching philosophy', 'Knowledge-development presentations', 'Confined-water skill teaching', 'Open-water assignments', 'Risk management and professional conduct'],
    outcome: 'A teaching-level PADI rating and a path into the Open Water Scuba Instructor portion of the IDC and PADI Instructor Examination.', imageUrl: ADDITIONAL_MEDIA['lagoon-dive-group'].imageUrl
  },
  {
    id: 'bubblemaker', category: 'Youth & introductory', eyebrow: 'Little explorers', title: 'PADI Bubblemaker',
    shortDescription: 'A joyful first taste of breathing underwater in shallow, controlled conditions for children aged 8 and up.',
    about: 'Bubblemaker is an introductory experience, not an independent diver certification. Children use scuba equipment, practise basic movement and learn simple underwater signals in pool-like conditions.',
    duration: 'Usually 1-2 hours', minimumAge: '8 years', depth: 'Generally no deeper than 2 m / 6 ft',
    prerequisite: 'No previous experience. Parental or guardian approval, water comfort and completed medical and participation forms.',
    structure: ['Equipment introduction', 'Supervised breathing underwater', 'Basic movement and equalisation awareness', 'Games and activities'],
    taught: ['Scuba equipment use', 'Underwater breathing', 'Simple hand signals', 'Safe movement and environmental respect'],
    outcome: 'A supervised participation experience and a positive first memory of scuba - not a certification.', imageUrl: 'media/generated/course-bubblemaker.webp'
  },
  {
    id: 'seal-team', category: 'Youth & introductory', eyebrow: 'AquaMissions', title: 'PADI Seal Team',
    shortDescription: 'A pool-based scuba programme for children aged 8 and up, built around themed AquaMissions.',
    about: 'Seal Team develops comfort, confidence and basic scuba skills in a controlled environment. AquaMissions 1-5 create the core recognition; specialty missions add themes such as photography, navigation and search and recovery.',
    duration: 'Each AquaMission is approximately 1 hour; the full programme is scheduled over multiple sessions', minimumAge: '8 years', depth: 'Generally no deeper than 4 m / 12 ft',
    prerequisite: 'No prior certification; participation follows instructor screening, guardian approval and required forms.',
    structure: ['AquaMissions 1-5 for Seal Team recognition', 'Optional specialty AquaMissions', 'Master Seal Team recognition after required specialty missions'],
    taught: ['Equipment use and breathing underwater', 'Mask clearing and regulator skills', 'Buoyancy and underwater communication', 'Environmental responsibility', 'Optional photography, navigation, search, night and wreck simulations'],
    outcome: 'Youth programme recognition, not an open-water diver certification.', imageUrl: 'media/generated/course-seal-team.webp'
  },
  {
    id: 'discover-scuba-diving', category: 'Youth & introductory', eyebrow: 'Try the blue', title: 'PADI Discover Scuba Diving',
    shortDescription: 'A supervised introductory scuba experience for people who want to try diving before committing to certification.',
    about: 'Discover Scuba Diving combines a safety and knowledge briefing, confined-water practice and, depending on the selected programme, a closely supervised open-water dive. It does not provide an independent diver certification.',
    duration: 'Pool-only 2-3 hours; open-water programme half a day or a longer full-day format', minimumAge: '10 years', depth: 'Open-water experience dives generally limited to 12 m / 40 ft',
    prerequisite: 'No previous certification. Basic comfort in the water, suitable medical fitness and completed required forms.',
    structure: ['Safety and knowledge briefing', 'Confined-water skills', 'Optional supervised open-water dive'],
    taught: ['Equipment use and safety rules', 'Equalisation and underwater breathing', 'Regulator and mask clearing', 'Basic buoyancy and hand signals', 'Responsible environmental interaction'],
    outcome: 'A memorable supervised experience. Training may sometimes be credited toward Scuba Diver or Open Water when PADI requirements and timing allow.', imageUrl: ORIGINAL_MEDIA['enjoying-clear-water'].imageUrl
  }
];

export const TEAM_MEMBERS: readonly TeamMember[] = [
  { id: 'shamsudheen', name: 'Shamsudheen', imageUrl: 'media/team/shamsudheen.jpg', imageAlt: 'Shamsudheen beside the Kadmat lagoon', width: 1000, height: 1250 },
  { id: 'mohammed-sadique', name: 'Mohammed Sadique', imageUrl: 'media/team/mohammed-sadique.jpg', imageAlt: 'Mohammed Sadique aboard a boat in the lagoon', width: 800, height: 1000 },
  { id: 'jamhar', name: 'Jamhar', imageUrl: 'media/team/jamhar.jpg', imageAlt: 'Jamhar aboard a Scuba Lak boat', width: 800, height: 1000 },
  { id: 'al-ameen', name: 'Al Ameen', imageUrl: 'media/team/team-member-4.jpg', imageAlt: 'Al Ameen aboard a boat in Kadmat lagoon', width: 1000, height: 1250 },
  { id: 'saheer', name: 'Saheer', imageUrl: 'media/team/team-member-5.jpg', imageAlt: 'Saheer aboard a boat beside the lagoon', width: 1000, height: 1250 },
  { id: 'lukman', name: 'Lukman', imageUrl: 'media/team/team-member-6.jpg', imageAlt: 'Lukman sitting on a boat railing in Kadmat lagoon', width: 600, height: 750 },
  { id: 'amjad-khan', name: 'Amjad Khan', imageUrl: TEAM_PORTRAITS['amjad-khan'].imageUrl, imageAlt: 'Amjad Khan, Scuba Lak team member', width: TEAM_PORTRAITS['amjad-khan'].width, height: TEAM_PORTRAITS['amjad-khan'].height },
  { id: 'thoufeque', name: 'Thoufeque', imageUrl: TEAM_PORTRAITS['thoufeque'].imageUrl, imageAlt: 'Thoufeque aboard a boat with the sea behind him', width: TEAM_PORTRAITS['thoufeque'].width, height: TEAM_PORTRAITS['thoufeque'].height }
];

export const TEAM_GROUP_PHOTO = 'media/team/team-group-boat.jpg';
export const TEAM_BEACH_GROUP_PHOTO = 'media/team/team-group-beach.jpg';

export const TEAM_STORY = {
  eyebrow: 'The Scuba Lak way',
  title: 'People first. Reef always.',
  description: 'Scuba Lak is Kadmat’s local-led diving and water activities team. Patient teaching, experienced divers and a friendly island welcome shape every day—from first lagoon breaths to outer-reef adventures. Tell us your comfort level, curiosity and timing. We’ll plan around you and the sea.',
  imageUrl: TEAM_GROUP_PHOTO,
  imageAlt: 'Scuba Lak team members together aboard a dive boat in Kadmat lagoon'
} as const;

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  ...Object.values(ADDITIONAL_MEDIA),
  ...Object.values(ORIGINAL_MEDIA),
  { id: 'scuba-lak-team', category: 'Team', title: 'The people behind the bubbles', description: 'Three of the Scuba Lak team between dives, surrounded by Kadmat’s clear lagoon and the easy camaraderie that shapes every day on the water.', location: 'Kadmat lagoon · Scuba Lak', imageUrl: TEAM_GROUP_PHOTO, size: 'tall' },
  { id: 'scuba-lak-on-the-sands', category: 'Team', title: 'Local knowledge, shared', description: 'The wider Scuba Lak crew on Kadmat’s silver sands - a local-led team bringing careful standards, warm island hospitality and a deep respect for the reef.', location: 'Kadmat Island beach', imageUrl: TEAM_BEACH_GROUP_PHOTO, size: 'tall' },
];
