// Runs after `next build`. Looks at the finished site in /out.
//
// Always: required files exist (pages, sitemap, robots, headers, social card).
// Production only: the build FAILS if the word PLACEHOLDER is in any shipped file.
// Warnings (never fail): legal pages still marked for review, analytics or Turnstile keys unset.
import fs from 'node:fs';
import path from 'node:path';
import { isProductionBuild, report, root, walk } from './lib.mjs';

const MARKER = 'PLACEHOLDER';
const production = isProductionBuild();
const out = path.join(root, 'out');
const TEXT = new Set(['.html', '.txt', '.xml', '.json', '.js', '.css', '.map', '.svg', '.md', '.webmanifest']);

const failures = [];
const warnings = [];

if (!fs.existsSync(out)) {
  report('build check failed', ['the out/ folder does not exist. Did `next build` run?']);
  process.exit(1);
}

for (const required of ['index.html', '404.html', 'privacy/index.html', 'terms/index.html', 'sitemap.xml', 'robots.txt', '_headers', 'og.png', 'favicon.svg']) {
  if (!fs.existsSync(path.join(out, required))) failures.push(`missing ${required} in out/`);
}

const hits = [];
for (const file of walk(out)) {
  if (!TEXT.has(path.extname(file))) continue;
  const text = fs.readFileSync(file, 'utf8');
  let index = text.indexOf(MARKER);
  let count = 0;
  let sample = '';
  while (index !== -1) {
    count += 1;
    if (!sample) sample = text.slice(Math.max(0, index - 40), index + MARKER.length + 40).replace(/\s+/g, ' ');
    index = text.indexOf(MARKER, index + MARKER.length);
  }
  if (count) hits.push({ file: path.relative(root, file), count, sample });
}

if (production) {
  for (const hit of hits) failures.push(`${MARKER} found ${hit.count}x in ${hit.file}: "...${hit.sample}..."`);

  const privacy = path.join(out, 'privacy/index.html');
  if (fs.existsSync(privacy) && fs.readFileSync(privacy, 'utf8').includes('Owner to review before launch')) {
    warnings.push('the privacy and terms pages still show the review banner. Review them, then set legalReviewed: true in src/config/site.config.ts.');
  }
  if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) warnings.push('NEXT_PUBLIC_UMAMI_WEBSITE_ID is not set, so analytics is off.');
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) warnings.push('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, so the form has no Turnstile widget.');
} else if (hits.length) {
  console.log(`Preview build: ${hits.length} file(s) contain ${MARKER}. A production build would fail until they are filled in:`);
  for (const hit of hits) console.log(`  - ${hit.file} (${hit.count})`);
}

report('warning', warnings);
if (failures.length) {
  report('build check failed', failures);
  console.error(`\nThis is a production build (${process.env.METRISTITCH_ENV ? 'METRISTITCH_ENV=production' : `branch ${process.env.CF_PAGES_BRANCH}`}). Replace every ${MARKER} before deploying to main.`);
  process.exit(1);
}
console.log(`Build check passed (${production ? 'production' : 'preview'}).`);
