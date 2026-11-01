import { UiIconComponent } from '../ui-icon/ui-icon.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { enquiryParams } from '../../../data/enquiry-context';
import { ISLAND_MEDIA } from '../../../data/island-media.generated';
import { KADMAT_COPY, KADMAT_DIVE_SITES } from '../../../data/kadmat-diving';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';

@Component({
  selector: 'app-kadmat-dive-spots', standalone: true,
  imports: [UiIconComponent, RouterLink, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="dive-spots" class="kadmat-spots" aria-labelledby="kadmat-spots-title">
      <div class="kadmat-inner">
        <div class="kadmat-heading"><div><p class="eyebrow">{{ copy.eyebrow }}</p><h2 id="kadmat-spots-title">{{ copy.title }} <em>{{ copy.emphasis }}</em></h2></div><p>{{ copy.introduction }}</p></div>
        <div class="kadmat-spots__layout">
          <div class="kadmat-spots__island">
            <figure><img [src]="illustration.src" [appResponsiveImage]="illustration.src" [width]="illustration.width" [height]="illustration.height" sizes="(max-width: 767px) 100vw, 43vw" [alt]="copy.illustrationAlt" loading="lazy" decoding="async"><figcaption>{{ copy.graphicNote }}</figcaption></figure>
            <a class="kadmat-spots__island-link" routerLink="/lakshadweep">{{ copy.otherIslands }}<i appIcon="arrow-right" class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
          <div class="kadmat-spots__directory">
            <div class="kadmat-spots__list-heading"><h3>{{ copy.listTitle }}</h3><span>{{ sites.length }} {{ copy.siteCountLabel }}</span></div>
            <ol class="kadmat-spots__list" [style.--spot-rows]="columnRows">
              @for (site of sites; track site.id) {
                <li [id]="'spot-' + site.id"><span class="kadmat-spots__number" aria-hidden="true">{{ site.number.toString().padStart(2, '0') }}</span><span class="kadmat-spots__name">{{ site.name }}</span><a routerLink="/contact" fragment="enquiry" [queryParams]="enquiryParams('dive-site', site.id)" [attr.aria-label]="copy.askLabel + ' ' + site.name"><i appIcon="arrow-right" class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></li>
              }
            </ol>
            <div class="kadmat-spots__closing"><p>{{ copy.planningNote }}</p><a class="button-link button-link--mint" routerLink="/contact" fragment="enquiry" [queryParams]="{ interest: 'diving' }">{{ copy.planDive }}<i appIcon="arrow-right" class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class KadmatDiveSpotsComponent {
  readonly copy = KADMAT_COPY.spots;
  readonly sites = KADMAT_DIVE_SITES;
  readonly illustration = ISLAND_MEDIA['kadmat'];
  readonly columnRows = Math.ceil(this.sites.length / 2);
  readonly enquiryParams = enquiryParams;
}
