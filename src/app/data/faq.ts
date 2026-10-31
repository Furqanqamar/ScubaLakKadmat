import { ACCOMMODATION_INFO } from './accommodation-info';
import { BOOKING_NOTES, DIVE_DAY, EXPERIENCE_PLANNING } from './experience-planning';
import { TRAVEL_FAQ } from './travel-faq';
import { TRAVEL_GUIDES } from './travel-guides';

export interface FaqGroup {
  readonly id: string;
  readonly label: string;
  readonly introduction: string;
  readonly questions: readonly { question: string; answer: string }[];
  readonly link: { label: string; path: string };
}

// Reuse the answers on experience and planning pages so the FAQ stays consistent.
// This collection is imported only by the lazy-loaded FAQ route.
export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    id: 'booking', label: 'Booking & prices',
    introduction: 'What your quote covers, and how an enquiry becomes a confirmed plan.',
    questions: [
      { question: 'How much does diving cost?', answer: BOOKING_NOTES.price },
      { question: 'What is included in the dive price?', answer: BOOKING_NOTES.included },
      { question: 'Are flights, ferries, accommodation and permits included?', answer: BOOKING_NOTES.separate },
      { question: 'How do I book, and when is my place confirmed?', answer: BOOKING_NOTES.booking },
      { question: 'What should I include in my enquiry?', answer: 'Use the contact form to share your name, email, an optional phone number and your plans. Dates, group size, preferred activity and previous diving experience help the team suggest a suitable option. Discuss health information privately with the team; do not upload medical documents to the enquiry form.' }
    ],
    link: { label: 'Start a booking enquiry', path: '/contact' }
  },
  {
    id: 'first-dive', label: 'Your first dive',
    introduction: 'Swimming comfort, time in the water and what happens on the day.',
    questions: [
      EXPERIENCE_PLANNING['lagoon-diving'].faqs[0],
      { question: 'Who can join a lagoon try-dive?', answer: EXPERIENCE_PLANNING['lagoon-diving'].eligibility },
      EXPERIENCE_PLANNING['lagoon-diving'].faqs[1],
      { question: 'How long will I be underwater?', answer: EXPERIENCE_PLANNING['lagoon-diving'].timing },
      EXPERIENCE_PLANNING['lagoon-diving'].faqs[2],
      { question: 'What does a dive day look like?', answer: DIVE_DAY.map(step => `${step.title}: ${step.body}`).join(' ') },
      EXPERIENCE_PLANNING['lagoon-diving'].faqs[3]
    ],
    link: { label: 'Explore lagoon diving', path: '/experiences/lagoon-diving' }
  },
  {
    id: 'training', label: 'Certified dives & courses',
    introduction: 'Match the outing or training to your experience, rather than a fixed depth or deadline.',
    questions: [
      { question: 'Who can join a certified-diver outing?', answer: EXPERIENCE_PLANNING['deep-sea-diving'].eligibility },
      { question: 'How long is a guided certified dive?', answer: EXPERIENCE_PLANNING['deep-sea-diving'].timing },
      ...EXPERIENCE_PLANNING['deep-sea-diving'].faqs,
      ...EXPERIENCE_PLANNING['padi-courses'].faqs,
      { question: 'How much time do I need for a course?', answer: EXPERIENCE_PLANNING['padi-courses'].timing + ' ' + EXPERIENCE_PLANNING['padi-courses'].eligibility }
    ],
    link: { label: 'Compare the diving courses', path: '/courses' }
  },
  {
    id: 'activities', label: 'Other water activities',
    introduction: 'Build an unhurried island day around suitable activities and current conditions.',
    questions: [
      { question: 'What can I do besides scuba diving?', answer: 'Ask about snorkelling, kayaking, glass-bottom boat rides and deep sea fishing. ' + EXPERIENCE_PLANNING['water-sports'].timing },
      ...EXPERIENCE_PLANNING['water-sports'].faqs
    ],
    link: { label: 'See water activities', path: '/experiences/water-sports' }
  },
  {
    id: 'travel', label: 'Getting here & permits',
    introduction: 'Plan the permit, mainland journey and onward Kadmat connection together.',
    questions: [
      ...TRAVEL_FAQ.items.slice(0, 3),
      ...TRAVEL_GUIDES['planning'].faqs.slice(0, 3),
      TRAVEL_FAQ.items[6]
    ],
    link: { label: 'Read the travel & permit guide', path: '/lakshadweep-trip-planning' }
  },
  {
    id: 'stays', label: 'Accommodation',
    introduction: 'Local introductions, with stays booked independently with your chosen host.',
    questions: ACCOMMODATION_INFO.faqs,
    link: { label: 'Explore stay arrangements', path: '/kadmat-accommodation' }
  },
  {
    id: 'conditions', label: 'Weather, changes & preparation',
    introduction: 'Leave flexibility for the sea, and confirm the applicable arrangements before paying.',
    questions: [
      TRAVEL_GUIDES['conditions'].faqs[0],
      { question: 'What if weather, transport or permit issues change the plan?', answer: BOOKING_NOTES.weather },
      { question: 'What happens if I cancel my dive?', answer: BOOKING_NOTES.cancellation },
      TRAVEL_GUIDES['conditions'].faqs[1],
      { question: 'What should I check before arranging a flight after diving?', answer: 'Agree the interval between your final dive and flying with your instructor before booking your onward journey. Confirm your complete dive and travel plan rather than assuming a same-day flight will fit.' }
    ],
    link: { label: 'Read the timing & preparation guide', path: '/kadmat-visit-planning' }
  }
];
