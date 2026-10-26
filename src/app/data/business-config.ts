import { SocialLink } from '../models/site-data.model';

export interface BusinessPhoneContact {
  readonly number: string;
  readonly displayNumber: string;
}

export interface VerifiedBusinessContact {
  readonly email: string | null;
  readonly phone: string | null;
  readonly phones: readonly BusinessPhoneContact[];
  readonly whatsapp: readonly BusinessPhoneContact[];
  readonly address: string | null;
  readonly officeHours: string | null;
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
  email: 'scubalak@gmail.com', phone: phoneContacts[0].number, phones: phoneContacts, whatsapp: phoneContacts,
  address: 'Scuba Lak · Kadmat Island, Lakshadweep',
  mapsUrl: 'https://www.google.com/maps/place/Scuba+Lak+Kadmath/@11.1940838,72.7642821,92m/data=!3m1!1e3!4m6!3m5!1s0x3b9f1fbcd44ba4c7:0x7a610615829a745f!8m2!3d11.1940979!4d72.7642459!16s%2Fg%2F11vqh5z0kl',
  officeHours: 'Every day · 9:00 am–6:00 pm IST', responseTime: null,
  socials: [
    { label: 'Instagram', handle: '@scuba_lak_kadmat', href: 'https://www.instagram.com/scuba_lak_kadmat/', icon: 'fa-brands fa-instagram' },
    { label: 'WhatsApp', handle: phoneContacts[0].displayNumber, href: `https://wa.me/${phoneContacts[0].number.slice(1)}`, icon: 'fa-brands fa-whatsapp' }
  ]
};
export type EnquiryDeliveryConfig =
  | { readonly mode: 'unconfigured' }
  | { readonly mode: 'email-client' }
  | { readonly mode: 'endpoint'; readonly url: string };
// Endpoint contract: POST ContactRequest; acknowledgement { accepted: true }.
// Adapt this contract to the owner's approved integration before enabling it.
export const ENQUIRY_DELIVERY: EnquiryDeliveryConfig = { mode: 'unconfigured' };
