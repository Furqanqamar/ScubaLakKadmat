import { enquiryParams } from '../../data/enquiry-context';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { SERVICE_MOMENTS } from '../../data/media-stories';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MARINE_SERVICES } from '../../data/site-content';
import { SERVICE_HIGHLIGHT_ICONS, SERVICE_ICONS } from '../../data/dive-icons';
import { DiveIconComponent } from '../../common/components/dive-icon/dive-icon.component';
import { BOOKING_NOTES, DIVE_DAY, EXPERIENCE_PLANNING } from '../../data/experience-planning';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink, MediaStoryComponent, DiveIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-detail.component.html'
})
export class ServiceDetailComponent {
  readonly icons = SERVICE_ICONS;
  readonly highlightIcons = SERVICE_HIGHLIGHT_ICONS;
  readonly enquiryParams = enquiryParams;
  readonly mediaCopy = MEDIA_COPY;
  readonly booking = BOOKING_NOTES;
  readonly diveDay = DIVE_DAY;
  readonly planning = computed(() => EXPERIENCE_PLANNING[this.service()?.id ?? '']);
  readonly moments = computed(() => SERVICE_MOMENTS[this.service()?.id ?? ''] ?? []);
  private readonly route = inject(ActivatedRoute);
  private readonly routeParam = toSignal(this.route.paramMap, { initialValue: null });
  readonly service = computed(() => {
    const id = this.routeParam()?.get('serviceId');
    return MARINE_SERVICES.find((service) => service.id === id) ?? null;
  });
}
