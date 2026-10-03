import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactHubComponent } from '../../common/components/contact-hub/contact-hub.component';
import { CONTACT_DETAILS, SOCIAL_LINKS } from '../../data/site-content';
import { ContactRequest } from '../../models/site-data.model';
import { CONTACT_PHONE, configuredSocialUrl } from '../../common/services/contact-links';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, ContactHubComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  readonly phoneUrl = CONTACT_PHONE ? `tel:+${CONTACT_PHONE}` : null;
  readonly socialUrl = configuredSocialUrl;
  readonly details = CONTACT_DETAILS;
  readonly socialLinks = SOCIAL_LINKS;
  readonly enquirySent = signal(false);

  handleContactRequest(_request: ContactRequest): void {
    this.enquirySent.set(true);
  }

  clearEnquiryNotice(): void {
    this.enquirySent.set(false);
  }
}
