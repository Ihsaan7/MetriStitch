import { resolveDeep } from '../lib/tokens';

/**
 * ALL visible copy lives in this file. To add a language later, copy it to
 * copy.ro.ts, translate the strings, and pick the file by locale in src/content/index.
 *
 * Tokens in double braces ({{brand}}, {{price:logo-standard}}, {{fact:years}} ...) are
 * filled from site.config.ts and pricing.json. See src/lib/tokens.ts.
 * Runtime placeholders in single brackets, like [email], are filled in the browser.
 * Anything still reading PLACEHOLDER must be replaced before the production build passes.
 */
const raw = {
  meta: {
    homeTitle: 'Embroidery digitizing service | {{brand}}',
    homeDescription:
      'Embroidery digitizing for logos and church vestment designs. {{fact:formatsAnd}} files, standard turnaround {{turnaround:logo-standard}}. Free trial design.',
    legalTitlePrivacy: 'Privacy policy',
    legalTitleTerms: 'Terms of service',
    digitizingIndexTitle: 'Digitizing services',
    digitizingIndexDescription:
      'Pages on logo to embroidery file work and church vestment embroidery digitizing, with prices and turnaround.',
    guidesIndexTitle: 'Guides',
    guidesIndexDescription: 'Short guides on preparing artwork and ordering embroidery digitizing.',
    notFoundTitle: 'Page not found',
  },

  skipLink: 'Skip to content',

  nav: {
    label: 'Main',
    work: 'Work',
    pricing: 'Pricing',
    how: 'How it works',
    about: 'About',
    contact: 'Contact',
    cta: 'Free trial design',
    whatsapp: 'WhatsApp',
    menuOpen: 'Menu',
    menuClose: 'Close',
    homeLabel: '{{brand}} home',
  },

  hero: {
    headline: 'Embroidery files that stitch clean the first time.',
    subline:
      'Digitizing for vestments, ceremonial work and logos, by a team with {{fact:years}} years of experience. Standard files in {{turnaround:logo-standard}}.',
    primary: 'Get a free trial design',
    secondary: 'See prices',
    before: 'Original artwork',
    after: 'Stitched result',
    placeholderFrame: 'PLACEHOLDER: before and after pair',
  },

  facts: {
    label: 'Key facts',
    items: [
      { lead: '{{fact:years}}', rest: 'years of digitizing' },
      { lead: '{{fact:formats}}', rest: 'and more' },
      { lead: '{{hours:logo-standard}}-hour', rest: 'standard turnaround' },
      { lead: 'Free', rest: 'trial design' },
    ],
  },

  work: {
    title: 'Selected work',
    intro: 'Each piece shows the original artwork next to the stitched result.',
    filterLabel: 'Filter by type',
    filterAll: 'All',
    filterOrnate: 'Ornate and ecclesiastical',
    filterLogos: 'Logos',
    empty: 'No pieces in this group yet.',
    open: 'View',
    close: 'Close',
    before: 'Original artwork',
    after: 'Stitched result',
    placeholderFrame: 'PLACEHOLDER: photo',
  },

  pricing: {
    title: 'Pricing',
    intro:
      'Fixed prices for standard logos. Ornate and church vestment embroidery digitizing is priced per design.',
    columns: { service: 'Service', price: 'Price', turnaround: 'Turnaround', note: 'Note' },
    tableLabel: 'Prices',
    unitLabel: 'Billed',
    turnaroundLabel: 'Turnaround',
    note: 'Not sure which fits? Send the artwork and we quote {{fact:quoteTime}}.',
    cta: 'Send the artwork',
  },

  how: {
    title: 'How it works',
    steps: [
      {
        title: 'Send the artwork',
        body: 'Use the form below or message us on WhatsApp. Add the size, placement and fabric if you know them.',
      },
      {
        title: 'Get a quote',
        body: 'We review the artwork and quote {{fact:quoteTime}}.',
      },
      {
        title: 'Approve and pay',
        body: 'Approve the quote and pay. Free trial designs skip this step.',
      },
      {
        title: 'Receive files and a preview',
        body: 'You get the files in {{fact:formatsAnd}} (other formats on request) and a preview of the stitched result.',
      },
    ],
    note: 'One revision round is included. You have {{fact:revisionDays}} days to ask.',
  },

  about: {
    title: 'About',
    body: [
      '{{brand}} is an embroidery digitizing studio. Our lead digitizer has worked in digitizing for {{fact:years}} years, supported by senior digitizers. Every file is checked by the lead digitizer before it leaves the studio.',
    ],
    photoPlaceholder: 'PLACEHOLDER: workspace photo',
  },

   faq: {
    title: 'Questions',
    items: [
      {
        q: 'Which file formats do you deliver?',
        a: '{{fact:formatsAnd}}. Other formats on request. Tell us your machine and the format you need in the form.',
      },
      {
        q: 'How fast is it?',
        a: 'Standard files take {{turnaround:logo-standard}}. Rush takes {{turnaround:rush}} for {{price:rush}}. Ornate and ecclesiastical work takes {{turnaround:ornate}}.',
      },
      {
        q: 'What artwork should I send?',
        a: 'Send the best version you have. Vector files and PDFs are ideal, and clear images also work. Add the size, placement and fabric if you know them.',
      },
      {
        q: 'How do revisions work?',
        a: 'One revision round is included. You have {{fact:revisionDays}} days to ask. An extra revision costs {{price:extra-revision}}.',
      },
      {
        q: 'How does payment work?',
        a: 'We send a quote first. You approve it and pay, then we deliver the files and a preview. We accept PayPal. If PayPal does not work for you, we can arrange a bank transfer.',
      },
      {
        q: 'Who owns the file?',
        a: 'You do, for your own use. We never resell a client’s logo.',
      },
      {
        q: 'What does the free trial include?',
        a: 'One simple logo, delivered in {{turnaround:free-trial}}, for businesses that plan to place orders. We decide which requests qualify.',
      },
    ],
  },

  contact: {
    title: 'Get a free trial design',
    intro:
      'Send the artwork and a few details, or message us on WhatsApp. We quote {{fact:quoteTime}}.',
    whatsappCta: 'Message us on WhatsApp',
    whatsappPrefill: 'Hello {{brand}}, I would like a free trial design.',
    emailLead: 'Prefer email?',
    emailLabel: 'Email {{email}}',
  },

  form: {
    title: 'Order or trial request',
    labels: {
      name: 'Name',
      email: 'Email',
      company: 'Company (optional)',
      country: 'Country',
      need: 'What do you need?',
      artwork: 'Artwork (optional)',
      details: 'Size, placement, fabric (optional)',
      formats: 'Formats needed (optional)',
      rush: 'Rush ({{turnaround:rush}}, {{price:rush}})',
      message: 'Message (optional)',
    },
    hints: {
      artwork: 'Up to {{fact:maxUploadMb}} MB in total. Images, PDF and vector files.',
      details: 'For example: 8 cm wide, left chest, polo shirt.',
    },
    needOptions: {
      logo: 'Logo',
      ornate: 'Ornate or vestment design',
      plan: 'Monthly plan',
      other: 'Other',
    },
    formatOther: 'Other',
    choose: 'Choose one',
    chooseCountry: 'Choose your country',
    artworkOff:
      'To send artwork, email it to {{email}} after you submit this form. We match it to your request.',
    submit: 'Send request',
    sending: 'Sending...',
    consentBefore: 'By sending this form you agree to the ',
    consentLink: 'privacy policy',
    consentAfter: '.',
    errors: {
      required: 'This field is required.',
      invalid: 'Check this value.',
      emailInvalid: 'Enter a valid email address.',
      tooLong: 'This is too long.',
      tooBig: 'These files are over the {{fact:maxUploadMb}} MB limit.',
      badType: 'This file type is not supported.',
    },
    summaryError: 'Please fix the highlighted fields.',
    failure: 'The request did not go through. Please try again, or email {{email}}.',
    success: {
      title: 'Request received',
      body: 'A confirmation is on its way to [email]. Next, we review your request and quote {{fact:quoteTime}}.',
      artworkOff: 'To send the artwork, reply to the confirmation email with the files attached, or email {{email}}.',
      spam: 'If you do not see the confirmation, check your spam folder.',
      again: 'Send another request',
    },
  },

  footer: {
    privacy: 'Privacy',
    terms: 'Terms',
    legalNav: 'Legal',
    rights: '© [year] {{brand}}',
  },

  email: {
    notifySubject: 'New request: [need] from [name]',
    autoReplySubject: 'We received your request | {{brand}}',
    autoReplyGreeting: 'Hello [name],',
    autoReplyBody: [
      'Thank you for your request. We have it, and we will review it and quote {{fact:quoteTime}}.',
    ],
    autoReplyArtworkOff: 'To send the artwork, reply to this email with the files attached.',
    autoReplyRush: 'You asked for rush delivery ({{turnaround:rush}}, {{price:rush}}). We will confirm it in the quote.',
    autoReplySignoff: 'The studio at {{brand}}',
  },

  legalBanner: 'Owner to review before launch.',

  privacy: {
    title: 'Privacy policy',
    intro: 'This page explains what {{brand}} collects when you use this site, and why. It is written in plain language.',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: ['{{brand}} is an embroidery digitizing studio. You can reach us at {{email}}.'],
      },
      {
        heading: 'What we collect',
        paragraphs: [
          'When you send the order or trial form we collect your name, email address, country, what you need, and any optional details you add: company, size, placement, fabric, formats, rush choice and message. If you attach artwork, we receive those files.',
          'If you message us on WhatsApp or email us, we receive what you send and your contact details.',
          'We measure visits with a privacy-friendly analytics tool that does not use cookies. It counts page views and a few actions, such as sending the form or opening WhatsApp. It does not build profiles of individual visitors.',
          'The form uses Cloudflare Turnstile to block automated spam. Turnstile may process technical information from your browser to tell people from bots.',
        ],
      },
      {
        heading: 'Why we use it',
        paragraphs: [
          'We use your details to answer your request, prepare a quote, deliver files, and keep records of our work. We use technical and analytics data to keep the site working, block spam and understand which pages help visitors.',
        ],
      },
      {
        heading: 'Who handles your data for us',
        paragraphs: [
          'Cloudflare hosts this site and provides spam protection. Resend delivers the emails that the form sends. Umami provides the analytics. These providers process data on our behalf. If you choose to use WhatsApp, WhatsApp handles that conversation under its own terms.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'We keep requests and the files that come with them for as long as we need them to handle your request and to keep our business records. Ask us to delete them sooner and we will, unless we must keep something by law.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You can ask us for a copy of your data, ask us to correct it, or ask us to delete it. Email us at {{email}}.',
          'We never resell a client’s logo or artwork.',
        ],
      },
      {
        heading: 'Changes to this page',
        paragraphs: ['If we change this policy we will update this page.'],
      },
    ],
  },

  terms: {
    title: 'Terms of service',
    intro: 'These terms apply when you order digitizing from {{brand}} or use this site.',
    sections: [
      {
        heading: 'What we provide',
        paragraphs: [
          '{{brand}} converts artwork you send into embroidery files for machines. We deliver files in {{fact:formatsAnd}}, and other formats on request, with a preview of the stitched result.',
        ],
      },
      {
        heading: 'Quotes and payment',
        paragraphs: [
          'We quote each job after we see the artwork. Prices on this site are starting prices. You approve the quote and pay before we deliver the files. Free trial designs are free.',
        ],
      },
      {
        heading: 'Turnaround',
        paragraphs: [
          'Standard files take {{turnaround:logo-standard}}. Rush delivery takes {{turnaround:rush}} and adds {{price:rush}} to the design price. Ornate and ecclesiastical designs take {{turnaround:ornate}}. A turnaround starts when we have the artwork and the details we need.',
        ],
      },
      {
        heading: 'Free trial design',
        paragraphs: ['A free trial design is available for qualified requests. We decide which requests qualify.'],
      },
      {
        heading: 'Revisions',
        paragraphs: [
          'One revision round is included. Ask for it within {{fact:revisionDays}} days of delivery. An extra revision costs {{price:extra-revision}}.',
        ],
      },
      {
        heading: 'Ownership',
        paragraphs: [
          'You own the files we make for you, for your own use. We never resell a client’s logo. You confirm that you have the right to use the artwork you send us.',
        ],
      },
      {
        heading: 'Stitching results',
        paragraphs: [
          'Results on the machine depend on fabric, thread, stabilizer and machine settings. Tell us the fabric and size when you order so we can digitize for them.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: ['Questions about these terms: {{email}}.'],
      },
    ],
  },

  content: {
    readMore: 'More pages',
    published: 'Published',
    updated: 'Updated',
    ctaTitle: 'Want to see it on your own artwork?',
    ctaBody: 'Request a free trial design.',
    ctaButton: 'Get a free trial design',
    backDigitizing: 'All digitizing pages',
    backGuides: 'All guides',
    emptyList: 'No pages yet.',
  },

  notFound: {
    title: 'Page not found',
    body: 'That page does not exist. It may have moved.',
    link: 'Back to the homepage',
  },

  whatsapp: {
    ariaLabel: 'Open WhatsApp chat',
  },
};

export const copy = resolveDeep(raw);
export type Copy = typeof copy;
