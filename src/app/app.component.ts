import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { InteractiveCursorComponent } from './common/components/interactive-cursor/interactive-cursor.component';
import { PageTransitionComponent } from './common/components/page-transition/page-transition.component';
import { SiteFooterComponent } from './common/components/site-footer/site-footer.component';
import { FloatingNavigatorComponent } from './common/components/floating-navigator/floating-navigator.component';
import { SiteHeaderComponent } from './common/components/site-header/site-header.component';
import { RevealMotionService } from './common/services/reveal-motion.service';
import { SmoothScrollService } from './common/services/smooth-scroll.service';
import { SeoService } from './common/services/seo.service';
import { ThemeService } from './common/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteFooterComponent, FloatingNavigatorComponent, InteractiveCursorComponent, PageTransitionComponent, SiteHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-header />
    <router-outlet />
    <app-site-footer />
    <app-floating-navigator />
    <app-interactive-cursor />
    <app-page-transition />
  `
})
export class AppComponent {
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly revealMotion = inject(RevealMotionService);
  private readonly seo = inject(SeoService);
  private readonly theme = inject(ThemeService);
}
