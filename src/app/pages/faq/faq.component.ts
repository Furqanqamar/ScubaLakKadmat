import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FAQ_GROUPS } from '../../data/faq';
import { BOOKING_NOTES } from '../../data/experience-planning';
import { CONTACT_NUMBERS } from '../../common/services/contact-links';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  readonly groups = FAQ_GROUPS;
  readonly reviewed = BOOKING_NOTES.reviewed;
  readonly contacts = CONTACT_NUMBERS;
}
