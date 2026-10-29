import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { validateRequest } from '../services/enquiry-worker/src/handler.mjs';

// Exercise the actual browser and deployed-server validators without sending mail.
const bundle = await build({ entryPoints: ['src/app/common/services/enquiry-validation.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { validateEnquiry } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const baseline = { name: 'Test visitor', email: 'visitor@example.test', phone: '', interest: 'general', message: 'Please tell me about diving in Kadmat.', context: null };
const fixtures = [
  {}, { name: 'ഷംസുദ്ദീൻ' }, { name: "O’Brien" }, { email: "visitor+diving@sub.example.test" },
  { email: "o'brien@example.test" }, { email: ' visitor@example.test ' },
  { phone: '+91 (94002) 05847' }, { message: 'Two visitors.\nWe’d love to explore 🤿\tThank you.' }
];
for (const update of fixtures) {
  const form = { ...baseline, ...update };
  assert.deepEqual(validateEnquiry(form), {}, `Valid form rejected: ${JSON.stringify(update)}`);
  const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
  assert.ok(validateRequest({ ...payload, website: '', formAgeMs: 5000 }), `Browser-valid payload rejected by server: ${JSON.stringify(update)}`);
}
const invalid = [
  ['name', 'x'], ['name', 'a'.repeat(101)], ['name', 'Visitor\r\nBcc: other@example.test'],
  ['phone', 'x'.repeat(31)], ['phone', '123\n456'],
  ['email', 'invalid'], ['email', 'one,two@example.test'], ['email', 'Name:one@example.test'],
  ['email', '.visitor@example.test'], ['email', 'visitor.@example.test'], ['email', 'visitor..one@example.test'],
  ['email', 'a'.repeat(65) + '@example.test'], ['email', 'visitor@' + 'a'.repeat(64) + '.test'],
  ['email', 'visitor@-example.test'], ['email', 'visitor@example-.test'], ['email', 'visitor@exam_ple.test'],
  ['email', 'visitor@example.test\r\nBcc:x@y.test'], ['email', '<visitor@example.test>'],
  ['message', 'Too short'], ['message', 'a'.repeat(2001)], ['message', 'Message with a null\0byte.']
];
for (const [field, value] of invalid) {
  const form = { ...baseline, [field]: value };
  assert.ok(validateEnquiry(form)[field], `Browser must show an inline ${field} error`);
  assert.equal(validateRequest({ ...form, website: '', formAgeMs: 5000 }), null, `Server must reject invalid ${field}`);
}
for (let code = 0; code <= 127; code++) {
  if (code > 31 && code !== 127) continue;
  const character = String.fromCharCode(code);
  for (const field of ['name', 'email', 'phone', 'message']) {
    const form = { ...baseline, [field]: field === 'email' ? `vis${character}itor@example.test` : `Visitor ${character} diving plans.` };
    const serverAccepts = !!validateRequest({ ...form, website: '', formAgeMs: 5000 });
    assert.equal(!validateEnquiry(form)[field], serverAccepts, `Control character ${code} parity for ${field}`);
  }
}
console.log('Enquiry contract checks passed: international names, optional phone, plus-addresses, mail-header injection, control characters and field bounds agree across browser/server. No requests or mail sent.');
