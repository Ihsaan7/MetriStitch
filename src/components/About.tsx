import { siteConfig } from '@/config/site.config';
import { copy } from '@/content/copy.en';
import { isProduction } from '@/lib/env';

export default function About() {
  const photo = siteConfig.aboutPhoto;
  // The workspace photo is optional. No photo in production: the text stands alone.
  const showPhoto = photo !== null || !isProduction;

  return (
    <section id="about" aria-labelledby="about-title" className="section border-t border-line">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-10">
        <div className={showPhoto ? 'col-span-12 lg:col-span-7' : 'col-span-12 lg:col-span-9'}>
          <p className="eyebrow">{copy.nav.about}</p>
          <h2 id="about-title" className="h-section mt-3">
            {copy.about.title}
          </h2>
          <div className="mt-6 space-y-5">
            {copy.about.body.map((paragraph) => (
              <p key={paragraph} className="measure text-[1.1875rem] leading-relaxed md:text-[1.25rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {showPhoto && (
          <div className="col-span-12 lg:col-span-5">
            {photo ? (
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full border border-line object-cover"
              />
            ) : (
              <div className="ph-frame aspect-[4/3] w-full">{copy.about.photoPlaceholder}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
