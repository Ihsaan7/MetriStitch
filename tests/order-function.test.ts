import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { onRequest, onRequestPost } from '../functions/api/order';

interface Call {
  url: string;
  body: Record<string, unknown> | string;
}

let calls: Call[] = [];
let turnstilePasses = true;
let failResendAt: number | null = null;
const realFetch = globalThis.fetch;

const env = {
  RESEND_API_KEY: 'test-key',
  MAIL_FROM: 'Studio <studio@example.com>',
  NOTIFY_EMAIL: 'owner@example.com',
};

beforeEach(() => {
  calls = [];
  turnstilePasses = true;
  failResendAt = null;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const raw = init?.body;
    calls.push({ url, body: typeof raw === 'string' ? (url.includes('resend') ? JSON.parse(raw) : raw) : String(raw) });
    if (url.includes('siteverify')) return Response.json({ success: turnstilePasses });
    const resendCalls = calls.filter((call) => call.url.includes('resend')).length;
    if (failResendAt === resendCalls) return new Response('nope', { status: 500 });
    return Response.json({ id: 'email-id' });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

function request(fields: Record<string, string | string[]>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const item of Array.isArray(value) ? value : [value]) form.append(key, item);
  }
  return new Request('https://example.com/api/order', { method: 'POST', body: form });
}

const good = {
  name: 'Ana Customer',
  email: 'ana@example.com',
  country: 'PK',
  need: 'logo',
  formats: ['DST', 'PES'],
  rush: 'on',
  message: 'Hello',
};

const resendCalls = () => calls.filter((call) => call.url.includes('resend'));

describe('POST /api/order', () => {
  it('answers ok but sends nothing when the honeypot is filled', async () => {
    const response = await onRequestPost({ request: request({ ...good, company_website: 'http://spam.example' }), env });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(calls.length, 0);
  });

  it('returns field errors for an invalid request and sends nothing', async () => {
    const response = await onRequestPost({ request: request({ ...good, name: '', email: 'bad' }), env });
    assert.equal(response.status, 400);
    const body = (await response.json()) as { errors: Record<string, string> };
    assert.equal(body.errors.name, 'required');
    assert.equal(body.errors.email, 'invalid');
    assert.equal(calls.length, 0);
  });

  it('sends a notification to the business and an auto-reply to the sender', async () => {
    const response = await onRequestPost({ request: request(good), env });
    assert.equal(response.status, 200);
    const [notify, reply] = resendCalls().map((call) => call.body as Record<string, unknown>);
    assert.deepEqual(notify.to, ['owner@example.com']);
    assert.equal(notify.reply_to, 'ana@example.com');
    assert.deepEqual(reply.to, ['ana@example.com']);
    assert.equal(reply.reply_to, 'owner@example.com');
    assert.equal(notify.from, env.MAIL_FROM);
    assert.match(String(notify.html), /Pakistan/);
    assert.match(String(notify.text), /Formats: DST, PES/);
    assert.match(String(reply.text), /rush/i, 'auto-reply mentions the rush request');
    assert.match(String(reply.text), /reply to this email with the files attached/, 'tells the sender to email artwork');
  });

  it('escapes HTML and strips line breaks from the subject', async () => {
    const response = await onRequestPost({
      request: request({ ...good, name: 'Eve\r\nBcc: x@evil.test', message: '<script>alert(1)</script>' }),
      env,
    });
    assert.equal(response.status, 200);
    const notify = resendCalls()[0].body as Record<string, string>;
    assert.doesNotMatch(notify.subject, /[\r\n]/);
    assert.doesNotMatch(notify.html, /<script>/);
    assert.match(notify.html, /&lt;script&gt;/);
  });

  it('rejects the request when Turnstile is configured and the token is missing or fails', async () => {
    const withSecret = { ...env, TURNSTILE_SECRET_KEY: 'secret' };
    const missing = await onRequestPost({ request: request(good), env: withSecret });
    assert.equal(missing.status, 403);
    turnstilePasses = false;
    const failed = await onRequestPost({ request: request({ ...good, 'cf-turnstile-response': 'tok' }), env: withSecret });
    assert.equal(failed.status, 403);
    assert.equal(resendCalls().length, 0);
  });

  it('accepts the request when Turnstile passes', async () => {
    const response = await onRequestPost({
      request: request({ ...good, 'cf-turnstile-response': 'tok' }),
      env: { ...env, TURNSTILE_SECRET_KEY: 'secret' },
    });
    assert.equal(response.status, 200);
    assert.equal(resendCalls().length, 2);
  });

  it('reports a configuration error instead of pretending to send', async () => {
    const response = await onRequestPost({ request: request(good), env: { NOTIFY_EMAIL: 'owner@example.com' } });
    assert.equal(response.status, 500);
    assert.equal(resendCalls().length, 0);
  });

  it('fails when the notification email fails, but not when only the auto-reply fails', async () => {
    failResendAt = 1;
    const failed = await onRequestPost({ request: request(good), env });
    assert.equal(failed.status, 502);
    assert.equal(resendCalls().length, 1, 'no auto-reply after a failed notification');

    calls = [];
    failResendAt = 2;
    const partial = await onRequestPost({ request: request(good), env });
    assert.equal(partial.status, 200);
  });

  it('refuses other methods', async () => {
    const response = await onRequest({ request: new Request('https://example.com/api/order'), env });
    assert.equal(response.status, 405);
  });
});
