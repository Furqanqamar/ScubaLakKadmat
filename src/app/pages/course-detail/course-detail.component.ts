import { enquiryParams } from '../../data/enquiry-context';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { TRAINING_MOMENTS } from '../../data/media-stories';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PADI_COURSES } from '../../data/site-content';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink, MediaStoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent {
  readonly enquiryParams = enquiryParams;
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = TRAINING_MOMENTS;
  readonly showTraining = computed(() => ['scuba-diver', 'open-water-diver', 'discover-scuba-diving'].includes(this.course()?.id ?? ''));
  private readonly route = inject(ActivatedRoute);
  private readonly routeParam = toSignal(this.route.paramMap, { initialValue: null });
  readonly course = computed(() => {
    const id = this.routeParam()?.get('courseId');
    return PADI_COURSES.find((course) => course.id === id) ?? null;
  });
}
