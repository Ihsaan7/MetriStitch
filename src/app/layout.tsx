import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import '@fontsource-variable/newsreader';
import './globals.css';
import { siteConfig, siteUrl } from '@/config/site.config';
import { copy } from '@/content/copy.en';
import { umamiWebsiteId } from '@/lib/env';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: copy.meta.homeTitle, template: `%s | ${siteConfig.brandName}` },
  description: copy.meta.homeDescription,
  applicationName: siteConfig.brandName,
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#F7F4EE',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale}>
      <body>
        <a href="#main" className="skip-link">
          {copy.skipLink}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {umamiWebsiteId ? (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            data-do-not-track="true"
          />
        ) : null}
      </body>
    </html>
  );
}
