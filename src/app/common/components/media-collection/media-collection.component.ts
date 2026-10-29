import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { GalleryItem } from '../../../models/site-data.model';
import { MEDIA_COPY } from '../../../data/media-copy';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';
import { MediaViewerComponent } from '../media-viewer/media-viewer.component';
import { ArrowIconComponent } from '../arrow-icon/arrow-icon.component';

@Component({
  selector: 'app-media-collection', standalone: true,
  imports: [ResponsiveImageDirective, MediaViewerComponent, ArrowIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="media-collection" [class.media-collection--gallery]="galleryLayout()">
      @for (item of items(); track item.id) {
        <button [id]="item.id" class="gallery-card" [class.gallery-card--wide]="galleryLayout() && item.size === 'wide'"
          [class.gallery-card--tall]="item.size === 'tall'" type="button" (click)="selected.set(item)"
          [attr.aria-label]="(item.kind === 'video' ? copy.play : copy.open) + ': ' + item.title">
          <img [appResponsiveImage]="item.imageUrl" [src]="item.imageUrl" [alt]="item.title"
            [sizes]="galleryLayout() && item.size === 'wide' ? '(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 50vw' : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'"
            [width]="item.width ?? 1200" [height]="item.height ?? 800" loading="lazy" decoding="async">
          <span class="gallery-card__veil"></span>
          @if (item.kind === 'video') {
            <span class="media-play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
            <span class="media-duration">{{ item.durationLabel }}</span>
          }
          <span class="gallery-card__copy"><small>{{ item.location }}</small><strong>{{ item.title }}</strong><em aria-hidden="true"><app-arrow-icon /></em></span>
        </button>
      } @empty { <p class="media-empty" role="status">{{ copy.empty }}</p> }
    </div>
    @if (selected(); as item) { <app-media-viewer [item]="item" [items]="items()" [position]="selectedIndex() + 1" [total]="items().length" (previous)="move(-1)" (next)="move(1)" (closed)="selected.set(null)" /> }
  `
})
export class MediaCollectionComponent {
  readonly items = input.required<readonly GalleryItem[]>();
  readonly galleryLayout = input(false);
  readonly selected = signal<GalleryItem | null>(null);
  readonly selectedIndex = computed(() => this.items().findIndex(item => item.id === this.selected()?.id));
  readonly copy = MEDIA_COPY;
  move(delta: number): void {
    const items = this.items();
    if (items.length) this.selected.set(items[(this.selectedIndex() + delta + items.length) % items.length]);
  }
}
