import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ContentArticle from '@/components/ContentArticle';
import ContentIndex from '@/components/ContentIndex';
import { copy } from '@/content/copy.en';
import { getPage, getPages, type Section } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

/**
 * Shared by /digitizing and /guides so the two routes stay identical.
 * Static export needs at least one param, so an empty section returns one dummy slug that 404s.
 */
const EMPTY_SLUG = '_empty';

export function sectionParams(section: Section): { slug: string }[] {
  const pages = getPages(section);
  return pages.length ? pages.map((page) => ({ slug: page.slug })) : [{ slug: EMPTY_SLUG }];
}

export function sectionPageMetadata(section: Section, slug: string): Metadata {
  const page = getPage(section, slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/${section}/${slug}/`,
    type: 'article',
    publishedTime: page.date,
  });
}

export function SectionPage({ section, slug }: { section: Section; slug: string }) {
  const page = getPage(section, slug);
  if (!page) notFound();
  return <ContentArticle page={page} />;
}

const INDEX_COPY = {
  digitizing: {
    title: copy.meta.digitizingIndexTitle,
    description: copy.meta.digitizingIndexDescription,
  },
  guides: {
    title: copy.meta.guidesIndexTitle,
    description: copy.meta.guidesIndexDescription,
  },
} as const;

export function sectionIndexMetadata(section: Section): Metadata {
  return pageMetadata({
    title: INDEX_COPY[section].title,
    description: INDEX_COPY[section].description,
    path: `/${section}/`,
  });
}

export function SectionIndex({ section }: { section: Section }) {
  return (
    <ContentIndex
      title={INDEX_COPY[section].title}
      intro={INDEX_COPY[section].description}
      pages={getPages(section)}
    />
  );
}
