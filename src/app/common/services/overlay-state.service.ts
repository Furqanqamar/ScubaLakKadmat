import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayStateService {
  private readonly document = inject(DOCUMENT);
  private readonly overlays = new Set<symbol>();
  readonly active = signal(false);
  acquire(): () => void {
    const key = Symbol('overlay');
    this.overlays.add(key);
    this.sync();
    return () => { this.overlays.delete(key); this.sync(); };
  }
  private sync(): void {
    const active = this.overlays.size > 0;
    this.active.set(active);
    this.document.documentElement.classList.toggle('dialog-open', active);
  }
}
