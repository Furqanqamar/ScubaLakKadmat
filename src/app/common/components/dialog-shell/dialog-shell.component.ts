import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, output, viewChild } from '@angular/core';

/** Native modal semantics provide focus containment, Escape and focus restoration. */
@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog #dialog [attr.aria-labelledby]="labelledBy()" (cancel)="closed.emit()" (click)="onBackdrop($event)"><ng-content /></dialog>`,
  styles: `dialog { width: min(70rem, calc(100% - 2rem)); max-height: calc(100dvh - 2rem); margin: auto; padding: 0; border: 0; border-radius: 1.5rem; background: var(--deep); color: white; overflow: auto; } dialog::backdrop { background: rgb(3 17 22 / .85); backdrop-filter: blur(8px); }`
})
export class DialogShellComponent {
  readonly labelledBy = input.required<string>();
  readonly closed = output<void>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  constructor() {
    afterNextRender(() => {
      this.dialog().nativeElement.showModal();
      this.document.documentElement.classList.add('dialog-open');
    });
    inject(DestroyRef).onDestroy(() => {
      this.dialog().nativeElement.close();
      this.document.documentElement.classList.remove('dialog-open');
    });
  }
  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
