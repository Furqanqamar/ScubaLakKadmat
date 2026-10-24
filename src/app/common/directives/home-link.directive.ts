import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SmoothScrollService } from '../services/smooth-scroll.service';

@Directive({ selector: 'a[appHomeLink]', standalone: true, host: { '(click)': 'activate($event)' } })
export class HomeLinkDirective {
  private readonly router = inject(Router);
  private readonly scroll = inject(SmoothScrollService);
  activate(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if ((this.router.url.split(/[?#]/)[0] || '/') === '/') { event.preventDefault(); this.scroll.scrollToTop(); }
  }
}
