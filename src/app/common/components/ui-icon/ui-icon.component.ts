import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UI_ICONS } from '../../../data/ui-icons.generated';

@Component({
  selector: 'i[appIcon]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', 'class': 'ui-icon' },
  template: `@if (icon(); as icon) { <svg [attr.viewBox]="icon.viewBox" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">@for (path of icon.paths; track $index) { <path [attr.d]="path" /> }</svg> }`,
  styles: `:host { display: inline-flex; width: 1em; height: 1em; flex: none; align-items: center; justify-content: center; vertical-align: -.125em; font-style: normal; line-height: 1; } svg { display: block; width: 100%; height: 100%; overflow: visible; }`
})
export class UiIconComponent {
  readonly appIcon = input.required<string>();
  readonly icon = computed(() => UI_ICONS[this.appIcon().replace(/^.*fa-/, '')]);
}
