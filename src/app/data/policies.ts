import { BUSINESS_CONTACT } from './business-config';
import { BOOKING_NOTES } from './experience-planning';

export interface PolicyDocument {
  readonly title: string;
  readonly introduction: string;
  readonly updated: string;
  readonly sections: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    items?: readonly string[];
  }[];
}

// Customer-facing wording authorised for publication on 31 October 2026.
// Superseded refund tiers and unconfirmed retention/refund deadlines are excluded.
// Keep full policy copy in this lazy route, not the site's initial bundle.
export const POLICIES: Readonly<Record<string, PolicyDocument>> = {
  privacy: {
    title: 'Privacy policy',
    introduction: 'Your plans are personal. Here is how we use the details you share with Scuba Lak, and how to ask us about them.',
    updated: '31 October 2026',
    sections: [
      { id: 'who-we-are', title: 'Who handles your information', paragraphs: [
        `${BUSINESS_CONTACT.name}, ${BUSINESS_CONTACT.address}, India, handles enquiries submitted through this website. For privacy questions, corrections, deletion requests or complaints, email ${BUSINESS_CONTACT.email}. You may also ask us to stop following up on your enquiry.`
      ] },
      { id: 'information', title: 'What we collect and why', paragraphs: [
        'When you send an enquiry, we receive the details you choose to share. These help us answer your questions, discuss suitability and availability, prepare a quotation and, if you proceed, arrange your booking.',
        'We do not add you to marketing lists simply because you contact us.'
      ], items: ['Your name and email address', 'Your phone number, if you choose to provide it', 'The plans or questions you enter', 'The course, activity or dive site you selected when starting the enquiry, where relevant'] },
      { id: 'sharing', title: 'How we use and share your information', paragraphs: [
        'We do not sell enquiry information. We use your details to respond to your questions, discuss your plans and help arrange the services you request. Access is limited to our team and service providers who help us handle enquiries and bookings. Some service providers may handle information outside India.',
        'If information needs to be shared with a separate provider for an arrangement you request, we will explain who will receive it and why. We may also share information where required by law.'
      ] },
      { id: 'care', title: 'Looking after your information', paragraphs: [
        'We take reasonable care to protect your information and limit access to people who need it to help with your enquiry or booking. We may use basic information about website activity to prevent spam and misuse. No online service can guarantee complete security.'
      ] },
      { id: 'retention', title: 'How long information is kept', paragraphs: [
        'We keep enquiry information for as long as needed to respond to your plans, manage a booking or deal with related questions. Records needed for a payment, dispute, incident, insurance or legal obligation may need to be kept longer for that purpose.',
        'You can ask us to delete information that is no longer needed. A deletion request does not remove information we are required to retain.'
      ] },
      { id: 'choices', title: 'Your choices and privacy questions', paragraphs: [
        `Email ${BUSINESS_CONTACT.email} to ask about your information, correct it, request deletion, withdraw permission to use it for an enquiry or stop further follow-up. We may need to confirm your identity without collecting unnecessary documents.`,
        'Withdrawing permission or deleting information may limit our ability to continue an enquiry or arrange a booking. It does not remove records that must be retained for a legal obligation.'
      ] },
      { id: 'sensitive-details', title: 'Children and sensitive information', paragraphs: [
        'Please do not put passport copies, payment details, medical records or other sensitive documents into the enquiry form. If participation forms or medical clearance are needed, the team will explain the appropriate process separately.',
        'A parent or guardian should make enquiries for children. Please do not submit a child’s personal documents through the enquiry form.'
      ] },
      { id: 'other-services', title: 'Other websites and services', paragraphs: [
        'Maps, social media and messaging links may connect you with other services. Those services have their own privacy practices. Please review their notices when using them.'
      ] },
      { id: 'updates', title: 'Updates to this policy', paragraphs: [
        'If the way we handle enquiries changes, we will update this page and its review date. Contact the team if you have a question about how this policy applies to your enquiry.'
      ] }
    ]
  },
  booking: {
    title: 'Booking & cancellation policy',
    introduction: 'A clear understanding before your island day: confirming a booking, agreeing a price and knowing what happens if plans change.',
    updated: '31 October 2026',
    sections: [
      { id: 'confirmation', title: 'When your booking is confirmed', paragraphs: [
        'An enquiry or the website’s automatic delivery confirmation is not a confirmed booking. Please wait for written confirmation from Scuba Lak, or speak directly with our team by phone or WhatsApp to confirm your booking.',
        'Your booking is confirmed only when the team explicitly confirms the agreed arrangements. A general conversation or an automatic reply is not confirmation.'
      ] },
      { id: 'price-payment', title: 'Your quote, deposit and payment', paragraphs: [
        BOOKING_NOTES.price,
        'Before you pay, the team will set out the activity or course, date, participants, eligibility, price, inclusions, exclusions and any deposit or balance deadline in writing. Any different course or group terms must be explained and agreed before payment, not added afterwards.',
        'Use only the payment instructions provided through our confirmed business contact channels. The website enquiry form does not take card payments.'
      ] },
      { id: 'inclusions', title: 'What your price includes', paragraphs: [
        BOOKING_NOTES.included,
        'Flights or ferries to Lakshadweep, onward inter-island transfers, accommodation and entry-permit fees are separate from local dive transport. Book these with the relevant providers and confirm their own inclusions and terms.',
        'For water activities or a course, confirm the exact programme and inclusions shown in your individual quote.'
      ] },
      { id: 'participation', title: 'Suitability and your dive plan', paragraphs: [
        'Share accurate information about your experience, swimming comfort and eligibility. Complete the required participation forms and follow the instructor’s safety decisions. Discuss medical or suitability questions privately with the team before committing to an activity; do not send health documents through the public enquiry form.',
        'The site, depth, timing and sequence depend on conditions, permissions, participant experience and the team’s assessment. A particular dive site, visibility or wildlife sighting cannot be guaranteed. Certification depends on meeting the programme requirements, not just attending for a stated number of days.'
      ] },
      { id: 'guest-changes', title: 'If you change or cancel your booking', paragraphs: [
        `Contact ${BUSINESS_CONTACT.email} or either published WhatsApp number as soon as you need to change or cancel. A request to reschedule is subject to availability; wait for the team to confirm a new arrangement.`,
        BOOKING_NOTES.cancellation,
        'For a cancellation before that point, the team will explain the applicable terms and any refund after considering the circumstances and the arrangements agreed for your booking. Do not assume an automatic full refund or a fixed refund percentage.'
      ] },
      { id: 'weather', title: 'Weather, travel restrictions and permit issues', paragraphs: [
        BOOKING_NOTES.weather,
        'Safety takes priority. The guest-cancellation cutoff does not mean that an activity cancelled by Scuba Lak for unsafe conditions is automatically non-refundable. Contact the team to discuss the changed plan, available alternatives and any applicable refund.'
      ] },
      { id: 'refunds', title: 'Questions about a refund', paragraphs: [
        'Ask the team to confirm any agreed refund amount, method and expected processing time in writing. Payment-provider processing may take additional time. No universal processing deadline or refund percentage is promised on this page.',
        `If you have a question about an agreed refund, contact ${BUSINESS_CONTACT.email} or either published phone number.`
      ] },
      { id: 'independent-arrangements', title: 'Independent travel and accommodation', paragraphs: [
        'Scuba Lak focuses on diving and does not sell accommodation packages. We can help you reach local hosts or providers, but your stay is booked independently with the chosen property.',
        'Flights, ferries, inter-island transfers, permits and accommodation have their own providers and terms. Confirm their booking, payment and cancellation arrangements separately. A Scuba Lak enquiry or dive confirmation does not confirm those services.'
      ] },
      { id: 'help-rights', title: 'Contact hours, questions and your rights', paragraphs: [
        'The contact desk is normally available every day, 9:00 am–6:00 pm IST. Dive times are arranged separately and may fall outside those hours, subject to the agreed plan and conditions.',
        'If something is unclear, ask the team before making payment. Nothing in this policy limits your rights under applicable law.'
      ] }
    ]
  }
};
