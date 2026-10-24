import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRAVEL_FAQ } from '../../../data/travel-faq';

@Component({
  selector: 'app-travel-faq', standalone: true, imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="travel-faq" aria-labelledby="travel-faq-title"><div class="mx-auto max-w-5xl"><p class="eyebrow text-[#9d7047]">Before the journey</p><h2 id="travel-faq-title" class="mt-5 font-serif text-4xl sm:text-5xl">{{ copy.title }}</h2><p class="mt-6 max-w-3xl leading-7">{{ copy.introduction }}</p><div class="mt-8 space-y-3">@for (item of copy.items; track item.question) { <details><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details> }</div><div class="mt-8 flex flex-wrap gap-5">@for (source of copy.sources; track source.href) { <a [href]="source.href" target="_blank" rel="noopener noreferrer">{{ source.label }} ↗</a> }<a routerLink="/lakshadweep-trip-planning" fragment="reach-permits">{{ copy.guide }} →</a></div></div></section>`,
  styles: `.travel-faq { padding: 4rem 1.25rem; color: var(--ink); background: var(--sand); } details { padding: 1rem 1.2rem; border: 1px solid var(--theme-border); border-radius: 1rem; } summary { min-height: 2rem; cursor: pointer; font-weight: 600; line-height: 1.6; } details p { margin-top: 1rem; max-width: 75ch; line-height: 1.8; } a { text-decoration: underline; text-underline-offset: .2em; line-height: 1.6; }`
})
export class TravelFaqComponent { readonly copy = TRAVEL_FAQ; }
