import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, PLATFORM_ID, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, viewChild } from '@angular/core';
import { OverlayStateService } from '../../services/overlay-state.service';
import { createCursorMotion, CursorMotion } from './cursor-motion';

@Component({
  selector: 'app-interactive-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span #cursor class="interactive-cursor" [class.interactive-cursor--hidden]="overlays.active()" data-cursor-state="hidden" aria-hidden="true">
      <span #ring class="interactive-cursor__ring"></span>
      <span #dot class="interactive-cursor__dot"></span>
    </span>
  `,
  styles: `
    :host { display: block; }
    .interactive-cursor { position: fixed; inset: 0; z-index: 100; pointer-events: none; visibility: hidden; }
    .interactive-cursor[data-cursor-state="visible"] { visibility: visible; }
    .interactive-cursor--hidden { display: none; }
    .interactive-cursor__dot, .interactive-cursor__ring { position: absolute; top: 0; left: 0; pointer-events: none; border-radius: 50%; transform: translate3d(-100px,-100px,0) translate(-50%,-50%); }
    .interactive-cursor__dot { width: 6px; height: 6px; background: #fff; box-shadow: 0 0 0 1px rgb(6 20 25 / .45); }
    .interactive-cursor__ring { width: 32px; height: 32px; border: 1px solid #fff; opacity: .8; box-shadow: 0 0 0 1px rgb(6 20 25 / .3); transition: width .24s cubic-bezier(.2,.8,.2,1), height .24s cubic-bezier(.2,.8,.2,1), opacity .2s ease, background .2s ease; }
    .interactive-cursor[data-cursor-mode="interactive"] .interactive-cursor__ring { width: 48px; height: 48px; background: rgb(255 255 255 / .07); opacity: 1; }
    .interactive-cursor[data-cursor-pressed="true"] .interactive-cursor__ring { width: 24px; height: 24px; }
    @supports (mix-blend-mode: difference) {
      .interactive-cursor { mix-blend-mode: difference; }
      .interactive-cursor__dot, .interactive-cursor__ring { box-shadow: none; }
    }
    @media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) { :host { display: none; } }
  `
})
export class InteractiveCursorComponent {
  readonly overlays = inject(OverlayStateService);
  private readonly document = inject(DOCUMENT);
  private readonly cursor = viewChild.required<ElementRef<HTMLElement>>('cursor');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    let motion: CursorMotion | undefined;
    effect(() => { const active = this.overlays.active(); motion?.setSuspended(active); });
    const render = afterNextRender(() => {
      motion = createCursorMotion(this.document, { root: this.cursor().nativeElement, ring: this.ring().nativeElement, dot: this.dot().nativeElement });
      motion.setSuspended(this.overlays.active());
    });
    inject(DestroyRef).onDestroy(() => { render.destroy(); motion?.destroy(); });
  }
}
