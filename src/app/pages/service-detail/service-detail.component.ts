import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MARINE_SERVICES } from '../../data/site-content';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-detail.component.html'
})
export class ServiceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParam = toSignal(this.route.paramMap, { initialValue: null });
  readonly service = computed(() => {
    const id = this.routeParam()?.get('serviceId');
    return MARINE_SERVICES.find((service) => service.id === id) ?? null;
  });
}
