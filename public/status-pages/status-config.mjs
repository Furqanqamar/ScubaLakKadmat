export const SITE_MODES = Object.freeze(['live', 'coming-soon', 'maintenance']);

export function validateSiteStatus(value) {
  if (!value || !SITE_MODES.includes(value.mode)) throw new Error('Site mode must be live, coming-soon or maintenance.');
  if (!Array.isArray(value.contact?.whatsapp) || value.contact.whatsapp.length !== 2) throw new Error('Keep both WhatsApp contacts.');
  for (const phone of value.contact.whatsapp) {
    if (!/^\d{10,15}$/.test(phone.number) || typeof phone.label !== 'string' || phone.label.length > 40) throw new Error('Invalid WhatsApp contact.');
  }
  const instagram = new URL(value.contact.instagram);
  if (instagram.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(instagram.hostname)) throw new Error('Use an HTTPS Instagram profile.');
  for (const mode of SITE_MODES.slice(1)) {
    const page = value.pages?.[mode];
    for (const key of ['label', 'title', 'accent', 'description', 'primaryLabel', 'message', 'note']) {
      if (typeof page?.[key] !== 'string' || !page[key].trim() || page[key].length > 600) throw new Error(`Invalid ${mode} copy: ${key}`);
    }
  }
  return value;
}

export function whatsappUrl(number, message = '') {
  const url = new URL(`https://wa.me/${number}`);
  if (message) url.searchParams.set('text', message);
  return url.href;
}

export function mayRefreshStatus(previous, mode, now = Date.now()) {
  return previous?.mode !== mode || !Number.isFinite(previous?.at) || now - previous.at >= 60000;
}
