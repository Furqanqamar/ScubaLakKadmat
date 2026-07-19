import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import { MARINE_SERVICES } from '../../data/site-content';
import { MarineService } from '../../models/site-data.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  private readonly router = inject(Router);
  readonly services = MARINE_SERVICES;

  openService(service: MarineService): void {
    void this.router.navigate(['/experiences', service.id]);
  }
}
