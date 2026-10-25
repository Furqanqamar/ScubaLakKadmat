import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactHubComponent } from '../../common/components/contact-hub/contact-hub.component';
import { BUSINESS_CONTACT } from '../../data/business-config';
import { CONTACT_EMAIL, CONTACT_PHONE, configuredSocialUrl } from '../../common/services/contact-links';
import { TravelFaqComponent } from '../../common/components/travel-faq/travel-faq.component';
import { ResponsiveImageDirective } from '../../common/directives/responsive-image.directive';
import { ADDITIONAL_MEDIA } from '../../data/additional-media.generated';

@Component({
  selector: 'app-contact', standalone: true,
  imports: [RouterLink, ContactHubComponent, TravelFaqComponent, ResponsiveImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './contact.component.html'
})
export class ContactComponent {
  readonly cover = ADDITIONAL_MEDIA['crew-on-the-lagoon'];
  readonly details = BUSINESS_CONTACT;
  readonly email = CONTACT_EMAIL;
  readonly phone = CONTACT_PHONE;
  readonly socials = BUSINESS_CONTACT.socials.filter(item => configuredSocialUrl(item.href));
}
