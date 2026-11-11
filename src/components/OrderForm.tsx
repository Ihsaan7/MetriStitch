'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import type { Copy } from '@/content/copy.en';
import {
  hasErrors,
  validateFiles,
  validateOrder,
  type ErrorCode,
  type OrderErrors,
  type OrderField,
  type OrderInput,
} from '@/lib/orderSchema';

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface OrderFormProps {
  copy: Copy['form'];
  countries: { code: string; name: string }[];
  needs: readonly string[];
  formats: readonly string[];
  turnstileSiteKey: string;
  uploadEnabled: boolean;
  maxUploadMb: number;
}

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const TURNSTILE_SCRIPT_ID = 'turnstile-script';

function readInput(form: HTMLFormElement): OrderInput {
  const data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? '');
  return {
    name: text('name'),
    email: text('email'),
    company: text('company'),
    country: text('country'),
    need: text('need'),
    details: text('details'),
    formats: data.getAll('formats').map(String),
    rush: data.get('rush') === 'on',
    message: text('message'),
    honeypot: text('company_website'),
  };
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] font-semibold">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.9375rem] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function OrderForm({
  copy,
  countries,
  needs,
  formats,
  turnstileSiteKey,
  uploadEnabled,
  maxUploadMb,
}: OrderFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileIdRef = useRef<string | undefined>(undefined);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const showForm = status !== 'sent';

  // Load Turnstile only when the visitor gets near the form, so the page stays light.
  useEffect(() => {
    if (!turnstileSiteKey || !showForm) return;
    const form = formRef.current;
    if (!form) return;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !window.turnstile || !turnstileRef.current || turnstileIdRef.current) return;
      turnstileIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        appearance: 'interaction-only',
      });
    };
    const start = () => {
      if (window.turnstile) {
        mount();
        return;
      }
      let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', mount, { once: true });
    };

    let started = false;
    const startOnce = () => {
      if (started) return;
      started = true;
      start();
    };
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                startOnce();
                observer?.disconnect();
              }
            },
            { rootMargin: '300px' },
          )
        : null;
    if (observer) observer.observe(form);
    else startOnce();
    form.addEventListener('focusin', startOnce, { once: true });

    return () => {
      cancelled = true;
      observer?.disconnect();
      form.removeEventListener('focusin', startOnce);
      if (turnstileIdRef.current && window.turnstile) window.turnstile.remove(turnstileIdRef.current);
      turnstileIdRef.current = undefined;
    };
  }, [turnstileSiteKey, showForm]);

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus();
  }, [status]);

  function messageFor(field: OrderField, code: ErrorCode): string {
    if (field === 'email' && code === 'invalid') return copy.errors.emailInvalid;
    return copy.errors[code];
  }

  function describe(field: OrderField, extraHint = false) {
    const ids = [extraHint ? `${field}-hint` : '', errors[field] ? `${field}-error` : ''].filter(Boolean);
    return {
      'aria-invalid': errors[field] ? (true as const) : undefined,
      'aria-describedby': ids.length ? ids.join(' ') : undefined,
    };
  }

  function validateOne(field: keyof OrderInput) {
    const form = formRef.current;
    if (!form) return;
    const found = validateOrder(readInput(form));
    setErrors((current) => {
      const next = { ...current };
      if (found[field]) next[field] = found[field];
      else delete next[field];
      return next;
    });
  }

  function onFilesChange(files: FileList | null) {
    const list = files ? Array.from(files) : [];
    setFileNames(list.map((file) => file.name));
    const code = validateFiles(list, maxUploadMb * 1024 * 1024);
    setErrors((current) => {
      const next = { ...current };
      if (code) next.artwork = code;
      else delete next.artwork;
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form || status === 'sending') return;

    const input = readInput(form);
    const found = validateOrder(input);
    const files = uploadEnabled ? Array.from(form.querySelector<HTMLInputElement>('#artwork')?.files ?? []) : [];
    const fileCode = validateFiles(files, maxUploadMb * 1024 * 1024);
    if (fileCode) found.artwork = fileCode;
    setErrors(found);

    if (hasErrors(found)) {
      const first = (['name', 'email', 'country', 'need', 'artwork', 'details', 'message', 'company'] as const).find(
        (field) => found[field],
      );
      if (first) form.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/order', { method: 'POST', body: new FormData(form) });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; errors?: OrderErrors };
      if (response.ok && result.ok) {
        track('form_submitted');
        setSentTo(input.email.trim());
        setStatus('sent');
        return;
      }
      if (result.errors) setErrors(result.errors);
      if (window.turnstile) window.turnstile.reset(turnstileIdRef.current);
      setStatus('failed');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="outline-none">
        <h3 className="text-[1.75rem] md:text-[2rem]">{copy.success.title}</h3>
        <p className="mt-4 measure">{copy.success.body.replace('[email]', sentTo)}</p>
        {!uploadEnabled && <p className="mt-3 measure">{copy.success.artworkOff}</p>}
        <p className="mt-3 text-muted">{copy.success.spam}</p>
        <button
          type="button"
          className="btn btn-ghost mt-8"
          onClick={() => {
            setStatus('idle');
            setErrors({});
            setFileNames([]);
          }}
        >
          {copy.success.again}
        </button>
      </div>
    );
  }

  const hasFieldErrors = hasErrors(errors);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="order-title">
      <h3 id="order-title" className="text-[1.75rem] md:text-[2rem]">
        {copy.title}
      </h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="name" label={copy.labels.name} error={errors.name && messageFor('name', errors.name)}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={200}
            className="field"
            onBlur={() => validateOne('name')}
            {...describe('name')}
          />
        </Field>
        <Field id="email" label={copy.labels.email} error={errors.email && messageFor('email', errors.email)}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={300}
            className="field"
            onBlur={() => validateOne('email')}
            {...describe('email')}
          />
        </Field>
        <Field id="company" label={copy.labels.company} error={errors.company && messageFor('company', errors.company)}>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={200}
            className="field"
            onBlur={() => validateOne('company')}
            {...describe('company')}
          />
        </Field>
        <Field id="country" label={copy.labels.country} error={errors.country && messageFor('country', errors.country)}>
          <select
            id="country"
            name="country"
            autoComplete="country"
            required
            defaultValue=""
            className="field"
            onBlur={() => validateOne('country')}
            onChange={() => validateOne('country')}
            {...describe('country')}
          >
            <option value="" disabled>
              {copy.chooseCountry}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field id="need" label={copy.labels.need} error={errors.need && messageFor('need', errors.need)}>
          <select
            id="need"
            name="need"
            required
            defaultValue=""
            className="field"
            onBlur={() => validateOne('need')}
            onChange={() => validateOne('need')}
            {...describe('need')}
          >
            <option value="" disabled>
              {copy.choose}
            </option>
            {needs.map((need) => (
              <option key={need} value={need}>
                {copy.needOptions[need as keyof typeof copy.needOptions]}
              </option>
            ))}
          </select>
        </Field>

        {uploadEnabled ? (
          <Field
            id="artwork"
            label={copy.labels.artwork}
            hint={copy.hints.artwork}
            error={errors.artwork && messageFor('artwork', errors.artwork)}
          >
            <input
              id="artwork"
              name="artwork"
              type="file"
              multiple
              accept="image/*,.pdf,.svg,.ai,.eps,.cdr,.psd,.wmf,.emf"
              className="field py-2.5 file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-paper"
              onChange={(event) => onFilesChange(event.target.files)}
              {...describe('artwork', true)}
            />
            {fileNames.length > 0 && <p className="mt-1.5 text-[0.9375rem] text-muted">{fileNames.join(', ')}</p>}
          </Field>
        ) : (
          <p className="border border-line bg-paper px-4 py-3 text-[0.9375rem]">{copy.artworkOff}</p>
        )}

        <Field
          id="details"
          label={copy.labels.details}
          hint={copy.hints.details}
          error={errors.details && messageFor('details', errors.details)}
        >
          <input
            id="details"
            name="details"
            type="text"
            maxLength={400}
            className="field"
            onBlur={() => validateOne('details')}
            {...describe('details', true)}
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-[0.9375rem] font-semibold">{copy.labels.formats}</legend>
          <div className="flex flex-wrap gap-2">
            {formats.map((format) => (
              <label
                key={format}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-line bg-white px-3 text-[0.9375rem]"
              >
                <input type="checkbox" name="formats" value={format} className="h-4 w-4 accent-ink" />
                {format === 'other' ? copy.formatOther : format}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-[1rem]">
          <input type="checkbox" name="rush" className="h-5 w-5 accent-ink" />
          {copy.labels.rush}
        </label>

        <Field id="message" label={copy.labels.message} error={errors.message && messageFor('message', errors.message)}>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={5000}
            className="field"
            onBlur={() => validateOne('message')}
            {...describe('message')}
          />
        </Field>
      </div>

      {/* Honeypot: invisible to people, tempting to bots. Must stay empty. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {turnstileSiteKey && <div ref={turnstileRef} className="mt-5" />}

      <div className="mt-7">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? copy.sending : copy.submit}
        </button>
        <p className="mt-4 text-[0.9375rem] text-muted">
          {copy.consentBefore}
          <a href="/privacy/" className="link">
            {copy.consentLink}
          </a>
          {copy.consentAfter}
        </p>
        <div aria-live="polite" className="mt-3">
          {hasFieldErrors && <p className="field-error">{copy.summaryError}</p>}
          {status === 'failed' && <p className="field-error">{copy.failure}</p>}
        </div>
      </div>
    </form>
  );
}
