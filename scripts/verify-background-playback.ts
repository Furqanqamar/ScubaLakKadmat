import assert from 'node:assert/strict';
import { connectBackgroundPlayback } from '../src/app/common/components/background-video/background-video-playback';

const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function harness(covered = true) {
  const document = new EventTarget() as EventTarget & Record<string, unknown>;
  const view = new EventTarget();
  const breakpoint = new EventTarget();
  Object.assign(document, { visibilityState: 'visible', querySelector: () => covered ? {} : null,
    documentElement: { classList: { contains: () => false } }, defaultView: Object.assign(view, { matchMedia: () => breakpoint }) });
  let playing = 0, blocked = 0, playCalls = 0, pauseCalls = 0, loadCalls = 0;
  let rejection: Error | null = null;
  const video = Object.assign(new EventTarget(), {
    paused: true, ended: false, muted: false, playsInline: false,
    play() { playCalls++; if (rejection) return Promise.reject(rejection); this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve(); },
    pause() { pauseCalls++; this.paused = true; this.dispatchEvent(new Event('pause')); },
    load() { loadCalls++; this.paused = true; }
  });
  const control = connectBackgroundPlayback(video as unknown as HTMLVideoElement, document as unknown as Document, { playing: () => playing++, blocked: () => blocked++ });
  return { document, video, view, breakpoint, control, reject: (error: Error | null) => rejection = error, counts: () => ({ playing, blocked, playCalls, pauseCalls, loadCalls }) };
}

const initial = harness();
assert.equal(initial.video.muted, true); assert.equal(initial.video.playsInline, true);
assert.equal(initial.counts().playCalls, 0);
initial.video.dispatchEvent(new Event('canplay'));
assert.equal(initial.counts().playCalls, 0, 'The parser and ready events must not start video beneath the curtain');
initial.document.dispatchEvent(new Event('scuba-lak:initial-ready')); await flush();
assert.equal(initial.counts().playing, 1, 'The first reveal starts automatic muted playback');
initial.control.destroy();
initial.document.dispatchEvent(new Event('touchend')); initial.view.dispatchEvent(new Event('pageshow'));
assert.equal(initial.counts().playCalls, 1, 'Destroyed players cannot resume');

const restricted = harness();
const denied = new Error('Autoplay blocked'); denied.name = 'NotAllowedError';
restricted.reject(denied); restricted.document.dispatchEvent(new Event('scuba-lak:initial-ready')); await flush();
assert.equal(restricted.counts().blocked, 1, 'Do not silently swallow autoplay rejection');
assert.equal(restricted.counts().playing, 0, 'A loaded first frame is not proof of playback');
restricted.reject(null); restricted.document.dispatchEvent(new Event('touchend')); await flush();
assert.equal(restricted.counts().playing, 1, 'Safari touch gestures directly retry playback');
restricted.video.pause();
assert.equal(restricted.counts().blocked, 2, 'An unexpected visible pause has a recoverable Play action');
restricted.control.play(); await flush();
assert.equal(restricted.counts().playing, 2);
restricted.breakpoint.dispatchEvent(new Event('change')); await flush();
assert.equal(restricted.counts().loadCalls, 1, 'Orientation changes reselect the correct responsive source');
restricted.control.destroy();

const hidden = harness(); hidden.document['visibilityState'] = 'hidden';
hidden.document.dispatchEvent(new Event('scuba-lak:initial-ready')); await flush();
assert.equal(hidden.counts().playCalls, 0);
hidden.document['visibilityState'] = 'visible'; hidden.document.dispatchEvent(new Event('visibilitychange')); await flush();
assert.equal(hidden.counts().playing, 1, 'Returning to the page resumes playback'); hidden.control.destroy();

const aborted = harness(); const abort = new Error('Source changed'); abort.name = 'AbortError';
aborted.reject(abort); aborted.document.dispatchEvent(new Event('scuba-lak:initial-ready')); await flush();
assert.equal(aborted.counts().blocked, 0, 'A routine source-reset cancellation is not an autoplay block'); aborted.control.destroy();
const returned = harness(false); await flush();
assert.equal(returned.counts().playing, 1, 'Client-side return to Home does not wait for a second initial-ready event'); returned.control.destroy();
console.log('Background playback checks passed: poster-first reveal, muted inline autoplay, denied-play recovery, Safari gestures, pause/resume, source changes, visibility and teardown.');
