import { copy } from '@/content/copy.en';

export default function FactsStrip() {
  return (
    <section aria-label={copy.facts.label}>
      <div className="wrap">
        <hr className="stitch" />
        <ul className="grid grid-cols-2 md:grid-cols-4">
          {copy.facts.items.map((fact, index) => {
            // 2 columns on phones, 4 on wide screens. Hairlines between cells.
            const odd = index % 2 === 1;
            const className = [
              'py-6 pr-5 md:py-9',
              odd ? 'border-l border-line pl-5' : '',
              index >= 2 ? 'border-t border-line md:border-t-0' : '',
              index > 0 ? 'md:border-l md:border-line md:pl-6' : '',
            ].join(' ');
            return (
              <li key={fact.lead} className={className}>
                <p className="font-display text-[1.5rem] leading-tight md:text-[1.875rem]">{fact.lead}</p>
                <p className="mt-1 text-[0.9375rem] text-muted">{fact.rest}</p>
              </li>
            );
          })}
        </ul>
        <hr className="stitch" />
      </div>
    </section>
  );
}
