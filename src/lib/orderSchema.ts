import { siteConfig } from '../config/site.config';
import { isCountryCode } from './countries';

/** Shared by the browser form and the Pages Function, so both apply the same rules. */

export const NEED_OPTIONS = ['logo', 'ornate', 'plan', 'other'] as const;
export type Need = (typeof NEED_OPTIONS)[number];

export const FORMAT_OPTIONS: readonly string[] = [...siteConfig.facts.formats, 'other'];

export const MAX_LENGTH = {
  name: 120,
  email: 254,
  company: 120,
  details: 300,
  message: 4000,
} as const;

export const ARTWORK_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tif', 'tiff',
  'pdf', 'svg', 'ai', 'eps', 'cdr', 'psd', 'wmf', 'emf',
] as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface OrderInput {
  name: string;
  email: string;
  company: string;
  country: string;
  need: string;
  details: string;
  formats: string[];
  rush: boolean;
  message: string;
  /** Honeypot. Real visitors never see it, so it must stay empty. */
  honeypot: string;
}

export type ErrorCode = 'required' | 'invalid' | 'tooLong' | 'tooBig' | 'badType';
export type OrderField = keyof OrderInput | 'artwork';
export type OrderErrors = Partial<Record<OrderField, ErrorCode>>;

export function validateOrder(input: OrderInput): OrderErrors {
  const errors: OrderErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();

  if (!name) errors.name = 'required';
  else if (name.length > MAX_LENGTH.name) errors.name = 'tooLong';

  if (!email) errors.email = 'required';
  else if (email.length > MAX_LENGTH.email) errors.email = 'tooLong';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'invalid';

  if (input.company.trim().length > MAX_LENGTH.company) errors.company = 'tooLong';

  if (!input.country) errors.country = 'required';
  else if (!isCountryCode(input.country)) errors.country = 'invalid';

  if (!input.need) errors.need = 'required';
  else if (!(NEED_OPTIONS as readonly string[]).includes(input.need)) errors.need = 'invalid';

  if (input.details.trim().length > MAX_LENGTH.details) errors.details = 'tooLong';
  if (input.message.trim().length > MAX_LENGTH.message) errors.message = 'tooLong';
  if (input.formats.some((format) => !FORMAT_OPTIONS.includes(format))) errors.formats = 'invalid';

  return errors;
}

export function hasErrors(errors: OrderErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function fileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot === -1 ? '' : fileName.slice(dot + 1).toLowerCase();
}

/** Checks the artwork files: allowed types and total size. Returns null when fine. */
export function validateFiles(files: { name: string; size: number }[], maxBytes: number): ErrorCode | null {
  if (files.some((file) => !(ARTWORK_EXTENSIONS as readonly string[]).includes(fileExtension(file.name)))) {
    return 'badType';
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  return total > maxBytes ? 'tooBig' : null;
}
