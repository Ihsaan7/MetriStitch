'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

interface MobileMenuProps {
  items: { href: string; label: string }[];
  whatsappHref: string;
  whatsappLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

export default function MobileMenu({
  items,
  whatsappHref,
  whatsappLabel,
  openLabel,
  closeLabel,
  navLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="flex h-11 w-11 items-center justify-center border border-ink"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
          {open ? (
            <>
              <path d="M3 1l14 12M17 1L3 13" />
            </>
          ) : (
            <>
              <path d="M0 1h20M0 7h20M0 13h20" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={navLabel}
          className="absolute inset-x-0 top-full border-b border-line bg-paper"
        >
          <ul className="wrap py-4">
            {items.map((item) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <a
                  href={item.href}
                  className="block py-4 font-display text-[1.625rem]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-5 pb-2">
              <a
                href={whatsappHref}
                className="btn btn-ghost w-full"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track('whatsapp_click');
                  setOpen(false);
                }}
              >
                {whatsappLabel}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
