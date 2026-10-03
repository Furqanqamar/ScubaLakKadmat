import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { DialogShellComponent } from '../../common/components/dialog-shell/dialog-shell.component';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import {
  DESTINATION_BRIEFINGS,
  GALLERY_ITEMS,
  MARINE_SERVICES,
  TESTIMONIALS,
  TOUR_PACKAGES
} from '../../data/site-content';
import {
  DestinationBriefing,
  PackageTier
} from '../../models/site-data.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink, ServiceCardComponent, DialogShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html'
})
export class HomeComponent {

  readonly services = MARINE_SERVICES;
  readonly packages = TOUR_PACKAGES;
  readonly briefings = DESTINATION_BRIEFINGS;
  readonly testimonials = TESTIMONIALS;
  readonly gallery = GALLERY_ITEMS.slice(0, 4);

  readonly activePackageId = signal<PackageTier>('budget');
  readonly activePackage = computed(() => this.packages.find((tourPackage) => tourPackage.id === this.activePackageId()) ?? this.packages[0]);
  readonly selectedBriefing = signal<DestinationBriefing | null>(null);

  setPackage(id: PackageTier): void {
    this.activePackageId.set(id);
  }


  openBriefing(briefing: DestinationBriefing): void {
    this.selectedBriefing.set(briefing);
  }

  closeOverview(): void {
    this.selectedBriefing.set(null);
  }

  startHeroVideo(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLVideoElement)) {
      return;
    }

    target.muted = true;
    void target.play().catch(() => undefined);
  }
}
