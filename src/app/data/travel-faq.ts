import { ACCOMMODATION_INFO } from './accommodation-info';

export const TRAVEL_FAQ = {
  title: 'How to reach & permits',
  introduction: 'Plan the whole journey to Kadmat before committing to travel. An arrival on another island does not confirm an onward connection.',
  items: [
    { question: 'What is the budget-first way to reach Lakshadweep?', answer: 'Passenger ships are usually the more economical mainland option, depending on route and cabin class. Check IRCTC Lakshadweep for actual sailings, fares and island calls; the operating fleet varies with the season and maintenance. Permit holders need their permit details for reservation. Confirm the return journey too.' },
    { question: 'Where can I fly, and how do I reach Kadmat?', answer: 'Flights arrive on Agatti (AGX), Lakshadweep’s only airport. Check Kochi with Alliance Air or IndiGo, Bengaluru with IndiGo, and Goa with FLY91 for your dates. Continue to Kadmat by a separately confirmed high-speed vessel or authorised boat service. Check the operator, day, baggage, cost and return connection; sea conditions can alter schedules and travel times.' },
    { question: 'What should I confirm about entry permits?', answer: 'Apply through the official e-Permit portal for your nationality, visit category, dates and islands, including transit islands. Scuba Lak recommends starting at least 15 days ahead, preferably earlier—not a guaranteed government processing time. Obtain the approved permit before travel; a flight booking or application receipt does not replace it.' },
    { question: 'Can Scuba Lak help me find accommodation?', answer: ACCOMMODATION_INFO.helpDescription + ' ' + ACCOMMODATION_INFO.disclaimer },
    { question: 'What is included in my diving booking?', answer: 'Your agreed dive price includes local dive transport, equipment, briefing and guided support, and underwater photos/videos, with no hidden charges for the agreed plan. Flights or ferries to Lakshadweep, accommodation and entry-permit fees are separate. Confirm the total and exact arrangements before payment.' },
    { question: 'What if weather or transport changes the plan?', answer: 'Ask the relevant providers for their written cancellation, refund and rescheduling terms before confirming. Include contingency time in your itinerary and recheck the arrangements close to travel.' },
    { question: 'Can I rely on a seaplane or helicopter connection?', answer: 'Do not plan a Kadmat visit around a special transport service without direct confirmation from its authorised operator. The existence of a helipad or a past route does not establish a bookable tourist service for your dates.' }
  ],
  sources: [
    { label: 'Official arrival guidance', href: 'https://lakshadweep.gov.in/how-to-reach/' },
    { label: 'Apply for an entry permit', href: 'https://lak.e-permit.utl.gov.in/' },
    { label: 'Ship tickets & schedules', href: 'https://lakshadweep.irctc.co.in/' }
  ],
  guide: 'Read the full island-trip guide'
} as const;
