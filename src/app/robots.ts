import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site.config';
import { isProduction } from '@/lib/env';

export const dynamic = 'force-static';

/** Previews ask crawlers to stay away, so a *.pages.dev preview never competes with the real site. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
