import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-interactive-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="interactive-cursor" aria-hidden="true">
      <span class="interactive-cursor__ring" [class.interactive-cursor__ring--active]="isInteractive()" [style.left.px]="cursorX()" [style.top.px]="cursorY()"></span>
      <span class="interactive-cursor__dot" [style.left.px]="cursorX()" [style.top.px]="cursorY()"></span>
    </span>
  `,
  styles: `
    :host { display: block; }
    .interactive-cursor { position: fixed; inset: 0; z-index: 100; pointer-events: none; }
    .interactive-cursor__dot, .interactive-cursor__ring { position: fixed; top: -3rem; left: -3rem; pointer-events: none; }
    .interactive-cursor__dot { width: .45rem; height: .45rem; transform: translate(-50%, -50%); border-radius: 999px; background: #b8f2df; box-shadow: 0 0 .9rem rgba(184,242,223,.65); transition: transform .18s ease, opacity .18s ease; }
    .interactive-cursor__ring { width: 2rem; height: 2rem; transform: translate(-50%, -50%); border: 1px solid rgba(214,255,240,.75); border-radius: 999px; opacity: .72; transition: width .32s cubic-bezier(.2,.8,.2,1), height .32s cubic-bezier(.2,.8,.2,1), border-color .24s ease, background .24s ease, opacity .24s ease, left .16s ease-out, top .16s ease-out; }
    .interactive-cursor__ring--active { width: 3.8rem; height: 3.8rem; border-color: rgba(184,242,223,.9); background: rgba(184,242,223,.08); opacity: 1; }
    @media (pointer: coarse), (prefers-reduced-motion: reduce) { :host { display: none; } }
  `
})
export class InteractiveCursorComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly cursorX = signal(-100);
  readonly cursorY = signal(-100);
  readonly isInteractive = signal(false);

  constructor() {
    const view = this.document.defaultView;
    if (!view || !view.matchMedia('(pointer: fine)').matches || view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.document.body?.classList.add('custom-cursor-enabled');

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }
      this.cursorX.set(event.clientX);
      this.cursorY.set(event.clientY);
    };
    const handlePointerOver = (event: PointerEvent): void => {
      const target = this.closestInteractive(event.target);
      if (!target) {
        return;
      }
      this.isInteractive.set(true);
    };
    const handlePointerOut = (event: PointerEvent): void => {
      const current = this.closestInteractive(event.target);
      const next = this.closestInteractive(event.relatedTarget);
      if (current && current === next) {
        return;
      }
      this.isInteractive.set(false);
    };

    view.addEventListener('pointermove', handlePointerMove, { passive: true });
    this.document.addEventListener('pointerover', handlePointerOver, { passive: true });
    this.document.addEventListener('pointerout', handlePointerOut, { passive: true });

    this.destroyRef.onDestroy(() => {
      view.removeEventListener('pointermove', handlePointerMove);
      this.document.removeEventListener('pointerover', handlePointerOver);
      this.document.removeEventListener('pointerout', handlePointerOut);
      this.document.body?.classList.remove('custom-cursor-enabled');
    });
  }

  private closestInteractive(target: EventTarget | null): Element | null {
    if (!target || typeof (target as Element).closest !== 'function') {
      return null;
    }

    return (target as Element).closest('[data-cursor], a, button, input, select, textarea, [role="button"]');
  }
}
