import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LAKSHADWEEP_ISLANDS } from '../../data/site-content';

@Component({
  selector: 'app-lakshadweep',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lakshadweep.component.html'
})
export class LakshadweepComponent {
  readonly islands = LAKSHADWEEP_ISLANDS;
}
