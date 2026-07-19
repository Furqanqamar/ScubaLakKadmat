import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RevealMotionService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const view = this.document.defaultView;
    const body = this.document.body;
    if (!view || !body || !('IntersectionObserver' in view) || view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new view.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    const observe = (root: ParentNode): void => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (!element.classList.contains('motion-reveal')) {
          element.classList.add('motion-reveal');
          observer.observe(element);
        }
      });
    };

    observe(body);
    const mutationObserver = new view.MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof view.HTMLElement) {
            observe(node);
          }
        });
      }
    });
    mutationObserver.observe(body, { childList: true, subtree: true });

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      mutationObserver.disconnect();
    });
  }
}
