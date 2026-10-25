import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SITE_COPY } from '../../../data/site-copy';

@Component({
  selector: 'app-hero-watermark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-hero__watermark page-hero__watermark--label', 'aria-hidden': 'true' },
  template: '{{ labels[page()] }}'
})
export class HeroWatermarkComponent {
  readonly page = input.required<keyof typeof SITE_COPY.heroWatermarks>();
  readonly labels = SITE_COPY.heroWatermarks;
}
