import '@angular/compiler';
import assert from 'node:assert/strict';
import { DOCUMENT } from '@angular/common';
import { Injector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PageTransitionComponent } from '../src/app/common/components/page-transition/page-transition.component';

// Run the real component against a deterministic clock; no browser or network.
function createHarness(platform = 'browser') {
  let now = 0;
  let nextTimer = 0;
  let reducedMotion = false;
  const timers = new Map<number, { at: number; callback: () => void }>();
  const events = new Subject<RouterEvent>();
  const router = { events, navigated: true, url: '/' };
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
    { provide: DOCUMENT, useValue: { defaultView: view } },
    { provide: PLATFORM_ID, useValue: platform },
    { provide: Router, useValue: router }
  ] });
  const component = runInInjectionContext(injector, () => new PageTransitionComponent());
  return {
    component, router, events, timers,
    reduceMotion: () => { reducedMotion = true; },
    advance(milliseconds: number) {
      const target = now + milliseconds;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        timers.delete(next[0]);
        next[1].callback();
      }
      now = target;
    },
    destroy() { injector.destroy(); }
  };
}

const fast = createHarness();
fast.events.next(new NavigationStart(1, '/courses'));
assert.equal(fast.component.isActive(), true, 'Cached navigation must show the curtain immediately');
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
const initial = createHarness();
initial.router.navigated = false;
initial.events.next(new NavigationStart(4, '/courses'));
initial.events.next(new NavigationEnd(4, '/courses', '/courses'));
assert.equal(initial.component.isActive(), false, 'Do not cover the initial rendered page');
const reduced = createHarness();
reduced.reduceMotion();
reduced.events.next(new NavigationStart(5, '/about'));
assert.equal(reduced.component.isActive(), false, 'Respect reduced motion');

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
destroyed.events.next(new NavigationStart(11, '/courses'));
destroyed.events.next(new NavigationEnd(11, '/courses', '/courses'));
destroyed.destroy();
assert.equal(destroyed.timers.size, 0, 'Destroying the component must release timers');
destroyed.events.next(new NavigationStart(12, '/gallery'));
assert.equal(destroyed.component.label(), 'The course desk', 'Destroying the component must unsubscribe from router events');

const server = createHarness('server');
server.events.next(new NavigationStart(13, '/courses'));
assert.equal(server.component.isActive(), false, 'Server rendering must not start animations');
console.log('Page transition checks passed: immediate cover, one-second fast-route sequence, slow routes, hash/query exclusions, reduced motion, redirects, rapid navigation, cancellation/error recovery, SSR and cleanup.');
