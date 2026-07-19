export type MarineServiceCategory = 'Diving' | 'Course' | 'Water sports';

export type MarineServiceIcon = 'lagoon' | 'deep-sea' | 'course' | 'sports';

export type PackageTier = 'budget' | 'premium';

export type PackageTone = 'sand' | 'coral';

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

export interface TourPackage {
  readonly id: PackageTier;
  readonly tone: PackageTone;
  readonly name: string;
  readonly kicker: string;
  readonly tagline: string;
  readonly priceLabel: string;
  readonly priceNote: string;
  readonly description: string;
  readonly inclusions: readonly string[];
  readonly idealFor: string;
  readonly featured?: boolean;
}

export interface DestinationBriefing {
  readonly id: 'lakshadweep' | 'kadmat' | 'why-us';
  readonly index: string;
  readonly label: string;
  readonly title: string;
  readonly teaser: string;
  readonly body: string;
  readonly detail: string;
}

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly interest: string;
  readonly message: string;
}

export type CourseCategory =
  | 'Beginner certifications'
  | 'Continuing education'
  | 'First aid & safety'
  | 'Specialty diver courses'
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
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly imageUrl: string;
  readonly initials: string;
}

export interface Testimonial {
  readonly quote: string;
  readonly name: string;
  readonly detail: string;
  readonly accent: 'mint' | 'coral' | 'sand';
}

export interface GalleryItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly imageUrl: string;
  readonly size: 'wide' | 'tall' | 'standard';
}

export interface CompanyMilestone {
  readonly year: string;
  readonly title: string;
  readonly description: string;
}

export interface IslandProfile {
  readonly name: string;
  readonly type: string;
  readonly orientation: string;
  readonly description: string;
  readonly highlight: string;
  readonly imageUrl: string;
}

export interface KadmatAttraction {
  readonly id: string;
  readonly title: string;
  readonly location: string;
  readonly description: string;
  readonly imageUrl: string;
}

export interface TransportOption {
  readonly id: string;
  readonly mode: string;
  readonly title: string;
  readonly duration: string;
  readonly cost: string;
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
