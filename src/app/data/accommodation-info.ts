// Shared wording keeps stay guidance separate from Scuba Lak's diving services.
export const ACCOMMODATION_INFO = {
  eyebrow: 'Your stay, independently arranged',
  title: 'Dive with us.',
  titleAccent: 'Stay locally.',
  description: 'Kadmat has third-party resorts and homestays. Choose the stay that suits you and contact the property directly to arrange your accommodation.',
  shortNote: 'Third-party resorts and local homestays are booked independently with the property. We can help you reach out to a local host.',
  helpTitle: 'Need an introduction?',
  helpDescription: 'Scuba Lak focuses on diving, not accommodation packages. We can help you reach out to third-party resorts or homestay hosts, or suggest a local tour operator for separately arranged travel and stays.',
  disclaimer: 'Accommodation is provided and booked independently with the property. Confirm rooms, availability, payments and cancellation terms directly with your host.',
  actionLabel: 'Ask for a local introduction',
  guideLinkLabel: 'Where to stay in Kadmat',
  enquiryLabel: 'Third-party stay introductions',
  options: [
    { id: 'resorts', title: 'Third-party resorts', description: 'Contact the resort directly for its rooms, facilities, availability and booking arrangements.', icon: 'fa-hotel' },
    { id: 'homestays', title: 'Local homestays', description: 'Speak directly with a local host about the room, meals, location and terms that suit your visit.', icon: 'fa-house' }
  ],
  faqs: [
    { question: 'Does Scuba Lak offer accommodation packages?', answer: 'No. We focus on diving and do not sell accommodation packages. Third-party resorts and local homestays arrange stays directly with their guests.' },
    { question: 'Can Scuba Lak help me find somewhere to stay?', answer: 'Yes. We can help you reach out to third-party resorts or homestay hosts. You confirm the accommodation and make the booking directly with the property.' },
    { question: 'Who confirms the room and handles payments or cancellations?', answer: 'Your chosen property or host. Confirm the exact room, facilities, availability, payment arrangements and cancellation terms with them before booking.' }
  ]
} as const;
