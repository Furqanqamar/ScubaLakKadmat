import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { DialogShellComponent } from '../../common/components/dialog-shell/dialog-shell.component';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { GALLERY_ITEMS } from '../../data/site-content';
import { GalleryItem } from '../../models/site-data.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ResponsiveImageDirective, DialogShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html'
})
export class GalleryComponent {
  readonly items = GALLERY_ITEMS;
  readonly selectedItem = signal<GalleryItem | null>(null);

  open(item: GalleryItem): void {
    this.selectedItem.set(item);
  }

  close(): void {
    this.selectedItem.set(null);
  }
}
