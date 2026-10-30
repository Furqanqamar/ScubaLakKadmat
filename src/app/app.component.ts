import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { InteractiveCursorComponent } from './common/components/interactive-cursor/interactive-cursor.component';
import { PageTransitionComponent } from './common/components/page-transition/page-transition.component';
import { SiteFooterComponent } from './common/components/site-footer/site-footer.component';
import { FloatingNavigatorComponent } from './common/components/floating-navigator/floating-navigator.component';
import { SiteHeaderComponent } from './common/components/site-header/site-header.component';
import { RevealMotionService } from './common/services/reveal-motion.service';
import { SmoothScrollService } from './common/services/smooth-scroll.service';
import { SeoService } from './common/services/seo.service';
import { ThemeService } from './common/services/theme.service';
import { BreadcrumbsComponent } from './common/components/breadcrumbs/breadcrumbs.component';
import { MediaCacheService } from './common/services/media-cache.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, SiteFooterComponent, FloatingNavigatorComponent, InteractiveCursorComponent, PageTransitionComponent, SiteHeaderComponent, BreadcrumbsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-transition />
    <a class="skip-link" [routerLink]="pagePath()" fragment="main-content" queryParamsHandling="preserve">Skip to content</a>
    <app-site-header />
    <router-outlet />
    @if (!isScenePage()) {
      <app-breadcrumbs />
      <app-site-footer />
      <app-floating-navigator />
    }
    <app-interactive-cursor />
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly navigation = toSignal(this.router.events);
  readonly pagePath = computed(() => { this.navigation(); return this.router.url.split(/[?#]/)[0] || '/'; });
  readonly isScenePage = computed(() => {
    this.navigation();
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data['layout'] === 'scene';
  });
  constructor() {
    inject(SmoothScrollService);
    inject(RevealMotionService);
    inject(SeoService);
    inject(ThemeService);
    inject(MediaCacheService);
  }
}
