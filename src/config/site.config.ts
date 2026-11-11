/**
 * Business facts live here, not in components.
 * Change `brandName` and it changes everywhere: header, footer, metadata,
 * JSON-LD, legal pages, emails, Open Graph image and Markdown pages.
 *
 * Anything still reading PLACEHOLDER must be filled in before the production
 * build will pass (`npm run build:production`).
 */

export interface SiteConfig {
  /** The one place the brand name is written. */
  brandName: string;
  /** Production domain without protocol. To be confirmed; connect it later in Cloudflare Pages. */
  domain: string;
  /** Business email: shown on the site and used for order notifications. */
  email: string;
  /** WhatsApp number in international format, digits only (for example 923001234567). */
  whatsappNumber: string;
  /** Social profile links. Leave empty until real profiles exist. */
  social: { label: string; url: string }[];
  /** Facts the copy may state. Everything else is a placeholder. */
  facts: {
    /** Shown as "<value> years of digitizing". */
    years: string;
    /** File formats delivered as standard. Others on request. */
    formats: string[];
    revisionRounds: number;
    revisionDays: number;
    /** How quickly a quote is sent. Confirm before launch. */
    quoteTime: string;
    maxUploadMb: number;
  };
  features: {
    /**
     * Artwork upload in the order form. Off by default: the free Workers plan allows
     * 10 ms of CPU per request, which is not enough to safely encode a 10 MB attachment.
     * Turn on after moving to Workers Paid, or after testing a large upload in production.
     * When off, the form tells people to email the artwork.
     */
    artworkUpload: boolean;
  };
  /** Set to true once the owner has reviewed /privacy and /terms. Hides the review banner. */
  legalReviewed: boolean;
  /** Optional workspace photo for the About section. No people. */
  aboutPhoto: { src: string; alt: string; width: number; height: number } | null;
  locale: string;
}

export const siteConfig: SiteConfig = {
  brandName: 'MetriStitch',
  domain: 'metristitch.com', // To be confirmed.
  email: 'PLACEHOLDER', // Business email address.
  whatsappNumber: 'PLACEHOLDER', // Digits only, with country code.
  social: [],
  facts: {
    years: '10+',
    formats: ['DST', 'PES', 'JEF', 'EXP'],
    revisionRounds: 1,
    revisionDays: 3,
    quoteTime: 'the same day',
    maxUploadMb: 10,
  },
  features: {
    artworkUpload: false,
  },
  legalReviewed: false,
  aboutPhoto: null,
  locale: 'en',
};

export const siteUrl = `https://${siteConfig.domain}`;

export function isPlaceholder(value: string): boolean {
  return value.includes('PLACEHOLDER');
}
