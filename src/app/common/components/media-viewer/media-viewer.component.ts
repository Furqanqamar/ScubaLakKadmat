import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, output, signal, viewChild } from '@angular/core';
import { GalleryItem } from '../../../models/site-data.model';
import { MEDIA_COPY } from '../../../data/media-copy';
import { DialogShellComponent } from '../dialog-shell/dialog-shell.component';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';

@Component({
  selector: 'app-media-viewer', standalone: true,
  imports: [DialogShellComponent, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog-shell [labelledBy]="item().id + '-title'" (closed)="closed.emit()">
      <section class="gallery-lightbox__panel">
        <div class="media-viewer__stage" [attr.aria-busy]="!ready() && !failed()">
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
              decoding="async" (load)="ready.set(true)" (error)="failed.set(true)">
          }
          @if (failed()) {
            <div class="media-viewer__status" role="alert"><p>{{ video() ? copy.error : copy.imageError }}</p>
              @if (video()) { <button class="button-link button-link--mint mt-4" type="button" (click)="retry()">{{ copy.retry }}</button> }
            </div>
          } @else if (!ready()) {
            <div class="media-viewer__status media-viewer__status--loading" role="status"><span class="media-spinner" aria-hidden="true"></span><span>{{ copy.loading }}</span></div>
          }
        </div>
        <div class="gallery-lightbox__caption"><div><p class="eyebrow text-[#b8f2df]">{{ item().location }}</p>
          <h2 [id]="item().id + '-title'" class="mt-3 font-serif text-3xl text-white sm:text-4xl">{{ item().title }}</h2>
          <p class="mt-3 max-w-xl text-sm leading-6 text-white/60">{{ item().description }}</p>
          @if (video()) { <p class="mt-2 text-xs text-white/55">{{ copy.sound }}</p> }
        </div><button class="modal-close" type="button" (click)="closed.emit()" [attr.aria-label]="copy.close">×</button></div>
      </section>
    </app-dialog-shell>`
})
export class MediaViewerComponent {
  readonly item = input.required<GalleryItem>();
  readonly closed = output<void>();
  readonly copy = MEDIA_COPY;
  readonly ready = signal(false);
  readonly failed = signal(false);
  readonly video = computed(() => { const item = this.item(); return item.kind === 'video' ? item : null; });
  private readonly player = viewChild<ElementRef<HTMLVideoElement>>('player');
  constructor() {
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
