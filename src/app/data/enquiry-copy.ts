import { ACCOMMODATION_INFO } from './accommodation-info';

export const ENQUIRY_COPY = {
  eyebrow: 'The dive desk', title: 'Plan your blue hour.',
  intro: 'Have a dive in mind? Tell us your plans.',
  accommodationNote: ACCOMMODATION_INFO.helpDescription + ' ' + ACCOMMODATION_INFO.disclaimer,
  unavailable: 'Online form submission is currently unavailable. Your details stay on this page. You can use any contact option shown below.',
  emailNotice: 'This form prepares an email in your own email app. You must send it there; this website does not send it for you.',
  endpointNotice: 'Send your plans securely to hello@scubalak.com. You’ll see a confirmation once our mail server accepts your enquiry.',
  name: 'Name', email: 'Email', phone: 'Phone (optional)',
  message: 'Your plans', messageHint: 'Tell us what you’d like to do in Kadmat, or ask us a question.',
  send: 'Send enquiry', prepare: 'Prepare email enquiry', submitting: 'Submitting…', unavailableButton: 'Sending unavailable',
  accepted: 'Enquiry sent to the dive desk', acceptedDetail: 'Our mail server has accepted your enquiry. This does not confirm a booking or availability.',
  prepared: 'Email enquiry prepared', preparedDetail: 'Your email app should open with a draft. Send it there; this website has not sent your enquiry. Your details remain on this page.',
  error: 'We couldn’t confirm delivery. Your details are still here. Please wait a minute before retrying, or contact us by email or WhatsApp.', validation: 'Please check the highlighted fields.',
  nameError: 'Enter your name on one line (2–100 characters).', emailError: 'Enter a valid email address, for example name@example.com.', phoneError: 'Use one line and no more than 30 characters for your phone number.', messageError: 'Use 12–2,000 characters of plain text to describe your plans.',
  required: 'Fields marked * are required.', emailAction: 'Email Scuba Lak',
  categories: [{ id: 'general', label: 'General enquiry' }, { id: 'diving', label: 'Diving experiences' }, { id: 'courses', label: 'PADI courses' }, { id: 'water-sports', label: 'Water sports' }, { id: 'accommodation', label: ACCOMMODATION_INFO.enquiryLabel }],
  travelLink: 'How to reach & permits',
  travelNote: 'Check arrival, onward transfers, permit responsibility and written terms before finalising travel.'
} as const;
