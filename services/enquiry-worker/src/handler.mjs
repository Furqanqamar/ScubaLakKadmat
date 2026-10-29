import { MAILBOX } from './smtp.mjs';

const MAX_BYTES = 12000;
const CATEGORIES = new Set(['general', 'diving', 'courses', 'water-sports', 'accommodation']);
const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const ERROR_CODES = new Set(['ECONNECTION', 'ETIMEDOUT', 'EDNS', 'ESOCKET', 'ETLS', 'EAUTH', 'ENOAUTH', 'EENVELOPE', 'EMESSAGE', 'ESTREAM', 'EPROTOCOL', 'ECONFIG', 'ERR_NOT_IMPLEMENTED', 'ERR_INVALID_ARG_VALUE', 'ERR_INVALID_ARG_TYPE', 'ERR_TLS_CERT_ALTNAME_INVALID', 'CERT_HAS_EXPIRED', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET']);
const SMTP_COMMANDS = new Set(['CONN', 'EHLO', 'HELO', 'STARTTLS', 'AUTH', 'AUTH LOGIN', 'AUTH PLAIN', 'MAIL FROM', 'RCPT TO', 'DATA']);

// Only closed-set diagnostics reach operator logs, never arbitrary exception strings.
export function deliveryDiagnostic(error, phase) {
  const text = typeof error?.message === 'string' ? error.message : '';
  const reason = /certificate|cert verify|hostname.*match/i.test(text) ? 'TLS_CERTIFICATE'
    : /not implemented|not supported|unsupported/i.test(text) ? 'RUNTIME_UNSUPPORTED'
    : /network connection lost|connection closed|socket closed/i.test(text) ? 'CONNECTION_CLOSED'
    : /proxy request failed|TCP Loop detected|disallowed address/i.test(text) ? 'CONNECTION_BLOCKED'
    : /timeout|timed out/i.test(text) ? 'TIMEOUT' : 'UNKNOWN';
  return {
    event: 'enquiry_delivery_failed', phase,
    code: ERROR_CODES.has(error?.code) ? error.code : 'UNKNOWN',
    originalCode: ERROR_CODES.has(error?.originalCode) ? error.originalCode : 'UNKNOWN', reason,
    command: SMTP_COMMANDS.has(error?.command) ? error.command : 'UNKNOWN',
    responseCode: Number.isInteger(error?.responseCode) && error.responseCode >= 400 && error.responseCode <= 599 ? error.responseCode : null
  };
}
const singleLine = (value, max) => typeof value === 'string' && value.length <= max && !/[\r\n\u0000-\u001f\u007f]/.test(value);
const validEmail = value => {
  if (!singleLine(value, 254) || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value)) return false;
  const [local, domain] = value.split('@');
  return local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..') && domain.split('.').every(label => label.length <= 63);
};

export function validateRequest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!singleLine(value.name, 100) || value.name.trim().length < 2) return null;
  if (!validEmail(value.email) || value.email !== value.email.trim()) return null;
  if (!singleLine(value.phone, 30)) return null;
  if (typeof value.message !== 'string' || value.message.length > 2000 || value.message.trim().length < 12 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.message)) return null;
  if (!CATEGORIES.has(value.interest)) return null;
  if (value.website !== '') return null;
  // Elapsed client time avoids requiring the visitor's clock to match the server.
  // Like any client-supplied bot signal, this can be spoofed; rate limits remain essential.
  if (!Number.isSafeInteger(value.formAgeMs) || value.formAgeMs < 2000 || value.formAgeMs > 86400000) return null;
  let context = null;
  if (value.context != null) {
    const item = value.context;
    if (!item || typeof item !== 'object' || !['course', 'experience', 'dive-site'].includes(item.kind) || !singleLine(item.id, 100) || !/^[a-z0-9-]+$/.test(item.id) || !singleLine(item.label, 160) || !item.label.trim()) return null;
    context = { kind: item.kind, id: item.id, label: item.label.trim() };
  }
  return { name: value.name.trim(), email: value.email, phone: value.phone.trim(), message: value.message.trim(), interest: value.interest, context };
}

export function createMessage(enquiry, reference, now = Date.now()) {
  return {
    from: { name: 'Scuba Lak website', address: MAILBOX },
    to: MAILBOX,
    envelope: { from: MAILBOX, to: [MAILBOX] },
    replyTo: { name: enquiry.name, address: enquiry.email },
    subject: `Scuba Lak website enquiry · ${reference}`,
    messageId: `<${reference}@scubalak.com>`,
    text: [
      'NEW WEBSITE ENQUIRY', `Reference: ${reference}`, `Received: ${new Date(now).toISOString()}`,
      '', `Name: ${enquiry.name}`, `Email: ${enquiry.email}`, `Phone: ${enquiry.phone || 'Not provided'}`,
      `About: ${enquiry.interest}`, ...(enquiry.context ? [`Selection: ${enquiry.context.label}`] : []),
      '', 'YOUR PLANS', enquiry.message, '', 'Reply to this email to contact the visitor.',
      'This is an enquiry, not a confirmed booking.'
    ].join('\n'),
    disableFileAccess: true, disableUrlAccess: true
  };
}

async function readJson(request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new Error('TOO_LARGE');
  if (!request.body) throw new Error('INVALID');
  const reader = request.body.getReader();
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new Error('TOO_LARGE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

async function hash(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createHandler(sendMail, reportFailure = value => console.error(value)) {
  return async (request, env) => {
    const origin = request.headers.get('Origin');
    const allowed = new Set((env.ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean));
    const originAllowed = !!origin && allowed.has(origin);
    const cors = originAllowed ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : { 'Vary': 'Origin' };
    const reply = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...cors, ...extra } });
    const path = new URL(request.url).pathname;
    const ready = Boolean(env.SENDING_ENABLED === 'true' && env.SMTP_USER === MAILBOX && typeof env.SMTP_PASSWORD === 'string' && !!env.SMTP_PASSWORD && env.IP_LIMIT?.limit && env.EMAIL_LIMIT?.limit && env.MAIL_LIMIT?.limit);
    if (path === '/health' && request.method === 'GET') return reply(ready ? 200 : 503, { ready: !!ready });
    if (path !== '/enquiries') return reply(404, { error: 'NOT_FOUND' });
    if (!originAllowed) return reply(403, { error: 'ORIGIN_NOT_ALLOWED' });
    if (request.method === 'OPTIONS') {
      if (request.headers.get('Access-Control-Request-Method') !== 'POST') return reply(405, { error: 'METHOD_NOT_ALLOWED' });
      return new Response(null, { status: 204, headers: { ...HEADERS, ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
    }
    if (request.method !== 'POST') return reply(405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'POST, OPTIONS' });
    if (!ready) return reply(503, { error: 'SERVICE_UNAVAILABLE' });
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') ?? '')) return reply(415, { error: 'JSON_REQUIRED' });
    let phase = 'rate-limit';
    try {
      const ip = request.headers.get('CF-Connecting-IP');
      if (!ip) return reply(403, { error: 'CLIENT_UNAVAILABLE' });
      if (!(await env.IP_LIMIT.limit({ key: await hash(ip) })).success) return reply(429, { error: 'TOO_MANY_REQUESTS' }, { 'Retry-After': '60' });
      let input;
      try { input = await readJson(request); }
      catch (error) { return reply(error?.message === 'TOO_LARGE' ? 413 : 400, { error: 'INVALID_ENQUIRY' }); }
      const enquiry = validateRequest(input);
      if (!enquiry) return reply(400, { error: 'INVALID_ENQUIRY' });
      if (!(await env.EMAIL_LIMIT.limit({ key: await hash(enquiry.email.toLowerCase()) })).success || !(await env.MAIL_LIMIT.limit({ key: 'mailbox' })).success) return reply(429, { error: 'TOO_MANY_REQUESTS' }, { 'Retry-After': '60' });
      const reference = crypto.randomUUID();
      phase = 'smtp';
      const result = await sendMail(createMessage(enquiry, reference), env);
      const accepted = result?.accepted?.some(value => (typeof value === 'string' ? value : value?.address)?.toLowerCase() === MAILBOX);
      if (!accepted || result?.rejected?.length) return reply(502, { error: 'DELIVERY_UNCONFIRMED' });
      return reply(200, { accepted: true, reference });
    } catch (error) {
      // Do not expose or log SMTP responses, credentials, addresses, IPs or enquiry text.
      reportFailure(deliveryDiagnostic(error, phase));
      return reply(503, { error: 'DELIVERY_UNAVAILABLE' });
    }
  };
}
