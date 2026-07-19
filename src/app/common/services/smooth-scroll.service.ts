import { DOCUMENT } from '@angular/common';
import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigation = toSignal(this.router.events, { initialValue: null });
  private animationFrame: number | null = null;
  private scrollCheckFrame: number | null = null;
  private activeFragment: string | null = null;
  private targetY = 0;
  private isSmoothing = false;
  private readonly scrollListener = (): void => this.syncNativeScroll();

  constructor() {
    const view = this.document.defaultView;
    if (view) {
      this.targetY = view.scrollY;
      view.addEventListener('scroll', this.scrollListener, { passive: true });

      this.destroyRef.onDestroy(() => {
        view.removeEventListener('scroll', this.scrollListener);
        if (this.animationFrame !== null) {
          view.cancelAnimationFrame(this.animationFrame);
        }
        if (this.scrollCheckFrame !== null) {
          view.cancelAnimationFrame(this.scrollCheckFrame);
        }
      });
    }

    effect(() => {
      const event = this.navigation();
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
      const view = this.document.defaultView;
      view?.setTimeout(() => this.scrollAfterNavigation(fragment), 0);
    });
  }

  scrollToTop(): void {
    this.activeFragment = null;
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    const currentUrl = new URL(view.location.href);
    if (currentUrl.hash) {
      currentUrl.hash = '';
      view.history.replaceState(view.history.state, '', `${currentUrl.pathname}${currentUrl.search}`);
    }

    this.animateTo(0, 1100);
  }

  private scrollAfterNavigation(fragment: string | null): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    this.activeFragment = fragment;
    let target: HTMLElement | null = null;
    if (fragment) {
      try {
        target = this.document.getElementById(decodeURIComponent(fragment));
      } catch {
        target = this.document.getElementById(fragment);
      }
    }

    const headerOffset = 88;
    const destination = target
      ? Math.max(0, target.getBoundingClientRect().top + view.scrollY - headerOffset)
      : 0;

    this.animateTo(destination, target ? 1280 : 820);
  }

  private syncNativeScroll(): void {
    if (!this.isSmoothing) {
      const view = this.document.defaultView;
      if (view) {
        this.targetY = view.scrollY;
      }
    }

    const view = this.document.defaultView;
    if (!view || !this.activeFragment || this.scrollCheckFrame !== null) {
      return;
    }

    this.scrollCheckFrame = view.requestAnimationFrame(() => {
      this.scrollCheckFrame = null;
      this.clearFragmentWhenUserLeavesSection();
    });
  }

  private clearFragmentWhenUserLeavesSection(): void {
    const view = this.document.defaultView;
    if (!view || !this.activeFragment || this.animationFrame !== null) {
      return;
    }

    const target = this.document.getElementById(this.activeFragment);
    if (!target || Math.abs(target.getBoundingClientRect().top - 88) < 180) {
      return;
    }

    const currentUrl = new URL(view.location.href);
    currentUrl.hash = '';
    view.history.replaceState(view.history.state, '', `${currentUrl.pathname}${currentUrl.search}`);
    this.activeFragment = null;
  }

  private animateTo(destination: number, duration: number): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    if (this.animationFrame !== null) {
      view.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      view.scrollTo({ top: destination, left: 0, behavior: 'auto' });
      this.targetY = destination;
      return;
    }

    this.isSmoothing = true;
    this.targetY = destination;
    const start = view.scrollY;
    const distance = destination - start;
    const startedAt = view.performance.now();
    const easeInOutCubic = (progress: number): number => progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const frame = (timestamp: number): void => {
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      view.scrollTo({ top: start + distance * easeInOutCubic(progress), left: 0, behavior: 'auto' });

      if (progress < 1) {
        this.animationFrame = view.requestAnimationFrame(frame);
      } else {
        this.animationFrame = null;
        this.isSmoothing = false;
      }
    };

    this.animationFrame = view.requestAnimationFrame(frame);
  }
}
