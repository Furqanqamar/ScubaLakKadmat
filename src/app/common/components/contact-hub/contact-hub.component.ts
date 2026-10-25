import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BUSINESS_CONTACT } from '../../../data/business-config';
import { ENQUIRY_COPY } from '../../../data/enquiry-copy';
import { resolveEnquiry } from '../../../data/enquiry-context';
import { MARINE_SERVICES, PADI_COURSES } from '../../../data/site-content';
import { KADMAT_DIVE_SITES } from '../../../data/kadmat-diving';
import { ContactRequest } from '../../../models/site-data.model';
import { ENQUIRY_DELIVERY_CONFIG, EnquiryDeliveryService } from '../../services/enquiry-delivery.service';
import { validateEnquiry } from '../../services/enquiry-validation';
import { CONTACT_EMAIL, CONTACT_PHONE, whatsappLink } from '../../services/contact-links';

@Component({
  selector: 'app-contact-hub', standalone: true, imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-hub.component.html', styleUrl: './contact-hub.component.css'
})
export class ContactHubComponent {
  readonly copy = ENQUIRY_COPY;
  readonly mode = inject(ENQUIRY_DELIVERY_CONFIG).mode;
  readonly contact = BUSINESS_CONTACT;
  readonly emailAddress = CONTACT_EMAIL;
  readonly phoneLink = CONTACT_PHONE ? `tel:${CONTACT_PHONE}` : null;
  private readonly document = inject(DOCUMENT);
  private readonly delivery = inject(EnquiryDeliveryService);
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap);
  readonly form = signal<ContactRequest>({ name: '', email: '', phone: '', interest: 'general', message: '', arrivalDate: '', flexibility: '', guests: null, experienceLevel: '', context: null });
  readonly attempted = signal(false);
  readonly status = signal<'idle' | 'submitting' | 'accepted' | 'prepared' | 'error'>('idle');
  readonly available = computed(() => this.mode === 'endpoint' || (this.mode === 'email-client' && !!CONTACT_EMAIL));
  readonly options = computed(() => {
    switch (this.form().interest) {
      case 'courses': return [{ value: 'experience:padi-courses', label: this.copy.chooseCourse }, ...PADI_COURSES.map(item => ({ value: `course:${item.id}`, label: item.title }))];
      case 'diving': return [...MARINE_SERVICES.filter(item => item.category === 'Diving').map(item => ({ value: `experience:${item.id}`, label: item.title })), ...KADMAT_DIVE_SITES.map(item => ({ value: `dive-site:${item.id}`, label: item.name }))];
      case 'water-sports': return MARINE_SERVICES.filter(item => item.id === 'water-sports').map(item => ({ value: `experience:${item.id}`, label: item.title }));
      default: return [];
    }
  });
  readonly selected = computed(() => this.form().context ? `${this.form().context!.kind}:${this.form().context!.id}` : '');
  readonly errors = computed(() => validateEnquiry(this.form()));
  readonly messageText = computed(() => {
    const form = this.form();
    return [`Scuba Lak enquiry`, `Name: ${form.name}`, `Email: ${form.email}`, form.phone ? `Phone: ${form.phone}` : '', `Interest: ${this.copy.categories.find(item => item.id === form.interest)?.label ?? 'General enquiry'}`, form.context ? `Selection: ${form.context.label}` : '', form.arrivalDate ? `Preferred arrival: ${form.arrivalDate}` : '', form.flexibility ? `Date flexibility: ${form.flexibility}` : '', form.guests ? `Guests: ${form.guests}` : '', form.experienceLevel ? `Experience: ${form.experienceLevel}` : '', '', form.message].filter(Boolean).join('\n');
  });
  readonly hasErrors = computed(() => Object.keys(this.errors()).length > 0);
  readonly whatsapp = computed(() => whatsappLink(this.messageText()));
  constructor() {
    effect(() => {
      const params = this.params(); if (!params) return;
      const context = resolveEnquiry(params.get('kind'), params.get('item'));
      const interest = this.copy.categories.find(category => category.id === params.get('interest'))?.id;
      this.form.update(form => ({ ...form, interest: context?.category ?? interest ?? 'general', context }));
    });
  }
  setField(field: keyof ContactRequest, event: Event): void {
    const target = event.target;
    if (!target || !('value' in target) || typeof target.value !== 'string') return;
    const value = target.value;
    if (field === 'context') return;
    this.form.update(form => ({ ...form, [field]: field === 'guests' ? (value === '' ? null : Number(value)) : value, ...(field === 'interest' ? { context: null } : {}) }));
    if (this.status() !== 'submitting') this.status.set('idle');
  }
  selectItem(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const [kind, id] = value.split(':');
    this.form.update(form => ({ ...form, context: resolveEnquiry(kind, id) }));
  }
  showError(field: keyof ContactRequest): boolean { return this.attempted() && !!this.errors()[field]; }
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
    try { await this.delivery.submit(this.form()); this.status.set('accepted'); }
    catch { this.status.set('error'); }
  }
}
