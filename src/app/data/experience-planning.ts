// Operational details confirmed by the business owner, 30 October 2026.
// Course-specific standards remain on the individual course pages.
export const BOOKING_NOTES = {
  price: 'Your quote depends on the season, group size and dive or activity plan. We confirm the total for your agreed plan before you book—no hidden dive-day extras.',
  included: 'Your agreed dive price includes local dive transport, equipment, briefing and guided support, and underwater photos/videos. Confirm the meeting point and media-sharing arrangements with the team.',
  separate: 'Flights or ferries to Lakshadweep, accommodation and entry-permit fees are separate. Book travel and stays with the relevant providers.',
  booking: 'Send an enquiry → agree your diving and travel plan → receive booking confirmation. An enquiry alone is not a confirmed place. Please wait for written confirmation from Scuba Lak, or speak directly with the team by phone or WhatsApp to confirm your booking. Ask for the dates, group total, meeting arrangements and applicable terms in writing before payment.',
  weather: 'Calmer seas often help visibility, but visibility and wildlife are never guaranteed. Weather, Lakshadweep transport restrictions or entry-permit issues may require a different plan or cancellation. Any eligible refund depends on the circumstances and will be confirmed by the team; no fixed percentage is promised.',
  cancellation: 'For guest cancellations, no refund is available once the guest and team are ready to begin the scheduled dive. This does not describe an operator cancellation for unsafe conditions. Discuss changes and applicable refund terms with the team before paying.',
  reviewed: '31 October 2026'
} as const;

export const DIVE_DAY = [
  { title: 'Meet the team', body: 'Arrive at the meeting point shared with your confirmation. Review your plan and participation documents.' },
  { title: 'Brief & practise', body: 'Check equipment, learn the signals and practise breathing with your guide before the dive.' },
  { title: 'Dive at your pace', body: 'Follow a plan matched to your suitability, comfort, certification and the sea conditions.' },
  { title: 'Return & share', body: 'Return with the team and confirm how you will receive the included photos and videos.' }
] as const;

export const EXPERIENCE_PLANNING: Readonly<Record<string, {
  readonly timing: string; readonly eligibility: string;
  readonly faqs: readonly { question: string; answer: string }[];
}>> = {
  'lagoon-diving': {
    timing: 'First-timers often spend around 15–20 minutes underwater; comfortable divers may spend up to around 30–40 minutes. This is a guide, not a guaranteed duration. Allow additional time for meeting, briefing/practice, transport and return; your full activity window is confirmed with your plan.',
    eligibility: 'Recreational try-dives are generally for ages 10–60, subject to the team’s assessment. Age alone does not confirm eligibility: medical suitability, water comfort, conditions and instructor availability all apply. Any required medical clearance must be completed before participation.',
    faqs: [
      { question: 'Can I join if I cannot swim?', answer: 'Some non-swimmers can join a supervised lagoon try-dive, but acceptance is not automatic. Tell the team before booking. You must be comfortable entering the water, breathing through a regulator and following instructions; you can tell your guide to stop if you feel uncomfortable. Certification courses have separate swimming requirements.' },
      { question: 'How deep will I go?', answer: 'Lagoon dives are planned up to about 5 metres, not a depth you must reach. Your guide sets the actual depth around your comfort, suitability and the conditions.' },
      { question: 'How long should I keep free?', answer: 'Underwater time is only part of the experience. Include time for arrival, equipment, briefing/practice, local transport and return. Ask for the complete date-specific window before arranging other activities.' },
      { question: 'What should I bring?', answer: 'Bring suitable swimwear, a towel, drinking water and the identification or participation documents requested in your confirmation. Share relevant health concerns privately with the team—not in the public enquiry form—and follow any medical-clearance instructions.' }
    ]
  },
  'deep-sea-diving': {
    timing: 'A typical guided dive may allow around 30–40 minutes underwater, depending on the agreed plan, air consumption, certification and conditions. Briefing, local transfers and return take additional time. Confirm the full outing window and number of dives with the team.',
    eligibility: 'For appropriately certified divers. Share your certification, recent logged experience and comfort level before booking. The team confirms the site, depth and any refresher or medical-clearance requirements; junior and training limits still apply.',
    faqs: [
      { question: 'Do I need Advanced Open Water?', answer: 'A deeper plan, potentially up to 30 metres for eligible adult divers, requires suitable training and experience. Share your existing certification; the team can suggest an outing within your actual limits. A 30-metre dive is not guaranteed.' },
      { question: 'Can I choose a particular dive site?', answer: 'Tell us which site interests you. The final site and route depend on your suitability, sea conditions and the team’s assessment that day. Site names are not a promise of cave, tunnel or other overhead access.' },
      { question: 'Are wildlife sightings guaranteed?', answer: 'No. Coral reefs and marine life are natural environments. Encounters and visibility vary, and the guide may change a route to respect conditions and the reef.' },
      { question: 'What if I have not dived recently?', answer: 'Tell the team when and where you last dived, your certification and approximate logged dives. A refresher or a shallower first outing may be needed before a deeper plan can be agreed.' }
    ]
  },
  'padi-courses': {
    timing: 'Course duration varies by programme, eLearning preparation, assessments and conditions. Each course page lists an indicative schedule; confirm enough island time before booking travel.',
    eligibility: 'Age, swimming ability, prior certification, experience and medical documentation depend on the course. Review the individual prerequisites and let the instructor confirm your training plan.',
    faqs: [
      { question: 'Which course should I choose?', answer: 'Share your current certification, swimming ability, goals and time on Kadmat. The instructor can recommend a suitable starting point; an enquiry does not guarantee acceptance or certification.' },
      { question: 'Is certification guaranteed within the listed time?', answer: 'No. Schedules are indicative. Completion depends on meeting the programme’s knowledge, water-skills and assessment requirements, as well as conditions.' }
    ]
  },
  'water-sports': {
    timing: 'The activity window depends on your chosen mix of snorkelling, kayaking, glass-bottom boat time or fishing. Confirm the duration, meeting point and local conditions with your quote.',
    eligibility: 'Tell the team the activity you want, guest ages and swimming comfort. Suitability, supervision and equipment requirements are confirmed for each activity and the day’s conditions.',
    faqs: [
      { question: 'Can I combine activities?', answer: 'Ask the team about your preferred mix and available island time. The final plan depends on weather, suitability and availability; your quote will identify what is included.' },
      { question: 'Is every activity suitable for a non-swimmer?', answer: 'No. Tell the team your water comfort and swimming ability before booking so they can confirm suitable activities, supervision and equipment.' }
    ]
  }
};
