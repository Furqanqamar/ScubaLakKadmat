import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PADI_COURSES } from '../../data/site-content';
import { SITE_COPY } from '../../data/site-copy';
import { KADMAT_COPY } from '../../data/kadmat-diving';
import { CourseCategory } from '../../models/site-data.model';
import { COURSE_ICONS } from '../../data/dive-icons';
import { DiveIconComponent } from '../../common/components/dive-icon/dive-icon.component';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink, DiveIconComponent, HeroWatermarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './courses.component.html'
})
export class CoursesComponent {
  readonly copy = KADMAT_COPY.courses;
  readonly icons = COURSE_ICONS;
  readonly courses = PADI_COURSES;
  readonly bookingNote = SITE_COPY.courseBookingNote;
  readonly categories: readonly ('All' | CourseCategory)[] = [
    'All', ...new Set(PADI_COURSES.map(course => course.category))
  ];
  readonly activeCategory = signal<'All' | CourseCategory>('All');
  readonly filteredCourses = computed(() => {
    const category = this.activeCategory();
    return category === 'All' ? this.courses : this.courses.filter((course) => course.category === category);
  });

  setCategory(category: 'All' | CourseCategory): void {
    this.activeCategory.set(category);
  }
}
