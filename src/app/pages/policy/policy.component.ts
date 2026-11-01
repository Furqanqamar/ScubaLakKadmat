import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { POLICIES } from '../../data/policies';
import { CONTACT_EMAIL, CONTACT_NUMBERS } from '../../common/services/contact-links';

@Component({
  selector: 'app-policy', standalone: true, imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './policy.component.html', styleUrl: './policy.component.css'
})
export class PolicyComponent {
  private readonly data = toSignal(inject(ActivatedRoute).data);
  readonly key = computed(() => this.data()?.['policy'] as string);
  readonly policy = computed(() => POLICIES[this.key()]);
  readonly route = computed(() => this.key() === 'privacy' ? '/privacy-policy' : '/booking-cancellation-policy');
  readonly contacts = CONTACT_NUMBERS;
  readonly email = CONTACT_EMAIL;
}
