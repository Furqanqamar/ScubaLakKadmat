import { ACCOMMODATION_INFO } from './accommodation-info';

export interface TravelGuide {
  readonly eyebrow: string; readonly title: string; readonly introduction: string;
  readonly contactLabel: string; readonly contactInterest: 'accommodation' | 'diving';
  readonly sections: readonly { title: string; body: string; checklist: readonly string[]; links?: readonly { label: string; url: string }[] }[];
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
    introduction: 'Come by sea, or fly to Agatti and continue by boat. A Kadmat visit brings together an entry permit, mainland travel, an island connection and a place to stay. Plan these together, then shape your time in the water with Scuba Lak.',
    contactLabel: 'Ask the dive team', contactInterest: 'diving',
    reviewed: '30 October 2026',
    sources: [{ label: 'Lakshadweep Administration: arrival guidance', url: 'https://lakshadweep.gov.in/how-to-reach/' }, { label: 'e-Permit: requirements & documents', url: 'https://lak.e-permit.utl.gov.in/faq' }, { label: 'IRCTC Lakshadweep: booking & boarding FAQs', url: 'https://lakshadweep.irctc.co.in/faq' }],
    sections: [
      { title: 'First, arrange your entry permit', body: 'Visitors normally need an approved Lakshadweep entry permit, including Indian tourists. Apply online through the official e-Permit portal under the correct visit category. Scuba Lak recommends starting at least 15 days before travel, preferably earlier. This is a planning allowance, not a government processing guarantee; approval can take longer.', checklist: ['Prepare a recent passport-size colour photo and the proof of address requested by the portal', 'Include your travel dates and every island you will visit or transit, including Agatti when flying', 'Check names and dates, track approval, and carry the valid permit and matching ID before boarding a ship or flight'], links: [{ label: 'Apply on the official e-Permit portal', url: 'https://lak.e-permit.utl.gov.in/' }] },
      { title: 'By ship: the budget-first option', body: 'Passenger ships are usually the more economical mainland option, depending on the route and cabin class. Start with Kochi; the official ticketing portal also lists services involving Beypore and Mangalore. The operating fleet and sailings vary with the season and vessel maintenance. Use the actual timetable, not a fixed ship count or an assumed daily departure.', checklist: ['Obtain your valid permit before reserving; the IRCTC portal asks permit holders for their permit application number', 'Check the island calls, class, journey duration, return sailing and final fare for your dates', 'Complete the required web check-in and carry your boarding pass, permit and matching identification'], links: [{ label: 'Check ships & book with IRCTC Lakshadweep', url: 'https://lakshadweep.irctc.co.in/' }] },
      { title: 'By air: arrive on Agatti', body: 'Agatti (AGX) is Lakshadweep’s only airport; there is no direct flight to Kadmat. Mainland options include Kochi, Bengaluru and Goa, depending on the airline and date. Check the operating airline’s current schedule and baggage allowance rather than assuming every route runs every day.', checklist: ['Kochi–Agatti: check Alliance Air and IndiGo', 'Bengaluru–Agatti: check IndiGo', 'Goa–Agatti: check FLY91; confirm the Goa airport shown on your ticket'], links: [{ label: 'Alliance Air schedules', url: 'https://allianceair.in/schedule' }, { label: 'IndiGo: Agatti flights', url: 'https://www.goindigo.in/domestic-flights/flights-to-agatti.html' }, { label: 'FLY91 flights', url: 'https://fly91.in/' }] },
      { title: 'Connect from Agatti to Kadmat', body: 'High-speed vessels and other authorised boat services connect islands when operating conditions allow. Travel time depends on the island, vessel, stops and sea conditions. A flight to Agatti does not include or confirm your onward Kadmat connection; do not assume a same-day transfer.', checklist: ['Confirm the operator, sailing date, landing point, baggage and separate transfer cost', 'Arrange the return connection too, with buffer time for disruption or an overnight stay if needed', 'Recheck services close to departure; weather, maintenance or local restrictions can change a plan'] },
      { title: 'Find a stay that suits your visit', body: 'Choose a local homestay, resort or an authorised Lakshadweep tour operator for separately arranged travel and stays. Scuba Lak can help you explore suitable local options and reach accommodation providers. We focus on diving and do not sell accommodation packages.', checklist: ['Tell us your dates, group size, preferred comfort and budget for a useful local introduction', 'Check the provider’s authorisation and confirm room, meals, transfers and any permit assistance', 'Book directly with your chosen property or operator; get inclusions, payments and cancellation terms in writing'] },
      { title: 'Leave room for the dive, and the island', body: 'Discuss your diving experience, swimming comfort and course interests with the team before confirming a plan. Your agreed dive quote includes local dive transport, equipment, briefing, guided support and underwater photos/videos. Mainland travel, inter-island transfers, accommodation and permit fees are separate.', checklist: ['Let the instructor confirm activity suitability, course prerequisites and time needed', 'Agree the interval between your final dive and flying with your instructor', 'Respect village routines, ask before photographing people, leave coral and wildlife untouched, and take litter back'] }
    ],
    faqs: [
      { question: 'Can I book a flight before my permit is approved?', answer: 'You may be able to buy a flight before approval, but a ticket is not permission to enter Lakshadweep. Compare fares early and check the airline’s change and cancellation terms. If you book while approval is pending, you bear the risk of permit delays or refusal; approval and a valid permit are required before travel. Early booking does not guarantee a lower fare.' },
      { question: 'Does a permit always take exactly 15 days?', answer: 'No. Allow at least 15 days as Scuba Lak’s planning recommendation and start earlier where possible. The Administration controls approval, may need further checks, and can take longer. Do not treat an application receipt or an indicative processing estimate as an approved permit.' },
      { question: 'Do foreign visitors follow the same process?', answer: 'Nationality can affect permitted islands, documents and ticket-booking options. Foreign visitors should confirm current requirements with the Administration, their airline and an authorised local provider before paying; do not assume every island or online reservation category is available.' },
      { question: 'Can a non-swimmer join every diving activity?', answer: 'No. Tell the team your swimming ability before choosing an activity. Introductory experiences and certification courses have different requirements; the instructor must confirm eligibility for the specific programme.' },
      { question: 'Does my enquiry confirm a trip or a transport connection?', answer: 'No. An enquiry starts a conversation. Agree your dive plan with Scuba Lak, and confirm the permit, journeys and stay with the responsible providers separately. Weather, permits or travel limitations may change the itinerary; check each provider’s own terms before payment.' }
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
