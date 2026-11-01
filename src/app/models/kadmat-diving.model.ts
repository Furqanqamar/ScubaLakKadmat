import { DiveIconName } from './dive-icon.model';

export interface KadmatDiveSite {
  readonly number: number;
  readonly id: string;
  readonly name: string;
}

export interface KadmatReason {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly icon: DiveIconName;
}
