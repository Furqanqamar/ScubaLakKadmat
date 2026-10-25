import { ACCOMMODATION_INFO } from './accommodation-info';

export const ENQUIRY_COPY = {
  eyebrow: 'The dive desk', title: 'Plan your blue hour.',
  intro: 'Tell us about the diving experience or training you have in mind. Share your dates, group size and experience level so the dive team can help you choose the right time in the water.',
  accommodationNote: ACCOMMODATION_INFO.helpDescription + ' ' + ACCOMMODATION_INFO.disclaimer,
  unavailable: 'Online form submission is currently unavailable. Your details stay on this page. You can use any contact option shown below.',
  emailNotice: 'This form prepares an email in your own email app. You must send it there; this website does not send it for you.',
  endpointNotice: 'Submit your details to the dive desk. We will show a confirmation only after the enquiry service accepts them.',
  name: 'Name', email: 'Email', phone: 'Phone / WhatsApp (optional)', category: 'Interested in', item: 'Course, experience or dive spot (optional)',
  start: 'Preferred arrival date (optional)', flexibility: 'Date flexibility (optional)', guests: 'Number of guests (optional)', level: 'Diving experience (optional)',
  message: 'Your plans', messageHint: 'Tell us what matters to you, or add any questions about the selected experience.',
  choose: 'No specific selection', send: 'Send enquiry', prepare: 'Prepare email enquiry', submitting: 'Submitting…', unavailableButton: 'Sending unavailable',
  chooseCourse: 'PADI courses — help me choose',
  accepted: 'Enquiry accepted', acceptedDetail: 'The enquiry service has accepted your details. This does not confirm a booking or availability.',
  prepared: 'Email enquiry prepared', preparedDetail: 'Your email app should open with a draft. Send it there; this website has not sent your enquiry. Your details remain on this page.',
  error: 'Your enquiry could not be submitted. Your details are still here. Please try again.', validation: 'Please check the highlighted fields.',
  nameError: 'Enter your name (2–100 characters).', emailError: 'Enter a valid email address.', messageError: 'Use 12–2,000 characters to describe your plans.',
  guestsError: 'Enter a whole number from 1 to 100.', dateError: 'Choose a valid future date, or leave it blank.',
  required: 'Fields marked * are required.', whatsapp: 'Continue in WhatsApp', call: 'Call Scuba Lak', emailAction: 'Email Scuba Lak',
  categories: [{ id: 'general', label: 'General enquiry' }, { id: 'diving', label: 'Diving experiences' }, { id: 'courses', label: 'PADI courses' }, { id: 'water-sports', label: 'Water sports' }, { id: 'accommodation', label: ACCOMMODATION_INFO.enquiryLabel }],
  levels: ['New to diving', 'Tried diving before', 'Certified diver', 'Continuing education / professional training'],
  flexibilityOptions: ['Fixed dates', 'A few days either side', 'Flexible within the month', 'Still deciding'],
  travelLink: 'How to reach & permits',
  travelNote: 'Check arrival, onward transfers, permit responsibility and written terms before finalising travel.'
} as const;
