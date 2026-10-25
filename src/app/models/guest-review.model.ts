export type ReviewRating = 1 | 2 | 3 | 4 | 5;
export interface GuestReview {
  readonly id: string;
  readonly name: string;
  readonly quote: string;
  readonly rating: ReviewRating;
  readonly sourceUrl: string;
}
