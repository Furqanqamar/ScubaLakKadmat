import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PADI_COURSES } from '../../data/site-content';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParam = toSignal(this.route.paramMap, { initialValue: null });
  readonly course = computed(() => {
    const id = this.routeParam()?.get('courseId');
    return PADI_COURSES.find((course) => course.id === id) ?? null;
  });
}
