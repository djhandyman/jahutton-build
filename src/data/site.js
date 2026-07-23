// Site-wide content & links for jahutton.build (portfolio / calling card).

export const site = {
  name: 'Jonathan A. Hutton',
  domain: 'jahutton.build',
  // Quiet footer line — the through-line, understated (the ".build" pun lives in the domain).
  tagline: 'Finished things, from a blank sheet.',
  // Hero headline — the sharpest, most distinctive line, promoted from body to top.
  // See ~/.claude/plans/misty-dreaming-hinton.md (positioning updated 2026-07-23:
  // pivoted from enterprise/"regulated, high-stakes" to an audience-named engagement front door).
  headline: 'I design, build, and ship.',
  // Hero lead — names the audience the headline leaves implicit ("for whom").
  positioning:
    'For solo operators, small businesses, and nonprofits — software, strategy, and structure, turned from ambiguity into something finished you can actually use.',
  bookUrl: 'https://unflappable.press',
  // Contact form posts here — a Cloudflare Pages Function (functions/api/contact.js) that
  // emails submissions via Resend. No third-party form service, no per-seat fee.
  contactEndpoint: '/api/contact',
};

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Now', href: '/now' },
  { label: 'Contact', href: '/contact' },
];

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jahutton/' },
  { label: 'Substack', href: 'https://substack.com/@jahutton' },
  { label: 'Instagram', href: 'https://www.instagram.com/ja.hutton/' },
];

export const substack = {
  handle: '@jahutton',
  url: 'https://substack.com/@jahutton',
  embedUrl: 'https://www.unflappable.blog/embed',
  blurb: 'Writing on building, resilience, and the things I’m learning along the way.',
};
