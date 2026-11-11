// `npm run build`          preview-style build (placeholders allowed, marked frames shown)
// `npm run build:production` production rules: hides unfinished sections, fails on PLACEHOLDER
// Cloudflare Pages runs `npm run build`; the branch "main" is detected automatically.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const env = { ...process.env };
if (process.argv.includes('--production')) env.METRISTITCH_ENV = 'production';

function run(label, args) {
  console.log(`\n> ${label}`);
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('check data', ['scripts/check-data.mjs']);
run('next build', [require.resolve('next/dist/bin/next'), 'build']);
run('check build', ['scripts/check-build.mjs']);
