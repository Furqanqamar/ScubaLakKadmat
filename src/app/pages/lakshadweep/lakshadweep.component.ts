import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ISLAND_GUIDES, ISLAND_COPY, ISLAND_FILTERS } from '../../data/island-guides';
import { IslandCategory } from '../../models/island-guide.model';
import { IslandCardComponent } from '../../common/components/island-card/island-card.component';
import { HeroWatermarkComponent } from '../../common/components/hero-watermark/hero-watermark.component';

@Component({
  selector: 'app-lakshadweep',
  standalone: true,
  imports: [RouterLink, IslandCardComponent, HeroWatermarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lakshadweep.component.html'
})
export class LakshadweepComponent {
  readonly copy = ISLAND_COPY;
  readonly filters = ISLAND_FILTERS;
  readonly activeFilter = signal<IslandCategory | 'all'>('all');
  readonly islands = computed(() => ISLAND_GUIDES.filter(island => this.activeFilter() === 'all' || island.category === this.activeFilter()));
}
