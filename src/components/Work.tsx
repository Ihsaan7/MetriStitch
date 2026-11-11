import { copy } from '@/content/copy.en';
import { piecesForWork } from '@/lib/portfolio';
import WorkGallery, { type GalleryPiece } from './WorkGallery';

/**
 * Renders only when there is something to show: in production that means at least one
 * piece with approved: true. Unapproved pieces never reach the browser in production.
 */
export default function Work() {
  const pieces = piecesForWork();
  if (pieces.length === 0) return null;

  const items: GalleryPiece[] = pieces.map((piece) => ({
    id: piece.id,
    category: piece.category,
    title: piece.title,
    before: piece.before,
    after: piece.after,
    alt: piece.alt,
    caption: piece.caption,
    width: piece.width,
    height: piece.height,
    placeholder: !piece.approved,
  }));

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="wrap">
        <p className="eyebrow">{copy.nav.work}</p>
        <h2 id="work-title" className="h-section mt-3">
          {copy.work.title}
        </h2>
        <p className="mt-5 measure text-muted">{copy.work.intro}</p>
        <div className="mt-10">
          <WorkGallery pieces={items} labels={copy.work} />
        </div>
      </div>
    </section>
  );
}
