import '@angular/compiler';
import assert from 'node:assert/strict';
import { setupRevealMotion } from '../src/app/common/services/reveal-motion.service';

class ElementMock {
  readonly classes = new Set<string>();
  readonly attributes = new Map<string, string>();
  readonly properties = new Map<string, string>();
  readonly listeners = new Map<string, EventListener>();
  readonly children: ElementMock[] = [];
  parentElement: ElementMock | null = null;
  connected = true;
  top = 100; left = 0;
  readonly classList = { add: (...names: string[]) => names.forEach(name => this.classes.add(name)) };
  readonly style = { setProperty: (name: string, value: string) => this.properties.set(name, value) };
  constructor(readonly tagName = 'DIV', classes = '') { classes.split(' ').filter(Boolean).forEach(name => this.classes.add(name)); }
  get isConnected() { return this.connected && (!this.parentElement || this.parentElement.isConnected); }
  append(element: ElementMock) { element.parentElement = this; this.children.push(element); return element; }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  matches(selector: string): boolean {
    return selector.split(',').some(part => {
      part = part.trim();
      if (part === 'article:not(.island-story__article)') return this.tagName === 'ARTICLE' && !this.classes.has('island-story__article');
      if (part.startsWith('.')) return this.classes.has(part.slice(1));
      const attribute = part.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
      if (attribute) return this.attributes.has(attribute[1]) && (attribute[2] === undefined || this.attributes.get(attribute[1]) === attribute[2]);
      return this.tagName.toLowerCase() === part;
    });
  }
  closest(selector: string): ElementMock | null { return this.matches(selector) ? this : this.parentElement?.closest(selector) ?? null; }
  querySelectorAll(selector: string): ElementMock[] { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  addEventListener(type: string, listener: EventListener) { this.listeners.set(type, listener); }
  removeEventListener(type: string) { this.listeners.delete(type); }
}
function harness(reduced = false, supported = true) {
  let intersection!: ObserverMock, mutation!: MutationMock;
  const body = new ElementMock('BODY'), main = body.append(new ElementMock('MAIN'));
  const preference = {
    matches: reduced, listeners: new Map<string, () => void>(),
    addEventListener(type: string, listener: () => void) { this.listeners.set(type, listener); },
    removeEventListener(type: string) { this.listeners.delete(type); },
    change(matches: boolean) { this.matches = matches; this.listeners.get('change')?.(); }
  };
  class ObserverMock {
    readonly observed = new Set<ElementMock>();
    readonly unobserved = new Set<ElementMock>();
    disconnected = false;
    constructor(readonly callback: (entries: unknown[]) => void, readonly options: unknown) { intersection = this; }
    observe(element: ElementMock) { this.observed.add(element); }
    unobserve(element: ElementMock) { this.observed.delete(element); this.unobserved.add(element); }
    disconnect() { this.disconnected = true; this.observed.clear(); }
    enter(elements: ElementMock[], isIntersecting = true) {
      this.callback(elements.map(target => ({ target, isIntersecting, boundingClientRect: { top: target.top, left: target.left } })));
    }
  }
  class MutationMock {
    disconnected = false;
    constructor(readonly callback: (records: unknown[]) => void) { mutation = this; }
    observe() {}
    disconnect() { this.disconnected = true; }
    add(...elements: ElementMock[]) { this.callback([{ addedNodes: elements }]); }
  }
  const view = { HTMLElement: ElementMock, MutationObserver: MutationMock, matchMedia: () => preference, ...(supported ? { IntersectionObserver: ObserverMock } : {}) };
  const document = { body, defaultView: view } as unknown as Document;
  return { body, main, preference, start: () => setupRevealMotion(document), observer: () => intersection, mutations: () => mutation };
}

const page = harness();
const hero = page.main.append(new ElementMock('SECTION')); hero.attributes.set('data-page-hero', '');
const heroText = hero.append(new ElementMock('P'));
const heading = page.main.append(new ElementMock('H2'));
const intro = page.main.append(new ElementMock('P'));
const grid = page.main.append(new ElementMock());
const cards = Array.from({ length: 5 }, (_, index) => {
  const host = grid.append(new ElementMock('APP-ISLAND-CARD'));
  const card = host.append(new ElementMock('A', 'island-guide-card')); card.left = index * 300;
  card.append(new ElementMock('H3'));
  card.append(new ElementMock('P'));
  return card;
});
const formText = page.main.append(new ElementMock('FORM')).append(new ElementMock('P'));
const popupText = page.main.append(new ElementMock('DIALOG')).append(new ElementMock('P'));
const disabled = page.main.append(new ElementMock()); disabled.attributes.set('data-reveal', 'off');
const disabledText = disabled.append(new ElementMock('P'));
const story = page.main.append(new ElementMock('ARTICLE', 'island-story__article'));
const storyHeading = story.append(new ElementMock('H2'));
const stop = page.start(), observer = page.observer();
assert.equal(heading.attributes.get('data-motion-reveal'), 'pending'); assert.equal(intro.attributes.get('data-motion-reveal'), 'pending');
assert.equal(storyHeading.attributes.get('data-motion-reveal'), 'pending', 'Long blog articles reveal individual reading units, not the entire article');
assert.ok(cards.every(card => card.attributes.get('data-motion-reveal') === 'pending'));
assert.ok(cards.every(card => card.children.every(child => !child.attributes.has('data-motion-reveal'))), 'Do not double animate card text inside its card');
assert.ok([heroText, formText, popupText, disabledText].every(element => !element.attributes.has('data-motion-reveal')), 'Keep hero, form, dialog and opted-out content immediately visible');
observer.enter(cards, false); assert.ok(cards.every(card => card.attributes.get('data-motion-reveal') === 'pending'));
observer.enter([...cards].reverse());
assert.deepEqual(cards.map(card => card.properties.get('--reveal-delay')), ['0ms', '75ms', '150ms', '225ms', '225ms'], 'Stagger visual card rows left to right with a short capped delay');
assert.ok(cards.every(card => card.attributes.get('data-motion-reveal') === 'visible' && !observer.observed.has(card)), 'Reveal once then unobserve');
observer.enter(cards); assert.equal(cards[0].properties.get('--reveal-delay'), '0ms');
const laterRow = grid.append(new ElementMock('A', 'course-card')); laterRow.top = 500;
page.mutations().add(laterRow); observer.enter([laterRow]); assert.equal(laterRow.properties.get('--reveal-delay'), '0ms', 'A new row starts without a cumulative delay');
const detached = page.main.append(new ElementMock('P')); page.mutations().add(detached);
detached.connected = false; page.mutations().add(); assert.ok(!observer.observed.has(detached), 'Route changes release detached pending nodes');
assert.equal(detached.attributes.get('data-motion-reveal'), 'visible', 'A detached element must stay visible if a view later reuses it');
const focused = page.main.append(new ElementMock('A', 'gallery-teaser')); page.mutations().add(focused);
page.body.listeners.get('focusin')?.({ target: focused } as unknown as Event);
assert.equal(focused.attributes.get('data-motion-reveal'), 'visible'); assert.equal(focused.properties.get('--reveal-duration'), '0ms', 'Keyboard focus reveals a pending card immediately');
page.preference.change(true);
assert.equal(heading.attributes.get('data-motion-reveal'), 'visible'); assert.equal(heading.properties.get('--reveal-duration'), '0ms');
assert.equal(observer.observed.size, 0, 'Turning reduced motion on must reveal every pending item');
const reducedItem = page.main.append(new ElementMock('H2')); page.mutations().add(reducedItem);
assert.ok(!reducedItem.attributes.has('data-motion-reveal'));
stop(); assert.ok(observer.disconnected && page.mutations().disconnected);
assert.equal(page.body.listeners.size, 0); assert.equal(page.preference.listeners.size, 0);

const initialReduced = harness(true), reducedHeading = initialReduced.main.append(new ElementMock('H2'));
const stopReduced = initialReduced.start(); assert.ok(!reducedHeading.attributes.has('data-motion-reveal')); stopReduced();
const unsupported = harness(false, false), fallback = unsupported.main.append(new ElementMock('H2'));
unsupported.start()(); assert.ok(!fallback.attributes.has('data-motion-reveal'), 'Unsupported browsers never hide content');
setupRevealMotion({ defaultView: null } as Document)();
console.log('Scroll reveal checks passed: per-item fade/rise targets, no nested/hero/dialog/form reveals, once-only observation, short visual-row stagger, dynamic routes/filters, keyboard visibility, reduced motion, unsupported-browser fallback and cleanup.');
