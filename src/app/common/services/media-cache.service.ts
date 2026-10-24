import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaCacheService {
  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const window = document.defaultView;
      if (!window || !('serviceWorker' in window.navigator)) return;
      const timer = window.setTimeout(() => {
        const script = new URL('media-cache-worker.js', document.baseURI);
        void window.navigator.serviceWorker.register(script.href, { scope: new URL('.', document.baseURI).pathname }).catch(() => undefined);
      }, 2500);
      destroyRef.onDestroy(() => window.clearTimeout(timer));
    });
  }
}
