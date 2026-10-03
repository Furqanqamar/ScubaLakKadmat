import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import { SITE_COPY } from '../../../data/site-copy';
import { SmoothScrollService } from '../../services/smooth-scroll.service';

@Component({
  selector: 'app-floating-navigator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <button class="floating-navigator" [class.floating-navigator--home]="isHome()" type="button" (click)="navigate()" [attr.aria-label]="isHome() ? copy.actions.scrollToTop : copy.actions.returnHome">
        <span class="floating-navigator__outer-ring" aria-hidden="true"></span>
        <span class="floating-navigator__orbit" aria-hidden="true">
          <svg viewBox="0 0 100 100" focusable="false">
            <defs><path id="floating-navigator-orbit" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"></path></defs>
            <text><textPath href="#floating-navigator-orbit" startOffset="0%">{{ isHome() ? copy.actions.scrollToTop + ' · ' + copy.actions.scrollToTop + ' · ' : copy.actions.returnHome + ' · ' + copy.actions.returnHome + ' · ' }}</textPath></text>
          </svg>
        </span>
        <span class="floating-navigator__icon" aria-hidden="true"><i class="fa-solid" [class.fa-arrow-up]="isHome()" [class.fa-arrow-left]="!isHome()"></i></span>
      </button>
    }
  `,
  styles: `
    :host { position: fixed; right: 1.15rem; bottom: 1.15rem; z-index: 45; display: block; mix-blend-mode: difference; }
    .floating-navigator { position: relative; display: grid; width: 6rem; height: 6rem; place-items: center; border: 0; border-radius: 999px; background: transparent; padding: 0; color: #d6fff0; box-shadow: none; transition: transform .3s cubic-bezier(.2,.8,.2,1); }
    .floating-navigator:hover { transform: translateY(-4px) scale(1.03); }
    .floating-navigator__outer-ring { position: absolute; inset: .15rem; border: 1px solid rgba(184,242,223,.42); border-radius: 999px; box-shadow: 0 0 0 .35rem rgba(184,242,223,.06), 0 1rem 2.5rem rgba(3,17,22,.26); }
    .floating-navigator__orbit { position: absolute; inset: 0; animation: floating-navigator-spin 18s linear infinite; }
    .floating-navigator__orbit svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .floating-navigator__orbit path { fill: none; }
    .floating-navigator__orbit text { fill: #fff; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: 7px; font-weight: 800; letter-spacing: .85px; text-transform: uppercase; }
    .floating-navigator__icon { position: relative; z-index: 1; display: grid; width: 2.65rem; height: 2.65rem; place-items: center; border: 1px solid rgba(184,242,223,.78); border-radius: 999px; background: transparent; color: #fff; font-size: 1rem; line-height: 1; box-shadow: 0 0 0 .18rem rgba(6,20,25,.5); transition: border-color .25s ease, color .25s ease, transform .25s ease; }
    .floating-navigator:hover .floating-navigator__outer-ring { border-color: #b8f2df; }
    .floating-navigator:hover .floating-navigator__icon { border-color: #fff; color: #fff; transform: translateY(-2px); }
    .floating-navigator:not(.floating-navigator--home):hover .floating-navigator__icon { transform: translateX(-2px); }
    .floating-navigator:focus-visible { outline: 2px solid #b8f2df; outline-offset: 5px; }
    @media (max-width: 639px) { :host { right: .65rem; bottom: max(.65rem, env(safe-area-inset-bottom)); } .floating-navigator { width: 5.35rem; height: 5.35rem; } .floating-navigator__icon { width: 2.3rem; height: 2.3rem; } .floating-navigator__orbit text { font-size: 7.4px; } }
    @media (prefers-reduced-motion: reduce) { .floating-navigator, .floating-navigator__orbit, .floating-navigator__icon { transition: none; animation: none; } }
    @keyframes floating-navigator-spin { to { transform: rotate(360deg); } }
  `
})
export class FloatingNavigatorComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly navigation = toSignal(this.router.events, { initialValue: null });

  readonly scrollY = signal(0);
  readonly copy = SITE_COPY;
  readonly isHome = computed(() => {
    this.navigation();
    return this.router.url.split('?')[0].split('#')[0] === '/';
  });
  readonly isVisible = computed(() => !this.isHome() || this.scrollY() > 360);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const view = this.document.defaultView;
    const onScroll = (): void => this.scrollY.set((view?.scrollY ?? 0) > 360 ? 361 : 0);
    view?.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => view?.removeEventListener('scroll', onScroll));
    effect(() => {
      const event = this.navigation();
      if (event instanceof NavigationEnd) {
        const currentView = this.document.defaultView;
        this.scrollY.set(currentView?.scrollY ?? 0);
      }
    });
  }

  navigate(): void {
    if (this.isHome()) {
      this.smoothScroll.scrollToTop();
      return;
    }

    void this.router.navigateByUrl('/');
  }
}
