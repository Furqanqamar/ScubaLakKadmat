import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MediaViewerComponent } from '../src/app/common/components/media-viewer/media-viewer.component';

// Exercise the real touch handlers without synthesising browser UI events.
function harness() {
  let previous = 0, next = 0, video = false, total = 3, itemId = 'first-photo';
  const state = {
    touch: null, video: () => video, total: () => total, item: () => ({ id: itemId }),
    previous: { emit: () => { previous++; } }, next: { emit: () => { next++; } },
    touchCancel: () => Reflect.apply(MediaViewerComponent.prototype.touchCancel, state, [])
  };
  const call = (method: 'touchStart' | 'touchMove' | 'touchEnd', touches: ReturnType<typeof point>[], changedTouches: ReturnType<typeof point>[] = []) =>
    Reflect.apply(MediaViewerComponent.prototype[method], state, [{ touches, changedTouches }]);
  return {
    start: (...touches: ReturnType<typeof point>[]) => call('touchStart', touches),
    move: (...touches: ReturnType<typeof point>[]) => call('touchMove', touches),
    end: (changedTouches: ReturnType<typeof point>[], touches: ReturnType<typeof point>[] = []) => call('touchEnd', touches, changedTouches),
    cancel: state.touchCancel, counts: () => ({ previous, next }),
    video: () => { video = true; }, single: () => { total = 1; }, changeItem: () => { itemId = 'second-photo'; }
  };
}
function point(x: number, y = 100, identifier = 1) { return { clientX: x, clientY: y, identifier }; }
const swipe = harness();
swipe.start(point(250)); swipe.move(point(180, 105)); swipe.end([point(100, 110)]);
assert.deepEqual(swipe.counts(), { previous: 0, next: 1 }, 'Swipe left opens the next image');
swipe.start(point(100)); swipe.end([point(250)]);
assert.deepEqual(swipe.counts(), { previous: 1, next: 1 }, 'Swipe right opens the previous image');
swipe.end([point(300)]);
assert.deepEqual(swipe.counts(), { previous: 1, next: 1 }, 'One gesture must emit only once');

for (const [name, gesture] of [
  ['tap or short drag', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(147)]); }],
  ['vertical scroll', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.move(point(105, 150)); test.end([point(250, 150)]); }],
  ['diagonal vertical gesture', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(170, 200)]); }],
  ['pinch at start', (test: ReturnType<typeof harness>) => { test.start(point(100), point(200, 100, 2)); test.end([point(300)]); }],
  ['pinch during movement', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.move(point(150), point(200, 100, 2)); test.end([point(300)]); }],
  ['another finger still touching', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(300)], [point(200, 100, 2)]); }],
  ['cancelled touch', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.cancel(); test.end([point(300)]); }],
  ['different touch identifier', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.end([point(300, 100, 2)]); }],
  ['item changed mid-gesture', (test: ReturnType<typeof harness>) => { test.start(point(100)); test.changeItem(); test.end([point(300)]); }],
  ['video controls', (test: ReturnType<typeof harness>) => { test.video(); test.start(point(100)); test.end([point(300)]); }],
  ['single photo', (test: ReturnType<typeof harness>) => { test.single(); test.start(point(100)); test.end([point(300)]); }]
] as const) {
  const test = harness(); gesture(test);
  assert.deepEqual(test.counts(), { previous: 0, next: 0 }, `${name} must not navigate`);
}
const matchingTouch = harness(); matchingTouch.start(point(100));
matchingTouch.end([point(300, 100, 2), point(200)]);
assert.deepEqual(matchingTouch.counts(), { previous: 1, next: 0 }, 'Track the originating finger, not changedTouches order');
const threshold = harness(); threshold.start(point(100)); threshold.end([point(52)]);
assert.equal(threshold.counts().next, 1, 'A deliberate 48px horizontal swipe works on narrow screens');

const source = readFileSync('src/app/common/components/media-viewer/media-viewer.component.ts', 'utf8');
assert.match(source, /\(touchmove\)="touchMove\(\$event\)"/);
assert.match(source, /\(touchcancel\)="touchCancel\(\)"/);
assert.match(source, /\(click\)="previous\.emit\(\)"/);
assert.match(source, /\(click\)="next\.emit\(\)"/);
assert.match(source, /@if \(!video\(\) && total\(\) > 1\)/, 'Only photo sets show the swipe hint');
const styles = readFileSync('src/styles/media.css', 'utf8');
assert.match(styles, /\.media-viewer__stage--image \{ touch-action: pan-y pinch-zoom; \}/);
assert.match(styles, /@media \(max-width: 767px\), \(pointer: coarse\)/);
console.log('Media swipe checks passed: left/next, right/previous, 48px threshold, originating-finger tracking, tap/scroll/pinch/cancel/stale-gesture safety, video-control isolation and unchanged arrow buttons.');
