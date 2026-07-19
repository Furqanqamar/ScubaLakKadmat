import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KADMAT_ATTRACTIONS, KADMAT_TRANSPORT } from '../../data/site-content';

@Component({
  selector: 'app-kadmat',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kadmat.component.html'
})
export class KadmatComponent {
  readonly attractions = KADMAT_ATTRACTIONS;
  readonly transportOptions = KADMAT_TRANSPORT;
}
