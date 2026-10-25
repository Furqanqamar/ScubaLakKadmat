import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MARINE_SERVICES } from '../../data/site-content';
import { KADMAT_COPY } from '../../data/kadmat-diving';
import { TRAINING_MOMENTS } from '../../data/media-stories';
import { MEDIA_COPY } from '../../data/media-copy';

@Component({
  selector: 'app-services', standalone: true,
  imports: [RouterLink, ServiceCardComponent, HeroWatermarkComponent, MediaStoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  readonly services = MARINE_SERVICES;
  readonly copy = KADMAT_COPY.experiences;
  readonly moments = TRAINING_MOMENTS;
  readonly mediaCopy = MEDIA_COPY;
}
