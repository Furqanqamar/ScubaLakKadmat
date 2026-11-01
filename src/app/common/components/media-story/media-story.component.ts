import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GalleryItem } from '../../../models/site-data.model';
import { MEDIA_COPY } from '../../../data/media-copy';
import { MediaCollectionComponent } from '../media-collection/media-collection.component';

@Component({
  selector: 'app-media-story', standalone: true, imports: [MediaCollectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="media-story">
      <div class="mx-auto max-w-[90rem]">
        <div class="media-story__heading"><div><p class="eyebrow text-accent">{{ copy.originalEyebrow }}</p>
          <h2 class="mt-5 max-w-2xl font-serif text-5xl leading-[0.96] tracking-[-0.045em] sm:text-6xl">{{ title() }}</h2></div>
          <p class="max-w-md text-sm leading-7 text-muted">{{ introduction() }}</p>
        </div>
        <app-media-collection [items]="items()" />
      </div>
    </section>`
})
export class MediaStoryComponent {
  readonly title = input.required<string>();
  readonly introduction = input.required<string>();
  readonly items = input.required<readonly GalleryItem[]>();
  readonly copy = MEDIA_COPY;
}
