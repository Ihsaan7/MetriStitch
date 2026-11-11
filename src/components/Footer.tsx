import { copy } from '@/content/copy.en';
import Wordmark from './Wordmark';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Wordmark scale={0.8} />
          <p className="text-[0.9375rem] text-muted">{copy.footer.rights.replace('[year]', String(year))}</p>
        </div>
        <nav aria-label={copy.footer.legalNav}>
          <ul className="flex gap-6 text-[0.9375rem] font-medium">
            <li>
              <a href="/privacy/" className="link">
                {copy.footer.privacy}
              </a>
            </li>
            <li>
              <a href="/terms/" className="link">
                {copy.footer.terms}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
