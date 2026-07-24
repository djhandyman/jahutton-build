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

// Contact page copy. The `prompts` list is the CTA's real work: it lets a visitor
// recognize their own situation instead of decoding category language ("fractional",
// "zero-to-one"). Each line is anchored to work that actually exists on /work —
// keep it that way, and keep the list short enough to scan in one pass.
export const contact = {
  lead: "Tell me what you're stuck on. I'll tell you straight whether I'm the right person for it.",
  promptsHeading: 'You might be here because:',
  prompts: [
    'You’re on the wrong platform, and the migration is nobody’s job.',
    'Your team is running something real out of email and spreadsheets, and it’s breaking.',
    'You’ve got a mission and no working infrastructure behind it.',
    'You’ve been told to “do something with AI” and want a straight answer about what’s worth doing.',
    'Something’s half-built and needs someone to finish it.',
  ],
  promptsFooter:
    'Or none of these, and you just want to talk it through. That works too.',
  // Optional timeline picker on the form. It is a qualifier, not a data-collection
  // exercise: the answer separates "we have a decision to make" from "just looking"
  // before a call gets spent on it. Deliberately NOT a budget question — that reads
  // as presumptuous to the nonprofits and solo operators this page is aimed at.
  // Kept optional; a blank answer must never block a send.
  timelineLabel: 'Timeline',
  timelineHint: 'Optional — helps me know whether to answer today or think on it.',
  timelineOptions: [
    'Just exploring, no timeline',
    'Sometime in the next few months',
    'Weeks, not months',
    'Already underway and stuck',
  ],
  // Availability, kept quiet and out of the way — it used to open the page, which
  // gated the reader before inviting them.
  availability:
    'I take on a small number of engagements at a time — solo operators, small businesses, and nonprofits.',
};

// "Build Assessment" — the paid diagnostic (see .temp/PLANNING.md → Go-to-market → The diagnostic
// offer). Fixed-scope, written deliverable, $1,000 credited toward the build. Copy written as Jon
// per docs/voice-and-style.md. DRAFT: the /assessment page renders but is intentionally NOT in the
// nav and not linked anywhere yet — pending Jon's sign-off on shape, price, and name.
export const assessment = {
  title: 'Build Assessment',
  // Plainest register — a line Jon would say out loud.
  lead: "Before we build anything, I look at what you've got and tell you what I'd do about it — in writing.",
  intro:
    "Most people who reach out aren't sure what they need yet. They know something isn't working — the wrong platform, a process held together by email, a mission with no machinery behind it — but what to actually build is the fog. The Build Assessment clears it.",
  howHeading: 'How it works',
  how: "We talk for an hour, maybe ninety minutes, and I ask a lot of questions. Then I go away and think. A week later you get a short written plan — three to five pages, no filler:",
  deliverables: [
    {
      label: 'What’s actually going on.',
      body: 'Your situation, written down plainly. Most people have never seen it laid out this way — and that alone is worth the fee.',
    },
    {
      label: 'What I’d build, and in what order.',
      body: 'The recommendation, sequenced. What’s first, what’s load-bearing, what can wait.',
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
