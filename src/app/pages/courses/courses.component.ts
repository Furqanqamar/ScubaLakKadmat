import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PADI_COURSES } from '../../data/site-content';
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
  readonly icons = COURSE_ICONS;
  readonly courses = PADI_COURSES;
  readonly categories: readonly ('All' | CourseCategory)[] = [
    'All', 'Beginner certifications', 'Continuing education', 'First aid & safety', 'Specialty diver courses', 'Professional development', 'Youth & introductory'
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
