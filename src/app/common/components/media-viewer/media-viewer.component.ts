import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, computed, effect, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { GalleryItem } from '../../../models/site-data.model';
import { MEDIA_COPY } from '../../../data/media-copy';
import { DialogShellComponent } from '../dialog-shell/dialog-shell.component';
import { MediaViewerSlideComponent } from './media-viewer-slide.component';

export const MEDIA_SLIDE_MS = 360;
type Direction = -1 | 1;

@Component({
  selector: 'app-media-viewer', standalone: true,
  imports: [DialogShellComponent, MediaViewerSlideComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog-shell [fitViewport]="true" [labelledBy]="item().id + '-title'" (closed)="closed.emit()" (keyPressed)="onKeydown($event)">
      <section class="gallery-lightbox__panel">
        <div class="media-viewer__toolbar"><div class="flex items-center gap-3"><button class="modal-close" type="button" [disabled]="total() < 2 || settling()" (click)="navigate(-1)" [attr.aria-label]="copy.previous">←</button><span aria-live="polite">{{ position() }} {{ copy.of }} {{ total() }}</span><button class="modal-close" type="button" [disabled]="total() < 2 || settling()" (click)="navigate(1)" [attr.aria-label]="copy.next">→</button></div><button class="modal-close" type="button" (click)="closed.emit()" [attr.aria-label]="copy.close">×</button></div>
        <div #stage class="media-viewer__stage" [class.media-viewer__stage--settling]="settling()"
          (touchstart)="touchStart($event)" (touchmove)="touchMove($event)" (touchend)="touchEnd($event)" (touchcancel)="touchCancel()">
          @for (slide of slides(); track slide.id) {
            <app-media-viewer-slide class="media-viewer__slide" [item]="slide" [active]="slide.id === item().id"
              [leaving]="slide.id === item().id && settling() && committing()"
              [style.transform]="slideTransform(slide.id)" [attr.aria-hidden]="slide.id !== item().id ? 'true' : null"
              [attr.inert]="slide.id !== item().id ? '' : null" />
          }
          @if (total() > 1 && !hasNavigated()) {
            <div class="media-viewer__gesture-hint" aria-hidden="true">
              <svg viewBox="0 0 88 36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path class="media-viewer__gesture-arrows" d="m12 13-5 5 5 5m64-10 5 5-5 5" />
                <g class="media-viewer__gesture-hand"><path d="M37 19V9a3 3 0 0 1 6 0v7-2a3 3 0 0 1 6 0v2a3 3 0 0 1 6 0v7c0 6-4 10-10 10h-1c-3 0-5-1-7-4l-6-8a3 3 0 0 1 4-4l4 4" /></g>
              </svg>
            </div>
            <span class="sr-only">{{ copy.swipe }}</span>
          }
        </div>
        <div class="gallery-lightbox__caption" role="region" tabindex="0" [attr.aria-labelledby]="item().id + '-title'"><div><p class="eyebrow text-[#b8f2df]">{{ item().location }}</p>
          <h2 [id]="item().id + '-title'" class="mt-3 font-serif text-3xl text-white sm:text-4xl">{{ item().title }}</h2>
          <p class="mt-3 max-w-xl text-sm leading-6 text-on-dark-secondary">{{ item().description }}</p>
          @if (item().kind === 'video') { <p class="mt-2 text-caption text-on-dark-secondary">{{ copy.sound }}</p> }
        </div></div>
      </section>
    </app-dialog-shell>`
})
export class MediaViewerComponent {
  readonly item = input.required<GalleryItem>();
  readonly items = input.required<readonly GalleryItem[]>();
  readonly closed = output<void>();
  readonly previous = output<void>();
  readonly next = output<void>();
  readonly position = input(1);
  readonly total = input(1);
  readonly copy = MEDIA_COPY;
  readonly companion = signal<GalleryItem | null>(null);
  readonly direction = signal<Direction>(1);
  readonly offset = signal(0);
  readonly settling = signal(false);
  readonly committing = signal(false);
  readonly hasNavigated = signal(false);
  readonly slides = computed(() => { const other = this.companion(); return other ? [this.item(), other] : [this.item()]; });
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private touch: { id: number; x: number; y: number; width: number; itemId: string } | null = null;
  private timer = 0;
  private frames: number[] = [];
  private pendingRender: { destroy(): void } | null = null;

  constructor() {
    effect(() => { this.item(); untracked(() => this.reset()); });
    inject(DestroyRef).onDestroy(() => this.clearScheduled());
  }

  slideTransform(id: string): string {
    const resting = id === this.item().id ? 0 : this.direction() * 100;
    return `translate3d(${resting + this.offset()}%, 0, 0)`;
  }

  navigate(direction: Direction): void {
    if (this.total() < 2 || this.settling()) return;
    this.hasNavigated.set(true);
    const items = this.items(), index = items.findIndex(item => item.id === this.item().id);
    const other = items[(index + direction + items.length) % items.length];
    if (!other || other.id === this.item().id) return;
    this.direction.set(direction);
    this.companion.set(other);
    if (this.reducedMotion()) { this.emitMove(direction); this.reset(); return; }
    this.settling.set(true);
    this.committing.set(true);
    // Paint both neighbours before moving them together. Keyed nodes preserve
    // the outgoing video's last frame instead of jumping back to its poster.
    this.pendingRender = afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) { this.emitMove(direction); this.reset(); return; }
      this.frames.push(view.requestAnimationFrame(() => {
        this.frames.push(view.requestAnimationFrame(() => {
          this.offset.set(-direction * 100);
          this.timer = view.setTimeout(() => { this.emitMove(direction); this.reset(); }, MEDIA_SLIDE_MS);
        }));
      }));
    }, { injector: this.injector });
  }

  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (['VIDEO', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable || this.total() < 2) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); this.navigate(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); this.navigate(1); }
  }

  touchStart(event: TouchEvent): void {
    const point = event.touches[0], target = event.target as Element | null;
    const video = target?.closest?.('video');
    // Keep native transport/scrubber gestures; swipes on the film itself work
    // like photos. Ordinary taps and vertical scrolling remain native too.
    const onControls = point && video && point.clientY >= video.getBoundingClientRect().bottom - 64;
    const interactive = target?.closest?.('button, a, input, textarea, select');
    const width = this.stage()?.nativeElement.getBoundingClientRect().width ?? 0;
    this.touch = this.total() > 1 && !this.settling() && !onControls && !interactive && event.touches.length === 1 && point && width
      ? { id: point.identifier, x: point.clientX, y: point.clientY, width, itemId: this.item().id } : null;
  }

  touchMove(event: TouchEvent): void {
    const start = this.touch;
    if (!start) return;
    const point = Array.from(event.touches).find(touch => touch.identifier === start.id);
    if (event.touches.length !== 1 || !point) { this.touchCancel(); return; }
    const x = point.clientX - start.x, y = point.clientY - start.y;
    if (Math.abs(y) > 16 && Math.abs(y) > Math.abs(x) * 1.2) { this.touchCancel(); return; }
    if (Math.abs(x) < 8 || Math.abs(x) <= Math.abs(y) * 1.2) return;
    if (event.cancelable) event.preventDefault();
    if (this.reducedMotion()) return;
    const direction: Direction = x < 0 ? 1 : -1;
    const items = this.items(), index = items.findIndex(item => item.id === start.itemId);
    this.direction.set(direction);
    this.companion.set(items[(index + direction + items.length) % items.length] ?? null);
    this.offset.set(Math.max(-100, Math.min(100, x / start.width * 100)));
  }

  touchEnd(event: TouchEvent): void {
    const start = this.touch;
    this.touch = null;
    if (!start || this.total() < 2 || event.touches.length || start.itemId !== this.item().id) { this.snapBack(); return; }
    const point = Array.from(event.changedTouches).find(touch => touch.identifier === start.id);
    if (!point) { this.snapBack(); return; }
    const x = point.clientX - start.x, y = point.clientY - start.y;
    if (Math.abs(x) >= 48 && Math.abs(x) > Math.abs(y) * 1.4) this.navigate(x < 0 ? 1 : -1);
    else this.snapBack();
  }

  touchCancel(): void { this.touch = null; this.snapBack(); }

  private snapBack(): void {
    if (this.settling() || !this.companion()) return;
    if (this.reducedMotion()) { this.reset(); return; }
    this.settling.set(true);
    this.committing.set(false);
    this.offset.set(0);
    this.timer = this.document.defaultView?.setTimeout(() => this.reset(), MEDIA_SLIDE_MS) ?? 0;
  }

  private emitMove(direction: Direction): void { (direction > 0 ? this.next : this.previous).emit(); }
  private reducedMotion(): boolean { return this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? true; }
  private reset(): void {
    this.clearScheduled(); this.touch = null;
    this.companion.set(null); this.offset.set(0); this.settling.set(false); this.committing.set(false);
  }
  private clearScheduled(): void {
    const view = this.document.defaultView;
    if (this.timer) view?.clearTimeout(this.timer);
    this.frames.forEach(frame => view?.cancelAnimationFrame(frame));
    this.pendingRender?.destroy(); this.pendingRender = null;
    this.timer = 0; this.frames = [];
  }
}
