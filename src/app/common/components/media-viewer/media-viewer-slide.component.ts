import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { GalleryItem } from '../../../models/site-data.model';
import { MEDIA_COPY } from '../../../data/media-copy';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';

/** Keep the outgoing media node alive until its slide has left the viewport. */
@Component({
  selector: 'app-media-viewer-slide', standalone: true,
  imports: [ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-busy]': 'active() && !ready() && !failed() ? "true" : null' },
  template: `
    @if (video(); as film) {
      <video #player controls autoplay playsinline [muted]="true" preload="metadata"
        [poster]="film.imageUrl" [attr.aria-label]="film.title"
        (loadeddata)="ready.set(true)" (playing)="ready.set(true)"
        (waiting)="ready.set(false)" (canplay)="ready.set(true)" (error)="failed.set(true)">
        <source [src]="film.videoUrlMobile" type="video/mp4" media="(max-width: 767px)">
        <source [src]="film.videoUrl" type="video/mp4">
      </video>
    } @else {
      <img [appResponsiveImage]="item().imageUrl" sizes="(max-width: 767px) 95vw, 70vw"
        [src]="item().imageUrl" [alt]="item().title" [width]="item().width ?? 1200" [height]="item().height ?? 800"
        draggable="false" decoding="async" (load)="ready.set(true)" (error)="failed.set(true)">
    }
    @if (active() && failed()) {
      <div class="media-viewer__status" role="alert"><p>{{ video() ? copy.error : copy.imageError }}</p>
        @if (video()) { <button class="button-link button-link--mint mt-4" type="button" (click)="retry()">{{ copy.retry }}</button> }
      </div>
    } @else if (active() && !ready()) {
      <div class="media-viewer__status media-viewer__status--loading" role="status"><span class="media-spinner" aria-hidden="true"></span><span>{{ copy.loading }}</span></div>
    }
  `
})
export class MediaViewerSlideComponent {
  readonly item = input.required<GalleryItem>();
  readonly active = input(false);
  readonly leaving = input(false);
  readonly copy = MEDIA_COPY;
  readonly ready = signal(false);
  readonly failed = signal(false);
  // Adjacent films use their poster; only the selected film creates a player.
  readonly video = computed(() => { const item = this.item(); return this.active() && item.kind === 'video' ? item : null; });
  private readonly player = viewChild<ElementRef<HTMLVideoElement>>('player');

  constructor() {
    effect(() => { this.item(); this.active(); this.ready.set(false); this.failed.set(false); });
    afterRenderEffect(() => {
      const player = this.player()?.nativeElement;
      if (player) { player.load(); void player.play().catch(() => this.ready.set(true)); }
    });
    effect(() => { if (this.leaving()) this.player()?.nativeElement.pause(); });
    effect(onCleanup => {
      const video = this.player()?.nativeElement;
      if (!video) return;
      onCleanup(() => { video.pause(); video.removeAttribute('src'); video.querySelectorAll('source').forEach(source => source.removeAttribute('src')); video.load(); });
    });
  }

  retry(): void {
    this.failed.set(false); this.ready.set(false);
    const video = this.player()?.nativeElement;
    video?.load();
    void video?.play().catch(() => this.ready.set(true));
  }
}
