import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createHandler, createMessage, validateRequest, deliveryDiagnostic } from '../src/handler.mjs';
import { MAILBOX, smtpOptions, createGoDaddySocket } from '../src/smtp.mjs';

const origin = 'https://www.scubalak.com';
const valid = () => ({ name: 'Test visitor', email: 'visitor@example.test', phone: '+91 94002 05847', interest: 'diving', message: 'Please tell me about diving in Kadmat.', context: { kind: 'dive-site', id: 'secret-garden', label: 'Secret Garden · Kadmat dive spot' }, website: '', formAgeMs: 5000 });
const limiter = success => ({ limit: async () => ({ success }) });
const settings = () => ({ ALLOWED_ORIGINS: origin, SMTP_USER: MAILBOX, SMTP_PASSWORD: 'mock-password-not-a-real-secret', SENDING_ENABLED: 'true', IP_LIMIT: limiter(true), EMAIL_LIMIT: limiter(true), MAIL_LIMIT: limiter(true) });
const request = (body = valid(), overrides = {}) => new Request('https://mail.example.test/enquiries', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...overrides.headers },
  body: typeof body === 'string' ? body : JSON.stringify(body), ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'headers'))
});

test('direct SMTP socket keeps hostname certificate validation and waits for TLS before handing off', () => {
  const socket = new EventEmitter(); socket.setTimeout = () => {}; socket.destroy = () => {};
  let calls = 0;
  createGoDaddySocket({ connectionTimeout: 6000 }, (error, value) => {
    calls++; assert.equal(error, null); assert.equal(value.connection, socket); assert.equal(value.secured, true);
  }, options => {
    assert.equal(options.host, 'smtpout.secureserver.net'); assert.equal(options.servername, options.host);
    assert.equal(options.port, 465); assert.equal(options.rejectUnauthorized, true); assert.equal(options.minVersion, 'TLSv1.2');
    return socket;
  });
  assert.equal(calls, 0); socket.emit('secureConnect'); assert.equal(calls, 1);
});

test('SMTP uses only GoDaddy SSL submission, a fixed sender and certificate verification', () => {
  const options = smtpOptions('mock-password');
  assert.equal(options.host, 'smtpout.secureserver.net'); assert.equal(options.port, 465); assert.equal(options.secure, true);
  assert.equal(options.auth.user, MAILBOX); assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.tls.servername, options.host); assert.equal(options.tls.minVersion, 'TLSv1.2');
  assert.equal(options.logger, false); assert.equal(options.debug, false);
  assert.equal(options.disableFileAccess, true); assert.equal(options.disableUrlAccess, true);
});

test('validates and normalises only the requested enquiry fields', () => {
  const value = valid(); const result = validateRequest({ ...value, name: ' Test visitor ', phone: ' 123 ', message: ' Our plans for Kadmat diving. ' });
  assert.equal(result.name, 'Test visitor'); assert.equal(result.phone, '123'); assert.equal(result.message, 'Our plans for Kadmat diving.');
  assert.equal(result.context.label, value.context.label);
  assert.ok(validateRequest({ ...value, context: null, phone: '' }));
  assert.ok(validateRequest({ ...value, message: 'Two visitors.\nWe’d love to explore 🤿' }));
});

test('rejects invalid types, bounds, header injection and simple spam signals', () => {
  for (const value of [null, [], 123, true, 'text']) assert.equal(validateRequest(value), null);
  const cases = [
    { name: 'x' }, { name: 'a'.repeat(101) }, { name: 'Visitor\r\nBcc: other@example.test' }, { name: null },
    { email: 'invalid' }, { email: ' other@example.test' }, { email: 'a@b.test\r\nBcc:x@y.test' }, { email: '<a@b.test>' }, { email: 'a'.repeat(255) + '@b.test' },
    { phone: 'a'.repeat(31) }, { phone: '123\n456' }, { phone: null },
    { message: 'Too short' }, { message: 'a'.repeat(2001) }, { message: 'Message with a null\0byte.' },
    { interest: 'not-real' }, { website: 'https://spam.test' }, { website: null },
    { formAgeMs: 0 }, { formAgeMs: -1 }, { formAgeMs: 1999 }, { formAgeMs: 86400001 }, { formAgeMs: '5000' },
    { email: 'one,two@example.test' }, { email: 'Name:one@example.test' }, { email: '.visitor@example.test' }, { email: 'visitor..one@example.test' },
    { context: [] }, { context: { kind: 'other', id: 'x', label: 'Label' } },
    { context: { kind: 'course', id: '../private', label: 'Label' } }, { context: { kind: 'course', id: 'valid', label: 'Label\nInjected' } }
  ];
  for (const item of cases) assert.equal(validateRequest({ ...valid(), ...item }), null, JSON.stringify(item));
});

test('never becomes an open relay or trusts the visitor as the sender', () => {
  const data = validateRequest({ ...valid(), to: 'someone@other.test', from: 'spoof@other.test', subject: 'Injected' });
  const message = createMessage(data, 'mock-reference');
  assert.equal(message.from.address, MAILBOX); assert.equal(message.to, MAILBOX);
  assert.deepEqual(message.envelope, { from: MAILBOX, to: [MAILBOX] });
  assert.equal(message.replyTo.address, data.email); assert.equal(message.subject, 'Scuba Lak website enquiry · mock-reference');
  assert.ok(message.text.includes(data.message)); assert.ok(message.text.includes(data.context.label));
  assert.equal(message.html, undefined); assert.equal(message.attachments, undefined);
});

test('responds accepted only after SMTP accepts the configured mailbox', async () => {
  let calls = 0;
  const handler = createHandler(async message => { calls++; assert.equal(message.to, MAILBOX); return { accepted: [MAILBOX], rejected: [] }; });
  const result = await handler(request(), settings());
  assert.equal(result.status, 200); const body = await result.json();
  assert.equal(calls, 1); assert.equal(body.accepted, true); assert.match(body.reference, /^[a-f0-9-]{36}$/);
  assert.equal(result.headers.get('Access-Control-Allow-Origin'), origin); assert.equal(result.headers.get('Cache-Control'), 'no-store');
});

test('SMTP failure, rejection or absent acknowledgement never becomes success or leaks diagnostics', async () => {
  for (const outcome of [undefined, { accepted: [] }, { accepted: ['other@example.test'] }, { accepted: [MAILBOX], rejected: [MAILBOX] }, new Error('mock-password SMTP diagnostic')]) {
    const response = await createHandler(async () => { if (outcome instanceof Error) throw outcome; return outcome; }, () => {})(request(), settings());
    assert.ok(response.status >= 500); const text = await response.text();
    assert.doesNotMatch(text, /accepted|mock-password|SMTP diagnostic/);
  }
});

test('operator diagnostics allow only closed-set metadata and never arbitrary error details', () => {
  const privateError = Object.assign(new Error('private password and email'), { code: 'EAUTH', command: 'AUTH LOGIN', responseCode: 535, response: 'private SMTP response', stack: 'private stack' });
  assert.deepEqual(deliveryDiagnostic(privateError, 'smtp'), { event: 'enquiry_delivery_failed', phase: 'smtp', code: 'EAUTH', originalCode: 'UNKNOWN', reason: 'UNKNOWN', command: 'AUTH LOGIN', responseCode: 535 });
  const unsafe = deliveryDiagnostic({ code: 'private password', command: 'private email', responseCode: '535' }, 'smtp');
  assert.equal(unsafe.code, 'UNKNOWN'); assert.equal(unsafe.command, 'UNKNOWN'); assert.equal(unsafe.responseCode, null);
  assert.equal(deliveryDiagnostic(new Error('some unsupported runtime option'), 'smtp').reason, 'RUNTIME_UNSUPPORTED');
  assert.doesNotMatch(JSON.stringify(deliveryDiagnostic(privateError, 'smtp')), /private|password|email/);
});

test('missing secrets, disabled sending or missing limiter bindings fail closed', async () => {
  for (const patch of [{ SMTP_PASSWORD: undefined }, { SMTP_PASSWORD: '' }, { SMTP_USER: 'other@example.test' }, { SENDING_ENABLED: 'false' }, { IP_LIMIT: undefined }, { EMAIL_LIMIT: undefined }, { MAIL_LIMIT: undefined }]) {
    const handler = createHandler(async () => { assert.fail('Must not attempt SMTP'); }); const env = { ...settings(), ...patch };
    assert.equal((await handler(request(), env)).status, 503);
    const health = await handler(new Request('https://mail.example.test/health'), env);
    assert.equal(health.status, 503); assert.deepEqual(await health.json(), { ready: false });
  }
});

test('three independent rate limits are enforced and hashed keys avoid raw personal data', async () => {
  for (const name of ['IP_LIMIT', 'EMAIL_LIMIT', 'MAIL_LIMIT']) {
    const env = { ...settings(), [name]: limiter(false) };
    const response = await createHandler(async () => { assert.fail('Rate-limited requests must not send'); })(request(), env);
    assert.equal(response.status, 429); assert.equal(response.headers.get('Retry-After'), '60');
  }
  const keys = [];
  const capture = { limit: async ({ key }) => { keys.push(key); return { success: true }; } };
  const env = { ...settings(), IP_LIMIT: capture, EMAIL_LIMIT: capture };
  await createHandler(async () => ({ accepted: [MAILBOX] }))(request(), env);
  assert.equal(keys.length, 2); for (const key of keys) assert.match(key, /^[a-f0-9]{64}$/);
});

test('CORS permits exact approved origins only and preflight never sends mail', async () => {
  const handler = createHandler(async () => { assert.fail('Must not attempt SMTP'); });
  for (const fakeOrigin of ['https://www.scubalak.com.evil.test', 'null', '', 'https://other.test']) {
    const result = await handler(request(valid(), { headers: { Origin: fakeOrigin } }), settings());
    assert.equal(result.status, 403); assert.equal(result.headers.get('Access-Control-Allow-Origin'), null);
  }
  const result = await handler(new Request('https://mail.example.test/enquiries', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' } }), settings());
  assert.equal(result.status, 204); assert.equal(result.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(result.headers.get('Access-Control-Allow-Methods'), 'POST'); assert.equal(result.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});

test('invalid JSON, oversized bodies and malformed requests do not reach SMTP', async () => {
  const handler = createHandler(async () => { assert.fail('Must not attempt SMTP'); });
  assert.equal((await handler(request('not-json'), settings())).status, 400);
  assert.equal((await handler(request('x'.repeat(12001)), settings())).status, 413);
  assert.equal((await handler(request(valid(), { headers: { 'Content-Length': '12001' } }), settings())).status, 413);
  assert.equal((await handler(request(valid(), { headers: { 'Content-Type': 'text/plain' } }), settings())).status, 415);
  const missingIp = request(); missingIp.headers.delete('CF-Connecting-IP');
  assert.equal((await handler(missingIp, settings())).status, 403);
  assert.equal((await handler(request({ ...valid(), website: 'spam' }), settings())).status, 400);
  assert.equal((await handler(new Request('https://mail.example.test/enquiries', { headers: { Origin: origin } }), settings())).status, 405);
  assert.equal((await handler(new Request('https://mail.example.test/not-found'), settings())).status, 404);
});
