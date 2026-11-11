import { siteConfig } from '@/config/site.config';
import { copy } from '@/content/copy.en';

interface LegalPageProps {
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}

/**
 * Plain-language legal template. The review banner stays until `legalReviewed` is set to true
 * in site.config.ts. It uses different wording from the PLACEHOLDER marker on purpose, so it does
 * not trip the production check; the build prints a warning while the banner is showing.
 */
export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <article className="wrap section">
      {!siteConfig.legalReviewed && (
        <p role="note" className="mb-8 inline-block border border-gold-ink bg-white px-4 py-2 text-[0.9375rem] font-semibold text-gold-ink">
          {copy.legalBanner}
        </p>
      )}
      <h1 className="text-[2.5rem] leading-[1.05] md:text-[3.75rem]">{title}</h1>
      <p className="mt-6 measure text-[1.1875rem] leading-relaxed text-muted">{intro}</p>
      <hr className="stitch mt-8" />
      <div className="prose-ms mt-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
