import '@angular/compiler';
import assert from 'node:assert/strict';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { computed, Injector, runInInjectionContext, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ENQUIRY_DELIVERY_CONFIG, EnquiryDeliveryService } from '../src/app/common/services/enquiry-delivery.service';
import { resolveEnquiry } from '../src/app/data/enquiry-context';
import { EnquiryDeliveryConfig } from '../src/app/data/business-config';
import { ContactHubComponent } from '../src/app/common/components/contact-hub/contact-hub.component';
import { validateEnquiry } from '../src/app/common/services/enquiry-validation';
import { OverlayStateService } from '../src/app/common/services/overlay-state.service';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_NUMBERS, CONTACT_WHATSAPP, whatsappLink } from '../src/app/common/services/contact-links';

assert.equal(CONTACT_EMAIL, 'hello@scubalak.com', 'Use the owner’s GoDaddy business mailbox');
assert.equal(CONTACT_PHONE, '+919447982559', 'Keep the existing primary call number');
assert.deepEqual(CONTACT_WHATSAPP, [
  { number: '+919447982559', displayNumber: '+91 94479 82559', href: 'https://wa.me/919447982559' },
  { number: '+919400205847', displayNumber: '+91 94002 05847', href: 'https://wa.me/919400205847' }
]);
assert.deepEqual(CONTACT_NUMBERS, [
  { number: '+919447982559', displayNumber: '+91 94479 82559', callHref: 'tel:+919447982559', whatsappHref: 'https://wa.me/919447982559' },
  { number: '+919400205847', displayNumber: '+91 94002 05847', callHref: 'tel:+919400205847', whatsappHref: 'https://wa.me/919400205847' }
], 'Both contacts need separate call and WhatsApp destinations');
const whatsappMessage = 'Scuba Lak enquiry\nName: Test visitor\nSelection: Secret Garden · Kadmat dive spot\nDates & guests: 2 + 1 🤿';
for (const contact of CONTACT_WHATSAPP) {
  const href = whatsappLink(whatsappMessage, contact.number);
  assert.ok(href);
  const link = new URL(href);
  assert.equal(link.origin + link.pathname, contact.href);
  assert.equal(link.searchParams.get('text'), whatsappMessage, 'Preserve complete enquiry text for either number');
  assert.equal([...link.searchParams.keys()].length, 1);
}
assert.equal(whatsappLink(whatsappMessage), whatsappLink(whatsappMessage, CONTACT_WHATSAPP[0].number));
for (const invalid of [null, '', '9400205847', '+919400205847?text=other', '+0']) assert.equal(whatsappLink(whatsappMessage, invalid), null);

// Isolated mock transport only: no requests leave this process.
const request = { name: 'Test visitor', email: 'test@example.test', phone: '', interest: 'courses', message: 'A mock enquiry for testing.' };
async function attempt(configuration: EnquiryDeliveryConfig, acknowledgement: unknown, networkError = false): Promise<{ calls: number; accepted: boolean }> {
  let calls = 0;
  const injector = Injector.create({ providers: [
    { provide: ENQUIRY_DELIVERY_CONFIG, useValue: configuration },
    { provide: HttpClient, useValue: { post: (_url: string, body: Record<string, unknown>) => { calls++; assert.equal(body['website'], ''); assert.ok(Number.isSafeInteger(body['formAgeMs'])); assert.ok(Number(body['formAgeMs']) >= 5000); assert.ok(!('startedAt' in body)); return networkError ? throwError(() => new Error('Mock network failure')) : of(acknowledgement); } } }
  ] });
  const service = runInInjectionContext(injector, () => new EnquiryDeliveryService());
  try { await service.submit(request, { website: '', startedAt: Date.now() - 5000 }); return { calls, accepted: true }; }
  catch { return { calls, accepted: false }; }
}
assert.deepEqual(await attempt({ mode: 'unconfigured' }, { accepted: true }), { calls: 0, accepted: false });
assert.deepEqual(await attempt({ mode: 'endpoint', url: 'https://test.invalid/enquiries' }, { accepted: true }), { calls: 1, accepted: true });
assert.equal((await attempt({ mode: 'endpoint', url: 'https://test.invalid/enquiries' }, { success: true })).accepted, false);
assert.equal((await attempt({ mode: 'endpoint', url: 'https://test.invalid/enquiries' }, null, true)).accepted, false);
assert.equal((await attempt({ mode: 'endpoint', url: 'http://test.invalid/enquiries' }, { accepted: true })).calls, 0);
assert.equal(resolveEnquiry('course', 'open-water-diver')?.category, 'courses');
assert.equal(resolveEnquiry('experience', 'lagoon-diving')?.label, 'Lagoon diving');
assert.deepEqual(resolveEnquiry('dive-site', 'secret-garden'), { kind: 'dive-site', id: 'secret-garden', label: 'Secret Garden · Kadmat dive spot', category: 'diving' });
assert.equal(resolveEnquiry('dive-site', 'not-a-site'), null);
assert.equal(resolveEnquiry('dive-site', '../private'), null);
assert.equal(resolveEnquiry('package', 'premium'), null);
assert.equal(resolveEnquiry('course', 'deep-diver'), null);
assert.equal(resolveEnquiry('course', '../private'), null);
assert.equal(resolveEnquiry('course', 'not-a-course'), null);
assert.equal(resolveEnquiry('invalid', 'premium'), null);
assert.deepEqual(validateEnquiry(request), {});
assert.ok(validateEnquiry({ ...request, name: '', email: 'bad', message: '' }).name);
assert.deepEqual(validateEnquiry({ ...request, phone: '+91 94002 05847' }), {});
assert.ok(validateEnquiry({ ...request, message: 'Short' }).message);
assert.ok(validateEnquiry({ ...request, name: 'a'.repeat(101) }).name);
assert.ok(validateEnquiry({ ...request, message: 'a'.repeat(2001) }).message);

// Exercise the actual submit handler with signals and a controlled mock service.
// No Angular DOM fixture or live endpoint is needed for these state transitions.
let complete: (() => void) | undefined;
let fail: (() => void) | undefined;
let submissions = 0;
let focused = false;
const form = signal({ ...request });
const status = signal('idle');
const harness = {
  mode: 'endpoint', status, form, attempted: signal(false), available: () => true,
  website: signal(''), startedAt: 123456789,
  errors: computed(() => validateEnquiry(form())),
  document: { querySelector: () => ({ focus: () => { focused = true; } }) },
  delivery: { submit: () => { submissions++; return new Promise<void>((resolve, reject) => { complete = resolve; fail = () => reject(new Error('Mock failure')); }); } }
};
const submit = () => Reflect.apply(ContactHubComponent.prototype.submit, harness, [{ preventDefault() {} }]) as Promise<void>;
form.set({ ...request, email: 'bad' });
await submit();
assert.equal(submissions, 0); assert.equal(focused, true);
form.set({ ...request });
const first = submit();
assert.equal(status(), 'submitting');
await submit(); assert.equal(submissions, 1);
fail?.(); await first;
assert.equal(status(), 'error'); assert.deepEqual(form(), request);
const retry = submit(); assert.equal(submissions, 2);
complete?.(); await retry;
assert.equal(status(), 'accepted');
await submit(); assert.equal(submissions, 2);
let locked = false;
const overlayInjector = Injector.create({ providers: [{ provide: DOCUMENT, useValue: { documentElement: { classList: { toggle: (_name: string, active: boolean) => { locked = active; } } } } }] });
const overlays = runInInjectionContext(overlayInjector, () => new OverlayStateService());
const releaseFirst = overlays.acquire(), releaseSecond = overlays.acquire();
releaseFirst(); assert.equal(overlays.active(), true); assert.equal(locked, true);
releaseFirst(); assert.equal(overlays.active(), true);
releaseSecond(); assert.equal(overlays.active(), false); assert.equal(locked, false);
console.log('Interaction checks passed: both WhatsApp numbers and encoded enquiry messages, primary call number, enquiry context and validation, disabled delivery, explicit acknowledgement, error/data retention, retry, submitting/duplicate guards and nested overlay locks. No live enquiries sent.');
