import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

import { SITE_COPY } from '../../../data/site-copy';
import { MarineService } from '../../../models/site-data.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [ResponsiveImageDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="service-card group relative isolate flex min-h-[23rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 p-6 text-white shadow-2xl shadow-black/10 sm:p-7" data-cursor="view" data-reveal>
      <img [appResponsiveImage]="service().imageUrl"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
        [src]="service().imageUrl"
        [alt]="service().title"
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,17,22,.16)_0%,rgba(3,17,22,.92)_92%)]"></div>
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(184,242,223,.2),transparent_33%)]"></div>

      <div class="flex items-start justify-between gap-4">
        <div class="service-icon flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl text-[#d6fff0] backdrop-blur-md" aria-hidden="true">
          @switch (service().icon) {
            @case ('lagoon') { <i class="fa-solid fa-water"></i> }
            @case ('deep-sea') { <i class="fa-solid fa-fish"></i> }
            @case ('course') { <i class="fa-solid fa-certificate"></i> }
            @default { <i class="fa-solid fa-person-swimming"></i> }
          }
        </div>
        @if (service().badge; as badge) {
          <span class="rounded-full border border-[#b8f2df]/30 bg-[#b8f2df]/10 px-3 py-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#d6fff0]">{{ badge }}</span>
        }
      </div>

      <div class="mt-16">
        <p class="mb-3 font-mono text-[0.65rem] font-medium uppercase tracking-[0.23em] text-[#b8f2df]">{{ service().eyebrow }}</p>
        <h3 class="max-w-[12ch] font-serif text-3xl leading-[0.95] tracking-[-0.03em] sm:text-4xl">{{ service().title }}</h3>
        <p class="mt-4 max-w-sm text-sm leading-6 text-white/70">{{ service().description }}</p>
      </div>

      <div class="mt-7 flex items-end justify-between gap-4 border-t border-white/15 pt-5">
        <div class="flex gap-5 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-white/55">
          <span><strong class="mr-1 font-medium text-white/90">{{ service().depth }}</strong> depth</span>
          <span class="hidden sm:inline"><strong class="mr-1 font-medium text-white/90">{{ service().duration }}</strong> time</span>
        </div>
        <a
          [routerLink]="['/experiences', service().id]"
          class="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold transition hover:border-[#b8f2df] hover:bg-[#b8f2df] hover:text-[#061419] focus:outline-none focus:ring-2 focus:ring-[#b8f2df] focus:ring-offset-2 focus:ring-offset-[#061419]"
          [attr.aria-label]="'Explore ' + service().title"
        >
          {{ copy.actions.explore }} <i class="fa-solid fa-location-arrow" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  `
})
export class ServiceCardComponent {
  readonly copy = SITE_COPY;
  readonly service = input.required<MarineService>();
}
