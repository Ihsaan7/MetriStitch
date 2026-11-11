import { copy } from '@/content/copy.en';
import { hasWork } from '@/lib/portfolio';
import { whatsappUrl } from '@/lib/whatsapp';
import MobileMenu from './MobileMenu';
import TrackedLink from './TrackedLink';
import Wordmark from './Wordmark';

export default function Header() {
  const items = [
    ...(hasWork() ? [{ href: '/#work', label: copy.nav.work }] : []),
    { href: '/#pricing', label: copy.nav.pricing },
    { href: '/#how-it-works', label: copy.nav.how },
    { href: '/#about', label: copy.nav.about },
    { href: '/#contact', label: copy.nav.contact },
  ];
  const whatsappHref = whatsappUrl();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="wrap relative flex h-16 items-center justify-between gap-3">
        <a href="/" aria-label={copy.nav.homeLabel} className="shrink-0">
          <Wordmark scale={0.9} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] font-medium">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="py-2 hover:underline hover:decoration-gold hover:decoration-2 hover:underline-offset-8">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            external
            className="btn btn-ghost btn-sm hidden lg:inline-flex"
          >
            {copy.nav.whatsapp}
          </TrackedLink>
          <a href="/#order" className="btn btn-primary btn-sm">
            {copy.nav.cta}
          </a>
          <MobileMenu
            items={items}
            whatsappHref={whatsappHref}
            whatsappLabel={copy.nav.whatsapp}
            openLabel={copy.nav.menuOpen}
            closeLabel={copy.nav.menuClose}
            navLabel={copy.nav.label}
          />
        </div>
      </div>
    </header>
  );
}
