# MetriStitch website (Phase 1)

Marketing site and order form for an embroidery digitizing studio. Next.js (App Router, static export),
TypeScript, Tailwind 4. Hosted on Cloudflare Pages (free plan). The original brief is in `docs/brief.md`.

## Run locally

Needs Node 22 (`.nvmrc`).

```bash
npm install          # also creates package-lock.json: commit it
npm run dev          # http://localhost:3000
npm test             # unit and render tests
npm run lint && npm run typecheck
npm run build        # preview-style build into out/
npm run build:production   # production rules (see "PLACEHOLDER gate")
npm run preview      # after a build: serves out/ with the Pages Function (needs .dev.vars)
```

## Where things live

| What | Where |
| --- | --- |
| Brand name, domain, email, WhatsApp, facts, feature flags | `src/config/site.config.ts` |
| All visible copy (one file, ready for a Romanian copy) | `src/content/copy.en.ts` |
| Prices and turnaround (only place numbers live) | `src/data/pricing.json` |
| Portfolio pieces | `src/data/portfolio.json` |
| Homepage sections | `src/components/` |
| Order form backend | `functions/api/order.ts` |
| Markdown pages | `content/digitizing/`, `content/guides/` |
| Security headers | `public/_headers` |

Copy and Markdown use tokens such as `{{brand}}`, `{{price:logo-standard}}`, `{{turnaround:ornate}}`,
`{{fact:revisionDays}}`. A typo in a token fails the build.

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub. In Cloudflare: Workers & Pages > Create > Pages > connect the repo.
2. Build command `npm run build`, output directory `out`, environment variable `NODE_VERSION=22`.
3. Production branch: `main`. Every other branch and pull request gets a preview URL.
4. Add variables under Settings > Variables and Secrets (see `.env.example` and `.dev.vars.example`):
   `RESEND_API_KEY` (secret), `MAIL_FROM`, `NOTIFY_EMAIL` (optional), `TURNSTILE_SECRET_KEY` (secret),
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. The `NEXT_PUBLIC_` ones are read at build time.
5. Custom domain: Pages project > Custom domains. Turn on "Always Use HTTPS" for the zone. The domain in
   `site.config.ts` (`metristitch.com`, to be confirmed) feeds canonical URLs, the sitemap and structured data.
6. Email: verify your sending domain in Resend, then set `MAIL_FROM` to an address on it.

**Roll back:** Pages project > Deployments > pick an earlier production deployment > Rollback. Or revert the commit on `main`.

## Preview and production builds

A build is *production* when the branch is `main` on Cloudflare (or `METRISTITCH_ENV=production`).

- **Preview:** clearly marked placeholder frames, `noindex`, `robots.txt` disallows everything.
- **Production:** the Work section and its nav link render only when a piece has `"approved": true`. With no
  approved pair the hero is text-only. The build **fails** if the word `PLACEHOLDER` is in any shipped file
  (`scripts/check-build.mjs`). The privacy and terms review banner uses different wording on purpose; the build
  prints a warning while it shows. Set `legalReviewed: true` after review.

## Add portfolio photos

1. Put originals in `assets/work-src/` named `<id>-before.jpg` and `<id>-after.jpg` (ids as in `portfolio.json`).
2. `npm run images` writes WebP files to `public/work/` and prints their sizes.
3. In `portfolio.json` fill `title`, `alt`, `caption`, `width`, `height`, set `"approved": true`. Optionally add `"hero": true` to one piece.

## Add a page

Create `content/digitizing/<slug>.md` (or `content/guides/`):

```md
---
title: Page title
description: One or two sentences for search results.
date: 2026-11-11
---
Body in Markdown.
```

It becomes `/digitizing/<slug>/`, appears in the sitemap and the section index, and nothing else changes.
A missing title, description or valid date fails the build. Copy `content/digitizing/_template.md` to start.
Delete the three starter pages if you do not want them. (Markdown only; MDX is not set up.)

## Free-tier limits (checked November 2026)

- **Pages Functions:** share the Workers Free quota, 100,000 requests a day and 10 ms CPU per request. Static requests are unlimited.
- **Resend Free:** 3,000 emails a month, 100 a day, 1 domain. Two emails per submission, so about 50 submissions a day.
- **Turnstile:** free, no request cap on the free plan.
- **Umami Cloud Hobby:** free, cookieless, custom events; 100,000 events a month. Cloudflare Web Analytics cannot record custom events, so it is not used.
- **Artwork upload** is off (`features.artworkUpload`). Encoding a 10 MB attachment is not safe in 10 ms of CPU. The form tells people to email the artwork. Turn it on after moving to Workers Paid, then test a large file.

## Analytics events

`form_submitted`, `whatsapp_click`, `hero_button_click`, `pricing_viewed` (see `src/lib/analytics.ts`).

## Phase 2 hook

No payments or store in Phase 1. Add checkout under `src/app/checkout/` and a function under `functions/api/`.
