import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackgroundVideoComponent } from '../../common/components/background-video/background-video.component';
import { GuestReviewsComponent } from '../../common/components/guest-reviews/guest-reviews.component';
import { ServiceCardComponent } from '../../common/components/service-card/service-card.component';
import { WhyKadmatComponent } from '../../common/components/why-kadmat/why-kadmat.component';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ACCOMMODATION_INFO } from '../../data/accommodation-info';
import { KADMAT_COPY, KADMAT_DIVE_SITES } from '../../data/kadmat-diving';
import { GALLERY_ITEMS, MARINE_SERVICES } from '../../data/site-content';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BackgroundVideoComponent, GuestReviewsComponent, WhyKadmatComponent, ResponsiveImageDirective, RouterLink, ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly copy = KADMAT_COPY.home;
  readonly accommodation = ACCOMMODATION_INFO;
  readonly siteCount = KADMAT_DIVE_SITES.length;
  readonly services = MARINE_SERVICES;
  readonly gallery = GALLERY_ITEMS.filter(item => ['guided-group-dive', 'reef-diver-coral', 'coral-and-light', 'kadmat-beach'].includes(item.id));
}
