import { UiIconComponent } from '../../common/components/ui-icon/ui-icon.component';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IslandCardComponent } from '../../common/components/island-card/island-card.component';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { islandGuide, islandIllustration, islandPhotograph, ISLAND_CATEGORY_LABELS, ISLAND_COPY } from '../../data/island-guides';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-island-guide',
  standalone: true,
  imports: [UiIconComponent, RouterLink, IslandCardComponent, ResponsiveImageDirective, NotFoundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './island-guide.component.html'
})
export class IslandGuideComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly island = computed(() => islandGuide(this.params().get('islandSlug')));
  readonly illustration = computed(() => {
    const island = this.island();
    return island ? islandIllustration(island.slug) : null;
  });
  readonly related = computed(() => (this.island()?.related ?? []).flatMap(slug => {
    const guide = islandGuide(slug);
    return guide ? [guide] : [];
  }));
  readonly sections = computed(() => (this.island()?.sections ?? []).map(section => ({ ...section, image: islandPhotograph(section.photo) })));
  readonly copy = ISLAND_COPY;
  readonly labels = ISLAND_CATEGORY_LABELS;
}
