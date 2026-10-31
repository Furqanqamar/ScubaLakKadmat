import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DIVE_ICONS, DIVE_ICON_STYLE } from '../../../data/dive-icons';
import type { DiveIconContext, DiveIconName, DiveIconPath } from '../../../models/dive-icon.model';

@Component({
  selector: 'app-dive-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[attr.data-dive-icon]': 'name()', '[attr.data-icon-context]': 'context()' },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="style.viewBox" width="80" height="80" fill="none" stroke="currentColor" [attr.stroke-width]="style.strokeWidth" [attr.stroke-linecap]="style.linecap" [attr.stroke-linejoin]="style.linejoin" aria-hidden="true" focusable="false">
      @for (path of paths(); track $index) { <path [attr.d]="path.d" [attr.transform]="path.transform" /> }
    </svg>
  `,
  styleUrl: '../../../../styles/dive-icons.css'
})
export class DiveIconComponent {
  readonly style = DIVE_ICON_STYLE;
  readonly name = input.required<DiveIconName>();
  /** Layout role; responsive dimensions and optical strokes live in the shared CSS. */
  readonly context = input<DiveIconContext>('inline');
  readonly paths = computed<readonly DiveIconPath[]>(() => DIVE_ICONS[this.name()]);
}
