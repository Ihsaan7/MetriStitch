import { SectionIndex, sectionIndexMetadata } from '@/lib/sections';

export const metadata = sectionIndexMetadata('digitizing');

export default function DigitizingIndex() {
  return <SectionIndex section="digitizing" />;
}
