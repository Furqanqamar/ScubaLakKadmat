import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { breadcrumbs } from '../../../data/seo-data';
@Component({
  selector: 'app-breadcrumbs', standalone: true, imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (items().length > 1) { <nav aria-label="Breadcrumb" class="bg-[#f4f1e9] px-5 py-6 text-xs text-[#10282d] sm:px-8"><ol class="mx-auto flex max-w-[90rem] flex-wrap items-center gap-3">@for (item of items(); track item.path; let last = $last) { <li>@if (last) { <span aria-current="page">{{ item.label }}</span> } @else { <a class="underline underline-offset-4" [routerLink]="item.path">{{ item.label }}</a><span class="ml-3" aria-hidden="true">/</span> }</li> }</ol></nav> }`
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);
  private readonly navigation = toSignal(this.router.events);
  readonly items = computed(() => { this.navigation(); return breadcrumbs(this.router.url.split(/[?#]/)[0].replace(/\/+$/, '') || '/'); });
}
