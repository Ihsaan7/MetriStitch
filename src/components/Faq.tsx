import { copy } from '@/content/copy.en';

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section border-t border-line">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h-section mt-3">
            {copy.faq.title}
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <div className="border-t border-ink">
            {copy.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex min-h-14 items-center justify-between gap-6 py-4 font-display text-[1.25rem] leading-snug md:text-[1.5rem]">
                  <span>{item.q}</span>
                  <svg
                    className="faq-sign shrink-0"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden="true"
                  >
                    <path d="M9 1v16M1 9h16" />
                  </svg>
                </summary>
                <p className="measure pb-6 pr-10 text-[1rem] leading-relaxed text-muted md:text-[1.0625rem]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
