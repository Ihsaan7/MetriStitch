import { siteConfig } from '../config/site.config';
import { formatPrice, getPrice, humanizeTurnaround, turnaroundHours } from './pricing';

/**
 * Copy and Markdown may contain tokens in double braces. They are filled from the
 * config and data files so a number is only ever written in one place:
 *
 *   {{brand}} {{domain}} {{email}}
 *   {{price:ID}}       "$18", "from €60", "+25%"
 *   {{turnaround:ID}}  "48 hours", "3 to 5 days"
 *   {{hours:ID}}       "48"
 *   {{fact:KEY}}       years, revisionDays, quoteTime, maxUploadMb, formats, formatsAnd ...
 *
 * An unknown token throws, so a typo fails the build instead of shipping.
 */
const TOKEN = /\{\{\s*([a-zA-Z]+)(?::([\w-]+))?\s*\}\}/g;

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function factValue(key: string): string {
  const { facts } = siteConfig;
  switch (key) {
    case 'years':
      return facts.years;
    case 'formats':
      return facts.formats.join(', ');
    case 'formatsAnd':
      return joinAnd(facts.formats);
    case 'revisionRounds':
      return String(facts.revisionRounds);
    case 'revisionDays':
      return String(facts.revisionDays);
    case 'quoteTime':
      return facts.quoteTime;
    case 'maxUploadMb':
      return String(facts.maxUploadMb);
    default:
      throw new Error(`Unknown fact token "{{fact:${key}}}"`);
  }
}

export function resolveTokens(input: string): string {
  return input.replace(TOKEN, (match, kind: string, arg?: string) => {
    switch (kind) {
      case 'brand':
        return siteConfig.brandName;
      case 'domain':
        return siteConfig.domain;
      case 'email':
        return siteConfig.email;
      case 'price':
        return formatPrice(getPrice(requireArg(match, arg)));
      case 'turnaround':
        return humanizeTurnaround(getPrice(requireArg(match, arg)).turnaround);
      case 'hours': {
        const hours = turnaroundHours(getPrice(requireArg(match, arg)).turnaround);
        if (!hours) throw new Error(`Token ${match}: turnaround is not a number of hours`);
        return hours;
      }
      case 'fact':
        return factValue(requireArg(match, arg));
      default:
        throw new Error(`Unknown token ${match}`);
    }
  });
}

function requireArg(token: string, arg: string | undefined): string {
  if (!arg) throw new Error(`Token ${token} needs an argument`);
  return arg;
}

/** Resolve tokens in every string of a nested object. */
export function resolveDeep<T>(value: T): T {
  if (typeof value === 'string') return resolveTokens(value) as T;
  if (Array.isArray(value)) return value.map((item) => resolveDeep(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, resolveDeep(item)]),
    ) as T;
  }
  return value;
}
