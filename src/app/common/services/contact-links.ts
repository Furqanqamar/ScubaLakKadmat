import { CONTACT_DETAILS } from '../../data/site-content';

const phone = CONTACT_DETAILS.phone.replace(/[\s()+-]/g, '');
export const CONTACT_PHONE = /^\d{8,15}$/.test(phone) ? phone : null;
export function configuredSocialUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.pathname === '/') return null;
    if (url.hostname === 'wa.me' && !/^\/\d{8,15}$/.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
}
