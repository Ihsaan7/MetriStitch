import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Each test file runs in its own process, so the environment can be set before the modules load.
process.env.METRISTITCH_ENV = 'preview';

let html = '';
let header = '';

before(async () => {
  const { default: HomePage } = await import('../src/app/page');
  const { default: Header } = await import('../src/components/Header');
  html = renderToStaticMarkup(createElement(HomePage));
  header = renderToStaticMarkup(createElement(Header));
});

describe('homepage in a preview build', () => {
  it('renders the sections in the agreed order', () => {
    const ids = ['hero-title', 'work', 'pricing', 'how-it-works', 'about', 'faq', 'contact'].map((id) => html.indexOf(`id="${id}`));
    assert.ok(ids.every((position) => position > -1), `all sections present: ${ids}`);
    assert.deepEqual([...ids].sort((a, b) => a - b), ids, 'sections are in order');
    assert.ok(html.indexOf('Key facts') > html.indexOf('hero-title') && html.indexOf('Key facts') < html.indexOf('id="work"'));
  });

  it('shows clearly marked placeholder frames', () => {
    assert.match(html, /ph-frame/);
    assert.match(html, /PLACEHOLDER/);
  });

  it('links the Work anchor in the nav', () => {
    assert.match(header, /href="\/#work"/);
  });

  it('builds the form with required fields and a honeypot', () => {
    for (const name of ['name', 'email', 'company', 'country', 'need', 'details', 'rush', 'message', 'company_website']) {
      assert.match(html, new RegExp(`name="${name}"`), name);
    }
    assert.match(html, /name="formats" value="DST"/);
    assert.doesNotMatch(html, /type="file"/, 'artwork upload is off by default');
  });

  it('prices come from pricing.json', () => {
    assert.match(html, /\$12/);
    assert.match(html, /\$18/);
    assert.match(html, /from €60/);
    assert.match(html, /\+25%/);
    assert.match(html, /\$300/);
  });

  it('has a WhatsApp link with a pre-filled message', () => {
    assert.match(html, /https:\/\/wa\.me\/[^"?]*\?text=Hello%20/);
  });

  it('has the agreed headline and the stitch-line divider', () => {
    assert.match(html, /Embroidery files that stitch clean the first time\./);
    assert.match(html, /class="stitch/);
  });
});
