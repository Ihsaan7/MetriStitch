import { copy } from '@/content/copy.en';
import { formatDate, type ContentPage } from '@/lib/content';

export default function ContentIndex({ title, intro, pages }: { title: string; intro: string; pages: ContentPage[] }) {
  return (
    <div className="wrap section">
      <h1 className="text-[2.5rem] leading-[1.05] md:text-[3.75rem]">{title}</h1>
      <p className="mt-6 measure text-[1.1875rem] leading-relaxed text-muted">{intro}</p>
      <hr className="stitch mt-8" />
      {pages.length === 0 ? (
        <p className="mt-10 text-muted">{copy.content.emptyList}</p>
      ) : (
        <ul className="mt-6">
          {pages.map((page) => (
            <li key={page.slug} className="border-b border-line py-6">
              <h2 className="text-[1.5rem] md:text-[1.875rem]">
                <a href={`/${page.section}/${page.slug}/`} className="hover:underline hover:decoration-gold hover:decoration-2 hover:underline-offset-4">
                  {page.title}
                </a>
              </h2>
              <p className="mt-2 measure text-muted">{page.description}</p>
              <p className="mt-2 text-[0.875rem] text-muted">
                <time dateTime={page.date}>{formatDate(page.date)}</time>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
