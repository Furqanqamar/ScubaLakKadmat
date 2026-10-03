export interface TravelGuide {
  readonly eyebrow: string; readonly title: string; readonly introduction: string;
  readonly sections: readonly { title: string; body: string; checklist: readonly string[] }[];
  readonly faqs: readonly { question: string; answer: string }[];
}
export const TRAVEL_GUIDES: Readonly<Record<string, TravelGuide>> = {
  accommodation: {
    eyebrow: 'Stay for the island, not just the dive',
    title: 'Kadmat accommodation for your diving holiday',
    introduction: 'A Lakshadweep holiday works best when your stay, diving schedule and island transfers are planned together. Use this guide to discuss what matters to you before requesting an accommodation-and-diving proposal from Scuba Lak. Properties, room categories and availability must be confirmed for your dates; this page is not a live hotel inventory.',
    sections: [
      { title: 'Choose a stay around your days on the water', body: 'A course-focused trip and a relaxed beach holiday have different needs. Ask how the proposed accommodation connects to the dive meeting point, where briefings take place, and how much time you have between training and meals.', checklist: ['Distance and transport to the dive meeting point', 'Quiet time for course study and rest', 'Check-in and check-out around island arrival times'] },
      { title: 'Compare room features, not only the package name', body: 'Budget and premium are starting points for a conversation, not promises about a particular property. Before confirming, request the property name, current photographs, exact room type and a written list of amenities.', checklist: ['Air conditioning, bathroom and occupancy arrangements', 'Beach access versus an actual sea-facing room', 'Meal plan, dietary needs, drinking water and connectivity'] },
      { title: 'Understand the total island-stay quote', body: 'Compare proposals using the same number of nights, guests and diving days. Separate accommodation from diving, equipment, certification, permit support and transfers so that a low headline price does not hide a different trip.', checklist: ['Room cost, taxes and number of nights', 'Diving or course inclusions and any separate fees', 'Arrival transfers, cancellation terms and weather-related changes'] }
    ],
    faqs: [
      { question: 'Does Scuba Lak show live hotel availability?', answer: 'No. Contact the team for a dated proposal. Confirm the named property, room category, availability and terms in writing before paying.' },
      { question: 'Can I plan accommodation with a PADI course?', answer: 'You can ask the team to plan both together. Share the course you are interested in and your travel dates, and confirm the training schedule before finalising the number of nights.' },
      { question: 'Is every accommodation image a photograph of a bookable room?', answer: 'No. Some website imagery is AI-generated illustration. Request current photographs of the exact property and room included in your quote.' }
    ]
  },
  planning: {
    eyebrow: 'A practical start to your island journey',
    title: 'Plan a Lakshadweep trip around Kadmat Island',
    introduction: 'Kadmat brings together lagoon time, scuba diving, water sports and quiet island days. Start with the experience you want, then coordinate dates, accommodation and arrival arrangements. This planning checklist helps you ask useful questions without treating changing transport schedules or indicative prices as a confirmed booking.',
    sections: [
      { title: 'Start with the right diving experience', body: 'Tell the team whether you want an introductory experience, dives as an already certified diver, or a certification course. Share your experience and any concerns during the booking conversation; the instructor must confirm suitability and the required participation documents.', checklist: ['Introductory lagoon diving or a supervised first experience', 'Certified-diver outings matched to experience and conditions', 'Course prerequisites, duration, study and assessment requirements'] },
      { title: 'Coordinate arrival and island transfers', body: 'Do not assume that reaching Lakshadweep means an immediate connection to Kadmat. Ask for the complete mainland-to-island itinerary and confirm each operator, transfer point and travel day before committing to flights or accommodation.', checklist: ['Confirmed arrival point and onward Kadmat connection', 'Current operating timetable and baggage arrangements', 'Contingency time and policies for delays or weather changes'] },
      { title: 'Check entry requirements with official sources', body: 'Entry requirements and permit procedures should be checked against current Lakshadweep Administration guidance and your authorised travel provider. Ask who handles your application, which documents they require, what fees apply, and when approval must be received.', checklist: ['Current requirements for your nationality and itinerary', 'Application responsibility, documents and lead time', 'Written confirmation before non-refundable bookings'] },
      { title: 'Keep the island and reef in the plan', body: 'Leave time for the island beyond your activity schedule. Respect local customs and prayer spaces, ask before photographing people, avoid touching coral or collecting marine life, and take litter back from the beach and boat.', checklist: ['Comfortable time between diving and onward travel, agreed with your instructor', 'Appropriate clothing and respectful village visits', 'Reusable essentials and careful waste disposal'] }
    ],
    faqs: [
      { question: 'How much does a Kadmat diving holiday cost?', answer: 'The total depends on dates, travel, nights, room choice and diving or course inclusions. Request an itemised written quote rather than relying on a single per-person headline price.' },
      { question: 'Can a non-swimmer join every diving activity?', answer: 'No. Tell the team your swimming ability before choosing an activity. Introductory experiences and certification courses have different requirements; the instructor must confirm eligibility for the specific programme.' },
      { question: 'Where can I check official Lakshadweep travel information?', answer: 'Use the Lakshadweep Administration website and your authorised travel provider for current entry guidance. Recheck operational arrangements close to your travel date.' }
    ]
  }
};
