import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { resolveTokens } from './tokens';

/**
 * Markdown pages under /content/<section>/<slug>.md become /<section>/<slug>/ with no other code change.
 * Front matter (all required except `updated`):
 *
 *   ---
 *   title: Logo to embroidery file
 *   description: One or two sentences for search results.
 *   date: 2026-11-11
 *   updated: 2026-11-20      (optional)
 *   ---
 *
 * A page with no title or description fails the build. Files starting with "_" are ignored.
 * Tokens like {{brand}} and {{price:logo-standard}} work in the front matter and the body.
 */
export type Section = 'digitizing' | 'guides';

export interface ContentPage {
  section: Section;
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  html: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseFrontMatter(raw: string, file: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${file}: missing front matter. Start the file with --- title, description and date ---`);
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) throw new Error(`${file}: cannot read front matter line "${line}"`);
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: match[2] };
}

function isValidDate(value: string): boolean {
  return ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function loadPage(section: Section, fileName: string): ContentPage {
  const file = `content/${section}/${fileName}`;
  const slug = fileName.replace(/\.md$/, '');
  if (!SLUG.test(slug)) throw new Error(`${file}: the file name must be lowercase words joined by hyphens`);

  const raw = fs.readFileSync(path.join(CONTENT_ROOT, section, fileName), 'utf8');
  const { data, body } = parseFrontMatter(raw, file);

  if (!data.title?.trim()) throw new Error(`${file}: front matter needs a title`);
  if (!data.description?.trim()) throw new Error(`${file}: front matter needs a description`);
  if (!data.date || !isValidDate(data.date)) throw new Error(`${file}: front matter needs a date like 2026-11-11`);
  if (data.updated && !isValidDate(data.updated)) throw new Error(`${file}: "updated" must look like 2026-11-11`);

  return {
    section,
    slug,
    title: resolveTokens(data.title.trim()),
    description: resolveTokens(data.description.trim()),
    date: data.date,
    updated: data.updated || undefined,
    html: marked.parse(resolveTokens(body), { gfm: true, async: false }) as string,
  };
}

/** All pages in a section, newest first. */
export function getPages(section: Section): ContentPage[] {
  const dir = path.join(CONTENT_ROOT, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .map((name) => loadPage(section, name))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export function getPage(section: Section, slug: string): ContentPage | undefined {
  return getPages(section).find((page) => page.slug === slug);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${value}T00:00:00Z`),
  );
}
