import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Shared with review links: inline SVG cannot turn into an iOS emoji. */
@Component({
  selector: 'app-arrow-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="448" height="512" fill="currentColor" aria-hidden="true" focusable="false">
      <!-- Font Awesome Free 6.7.2 by @fontawesome. Icons: CC BY 4.0. https://fontawesome.com/license/free -->
      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex: none; width: 1em; height: 1em; align-items: center; justify-content: center; line-height: 1; }
    svg { display: block; width: 100%; height: 100%; }
  `
})
export class ArrowIconComponent {}
