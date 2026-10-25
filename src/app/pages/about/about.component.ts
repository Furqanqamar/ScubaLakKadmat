import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { BenefitsSectionComponent } from '../../common/components/benefits-section/benefits-section.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { ORIGINAL_MEDIA } from '../../data/original-media.generated';
import { ABOUT_MOMENTS } from '../../data/media-stories';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TEAM_MEMBERS, TEAM_STORY } from '../../data/site-content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ResponsiveImageDirective, MediaStoryComponent, BenefitsSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html'
})
export class AboutComponent {
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = ABOUT_MOMENTS;
  readonly cover = ORIGINAL_MEDIA['dive-centre-evening'];
  readonly team = TEAM_MEMBERS;
  readonly teamStory = TEAM_STORY;
}
