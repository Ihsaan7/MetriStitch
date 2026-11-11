import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatPrice, getPrice, humanizeTurnaround, pricing } from '../src/lib/pricing';

describe('pricing.json holds the agreed starting prices', () => {
  const expected: Record<string, { price: number | null; currency: string | null; turnaround: string; from?: boolean }> = {
    'logo-simple': { price: 12, currency: 'USD', turnaround: '48 h' },
    'logo-standard': { price: 18, currency: 'USD', turnaround: '48 h' },
    ornate: { price: 60, currency: 'EUR', turnaround: '3 to 5 days', from: true },
    rush: { price: 25, currency: null, turnaround: '24 h' },
    'monthly-plan': { price: 300, currency: 'USD', turnaround: '48 h' },
    'extra-revision': { price: 30, currency: null, turnaround: 'n/a' },
    'free-trial': { price: 0, currency: 'USD', turnaround: '48 h' },
  };

  for (const [id, want] of Object.entries(expected)) {
    it(id, () => {
      const entry = getPrice(id);
      assert.equal(entry.price, want.price);
      assert.equal(entry.currency, want.currency);
      assert.equal(entry.turnaround, want.turnaround);
      assert.equal(entry.from, want.from ?? false);
    });
  }

  it('has the matched set with a text price and a by-scope turnaround', () => {
    const entry = getPrice('matched-set');
    assert.equal(entry.price, null);
    assert.equal(entry.turnaround, 'By scope');
    assert.match(formatPrice(entry), /10 to 15%/);
  });

  it('covers all eight rows with unique ids', () => {
    assert.equal(pricing.length, 8);
    assert.equal(new Set(pricing.map((p) => p.id)).size, 8);
  });
});

describe('price formatting', () => {
  it('formats the way a visitor reads it', () => {
    assert.equal(formatPrice(getPrice('logo-simple')), '$12');
    assert.equal(formatPrice(getPrice('ornate')), 'from €60');
    assert.equal(formatPrice(getPrice('rush')), '+25%');
    assert.equal(formatPrice(getPrice('free-trial')), 'Free');
  });

  it('humanizes hour turnarounds only', () => {
    assert.equal(humanizeTurnaround('48 h'), '48 hours');
    assert.equal(humanizeTurnaround('3 to 5 days'), '3 to 5 days');
  });
});
