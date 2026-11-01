import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createCursorMotion } from '../src/app/common/components/interactive-cursor/cursor-motion';

class ElementMock {
  readonly attributes = new Map<string, string>();
  readonly classes = new Set<string>();
  readonly style = { transform: '' };
  readonly classList = { add: (name: string) => this.classes.add(name), remove: (name: string) => this.classes.delete(name) };
  constructor(readonly kind: 'plain' | 'interactive' | 'native' = 'plain') {}
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  removeAttribute(name: string) { this.attributes.delete(name); }
  closest(selector: string) { return selector.startsWith('input,') ? (this.kind === 'native' ? this : null) : (this.kind === 'interactive' ? this : null); }
}
class EventsMock {
  readonly listeners = new Map<string, (event: Record<string, unknown>) => void>();
  addEventListener(name: string, callback: (event: Record<string, unknown>) => void) { this.listeners.set(name, callback); }
  removeEventListener(name: string) { this.listeners.delete(name); }
  send(name: string, event: Record<string, unknown> = {}) { this.listeners.get(name)?.(event); }
}
function harness(fine = true, reduce = false) {
  let now = 0, next = 0;
  const frames = new Map<number, (time: number) => void>();
  const pointer = Object.assign(new EventsMock(), { matches: fine });
  const reduced = Object.assign(new EventsMock(), { matches: reduce });
  const view = Object.assign(new EventsMock(), {
    Element: ElementMock, performance: { now: () => now },
    matchMedia: (query: string) => query.includes('reduced-motion') ? reduced : pointer,
    requestAnimationFrame: (callback: (time: number) => void) => { const id = ++next; frames.set(id, callback); return id; },
    cancelAnimationFrame: (id: number) => { frames.delete(id); }
  });
  const body = new ElementMock(), plain = new ElementMock(), interactive = new ElementMock('interactive'), native = new ElementMock('native');
  let hit = plain;
  const document = Object.assign(new EventsMock(), { defaultView: view, body, visibilityState: 'visible', elementFromPoint: () => hit });
  const root = new ElementMock(), ring = new ElementMock(), dot = new ElementMock();
  const motion = createCursorMotion(document as unknown as Document, { root, ring, dot } as unknown as Parameters<typeof createCursorMotion>[1]);
  const move = (x: number, y = 100, target = plain, pointerType = 'mouse') => view.send('pointermove', { clientX: x, clientY: y, target, pointerType });
  return { motion, root, ring, dot, body, view, document, pointer, reduced, frames, plain, interactive, native, move,
    step(milliseconds = 1000 / 60) { now += milliseconds; const queued = [...frames.values()]; frames.clear(); queued.forEach(callback => callback(now)); },
    hit(target: ElementMock) { hit = target; }
  };
}
const position = (element: ElementMock) => {
  const match = element.style.transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px/);
  assert.ok(match); return { x: Number(match[1]), y: Number(match[2]) };
};

const cursor = harness();
assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden');
assert.equal(cursor.body.classes.has('custom-cursor-enabled'), false, 'Keep the native pointer until the custom pointer has a position');
cursor.move(100, 120);
assert.deepEqual(position(cursor.dot), { x: 100, y: 120 });
assert.deepEqual(position(cursor.ring), { x: 100, y: 120 }, 'First entry must not fly in from a stale corner');
assert.ok(cursor.body.classes.has('custom-cursor-enabled'));
cursor.step(); assert.equal(cursor.frames.size, 0, 'An idle pointer must not run a permanent animation loop');
cursor.move(500, 300); cursor.step();
assert.deepEqual(position(cursor.dot), { x: 500, y: 300 }, 'The dot tracks the actual pointer');
assert.ok(position(cursor.ring).x > 100 && position(cursor.ring).x < 500, 'The ring follows with smooth trailing lag');
for (let frame = 0; frame < 100 && cursor.frames.size; frame++) cursor.step();
assert.equal(cursor.frames.size, 0); assert.deepEqual(position(cursor.ring), position(cursor.dot));
cursor.document.send('pointerover', { target: cursor.interactive, pointerType: 'mouse' });
assert.equal(cursor.root.attributes.get('data-cursor-mode'), 'interactive');
cursor.view.send('pointerdown', { target: cursor.interactive, pointerType: 'mouse' });
assert.equal(cursor.root.attributes.get('data-cursor-pressed'), 'true');
cursor.view.send('pointerup'); assert.equal(cursor.root.attributes.has('data-cursor-pressed'), false);
cursor.document.send('pointerout', { relatedTarget: cursor.plain });
assert.equal(cursor.root.attributes.get('data-cursor-mode'), 'default');
cursor.move(200, 100, cursor.native);
assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden');
assert.ok(!cursor.body.classes.has('custom-cursor-enabled'), 'Form fields and native media controls use their normal pointer');
cursor.move(200); cursor.motion.setSuspended(true);
assert.equal(cursor.frames.size, 0); assert.ok(!cursor.body.classes.has('custom-cursor-enabled'));
cursor.move(300); assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden', 'Popups suspend custom motion');
cursor.motion.setSuspended(false); cursor.move(300);
assert.deepEqual(position(cursor.ring), { x: 300, y: 100 });
cursor.hit(cursor.native); cursor.view.send('scroll');
assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden', 'Recheck the hit target when scrolling under a stationary pointer');
cursor.move(200); cursor.document.send('pointerleave');
assert.equal(cursor.frames.size, 0); assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden');
cursor.move(200); cursor.view.send('blur'); assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden');
cursor.move(200); cursor.document.visibilityState = 'hidden'; cursor.document.send('visibilitychange');
assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden'); cursor.document.visibilityState = 'visible';
cursor.move(200); cursor.move(300, 100, cursor.plain, 'touch');
assert.ok(!cursor.body.classes.has('custom-cursor-enabled'), 'Hybrid touch input must restore the native pointer');
cursor.move(200); cursor.reduced.matches = true; cursor.reduced.send('change');
assert.ok(!cursor.body.classes.has('custom-cursor-enabled')); assert.equal(cursor.frames.size, 0);
cursor.reduced.matches = false; cursor.reduced.send('change'); cursor.move(200);
assert.equal(cursor.root.attributes.get('data-cursor-state'), 'visible', 'Motion can resume after a live preference change');
cursor.pointer.matches = false; cursor.pointer.send('change'); assert.equal(cursor.root.attributes.get('data-cursor-state'), 'hidden');
cursor.motion.destroy();
assert.equal(cursor.view.listeners.size, 0); assert.equal(cursor.document.listeners.size, 0);
assert.equal(cursor.pointer.listeners.size, 0); assert.equal(cursor.reduced.listeners.size, 0);
assert.equal(cursor.frames.size, 0);

for (const test of [harness(false), harness(true, true)]) {
  test.move(100); assert.equal(test.root.attributes.get('data-cursor-state'), 'hidden');
  assert.ok(!test.body.classes.has('custom-cursor-enabled')); test.motion.destroy();
}
function after200ms(rate: number) {
  const test = harness(); test.move(0); test.step(); test.move(500);
  for (let frame = 0; frame < rate / 5; frame++) test.step(1000 / rate);
  const x = position(test.ring).x; test.motion.destroy(); return x;
}
assert.ok(Math.abs(after200ms(60) - after200ms(120)) < .01, 'Damping must be refresh-rate independent');
createCursorMotion({ defaultView: null } as Document, {} as Parameters<typeof createCursorMotion>[1]).destroy();
const source = readFileSync('src/app/common/components/interactive-cursor/interactive-cursor.component.ts', 'utf8');
assert.match(source, /mix-blend-mode: difference/, 'Invert cursor contrast against the actual page backdrop');
assert.match(source, /pointer-events: none/, 'The effect must never intercept clicks');
assert.match(source, /\(hover: none\), \(pointer: coarse\), \(prefers-reduced-motion: reduce\)/);
console.log('Cursor checks passed: direct dot + damped trailing ring, refresh-rate independence, automatic difference contrast, real interactive/press states, native-control and popup fallback, touch/reduced-motion/blur/leave handling, idle frame shutdown and cleanup.');
