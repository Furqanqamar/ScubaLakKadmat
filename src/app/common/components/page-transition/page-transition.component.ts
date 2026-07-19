import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { SITE_COPY } from '../../../data/site-copy';

type TransitionPhase = 'cover' | 'reveal';

interface TransitionBubble {
  readonly id: number;
  readonly left: number;
  readonly size: number;
  readonly duration: number;
  readonly delay: number;
}

const CURTAIN_COVER_MS = 720;
const CURTAIN_HOLD_MS = 650;
const CURTAIN_REVEAL_MS = 980;

@Component({
  selector: 'app-page-transition',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isActive()) {
      <div class="page-transition" [class.page-transition--reveal]="phase() === 'reveal'" role="status" aria-live="polite" [attr.aria-label]="copy.transition.loading">
        <div class="page-transition__water" aria-hidden="true">
          <span class="page-transition__ray page-transition__ray--one"></span>
          <span class="page-transition__ray page-transition__ray--two"></span>
          <span class="page-transition__ray page-transition__ray--three"></span>
          <span class="page-transition__surface-glow"></span>
          @for (bubble of bubbles; track bubble.id) {
            <span class="page-transition__bubble" [style.left.%]="bubble.left" [style.width.px]="bubble.size" [style.height.px]="bubble.size" [style.animation-delay.ms]="bubble.delay" [style.animation-duration.ms]="bubble.duration"></span>
          }
        </div>
        <div class="page-transition__content">
          <span class="page-transition__title">{{ label() }}</span>
          <span class="page-transition__line"><span></span></span>
        </div>
        <span class="page-transition__coordinate">{{ copy.transition.coordinate }}</span>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .page-transition { position: fixed; inset: 0; z-index: 90; isolation: isolate; overflow: hidden; background: #061419; color: #d6fff0; pointer-events: all; animation: dotart-curtain-cover ${CURTAIN_COVER_MS}ms cubic-bezier(.77,0,.18,1) both; }
    .page-transition::after { position: absolute; right: -8%; bottom: -7rem; left: -8%; z-index: 1; height: 11rem; border-radius: 50% 50% 0 0 / 80% 80% 0 0; background: linear-gradient(180deg, rgba(16,40,45,.35), #10282d 50%); box-shadow: 0 -2rem 5rem rgba(184,242,223,.08); content: ''; }
    .page-transition__water { position: absolute; inset: 0; z-index: 0; overflow: hidden; background: radial-gradient(ellipse at 50% -15%, rgba(184,242,223,.2), transparent 42%), linear-gradient(180deg, #0d3a48 0%, #06242f 43%, #061419 100%); }
    .page-transition__water::before { position: absolute; inset: -15%; background: repeating-radial-gradient(ellipse at 50% 0%, rgba(184,242,223,.08) 0 1px, transparent 1px 32px); filter: blur(1px); opacity: .6; animation: underwater-caustics 11s ease-in-out infinite alternate; content: ''; }
    .page-transition__water::after { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(184,242,223,.08), transparent 32%, rgba(3,17,22,.22) 78%, rgba(3,17,22,.6)); content: ''; }
    .page-transition__surface-glow { position: absolute; top: -18%; left: 50%; width: 72%; height: 48%; transform: translateX(-50%); border-radius: 50%; background: rgba(184,242,223,.16); filter: blur(42px); animation: surface-glow 7s ease-in-out infinite alternate; }
    .page-transition__ray { position: absolute; top: -18%; z-index: 1; height: 125%; transform-origin: 50% 0; border-radius: 999px; background: linear-gradient(180deg, rgba(184,242,223,.15), rgba(184,242,223,0)); filter: blur(13px); opacity: .5; animation: ray-sway 9s ease-in-out infinite alternate; }
    .page-transition__ray--one { left: 12%; width: 13%; transform: rotate(16deg); }
    .page-transition__ray--two { left: 43%; width: 18%; transform: rotate(-5deg); animation-delay: -3s; opacity: .34; }
    .page-transition__ray--three { right: 8%; width: 11%; transform: rotate(-19deg); animation-delay: -5s; opacity: .28; }
    .page-transition__bubble { position: absolute; bottom: -4rem; z-index: 2; display: block; border: 1px solid rgba(214,255,240,.46); border-radius: 50%; background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.5), transparent 16%), rgba(184,242,223,.035); box-shadow: inset -3px -4px 8px rgba(184,242,223,.08), 0 0 12px rgba(184,242,223,.08); opacity: 0; animation-name: bubble-rise, bubble-sway; animation-timing-function: ease-in, ease-in-out; animation-iteration-count: infinite, infinite; animation-fill-mode: both, both; }
    .page-transition__content { position: absolute; top: 50%; left: 50%; z-index: 3; display: flex; width: min(24rem, calc(100% - 3rem)); flex-direction: column; transform: translate(-50%, -50%); text-align: center; text-shadow: 0 .2rem 2rem rgba(3,17,22,.55); }
    .page-transition__title { margin-top: 1rem; color: #f4f1e9; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.8rem, 8vw, 5.5rem); letter-spacing: -.06em; line-height: .9; }
    .page-transition__line { position: relative; display: block; height: 2px; margin: 2rem auto 0; overflow: hidden; width: min(12rem, 80%); background: rgba(184,242,223,.16); }
    .page-transition__line span { position: absolute; inset: 0 auto 0 0; width: 55%; background: #b8f2df; animation: dotart-progress .8s cubic-bezier(.2,.8,.2,1) both; }
    .page-transition__coordinate { position: absolute; right: 1.5rem; bottom: 1.5rem; z-index: 3; color: rgba(214,255,240,.44); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .56rem; font-weight: 600; letter-spacing: .1em; }
    .page-transition--reveal { animation: dotart-curtain-reveal ${CURTAIN_REVEAL_MS}ms cubic-bezier(.77,0,.18,1) both; }
    .page-transition--reveal .page-transition__content { opacity: 0; transition: opacity .18s ease; }
    @media (max-width: 639px) { .page-transition__coordinate { right: 1rem; bottom: 1rem; } }
    @media (prefers-reduced-motion: reduce) { .page-transition, .page-transition--reveal { animation-duration: .01ms; } .page-transition__line span, .page-transition__water::before, .page-transition__surface-glow, .page-transition__ray, .page-transition__bubble { animation: none; } }
    @keyframes dotart-curtain-cover { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes dotart-curtain-reveal { from { transform: translateY(0); } to { transform: translateY(-100%); } }
    @keyframes dotart-progress { from { transform: translateX(-100%); } to { transform: translateX(65%); } }
    @keyframes underwater-caustics { from { transform: translate3d(-2%, -1%, 0) scale(1); } to { transform: translate3d(3%, 2%, 0) scale(1.08); } }
    @keyframes surface-glow { from { opacity: .42; transform: translateX(-50%) scale(.92); } to { opacity: .78; transform: translateX(-50%) scale(1.08); } }
    @keyframes ray-sway { from { margin-left: -1.25rem; } to { margin-left: 1.25rem; } }
    @keyframes bubble-rise { 0% { bottom: -4rem; opacity: 0; } 12% { opacity: .55; } 80% { opacity: .28; } 100% { bottom: 112%; opacity: 0; } }
    @keyframes bubble-sway { 0%, 100% { transform: translateX(-.8rem); } 50% { transform: translateX(.8rem); } }
  `
})
export class PageTransitionComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly timers: number[] = [];
  private coverStartedAt = 0;

  readonly isActive = signal(false);
  readonly phase = signal<TransitionPhase>('cover');
  readonly copy = SITE_COPY;
  readonly label = signal<string>(this.copy.transition.defaultLabel);
  readonly bubbles: readonly TransitionBubble[] = [
    { id: 1, left: 8, size: 7, duration: 6900, delay: -1200 },
    { id: 2, left: 17, size: 15, duration: 8200, delay: -5100 },
    { id: 3, left: 27, size: 5, duration: 6100, delay: -2800 },
    { id: 4, left: 38, size: 10, duration: 7600, delay: -6800 },
    { id: 5, left: 49, size: 6, duration: 5900, delay: -1900 },
    { id: 6, left: 58, size: 18, duration: 8800, delay: -4200 },
    { id: 7, left: 68, size: 8, duration: 7300, delay: -7600 },
    { id: 8, left: 77, size: 12, duration: 6400, delay: -3400 },
    { id: 9, left: 86, size: 5, duration: 5700, delay: -900 },
    { id: 10, left: 93, size: 9, duration: 7900, delay: -5700 }
  ];

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handleNavigation(event));
  }

  private handleNavigation(event: RouterEvent): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    if (event instanceof NavigationStart) {
      const fromPath = this.cleanPath(this.router.url);
      const toPath = this.cleanPath(event.url);
      if (fromPath === toPath) {
        return;
      }

      this.clearTimers();
      this.coverStartedAt = Date.now();
      this.label.set(this.getLabel(toPath));
      this.phase.set('cover');
      this.isActive.set(true);
      return;
    }

    if (!(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) || !this.isActive()) {
      return;
    }

    const elapsedSinceCoverStarted = Date.now() - this.coverStartedAt;
    const revealDelay = Math.max(0, CURTAIN_COVER_MS + CURTAIN_HOLD_MS - elapsedSinceCoverStarted);
    const hideDelay = revealDelay + CURTAIN_REVEAL_MS;

    this.timers.push(view.setTimeout(() => this.phase.set('reveal'), revealDelay));
    this.timers.push(view.setTimeout(() => this.isActive.set(false), hideDelay));
  }

  private cleanPath(url: string): string {
    return url.split('#')[0].split('?')[0] || '/';
  }

  private getLabel(path: string): string {
    if (path === '/') return this.copy.transition.home;
    if (path.startsWith('/kadmat')) return this.copy.transition.kadmat;
    if (path.startsWith('/lakshadweep')) return this.copy.transition.lakshadweep;
    if (path.startsWith('/courses')) return this.copy.transition.courses;
    if (path.startsWith('/experiences')) return this.copy.transition.experiences;
    if (path.startsWith('/gallery')) return this.copy.transition.gallery;
    if (path.startsWith('/contact')) return this.copy.transition.contact;
    if (path.startsWith('/about')) return this.copy.transition.about;
    return this.copy.transition.defaultLabel;
  }

  private clearTimers(): void {
    const view = this.document.defaultView;
    if (!view) {
      this.timers.length = 0;
      return;
    }
    for (const timer of this.timers) {
      view.clearTimeout(timer);
    }
    this.timers.length = 0;
  }
}
