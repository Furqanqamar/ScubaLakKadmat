export type IslandCategory = 'inhabited' | 'visitor' | 'atoll';

export interface IslandMedia {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly srcset: string;
  readonly placeholder: string;
  readonly caption?: string;
  readonly credit?: string;
  readonly license?: string;
  readonly licenseUrl?: string;
  readonly sourceUrl?: string;
}

export interface IslandSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly photo?: string;
}

export interface IslandGuide {
  readonly slug: string;
  readonly name: string;
  readonly category: IslandCategory;
  readonly region: string;
  readonly tagline: string;
  readonly summary: string;
  readonly introduction: string;
  readonly facts: readonly { readonly label: string; readonly value: string }[];
  readonly sections: readonly IslandSection[];
  readonly access: string;
  readonly sources: readonly { readonly label: string; readonly url: string }[];
  readonly related: readonly string[];
}
