import content from './kadmat-diving.json';
import { DIVE_ICONS } from './dive-icons';
import { DiveIconName } from '../models/dive-icon.model';
import { KadmatDiveSite, KadmatReason } from '../models/kadmat-diving.model';

function icon(name: string): DiveIconName {
  if (Object.hasOwn(DIVE_ICONS, name)) return name as DiveIconName;
  throw new Error(`Unknown Kadmat graphic: ${name}`);
}

export const KADMAT_COPY = content.copy;
export const KADMAT_REASONS: readonly KadmatReason[] = content.reasons.map(reason => ({ ...reason, icon: icon(reason.icon) }));
export const KADMAT_DIVE_SITES: readonly KadmatDiveSite[] = content.sites.map((site, index) => ({ ...site, number: index + 1 }));
