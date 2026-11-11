import { copy } from '@/content/copy.en';
import { formatPrice, humanizeTurnaround, pricing } from '@/lib/pricing';
import PricingViewTracker from './PricingViewTracker';

export default function Pricing() {
  const rows = pricing.map((entry) => ({
    id: entry.id,
    label: entry.label,
    price: formatPrice(entry),
    unit: entry.unit,
    turnaround: humanizeTurnaround(entry.turnaround),
    note: entry.note,
    highlight: entry.id === 'free-trial',
  }));

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section border-t border-line">
      <PricingViewTracker targetId="pricing" />
      <div className="wrap">
        <p className="eyebrow">{copy.nav.pricing}</p>
        <h2 id="pricing-title" className="h-section mt-3">
          {copy.pricing.title}
        </h2>
        <p className="mt-5 measure text-muted">{copy.pricing.intro}</p>

        {/* Wide screens: a real table. */}
        <table className="mt-10 hidden w-full border-collapse text-left md:table">
          <caption className="sr-only">{copy.pricing.tableLabel}</caption>
          <thead>
            <tr className="border-b border-ink text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="py-3 pr-4 font-semibold">{copy.pricing.columns.service}</th>
              <th scope="col" className="py-3 pr-4 font-semibold">{copy.pricing.columns.price}</th>
              <th scope="col" className="py-3 pr-4 font-semibold">{copy.pricing.columns.turnaround}</th>
              <th scope="col" className="py-3 font-semibold">{copy.pricing.columns.note}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={`border-b border-line align-top ${row.highlight ? 'bg-white' : ''}`}>
                <th scope="row" className="py-5 pr-4 pl-0 font-medium">
                  {row.label}
                </th>
                <td className="py-5 pr-4">
                  <span className="font-display text-[1.5rem] leading-none">{row.price}</span>
                  <span className="mt-1 block text-[0.875rem] text-muted">{row.unit}</span>
                </td>
                <td className="py-5 pr-4 text-[1rem]">{row.turnaround}</td>
                <td className="py-5 text-[1rem] text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phones: the same data as a list. */}
        <ul className="mt-8 border-t border-ink md:hidden" aria-label={copy.pricing.tableLabel}>
          {rows.map((row) => (
            <li key={row.id} className={`border-b border-line py-5 ${row.highlight ? 'bg-white px-3' : ''}`}>
              <p className="font-medium leading-snug">{row.label}</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[1.5rem] leading-none">{row.price}</span>
                <span className="text-[0.875rem] text-muted">{row.unit}</span>
              </p>
              <p className="mt-2 text-[0.9375rem] text-muted">
                {copy.pricing.turnaroundLabel}: {row.turnaround}. {row.note}.
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="measure font-display text-[1.375rem] leading-snug">{copy.pricing.note}</p>
          <a href="#order" className="btn btn-ghost self-start">
            {copy.pricing.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
