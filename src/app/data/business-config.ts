import { SocialLink } from '../models/site-data.model';

export interface BusinessPhoneContact {
  readonly number: string;
  readonly displayNumber: string;
}

export interface VerifiedBusinessContact {
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly phones: readonly BusinessPhoneContact[];
  readonly whatsapp: readonly BusinessPhoneContact[];
  readonly address: string | null;
  readonly postalAddress: {
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
  readonly coordinates: { readonly latitude: number; readonly longitude: number };
  readonly officeHours: string | null;
  readonly deskHours: { readonly opens: string; readonly closes: string; readonly days: readonly string[] };
  readonly diveHoursNote: string;
  readonly responseTime: string | null;
  readonly mapsUrl: string | null;
  readonly socials: readonly SocialLink[];
}
const phoneContacts = [
  { number: '+919447982559', displayNumber: '+91 94479 82559' },
  { number: '+919400205847', displayNumber: '+91 94002 05847' }
] as const satisfies readonly BusinessPhoneContact[];
// Populate only from owner-confirmed business details. Never copy sample values.
export const BUSINESS_CONTACT: VerifiedBusinessContact = {
  name: 'Scuba Lak Kadmat',
  email: 'hello@scubalak.com', phone: phoneContacts[0].number, phones: phoneContacts, whatsapp: phoneContacts,
  address: 'Near South Port Office, Kadmat, Lakshadweep 682556',
  postalAddress: { streetAddress: 'Near South Port Office', addressLocality: 'Kadmat', addressRegion: 'Lakshadweep', postalCode: '682556', addressCountry: 'IN' },
  // The place pin from the owner's existing Google Maps listing.
  coordinates: { latitude: 11.1940979, longitude: 72.7642459 },
  mapsUrl: 'https://www.google.com/maps/place/Scuba+Lak+Kadmath/@11.1940838,72.7642821,92m/data=!3m1!1e3!4m6!3m5!1s0x3b9f1fbcd44ba4c7:0x7a610615829a745f!8m2!3d11.1940979!4d72.7642459!16s%2Fg%2F11vqh5z0kl',
  officeHours: 'Every day · 9:00 am–6:00 pm IST', responseTime: null,
  deskHours: { opens: '09:00', closes: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  diveHoursNote: 'These are contact desk hours. Dive times are arranged separately with the team and may fall outside these hours, subject to conditions.',
  socials: [
    { label: 'Instagram', handle: '@scuba_lak_kadmat', href: 'https://www.instagram.com/scuba_lak_kadmat/', icon: 'fa-brands fa-instagram' },
    { label: 'WhatsApp', handle: phoneContacts[0].displayNumber, href: `https://wa.me/${phoneContacts[0].number.slice(1)}`, icon: 'fa-brands fa-whatsapp' }
  ]
};
export type EnquiryDeliveryConfig =
  | { readonly mode: 'unconfigured' }
  | { readonly mode: 'email-client' }
  | { readonly mode: 'endpoint'; readonly url: string };
// SMTP delivery and business-inbox receipt verified through the separate Worker.
export const ENQUIRY_DELIVERY: EnquiryDeliveryConfig = {
  mode: 'endpoint', url: 'https://scubalak-enquiries.furqanqamar510.workers.dev/enquiries'
};
