import { siteConfig } from '@/config/site.config';
import { copy } from '@/content/copy.en';
import { getCountryOptions } from '@/lib/countries';
import { turnstileSiteKey } from '@/lib/env';
import { FORMAT_OPTIONS, NEED_OPTIONS } from '@/lib/orderSchema';
import { whatsappUrl } from '@/lib/whatsapp';
import OrderForm from './OrderForm';
import TrackedLink from './TrackedLink';

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section border-t border-line">
      <div className="wrap grid grid-cols-12 gap-x-8 gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow">{copy.nav.contact}</p>
          <h2 id="contact-title" className="h-section mt-3">
            {copy.contact.title}
          </h2>
          <p className="mt-5 measure text-muted">{copy.contact.intro}</p>

          <div className="mt-8 flex flex-col items-start gap-5">
            <TrackedLink href={whatsappUrl()} event="whatsapp_click" external className="btn btn-ghost">
              {copy.contact.whatsappCta}
            </TrackedLink>
            <p className="text-[1rem]">
              {copy.contact.emailLead}{' '}
              <a href={`mailto:${siteConfig.email}`} className="link">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>

        <div id="order" className="col-span-12 scroll-mt-24 border border-line bg-white p-5 sm:p-8 lg:col-span-7">
          <OrderForm
            copy={copy.form}
            countries={getCountryOptions(siteConfig.locale)}
            needs={NEED_OPTIONS}
            formats={FORMAT_OPTIONS}
            turnstileSiteKey={turnstileSiteKey}
            uploadEnabled={siteConfig.features.artworkUpload}
            maxUploadMb={siteConfig.facts.maxUploadMb}
          />
        </div>
      </div>
    </section>
  );
}
