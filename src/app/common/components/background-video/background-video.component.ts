import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HERO_MEDIA } from '../../../data/hero-media.generated';

@Component({
  selector: 'app-background-video', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img class="background-video__image" [src]="media.poster" width="1280" height="720" alt="" loading="eager" fetchpriority="high" decoding="async">
    <video #player class="background-video__image" [class.background-video__image--ready]="hasFrame()" (loadeddata)="hasFrame.set(true)" (emptied)="hasFrame.set(false)" (error)="hasFrame.set(false)" autoplay muted [muted]="true" loop playsinline preload="metadata" [poster]="media.poster" aria-hidden="true" tabindex="-1">
      <source [src]="media.mobile.webm" type="video/webm; codecs=vp9" media="(max-width: 767px)">
      <source [src]="media.mobile.mp4" type="video/mp4" media="(max-width: 767px)">
      <source [src]="media.desktop.webm" type="video/webm; codecs=vp9">
      <source [src]="media.desktop.mp4" type="video/mp4">
    </video>`,
  styles: `:host { display: contents; pointer-events: none; } .background-video__image { z-index: -20; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; } video.background-video__image { opacity: 0; } video.background-video__image--ready { opacity: 1; }`
})
export class BackgroundVideoComponent {
  readonly media = HERO_MEDIA;
  readonly hasFrame = signal(false);
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('player');
  constructor() {
    const document = inject(DOCUMENT), destroy = inject(DestroyRef);
    afterNextRender(() => {
      const window = document.defaultView;
      if (!window) return;
      const player = this.video().nativeElement;
      // Cached video can have a frame before hydration attaches load listeners.
      this.hasFrame.set(player.readyState >= player.HAVE_CURRENT_DATA);
      const play = (): void => {
        if (document.visibilityState !== 'hidden' && player.paused) void player.play().catch(() => { /* The poster remains if the browser blocks autoplay. */ });
      };
      const breakpoint = window.matchMedia('(max-width: 767px)');
      const reselectSource = (): void => { player.load(); play(); };
      breakpoint.addEventListener('change', reselectSource);
      play();
      document.addEventListener('visibilitychange', play);
      window.addEventListener('pageshow', play);
      // Retry after a visitor gesture if autoplay was initially restricted.
      document.addEventListener('pointerdown', play, { passive: true });
      document.addEventListener('keydown', play, { passive: true });
      destroy.onDestroy(() => {
        breakpoint.removeEventListener('change', reselectSource);
        document.removeEventListener('visibilitychange', play);
        window.removeEventListener('pageshow', play);
        document.removeEventListener('pointerdown', play);
        document.removeEventListener('keydown', play);
        player.pause();
        player.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
        player.removeAttribute('src');
        player.load();
      });
    });
  }
}
