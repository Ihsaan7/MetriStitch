import { copy } from '@/content/copy.en';
import { isProduction } from '@/lib/env';
import { heroPiece } from '@/lib/portfolio';
import TrackedLink from './TrackedLink';

function Frame({ src, alt, label, width, height }: { src: string; alt: string; label: string; width: number; height: number }) {
  return (
    <figure>
      {/* Hero image is above the fold: no lazy loading, high priority. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority="high"
        className="aspect-[4/3] w-full border border-line bg-white object-cover"
      />
      <figcaption className="mt-2 text-[0.9375rem] text-muted">{label}</figcaption>
    </figure>
  );
}

function PlaceholderFrame({ label, caption }: { label: string; caption: string }) {
  return (
    <figure>
      <div className="ph-frame aspect-[4/3] w-full">{label}</div>
      <figcaption className="mt-2 text-[0.9375rem] text-muted">{caption}</figcaption>
    </figure>
  );
}

export default function Hero() {
  const piece = heroPiece();
  // Production without an approved pair gets a text-only hero. Previews get marked frames.
  const showVisual = piece !== null || !isProduction;

  return (
    <section aria-labelledby="hero-title" className="pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <div className={showVisual ? 'col-span-12 lg:col-span-6' : 'col-span-12 lg:col-span-9'}>
          <h1
            id="hero-title"
            className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]"
          >
            {copy.hero.headline}
          </h1>
          <hr className="stitch mt-8 w-24" />
          <p className="mt-8 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted md:text-[1.25rem]">
            {copy.hero.subline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <TrackedLink href="#order" event="hero_button_click" className="btn btn-primary">
              {copy.hero.primary}
            </TrackedLink>
            <a href="#pricing" className="link self-start py-2 font-medium sm:self-auto">
              {copy.hero.secondary}
            </a>
          </div>
        </div>

        {showVisual && (
          <div className="col-span-12 lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {piece ? (
                <>
                  <Frame
                    src={piece.before}
                    alt={`Original artwork: ${piece.alt}`}
                    label={copy.hero.before}
                    width={piece.width}
                    height={piece.height}
                  />
                  <Frame
                    src={piece.after}
                    alt={`Stitched result: ${piece.alt}`}
                    label={copy.hero.after}
                    width={piece.width}
                    height={piece.height}
                  />
                </>
              ) : (
                <>
                  <PlaceholderFrame label={copy.hero.placeholderFrame} caption={copy.hero.before} />
                  <PlaceholderFrame label={copy.hero.placeholderFrame} caption={copy.hero.after} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
