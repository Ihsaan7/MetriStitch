import { copy } from '@/content/copy.en';
import { formatDate, getPages, type ContentPage } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';
import { contentPageLd } from '@/lib/jsonld';
import JsonLd from './JsonLd';

const SECTION_LABEL = { digitizing: copy.content.backDigitizing, guides: copy.content.backGuides } as const;

/** One Markdown page: title, intro, body, call to action, and links to the other pages in the section. */
export default function ContentArticle({ page }: { page: ContentPage }) {
  const others = getPages(page.section).filter((other) => other.slug !== page.slug);
  const url = absoluteUrl(`/${page.section}/${page.slug}/`);

  return (
    <article className="wrap section">
      <JsonLd
        data={contentPageLd({
          kind: page.section === 'guides' ? 'Article' : 'Service',
          title: page.title,
          description: page.description,
          url,
          datePublished: page.date,
          dateModified: page.updated,
        })}
      />
      <a href={`/${page.section}/`} className="link text-[0.9375rem] font-medium">
        {SECTION_LABEL[page.section]}
      </a>
      <h1 className="mt-6 max-w-[20ch] text-[2.5rem] leading-[1.05] md:text-[3.75rem]">{page.title}</h1>
      <p className="mt-6 measure text-[1.1875rem] leading-relaxed text-muted md:text-[1.25rem]">{page.description}</p>
      <p className="mt-4 text-[0.9375rem] text-muted">
        {copy.content.published} <time dateTime={page.date}>{formatDate(page.date)}</time>
        {page.updated && (
          <>
            {'. '}
            {copy.content.updated} <time dateTime={page.updated}>{formatDate(page.updated)}</time>
          </>
        )}
      </p>
      <hr className="stitch mt-8" />

      <div className="prose-ms mt-10" dangerouslySetInnerHTML={{ __html: page.html }} />

      <aside className="mt-16 border border-line bg-white p-6 md:p-8">
        <h2 className="text-[1.75rem] md:text-[2rem]">{copy.content.ctaTitle}</h2>
        <p className="mt-3 text-muted">{copy.content.ctaBody}</p>
        <a href="/#order" className="btn btn-primary mt-6">
          {copy.content.ctaButton}
        </a>
      </aside>

      {others.length > 0 && (
        <nav aria-label={copy.content.readMore} className="mt-16">
          <h2 className="text-[1.5rem]">{copy.content.readMore}</h2>
          <ul className="mt-4 space-y-2">
            {others.map((other) => (
              <li key={other.slug}>
                <a href={`/${other.section}/${other.slug}/`} className="link">
                  {other.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
