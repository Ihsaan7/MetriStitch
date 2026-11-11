'use client';

import type { ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  event: AnalyticsEvent;
  className?: string;
  children: ReactNode;
  external?: boolean;
  ariaLabel?: string;
}

/** A normal link that also records one analytics event when clicked. */
export default function TrackedLink({
  href,
  event,
  className,
  children,
  external = false,
  ariaLabel,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => track(event)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
