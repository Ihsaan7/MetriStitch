import { copy } from '../content/copy.en';
import { isPlaceholder, siteConfig } from '../config/site.config';

/** wa.me link with a short pre-filled message. The number comes from site.config. */
export function whatsappUrl(): string {
  const raw = siteConfig.whatsappNumber;
  const number = isPlaceholder(raw) ? raw : raw.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(copy.contact.whatsappPrefill)}`;
}
