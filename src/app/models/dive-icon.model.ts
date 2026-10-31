/** The shared, decorative line-art vocabulary for diving and island activities. */
export type DiveIconName =
  | 'kayak'
  | 'schedule'
  | 'mask'
  | 'tanks'
  | 'coral'
  | 'instructor'
  | 'lagoon'
  | 'deep-diver'
  | 'certification'
  | 'boat'
  | 'fishing'
  | 'compass'
  | 'rescue';

export interface DiveIconPath {
  readonly d: string;
  readonly transform?: string;
}

export type DiveIconContext = 'inline' | 'benefit' | 'benefit-detail' | 'service' | 'course' | 'detail' | 'activity';
