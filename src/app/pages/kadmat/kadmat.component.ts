import { TravelFaqComponent } from '../../common/components/travel-faq/travel-faq.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { ISLAND_MOMENTS } from '../../data/media-stories';
import { RouterLink } from '@angular/router';

import { KADMAT_ATTRACTIONS } from '../../data/site-content';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';

@Component({
  selector: 'app-kadmat',
  standalone: true,
  imports: [RouterLink, ResponsiveImageDirective, MediaStoryComponent, TravelFaqComponent, HeroWatermarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kadmat.component.html'
})
export class KadmatComponent {
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = ISLAND_MOMENTS;
  readonly attractions = KADMAT_ATTRACTIONS;
}
