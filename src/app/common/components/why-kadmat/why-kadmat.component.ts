import { UiIconComponent } from '../ui-icon/ui-icon.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KADMAT_COPY, KADMAT_REASONS } from '../../../data/kadmat-diving';
import { ORIGINAL_MEDIA } from '../../../data/original-media.generated';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';
import { DiveIconComponent } from '../dive-icon/dive-icon.component';

@Component({
  selector: 'app-why-kadmat', standalone: true,
  imports: [UiIconComponent, RouterLink, ResponsiveImageDirective, DiveIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="why-kadmat" class="kadmat-why" aria-labelledby="why-kadmat-title">
      <div class="kadmat-inner">
        <div class="kadmat-heading"><div><p class="eyebrow">{{ copy.eyebrow }}</p><h2 id="why-kadmat-title">{{ copy.title }} <em>{{ copy.emphasis }}</em></h2></div><p>{{ copy.introduction }}</p></div>
        <div class="kadmat-why__layout">
          <figure class="kadmat-why__photo"><img [src]="photo.imageUrl" [appResponsiveImage]="photo.imageUrl" [width]="photo.width" [height]="photo.height" sizes="(max-width: 767px) 100vw, 45vw" [alt]="photo.description" loading="eager" decoding="async"><figcaption>{{ copy.imageCaption }}</figcaption></figure>
          <div class="kadmat-why__reasons">@for (reason of reasons; track reason.id) { <article class="kadmat-reason"><app-dive-icon [name]="reason.icon" context="benefit" /><h3>{{ reason.title }}</h3><p>{{ reason.text }}</p></article> }</div>
        </div>
        <div class="kadmat-why__closing"><p>{{ copy.note }}</p>@if (showLink()) { <a routerLink="/kadmat">{{ copy.link }}<i appIcon="arrow-right" class="fa-solid fa-arrow-right" aria-hidden="true"></i></a> }</div>
      </div>
    </section>
  `
})
export class WhyKadmatComponent {
  readonly showLink = input(true);
  readonly copy = KADMAT_COPY.why;
  readonly reasons = KADMAT_REASONS;
  readonly photo = ORIGINAL_MEDIA['dive-centre-evening'];
}
