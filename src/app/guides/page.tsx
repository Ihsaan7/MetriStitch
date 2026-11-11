import { SectionIndex, sectionIndexMetadata } from '@/lib/sections';

export const metadata = sectionIndexMetadata('guides');

export default function GuidesIndex() {
  return <SectionIndex section="guides" />;
}
