import content from './island-guides.json';
import { IslandCategory, IslandGuide, IslandMedia } from '../models/island-guide.model';
import { ISLAND_MEDIA } from './island-media.generated';
import { ORIGINAL_MEDIA } from './original-media.generated';
import { ORIGINAL_IMAGE_INFO } from './original-image-info.generated';

function category(value: string): IslandCategory {
  if (value === 'inhabited' || value === 'visitor' || value === 'atoll') return value;
  throw new Error(`Unknown island category: ${value}`);
}

export const ISLAND_COPY = content.ui;
export const ISLAND_GUIDES: readonly IslandGuide[] = content.islands.map(island => ({ ...island, category: category(island.category) }));
export const ISLAND_FILTERS: readonly { readonly id: IslandCategory | 'all'; readonly label: string }[] = [
  { id: 'all', label: ISLAND_COPY.allFilter },
  { id: 'inhabited', label: ISLAND_COPY.inhabitedFilter },
  { id: 'visitor', label: ISLAND_COPY.visitorFilter },
  { id: 'atoll', label: ISLAND_COPY.atollFilter }
];
export const ISLAND_CATEGORY_LABELS: Readonly<Record<IslandCategory, string>> = {
  inhabited: ISLAND_COPY.inhabitedLabel, visitor: ISLAND_COPY.visitorLabel, atoll: ISLAND_COPY.atollLabel
};

const originals = {
  'agatti-original': ORIGINAL_MEDIA['agatti-from-vessel'],
  'amini-original': ORIGINAL_MEDIA['amini-embarkation'],
  'kadmat-original': ORIGINAL_MEDIA['kadmat-beach']
};
const originalPhotos: Readonly<Record<string, IslandMedia>> = Object.fromEntries(Object.entries(originals).map(([key, item]) => [key, {
  src: item.imageUrl, ...ORIGINAL_IMAGE_INFO[item.imageUrl],
  caption: item.description, credit: ISLAND_COPY.originalCredit
}]));

export function islandIllustration(slug: string): IslandMedia {
  const image = ISLAND_MEDIA[slug];
  if (!image) throw new Error(`Missing island illustration: ${slug}`);
  return image;
}

export function islandPhotograph(key: string | undefined): IslandMedia | undefined {
  return key ? originalPhotos[key] ?? ISLAND_MEDIA[key] : undefined;
}

export function islandGuide(slug: string | null): IslandGuide | undefined {
  return ISLAND_GUIDES.find(island => island.slug === slug);
}
