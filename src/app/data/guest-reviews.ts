import content from './guest-reviews.json';
import { GuestReview, ReviewRating } from '../models/guest-review.model';

function rating(value: number): ReviewRating {
  if (Number.isInteger(value) && value >= 1 && value <= 5) return value as ReviewRating;
  throw new Error('Invalid guest review rating');
}
export const REVIEW_COPY = content.copy;
export const REVIEW_CHECKED_ON = content.verifiedOn;
export const GUEST_REVIEWS: readonly GuestReview[] = content.reviews.map(review => ({ ...review, rating: rating(review.rating) }));
