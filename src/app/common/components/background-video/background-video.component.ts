import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HERO_MEDIA } from '../../../data/hero-media.generated';
import { connectBackgroundPlayback } from './background-video-playback';

@Component({
  selector: 'app-background-video', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img class="background-video__image" [src]="media.poster" width="1280" height="720" alt="" loading="eager" fetchpriority="high" decoding="async">
    <video #player data-poster-first class="background-video__image" [class.background-video__image--ready]="hasFrame()" (emptied)="hasFrame.set(false)" (error)="hasFrame.set(false)" muted [muted]="true" loop playsinline preload="metadata" [poster]="media.poster" aria-hidden="true" tabindex="-1">
      <source [src]="media.mobile.webm" type="video/webm; codecs=vp9" media="(max-width: 767px)">
      <source [src]="media.mobile.mp4" type="video/mp4" media="(max-width: 767px)">
      <source [src]="media.desktop.webm" type="video/webm; codecs=vp9">
      <source [src]="media.desktop.mp4" type="video/mp4">
    </video>
    @if (needsPlay()) {
      <button type="button" class="background-video__control" (click)="resume()" aria-label="Play background video"><span aria-hidden="true">▶</span> Play video</button>
    }`,
  styles: `:host { display: contents; pointer-events: none; } .background-video__image { z-index: -20; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; } video.background-video__image { opacity: 0; } video.background-video__image--ready { opacity: 1; } .background-video__control { position: absolute; right: 1.25rem; bottom: 1rem; z-index: 1; display: inline-flex; min-height: 44px; align-items: center; gap: .6rem; padding: .5rem 1rem; border: 1px solid rgb(214 255 240 / .6); border-radius: 999px; background: rgb(6 20 25 / .8); color: #f4f1e9; font: 600 .875rem/1.5 var(--font-body); pointer-events: auto; cursor: pointer; } .background-video__control:focus-visible { outline: 2px solid #b8f2df; outline-offset: 3px; }`
})
export class BackgroundVideoComponent {
  readonly media = HERO_MEDIA;
  readonly hasFrame = signal(false);
  readonly needsPlay = signal(false);
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('player');
  private playback: ReturnType<typeof connectBackgroundPlayback> | null = null;
  resume(): void { this.playback?.play(); }
  constructor() {
    const document = inject(DOCUMENT), destroy = inject(DestroyRef);
    afterNextRender(() => {
      const window = document.defaultView;
      if (!window) return;
      const player = this.video().nativeElement;
      this.playback = connectBackgroundPlayback(player, document, {
        playing: () => { this.hasFrame.set(true); this.needsPlay.set(false); },
        blocked: () => { this.needsPlay.set(true); }
      });
      destroy.onDestroy(() => {
        this.playback?.destroy();
        this.playback = null;
        player.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
        player.removeAttribute('src');
        player.load();
      });
    });
  }
}
