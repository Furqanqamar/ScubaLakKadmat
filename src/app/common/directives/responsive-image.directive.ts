import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: 'img[appResponsiveImage]',
  standalone: true,
  host: { '[attr.srcset]': 'srcset()', '[attr.sizes]': 'sizes()' }
})
export class ResponsiveImageDirective {
  readonly appResponsiveImage = input.required<string>();
  readonly sizes = input('(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw');
  readonly srcset = computed(() => {
    const source = this.appResponsiveImage();
    if (!source.includes('media/generated/') || !source.endsWith('.webp')) return null;
    const stem = source.slice(0, -5);
    return `${stem}-480.webp 480w, ${stem}-800.webp 800w, ${source} 1536w`;
  });
}
