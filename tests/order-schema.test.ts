import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasErrors, validateFiles, validateOrder, type OrderInput } from '../src/lib/orderSchema';

const valid: OrderInput = {
  name: 'A. Customer',
  email: 'customer@example.com',
  company: '',
  country: 'PK',
  need: 'logo',
  details: '',
  formats: ['DST'],
  rush: false,
  message: '',
  honeypot: '',
};

describe('order validation', () => {
  it('accepts a minimal valid request', () => {
    assert.deepEqual(validateOrder(valid), {});
  });

  it('requires name, email, country and need', () => {
    const errors = validateOrder({ ...valid, name: ' ', email: '', country: '', need: '' });
    assert.equal(errors.name, 'required');
    assert.equal(errors.email, 'required');
    assert.equal(errors.country, 'required');
    assert.equal(errors.need, 'required');
  });

  it('rejects a bad email, unknown country, unknown need and unknown format', () => {
    assert.equal(validateOrder({ ...valid, email: 'nope' }).email, 'invalid');
    assert.equal(validateOrder({ ...valid, country: 'XX' }).country, 'invalid');
    assert.equal(validateOrder({ ...valid, need: 'free-money' }).need, 'invalid');
    assert.equal(validateOrder({ ...valid, formats: ['EXE'] }).formats, 'invalid');
  });

  it('limits long text', () => {
    assert.equal(validateOrder({ ...valid, message: 'a'.repeat(4001) }).message, 'tooLong');
    assert.ok(hasErrors(validateOrder({ ...valid, name: 'a'.repeat(121) })));
  });
});

describe('artwork validation', () => {
  const tenMb = 10 * 1024 * 1024;

  it('accepts images, PDF and vector files under the limit', () => {
    assert.equal(validateFiles([{ name: 'logo.png', size: 1000 }, { name: 'art.AI', size: 2000 }], tenMb), null);
  });
  it('rejects other file types', () => {
    assert.equal(validateFiles([{ name: 'run.exe', size: 10 }], tenMb), 'badType');
  });
  it('rejects more than 10 MB in total', () => {
    assert.equal(validateFiles([{ name: 'a.pdf', size: 6 * 1024 * 1024 }, { name: 'b.pdf', size: 5 * 1024 * 1024 }], tenMb), 'tooBig');
  });
});
