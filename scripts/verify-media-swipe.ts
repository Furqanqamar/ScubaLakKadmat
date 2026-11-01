import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MEDIA_SLIDE_MS, MediaViewerComponent } from '../src/app/common/components/media-viewer/media-viewer.component';

function cell<T>(initial: T) { let value = initial; return Object.assign(() => value, { set: (next: T) => { value = next; } }); }
// Invoke the real touch/geometry handlers without synthesising browser UI.
function harness() {
  let previous = 0, next = 0, video = false, controls = false, total = 3, itemId = 'first-photo', reduced = false, prevented = 0;
  const timers = new Map<number, () => void>();
  const items = [{ id: 'first-photo' }, { id: 'second-photo' }, { id: 'third-film', kind: 'video' }];
  const emit = (direction: number) => { if (direction > 0) next++; else previous++; };
  const prototype = MediaViewerComponent.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;
  const state = {
    touch: null, timer: 0, frames: [], pendingRender: null,
    companion: cell<(typeof items)[number] | null>(null), direction: cell(-1), offset: cell(0), settling: cell(false), committing: cell(false), hasNavigated: cell(false),
    total: () => total, item: () => ({ id: itemId, kind: video ? 'video' : 'image' }), items: () => items,
    stage: () => ({ nativeElement: { getBoundingClientRect: () => ({ width: 320 }) } }),
    document: { defaultView: {
      setTimeout: (callback: () => void, delay: number) => { assert.equal(delay, MEDIA_SLIDE_MS); timers.set(1, callback); return 1; },
      clearTimeout: (id: number) => timers.delete(id), cancelAnimationFrame: () => undefined
    } },
    reducedMotion: () => reduced,
    navigate: emit, emitMove: emit,
    reset: () => Reflect.apply(prototype['reset'], state, []),
    snapBack: () => Reflect.apply(prototype['snapBack'], state, []),
    clearScheduled: () => Reflect.apply(prototype['clearScheduled'], state, []),
    touchCancel: () => Reflect.apply(prototype['touchCancel'], state, [])
  };
  const target = { closest: (selector: string) => selector === 'video'
    ? video ? { getBoundingClientRect: () => ({ bottom: 500 }) } : null
    : controls ? {} : null };
  const call = (method: 'touchStart' | 'touchMove' | 'touchEnd', touches: ReturnType<typeof point>[], changedTouches: ReturnType<typeof point>[] = []) =>
    Reflect.apply(prototype[method], state, [{ touches, changedTouches, target, cancelable: true, preventDefault: () => { prevented++; } }]);
  return {
    state, timers,
    start: (...touches: ReturnType<typeof point>[]) => call('touchStart', touches),
    move: (...touches: ReturnType<typeof point>[]) => call('touchMove', touches),
    end: (changedTouches: ReturnType<typeof point>[], touches: ReturnType<typeof point>[] = []) => call('touchEnd', touches, changedTouches),
    cancel: state.touchCancel, counts: () => ({ previous, next }), prevented: () => prevented,
    video: () => { video = true; }, controls: () => { controls = true; }, single: () => { total = 1; },
    changeItem: () => { itemId = 'second-photo'; }, reduce: () => { reduced = true; },
    transform: (id: string) => Reflect.apply(prototype['slideTransform'], state, [id]),
    navigateReal: (direction: number) => Reflect.apply(prototype['navigate'], state, [direction]),
    finishSnap: () => { for (const callback of [...timers.values()]) callback(); }
  };
}
function point(x: number, y = 100, identifier = 1) { return { clientX: x, clientY: y, identifier }; }
const swipe = harness();
swipe.start(point(250)); swipe.move(point(170, 105));
assert.equal(swipe.state.offset(), -25, 'Media follows the finger by its actual viewport percentage');
assert.equal(swipe.state.companion()?.id, 'second-photo');
assert.equal(swipe.transform('first-photo'), 'translate3d(-25%, 0, 0)');
assert.equal(swipe.transform('second-photo'), 'translate3d(75%, 0, 0)', 'Next media enters while the current media leaves');
assert.equal(swipe.prevented(), 1, 'A locked horizontal gesture must not trigger browser navigation');
swipe.end([point(100, 110)]);
assert.deepEqual(swipe.counts(), { previous: 0, next: 1 });
swipe.start(point(100)); swipe.end([point(250)]);
assert.deepEqual(swipe.counts(), { previous: 1, next: 1 });
swipe.end([point(300)]);
assert.deepEqual(swipe.counts(), { previous: 1, next: 1 }, 'One gesture emits only once');

for (const [name, gesture] of [
  ['tap or short drag', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(147)]); }],
  ['vertical scroll', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.move(point(105, 150)); test.end([point(250, 150)]); }],
  ['diagonal vertical gesture', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(170, 200)]); }],
  ['pinch at start', (test: ReturnType<typeof harness>) => { test.start(point(100), point(200, 100, 2)); test.end([point(300)]); }],
  ['pinch during movement', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.move(point(150), point(200, 100, 2)); test.end([point(300)]); }],
  ['another finger touching', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(300)], [point(200, 100, 2)]); }],
  ['cancelled touch', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.cancel(); test.end([point(300)]); }],
  ['different touch identifier', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(300, 100, 2)]); }],
  ['item changed mid-gesture', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.changeItem(); test.end([point(300)]); }],
  ['video scrubber controls', (test: ReturnType<typeof harness>) => { test.video(); test.start(point(100, 470)); test.end([point(300, 470)]); }],
  ['interactive control', (test: ReturnType<typeof harness>) => { test.controls(); test.start(point(100)); test.end([point(300)]); }],
  ['animation already running', (test: ReturnType<typeof harness>) => { test.state.settling.set(true); test.start(point(100)); test.end([point(300)]); }],
  ['single item', (test: ReturnType<typeof harness>) => { test.single(); test.start(point(100)); test.end([point(300)]); }]
] as const) {
  const test = harness(); gesture(test);
  assert.deepEqual(test.counts(), { previous: 0, next: 0 }, `${name} must not navigate`);
}
const film = harness(); film.video(); film.start(point(250, 200)); film.move(point(150, 205)); film.end([point(100, 205)]);
assert.equal(film.counts().next, 1, 'Swiping on a video navigates to the next image or film');
const backwards = harness(); backwards.start(point(100)); backwards.move(point(180));
assert.equal(backwards.state.companion()?.id, 'third-film', 'Previous wraps to the final item');
assert.equal(backwards.transform('third-film'), 'translate3d(-75%, 0, 0)');
const snap = harness(); snap.start(point(100)); snap.move(point(130)); snap.end([point(130)]);
assert.equal(snap.state.settling(), true); assert.equal(snap.state.offset(), 0);
assert.equal(snap.counts().previous, 0); snap.finishSnap();
assert.equal(snap.state.companion(), null); assert.equal(snap.state.settling(), false); assert.equal(snap.timers.size, 0);
const matchingTouch = harness(); matchingTouch.start(point(100)); matchingTouch.end([point(300, 100, 2), point(200)]);
assert.equal(matchingTouch.counts().previous, 1);
const threshold = harness(); threshold.start(point(100)); threshold.end([point(52)]);
assert.equal(threshold.counts().next, 1, 'A deliberate 48px swipe works on narrow screens');
const reduced = harness(); reduced.reduce(); reduced.navigateReal(1);
assert.equal(reduced.counts().next, 1); assert.equal(reduced.state.settling(), false); assert.equal(reduced.timers.size, 0);
const busy = harness(); busy.state.settling.set(true); busy.navigateReal(1);
assert.equal(busy.counts().next, 0, 'Repeated arrows cannot queue conflicting transitions');

const source = readFileSync('src/app/common/components/media-viewer/media-viewer.component.ts', 'utf8');
const slide = readFileSync('src/app/common/components/media-viewer/media-viewer-slide.component.ts', 'utf8');
assert.match(source, /@for \(slide of slides\(\); track slide.id\)/, 'Retain keyed outgoing nodes throughout motion');
assert.match(source, /\(touchmove\)="touchMove\(\$event\)"/);
assert.match(source, /\(touchcancel\)="touchCancel\(\)"/);
assert.match(source, /\(click\)="navigate\(-1\)"/);
assert.match(source, /\(click\)="navigate\(1\)"/);
assert.match(source, /class="sr-only">\{\{ copy.swipe \}\}/, 'Keep instructions accessible without a visible text strip');
assert.match(source, /aria-hidden="true">\s*<svg/, 'A decorative animated graphic replaces visible instructions');
assert.match(source, /\[attr.inert\]/, 'Offscreen companion media must not enter focus order');
assert.match(slide, /this.active\(\) && item.kind === 'video'/, 'Neighbouring films must not start their downloads');
assert.match(slide, /if \(this.leaving\(\)\) this.player\(\)\?\.nativeElement.pause\(\)/);
assert.match(slide, /onCleanup\(\(\) => \{ video.pause\(\);/);
const styles = readFileSync('src/styles/media.css', 'utf8');
assert.match(styles, /\.media-viewer__stage \{[^}]+touch-action: pan-y pinch-zoom/);
assert.match(styles, new RegExp(`transition: transform ${MEDIA_SLIDE_MS}ms`), 'CSS and completion clock share a duration');
assert.match(styles, /@keyframes media-swipe-hint/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]+\.media-viewer__stage--settling \.media-viewer__slide \{ transition: none/);
assert.doesNotMatch(styles, /media-viewer__swipe-hint/);
console.log('Media swipe checks passed: finger-tracked concurrent slides, bidirectional/wrapped photo and video navigation, control/scroll/pinch safety, snap-back, rapid-input lock, reduced motion, graphic hint, focus isolation and video cleanup.');
