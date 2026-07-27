// Site-wide content & links for jahutton.build (portfolio / calling card).

export const site = {
  name: 'Jonathan A. Hutton',
  domain: 'jahutton.build',
  // Quiet footer line — the through-line, understated (the ".build" pun lives in the domain).
  tagline: 'Software, systems, wires, and walls.',
  // Hero headline — the sharpest, most distinctive line, promoted from body to top.
  // See ~/.claude/plans/misty-dreaming-hinton.md (positioning updated 2026-07-23:
  // pivoted from enterprise/"regulated, high-stakes" to an audience-named engagement front door).
  headline: 'I design, build, and ship.',
  // Hero lead — names the audience the headline leaves implicit ("for whom").
  positioning:
    'For solo operators, small businesses, and nonprofits — software, strategy, and structure, turning ambiguity into something finished you can actually use.',
  bookUrl: 'https://unflappable.press',
  // Contact form posts here — a Cloudflare Pages Function (functions/api/contact.js) that
  // emails submissions via Resend. No third-party form service, no per-seat fee.
  contactEndpoint: '/api/contact',
  // Cloudflare Turnstile site key (PUBLIC — safe to ship in the browser). Drives the anti-spam
  // widget on the contact and assessment-intake forms; the Functions verify the resulting token
  // server-side with the matching secret (TURNSTILE_SECRET_KEY). Set PUBLIC_TURNSTILE_SITE_KEY as
  // a Pages build env var for production. The fallback is Cloudflare's "always passes" TEST key —
  // it renders and issues a valid token but provides NO real protection, so replace it before
  // launch. The public key and the server secret must be swapped together (a real key with a test
  // secret, or vice-versa, blocks every submit).
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
};

// Pre-launch beta banner — a strip above the header on every page, aimed at the handful
// of people looking the site over before it's announced. Two jobs: say plainly that this
// isn't public yet, and point at the feedback widget.
//
// TOGGLE: flip `enabled` to false and redeploy — that's the whole switch. It can also be
// forced off at build time without a code edit by setting PUBLIC_BETA_BANNER=false as a
// Pages env var (any other value, or unset, leaves `enabled` in control).
//
// Deliberately NOT wired to robots/noindex (decision 2026-07-27, Jon): the site stays
// crawlable through the beta so early indexing accumulates before launch.
//
// TODO(jon): approve this copy — it's drafted, not yours yet.
export const banner = {
  enabled: import.meta.env.PUBLIC_BETA_BANNER !== 'false',
  label: 'Private beta',
  // Kept to two sentences: the fact, then the ask. Any longer and it stops being a banner.
  text: 'This site isn’t public yet — you’re seeing it early. Something confusing, broken, or plain wrong?',
  // Label for the inline button that opens the feedback widget. If the widget isn't on the
  // page for some reason, the button removes itself and `textFallback` runs instead.
  ctaLabel: 'Tell me',
  textFallback: 'Use the Feedback button in the corner.',
  // Trailing line after the CTA. Short on purpose — it lands the whole thing.
  tail: 'That’s what it’s for.',
  dismissLabel: 'Dismiss',
};

// Contact page copy. The `prompts` list is the CTA's real work: it lets a visitor
// recognize their own situation instead of decoding category language ("fractional",
// "zero-to-one"). Each line is anchored to work that actually exists on /work —
// keep it that way, and keep the list short enough to scan in one pass.
export const contact = {
  lead: "Tell me what you're stuck on. I'll tell you whether I'm the right person to help.",
  promptsHeading: 'You might be here because:',
  prompts: [
    'Your business is running on a platform that no longer fits, and you need a new one.',
    'You’ve had it with email and spreadsheets and want a process that actually works.',
    'You have an idea, a mission, but no working infrastructure behind it.',
    'You want to “do something with AI” and need a straight answer about what’s worth doing.',
    'Something’s half-built and needs someone to finish it.',
  ],
  promptsFooter:
    'Or none of these, and you just want to talk. That works too.',
  // Optional timeline picker on the form. It is a qualifier, not a data-collection
  // exercise: the answer separates "we have a decision to make" from "just looking"
  // before a call gets spent on it. Deliberately NOT a budget question — that reads
  // as presumptuous to the nonprofits and solo operators this page is aimed at.
  // Kept optional; a blank answer must never block a send.
  timelineLabel: 'Timeline',
  timelineHint: 'Optional',
  timelineOptions: [
    'Just exploring, no timeline yet',
    'Sometime in the next few months',
    'Weeks, not months',
    'Already underway, need help now',
  ],
  // Availability, kept quiet and out of the way — it used to open the page, which
  // gated the reader before inviting them.
  availability:
    'I take on a small number of engagements — solo operators, small businesses, and nonprofits.',
};

// "Build Assessment" — the paid diagnostic (see .temp/PLANNING.md → Go-to-market → The diagnostic
// offer). Fixed-scope, written deliverable, $1,000 credited toward the build. Copy written as Jon
// per .temp/voice-and-style.md. DRAFT: the /assessment page renders but is intentionally NOT in the
// nav and not linked anywhere yet — pending Jon's sign-off on shape, price, and name.
export const assessment = {
  title: 'Build Assessment',
  // Plainest register — a line Jon would say out loud.
  lead: "Before we build anything, I look at what you've got and tell you what I'd do about it — in writing.",
  intro:
    "Most people who reach out aren't sure what they need yet. They know something isn't working — the wrong platform, a process held together by email, a mission with no machinery behind it. The Build Assessment clears it.",
  howHeading: 'How it works',
  how: "We talk for an hour, maybe ninety minutes, and I ask a lot of questions. Then I go away and think. A week later you get a short written plan — three to five pages, no filler:",
  deliverables: [
    {
      label: 'What’s actually going on.',
      body: 'Your situation, written down plainly. Most people have never seen it laid out this way — and that alone is worth the fee.',
    },
    {
      label: 'What I’d build, and in what order.',
      body: 'The recommendation, sequenced. What’s first, what can wait.',
    },
    {
      label: 'What it costs and how long.',
      body: 'Real ranges. What’s in scope, and what isn’t.',
    },
    {
      label: 'What you can do without me.',
      body: 'The parts you could handle yourself. I’d rather tell you than sell you.',
    },
  ],
  priceHeading: 'What it costs',
  price:
    '$1,000, flat. If you decide to build with me, it comes off the price of the work — so if we go ahead, the assessment was free.',
  forHeading: 'Who it’s for',
  forWhom:
    'Solo operators, small businesses, and nonprofits — people close enough to the work to decide fast. If you already know exactly what you want built, you don’t need this; just say so on the contact page. This is for when you know something’s wrong and want a straight answer about what to do about it.',
  ctaLabel: 'Start a Build Assessment',
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
