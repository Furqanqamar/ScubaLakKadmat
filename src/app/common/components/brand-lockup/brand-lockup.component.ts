import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_COPY } from '../../../data/site-copy';

@Component({
  selector: 'app-brand-lockup',
  standalone: true,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span class="brand-lockup"><span class="brand-lockup__mark-shell"><img class="brand-lockup__logo" [src]="brand.logoSrc" [srcset]="brand.logoSrcset" sizes="48px" alt="" width="48" height="48" decoding="async"></span><span class="brand-lockup__wordmark"><strong>{{ brand.name }}</strong> <small>{{ brand.tagline }}</small></span></span>',
  styles: `
    :host { display: inline-flex; flex: none; }
    .brand-lockup { display: inline-flex; flex: none; align-items: center; gap: .7rem; color: var(--theme-sand); white-space: nowrap; }
    .brand-lockup__mark-shell { display: grid; width: 3.45rem; height: 3.45rem; place-items: center; border: 1px solid rgba(255,255,255,.82); border-radius: 999px; background: #fff; box-shadow: 0 .55rem 1.15rem rgba(3,17,22,.27), 0 0 0 .2rem rgba(255,255,255,.08); }
    .brand-lockup__logo { display: block; width: 3rem; height: 3rem; border-radius: 50%; object-fit: contain; }
    .brand-lockup__mark-shell { flex: none; }
    .brand-lockup__wordmark { display: flex; flex: none; flex-direction: column; align-items: flex-start; line-height: 1; white-space: nowrap; }
    .brand-lockup__wordmark strong { color: inherit; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: clamp(1.3rem, 2.3vw, 1.3rem); font-weight: 500; letter-spacing: .1em; }
    .brand-lockup__wordmark small { margin-top: .46rem; color: var(--theme-mint); font-family: var(--font-body); font-size: var(--text-label); line-height: 1.4; font-weight: 600; letter-spacing: .06em; }
  `
})
export class BrandLockupComponent {
  readonly brand = SITE_COPY.brand;
}
