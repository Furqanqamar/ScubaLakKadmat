import { MARINE_SERVICES, PADI_COURSES, TOUR_PACKAGES } from './site-content';
export type EnquiryKind = 'experience' | 'course' | 'package';
export interface EnquiryContext { readonly kind: EnquiryKind; readonly id: string; readonly label: string; readonly category: string; }
export function resolveEnquiry(kind: string | null, id: string | null): EnquiryContext | null {
  if (!id || !/^[a-z0-9-]{1,80}$/.test(id)) return null;
  if (kind === 'course') { const item = PADI_COURSES.find(item => item.id === id); return item ? { kind, id, label: item.title, category: 'courses' } : null; }
  if (kind === 'experience') { const item = MARINE_SERVICES.find(item => item.id === id); return item ? { kind, id, label: item.title, category: id === 'water-sports' ? 'water-sports' : id === 'padi-courses' ? 'courses' : 'diving' } : null; }
  if (kind === 'package') { const item = TOUR_PACKAGES.find(item => item.id === id); return item ? { kind, id, label: item.name, category: 'trip' } : null; }
  return null;
}
export const enquiryParams = (kind: EnquiryKind, id: string): { kind: EnquiryKind; item: string } => ({ kind, item: id });
