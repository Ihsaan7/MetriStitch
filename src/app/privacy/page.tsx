import LegalPage from '@/components/LegalPage';
import { copy } from '@/content/copy.en';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: copy.meta.legalTitlePrivacy,
  description: copy.privacy.intro,
  path: '/privacy/',
});

export default function PrivacyPage() {
  return <LegalPage title={copy.privacy.title} intro={copy.privacy.intro} sections={copy.privacy.sections} />;
}
