import LegalPage from '@/components/LegalPage';
import { copy } from '@/content/copy.en';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: copy.meta.legalTitleTerms,
  description: copy.terms.intro,
  path: '/terms/',
});

export default function TermsPage() {
  return <LegalPage title={copy.terms.title} intro={copy.terms.intro} sections={copy.terms.sections} />;
}
