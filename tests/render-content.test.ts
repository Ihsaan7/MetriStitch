import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ContentArticle from '../src/components/ContentArticle';
import ContentIndex from '../src/components/ContentIndex';
import Footer from '../src/components/Footer';
import LegalPage from '../src/components/LegalPage';
import { copy } from '../src/content/copy.en';
import { siteConfig } from '../src/config/site.config';
import { getPages } from '../src/lib/content';

describe('markdown pages render', () => {
  const page = getPages('digitizing')[0];

  it('renders the article with title, body, call to action and JSON-LD', () => {
    const html = renderToStaticMarkup(createElement(ContentArticle, { page }));
    assert.match(html, new RegExp(`<h1[^>]*>${page.title}</h1>`));
    assert.match(html, /prose-ms/);
    assert.match(html, /href="\/#order"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /<table>/, 'tables from Markdown render');
  });

  it('uses the brand name from site.config', () => {
    const html = renderToStaticMarkup(createElement(ContentArticle, { page }));
    assert.ok(html.includes(siteConfig.brandName));
  });

  it('renders the index with a link to each page', () => {
    const pages = getPages('digitizing');
    const html = renderToStaticMarkup(createElement(ContentIndex, { title: 'T', intro: 'I', pages }));
    for (const item of pages) assert.ok(html.includes(`href="/digitizing/${item.slug}/"`));
  });
});

describe('legal pages and footer', () => {
  it('shows the review banner until legalReviewed is true, without tripping the placeholder marker', () => {
    const html = renderToStaticMarkup(
      createElement(LegalPage, { title: copy.privacy.title, intro: copy.privacy.intro, sections: copy.privacy.sections }),
    );
    assert.match(html, /Owner to review before launch/);
    assert.doesNotMatch(copy.legalBanner, /PLACEHOLDER/);
  });

  it('links Privacy and Terms from the footer with brand and year', () => {
    const html = renderToStaticMarkup(createElement(Footer));
    assert.match(html, /href="\/privacy\/"/);
    assert.match(html, /href="\/terms\/"/);
    assert.ok(html.includes(String(new Date().getFullYear())));
    assert.ok(html.includes(siteConfig.brandName));
  });
});
