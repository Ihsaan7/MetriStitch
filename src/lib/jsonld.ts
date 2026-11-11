import { siteConfig, siteUrl } from '../config/site.config';
import { copy } from '../content/copy.en';
import { isPlaceholder } from './placeholder';
import { formatPrice, pricing } from './pricing';

const ORG_ID = `${siteUrl}/#organization`;

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, '');
  const hasEmail = !isPlaceholder(siteConfig.email);
  const hasPhone = !isPlaceholder(siteConfig.whatsappNumber) && digits.length > 5;
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.brandName,
    url: siteUrl,
    description: copy.meta.homeDescription,
    ...(hasEmail ? { email: siteConfig.email } : {}),
    ...(siteConfig.social.length ? { sameAs: siteConfig.social.map((link) => link.url) } : {}),
    ...(hasEmail || hasPhone
      ? {
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: 'English',
              ...(hasEmail ? { email: siteConfig.email } : {}),
              ...(hasPhone ? { telephone: `+${digits}` } : {}),
            },
          ],
        }
      : {}),
  };
}

/** One Service per pricing row. Rows with a currency carry an Offer; percentage rows carry the price in the text. */
export function servicesLd(): Json[] {
  return pricing.map((entry) => {
    const base: Json = {
      '@type': 'Service',
      '@id': `${siteUrl}/#service-${entry.id}`,
      name: entry.label,
      serviceType: 'Embroidery digitizing',
      description: `${entry.label}: ${formatPrice(entry)}, ${entry.unit}. ${entry.note}.`,
      provider: { '@id': ORG_ID },
    };
    if (entry.price !== null && entry.currency) {
      base.offers = entry.from
        ? {
            '@type': 'Offer',
            priceCurrency: entry.currency,
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: entry.price,
              priceCurrency: entry.currency,
            },
          }
        : { '@type': 'Offer', price: entry.price, priceCurrency: entry.currency };
    }
    return base;
  });
}

export function faqLd(): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function homeLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationLd(),
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.brandName,
        publisher: { '@id': ORG_ID },
        inLanguage: siteConfig.locale,
      },
      ...servicesLd(),
      faqLd(),
    ],
  };
}

export function contentPageLd(input: {
  kind: 'Service' | 'Article';
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}): Json {
  const common = { name: input.title, description: input.description, url: input.url };
  return {
    '@context': 'https://schema.org',
    ...(input.kind === 'Article'
      ? {
          '@type': 'Article',
          headline: input.title,
          description: input.description,
          mainEntityOfPage: input.url,
          datePublished: input.datePublished,
          dateModified: input.dateModified ?? input.datePublished,
          author: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
        }
      : {
          '@type': 'Service',
          ...common,
          serviceType: 'Embroidery digitizing',
          provider: organizationLd(),
        }),
  };
}
