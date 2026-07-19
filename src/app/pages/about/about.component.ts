import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COMPANY_MILESTONES, ABOUT_STATS, TEAM_MEMBERS, TESTIMONIALS } from '../../data/site-content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html'
})
export class AboutComponent {
  readonly team = TEAM_MEMBERS;
  readonly milestones = COMPANY_MILESTONES;
  readonly stats = ABOUT_STATS;
  readonly testimonials = TESTIMONIALS;
}
