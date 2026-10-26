import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PAGE_MEDIA_TIMEOUT_MS, waitForPageImage, waitForPageMedia, waitForPageVideo, waitForRenderedPage } from '../src/app/common/services/page-media-readiness.service';

const flush = async () => { for (let index = 0; index < 12; index++) await Promise.resolve(); };
const deferred = () => {
  let resolve!: () => void, reject!: () => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = () => no(new Error('Mock decode failure')); });
  return { promise, resolve, reject };
};
class ImageMock extends EventTarget {
  tagName = 'IMG';
  complete = false;
  naturalWidth = 0;
  loading = 'eager';
  decoding = '';
  fetchPriority = '';
  src = '';
  decodeCalls = 0;
  decoded = deferred();
  decode = () => { this.decodeCalls++; return this.decoded.promise; };
  load() { this.complete = true; this.naturalWidth = 1280; this.dispatchEvent(new Event('load')); }
  element() { return this as unknown as HTMLImageElement; }
}
const controller = new AbortController();
const delayed = new ImageMock();
let ready = false;
const loaded = waitForPageImage(delayed.element(), controller.signal).then(() => { ready = true; });
await flush(); assert.equal(ready, false);
delayed.load(); await flush();
assert.equal(delayed.decodeCalls, 1);
assert.equal(ready, false, 'The load event alone must not uncover undecoded pixels');
delayed.decoded.resolve(); await loaded;
assert.equal(ready, true);

const cached = new ImageMock(); cached.complete = true; cached.naturalWidth = 1280;
const cachedReady = waitForPageImage(cached.element(), controller.signal);
assert.equal(cached.decodeCalls, 1, 'Cached images also need decoding');
cached.decoded.resolve(); await cachedReady;
const broken = new ImageMock();
const brokenReady = waitForPageImage(broken.element(), controller.signal);
broken.dispatchEvent(new Event('error')); await brokenReady;
const undecodable = new ImageMock();
const failedDecode = waitForPageImage(undecodable.element(), controller.signal);
undecodable.load(); undecodable.decoded.reject(); await failedDecode;
const cancelled = new ImageMock(), cancellation = new AbortController();
const cancelledReady = waitForPageImage(cancelled.element(), cancellation.signal);
cancellation.abort(); await cancelledReady;
assert.equal(cancelled.decodeCalls, 0);

class VideoMock extends EventTarget {
  tagName = 'VIDEO';
  readyState = 0;
  networkState = 0;
  preload = 'metadata';
  poster = '';
  src = '';
  currentSrc = '';
  currentTime = 0;
  error = null;
  muted = false;
  playsInline = false;
  loadCalls = 0;
  pauseCalls = 0;
  playCalls = 0;
  load() { this.loadCalls++; this.networkState = 2; }
  pause() { this.pauseCalls++; }
  play() { this.playCalls++; return Promise.resolve(); }
  removeAttribute(name: string) { if (name === 'src') this.src = ''; }
  frame() { this.readyState = 2; this.dispatchEvent(new Event('loadeddata')); }
  playable() { this.readyState = 3; this.currentSrc = this.src; this.dispatchEvent(new Event('canplay')); }
  element() { return this as unknown as HTMLVideoElement; }
}
const film = new VideoMock(); let playable = false;
const filmReady = waitForPageVideo(film.element(), controller.signal).then(() => { playable = true; });
assert.equal(film.preload, 'auto'); assert.equal(film.loadCalls, 1);
film.frame(); await flush(); assert.equal(playable, false, 'A first frame is not enough: wait until the video can play');
film.playable(); await filmReady; assert.equal(playable, true);
const failedFilm = new VideoMock(); const failedFilmReady = waitForPageVideo(failedFilm.element(), controller.signal);
failedFilm.dispatchEvent(new Event('error')); await failedFilmReady;

function harness(images: ImageMock[] = [], background = 'none', hasRoot = true, videos: VideoMock[] = []) {
  let now = 0, next = 0, reveals = 0, render: (() => void) | null = null;
  const timers = new Map<number, { at: number; callback: () => void }>();
  const backgrounds: ImageMock[] = [];
  const probes: VideoMock[] = [];
  const artwork = { tagName: 'DIV' };
  const view = {
    setTimeout(callback: () => void, delay: number) { const id = ++next; timers.set(id, { at: now + delay, callback }); return id; },
    clearTimeout: (id: number) => { timers.delete(id); },
    requestAnimationFrame(callback: () => void) { return this.setTimeout(callback, 16); },
    cancelAnimationFrame: (id: number) => { timers.delete(id); },
    getComputedStyle: (element: unknown) => ({ backgroundImage: element === artwork ? background : 'none' })
  };
  const root = { tagName: 'APP-ROOT', querySelectorAll: (selector: string) => {
    if (selector === 'img') return images.map(image => image.element());
    if (selector === 'video') return videos.map(video => video.element());
    return [artwork, ...images, ...videos];
  } };
  const document = {
    baseURI: 'https://local.test/ScubaLakKadmat/',
    defaultView: view,
    querySelector: () => hasRoot ? root : null,
    createElement: (tag: string) => {
      if (tag === 'video') { const video = new VideoMock(); probes.push(video); return video.element(); }
      const image = new ImageMock(); backgrounds.push(image); return image.element();
    }
  } as unknown as Document;
  const cancel = waitForRenderedPage(document, () => { reveals++; }, read => {
    render = read;
    return { destroy: () => { render = null; } };
  });
  return {
    cancel, backgrounds, probes, document, timers,
    reveals: () => reveals,
    render: () => { render?.(); },
    async advance(milliseconds: number) {
      const target = now + milliseconds;
      while (true) {
        const entry = [...timers.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!entry) break;
        now = entry[1].at; timers.delete(entry[0]); entry[1].callback(); await flush();
      }
      now = target;
      await flush();
    }
  };
}

const hero = new ImageMock(), lazy = new ImageMock(); lazy.loading = 'lazy';
const pageFilm = new VideoMock();
const page = harness([hero, lazy], 'linear-gradient(black, transparent), url("https://local.test/hero.webp")', true, [pageFilm]);
assert.equal(page.backgrounds.length, 0, 'Do not inspect the previous route before the next Angular render');
page.render();
assert.equal(page.backgrounds.length, 1, 'Include CSS destination-hero backgrounds');
assert.equal(page.backgrounds[0].src, 'https://local.test/hero.webp');
assert.equal(lazy.loading, 'eager', 'Start every below-the-fold image without requiring scrolling');
await page.advance(3500);
assert.equal(page.reveals(), 0, 'Keep the curtain through a slow hero request');
hero.load(); hero.decoded.resolve(); await flush();
assert.equal(page.reveals(), 0, 'All hero images, including CSS backgrounds, must be ready');
page.backgrounds[0].load(); page.backgrounds[0].decoded.resolve(); await flush();
assert.equal(page.reveals(), 0, 'A ready hero must not uncover a page while lower images and videos are loading');
lazy.load(); lazy.decoded.resolve(); await flush();
assert.equal(page.reveals(), 0, 'Images being ready must not skip the video readiness check');
pageFilm.playable(); await flush();
await page.advance(31); assert.equal(page.reveals(), 0, 'Allow decoded pixels two paint frames');
await page.advance(1); assert.equal(page.reveals(), 1);
assert.equal(lazy.decodeCalls, 1, 'Decode lazy gallery images before reveal too');
assert.equal(page.timers.size, 0);

const stalled = harness([new ImageMock()]); stalled.render();
await stalled.advance(PAGE_MEDIA_TIMEOUT_MS - 1); assert.equal(stalled.reveals(), 0);
await stalled.advance(1); assert.equal(stalled.reveals(), 1, 'Bound the wait if an image never completes');
assert.equal(stalled.timers.size, 0);
const disposed = harness([new ImageMock()]); disposed.render(); disposed.cancel();
await disposed.advance(PAGE_MEDIA_TIMEOUT_MS + 1); assert.equal(disposed.reveals(), 0, 'Cancelled navigations must not reveal a newer page');
assert.equal(disposed.timers.size, 0);
const noImage = harness([], 'none', false); noImage.render(); await flush();
await noImage.advance(32); assert.equal(noImage.reveals(), 1, 'Text-only pages should not gain a loading delay');
const thumbnail = new ImageMock(); thumbnail.loading = 'lazy';
const gallery = harness([thumbnail]); gallery.render();
assert.equal(thumbnail.loading, 'eager', 'Gallery film thumbnails still preload');
assert.equal(gallery.probes.length, 0, 'Never create a gallery video player during page preloading');
await gallery.advance(1000); assert.equal(gallery.reveals(), 0, 'Wait for the gallery thumbnail');
thumbnail.load(); thumbnail.decoded.resolve(); await flush(); await gallery.advance(32);
assert.equal(gallery.reveals(), 1, 'Ready thumbnails can reveal the gallery without downloading its films');
assert.equal(gallery.probes.length, 0);
const collection = readFileSync('src/app/common/components/media-collection/media-collection.component.ts', 'utf8');
assert.match(collection, /\(click\)="selected\.set\(item\)"/);
assert.match(collection, /@if \(selected\(\); as item\) \{ <app-media-viewer/);
assert.doesNotMatch(collection, /data-page-video|<video|<source/, 'Film cards must not expose preload sources or instantiate players');
const viewer = readFileSync('src/app/common/components/media-viewer/media-viewer.component.ts', 'utf8');
assert.match(viewer, /@if \(video\(\); as film\) \{\s*<video/);
assert.match(viewer, /\[src\]="film\.videoUrlMobile"[^>]+media="\(max-width: 767px\)"/);
assert.match(viewer, /\[src\]="film\.videoUrl"/, 'The click-created player keeps responsive video sources');
await waitForPageMedia({ defaultView: null } as Document, new AbortController().signal);
console.log('Page-media checks passed: all images including gallery thumbnails, CSS backgrounds and posters; playable existing page videos; gallery players created only after Play; responsive click-created sources; decode/paint readiness; initial/error/abort/timeout paths and cleanup.');
