import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { MediaStoryComponent } from '../../common/components/media-story/media-story.component';
import { MEDIA_COPY } from '../../data/media-copy';
import { ISLAND_MOMENTS } from '../../data/media-stories';
import { RouterLink } from '@angular/router';

import { KADMAT_ATTRACTIONS, KADMAT_TRANSPORT } from '../../data/site-content';

@Component({
  selector: 'app-kadmat',
  standalone: true,
  imports: [RouterLink, ResponsiveImageDirective, MediaStoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kadmat.component.html'
})
export class KadmatComponent {
  readonly mediaCopy = MEDIA_COPY;
  readonly moments = ISLAND_MOMENTS;
  readonly attractions = KADMAT_ATTRACTIONS;
  readonly transportOptions = KADMAT_TRANSPORT;
}
