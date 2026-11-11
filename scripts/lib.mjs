// Shared helpers for the build scripts. Plain Node, no dependencies.
import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();

/** Same rule as src/lib/env.ts: METRISTITCH_ENV wins, otherwise the Cloudflare branch decides. */
export function isProductionBuild() {
  if (process.env.METRISTITCH_ENV !== undefined) return process.env.METRISTITCH_ENV === 'production';
  return process.env.CF_PAGES_BRANCH === 'main';
}

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

export function report(kind, messages) {
  for (const message of messages) console.error(`${kind}: ${message}`);
}
