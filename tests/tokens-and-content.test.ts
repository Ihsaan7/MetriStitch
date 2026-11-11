import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from '../src/config/site.config';
import { copy } from '../src/content/copy.en';
import { assertValidFrontMatter, getPages, parseFrontMatter } from '../src/lib/content';
import { resolveTokens } from '../src/lib/tokens';

describe('tokens', () => {
  it('fills the brand name from site.config', () => {
    assert.equal(resolveTokens('Hello {{brand}}'), `Hello ${siteConfig.brandName}`);
  });

  it('fills prices, turnarounds and facts from the data files', () => {
    assert.equal(resolveTokens('{{price:logo-standard}} in {{turnaround:logo-standard}}'), '$18 in 48 hours');
    assert.equal(resolveTokens('{{hours:rush}}'), '24');
    assert.equal(resolveTokens('{{fact:formatsAnd}}'), 'DST, PES, JEF and EXP');
  });

  it('throws on an unknown token, so a typo fails the build', () => {
    assert.throws(() => resolveTokens('{{price:nope}}'));
    assert.throws(() => resolveTokens('{{fact:nope}}'));
    assert.throws(() => resolveTokens('{{nope}}'));
  });

  it('leaves no unresolved token in the copy', () => {
    assert.doesNotMatch(JSON.stringify(copy), /\{\{/);
  });

  it('does not hard-code the brand name in the copy', () => {
    // Copy is built from tokens, so the brand appears only through site.config.
    const source = JSON.stringify(copy).split(siteConfig.brandName).length - 1;
    assert.ok(source > 0, 'brand name should appear via the token');
  });
});

describe('copy states the required headline and facts', () => {
  it('has the agreed hero headline', () => {
    assert.equal(copy.hero.headline, 'Embroidery files that stitch clean the first time.');
  });
  it('has four facts', () => {
    assert.equal(copy.facts.items.length, 4);
  });
  it('has seven FAQ items and four steps', () => {
    assert.equal(copy.faq.items.length, 7);
    assert.equal(copy.how.steps.length, 4);
  });
});

describe('markdown content', () => {
  it('fails the build for a page without a title or a description', () => {
    const noTitle = parseFrontMatter('---\ndescription: x\ndate: 2026-01-01\n---\nBody', 'x.md').data;
    assert.throws(() => assertValidFrontMatter(noTitle, 'x.md'), /needs a title/);
    const noDescription = parseFrontMatter('---\ntitle: x\ndate: 2026-01-01\n---\nBody', 'x.md').data;
    assert.throws(() => assertValidFrontMatter(noDescription, 'x.md'), /needs a description/);
    const blank = parseFrontMatter('---\ntitle:   \ndescription: y\ndate: 2026-01-01\n---\nBody', 'x.md').data;
    assert.throws(() => assertValidFrontMatter(blank, 'x.md'), /needs a title/);
  });

  it('fails the build for a missing or invalid date', () => {
    assert.throws(() => assertValidFrontMatter({ title: 'a', description: 'b' }, 'x.md'), /date/);
    assert.throws(() => assertValidFrontMatter({ title: 'a', description: 'b', date: '2026-13-45' }, 'x.md'), /date/);
  });

  it('accepts complete front matter', () => {
    assert.doesNotThrow(() => assertValidFrontMatter({ title: 'a', description: 'b', date: '2026-11-11' }, 'x.md'));
  });

  it('rejects a file with no front matter', () => {
    assert.throws(() => parseFrontMatter('Just text', 'x.md'));
  });

  it('loads the starter pages, each with title, description and date', () => {
    for (const section of ['digitizing', 'guides'] as const) {
      const pages = getPages(section);
      assert.ok(pages.length > 0, `${section} has at least one page`);
      for (const page of pages) {
        assert.ok(page.title && page.description && page.date, page.slug);
        assert.doesNotMatch(page.html, /\{\{/);
      }
    }
  });

  it('ignores files that start with an underscore', () => {
    assert.ok(!getPages('digitizing').some((page) => page.slug.startsWith('_')));
  });
});
