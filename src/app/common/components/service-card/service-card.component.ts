import { UiIconComponent } from '../ui-icon/ui-icon.component';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

import { SITE_COPY } from '../../../data/site-copy';
import { MarineService } from '../../../models/site-data.model';
import { SERVICE_ICONS } from '../../../data/dive-icons';
import { DiveIconComponent } from '../dive-icon/dive-icon.component';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [UiIconComponent, ResponsiveImageDirective, RouterLink, DiveIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="service-card relative isolate flex min-h-[23rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 p-6 text-white shadow-2xl shadow-black/10 sm:p-7" data-reveal>
      <img [appResponsiveImage]="service().imageUrl"
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 64px), (max-width: 1023px) calc(50vw - 40px), (max-width: 1279px) calc(50vw - 48px), (max-width: 1519px) calc(25vw - 32px), 348px"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        [src]="service().imageUrl"
        [alt]="service().title"
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,17,22,.16)_0%,rgba(3,17,22,.92)_92%)]"></div>
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(184,242,223,.2),transparent_33%)]"></div>

      <div class="service-card__header">
        <div class="service-icon" aria-hidden="true">
          <app-dive-icon [name]="icons[service().icon]" context="service" />
        </div>
        @if (service().badge; as badge) {
          <span class="rounded-full border border-[#b8f2df]/30 bg-[#061419]/85 px-3 py-1.5 font-mono text-label font-medium uppercase text-[#d6fff0]">{{ badge }}</span>
        }
      </div>

      <div class="mt-16">
        <p class="mb-3 font-mono text-label font-medium uppercase text-[#b8f2df]">{{ service().eyebrow }}</p>
        <h3 class="max-w-[12ch] font-serif text-3xl leading-[0.95] tracking-[-0.03em] sm:text-4xl">{{ service().title }}</h3>
        <p class="mt-4 max-w-sm text-sm leading-6 text-on-dark-secondary">{{ service().description }}</p>
      </div>

      <div class="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
        <div class="flex flex-wrap gap-3 font-mono text-caption uppercase text-on-dark-secondary">
          <span><strong class="mr-1 font-medium text-white/90">{{ service().depth }}</strong> {{ service().category === 'Course' ? 'limits' : service().category === 'Water sports' ? 'setting' : 'depth' }}</span>
          @if (service().duration) { <span class="hidden sm:inline"><strong class="mr-1 font-medium text-white/90">{{ service().duration }}</strong> outing</span> }
        </div>
        <a
          [routerLink]="['/experiences', service().id]"
          class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-control font-semibold transition hover:border-[#b8f2df] hover:bg-[#b8f2df] hover:text-[#061419] focus:outline-none focus:ring-2 focus:ring-[#b8f2df] focus:ring-offset-2 focus:ring-offset-[#061419]"
          [attr.aria-label]="'Explore ' + service().title"
        >
          {{ copy.actions.explore }} <i appIcon="location-arrow" class="fa-solid fa-location-arrow" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  `
})
export class ServiceCardComponent {
  readonly icons = SERVICE_ICONS;
  readonly copy = SITE_COPY;
  readonly service = input.required<MarineService>();
}
