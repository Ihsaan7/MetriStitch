import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

process.env.METRISTITCH_ENV = 'production';

let html = '';
let header = '';

before(async () => {
  const { default: HomePage } = await import('../src/app/page');
  const { default: Header } = await import('../src/components/Header');
  html = renderToStaticMarkup(createElement(HomePage));
  header = renderToStaticMarkup(createElement(Header));
});

describe('homepage in a production build with no approved photos', () => {
  it('hides the Work section and its nav link', () => {
    assert.doesNotMatch(html, /id="work"/);
    assert.doesNotMatch(header, /#work/);
  });

  it('uses the text-only hero: no frames anywhere', () => {
    assert.doesNotMatch(html, /ph-frame/);
    assert.doesNotMatch(html, /<img/);
  });

  it('keeps the other sections and nav links', () => {
    for (const id of ['pricing', 'how-it-works', 'about', 'faq', 'contact']) assert.match(html, new RegExp(`id="${id}"`), id);
    for (const href of ['#pricing', '#how-it-works', '#about', '#contact']) assert.match(header, new RegExp(`href="/${href}"`));
  });

  it('only leaves the placeholders the owner still has to fill in', () => {
    // Remaining markers: business email, WhatsApp number, payment methods, trial qualification.
    // Photo and frame markers must not appear.
    const markers = [...html.matchAll(/[^<>"]{0,40}PLACEHOLDER[^<>"]{0,40}/g)].map((m) => m[0]);
    for (const marker of markers) {
      assert.doesNotMatch(marker, /photo|frame|pair|workspace/i, `unexpected marker: ${marker}`);
    }
  });
});
