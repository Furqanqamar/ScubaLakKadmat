import { TravelFaqComponent } from '../../common/components/travel-faq/travel-faq.component';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TRAVEL_GUIDES } from '../../data/travel-guides';
import { ACCOMMODATION_INFO } from '../../data/accommodation-info';

@Component({
  selector: 'app-travel-guide', standalone: true, imports: [RouterLink, TravelFaqComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (guide(); as guide) {
      <main id="main-content" tabindex="-1" class="page-surface">
        <section data-page-hero class="page-hero page-hero--about"><div class="mx-auto max-w-[90rem]">
          <p class="eyebrow text-[#b8f2df]">{{ guide.eyebrow }}</p>
          <h1 class="mt-6 max-w-5xl font-serif text-5xl leading-tight text-white sm:text-7xl">{{ guide.title }}</h1>
          <p class="mt-8 max-w-3xl text-base leading-8 text-white/80">{{ guide.introduction }}</p>
          @if (guide.reviewed) { <p class="mt-6 text-sm leading-7 text-on-dark-secondary">Reviewed {{ guide.reviewed }} · Recheck travel and operating arrangements before booking.</p> }
        </div></section>
        <section [attr.id]="guideKey() === 'planning' ? 'reach-permits' : null" tabindex="-1" class="bg-[#f4f1e9] px-5 py-16 sm:px-8"><div class="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          @for (section of guide.sections; track section.title) {
            <article><h2 class="font-serif text-3xl text-[#10282d]">{{ section.title }}</h2><p class="mt-5 text-sm leading-7 text-[#10282d]/80">{{ section.body }}</p><ul class="mt-5 list-disc space-y-3 pl-5 text-sm leading-6">@for (item of section.checklist; track item) { <li>{{ item }}</li> }</ul>
              @if (section.links?.length) { <ul class="mt-5 flex flex-wrap gap-x-6 gap-y-1" aria-label="Official booking and planning links">@for (link of section.links; track link.url) { <li><a class="inline-flex min-h-11 items-center text-sm underline underline-offset-4" [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} <span class="ml-2" aria-hidden="true">↗</span></a></li> }</ul> }
            </article>
          }
        </div></section>
        <section class="bg-[#e8e2d4] px-5 py-16 sm:px-8"><div class="mx-auto max-w-4xl">
          <h2 class="font-serif text-4xl">Questions before you book</h2>
          @for (faq of guide.faqs; track faq.question) { <details class="mt-5 border-b border-[#10282d]/20 py-4"><summary class="cursor-pointer font-semibold leading-7">{{ faq.question }}</summary><p class="mt-4 text-sm leading-7">{{ faq.answer }}</p></details> }
          <nav aria-label="Related island planning" class="mt-10 flex flex-wrap gap-4">
            <a class="button-link button-link--dark" routerLink="/contact" fragment="enquiry" [queryParams]="{ interest: guide.contactInterest }">{{ guide.contactLabel }}</a>
            @if (guideKey() === 'planning') { <a class="button-link" routerLink="/kadmat-visit-planning">Weather & preparation</a><a class="button-link" routerLink="/kadmat-beyond-diving">Kadmat beyond diving</a> }
            @else { <a class="button-link" routerLink="/lakshadweep-trip-planning">Travel & permits</a><a class="button-link" routerLink="/kadmat">Kadmat Island guide</a> }
          </nav>
          @if (guide.sources?.length) { <aside aria-label="Planning sources" class="mt-10 border-t border-[#10282d]/20 pt-6"><p class="text-sm leading-7">Check current official guidance:</p><ul class="mt-3 space-y-3">@for (source of guide.sources; track source.url) { <li><a class="inline-flex min-h-11 items-center text-sm underline underline-offset-4" [href]="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }} <span class="ml-2" aria-hidden="true">↗</span></a></li> }</ul></aside> }
        </div></section>
        @if (guideKey() === 'accommodation') { <div id="reach-permits" tabindex="-1"><app-travel-faq /></div> }
      </main>
    }
  `
})
export class TravelGuideComponent {
  readonly accommodation = ACCOMMODATION_INFO;
  private readonly data = toSignal(inject(ActivatedRoute).data);
  readonly guideKey = computed(() => this.data()?.['guide'] as string);
  readonly guide = computed(() => TRAVEL_GUIDES[this.guideKey()]);
}
