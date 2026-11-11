'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Fires the pricing_viewed event once, when the pricing section is mostly on screen. */
export default function PricingViewTracker({ targetId }: { targetId: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          track('pricing_viewed');
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return null;
}
