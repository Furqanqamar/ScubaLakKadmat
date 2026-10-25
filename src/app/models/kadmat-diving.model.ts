import { DiveIconName } from './dive-icon.model';

export interface KadmatDivePhoto {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface KadmatDiveSite {
  readonly number: number;
  readonly id: string;
  readonly name: string;
  readonly motif: DiveIconName;
  readonly featured: boolean;
  readonly photo: KadmatDivePhoto | null;
}

export interface KadmatReason {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly icon: DiveIconName;
}
