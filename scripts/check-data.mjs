// Checks pricing.json and portfolio.json before the build. Runs on every build.
// In production it also refuses leftover marker text in pricing.json and in approved portfolio pieces.
import fs from 'node:fs';
import path from 'node:path';
import { isProductionBuild, readJson, report, root } from './lib.mjs';

const MARKER = 'PLACEHOLDER';
const production = isProductionBuild();
const errors = [];

// --- pricing.json -----------------------------------------------------------
const pricing = readJson('src/data/pricing.json');
const pricingKeys = ['id', 'label', 'price', 'currency', 'unit', 'turnaround', 'note', 'from'];
const seen = new Set();

if (!Array.isArray(pricing) || pricing.length === 0) errors.push('pricing.json must be a non-empty array');
for (const [index, entry] of (Array.isArray(pricing) ? pricing : []).entries()) {
  const where = `pricing.json entry ${index + 1}${entry?.id ? ` (${entry.id})` : ''}`;
  for (const key of pricingKeys) {
    if (!(key in entry)) errors.push(`${where}: missing "${key}"`);
  }
  if (seen.has(entry.id)) errors.push(`${where}: duplicate id`);
  seen.add(entry.id);
  if (entry.price !== null && typeof entry.price !== 'number') errors.push(`${where}: price must be a number or null`);
  if (entry.price === null && !entry.priceLabel) errors.push(`${where}: a null price needs a priceLabel`);
  if (entry.currency !== null && !/^[A-Z]{3}$/.test(entry.currency)) errors.push(`${where}: currency must be a 3-letter code or null`);
  if (typeof entry.from !== 'boolean') errors.push(`${where}: "from" must be true or false`);
  if (production && JSON.stringify(entry).includes(MARKER)) errors.push(`${where}: still contains ${MARKER}`);
}

// --- portfolio.json ---------------------------------------------------------
const portfolio = readJson('src/data/portfolio.json');
const categories = new Set(['ornate', 'logo']);
const pieceKeys = ['id', 'category', 'title', 'before', 'after', 'alt', 'caption', 'approved'];
const pieceIds = new Set();

for (const [index, piece] of portfolio.entries()) {
  const where = `portfolio.json piece ${index + 1}${piece?.id ? ` (${piece.id})` : ''}`;
  for (const key of pieceKeys) {
    if (!(key in piece)) errors.push(`${where}: missing "${key}"`);
  }
  if (pieceIds.has(piece.id)) errors.push(`${where}: duplicate id`);
  pieceIds.add(piece.id);
  if (!categories.has(piece.category)) errors.push(`${where}: category must be "ornate" or "logo"`);
  if (typeof piece.approved !== 'boolean') errors.push(`${where}: "approved" must be true or false`);

  if (piece.approved === true) {
    // An approved piece goes live, so it has to be complete.
    for (const key of ['title', 'alt', 'caption']) {
      if (!String(piece[key] ?? '').trim()) errors.push(`${where}: approved piece needs a ${key}`);
      if (String(piece[key] ?? '').includes(MARKER)) errors.push(`${where}: approved piece still has ${MARKER} in ${key}`);
    }
    for (const key of ['before', 'after']) {
      const file = path.join(root, 'public', String(piece[key] ?? '').replace(/^\//, ''));
      if (!fs.existsSync(file)) errors.push(`${where}: approved piece but ${piece[key]} is not in public/`);
    }
    if (!Number.isInteger(piece.width) || !Number.isInteger(piece.height)) {
      errors.push(`${where}: approved piece needs integer width and height (images need set dimensions)`);
    }
  }
}

if (errors.length) {
  report('data check failed', errors);
  process.exit(1);
}
console.log(`Data check passed (${pricing.length} prices, ${portfolio.filter((p) => p.approved).length} of ${portfolio.length} pieces approved).`);
