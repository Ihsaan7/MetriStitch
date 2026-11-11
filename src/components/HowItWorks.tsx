import { copy } from '@/content/copy.en';

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section border-t border-line">
      <div className="wrap">
        <p className="eyebrow">{copy.nav.how}</p>
        <h2 id="how-title" className="h-section mt-3">
          {copy.how.title}
        </h2>

        <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {copy.how.steps.map((step, index) => (
            <li key={step.title} className="border-t-[1.5px] border-dashed border-gold pt-5">
              <p className="font-display text-[2.5rem] leading-none text-gold-ink" aria-hidden="true">
                {index + 1}
              </p>
              <h3 className="mt-4 text-[1.5rem]">
                <span className="sr-only">{`Step ${index + 1}: `}</span>
                {step.title}
              </h3>
              <p className="mt-3 text-[1rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 font-display text-[1.5rem] leading-snug">{copy.how.note}</p>
      </div>
    </section>
  );
}
