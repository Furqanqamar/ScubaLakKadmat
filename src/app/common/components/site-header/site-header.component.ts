import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { BrandLockupComponent } from '../brand-lockup/brand-lockup.component';
import { SITE_COPY } from '../../../data/site-copy';
import { SmoothScrollService } from '../../services/smooth-scroll.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BrandLockupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <nav class="mx-auto flex max-w-[90rem] items-center justify-between" [attr.aria-label]="copy.navigation.primaryLabel">
        <a class="site-header__brand" routerLink="/" [attr.aria-label]="copy.brand.homeLabel" (click)="handleLogoClick($event)">
          <app-brand-lockup />
        </a>

        <div class="hidden items-center gap-6 lg:flex">
          <a class="nav-link" routerLink="/experiences" routerLinkActive="nav-link--active">{{ copy.navigation.experiences }}</a>
          <a class="nav-link" routerLink="/courses" routerLinkActive="nav-link--active">{{ copy.navigation.courses }}</a>
          <a class="nav-link" routerLink="/lakshadweep" routerLinkActive="nav-link--active">{{ copy.navigation.island }}</a>
          <a class="nav-link" routerLink="/about" routerLinkActive="nav-link--active">{{ copy.navigation.about }}</a>
          <a class="nav-link" routerLink="/gallery" routerLinkActive="nav-link--active">{{ copy.navigation.gallery }}</a>
          <a class="nav-link" routerLink="/contact" routerLinkActive="nav-link--active">{{ copy.navigation.contact }}</a>
        </div>

        <div class="flex items-center gap-3">
          <a class="hidden rounded-full border border-[#b8f2df]/60 bg-[#b8f2df] px-4 py-2.5 text-xs font-bold text-[#061419] transition hover:bg-[#e2fff5] focus:outline-none focus:ring-2 focus:ring-[#b8f2df] focus:ring-offset-2 focus:ring-offset-transparent sm:inline-flex" routerLink="/contact">{{ copy.navigation.planDive }} <i class="fa-solid fa-location-arrow" aria-hidden="true"></i></a>
          <button class="menu-toggle" type="button" [attr.aria-expanded]="isMenuOpen()" aria-controls="mobile-navigation" [attr.aria-label]="copy.navigation.toggleLabel" (click)="toggleMenu()"><span></span><span></span></button>
        </div>
      </nav>

      @if (isMenuOpen()) {
        <div id="mobile-navigation" class="mobile-navigation lg:hidden">
          <a routerLink="/experiences" (click)="closeMenu()">{{ copy.navigation.experiences }}</a>
          <a routerLink="/courses" (click)="closeMenu()">{{ copy.navigation.courses }}</a>
          <a routerLink="/lakshadweep" (click)="closeMenu()">{{ copy.navigation.island }}</a>
          <a routerLink="/about" (click)="closeMenu()">{{ copy.navigation.about }}</a>
          <a routerLink="/gallery" (click)="closeMenu()">{{ copy.navigation.gallery }}</a>
          <a routerLink="/contact" (click)="closeMenu()">{{ copy.navigation.contactDesk }}</a>
        </div>
      }
    </header>
  `,
  styles: `
    :host { display: block; }
    .site-header { position: absolute; inset: 0 0 auto; z-index: 40; padding: 1.25rem 1.25rem; color: white; }
    .site-header__brand { display: inline-flex; color: #f4f1e9; }
    .nav-link { color: rgba(255,255,255,.62); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .61rem; font-weight: 600; letter-spacing: .11em; text-transform: uppercase; transition: color .2s ease; }
    .nav-link:hover, .nav-link--active, .nav-link:focus-visible { color: #b8f2df; }
    .menu-toggle { display: grid; width: 2.5rem; height: 2.5rem; place-content: center; gap: .33rem; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: rgba(6,20,25,.3); backdrop-filter: blur(12px); }
    .menu-toggle span { display: block; width: 1rem; height: 1px; background: #d6fff0; }
    .mobile-navigation { margin: 1.25rem auto 0; max-width: 90rem; border: 1px solid rgba(255,255,255,.14); border-radius: 1.25rem; background: rgba(6,20,25,.9); padding: .75rem; backdrop-filter: blur(18px); }
    .mobile-navigation a { display: block; border-radius: .8rem; padding: .85rem 1rem; color: rgba(255,255,255,.72); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .68rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
    .mobile-navigation a:hover { background: rgba(184,242,223,.1); color: #b8f2df; }
    @media (min-width: 640px) { .site-header { padding-inline: 2rem; } }
    @media (min-width: 1024px) { .site-header { padding-inline: 2.5rem; } .menu-toggle { display: none; } }
  `
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);
  private readonly smoothScroll = inject(SmoothScrollService);

  readonly isMenuOpen = signal(false);
  readonly copy = SITE_COPY;

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  handleLogoClick(event: MouseEvent): void {
    this.closeMenu();
    if (this.router.url.split('?')[0].split('#')[0] !== '/') {
      return;
    }

    event.preventDefault();
    this.smoothScroll.scrollToTop();
  }

}
