import { afterNextRender, computed, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { ORIGINAL_IMAGE_INFO } from '../../data/original-image-info.generated';
import { ISLAND_MEDIA } from '../../data/island-media.generated';

const ISLAND_IMAGE_INFO = Object.fromEntries(Object.values(ISLAND_MEDIA).map(image => [image.src, image]));

@Directive({
  selector: 'img[appResponsiveImage]',
  standalone: true,
  host: {
    '[attr.srcset]': 'srcset()', '[attr.sizes]': 'sizes()',
    '[class.media-image]': 'true', '[class.media-image--loaded]': 'loaded()',
    '[style.background-image]': 'placeholder()', '(load)': 'loaded.set(true)', '(error)': 'loaded.set(true)'
  }
})
export class ResponsiveImageDirective {
  readonly appResponsiveImage = input.required<string>();
  readonly sizes = input('(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw');
  readonly loaded = signal(false);
  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);
  readonly placeholder = computed(() => {
    const info = ORIGINAL_IMAGE_INFO[this.appResponsiveImage()] ?? ISLAND_IMAGE_INFO[this.appResponsiveImage()];
    return info ? `url("${info.placeholder}")` : null;
  });
  constructor() {
    effect(() => { this.appResponsiveImage(); this.loaded.set(false); });
    afterNextRender(() => { if (this.element.nativeElement.complete) this.loaded.set(true); });
  }
  readonly srcset = computed(() => {
    const source = this.appResponsiveImage();
    if (ORIGINAL_IMAGE_INFO[source]) return ORIGINAL_IMAGE_INFO[source].srcset;
    if (ISLAND_IMAGE_INFO[source]) return ISLAND_IMAGE_INFO[source].srcset;
    if (!source.includes('media/generated/') || !source.endsWith('.webp')) return null;
    const stem = source.slice(0, -5);
    return `${stem}-480.webp 480w, ${stem}-800.webp 800w, ${source} 1536w`;
  });
}
