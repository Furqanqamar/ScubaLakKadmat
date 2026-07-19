import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type SiteTheme = 'lagoon' | 'midnight';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly activeTheme = signal<SiteTheme>('lagoon');

  constructor() {
    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.activeTheme());
    });
  }

  setTheme(theme: SiteTheme): void {
    this.activeTheme.set(theme);
  }
}
