import type { DiveIconName } from './dive-icon.model';

export type MarineServiceCategory = 'Diving' | 'Course' | 'Water sports';

export type MarineServiceIcon = 'lagoon' | 'deep-sea' | 'course' | 'sports';

export interface MarineService {
  readonly id: string;
  readonly category: MarineServiceCategory;
  readonly icon: MarineServiceIcon;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly detailedDescription: string;
  readonly depth: string;
  readonly audience: string;
  readonly duration: string;
  readonly badge?: string;
  readonly imageUrl: string;
  readonly highlights: readonly string[];
}

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly interest: string;
  readonly message: string;
  readonly context?: { readonly kind: 'experience' | 'course' | 'dive-site'; readonly id: string; readonly label: string } | null;
}

export type CourseCategory =
  | 'Beginner certifications'
  | 'Continuing education'
  | 'First aid & safety'
  | 'Professional development'
  | 'Youth & introductory';

export interface PadiCourse {
  readonly id: string;
  readonly category: CourseCategory;
  readonly eyebrow: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly about: string;
  readonly duration: string;
  readonly minimumAge: string;
  readonly prerequisite: string;
  readonly depth: string;
  readonly structure: readonly string[];
  readonly taught: readonly string[];
  readonly outcome: string;
  readonly imageUrl: string;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly width: number;
  readonly height: number;
}

export interface SiteBenefit {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  readonly icon: DiveIconName;
}

export type MediaCategory = 'Diving & training' | 'Island life' | 'Island journeys' | 'Team' | 'Reef & island views';

interface GalleryItemBase {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly imageUrl: string;
  readonly size: 'wide' | 'tall' | 'standard';
  readonly category?: MediaCategory;
  readonly width?: number;
  readonly height?: number;
}

export type GalleryItem = GalleryItemBase & (
  { readonly kind?: 'image' } |
  { readonly kind: 'video'; readonly videoUrl: string; readonly videoUrlMobile: string; readonly durationLabel: string }
);

export interface TransportOption {
  readonly id: string;
  readonly mode: string;
  readonly title: string;
  readonly duration: string;
  readonly booking: string;
  readonly note: string;
  readonly imageUrl: string;
}

export interface SocialLink {
  readonly label: string;
  readonly handle: string;
  readonly href: string;
  readonly icon: string;
}

export interface ContactDetails {
  readonly address: string;
  readonly area: string;
  readonly phone: string;
  readonly email: string;
  readonly officeHours: string;
  readonly responseTime: string;
}
