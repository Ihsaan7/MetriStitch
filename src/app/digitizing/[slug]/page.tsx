import type { Metadata } from 'next';
import { SectionPage, sectionPageMetadata, sectionParams } from '@/lib/sections';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionParams('digitizing');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return sectionPageMetadata('digitizing', slug);
}

export default async function DigitizingPage({ params }: Props) {
  const { slug } = await params;
  return <SectionPage section="digitizing" slug={slug} />;
}
