import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BrandLockupComponent } from '../brand-lockup/brand-lockup.component';
import { SITE_COPY } from '../../../data/site-copy';
import { HomeLinkDirective } from '../../directives/home-link.directive';
import { DialogShellComponent } from '../dialog-shell/dialog-shell.component';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BrandLockupComponent, DialogShellComponent, HomeLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header" (keydown.escape)="closeMenu()">
      <nav class="mx-auto flex max-w-[90rem] items-center justify-between" [attr.aria-label]="copy.navigation.primaryLabel">
        <a class="site-header__brand" appHomeLink routerLink="/" [attr.aria-label]="copy.brand.homeLabel" (click)="closeMenu()">
          <app-brand-lockup />
        </a>

        <div class="hidden items-center gap-6 xl:flex">
          <a class="nav-link" routerLink="/experiences" routerLinkActive="nav-link--active">{{ copy.navigation.experiences }}</a>
          <a class="nav-link" routerLink="/courses" routerLinkActive="nav-link--active">{{ copy.navigation.courses }}</a>
          <a class="nav-link" routerLink="/kadmat" routerLinkActive="nav-link--active">{{ copy.navigation.island }}</a>
          <a class="nav-link" routerLink="/about" routerLinkActive="nav-link--active">{{ copy.navigation.about }}</a>
          <a class="nav-link" routerLink="/gallery" routerLinkActive="nav-link--active">{{ copy.navigation.gallery }}</a>
          <a class="nav-link" routerLink="/contact" fragment="enquiry" routerLinkActive="nav-link--active">{{ copy.navigation.contact }}</a>
        </div>

        <div class="flex items-center gap-3">
          <a class="hidden rounded-full border border-[#b8f2df]/60 bg-[#b8f2df] px-4 py-2.5 text-xs font-bold text-[#061419] transition hover:bg-[#e2fff5] focus:outline-none focus:ring-2 focus:ring-[#b8f2df] focus:ring-offset-2 focus:ring-offset-transparent sm:inline-flex" routerLink="/contact" fragment="enquiry">{{ copy.navigation.planDive }} <i class="fa-solid fa-location-arrow" aria-hidden="true"></i></a>
          <button class="menu-toggle" type="button" [attr.aria-expanded]="isMenuOpen()" aria-controls="mobile-navigation" [attr.aria-label]="copy.navigation.toggleLabel" (click)="toggleMenu()"><span></span><span></span></button>
        </div>
      </nav>

      @if (isMenuOpen()) {
        <app-dialog-shell labelledBy="mobile-menu-title" (closed)="closeMenu()"><div id="mobile-navigation" class="mobile-navigation">
          <div class="flex items-center justify-between gap-5 p-3"><h2 id="mobile-menu-title" class="font-serif text-3xl">{{ copy.navigation.menuTitle }}</h2><button class="modal-close" type="button" (click)="closeMenu()" [attr.aria-label]="copy.navigation.closeLabel">×</button></div>
          <a routerLink="/experiences" (click)="closeMenu()">{{ copy.navigation.experiences }}</a>
          <a routerLink="/courses" (click)="closeMenu()">{{ copy.navigation.courses }}</a>
          <a routerLink="/kadmat" (click)="closeMenu()">{{ copy.navigation.island }}</a>
          <a routerLink="/about" (click)="closeMenu()">{{ copy.navigation.about }}</a>
          <a routerLink="/gallery" (click)="closeMenu()">{{ copy.navigation.gallery }}</a>
          <a routerLink="/contact" fragment="enquiry" (click)="closeMenu()">{{ copy.navigation.contactDesk }}</a>
        </div></app-dialog-shell>
      }
    </header>
  `,
  styles: `
    :host { display: block; }
    .site-header { position: absolute; inset: 0 0 auto; z-index: 40; padding: 1.25rem 1.25rem; color: white; }
    .site-header__brand { display: inline-flex; color: #f4f1e9; }
    .nav-link { color: rgba(255,255,255,.85); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .76rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; transition: color .2s ease; }
    .nav-link:hover, .nav-link--active, .nav-link:focus-visible { color: #b8f2df; }
    .menu-toggle { display: grid; width: 2.75rem; height: 2.75rem; place-content: center; gap: .33rem; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: rgba(6,20,25,.3); backdrop-filter: blur(12px); }
    .menu-toggle span { display: block; width: 1rem; height: 1px; background: #d6fff0; }
    .mobile-navigation { padding: .75rem; background: var(--deep); }
    .mobile-navigation a { display: block; border-radius: .8rem; padding: .9rem 1rem; color: rgba(255,255,255,.9); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: 1rem; font-weight: 500; letter-spacing: .05em; }
    .mobile-navigation a:hover { background: rgba(184,242,223,.1); color: #b8f2df; }
    @media (min-width: 640px) { .site-header { padding-inline: 2rem; } }
    @media (min-width: 1024px) { .site-header { padding-inline: 2.5rem; } }
    @media (min-width: 1280px) { .menu-toggle { display: none; } }
  `
})
export class SiteHeaderComponent {

  readonly isMenuOpen = signal(false);
  readonly copy = SITE_COPY;

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }


}
