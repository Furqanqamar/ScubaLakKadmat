import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { SITE_COPY } from '../../../data/site-copy';
import { ContactRequest } from '../../../models/site-data.model';

type ContactField = keyof ContactRequest;

type ValidationErrors = Partial<Record<ContactField, string>>;

const WHATSAPP_NUMBER = '919447XXXXXX';
const CONTACT_EMAIL = 'hello@scubalak.com';

@Component({
  selector: 'app-contact-hub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#10282d] px-5 py-7 text-white shadow-2xl shadow-[#071417]/20 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <div class="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#b8f2df]/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#e5c878]/10 blur-3xl"></div>

      <div class="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p class="eyebrow text-[#b8f2df]">Make it real</p>
          <h2 class="mt-5 max-w-md font-serif text-4xl leading-[0.98] tracking-[-0.04em] sm:text-5xl">Your next tide is one message away.</h2>
          <p class="mt-6 max-w-md text-sm leading-7 text-white/65">Tell us what you want to see below the surface. Our dive team will shape the right day, gear and guide around you.</p>

          <div class="mt-9 space-y-3">
            <a class="contact-link group" [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer">
              <span class="contact-link__mark bg-[#b8f2df] text-[#061419]" aria-hidden="true"><i class="fa-brands fa-whatsapp"></i></span>
              <span><strong>WhatsApp the dive desk</strong><small>{{ copy.common.fastestResponse }}</small></span>
              <i class="fa-solid fa-arrow-right ml-auto text-white/40 transition group-hover:translate-x-1 group-hover:text-[#b8f2df]" aria-hidden="true"></i>
            </a>
            <button class="contact-link group w-full text-left" type="button" (click)="openMailClient()">
              <span class="contact-link__mark bg-[#e5c878] text-[#061419]" aria-hidden="true"><i class="fa-solid fa-envelope"></i></span>
              <span><strong>{{ copy.common.emailClient }}</strong><small>{{ contactEmail }}</small></span>
              <i class="fa-solid fa-arrow-right ml-auto text-white/40 transition group-hover:translate-x-1 group-hover:text-[#e5c878]" aria-hidden="true"></i>
            </button>
          </div>

          <div class="mt-10 border-t border-white/10 pt-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40">
            <span class="mr-3 inline-block h-2 w-2 rounded-full bg-[#b8f2df] shadow-[0_0_14px_#b8f2df]"></span>
            {{ copy.common.kadmatLocation }}
          </div>
        </div>

        <form class="rounded-[1.75rem] border border-white/10 bg-black/10 p-5 sm:p-7" novalidate (submit)="submitForm($event)">
          @if (isSubmitted()) {
            <div class="flex min-h-[25rem] flex-col items-center justify-center text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full border border-[#b8f2df]/40 bg-[#b8f2df]/10 text-2xl text-[#b8f2df]" aria-hidden="true">✓</div>
              <p class="eyebrow mt-6 text-[#b8f2df]">Message received</p>
              <h3 class="mt-3 font-serif text-3xl">We’ll meet you at the reef.</h3>
              <p class="mt-3 max-w-sm text-sm leading-6 text-white/60">Your request is ready to send. For the quickest confirmation, continue in WhatsApp using the button below.</p>
              <div class="mt-7 flex flex-wrap justify-center gap-3">
                <button class="button button--mint" type="button" (click)="openWhatsApp()">{{ copy.common.continueWhatsApp }} <i class="fa-solid fa-location-arrow" aria-hidden="true"></i></button>
                <button class="button button--ghost" type="button" (click)="startAnotherRequest()">Send another</button>
              </div>
            </div>
          } @else {
            <div class="mb-7 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p class="eyebrow text-white/45">The dive desk</p>
                <h3 class="mt-2 font-serif text-2xl">Plan your blue hour.</h3>
              </div>
              <span class="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#b8f2df]">01 / 04</span>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <label class="field">
                <span>Name <em>*</em></span>
                <input autocomplete="name" [value]="name()" (input)="setField('name', $event)" placeholder="Your full name">
                @if (showError('name')) { <small>{{ errors().name }}</small> }
              </label>
              <label class="field">
                <span>Email <em>*</em></span>
                <input type="email" autocomplete="email" [value]="email()" (input)="setField('email', $event)" placeholder="you@example.com">
                @if (showError('email')) { <small>{{ errors().email }}</small> }
              </label>
              <label class="field">
                <span>WhatsApp / phone</span>
                <input type="tel" autocomplete="tel" [value]="phone()" (input)="setField('phone', $event)" placeholder="+91 ...">
              </label>
              <label class="field">
                <span>I'm curious about <em>*</em></span>
                <select [value]="interest()" (change)="setField('interest', $event)">
                  <option value="" disabled>Select an experience</option>
                  @for (option of interestOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                @if (showError('interest')) { <small>{{ errors().interest }}</small> }
              </label>
              <label class="field sm:col-span-2">
                <span>Say hello <em>*</em></span>
                <textarea rows="4" [value]="message()" (input)="setField('message', $event)" placeholder="Tell us your dates, experience level or dream marine encounter..."></textarea>
                @if (showError('message')) { <small>{{ errors().message }}</small> }
              </label>
            </div>

            <div class="mt-7 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p class="max-w-xs text-xs leading-5 text-white/40">No commitment, no pressure. Just a considered reply from a real human on the island.</p>
              <button class="button button--mint" type="submit">{{ copy.common.sendEnquiry }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
            </div>
          }
        </form>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .contact-link { display: flex; align-items: center; gap: 0.75rem; border: 1px solid rgba(255,255,255,.1); border-radius: 1rem; padding: .7rem .8rem; color: rgba(255,255,255,.9); transition: border-color .2s ease, background .2s ease; }
    .contact-link:hover { border-color: rgba(184,242,223,.45); background: rgba(255,255,255,.04); }
    .contact-link__mark { display: grid; width: 2rem; height: 2rem; flex: none; place-items: center; border-radius: .65rem; font-size: .85rem; }
    .contact-link strong { display: block; font-size: .78rem; font-weight: 700; }
    .contact-link small { display: block; margin-top: .15rem; color: rgba(255,255,255,.4); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .59rem; letter-spacing: .03em; }
    .field { display: block; }
    .field > span { display: block; margin-bottom: .55rem; color: rgba(255,255,255,.65); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: .62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .field em { color: #b8f2df; font-style: normal; }
    .field input, .field select, .field textarea { width: 100%; border: 1px solid rgba(255,255,255,.13); border-radius: .8rem; background: rgba(255,255,255,.06); padding: .8rem .85rem; color: white; font: inherit; font-size: .82rem; outline: none; transition: border-color .2s ease, background .2s ease; }
    .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,.27); }
    .field select { color-scheme: dark; }
    .field option { background: #10282d; color: white; }
    .field textarea { resize: vertical; min-height: 7.5rem; }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #b8f2df; background: rgba(184,242,223,.08); }
    .field small { display: block; margin-top: .45rem; color: #ffb8a8; font-size: .68rem; }
    .button { display: inline-flex; align-items: center; justify-content: center; gap: .6rem; border-radius: 999px; padding: .75rem 1.05rem; font-size: .72rem; font-weight: 800; transition: transform .2s ease, background .2s ease, color .2s ease; }
    .button:hover { transform: translateY(-2px); }
    .button--mint { background: #b8f2df; color: #061419; }
    .button--mint:hover { background: #e2fff5; }
    .button--ghost { border: 1px solid rgba(255,255,255,.18); color: rgba(255,255,255,.8); }
    .button--ghost:hover { border-color: rgba(255,255,255,.45); color: white; }
    .button:focus-visible, .contact-link:focus-visible { outline: 2px solid #b8f2df; outline-offset: 3px; }
  `
})
export class ContactHubComponent {
  readonly copy = SITE_COPY;
  readonly requestSent = output<ContactRequest>();
  private readonly document = inject(DOCUMENT);

  readonly name = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly interest = signal('');
  readonly message = signal('');
  readonly hasAttemptedSubmit = signal(false);
  readonly isSubmitted = signal(false);

  readonly interestOptions = [
    'Lagoon diving',
    'Deep sea diving',
    'PADI certification',
    'Water sports',
    'A complete island package'
  ] as const;

  readonly contactEmail = CONTACT_EMAIL;
  readonly formState = computed<ContactRequest>(() => ({
    name: this.name().trim(),
    email: this.email().trim(),
    phone: this.phone().trim(),
    interest: this.interest().trim(),
    message: this.message().trim()
  }));

  readonly errors = computed<ValidationErrors>(() => {
    const form = this.formState();
    const validationErrors: ValidationErrors = {};

    if (form.name.length < 2) {
      validationErrors.name = 'Please enter your name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = 'Please enter a valid email.';
    }
    if (form.interest.length === 0) {
      validationErrors.interest = 'Choose one experience.';
    }
    if (form.message.length < 12) {
      validationErrors.message = 'A few more details would help us plan.';
    }

    return validationErrors;
  });

  readonly whatsappUrl = computed(() => {
    const form = this.formState();
    const text = [
      'Hello Scuba Lak, Kadmat Lakshadweep,',
      `I am ${form.name || 'interested in visiting Kadmat'}.`,
      `I would love to know more about ${form.interest || 'your experiences'}.`,
      form.message ? `Here are my details: ${form.message}` : ''
    ].filter(Boolean).join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  });

  readonly mailtoUrl = computed(() => {
    const form = this.formState();
    const subject = encodeURIComponent(`Kadmat enquiry · ${form.interest || 'new guest'}`);
    const body = encodeURIComponent([
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || 'Not provided'}`,
      `Interest: ${form.interest}`,
      '',
      form.message
    ].join('\n'));

    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });

  setField(field: ContactField, event: Event): void {
    const value = this.readEventValue(event);

    switch (field) {
      case 'name':
        this.name.set(value);
        break;
      case 'email':
        this.email.set(value);
        break;
      case 'phone':
        this.phone.set(value);
        break;
      case 'interest':
        this.interest.set(value);
        break;
      case 'message':
        this.message.set(value);
        break;
    }

    this.isSubmitted.set(false);
  }

  showError(field: ContactField): boolean {
    return this.hasAttemptedSubmit() && Boolean(this.errors()[field]);
  }

  submitForm(event: SubmitEvent): void {
    event.preventDefault();
    this.hasAttemptedSubmit.set(true);

    if (Object.keys(this.errors()).length > 0) {
      return;
    }

    this.isSubmitted.set(true);
    this.requestSent.emit(this.formState());
  }

  startAnotherRequest(): void {
    this.hasAttemptedSubmit.set(false);
    this.isSubmitted.set(false);
  }

  openWhatsApp(): void {
    if (Object.keys(this.errors()).length > 0) {
      this.hasAttemptedSubmit.set(true);
      this.isSubmitted.set(false);
      return;
    }

    const openedWindow = this.document.defaultView?.open(this.whatsappUrl(), '_blank', 'noopener,noreferrer');
    if (openedWindow) {
      openedWindow.opener = null;
    }
  }

  openMailClient(): void {
    this.document.defaultView?.location.assign(this.mailtoUrl());
  }

  private readEventValue(event: Event): string {
    const target = event.target;
    if (!target || !('value' in target) || typeof target.value !== 'string') {
      return '';
    }

    return target.value;
  }
}
