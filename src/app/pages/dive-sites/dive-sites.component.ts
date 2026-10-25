import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiveSiteCollectionComponent } from '../../common/components/dive-site-collection/dive-site-collection.component';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { KADMAT_COPY } from '../../data/kadmat-diving';
import { ORIGINAL_MEDIA } from '../../data/original-media.generated';

@Component({
  selector: 'app-dive-sites', standalone: true,
  imports: [RouterLink, DiveSiteCollectionComponent, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" tabindex="-1" class="page-surface">
      <section class="kadmat-photo-hero">
        <img [src]="cover.imageUrl" [appResponsiveImage]="cover.imageUrl" [width]="cover.width" [height]="cover.height" sizes="100vw" alt="" loading="eager" fetchpriority="high" decoding="async">
        <div class="kadmat-photo-hero__content kadmat-inner"><p class="eyebrow">{{ copy.eyebrow }}</p><h1>{{ copy.title }}<br><em>{{ copy.emphasis }}</em></h1><p>{{ copy.introduction }}</p><div class="kadmat-photo-hero__actions"><a class="button-link button-link--mint" routerLink="/contact" fragment="enquiry" [queryParams]="{ interest: 'diving' }">{{ copy.ask }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a><a class="kadmat-text-link" routerLink="/kadmat">{{ copy.back }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div><small>{{ copy.photoCaption }}</small></div>
      </section>
      <app-dive-site-collection [preview]="false" />
      <section class="kadmat-invitation"><div class="kadmat-inner"><h2>{{ copy.closingTitle }}</h2><p>{{ copy.closingIntro }}</p><a class="button-link button-link--dark" routerLink="/contact" fragment="enquiry" [queryParams]="{ interest: 'diving' }">{{ copy.ask }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div></section>
    </main>
  `
})
export class DiveSitesComponent {
  readonly copy = KADMAT_COPY.sitePage;
  readonly cover = ORIGINAL_MEDIA['way-to-the-reef'];
}
