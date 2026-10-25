import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import { MARINE_SERVICES } from '../../data/site-content';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceCardComponent, HeroWatermarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  readonly services = MARINE_SERVICES;

}
