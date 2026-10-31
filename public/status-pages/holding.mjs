import { mayRefreshStatus, validateSiteStatus, whatsappUrl } from './status-config.mjs';

const root = document.documentElement;
const pageMode = root.dataset.statusPage;
const gated = root.dataset.siteGated === 'true';
const configUrl = new URL('site-status.json', document.baseURI);
document.querySelector('.status-skip').href = `${location.pathname}${location.search}#main-content`;
const feedback = document.querySelector('.holding__feedback');
const button = document.querySelector('[data-check-status]');
let timer;
let stopped = false;
let pending = false;
let request;

function present(config) {
  const copy = config.pages[pageMode];
  for (const node of document.querySelectorAll('[data-copy]')) {
    const text = copy[node.dataset.copy];
    if (typeof text === 'string') node.textContent = text;
  }
  document.title = `${copy.title} ${copy.accent} | Scuba Lak`;
  const primary = document.querySelector('[data-contact="primary"]');
  primary.href = whatsappUrl(config.contact.whatsapp[0].number, copy.message);
  const instagram = document.querySelector('[data-contact="instagram"]');
  if (instagram) instagram.href = config.contact.instagram;
  config.contact.whatsapp.forEach((phone, index) => {
    const link = document.querySelector(`[data-contact="phone-${index}"]`);
    link.href = whatsappUrl(phone.number);
    link.setAttribute('aria-label', `WhatsApp ${phone.label}`);
    link.querySelector('span').textContent = phone.label;
  });
}

async function check(manual = false) {
  if (pending || stopped) return;
  pending = true;
  if (manual && button) { button.disabled = true; feedback.textContent = 'Checking the website…'; }
  request = new AbortController();
  const timeout = setTimeout(() => request.abort(), 5000);
  try {
    const response = await fetch(configUrl, { cache: 'no-store', signal: request.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Status is temporarily unavailable.');
    const config = validateSiteStatus(await response.json());
    if (stopped) return;
    present(config);
    if (gated && config.mode !== pageMode) {
      let refresh = manual;
      try {
        const previous = JSON.parse(sessionStorage.getItem('scuba-lak:status-refresh') || 'null');
        refresh ||= mayRefreshStatus(previous, config.mode);
        if (refresh) sessionStorage.setItem('scuba-lak:status-refresh', JSON.stringify({ mode: config.mode, at: Date.now() }));
      } catch { /* With storage disabled, avoid an automatic reload loop; the manual check remains usable. */ }
      if (!refresh) { feedback.textContent = 'An update is on its way. Please check again shortly.'; return; }
      // Keep the original route; the next static deployment supplies its current HTML.
      location.reload();
      return;
    }
    if (gated) { try { sessionStorage.removeItem('scuba-lak:status-refresh'); } catch {} }
    if (manual && config.mode === 'live') {
      location.assign(new URL('./', document.baseURI));
      return;
    }
    if (manual) feedback.textContent = 'We’re still getting everything ready. Our team is here on WhatsApp.';
  } catch {
    if (manual && !stopped) feedback.textContent = 'We couldn’t check just now. Please try later, or reach us on WhatsApp.';
  } finally {
    clearTimeout(timeout);
    pending = false;
    if (button) button.disabled = false;
  }
}

function schedule() {
  clearTimeout(timer);
  if (!gated || stopped || document.hidden) return;
  timer = setTimeout(async () => { await check(); schedule(); }, 60000);
}

button?.addEventListener('click', () => check(true));
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && gated) check();
  schedule();
});
window.addEventListener('pagehide', () => { stopped = true; clearTimeout(timer); request?.abort(); });
window.addEventListener('pageshow', event => { if (event.persisted) { stopped = false; check(); schedule(); } });

const decode = async image => {
  if (!image.complete) await new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); });
  try { await image.decode(); } catch { /* Keep the dark fallback and working copy if a media request fails. */ }
};
await Promise.race([
  Promise.all([check(), ...[...document.images].map(decode), document.fonts?.ready]),
  new Promise(resolve => setTimeout(resolve, 8000))
]);
root.classList.add('status-ready');
schedule();
