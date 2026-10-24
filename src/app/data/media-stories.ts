import { GalleryItem } from '../models/site-data.model';
import { ORIGINAL_MEDIA as media } from './original-media.generated';

export const ISLAND_MOMENTS: readonly GalleryItem[] = [media['kadmat-clear-lagoon'], media['way-to-the-reef'], media['kadmat-evening']];
export const TRAINING_MOMENTS: readonly GalleryItem[] = [media['mask-fitting-training'], media['pre-dive-briefing'], media['beginner-getting-ready']];
export const ABOUT_MOMENTS: readonly GalleryItem[] = [media['dive-preparation'], media['pre-dive-briefing-two'], media['kadmat-beach']];
export const SERVICE_MOMENTS: Readonly<Record<string, readonly GalleryItem[]>> = {
  'lagoon-diving': [media['young-diver-preparation'], media['first-dive-preparation'], media['shore-training']],
  'deep-sea-diving': [media['preparation-at-sea'], media['way-to-the-reef'], media['pre-dive-preparation']],
  'padi-courses': TRAINING_MOMENTS,
  'water-sports': ISLAND_MOMENTS
};
