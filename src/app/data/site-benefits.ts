import { SiteBenefit } from '../models/site-data.model';

export const SITE_BENEFITS = [
  {
    id: 'dive-boats', title: 'Our own dive boats', icon: 'kayak',
    summary: 'From the island to the reef, with the Scuba Lak team alongside.',
    description: 'Our dive boats are part of your day with Scuba Lak, connecting the island, the lagoon and the reef. Talk through the meeting point, equipment and departure plan with the team before your outing. The route and timing are chosen around the experience and sea conditions.'
  },
  {
    id: 'flexible-schedule', title: 'Flexible diving schedules', icon: 'schedule',
    summary: 'A thoughtful plan around your experience, your dates and the sea.',
    description: 'A first dive, a certification course and a relaxed island visit each need a different rhythm. Share your dates, experience and priorities so we can discuss a suitable plan. Your final schedule is agreed with the team and remains subject to weather, sea conditions and availability.'
  },
  {
    id: 'professional-equipment', title: 'Professional equipment', icon: 'mask',
    summary: 'Get comfortable with your kit before the adventure begins.',
    description: 'Good preparation starts with understanding the equipment you will use. The team guides you through fitting, basic operation and pre-dive checks so you can ask questions before entering the water. Confirm equipment arrangements and any personal kit requirements when planning your chosen experience or course.'
  },
  {
    id: 'safety-standards', title: 'Safety at every step', icon: 'tanks',
    summary: 'Clear briefings, careful preparation and considered decisions.',
    description: 'Your briefing brings together the plan, equipment, communication and the conditions on the day. The instructor considers your experience and comfort before the session. Depth and participation requirements belong to the specific experience or course, with the sea and the people in the water guiding every go or no-go decision.'
  },
  {
    id: 'reef-locations', title: 'Beautiful reef locations', icon: 'coral',
    summary: 'Kadmat’s blue lagoon, coral gardens and open-water horizons.',
    description: 'Kadmat offers more than one way to meet the ocean: sheltered lagoon exploration, coral gardens and the changing blue along the outer reef. Sites are selected for the day’s visibility, sea conditions and the group’s experience. Careful buoyancy and respectful encounters help keep the reef at the heart of the visit.'
  },
  {
    id: 'dive-instructors', title: 'Professional dive instructors', icon: 'instructor',
    summary: 'Patient teaching, practical guidance and a warm island welcome.',
    description: 'From your first underwater breath to the next step in PADI training, professional instruction makes room for learning at the right pace. Ask questions, discuss your comfort and understand the skills behind each session. Scuba Lak brings that guidance together with the hospitality and island knowledge that make a Kadmat visit personal.'
  }
] as const satisfies readonly SiteBenefit[];

export const BENEFITS_COPY = {
  home: {
    eyebrow: 'Our benefits', title: 'Warm hospitality.', emphasis: 'World-class diving.',
    introduction: 'A warm island welcome, professional guidance and a reef-conscious approach to the water. These are the details behind a Scuba Lak day in Kadmat.'
  },
  about: {
    eyebrow: 'Why choose Scuba Lak', title: 'The care behind', emphasis: 'every dive.',
    introduction: 'Warm hospitality, professional guidance and a love for Kadmat’s marine world. Get to know the six details that shape your time with us.'
  },
  readMore: 'Discover the Scuba Lak approach',
  note: 'Planned with care. Shaped by the sea. Confirm your arrangements with the team before travelling.'
} as const;
