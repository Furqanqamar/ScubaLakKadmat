import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, PLATFORM_ID, DestroyRef, Injectable, inject } from '@angular/core';

const REVEAL_TARGETS = [
  '[data-reveal]', 'h2', 'h3', 'p', 'figure', 'article:not(.island-story__article)', 'details',
  '.stat-block', '.gallery-teaser', '.gallery-card', '.course-card', '.island-guide-card',
  '.fact-card', '.course-detail-panel', '.experience-highlight', '.contact-social-card',
  '.island-story__facts dl > div', '.kadmat-spots__list > li'
].join(', ');
const EXCLUDED = '[data-page-hero], dialog, form, nav, [data-reveal="off"], [hidden], [aria-hidden="true"]';

/** Progressive enhancement: unobserved/unsupported content stays visible. */
export function setupRevealMotion(document: Document): () => void {
  const view = document.defaultView, body = document.body;
  if (!view || !body || !('IntersectionObserver' in view) || !('MutationObserver' in view)) return () => undefined;
  const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Set<HTMLElement>();
  const seen = new WeakSet<HTMLElement>();
  const reveal = (element: HTMLElement, immediate = false): void => {
    if (immediate) {
      element.style.setProperty('--reveal-delay', '0ms');
      element.style.setProperty('--reveal-duration', '0ms');
    }
    element.setAttribute('data-motion-reveal', 'visible');
    pending.delete(element);
    observer.unobserve(element);
  };
  const groupFor = (element: HTMLElement): HTMLElement | null => {
    let parent = element.parentElement;
    // Repeated Angular component hosts should stagger as one visual card row.
    while (parent?.tagName.startsWith('APP-')) parent = parent.parentElement;
    return parent;
  };
  const observer = new view.IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting && pending.has(entry.target as HTMLElement))
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    const rows: { parent: HTMLElement | null; top: number; count: number }[] = [];
    for (const entry of visible) {
      const element = entry.target as HTMLElement, parent = groupFor(element);
      let row = rows.find(row => row.parent === parent && Math.abs(row.top - entry.boundingClientRect.top) < 24);
      if (!row) { row = { parent, top: entry.boundingClientRect.top, count: 0 }; rows.push(row); }
      element.style.setProperty('--reveal-delay', `${Math.min(row.count++, 3) * 75}ms`);
      reveal(element);
    }
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });

  const observe = (root: ParentNode): void => {
    const elements = [...root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)];
    if (root instanceof view.HTMLElement && root.matches(REVEAL_TARGETS)) elements.unshift(root);
    for (const element of elements) {
      if (!element.closest('main') || element.closest(EXCLUDED) || element.parentElement?.closest(REVEAL_TARGETS)) continue;
      if (seen.has(element)) continue;
      seen.add(element);
      if (preference.matches) continue;
      // Keep enhancement state outside Angular-owned class bindings.
      element.setAttribute('data-motion-reveal', 'pending');
      pending.add(element);
      observer.observe(element);
    }
  };
  const mutations = new view.MutationObserver(records => {
    // Route changes and filtering must not retain detached gallery/card nodes.
    for (const element of pending) if (!element.isConnected) reveal(element, true);
    for (const record of records) for (const node of record.addedNodes) if (node instanceof view.HTMLElement) observe(node);
  });
  const onFocus = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof view.HTMLElement)) return;
    const element = target.closest<HTMLElement>('[data-motion-reveal]');
    if (element && pending.has(element)) reveal(element, true);
  };
  const onPreference = (): void => { if (preference.matches) for (const element of pending) reveal(element, true); };
  observe(body);
  mutations.observe(body, { childList: true, subtree: true });
  body.addEventListener('focusin', onFocus);
  preference.addEventListener('change', onPreference);
  return () => {
    for (const element of pending) reveal(element, true);
    observer.disconnect();
    mutations.disconnect();
    body.removeEventListener('focusin', onFocus);
    preference.removeEventListener('change', onPreference);
  };
}

@Injectable({ providedIn: 'root' })
export class RevealMotionService {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const document = inject(DOCUMENT);
    let cleanup = (): void => undefined;
    // Register targets after the first hydrated route has rendered.
    const render = afterNextRender(() => { cleanup = setupRevealMotion(document); });
    inject(DestroyRef).onDestroy(() => { render.destroy(); cleanup(); });
  }
}
