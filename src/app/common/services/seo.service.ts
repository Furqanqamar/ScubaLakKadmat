import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SITE_COPY } from '../../data/site-copy';

interface SeoEntry {
  readonly title: string;
  readonly description: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.update(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.update(event.urlAfterRedirects));
  }

  private update(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    const entry = this.entryFor(path);
    const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '');
    const canonicalUrl = `https://scubalak.com${canonicalPath}`;

    this.title.setTitle(entry.title);
    this.meta.updateTag({ name: 'description', content: entry.description });
    this.meta.updateTag({ property: 'og:title', content: entry.title });
    this.meta.updateTag({ property: 'og:description', content: entry.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: entry.title });
    this.meta.updateTag({ name: 'twitter:description', content: entry.description });

    const canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute('href', canonicalUrl);
  }

  private entryFor(path: string): SeoEntry {
    if (path === '/') return SITE_COPY.seo.home;
    if (path.startsWith('/about')) return SITE_COPY.seo.about;
    if (path.startsWith('/lakshadweep')) return SITE_COPY.seo.lakshadweep;
    if (path.startsWith('/kadmat')) return SITE_COPY.seo.kadmat;
    if (path.startsWith('/experiences/')) return SITE_COPY.seo.detail;
    if (path === '/experiences') return SITE_COPY.seo.experiences;
    if (path.startsWith('/courses/')) return SITE_COPY.seo.courseDetail;
    if (path === '/courses') return SITE_COPY.seo.courses;
    if (path.startsWith('/gallery')) return SITE_COPY.seo.gallery;
    if (path.startsWith('/contact')) return SITE_COPY.seo.contact;
    return SITE_COPY.seo.home;
  }
}
