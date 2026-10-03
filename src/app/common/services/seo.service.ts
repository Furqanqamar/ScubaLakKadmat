import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { breadcrumbs, canonicalUrl, pageSeo, SITE_URL } from '../../data/seo-data';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  constructor() {
    this.update(this.router.url);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(event => this.update(event.urlAfterRedirects));
  }
  private update(url: string): void {
    const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    const page = pageSeo(path);
    const title = page?.title ?? 'Page not found | Scuba Lak';
    const description = page?.description ?? 'This page is unavailable. Explore diving, courses and travel information for Kadmat Island with Scuba Lak.';
    const canonical = canonicalUrl(path);
    const image = new URL(page?.image ?? 'media/kadmat-hero-poster.jpg', SITE_URL).href;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: page ? 'index, follow, max-image-preview:large' : 'noindex, follow' });
    for (const [key, value] of Object.entries({ title, description, url: canonical, image, 'image:alt': page?.label ?? 'Kadmat Island', locale: 'en_IN', type: 'website' })) this.meta.updateTag({ property: `og:${key}`, content: value });
    for (const [key, value] of Object.entries({ title, description, image, card: 'summary_large_image' })) this.meta.updateTag({ name: `twitter:${key}`, content: value });
    this.document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    const organization = { '@type': 'Organization', '@id': SITE_URL + '#organization', name: 'Scuba Lak', url: SITE_URL, logo: new URL('media/scuba-lak-logo-white.png', SITE_URL).href, location: { '@type': 'Place', name: 'Kadmat Island, Lakshadweep, India' } };
    const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': SITE_URL + '#website', url: SITE_URL, name: 'Scuba Lak — Kadmat Lakshadweep', publisher: { '@id': organization['@id'] }, inLanguage: 'en-IN' }];
    if (page) {
      graph.push({ '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: title, description, inLanguage: 'en-IN', isPartOf: { '@id': SITE_URL + '#website' } });
      if (path !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: breadcrumbs(path).map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: canonicalUrl(item.path) })) });
      if (path.startsWith('/courses/')) graph.push({ '@type': 'Course', name: page.label, description, url: canonical, provider: { '@id': organization['@id'] } });
      if (path.startsWith('/experiences/')) graph.push({ '@type': 'Service', name: page.label, description, url: canonical, provider: { '@id': organization['@id'] }, areaServed: { '@type': 'Place', name: 'Kadmat Island, Lakshadweep' } });
    }
    let structured = this.document.getElementById('site-structured-data');
    if (!structured) { structured = this.document.createElement('script'); structured.id = 'site-structured-data'; structured.setAttribute('type', 'application/ld+json'); this.document.head.appendChild(structured); }
    structured.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  }
}
