import { GalleryItem } from '../models/site-data.model';
import { ORIGINAL_MEDIA as media } from './original-media.generated';
import { ADDITIONAL_MEDIA as photos } from './additional-media.generated';

export const ISLAND_MOMENTS: readonly GalleryItem[] = [media['kadmat-clear-lagoon'], media['way-to-the-reef'], media['kadmat-evening']];
export const TRAINING_MOMENTS: readonly GalleryItem[] = [media['mask-fitting-training'], media['pre-dive-briefing'], media['beginner-getting-ready']];
export const ABOUT_MOMENTS: readonly GalleryItem[] = [photos['crew-on-the-lagoon'], media['pre-dive-briefing-two'], media['kadmat-beach']];
export const SERVICE_MOMENTS: Readonly<Record<string, readonly GalleryItem[]>> = {
  'lagoon-diving': [media['young-diver-preparation'], media['first-dive-preparation'], media['shore-training']],
  'deep-sea-diving': [photos['open-blue-dive'], media['way-to-the-reef'], photos['sunlit-blue-diver']],
  'padi-courses': TRAINING_MOMENTS,
  'water-sports': ISLAND_MOMENTS
};
