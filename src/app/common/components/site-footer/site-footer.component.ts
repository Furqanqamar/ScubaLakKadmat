import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLockupComponent } from '../brand-lockup/brand-lockup.component';
import { SITE_COPY } from '../../../data/site-copy';
import { SOCIAL_LINKS } from '../../../data/site-content';

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
  imports: [RouterLink, BrandLockupComponent],
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
      <div class="mx-auto max-w-[90rem] border-t border-white/10 pt-8">
        <div class="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <a class="footer-brand" routerLink="/" [attr.aria-label]="copy.brand.homeLabel"><app-brand-lockup /></a>
          <div class="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-white/35"><a class="transition hover:text-[#b8f2df]" routerLink="/about">{{ copy.navigation.about }}</a><a class="transition hover:text-[#b8f2df]" routerLink="/experiences">{{ copy.navigation.experiences }}</a><a class="transition hover:text-[#b8f2df]" routerLink="/courses">{{ copy.navigation.courses }}</a><a class="transition hover:text-[#b8f2df]" routerLink="/lakshadweep">{{ copy.navigation.island }}</a><a class="transition hover:text-[#b8f2df]" routerLink="/gallery">{{ copy.navigation.gallery }}</a><a class="transition hover:text-[#b8f2df]" routerLink="/contact">{{ copy.navigation.contact }}</a></div>
          <div class="flex flex-wrap gap-2">
            @for (social of socialLinks; track social.label) {
              <a class="social-link" [href]="social.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.label + ' · ' + social.handle"><i [class]="social.icon" aria-hidden="true"></i><span>{{ social.label }}</span></a>
            }
          </div>
        </div>
        <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p class="max-w-xl font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/30">{{ copy.footer.legal }}</p><p class="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/30">{{ copy.footer.socialNote }}</p></div>
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
    .footer-brand { display: inline-flex; }
    .social-link { display: inline-flex; align-items: center; gap: .45rem; border: 1px solid rgba(184,242,223,.18); border-radius: 999px; padding: .55rem .7rem; color: rgba(214,255,240,.72); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .57rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease; }
    .social-link:hover { border-color: rgba(184,242,223,.55); background: rgba(184,242,223,.1); color: #d6fff0; transform: translateY(-2px); }
    .social-link i { display: grid; width: 1.3rem; height: 1.3rem; place-items: center; border-radius: 999px; background: rgba(184,242,223,.1); color: #b8f2df; font-size: .72rem; }
    @media (prefers-reduced-motion: reduce) { .footer-underwater::before, .footer-underwater__surface-glow, .footer-underwater__ray, .footer-underwater__bubble { animation: none; } }
    @keyframes footer-underwater-caustics { from { transform: translate3d(-2%, -1%, 0) scale(1); } to { transform: translate3d(3%, 2%, 0) scale(1.08); } }
    @keyframes footer-surface-glow { from { opacity: .36; transform: translateX(-50%) scale(.92); } to { opacity: .72; transform: translateX(-50%) scale(1.08); } }
    @keyframes footer-ray-sway { from { margin-left: -1.2rem; } to { margin-left: 1.2rem; } }
    @keyframes footer-bubble-rise { 0% { bottom: -3rem; opacity: 0; } 12% { opacity: .5; } 80% { opacity: .24; } 100% { bottom: 112%; opacity: 0; } }
    @keyframes footer-bubble-sway { 0%, 100% { transform: translateX(-.8rem); } 50% { transform: translateX(.8rem); } }
  `
})
export class SiteFooterComponent {
  readonly copy = SITE_COPY;
  readonly socialLinks = SOCIAL_LINKS;
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
