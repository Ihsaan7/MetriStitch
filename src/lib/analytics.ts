/**
 * Cookieless analytics through Umami Cloud (free Hobby plan). Cloudflare Web Analytics
 * cannot record custom events, which is why it is not used here.
 * Set NEXT_PUBLIC_UMAMI_WEBSITE_ID to switch it on. Without it, track() does nothing.
 */
export type AnalyticsEvent =
  | 'form_submitted'
  | 'whatsapp_click'
  | 'hero_button_click'
  | 'pricing_viewed';

interface UmamiApi {
  track: (name: string, data?: Record<string, string | number>) => void;
}

declare global {
  interface Window {
    umami?: UmamiApi;
  }
}

export function track(event: AnalyticsEvent, data?: Record<string, string | number>): void {
  try {
    if (typeof window !== 'undefined' && window.umami) window.umami.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}
