import { enquiryParams } from '../../data/enquiry-context';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { TRAINING_MOMENTS } from '../../data/media-stories';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PADI_COURSES, RELATED_COURSE_IDS } from '../../data/site-content';
import { COURSE_ICONS } from '../../data/dive-icons';
import { DiveIconComponent } from '../../common/components/dive-icon/dive-icon.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink, MediaStoryComponent, DiveIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent {
  readonly icons = COURSE_ICONS;
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
  readonly relatedCourses = computed(() => {
    const ids = RELATED_COURSE_IDS[this.course()?.id ?? ''] ?? [];
    return ids.flatMap(id => {
      const course = PADI_COURSES.find(item => item.id === id);
      return course ? [course] : [];
    });
  });
}
