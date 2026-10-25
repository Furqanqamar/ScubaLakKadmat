import { MediaCollectionComponent } from '../../common/components/media-collection/media-collection.component';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ADDITIONAL_MEDIA } from '../../data/additional-media.generated';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { GALLERY_ITEMS } from '../../data/site-content';
import { MediaCategory } from '../../models/site-data.model';
import { MEDIA_COPY } from '../../data/media-copy';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [MediaCollectionComponent, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html'
})
export class GalleryComponent {
  readonly items = GALLERY_ITEMS;
  readonly cover = ADDITIONAL_MEDIA['coral-and-light'];
  readonly copy = MEDIA_COPY;
  readonly categories: readonly ('All moments' | MediaCategory)[] = ['All moments', 'Diving & training', 'Island life', 'Island journeys', 'Team', 'Reef & island views'];
  readonly category = signal<'All moments' | MediaCategory>('All moments');
  readonly type = signal<'all' | 'image' | 'video'>('all');
  readonly filteredItems = computed(() => this.items.filter(item =>
    (this.category() === 'All moments' || (item.category ?? 'Reef & island views') === this.category()) &&
    (this.type() === 'all' || (item.kind ?? 'image') === this.type())
  ));
}
