import pricingData from '../data/pricing.json';

export interface PricingEntry {
  id: string;
  label: string;
  /** Number for fixed prices and percentages. null when the price is described in `priceLabel`. */
  price: number | null;
  /** ISO currency code, or null for percentages and text prices. */
  currency: string | null;
  unit: string;
  /** Display text that replaces the formatted number (for "+25%" and similar). */
  priceLabel?: string;
  turnaround: string;
  note: string;
  /** True for "from" prices. */
  from: boolean;
}

export const pricing = pricingData as unknown as PricingEntry[];

const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

export function getPrice(id: string): PricingEntry {
  const entry = pricing.find((p) => p.id === id);
  if (!entry) throw new Error(`pricing.json has no entry with id "${id}"`);
  return entry;
}

export function currencySymbol(code: string): string {
  return SYMBOLS[code] ?? `${code} `;
}

/** The price exactly as a visitor reads it: "$12", "from €60", "Free", "+25%". */
export function formatPrice(entry: PricingEntry): string {
  if (entry.priceLabel) return entry.priceLabel;
  if (entry.price === 0) return 'Free';
  if (entry.price === null || !entry.currency) {
    throw new Error(`pricing.json entry "${entry.id}" needs a price and currency, or a priceLabel`);
  }
  const amount = `${currencySymbol(entry.currency)}${entry.price}`;
  return entry.from ? `from ${amount}` : amount;
}

/** "48 h" becomes "48 hours". Other values pass through ("3 to 5 days"). */
export function humanizeTurnaround(value: string): string {
  const match = /^(\d+)\s*h$/i.exec(value.trim());
  return match ? `${match[1]} hours` : value;
}

/** The hour count of a turnaround such as "48 h", or null. */
export function turnaroundHours(value: string): string | null {
  const match = /^(\d+)\s*h$/i.exec(value.trim());
  return match ? match[1] : null;
}
