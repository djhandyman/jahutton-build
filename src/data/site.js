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
  text: 'This site isn’t public yet — thanks for agreeing to test it out for me. Please use the feedback widget to provide any inputs you have on what I can improve.',
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
  //
  // Each option carries a stable `value` key alongside its `label`. The <option> value the
  // browser submits is the two joined as `key|label` (see ContactForm.astro), and the Function
  // splits them back apart. That looks odd for about ten seconds, and it buys two things:
  //   1. The label stays the ONLY copy of this wording — reword it here and the email that
  //      lands in Jon's inbox rewords with it. No duplicated string in functions/.
  //   2. The `key` is what the server tests to decide whether to offer the Build Assessment
  //      after the send (see QUALIFIED_TIMELINES in functions/api/contact.js). Keys are stable,
  //      so Jon can rewrite every label freely without changing who gets offered what.
  // An unrecognized key is never an error — it just means "not qualified", and the raw value
  // still prints in the email. Drift degrades to the old behaviour; it can't reject a send.
  timelineLabel: 'Timeline',
  timelineHint: 'Optional',
  timelineOptions: [
    { value: 'exploring', label: 'Just exploring, no timeline yet' },
    { value: 'months', label: 'Sometime in the next few months' },
    { value: 'weeks', label: 'Weeks, not months' },
    { value: 'underway', label: 'Already underway, need help now' },
  ],
  // Availability, kept quiet and out of the way — it used to open the page, which
  // gated the reader before inviting them.
  availability:
    'I take on a small number of engagements — solo operators, small businesses, and nonprofits.',
  // One quiet line under the prompt list pointing at the paid diagnostic. Deliberately placed
  // AFTER the "or none of these, and you just want to talk" line, so the free door is still the
  // one the reader meets first. It is a signpost, not a pitch — the selling happens on
  // /assessment, if they choose to go there.
  // TODO(jon): approve — drafted, not yours yet.
  assessmentNudge: {
    text: 'Not sure what you need yet? That’s what the',
    linkLabel: 'Build Assessment',
    href: '/assessment/',
    tail: 'is for.',
  },
};

// "What I offer" — the services page (/services). Its job is to answer "what is it like to work
// with you" for someone who arrived from a warm introduction and is deciding whether to write.
// The three engagement shapes were already named in the /contact meta description long before
// this page existed; this is where they finally live.
//
// Structure is deliberate: the Build Assessment comes FIRST, because it is the front door to all
// three shapes rather than a fourth product sitting beside them.
//
// TODO(jon): this whole export is DRAFT copy — approve or rewrite before launch. Two specific
// calls to make: (1) whether to publish price ranges for the build/retainer shapes (the anchors
// in .temp/PLANNING.md are explicitly un-pressure-tested, so nothing but the $1,000 assessment
// price is stated here); (2) whether to name a real project under each shape — every project on
// /work is real, but characterizing which shape each one was is your call, not mine.
export const services = {
  title: 'How I work',
  lead:
    'Most of the people who write to me know something isn’t working. What they don’t have is a plan — nobody has sat down and written out what to do about it. That’s usually where I start.',

  startHeading: 'Start here',
  start:
    'The Build Assessment is the first step for almost everyone. An hour of questions, then a short written plan: what’s actually going on, what I’d build and in what order, what it costs, and which parts you could handle without me. $1,000, and it comes off the price of the work if we build together.',
  startCtaLabel: 'About the Build Assessment',
  startHref: '/assessment/',

  shapesHeading: 'Then one of three shapes',
  shapes: [
    {
      name: 'Zero-to-one',
      when: 'Nothing exists yet.',
      body: 'An idea, a mission, a mandate — and no machinery behind it. I design it, build it, and hand you something that runs. Software, the systems around it, and the documentation that keeps it running when I’m gone.',
    },
    {
      name: 'Build-with-you',
      when: 'Something’s half-built.',
      body: 'A project that stalled, a platform that no longer fits, a process held together by email and spreadsheets. I come in, finish it, and leave it in a state your team can actually maintain.',
    },
    {
      name: 'Fractional',
      when: 'You need the thinking, ongoing.',
      body: 'Roughly a day a week, for a fixed monthly number. Architecture, systems, org structure, and straight answers about what’s worth building with AI and what isn’t. For organizations that need the judgment but not a full-time hire.',
    },
  ],

  priceHeading: 'How I price',
  priceIntro: 'Two rules, and I hold both of them.',
  priceRules: [
    {
      label: 'Fixed price per scoped outcome.',
      body: 'Never hourly. You shouldn’t pay more because I worked slowly, and I shouldn’t earn less because I worked fast. We agree on the thing being built and what it costs, in writing, before money moves.',
    },
    {
      label: 'The first step is paid.',
      body: 'The assessment is where the thinking happens, so that’s the part I charge for. If you hire me for the build, it’s credited — so it costs you nothing in the end.',
    },
  ],

  notHeading: 'What I don’t do',
  notItems: [
    'Bill by the hour.',
    'Pretend to be an agency. It’s me. If the job needs a crew, I’ll say so and help you find one.',
    'Sell you something you could do yourself. I’d rather tell you than bill you for it.',
  ],

  // The closing question is Jon's own, lifted verbatim from the portfolio-site entry in
  // .temp/project-copy.md — it is how he actually ends a piece of writing aimed at a reader
  // he wants to hear from. Don't replace it with a manufactured CTA.
  // TODO(jon): the Unflappable entry in that same file ends "And now we are going to direct
  // that same energy into your problems, projects, and ideas." That line would work here too,
  // above the buttons — but it's yours and it's craft, so it's your call whether to move it.
  ctaHeading: 'Where to start',
  ctaLead:
    'If you already know what you want built, skip the assessment and just tell me. If you don’t — and most people don’t, or they wouldn’t be writing — that’s exactly what it’s for. What would you like to start building together?',
  ctaPrimaryLabel: 'Start a Build Assessment',
  ctaPrimaryHref: '/assessment/',
  ctaSecondaryLabel: 'Just talk first →',
  ctaSecondaryHref: '/contact/',
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

  // Post-contact next step. Shown ONLY to someone whose timeline answer says they are actually
  // moving (QUALIFIED_TIMELINES in functions/api/contact.js) — two surfaces, same words:
  //   • JS submit  → rendered inline under the form, no navigation (ContactForm.astro)
  //   • no-JS post → the Function 303s to /thanks/build-assessment/ instead of /thanks/
  // Register matters here. The message just sent is on its way to a human; this is a footnote
  // to that, not a second sales pitch. Keep it to two sentences.
  // TODO(jon): approve — drafted, not yours yet.
  nextStep: {
    heading: 'One more thing, if you’re in a hurry',
    body: 'I answer everything myself, which means I’m not always fast. If you’d rather not wait on my inbox, the Build Assessment is how paid work starts — an hour of questions and a written plan a week later.',
    ctaLabel: 'About the Build Assessment',
    href: '/assessment/',
  },
};

// Post-submit confirmation copy. Lives here rather than in the page because there are now two
// thanks pages rendering it — /thanks/ and /thanks/build-assessment/ (see those files for why).
export const thanks = {
  title: 'Thanks',
  body: 'Your message is on its way — I’ll get back to you soon.',
  backLabel: '← Back home',
};

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
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
