import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TRAVEL_GUIDES } from '../../data/travel-guides';

@Component({
  selector: 'app-travel-guide', standalone: true, imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (guide(); as guide) {
      <main class="page-surface">
        <section class="page-hero page-hero--about"><div class="mx-auto max-w-[90rem]">
          <p class="eyebrow text-[#b8f2df]">{{ guide.eyebrow }}</p>
          <h1 class="mt-6 max-w-5xl font-serif text-5xl leading-tight text-white sm:text-7xl">{{ guide.title }}</h1>
          <p class="mt-8 max-w-3xl text-base leading-8 text-white/80">{{ guide.introduction }}</p>
        </div></section>
        <section class="bg-[#f4f1e9] px-5 py-16 sm:px-8"><div class="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          @for (section of guide.sections; track section.title) {
            <article><h2 class="font-serif text-3xl text-[#10282d]">{{ section.title }}</h2><p class="mt-5 text-sm leading-7 text-[#10282d]/80">{{ section.body }}</p><ul class="mt-5 list-disc space-y-3 pl-5 text-sm leading-6">@for (item of section.checklist; track item) { <li>{{ item }}</li> }</ul></article>
          }
        </div></section>
        <section class="bg-[#e8e2d4] px-5 py-16 sm:px-8"><div class="mx-auto max-w-4xl">
          <h2 class="font-serif text-4xl">Questions before you book</h2>
          @for (faq of guide.faqs; track faq.question) { <details class="mt-5 border-b border-[#10282d]/20 py-4"><summary class="cursor-pointer font-semibold leading-7">{{ faq.question }}</summary><p class="mt-4 text-sm leading-7">{{ faq.answer }}</p></details> }
          <nav aria-label="Related island planning" class="mt-10 flex flex-wrap gap-4">
            <a class="button-link button-link--dark" routerLink="/contact">Request a tailored plan</a>
            <a class="button-link" routerLink="/kadmat">Kadmat Island guide</a>
            <a class="button-link" routerLink="/courses">Explore PADI courses</a>
            <a class="button-link" routerLink="/kadmat-accommodation">Accommodation planning</a>
            <a class="button-link" routerLink="/lakshadweep-trip-planning">Travel checklist</a>
            <a class="button-link" href="https://lakshadweep.gov.in/tourism/">Official Lakshadweep tourism information</a>
          </nav>
        </div></section>
      </main>
    }
  `
})
export class TravelGuideComponent {
  private readonly data = toSignal(inject(ActivatedRoute).data);
  readonly guide = computed(() => TRAVEL_GUIDES[this.data()?.['guide'] as string]);
}
