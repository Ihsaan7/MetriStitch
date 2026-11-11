# Build the MetriStitch website (Phase 1)

You are Claude Code. Read this whole file first. Then write a short plan (stack choice, folder layout, order of work) and start building. Ask me a question only if you are blocked; otherwise make the sensible choice, say what you chose, and keep going.

## 1. What this is

MetriStitch is a small embroidery digitizing studio. It turns customer artwork (logos, ornate and church vestment designs) into stitch-ready files for embroidery machines (DST, PES, JEF, EXP and others). The site must get a visitor to request a **free trial design** or message us on WhatsApp.

- Brand name: **MetriStitch** (exact spelling, capital M and S). Keep it in ONE config value; never hard-code it in text.
- Two lanes: **premium** (ornate, ecclesiastical, heraldic work, from about EUR 60 a design) and **volume** (standard logos at fixed prices, plus a monthly plan).
- Visitors: embroidery shop owners, decorators, uniform makers, church vestment workshops. Mostly on phones, little time. They decide by seeing real stitched work, seeing prices and trusting that skilled people stand behind it.
- Success = form submissions and WhatsApp clicks.
- The brand is **faceless**: no photos of people, no personal names on the site. Speak as "the studio".

## 2. Hard rules

1. **No invented facts.** No fake clients, client logos, testimonials, reviews, counters, awards, team sizes or stock photos. You may use only the facts listed in section 8. Anything else is a placeholder.
2. Mark every missing piece of copy with the literal text `PLACEHOLDER`. The production build must **fail** if `PLACEHOLDER` remains in any shipped page or data file (add a small check script and wire it into `build` for production only).
   **Images are the exception:** the stitched-work photos may arrive after the first deploy. Until then, hide any section whose content is missing instead of showing an empty frame: the Work section renders only when at least one piece has `approved: true` (and its nav link disappears with it), and the hero uses a text-only layout when no before/after pair exists. Preview builds may show clearly marked placeholder frames; production builds must not.
3. Hosting is **Cloudflare Pages, free plan**. Do not use Vercel (its free plan is non-commercial only).
4. Phase 1 has **no payments and no store**. Do not build checkout. Leave a clean place to add it later.
5. No secrets in the repo. Use Cloudflare environment variables.

## 3. Tech and deployment

- Preferred: **Next.js (App Router) + TypeScript + Tailwind CSS**, with static export (`output: 'export'`). If static export blocks something you need, use **Astro** instead and tell me why.
- Output is static HTML, CSS and a little JavaScript. No server runtime for the pages. Next's image optimizer needs a server, so use pre-optimized assets or build-time optimization.
- The order form needs a small backend. Use a Cloudflare Pages Function in `/functions`, or a free form service. Check the current free-tier limits in the provider's docs, pick one, and tell me what you chose and its limits.
- Git workflow: `main` is production; every other branch or PR gets a Cloudflare preview. Write the README so I can run locally, deploy, roll back and add a page.
- Pin the Node version. Add `lint`, `typecheck` and `build` scripts. Use clear commit messages.
- The custom domain is connected later in Cloudflare Pages. Read the domain from config (`metristitch.com`, to be confirmed).

## 4. Design direction

Calm, precise, current. A small studio that knows its craft. Not a template site, not a hard-sell page.

- **Mood:** measured and warm. Generous white space, a strict 12-column grid (content up to 1120 px), one accent color, and real stitched-work photography doing most of the talking.
- **Colors (keep WCAG AA contrast; refine if needed):** Ink `#15171A` for text; Paper `#F7F4EE` page background; Thread gold `#B08A3E` as the single accent; Line `#D9D3C7` for dividers; White `#FFFFFF` for form fields and cards.
- **Type:** a refined serif for headlines (for example Newsreader or Fraunces) and Inter for body, both self-hosted. Large confident headlines; body 17 to 18 px; lines under 70 characters.
- **Signature detail:** a thin dashed "stitch line" as section dividers and under the wordmark. Use sparingly. Build the wordmark as an SVG: "MetriStitch" in the display font.
- **Photography:** close, natural-light shots of stitched pieces, and side-by-side pairs of the original artwork and the stitched result.
- **Voice:** plain, calm, specific. Short sentences. Numbers instead of adjectives. No hype.
- **Avoid:** stock photos, hero sliders, rows of identical icon cards, heavy shadows, gradients, glass effects, pop-ups, auto-playing video, chat widgets, countdown timers, claims like "100% satisfaction" or "world-class".
- Mobile first. It must look excellent at 375 px wide.

## 5. Homepage (one scrolling page, nine sections, in this order)

All copy below is a starting draft; keep it true.

1. **Header.** Wordmark on the left. Anchor links: Work, Pricing, How it works, About, Contact. Button on the right: "Free trial design". Simple mobile menu. Sticky.
2. **Hero.**
   - Headline: "Embroidery files that stitch clean the first time."
   - Subline: "Digitizing for vestments, ceremonial work and logos, by a team with 10+ years of experience. Standard files in 48 hours."
   - Primary button: "Get a free trial design" (scrolls to the form). Secondary link: "See prices".
   - Visual: a before/after pair (original artwork next to the stitched result). In preview builds use a clearly marked placeholder frame; in production, if no pair exists yet, use a text-only hero.
3. **Facts strip.** Four short facts: "10+ years of digitizing", "DST, PES, JEF, EXP and more", "48-hour standard turnaround", "Free trial design".
4. **Work.** Grid of 8 to 10 pieces with a filter (All, Ornate and ecclesiastical, Logos). Clicking opens a viewer with the before/after pair and a one-line caption. Data from `portfolio.json`; show a piece only if `approved` is true. If no piece is approved, do not render this section or its nav link.
5. **Pricing.** Read from `pricing.json` (section 7). Under the table: "Not sure which fits? Send the artwork and we quote the same day."
6. **How it works.** Four steps: Send the artwork. Get a quote. Approve and pay. Receive files and a preview. Below: "One revision round is included. You have 3 days to ask."
7. **About.** Faceless and honest: "MetriStitch is an embroidery digitizing studio. Our lead digitizer has worked in digitizing for 10+ years, supported by senior digitizers. Every file is checked by the lead digitizer before it leaves the studio." No names, no photos, no team-size claim. Optionally show a PLACEHOLDER workspace photo.
8. **FAQ.** Seven items: Which file formats do you deliver? How fast is it? What artwork should I send? How do revisions work? How does payment work? Who owns the file? (The client, for their own use. We never resell a client's logo.) What does the free trial include?
9. **Contact and order.** The order form, a WhatsApp button, the business email. Footer: Privacy and Terms links, brand name, year.

## 6. Features

**Order and trial form**

| Field | Type | Required |
| --- | --- | --- |
| Name | Text | Yes |
| Email | Email | Yes |
| Company | Text | No |
| Country | Select | Yes |
| What do you need? | Select: Logo; Ornate or vestment design; Monthly plan; Other | Yes |
| Artwork | File, up to 10 MB total (images, PDF, vector formats) | No |
| Size, placement, fabric | Text | No |
| Formats needed | Multi-select: DST, PES, JEF, EXP, other | No |
| Rush (24 h) | Checkbox | No |
| Message | Text | No |

Inline validation. Spam protection: a honeypot field, plus Cloudflare Turnstile if it stays free. A clear success message that says what happens next and when. A notification email to the business address and an automatic reply to the sender. If file upload cannot be done on the free tier, drop it and tell the sender, in the success message and the auto-reply, to email the artwork.

**WhatsApp and email.** A WhatsApp button in the menu and the contact section that opens `wa.me/<number>` with a short pre-filled message. Number from config. A plain email link as a fallback. No floating chat widget.

**SEO.** Unique title and meta description, canonical URL, Open Graph image and social card, JSON-LD for the organization and the services with prices, `sitemap.xml` and `robots.txt` generated at build. Target phrases: "embroidery digitizing service", "logo to embroidery file", "church vestment embroidery digitizing".

**Analytics.** Cookieless and privacy-friendly (Cloudflare Web Analytics or similar). Events: form submitted, WhatsApp click, hero button click, pricing viewed.

**Performance.** Lighthouse mobile: 90+ performance; 95+ accessibility, best practices and SEO. Largest content paint under 2.5 s on a mid-range phone on 4G. Images in AVIF or WebP with width and height set, lazy-loaded below the fold. Self-hosted fonts with `font-display: swap`. Keep JavaScript small.

**Accessibility.** WCAG 2.2 AA: contrast, full keyboard use, visible focus, meaningful alt text on every portfolio image, labelled form fields, respect `prefers-reduced-motion`.

**Legal pages.** `/privacy` and `/terms`, plain-language templates, each marked "Owner to review before launch" (this marker must not trip the PLACEHOLDER check; use different wording for it in production, or keep these pages out of the check by design and tell me).

**Security.** A `_headers` file with sensible security headers, HTTPS only, spam protection on the form.

**Language.** English only. Keep all visible copy in one place so a Romanian version can be added later.

## 7. Config and data files

Business facts live in these files, not in components.

`site.config` fields: `brandName` ("MetriStitch"), `domain`, `email`, `whatsappNumber`, `social` links. No lead name or photo fields (the brand is faceless).

`pricing.json`, one entry per row:

```json
{
  "id": "logo-simple",
  "label": "Simple logo or text",
  "price": 12,
  "currency": "USD",
  "unit": "per design",
  "turnaround": "48 h",
  "note": "One revision round included",
  "from": false
}
```

Load these starting prices (they will be tested, so keep them in `pricing.json` only):

| Entry | Price | Turnaround |
| --- | --- | --- |
| Simple logo or text | $12 | 48 h |
| Standard logo | $18 | 48 h |
| Ornate and ecclesiastical design | from EUR 60 | 3 to 5 days |
| Matched set (3 to 5 pieces) | Sum of pieces, 10 to 15% off | By scope |
| Rush | +25% | 24 h |
| Monthly plan | $300 for 30 logos | 48 h |
| Extra revision | 30% of the design price | n/a |
| Free trial design | Free | 48 h |

`portfolio.json`, one entry per piece:

```json
{
  "id": "vestment-01",
  "category": "ornate",
  "title": "PLACEHOLDER",
  "before": "/work/vestment-01-before.webp",
  "after": "/work/vestment-01-after.webp",
  "alt": "PLACEHOLDER",
  "caption": "PLACEHOLDER",
  "approved": false
}
```

**Room for more pages.** SEO pages start around week 7, about two a week. Build the structure now: routes `/digitizing/[slug]` and `/guides/[slug]` generated from Markdown or MDX with front matter (title, description, date); one shared layout, header and footer, so adding a page never means editing the homepage; the sitemap updates itself; the build fails if a page has no title or description.

## 8. Facts you may state (everything else is a placeholder)

- 10+ years of digitizing experience.
- File formats delivered: DST, PES, JEF, EXP and others on request.
- Standard turnaround 48 hours; rush 24 hours at +25%; ornate work 3 to 5 days.
- A free trial design for qualified requests.
- One revision round included, with a 3-day window.
- The lead digitizer checks every file before delivery.
- Clients own the files made for them; the studio never resells a client's logo.

## 9. Out of scope for Phase 1

Payments, a download store, user accounts, a blog beyond the template routes, and any language other than English.

## 10. Definition of done

- [ ] All nine sections exist, in order, using the config and data files.
- [ ] Changing `brandName` in `site.config` changes it everywhere.
- [ ] No `PLACEHOLDER` remains in a production build, and the build enforces that.
- [ ] The order form validates, blocks spam, sends the notification email and the auto-reply.
- [ ] The WhatsApp link opens a chat with a pre-filled message.
- [ ] Lighthouse mobile scores meet section 6.
- [ ] Keyboard-only use works and contrast passes WCAG AA.
- [ ] Title, description, Open Graph, JSON-LD, sitemap and robots are in place.
- [ ] Analytics events fire for form submit, WhatsApp click and hero button.
- [ ] Privacy and Terms pages exist.
- [ ] A new Markdown file under `/digitizing/` becomes a live page without touching other code.
- [ ] README explains local run, deploy, rollback and how to add a page.

## 11. How to work

1. Show your plan first (stack, folders, order of work).
2. Build in small steps; commit after each. Deploy to a Cloudflare preview early.
3. Use clearly marked placeholders for anything I have not supplied: the business email, the WhatsApp number, all portfolio photos and the domain.
4. When you finish a step, tell me what is done and what I need to supply next. Keep updates short.
