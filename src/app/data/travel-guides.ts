import { ACCOMMODATION_INFO } from './accommodation-info';

export interface TravelGuide {
  readonly eyebrow: string; readonly title: string; readonly introduction: string;
  readonly contactLabel: string; readonly contactInterest: 'accommodation' | 'diving';
  readonly sections: readonly { title: string; body: string; checklist: readonly string[] }[];
  readonly faqs: readonly { question: string; answer: string }[];
}
export const TRAVEL_GUIDES: Readonly<Record<string, TravelGuide>> = {
  accommodation: {
    eyebrow: ACCOMMODATION_INFO.eyebrow,
    title: 'Where to stay in Kadmat: resorts & homestays',
    introduction: ACCOMMODATION_INFO.description + ' ' + ACCOMMODATION_INFO.helpDescription,
    contactLabel: ACCOMMODATION_INFO.actionLabel, contactInterest: 'accommodation',
    sections: [
      { title: ACCOMMODATION_INFO.options[0].title, body: ACCOMMODATION_INFO.options[0].description, checklist: ['Ask the resort for current room photographs and facilities', 'Check its location and distance from your dive meeting point', 'Confirm the room, meals and booking terms directly'] },
      { title: ACCOMMODATION_INFO.options[1].title, body: ACCOMMODATION_INFO.options[1].description, checklist: ['Discuss occupancy, bathroom arrangements and meals with the host', 'Confirm check-in and check-out around your island travel', 'Ask the host about local transport and any house rules'] },
      { title: ACCOMMODATION_INFO.helpTitle, body: ACCOMMODATION_INFO.helpDescription, checklist: ['Share your intended diving dates with Scuba Lak', 'Ask us to help you reach a resort or homestay host', 'Make your accommodation booking directly with the property'] },
      { title: 'Confirm the stay with your host', body: ACCOMMODATION_INFO.disclaimer, checklist: ['Written confirmation from the property, not an accommodation package from Scuba Lak', 'Payments, changes and cancellations handled with the property', 'Confirm any transfers and permit assistance with the relevant provider'] }
    ],
    faqs: ACCOMMODATION_INFO.faqs
  },
  planning: {
    eyebrow: 'A practical start to your island journey',
    title: 'Plan a Lakshadweep trip around Kadmat Island',
    introduction: 'Start your Kadmat visit with the diving experience or course you want. Discuss your diving dates with Scuba Lak, arrange accommodation directly with a third-party resort or homestay, and confirm your journey with the relevant transport providers. We can help you reach out to local accommodation providers if needed.',
    contactLabel: 'Ask the dive team', contactInterest: 'diving',
    sections: [
      { title: 'Start with the right diving experience', body: 'Tell the team whether you want an introductory experience, dives as an already certified diver, or a certification course. Share your experience and any concerns during the booking conversation; the instructor must confirm suitability and the required participation documents.', checklist: ['Introductory lagoon diving or a supervised first experience', 'Certified-diver outings matched to experience and conditions', 'Course prerequisites, duration, study and assessment requirements'] },
      { title: 'Coordinate arrival and island transfers', body: 'Do not assume that reaching Lakshadweep means an immediate connection to Kadmat. Ask for the complete mainland-to-island itinerary and confirm each operator, transfer point and travel day before committing to flights or accommodation.', checklist: ['Confirmed arrival point and onward Kadmat connection', 'Current operating timetable and baggage arrangements', 'Contingency time and policies for delays or weather changes'] },
      { title: 'Check entry requirements with official sources', body: 'Entry requirements and permit procedures should be checked against current Lakshadweep Administration guidance and your authorised travel provider. Ask who handles your application, which documents they require and when approval must be received.', checklist: ['Current requirements for your nationality and itinerary', 'Application responsibility, documents and lead time', 'Written confirmation before non-refundable bookings'] },
      { title: 'Keep the island and reef in the plan', body: 'Leave time for the island beyond your activity schedule. Respect local customs and prayer spaces, ask before photographing people, avoid touching coral or collecting marine life, and take litter back from the beach and boat.', checklist: ['Comfortable time between diving and onward travel, agreed with your instructor', 'Appropriate clothing and respectful village visits', 'Reusable essentials and careful waste disposal'] }
    ],
    faqs: [
      { question: 'How can I personalise my Kadmat diving visit?', answer: 'Share your dates, group size, diving experience and training interests. Our team can help plan your diving. Book your accommodation directly with a third-party resort or homestay; we can help you reach out to them if needed.' },
      { question: 'Can a non-swimmer join every diving activity?', answer: 'No. Tell the team your swimming ability before choosing an activity. Introductory experiences and certification courses have different requirements; the instructor must confirm eligibility for the specific programme.' },
      { question: 'Where can I check official Lakshadweep travel information?', answer: 'Use the Lakshadweep Administration website and your authorised travel provider for current entry guidance. Recheck operational arrangements close to your travel date.' }
    ]
  }
};
