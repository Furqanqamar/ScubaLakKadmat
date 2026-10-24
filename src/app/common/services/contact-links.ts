import { BUSINESS_CONTACT } from '../../data/business-config';

function internationalPhone(value: string | null): string | null {
  const phone = value?.replace(/[\s()-]/g, '') ?? '';
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}
export const CONTACT_PHONE = internationalPhone(BUSINESS_CONTACT.phone);
export const CONTACT_EMAIL = BUSINESS_CONTACT.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(BUSINESS_CONTACT.email) ? BUSINESS_CONTACT.email : null;
export function whatsappLink(message: string): string | null {
  const number = internationalPhone(BUSINESS_CONTACT.whatsapp);
  return number ? `https://wa.me/${number.slice(1)}?text=${encodeURIComponent(message)}` : null;
}
export function configuredSocialUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.pathname === '/') return null;
    if (url.hostname === 'wa.me' && !/^\/[1-9]\d{7,14}$/.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
}
