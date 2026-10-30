import { ACCOMMODATION_INFO } from './accommodation-info';

export interface TravelGuide {
  readonly eyebrow: string; readonly title: string; readonly introduction: string;
  readonly contactLabel: string; readonly contactInterest: 'accommodation' | 'diving';
  readonly sections: readonly { title: string; body: string; checklist: readonly string[] }[];
  readonly faqs: readonly { question: string; answer: string }[];
  readonly reviewed?: string;
  readonly sources?: readonly { label: string; url: string }[];
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
    reviewed: '30 October 2026',
    sources: [{ label: 'Official arrival guidance', url: 'https://lakshadweep.gov.in/how-to-reach/' }, { label: 'Official entry-permit guidance', url: 'https://lakshadweep.gov.in/tourism/entry-permit/' }],
    sections: [
      { title: 'Start with the right diving experience', body: 'Tell the team whether you want an introductory experience, dives as an already certified diver, or a certification course. Share your experience and any concerns during the booking conversation; the instructor must confirm suitability and the required participation documents.', checklist: ['Introductory lagoon diving or a supervised first experience', 'Certified-diver outings matched to experience and conditions', 'Course prerequisites, duration, study and assessment requirements'] },
      { title: 'Coordinate arrival and island transfers', body: 'Do not assume that reaching Lakshadweep means an immediate connection to Kadmat. Mainland arrival, onward island transport and your dive-day local transfer are different arrangements. Ask for the complete itinerary and confirm each operator and travel day before committing to flights or accommodation.', checklist: ['Confirmed arrival point, onward Kadmat connection and return route', 'Current operating timetable, baggage arrangements and transfer responsibility', 'Contingency time and each provider’s policies for delays or weather changes'] },
      { title: 'Check entry requirements with official sources', body: 'Entry requirements and permit procedures should be checked against current Lakshadweep Administration guidance and your authorised travel provider. Ask who handles your application, which documents they require and when approval must be received.', checklist: ['Current requirements for your nationality and itinerary', 'Application responsibility, documents and lead time', 'Written confirmation before non-refundable bookings'] },
      { title: 'Keep the island and reef in the plan', body: 'Leave time for the island beyond your activity schedule. Respect local customs and prayer spaces, ask before photographing people, avoid touching coral or collecting marine life, and take litter back from the beach and boat.', checklist: ['Comfortable time between diving and onward travel, agreed with your instructor', 'Appropriate clothing and respectful village visits', 'Reusable essentials and careful waste disposal'] }
    ],
    faqs: [
      { question: 'How can I personalise my Kadmat diving visit?', answer: 'Share your dates, group size, diving experience and training interests. Our team can help plan your diving. Book your accommodation directly with a third-party resort or homestay; we can help you reach out to them if needed.' },
      { question: 'Can a non-swimmer join every diving activity?', answer: 'No. Tell the team your swimming ability before choosing an activity. Introductory experiences and certification courses have different requirements; the instructor must confirm eligibility for the specific programme.' },
      { question: 'Where can I check official Lakshadweep travel information?', answer: 'Use the Lakshadweep Administration website and your authorised travel provider for current entry guidance. Recheck operational arrangements close to your travel date.' }
    ]
  },
  conditions: {
    eyebrow: 'Timing, conditions & preparation',
    title: 'When to plan your Kadmat diving visit',
    introduction: 'Choose your dates around the dive you want, then leave room for the sea. This guide helps you ask the right questions without promising a fixed visibility, wildlife encounter or departure schedule.',
    contactLabel: 'Discuss your dates', contactInterest: 'diving', reviewed: '30 October 2026',
    sources: [{ label: 'Lakshadweep travel guidance', url: 'https://lakshadweep.gov.in/how-to-reach/' }, { label: 'Kadmat: official island overview', url: 'https://lakshadweep.gov.in/islands/kadmat/' }],
    sections: [
      { title: 'Start with current conditions, not a guarantee', body: 'Calmer seas often help underwater visibility, but conditions change and sheltered lagoon water can differ from the outer reef. Ask the Kadmat team about your proposed dates and the type of diving you want. A suitable season does not guarantee that every day or site will be available.', checklist: ['Ask about likely lagoon and outer-reef conditions for your dates', 'Treat visibility and wildlife as natural variations', 'Let the team reconfirm the dive plan close to departure'] },
      { title: 'Leave breathing room in the itinerary', body: 'A course, a first lagoon dive and a certified-diver outing need different amounts of island time. Transport restrictions and permit issues may also change a plan. Confirm the whole journey before you pay for non-refundable travel.', checklist: ['Agree your activity window and any course preparation first', 'Check the onward Kadmat connection and return journey', 'Ask your instructor about the interval needed before flying; do not schedule it yourself from a generic itinerary'] },
      { title: 'Pack simply and share what matters', body: 'The agreed dive price includes local dive transport, equipment, briefing and guided support, plus underwater photos/videos. Bring the personal essentials requested with your confirmation and discuss suitability privately with the team.', checklist: ['Swimwear, towel, drinking water and sun protection', 'Identification, certification and logbook where relevant', 'Requested participation forms and any required medical clearance'] },
      { title: 'Know what happens if the plan changes', body: 'Weather, travel limitations or permit issues can require a changed plan or cancellation. Refund eligibility depends on the circumstances. Ask for applicable terms in writing before payment; guest cancellations are not refundable once the guest and team are ready to begin the scheduled dive.', checklist: ['Keep a reliable contact number for trip updates', 'Reconfirm the meeting point and time with the team', 'Check separate travel and accommodation cancellation terms with each provider'] }
    ],
    faqs: [
      { question: 'Is there a guaranteed best month for visibility?', answer: 'No month guarantees visibility on a particular day. Ask the team for local expectations around your proposed dates; weather and sea conditions still determine the final plan.' },
      { question: 'Are dive times restricted to the contact-desk hours?', answer: 'No. The contact desk is normally available daily from 9:00 am to 6:00 pm IST, but dives are arranged separately and may fall outside those hours depending on the agreed plan and conditions.' },
      { question: 'Should I book travel before asking about a dive?', answer: 'Discuss the activity, suitability, availability and complete island itinerary first. An enquiry alone does not confirm a place, transport connection or entry permit.' }
    ]
  },
  islandDay: {
    eyebrow: 'Island life, at an easier pace',
    title: 'Kadmat beyond the dive',
    introduction: 'Leave a little space between the underwater moments. Kadmat’s shore, lagoon and village life reward a thoughtful visit—without a packed sightseeing checklist or a promise of organised excursions.',
    contactLabel: 'Ask about island activities', contactInterest: 'diving', reviewed: '30 October 2026',
    sources: [{ label: 'Kadmat: official island overview', url: 'https://lakshadweep.gov.in/islands/kadmat/' }, { label: 'Lakshadweep culture & heritage', url: 'https://lakshadweep.gov.in/about-lakshadweep/culture-heritage/' }],
    sections: [
      { title: 'Keep some unplanned shore time', body: 'A quiet walk, a view over the lagoon or time with your travel companions can be enough. Ask locally about suitable public areas, tides and access before setting out. Beaches and the sea are natural environments, not supervised swimming pools.', checklist: ['Check access and local guidance rather than assuming every shore is open', 'Keep away from working boats, restricted facilities and private property', 'Ask the team about supervised water activities if you want to enter the lagoon'] },
      { title: 'Visit with respect', body: 'Kadmat is a lived-in island. Dress considerately away from activity areas, respect prayer spaces and local routines, and ask permission before photographing people or their homes. Follow current local rules and your host’s advice.', checklist: ['Ask before taking close-up photographs of people', 'Keep village and residential visits considerate and quiet', 'Confirm any local restrictions with your host or authorised provider'] },
      { title: 'Give the reef room', body: 'Whether diving, snorkelling or looking into shallow water, avoid touching or standing on coral. Watch without chasing wildlife, do not collect shells or marine life, and keep litter off the beach and boat.', checklist: ['Maintain space from coral and wildlife', 'Use reusable essentials where practical', 'Take your waste back and follow local disposal guidance'] },
      { title: 'Choose an activity, not a crowded schedule', body: 'Scuba Lak offers snorkelling, kayaking, glass-bottom boat rides and deep sea fishing alongside diving. Ask which options suit your group, swimming comfort and the day’s conditions. Accommodation is booked independently with third-party resorts or homestays.', checklist: ['Confirm suitability, supervision, duration and the total quote', 'Leave time for your briefing, return and onward travel', 'Ask directly before assuming a transfer, meal or stay is included'] }
    ],
    faqs: [
      { question: 'Does this guide describe a sightseeing package?', answer: 'No. This is independent planning guidance. Ask Scuba Lak about the specific diving or water activity you want and arrange your stay directly with the accommodation provider.' },
      { question: 'Can everyone join snorkelling or kayaking?', answer: 'Eligibility differs by activity. Share guest ages and swimming comfort, and let the team confirm suitability, conditions and supervision before you book.' }
    ]
  }
};
