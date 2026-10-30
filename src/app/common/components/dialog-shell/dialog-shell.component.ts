import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OverlayStateService } from '../../services/overlay-state.service';

/** Native modal semantics provide focus containment, Escape and focus restoration. */
@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog #dialog [class.dialog--fit-viewport]="fitViewport()" [attr.aria-labelledby]="labelledBy()" (cancel)="onCancel($event)" (click)="onBackdrop($event)" (keydown)="keyPressed.emit($event)"><ng-content /></dialog>`,
  styles: `dialog { width: min(70rem, calc(100% - 2rem)); max-height: calc(100dvh - 2rem); margin: auto; padding: 0; border: 0; border-radius: 1.5rem; background: var(--deep); color: white; overflow: auto; } dialog.dialog--fit-viewport { height: calc(100dvh - 2rem); overflow: hidden; } dialog::backdrop { background: rgb(3 17 22 / .85); backdrop-filter: blur(8px); }`
})
export class DialogShellComponent {
  readonly labelledBy = input.required<string>();
  readonly fitViewport = input(false);
  readonly closed = output<void>();
  readonly keyPressed = output<KeyboardEvent>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  constructor() {
    const overlays = inject(OverlayStateService);
    const destroyRef = inject(DestroyRef);
    let release: (() => void) | undefined;
    let previousFocus: HTMLElement | null = null;
    afterNextRender(() => {
      previousFocus = this.document.activeElement as HTMLElement | null;
      this.dialog().nativeElement.showModal();
      release = overlays.acquire();
    });
    inject(Router).events.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => { if (event instanceof NavigationStart) this.closed.emit(); });
    destroyRef.onDestroy(() => {
      this.dialog().nativeElement.close();
      release?.();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    });
  }
  onCancel(event: Event): void { event.preventDefault(); this.closed.emit(); }
  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
