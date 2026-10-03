import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-not-found', standalone: true, imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="page-surface"><section class="page-hero"><p class="eyebrow text-[#b8f2df]">404 · Off the chart</p><h1 class="mt-6 font-serif text-5xl text-white">This page could not be found.</h1><p class="mt-6 text-white/80">The link may have changed. Return to Scuba Lak to explore Kadmat diving and island travel.</p><a class="button-link mt-8 bg-[#b8f2df] text-[#10282d]" routerLink="/">Return to home</a></section></main>`
})
export class NotFoundComponent {}
