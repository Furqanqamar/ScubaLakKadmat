import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_COPY } from '../../../data/site-copy';

@Component({
  selector: 'app-brand-lockup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span class="brand-lockup"><span class="brand-lockup__mark-shell"><img class="brand-lockup__logo" [src]="brand.logoSrc" alt="" width="48" height="48"></span><span class="brand-lockup__wordmark"><strong>{{ brand.name }}</strong><small>{{ brand.tagline }}</small></span></span>',
  styles: `
    :host { display: inline-flex; }
    .brand-lockup { display: inline-flex; align-items: center; gap: .7rem; color: var(--theme-sand); }
    .brand-lockup__mark-shell { display: grid; width: 3.45rem; height: 3.45rem; place-items: center; border: 1px solid rgba(255,255,255,.82); border-radius: 999px; background: #fff; box-shadow: 0 .55rem 1.15rem rgba(3,17,22,.27), 0 0 0 .2rem rgba(255,255,255,.08); transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease; }
    .brand-lockup__logo { display: block; width: 3rem; height: 3rem; object-fit: contain; filter: drop-shadow(0 .18rem .3rem rgba(3,17,22,.14)); transition: transform .3s cubic-bezier(.2,.8,.2,1), filter .3s ease; }
    .brand-lockup__wordmark { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
    .brand-lockup__wordmark strong { color: inherit; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: clamp(1.3rem, 2.3vw, 1.3rem); font-weight: 500; letter-spacing: .1em; }
    .brand-lockup__wordmark small { margin-top: .46rem; color: var(--theme-mint); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .54rem; font-weight: 700; letter-spacing: .18em; }
    .brand-lockup:hover .brand-lockup__mark-shell { transform: translateY(-2px) scale(1.035); box-shadow: 0 .75rem 1.35rem rgba(3,17,22,.33), 0 0 0 .28rem color-mix(in srgb, var(--theme-mint) 15%, transparent); }
    .brand-lockup:hover .brand-lockup__logo { transform: scale(1.04); filter: drop-shadow(0 .3rem .5rem rgba(3,17,22,.2)); }
  `
})
export class BrandLockupComponent {
  readonly brand = SITE_COPY.brand;
}
