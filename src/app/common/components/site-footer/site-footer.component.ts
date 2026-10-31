import { UiIconComponent } from '../ui-icon/ui-icon.component';
import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLockupComponent } from '../brand-lockup/brand-lockup.component';
import { SITE_COPY } from '../../../data/site-copy';
import { BUSINESS_CONTACT } from '../../../data/business-config';
import { HomeLinkDirective } from '../../directives/home-link.directive';
import { configuredSocialUrl } from '../../services/contact-links';

interface FooterBubble {
  readonly id: number;
  readonly left: number;
  readonly size: number;
  readonly duration: number;
  readonly delay: number;
}

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [UiIconComponent, RouterLink, BrandLockupComponent, HomeLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer bg-[#061419] px-5 py-10 text-white sm:px-8 lg:px-10">
      <div class="footer-underwater" aria-hidden="true">
        <span class="footer-underwater__ray footer-underwater__ray--one"></span>
        <span class="footer-underwater__ray footer-underwater__ray--two"></span>
        <span class="footer-underwater__ray footer-underwater__ray--three"></span>
        <span class="footer-underwater__surface-glow"></span>
        @for (bubble of bubbles; track bubble.id) {
          <span class="footer-underwater__bubble" [style.left.%]="bubble.left" [style.width.px]="bubble.size" [style.height.px]="bubble.size" [style.animation-delay.ms]="bubble.delay" [style.animation-duration.ms]="bubble.duration"></span>
        }
      </div>
      <div class="mx-auto max-w-[90rem]">
        <div class="footer-layout">
          <a class="footer-brand" appHomeLink routerLink="/" [attr.title]="copy.brand.homeLabel"><app-brand-lockup /></a>
          @if (socialLinks.length) { <nav class="footer-socials" [attr.aria-label]="copy.footer.socialLabel">
            @for (social of socialLinks; track social.label) {
              <a class="social-link" [href]="social.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.label + ' · ' + social.handle"><i [appIcon]="social.icon" [class]="social.icon" aria-hidden="true"></i></a>
            }
          </nav> }
          <nav class="footer-navigation" [attr.aria-label]="copy.footer.navigationLabel"><a routerLink="/experiences">{{ copy.navigation.experiences }}</a><a routerLink="/courses">{{ copy.navigation.courses }}</a><a routerLink="/kadmat">{{ copy.navigation.island }}</a><a routerLink="/about">{{ copy.navigation.about }}</a><a routerLink="/gallery">{{ copy.navigation.gallery }}</a><a routerLink="/lakshadweep">{{ copy.navigation.archipelago }}</a><a routerLink="/kadmat-accommodation">{{ copy.navigation.accommodation }}</a><a routerLink="/lakshadweep-trip-planning">{{ copy.navigation.tripPlanning }}</a><a routerLink="/faq">{{ copy.navigation.faq }}</a><a routerLink="/contact" fragment="enquiry">{{ copy.navigation.contact }}</a></nav>
        </div>
        <div class="footer-legal"><p>{{ copy.footer.legal }}</p><nav class="footer-policies" aria-label="Policies"><a routerLink="/privacy-policy">Privacy policy</a><a routerLink="/booking-cancellation-policy">Booking & cancellations</a></nav></div>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; }
    .site-footer { position: relative; isolation: isolate; overflow: hidden; }
    .footer-underwater { position: absolute; inset: 0; z-index: 0; overflow: hidden; background: radial-gradient(ellipse at 50% -18%, rgba(184,242,223,.2), transparent 42%), linear-gradient(180deg, #0d3a48 0%, #06242f 45%, #061419 100%); pointer-events: none; }
    .footer-underwater::before { position: absolute; inset: -15%; background: repeating-radial-gradient(ellipse at 50% 0%, rgba(184,242,223,.08) 0 1px, transparent 1px 32px); filter: blur(1px); opacity: .55; animation: footer-underwater-caustics 14s ease-in-out infinite alternate; content: ''; }
    .footer-underwater::after { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(184,242,223,.08), transparent 30%, rgba(3,17,22,.32) 72%, rgba(3,17,22,.82) 100%); content: ''; }
    .site-footer > div:not(.footer-underwater) { position: relative; z-index: 1; }
    .footer-underwater__surface-glow { position: absolute; top: -28%; left: 50%; width: 70%; height: 70%; transform: translateX(-50%); border-radius: 50%; background: rgba(184,242,223,.14); filter: blur(42px); animation: footer-surface-glow 8s ease-in-out infinite alternate; }
    .footer-underwater__ray { position: absolute; top: -34%; z-index: 1; height: 150%; transform-origin: 50% 0; border-radius: 999px; background: linear-gradient(180deg, rgba(184,242,223,.13), rgba(184,242,223,0)); filter: blur(13px); opacity: .46; animation: footer-ray-sway 11s ease-in-out infinite alternate; }
    .footer-underwater__ray--one { left: 10%; width: 15%; transform: rotate(16deg); }
    .footer-underwater__ray--two { left: 43%; width: 19%; transform: rotate(-5deg); animation-delay: -3s; opacity: .3; }
    .footer-underwater__ray--three { right: 8%; width: 12%; transform: rotate(-19deg); animation-delay: -5s; opacity: .24; }
    .footer-underwater__bubble { position: absolute; bottom: -3rem; z-index: 2; display: block; border: 1px solid rgba(214,255,240,.42); border-radius: 50%; background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.5), transparent 16%), rgba(184,242,223,.035); box-shadow: inset -3px -4px 8px rgba(184,242,223,.08), 0 0 12px rgba(184,242,223,.08); opacity: 0; animation-name: footer-bubble-rise, footer-bubble-sway; animation-timing-function: ease-in, ease-in-out; animation-iteration-count: infinite, infinite; animation-fill-mode: both, both; }
    .footer-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: center; }
    .footer-brand { display: inline-flex; flex: none; justify-self: start; min-width: max-content; }
    .footer-socials { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; }
    .footer-navigation { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .3rem 1.25rem; border-top: 1px solid rgb(255 255 255 / .12); padding-top: 1.25rem; }
    .footer-navigation a { display: inline-flex; align-items: center; min-height: 44px; color: var(--text-on-dark); font-family: var(--font-body); font-size: var(--text-control); line-height: 1.6; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; transition: color .2s ease; }
    .footer-navigation a:hover { color: var(--mint); }
    .footer-legal { margin-top: 1.25rem; border-top: 1px solid rgb(255 255 255 / .12); padding-top: 1.25rem; color: var(--text-on-dark); font-family: var(--font-body); font-size: var(--text-caption); line-height: 1.8; }
    .footer-policies { display: flex; flex-wrap: wrap; gap: .25rem 1.5rem; margin-top: .65rem; }
    .footer-policies a { display: inline-flex; align-items: center; min-height: 44px; padding-block: .5rem; font-size: var(--text-control); text-decoration: underline; text-underline-offset: .25em; }
    .footer-policies a:hover { color: var(--mint); }
    .footer-policies a:focus-visible { outline: 2px solid var(--mint); outline-offset: 5px; }
    .social-link { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 1px solid rgb(184 242 223 / .35); border-radius: 50%; color: var(--mint); transition: background .2s ease, border-color .2s ease; }
    .social-link:hover { border-color: var(--mint); background: rgb(184 242 223 / .1); }
    .social-link i { color: var(--mint); font-size: 1.1rem; }
    .social-link:focus-visible, .footer-navigation a:focus-visible { outline: 2px solid var(--mint); outline-offset: 5px; }
    @media (min-width: 640px) { .footer-layout { grid-template-columns: minmax(0, 1fr) auto; gap: 1.75rem 2.5rem; } .footer-socials { justify-self: end; } .footer-navigation { display: flex; flex-wrap: wrap; gap: .4rem 1.75rem; } .footer-legal { padding-right: 6.5rem; } }
    .footer-underwater::before, .footer-underwater__surface-glow, .footer-underwater__ray, .footer-underwater__bubble { animation-play-state: var(--footer-play-state, paused); }
    @media (prefers-reduced-motion: reduce) { .footer-underwater::before, .footer-underwater__surface-glow, .footer-underwater__ray, .footer-underwater__bubble { animation: none; } }
    @keyframes footer-underwater-caustics { from { transform: translate3d(-2%, -1%, 0) scale(1); } to { transform: translate3d(3%, 2%, 0) scale(1.08); } }
    @keyframes footer-surface-glow { from { opacity: .36; transform: translateX(-50%) scale(.92); } to { opacity: .72; transform: translateX(-50%) scale(1.08); } }
    @keyframes footer-ray-sway { from { translate: -1.2rem 0; } to { translate: 1.2rem 0; } }
    @keyframes footer-bubble-rise { 0% { translate: 0 0; opacity: 0; } 12% { opacity: .5; } 80% { opacity: .24; } 100% { translate: 0 -120vh; opacity: 0; } }
    @keyframes footer-bubble-sway { 0%, 100% { transform: translateX(-.8rem); } 50% { transform: translateX(.8rem); } }
  `
})
export class SiteFooterComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      const observer = new view.IntersectionObserver(([entry]) => {
        this.host.nativeElement.style.setProperty('--footer-play-state', entry.isIntersecting ? 'running' : 'paused');
      });
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
  readonly copy = SITE_COPY;
  readonly socialLinks = BUSINESS_CONTACT.socials.filter(item => configuredSocialUrl(item.href));
  readonly bubbles: readonly FooterBubble[] = [
    { id: 1, left: 7, size: 7, duration: 7600, delay: -1200 },
    { id: 2, left: 18, size: 14, duration: 9000, delay: -5100 },
    { id: 3, left: 29, size: 5, duration: 6800, delay: -2800 },
    { id: 4, left: 42, size: 10, duration: 8300, delay: -6800 },
    { id: 5, left: 53, size: 6, duration: 6500, delay: -1900 },
    { id: 6, left: 65, size: 17, duration: 9400, delay: -4200 },
    { id: 7, left: 77, size: 8, duration: 7900, delay: -7600 },
    { id: 8, left: 89, size: 11, duration: 7200, delay: -3400 }
  ];
}
