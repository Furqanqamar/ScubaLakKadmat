import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, inject, Injectable, Injector } from '@angular/core';

export const PAGE_MEDIA_TIMEOUT_MS = 30000;

// Wait for the browser-selected srcset candidate, not a second, full-size copy.
export function waitForPageImage(image: HTMLImageElement, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', finish);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const loaded = (): void => {
      if (!image.naturalWidth || typeof image.decode !== 'function') { finish(); return; }
      // A loaded file may still need decoding before it can be painted.
      void image.decode().then(finish, finish);
    };
    if (signal.aborted) { finish(); return; }
    image.addEventListener('load', loaded);
    image.addEventListener('error', finish);
    signal.addEventListener('abort', finish, { once: true });
    if (image.complete) loaded();
  });
}

export function waitForPageVideo(video: HTMLVideoElement, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    let settled = false;
    const events = ['loadeddata', 'canplay', 'canplaythrough', 'progress'];
    const finish = (): void => {
      if (settled) return;
      settled = true;
      events.forEach(event => video.removeEventListener(event, ready));
      video.removeEventListener('error', finish);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const ready = (): void => { if (video.readyState >= 3) finish(); };
    if (signal.aborted || video.error) { finish(); return; }
    events.forEach(event => video.addEventListener(event, ready));
    video.addEventListener('error', finish);
    signal.addEventListener('abort', finish, { once: true });
    video.preload = 'auto';
    if (video.readyState === 0 && video.networkState !== 2) video.load();
    ready();
  });
}

export async function waitForPageMedia(document: Document, signal: AbortSignal): Promise<void> {
  const view = document.defaultView;
  if (!view || signal.aborted) return;
  const root = document.querySelector<HTMLElement>('app-root');
  if (!root) return;
  const images = [...root.querySelectorAll<HTMLImageElement>('img')];
  // Explicitly start below-the-fold images while the curtain is covering them.
  images.forEach(image => { image.loading = 'eager'; });
  const videoElements = [...root.querySelectorAll<HTMLVideoElement>('video')];
  const urls = new Set<string>();
  const addBackgrounds = (value: string): void => {
    for (const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (!match[1].startsWith('data:')) urls.add(match[1]);
    }
  };
  // Include CSS artwork anywhere on the page, not just destination heroes.
  for (const element of [root, ...root.querySelectorAll<HTMLElement>('*')]) {
    if (['IMG', 'VIDEO', 'SOURCE'].includes(element.tagName)) continue;
    addBackgrounds(view.getComputedStyle(element).backgroundImage);
  }
  for (const video of videoElements) if (video.poster) urls.add(video.poster);
  const backgrounds = [...urls].map(url => {
    const image = document.createElement('img');
    image.decoding = 'async';
    image.src = url;
    return image;
  });
  // Only prepare players already on the page, such as the home hero.
  // Gallery film files stay untouched until a visitor clicks their Play card;
  // their thumbnails are included in the image readiness check above.
  await Promise.all([
    ...[...images, ...backgrounds].map(image => waitForPageImage(image, signal)),
    ...videoElements.map(video => waitForPageVideo(video, signal))
  ]);
}

function paintedFrame(view: Window, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(); return; }
    let frame = 0;
    const finish = (): void => {
      view.cancelAnimationFrame(frame);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    frame = view.requestAnimationFrame(finish);
    signal.addEventListener('abort', finish, { once: true });
  });
}

export function waitForRenderedPage(document: Document, onReady: () => void, afterRender: (read: () => void) => { destroy(): void }): () => void {
  const view = document.defaultView;
  if (!view) { onReady(); return () => undefined; }
  const controller = new AbortController();
  let finished = false;
  const release = (): void => {
    if (finished) return;
    finished = true;
    view.clearTimeout(timeout);
    render.destroy();
    controller.abort();
    onReady();
  };
  // Broken/blocked media must never trap visitors behind the curtain.
  const timeout = view.setTimeout(release, PAGE_MEDIA_TIMEOUT_MS);
  // NavigationEnd precedes Angular's final DOM render. Inspect the new page
  // only after that render, then allow decoded pixels two frames to paint.
  const render = afterRender(() => {
    void (async () => {
      await waitForPageMedia(document, controller.signal);
      await paintedFrame(view, controller.signal);
      await paintedFrame(view, controller.signal);
      release();
    })().catch(release);
  });
  return () => {
    finished = true;
    view.clearTimeout(timeout);
    render.destroy();
    controller.abort();
  };
}

@Injectable({ providedIn: 'root' })
export class PageMediaReadinessService {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private cleanup: (() => void) | null = null;

  constructor() { inject(DestroyRef).onDestroy(() => this.cleanup?.()); }

  waitForPage(onReady: () => void): () => void {
    this.cleanup?.();
    this.cleanup = waitForRenderedPage(this.document, onReady, work => afterNextRender({ mixedReadWrite: work }, { injector: this.injector }));
    return this.cleanup;
  }
}
