import type { Metadata } from 'next';
import { SectionPage, sectionPageMetadata, sectionParams } from '@/lib/sections';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionParams('guides');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return sectionPageMetadata('guides', slug);
}

export default async function GuidesPage({ params }: Props) {
  const { slug } = await params;
  return <SectionPage section="guides" slug={slug} />;
}
