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

// Isolated mock transport only: no requests leave this process.
const request = { name: 'Test visitor', email: 'test@example.test', phone: '', interest: 'courses', message: 'A mock enquiry for testing.' };
async function attempt(configuration: EnquiryDeliveryConfig, acknowledgement: unknown, networkError = false): Promise<{ calls: number; accepted: boolean }> {
  let calls = 0;
  const injector = Injector.create({ providers: [
    { provide: ENQUIRY_DELIVERY_CONFIG, useValue: configuration },
    { provide: HttpClient, useValue: { post: () => { calls++; return networkError ? throwError(() => new Error('Mock network failure')) : of(acknowledgement); } } }
  ] });
  const service = runInInjectionContext(injector, () => new EnquiryDeliveryService());
  try { await service.submit(request); return { calls, accepted: true }; }
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
assert.ok(validateEnquiry({ ...request, guests: 1.5 }).guests);
assert.ok(validateEnquiry({ ...request, arrivalDate: '2027-02-30' }, new Date(2026, 9, 25)).arrivalDate);
assert.ok(validateEnquiry({ ...request, arrivalDate: '2026-10-24' }, new Date(2026, 9, 25)).arrivalDate);

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
console.log('Interaction checks passed: enquiry context and validation, disabled delivery, explicit acknowledgement, error/data retention, retry, submitting/duplicate guards and nested overlay locks. No live enquiries sent.');
