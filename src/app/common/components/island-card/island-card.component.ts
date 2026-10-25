import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IslandGuide } from '../../../models/island-guide.model';
import { islandIllustration, ISLAND_CATEGORY_LABELS, ISLAND_COPY } from '../../../data/island-guides';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';

@Component({
  selector: 'app-island-card',
  standalone: true,
  imports: [RouterLink, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="island-guide-card" [routerLink]="['/lakshadweep', island().slug]">
      <div class="island-guide-card__art">
        <img [src]="image().src" [appResponsiveImage]="image().src" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          [width]="image().width" [height]="image().height" alt="" loading="lazy" decoding="async">
        <span class="island-guide-card__category">{{ labels[island().category] }}</span>
      </div>
      <div class="island-guide-card__copy">
        <p class="island-guide-card__region">{{ island().region }}</p>
        <h3>{{ island().name }}</h3>
        <p class="island-guide-card__summary">{{ island().summary }}</p>
        <span class="island-guide-card__link">{{ copy.readStory }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </div>
    </a>
  `
})
export class IslandCardComponent {
  readonly island = input.required<IslandGuide>();
  readonly image = computed(() => islandIllustration(this.island().slug));
  readonly copy = ISLAND_COPY;
  readonly labels = ISLAND_CATEGORY_LABELS;
}
