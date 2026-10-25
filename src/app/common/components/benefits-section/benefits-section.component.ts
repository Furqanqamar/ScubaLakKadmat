import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BENEFITS_COPY, SITE_BENEFITS } from '../../../data/site-benefits';
import { DiveIconComponent } from '../dive-icon/dive-icon.component';

@Component({
  selector: 'app-benefits-section', standalone: true, imports: [RouterLink, DiveIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="benefits-section" [class.benefits-section--detailed]="detailed()" [id]="detailed() ? 'benefits' : 'our-benefits'" [attr.aria-labelledby]="titleId()">
      <div class="benefits-section__inner">
        <div class="benefits-section__heading">
          <div><p class="eyebrow">{{ heading().eyebrow }}</p><h2 [id]="titleId()">{{ heading().title }} <em>{{ heading().emphasis }}</em></h2></div>
          <p class="benefits-section__introduction">{{ heading().introduction }}</p>
        </div>
        <div class="benefits-section__grid">
          @for (benefit of benefits; track benefit.id; let index = $index) {
            <article class="benefit-item" [id]="detailed() ? benefit.id : 'summary-' + benefit.id">
              <div class="benefit-item__marker"><app-dive-icon [name]="benefit.icon" [context]="detailed() ? 'benefit-detail' : 'benefit'" /><span aria-hidden="true">0{{ index + 1 }}</span></div>
              <h3>{{ benefit.title }}</h3><p>{{ detailed() ? benefit.description : benefit.summary }}</p>
            </article>
          }
        </div>
        <div class="benefits-section__closing">
          @if (!detailed()) { <a routerLink="/about" fragment="benefits">{{ copy.readMore }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a> }
          @else { <p>{{ copy.note }}</p> }
        </div>
      </div>
    </section>` ,
  styleUrl: '../../../../styles/benefits.css'
})
export class BenefitsSectionComponent {
  readonly detailed = input(false);
  readonly benefits = SITE_BENEFITS;
  readonly copy = BENEFITS_COPY;
  readonly heading = computed(() => this.detailed() ? this.copy.about : this.copy.home);
  readonly titleId = computed(() => this.detailed() ? 'benefits-about-title' : 'benefits-home-title');
}
