import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BUSINESS_CONTACT } from '../../../data/business-config';
import { GUEST_REVIEWS, REVIEW_CHECKED_ON, REVIEW_COPY } from '../../../data/guest-reviews';

@Component({
  selector: 'app-guest-reviews', standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="guest-reviews" aria-labelledby="guest-reviews-title">
      <div class="kadmat-inner">
        <div class="kadmat-heading"><div><p class="eyebrow">{{ copy.eyebrow }}</p><h2 id="guest-reviews-title">{{ copy.title }} <em>{{ copy.emphasis }}</em></h2></div><p>{{ copy.introduction }}</p></div>
        <div class="guest-reviews__grid">
          @for (review of reviews; track review.id) {
            <article class="guest-review">
              <div class="guest-review__top"><span>{{ copy.source }}</span><span class="guest-review__rating" role="img" [attr.aria-label]="review.rating + ' ' + copy.ratingSuffix">@for (star of stars; track star) { <i class="fa-solid fa-star" [class.guest-review__star--empty]="star > review.rating" aria-hidden="true"></i> }</span></div>
              <blockquote>“{{ review.quote }}”</blockquote>
              <div class="guest-review__author"><h3>{{ review.name }}</h3><a [href]="review.sourceUrl" target="_blank" rel="noopener noreferrer" [attr.aria-label]="copy.readOriginal + ' · ' + review.name"><span>{{ copy.readOriginal }}</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
            </article>
          }
        </div>
        <div class="guest-reviews__closing"><p>{{ copy.note }}<br>{{ copy.checked }} <time [dateTime]="checkedOn">{{ checkedDate }}</time>.</p>@if (mapsUrl) { <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer">{{ copy.photos }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a> }</div>
      </div>
    </section>
  `
})
export class GuestReviewsComponent {
  readonly copy = REVIEW_COPY;
  readonly reviews = GUEST_REVIEWS;
  readonly checkedOn = REVIEW_CHECKED_ON;
  readonly checkedDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(REVIEW_CHECKED_ON + 'T00:00:00Z'));
  readonly mapsUrl = BUSINESS_CONTACT.mapsUrl;
  readonly stars = [1, 2, 3, 4, 5] as const;
}
