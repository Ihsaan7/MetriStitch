import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site.config';
import { getPages, type Section } from '@/lib/content';

export const dynamic = 'force-static';

/** Generated at build. A new Markdown page appears here on its own. */
export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: built, priority: 1 },
    { url: `${siteUrl}/privacy/`, lastModified: built, priority: 0.2 },
    { url: `${siteUrl}/terms/`, lastModified: built, priority: 0.2 },
  ];

  for (const section of ['digitizing', 'guides'] as Section[]) {
    const pages = getPages(section);
    if (pages.length === 0) continue;
    entries.push({ url: `${siteUrl}/${section}/`, lastModified: built, priority: 0.6 });
    for (const page of pages) {
      entries.push({
        url: `${siteUrl}/${section}/${page.slug}/`,
        lastModified: new Date(`${page.updated ?? page.date}T00:00:00Z`),
        priority: 0.7,
      });
    }
  }
  return entries;
}
