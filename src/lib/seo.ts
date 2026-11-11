import type { Metadata } from 'next';
import { siteConfig, siteUrl } from '../config/site.config';
import { isProduction } from './env';

export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630 };

interface PageMetaInput {
  /** Page title without the brand; the layout template adds it. Use `absolute` to skip the template. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  /** Path with leading and trailing slash, for example /privacy/ */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

/** Title, description, canonical, Open Graph and social card for one page. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${siteConfig.brandName}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: isProduction ? undefined : { index: false, follow: false },
    openGraph: {
      type: input.type ?? 'website',
      siteName: siteConfig.brandName,
      title: fullTitle,
      description: input.description,
      url: input.path,
      images: [{ ...OG_IMAGE, alt: siteConfig.brandName }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
      images: [OG_IMAGE.url],
    },
  };
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}
