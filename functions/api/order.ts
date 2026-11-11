/**
 * Cloudflare Pages Function: POST /api/order
 *
 * Validates the order form, checks Turnstile, then sends two emails through Resend:
 * a notification to the business and an automatic reply to the sender.
 *
 * Environment (Cloudflare Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY        secret   Resend API key
 *   MAIL_FROM             variable Verified sender, e.g. "Studio <studio@your-domain>"
 *   NOTIFY_EMAIL          variable optional; defaults to the email in site.config.ts
 *   TURNSTILE_SECRET_KEY  secret   optional but recommended; pair with NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *
 * Free-tier limits (checked November 2026): Pages Functions share the Workers Free quota of
 * 100,000 requests a day and 10 ms CPU per request. Resend Free allows 3,000 emails a month and
 * 100 a day, so with two emails per request that is about 50 form submissions a day.
 */
import { siteConfig } from '../../src/config/site.config';
import { copy } from '../../src/content/copy.en';
import { countryName } from '../../src/lib/countries';
import {
  NEED_OPTIONS,
  hasErrors,
  validateFiles,
  validateOrder,
  type OrderInput,
} from '../../src/lib/orderSchema';

interface Env {
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  NOTIFY_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const MAX_BODY_BYTES = 12 * 1024 * 1024;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function oneLine(value: string, max = 150): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function readInput(form: FormData): OrderInput {
  const text = (key: string) => String(form.get(key) ?? '');
  return {
    name: text('name'),
    email: text('email'),
    company: text('company'),
    country: text('country'),
    need: text('need'),
    details: text('details'),
    formats: form.getAll('formats').map(String),
    rush: form.get('rush') === 'on',
    message: text('message'),
    honeypot: text('company_website'),
  };
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

interface MailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
  attachments?: { filename: string; content: string }[];
}

async function sendMail(apiKey: string, payload: MailPayload): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}

function notificationMail(input: OrderInput, fileNames: string[]) {
  const needLabel =
    copy.form.needOptions[input.need as keyof typeof copy.form.needOptions] ?? input.need;
  const rows: [string, string][] = [
    ['Name', input.name.trim()],
    ['Email', input.email.trim()],
    ['Company', input.company.trim() || '-'],
    ['Country', countryName(input.country)],
    ['Need', needLabel],
    ['Size, placement, fabric', input.details.trim() || '-'],
    ['Formats', input.formats.join(', ') || '-'],
    ['Rush', input.rush ? 'Yes' : 'No'],
    ['Message', input.message.trim() || '-'],
    [
      'Artwork',
      fileNames.length
        ? fileNames.join(', ')
        : siteConfig.features.artworkUpload
          ? 'None attached'
          : 'Not uploaded. The sender was told to email it.',
    ],
  ];
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('')}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const subject = oneLine(
    copy.email.notifySubject.replace('[need]', needLabel).replace('[name]', input.name),
  );
  return { subject, html, text };
}

function autoReplyMail(input: OrderInput) {
  const paragraphs = [
    copy.email.autoReplyGreeting.replace('[name]', oneLine(input.name, 100)),
    ...copy.email.autoReplyBody,
    ...(input.rush ? [copy.email.autoReplyRush] : []),
    ...(siteConfig.features.artworkUpload ? [] : [copy.email.autoReplyArtworkOff]),
    copy.email.autoReplySignoff,
  ];
  const html = paragraphs
    .map((paragraph) => `<p style="font-family:sans-serif;font-size:16px;line-height:1.5">${escapeHtml(paragraph)}</p>`)
    .join('');
  return { subject: copy.email.autoReplySubject, html, text: paragraphs.join('\n\n') };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'too_large' }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const input = readInput(form);

  // Bots fill the hidden field. Say "ok" and send nothing, so they learn nothing.
  if (input.honeypot.trim() !== '') return json({ ok: true });

  const errors = validateOrder(input);

  const uploads = siteConfig.features.artworkUpload
    ? form.getAll('artwork').filter((entry): entry is File => typeof entry !== 'string' && entry.size > 0)
    : [];
  const fileCode = validateFiles(uploads, siteConfig.facts.maxUploadMb * 1024 * 1024);
  if (fileCode) errors.artwork = fileCode;
  if (hasErrors(errors)) return json({ ok: false, errors }, 400);

  if (!(NEED_OPTIONS as readonly string[]).includes(input.need)) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = String(form.get('cf-turnstile-response') ?? '');
    const passed =
      token !== '' &&
      (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')));
    if (!passed) return json({ ok: false, error: 'captcha' }, 403);
  }

  const notifyTo = env.NOTIFY_EMAIL || siteConfig.email;
  if (!env.RESEND_API_KEY || !env.MAIL_FROM || notifyTo.includes('PLACEHOLDER')) {
    console.error('Order form is not configured: set RESEND_API_KEY, MAIL_FROM and the business email.');
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  try {
    const notification = notificationMail(
      input,
      uploads.map((file) => file.name),
    );
    const attachments = await Promise.all(
      uploads.map(async (file) => ({
        filename: oneLine(file.name, 200),
        content: toBase64(new Uint8Array(await file.arrayBuffer())),
      })),
    );
    await sendMail(env.RESEND_API_KEY, {
      from: env.MAIL_FROM,
      to: [notifyTo],
      reply_to: input.email.trim(),
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      ...(attachments.length ? { attachments } : {}),
    });
  } catch (error) {
    console.error('Notification email failed', error instanceof Error ? error.message : 'unknown');
    return json({ ok: false, error: 'mail_failed' }, 502);
  }

  // The business has the request. A failed auto-reply must not make the visitor retry.
  try {
    const reply = autoReplyMail(input);
    await sendMail(env.RESEND_API_KEY, {
      from: env.MAIL_FROM,
      to: [input.email.trim()],
      reply_to: notifyTo,
      subject: reply.subject,
      html: reply.html,
      text: reply.text,
    });
  } catch (error) {
    console.error('Auto-reply failed', error instanceof Error ? error.message : 'unknown');
  }

  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'method_not_allowed' }, 405);
