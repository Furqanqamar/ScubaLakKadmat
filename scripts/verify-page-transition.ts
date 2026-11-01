import '@angular/compiler';
import assert from 'node:assert/strict';
import { DOCUMENT } from '@angular/common';
import { Injector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PageTransitionComponent } from '../src/app/common/components/page-transition/page-transition.component';
import { PageMediaReadinessService } from '../src/app/common/services/page-media-readiness.service';

// Run the real component against a deterministic clock; no browser or network.
function createHarness(platform = 'browser', initialVisit = false) {
  let now = 0;
  let nextTimer = 0;
  let reducedMotion = false;
  let heroPending = false;
  const heroCallbacks = new Set<() => void>();
  const heroHistory: (() => void)[] = [];
  const timers = new Map<number, { at: number; callback: () => void }>();
  const documentEvents: string[] = [];
  const events = new Subject<RouterEvent>();
  const router = { events, navigated: false, url: '/' };
  const view = {
    performance: { now: () => now },
    matchMedia: () => ({ matches: reducedMotion }),
    setTimeout(callback: () => void, delay = 0) {
      const id = ++nextTimer;
      timers.set(id, { at: now + delay, callback });
      return id;
    },
    clearTimeout: (id: number) => timers.delete(id)
  };
  const injector = Injector.create({ providers: [
    { provide: DOCUMENT, useValue: { defaultView: view, dispatchEvent: (event: Event) => { documentEvents.push(event.type); return true; } } },
    { provide: PLATFORM_ID, useValue: platform },
    { provide: Router, useValue: router },
    { provide: PageMediaReadinessService, useValue: { waitForPage(callback: () => void) {
      heroHistory.push(callback);
      if (heroPending) heroCallbacks.add(callback); else callback();
      return () => heroCallbacks.delete(callback);
    } } }
  ] });
  const component = runInInjectionContext(injector, () => new PageTransitionComponent());
  const advance = (milliseconds: number): void => {
    const target = now + milliseconds;
    while (true) {
      const next = [...timers.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at;
      timers.delete(next[0]);
      next[1].callback();
    }
    now = target;
  };
  // Most cases below exercise a later SPA navigation, after the first cover
  // has completed. Initial-load cases keep the real prerendered state intact.
  if (platform === 'browser' && !initialVisit) {
    events.next(new NavigationStart(0, '/'));
    events.next(new NavigationEnd(0, '/', '/'));
    advance(1000);
    router.navigated = true;
    now = 0;
    heroHistory.length = 0;
  }
  return {
    component, router, events, timers, heroCallbacks, heroHistory, documentEvents,
    delayHero: () => { heroPending = true; },
    heroReady: () => { for (const callback of heroCallbacks) callback(); heroCallbacks.clear(); },
    reduceMotion: () => { reducedMotion = true; },
    advance,
    destroy() { injector.destroy(); }
  };
}

const fast = createHarness();
fast.events.next(new NavigationStart(1, '/courses'));
assert.equal(fast.component.isActive(), true, 'Cached navigation must show the curtain immediately');
assert.equal(fast.component.isInitial(), false, 'Later navigation keeps the existing incoming animation');
assert.equal(fast.component.label(), 'The course desk');
fast.events.next(new NavigationEnd(1, '/courses', '/courses'));
fast.advance(559);
assert.equal(fast.component.phase(), 'cover', 'Fast routes must not skip the cover and short hold');
fast.advance(1);
assert.equal(fast.component.phase(), 'reveal');
fast.advance(439);
assert.equal(fast.component.isActive(), true);
fast.advance(1);
assert.equal(fast.component.isActive(), false, 'Fast-route curtain should finish in one second');

const slow = createHarness();
slow.events.next(new NavigationStart(2, '/gallery'));
slow.advance(2000);
assert.equal(slow.component.isActive(), true);
assert.equal(slow.component.phase(), 'cover', 'Keep the cover in place while a route is still loading');
slow.events.next(new NavigationEnd(2, '/gallery', '/gallery'));
slow.advance(0);
assert.equal(slow.component.phase(), 'reveal', 'Slow routes should reveal without an extra hold');
slow.advance(440);
assert.equal(slow.component.isActive(), false);

for (const url of ['/#experiences', '/?interest=diving']) {
  const samePage = createHarness();
  samePage.events.next(new NavigationStart(3, url));
  samePage.events.next(new NavigationEnd(3, url, url));
  assert.equal(samePage.component.isActive(), false, 'Do not animate hash or query-only changes');
  assert.equal(samePage.timers.size, 0);
}
const initial = createHarness('browser', true);
assert.equal(initial.component.isActive(), true, 'The loader must exist before any client navigation event');
assert.equal(initial.component.isInitial(), true, 'The initial curtain must already cover the full viewport');
assert.equal(initial.component.phase(), 'cover');
initial.delayHero();
initial.events.next(new NavigationStart(4, '/courses'));
initial.events.next(new NavigationEnd(4, '/courses', '/courses'));
initial.advance(2000);
assert.equal(initial.component.isActive(), true, 'Initial visits also wait for page media');
initial.heroReady(); initial.advance(440);
assert.equal(initial.component.isActive(), false);
assert.equal(initial.component.isInitial(), false);
assert.deepEqual(initial.documentEvents, ['scuba-lak:initial-ready'], 'Successful first reveal cancels the startup fail-safe exactly once');
initial.router.navigated = true;
initial.router.url = '/courses';
initial.events.next(new NavigationStart(40, '/about'));
assert.equal(initial.component.isInitial(), false, 'Never replay the first-load state on a later page change');
initial.events.next(new NavigationEnd(40, '/about', '/about'));
initial.advance(1000);
assert.equal(initial.documentEvents.length, 1);

const initialReduced = createHarness('browser', true);
initialReduced.reduceMotion();
initialReduced.delayHero();
initialReduced.events.next(new NavigationStart(41, '/'));
initialReduced.events.next(new NavigationEnd(41, '/', '/'));
assert.equal(initialReduced.component.isActive(), true, 'Reduced-motion initial visits still wait for media');
initialReduced.heroReady();
assert.equal(initialReduced.component.isActive(), false);
assert.equal(initialReduced.timers.size, 0, 'Reduced motion does not add a first-load reveal delay');

const reduced = createHarness();
reduced.reduceMotion();
reduced.events.next(new NavigationStart(5, '/about'));
reduced.delayHero();
reduced.events.next(new NavigationEnd(5, '/about', '/about'));
assert.equal(reduced.component.isActive(), true, 'Reduced-motion visitors still get a static loading cover');
reduced.heroReady();
assert.equal(reduced.component.isActive(), false, 'Reduced motion must not add animated cover/reveal delays');

const slowImage = createHarness();
slowImage.delayHero();
slowImage.events.next(new NavigationStart(14, '/about'));
slowImage.events.next(new NavigationEnd(14, '/about', '/about'));
slowImage.advance(3500);
assert.equal(slowImage.component.phase(), 'cover', 'The route being ready must not reveal an unloaded hero');
assert.equal(slowImage.component.isActive(), true);
slowImage.heroReady();
slowImage.advance(0);
assert.equal(slowImage.component.phase(), 'reveal', 'Reveal as soon as the decoded hero is ready, without a second minimum hold');
slowImage.advance(440);
assert.equal(slowImage.component.isActive(), false);

const staleImage = createHarness();
staleImage.delayHero();
staleImage.events.next(new NavigationStart(15, '/about'));
staleImage.events.next(new NavigationEnd(15, '/about', '/about'));
staleImage.advance(100);
staleImage.events.next(new NavigationStart(16, '/gallery'));
assert.equal(staleImage.heroCallbacks.size, 0, 'New navigation cancels the old hero wait');
staleImage.events.next(new NavigationEnd(16, '/gallery', '/gallery'));
staleImage.heroHistory[0]();
staleImage.advance(2000);
assert.equal(staleImage.component.phase(), 'cover', 'A stale image callback cannot uncover a newer page');
staleImage.heroReady();
staleImage.advance(440);
assert.equal(staleImage.component.isActive(), false);

for (const terminal of [new NavigationCancel(6, '/gallery', 'Mock guard'), new NavigationError(6, '/gallery', new Error('Mock failure')), new NavigationSkipped(6, '/gallery', 'Mock skip')]) {
  const interrupted = createHarness();
  interrupted.events.next(new NavigationStart(6, '/gallery'));
  interrupted.events.next(terminal);
  interrupted.advance(1000);
  assert.equal(interrupted.component.isActive(), false, 'Cancelled, failed or skipped routes must not leave a stuck cover');
}

const rapid = createHarness();
rapid.events.next(new NavigationStart(7, '/gallery'));
rapid.advance(100);
rapid.events.next(new NavigationCancel(7, '/gallery', 'Redirect'));
rapid.events.next(new NavigationStart(8, '/about'));
rapid.events.next(new NavigationEnd(7, '/gallery', '/gallery'));
rapid.events.next(new NavigationEnd(8, '/about', '/about'));
assert.equal(rapid.component.label(), 'The people behind the bubbles');
rapid.advance(460);
assert.equal(rapid.component.phase(), 'reveal', 'Redirects should reuse the existing cover');
rapid.advance(440);
assert.equal(rapid.component.isActive(), false);

rapid.router.url = '/about';
rapid.events.next(new NavigationStart(9, '/courses'));
rapid.events.next(new NavigationEnd(9, '/courses', '/courses'));
rapid.advance(600);
rapid.events.next(new NavigationStart(10, '/gallery'));
assert.equal(rapid.component.phase(), 'cover', 'Navigation during reveal should start a fresh cover');
rapid.events.next(new NavigationEnd(10, '/gallery', '/gallery'));
rapid.advance(1000);
assert.equal(rapid.component.isActive(), false);

const destroyed = createHarness();
destroyed.delayHero();
destroyed.events.next(new NavigationStart(11, '/courses'));
destroyed.events.next(new NavigationEnd(11, '/courses', '/courses'));
destroyed.destroy();
assert.equal(destroyed.timers.size, 0, 'Destroying the component must release timers');
assert.equal(destroyed.heroCallbacks.size, 0, 'Destroying the component must release hero listeners');
destroyed.events.next(new NavigationStart(12, '/gallery'));
assert.equal(destroyed.component.label(), 'The course desk', 'Destroying the component must unsubscribe from router events');

const server = createHarness('server');
server.events.next(new NavigationStart(13, '/courses'));
assert.equal(server.component.isActive(), true, 'Static HTML must include the first-paint cover');
assert.equal(server.component.isInitial(), true, 'The server cover is already in place, not animating in');
assert.equal(server.timers.size, 0, 'Server rendering must not start timers');
console.log('Page transition checks passed: prerendered first-paint cover, single initial reveal, normal later navigation, one-second cached routes, slow page-media readiness, stale guards, hash/query exclusions, reduced motion, redirects, cancellation/error recovery, SSR and cleanup.');
