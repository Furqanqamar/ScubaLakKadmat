import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly positions = new Map<number, number>();
  private navigationId = 0;
  private restoredPosition: number | undefined;
  private animationFrame: number | null = null;
  private scrollCheckFrame: number | null = null;
  private activeFragment: string | null = null;
  private navigationTimer: number | undefined;
  private readonly cancelScroll = (): void => {
    const view = this.document.defaultView;
    if (view && this.animationFrame !== null) view.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  };
  private readonly scrollListener = (): void => this.syncNativeScroll();

  constructor() {
    const view = this.document.defaultView;
    if (view) {
      const restoration = view.history.scrollRestoration;
      view.history.scrollRestoration = 'manual';
      view.addEventListener('scroll', this.scrollListener, { passive: true });
      view.addEventListener('wheel', this.cancelScroll, { passive: true });
      view.addEventListener('touchstart', this.cancelScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        view.history.scrollRestoration = restoration;
        view.removeEventListener('scroll', this.scrollListener);
        view.removeEventListener('wheel', this.cancelScroll);
        view.removeEventListener('touchstart', this.cancelScroll);
        view.clearTimeout(this.navigationTimer);
        if (this.animationFrame !== null) {
          view.cancelAnimationFrame(this.animationFrame);
        }
        if (this.scrollCheckFrame !== null) {
          view.cancelAnimationFrame(this.scrollCheckFrame);
        }
      });
    }

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.positions.set(this.navigationId, view?.scrollY ?? 0);
        if (this.positions.size > 50) this.positions.delete(this.positions.keys().next().value!);
        this.restoredPosition = event.restoredState ? this.positions.get(event.restoredState.navigationId) : undefined;
        this.cancelScroll();
        view?.clearTimeout(this.navigationTimer);
        return;
      }
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
      this.navigationId = event.id;
      this.cancelScroll();
      view?.clearTimeout(this.navigationTimer);
      this.activeFragment = fragment;
      const restored = this.restoredPosition;
      this.navigationTimer = view?.setTimeout(() => {
        if (restored !== undefined) view.scrollTo({ top: restored, behavior: 'instant' });
        else if (fragment) this.scrollAfterNavigation(fragment);
        else view.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
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
    // Layout offsets exclude the temporary translate/scale used by reveal motion.
    let layoutTop = 0;
    for (let element = target; element; element = element.offsetParent as HTMLElement | null) {
      layoutTop += element.offsetTop;
    }
    const destination = target ? Math.max(0, layoutTop - headerOffset) : 0;

    this.animateTo(destination, target ? 1280 : 820);
  }

  private syncNativeScroll(): void {
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
      return;
    }

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
      }
    };

    this.animationFrame = view.requestAnimationFrame(frame);
  }
}
