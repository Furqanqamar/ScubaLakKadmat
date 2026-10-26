import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { BenefitsSectionComponent } from '../../common/components/benefits-section/benefits-section.component';
import { GuestReviewsComponent } from '../../common/components/guest-reviews/guest-reviews.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { ORIGINAL_MEDIA } from '../../data/original-media.generated';
import { ABOUT_MOMENTS } from '../../data/media-stories';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TEAM_MEMBERS, TEAM_STORY } from '../../data/site-content';
import { KADMAT_COPY } from '../../data/kadmat-diving';
import portraitPresentation from '../../data/team-portrait-presentation.json';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ResponsiveImageDirective, MediaStoryComponent, BenefitsSectionComponent, GuestReviewsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html'
})
export class AboutComponent {
  readonly copy = KADMAT_COPY.about;
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = ABOUT_MOMENTS;
  readonly cover = ORIGINAL_MEDIA['dive-centre-evening'];
  // Presentation-only adjustments; supplied photo files and identities stay intact.
  readonly team = TEAM_MEMBERS.map(member => ({
    ...member,
    portrait: portraitPresentation[member.id as keyof typeof portraitPresentation]
      ?? { scale: 1, origin: '50% 50%', brightness: 1, contrast: 1, saturation: 1 }
  }));
  readonly teamStory = TEAM_STORY;
}
