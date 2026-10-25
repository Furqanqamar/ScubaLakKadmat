import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiveSiteCollectionComponent } from '../../common/components/dive-site-collection/dive-site-collection.component';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import { TravelFaqComponent } from '../../common/components/travel-faq/travel-faq.component';
import { WhyKadmatComponent } from '../../common/components/why-kadmat/why-kadmat.component';
import { KADMAT_COPY } from '../../data/kadmat-diving';
import { MEDIA_COPY } from '../../data/media-copy';
import { ISLAND_MOMENTS } from '../../data/media-stories';
import { MARINE_SERVICES } from '../../data/site-content';

@Component({
  selector: 'app-kadmat', standalone: true,
  imports: [RouterLink, DiveSiteCollectionComponent, WhyKadmatComponent, ServiceCardComponent, MediaStoryComponent, TravelFaqComponent, HeroWatermarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kadmat.component.html'
})
export class KadmatComponent {
  readonly copy = KADMAT_COPY.kadmatPage;
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = ISLAND_MOMENTS;
  readonly services = MARINE_SERVICES;
}
