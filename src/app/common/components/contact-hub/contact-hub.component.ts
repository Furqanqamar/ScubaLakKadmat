import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ENQUIRY_COPY } from '../../../data/enquiry-copy';
import { resolveEnquiry } from '../../../data/enquiry-context';
import { ContactRequest } from '../../../models/site-data.model';
import { ENQUIRY_DELIVERY_CONFIG, EnquiryDeliveryService } from '../../services/enquiry-delivery.service';
import { validateEnquiry } from '../../services/enquiry-validation';
import { CONTACT_EMAIL, CONTACT_NUMBERS, whatsappLink } from '../../services/contact-links';

@Component({
  selector: 'app-contact-hub', standalone: true, imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-hub.component.html', styleUrl: './contact-hub.component.css'
})
export class ContactHubComponent {
  readonly copy = ENQUIRY_COPY;
  readonly mode = inject(ENQUIRY_DELIVERY_CONFIG).mode;
  readonly emailAddress = CONTACT_EMAIL;
  private readonly document = inject(DOCUMENT);
  private readonly delivery = inject(EnquiryDeliveryService);
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap);
  readonly form = signal<ContactRequest>({ name: '', email: '', phone: '', interest: 'general', message: '', context: null });
  readonly website = signal('');
  private readonly startedAt = Date.now();
  readonly attempted = signal(false);
  readonly status = signal<'idle' | 'submitting' | 'accepted' | 'prepared' | 'error'>('idle');
  readonly available = computed(() => this.mode === 'endpoint' || (this.mode === 'email-client' && !!CONTACT_EMAIL));
  readonly errors = computed(() => validateEnquiry(this.form()));
  readonly messageText = computed(() => {
    const form = this.form();
    return [`Scuba Lak enquiry`, `Name: ${form.name}`, `Email: ${form.email}`, form.phone ? `Phone: ${form.phone}` : '', form.context ? `Selection: ${form.context.label}` : form.interest !== 'general' ? `About: ${this.copy.categories.find(item => item.id === form.interest)?.label ?? 'General enquiry'}` : '', 'Your plans:', form.message].filter(Boolean).join('\n');
  });
  readonly hasErrors = computed(() => Object.keys(this.errors()).length > 0);
  readonly contactOptions = computed(() => CONTACT_NUMBERS.map(contact => ({ ...contact, whatsappHref: contact.whatsappHref ? whatsappLink(this.messageText(), contact.number) : null })));
  constructor() {
    effect(() => {
      const params = this.params(); if (!params) return;
      const context = resolveEnquiry(params.get('kind'), params.get('item'));
      const interest = this.copy.categories.find(category => category.id === params.get('interest'))?.id;
      this.form.update(form => ({ ...form, interest: context?.category ?? interest ?? 'general', context }));
    });
  }
  setField(field: 'name' | 'email' | 'phone' | 'message', event: Event): void {
    const target = event.target;
    if (!target || !('value' in target) || typeof target.value !== 'string') return;
    const value = target.value;
    this.form.update(form => ({ ...form, [field]: value }));
    if (this.status() !== 'submitting') this.status.set('idle');
  }
  showError(field: keyof ContactRequest): boolean { return this.attempted() && !!this.errors()[field]; }
  setWebsite(event: Event): void {
    const target = event.target;
    if (target && 'value' in target && typeof target.value === 'string') this.website.set(target.value);
  }
  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.status() === 'submitting' || this.status() === 'accepted' || !this.available()) return;
    this.attempted.set(true);
    if (Object.keys(this.errors()).length) { this.document.querySelector<HTMLElement>('#enquiry-form [aria-invalid="true"]')?.focus(); return; }
    if (this.mode === 'email-client' && CONTACT_EMAIL) {
      this.document.defaultView?.location.assign(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Scuba Lak enquiry · ' + (this.form().context?.label ?? 'Kadmat visit'))}&body=${encodeURIComponent(this.messageText())}`);
      this.status.set('prepared'); return;
    }
    this.status.set('submitting');
    try { await this.delivery.submit(this.form(), { website: this.website(), startedAt: this.startedAt }); this.status.set('accepted'); }
    catch { this.status.set('error'); }
  }
}
