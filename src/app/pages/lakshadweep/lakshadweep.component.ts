import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LAKSHADWEEP_ISLANDS } from '../../data/site-content';
import { SITE_COPY } from '../../data/site-copy';

@Component({
  selector: 'app-lakshadweep',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lakshadweep.component.html'
})
export class LakshadweepComponent {
  readonly copy = SITE_COPY;
  readonly islands = LAKSHADWEEP_ISLANDS;
}
