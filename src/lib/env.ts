/**
 * Build-time environment. Read only in server code (it runs while the static site is built).
 *
 * Production = the build for the `main` branch on Cloudflare Pages, or any build with
 * METRISTITCH_ENV=production. Everything else (other branches, local builds) is a preview:
 * previews show clearly marked placeholder frames and ask search engines not to index.
 * Production hides unfinished sections and fails on leftover PLACEHOLDER text.
 */
export const isProduction: boolean =
  process.env.METRISTITCH_ENV !== undefined
    ? process.env.METRISTITCH_ENV === 'production'
    : process.env.CF_PAGES_BRANCH === 'main';

export const turnstileSiteKey: string = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
export const umamiWebsiteId: string = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '';
