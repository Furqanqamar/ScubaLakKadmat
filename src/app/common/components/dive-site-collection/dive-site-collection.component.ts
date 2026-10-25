import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KADMAT_COPY, KADMAT_DIVE_SITES } from '../../../data/kadmat-diving';
import { enquiryParams } from '../../../data/enquiry-context';
import { ResponsiveImageDirective } from '../../directives/responsive-image.directive';
import { DiveIconComponent } from '../dive-icon/dive-icon.component';

@Component({
  selector: 'app-dive-site-collection', standalone: true,
  imports: [RouterLink, DiveIconComponent, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dive-collection" [id]="preview() ? 'kadmat-dive-preview' : 'dive-collection'" [attr.aria-labelledby]="titleId()">
      <div class="kadmat-inner">
        <div class="kadmat-heading"><div><p class="eyebrow">{{ copy.eyebrow }}</p><h2 [id]="titleId()">{{ copy.title }} <em>{{ copy.emphasis }}</em></h2></div><p>{{ copy.introduction }}</p></div>
        @if (!preview()) {
          <div class="dive-collection__search"><label [for]="searchId()">{{ copy.searchLabel }}</label><div><input type="search" [id]="searchId()" [value]="search()" (input)="updateSearch($event)" [placeholder]="copy.searchPlaceholder" maxlength="80" autocomplete="off">@if (search()) { <button type="button" (click)="search.set('')" [attr.aria-label]="copy.clear">×</button> }</div><p role="status" aria-live="polite">{{ sites().length }} {{ copy.results }}</p></div>
        }
        <div class="dive-collection__grid">
          @for (site of sites(); track site.id) {
            <article class="dive-spot-card" [id]="(preview() ? 'preview-' : 'spot-') + site.id" [attr.data-motif]="(site.number - 1) % 3">
              <div class="dive-spot-card__visual">
                @if (site.photo; as photo) { <img [src]="photo.src" [appResponsiveImage]="photo.src" [width]="photo.width" [height]="photo.height" [alt]="photo.alt" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" loading="lazy" decoding="async"> }
                @else {
                  <svg class="reef-lines" viewBox="0 0 400 240" fill="none" aria-hidden="true" focusable="false"><path d="M-30 201C30 87 111 155 173 75S304 7 431 43M-30 224C39 109 122 178 192 96S326 24 431 64M-30 246C56 132 140 203 213 121S347 49 431 88M-30 270C70 155 156 228 234 146S365 71 431 111"/><path d="M-19 65C49 20 120 80 172 35S287-11 422 12M-20 88C53 39 126 101 186 54S307 11 423 34"/><circle cx="326" cy="181" r="5"/><circle cx="344" cy="160" r="3"/><circle cx="337" cy="141" r="2"/></svg>
                  <app-dive-icon [name]="site.motif" context="activity" />
                }
                <span class="dive-spot-card__number">{{ copy.siteLabel }} {{ site.number.toString().padStart(2, '0') }}</span>
              </div>
              <div class="dive-spot-card__copy"><h3>{{ site.name }}</h3><a routerLink="/contact" fragment="enquiry" [queryParams]="enquiryParams('dive-site', site.id)" [attr.aria-label]="copy.askLabel + ' ' + site.name">{{ copy.ask }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
            </article>
          } @empty { <p class="dive-collection__empty">{{ copy.empty }}</p> }
        </div>
        <div class="dive-collection__closing"><div><p>{{ copy.graphicNote }}</p><p>{{ copy.planningNote }}</p></div>@if (preview()) { <a class="button-link button-link--mint" routerLink="/kadmat-dive-sites">{{ copy.viewAll }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a> }</div>
      </div>
    </section>
  `
})
export class DiveSiteCollectionComponent {
  readonly preview = input(true);
  readonly search = signal('');
  readonly copy = KADMAT_COPY.spots;
  readonly enquiryParams = enquiryParams;
  readonly titleId = computed(() => this.preview() ? 'dive-preview-title' : 'dive-collection-title');
  readonly searchId = computed(() => this.titleId() + '-search');
  readonly sites = computed(() => {
    const sites = this.preview() ? KADMAT_DIVE_SITES.filter(site => site.featured) : KADMAT_DIVE_SITES;
    const query = this.search().trim().toLocaleLowerCase('en-IN');
    return sites.filter(site => site.name.toLocaleLowerCase('en-IN').includes(query));
  });
  updateSearch(event: Event): void {
    const target = event.target;
    if (target && 'value' in target && typeof target.value === 'string') this.search.set(target.value);
  }
}
