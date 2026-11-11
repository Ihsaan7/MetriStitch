import About from '@/components/About';
import Contact from '@/components/Contact';
import FactsStrip from '@/components/FactsStrip';
import Faq from '@/components/Faq';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Work from '@/components/Work';
import { copy } from '@/content/copy.en';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: copy.meta.homeTitle,
  absoluteTitle: true,
  description: copy.meta.homeDescription,
  path: '/',
});

/** Nine sections, in order: header (layout), hero, facts, work, pricing, how it works, about, FAQ, contact. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FactsStrip />
      <Work />
      <Pricing />
      <HowItWorks />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
