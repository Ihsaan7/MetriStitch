import type { Metadata } from 'next';
import { copy } from '@/content/copy.en';

export const metadata: Metadata = {
  title: copy.meta.notFoundTitle,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="wrap section">
      <h1 className="h-section">{copy.notFound.title}</h1>
      <p className="mt-6 measure text-muted">{copy.notFound.body}</p>
      <p className="mt-8">
        <a href="/" className="btn btn-ghost">
          {copy.notFound.link}
        </a>
      </p>
    </div>
  );
}
