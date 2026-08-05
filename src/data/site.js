// Site-wide content & links for jahutton.build (portfolio / calling card).

export const site = {
  name: 'Jonathan A. Hutton',
  domain: 'jahutton.build',
  // Quiet footer line — the through-line, understated (the ".build" pun lives in the domain).
  tagline: 'Software, systems, wires, and walls.',
  // Hero headline — the sharpest, most distinctive line, promoted from body to top.
  // See ~/.claude/plans/misty-dreaming-hinton.md (positioning updated 2026-07-23:
  // pivoted from enterprise/"regulated, high-stakes" to an audience-named engagement front door).
  headline: 'Design, build, and ship.',
  // Hero lead — names the audience the headline leaves implicit ("for whom").
  // 2026-08-02 (Jon): "turning ambiguity into something finished you can actually use" became
  // "so the thing you've been meaning to build actually exists." He didn't want "ambiguity" —
  // it was the one abstract noun in a concrete sentence, and it's the kind of word that could
  // sit in any consulting firm's boilerplate. The replacement also drops the abstraction
  // entirely rather than swapping in another one, and it covers the zero-to-one work as well as
  // the rescues, which "turning X into Y" didn't.
  // Resolved 2026-08-04: og-default.png was regenerated from the current headline, and the
  // alt text in BaseLayout.astro + README.md moved with it. The card is rebuilt from
  // .temp/og-card.html (geometry measured off the original, same @fontsource faces the site
  // ships) via `node .temp/make-og-card.mjs`. If this headline changes again, the card and
  // BOTH alt strings change with it — the alt describes the picture, so a stale alt is a lie.
  positioning:
    'For solo operators, small businesses, and nonprofits — I create software and actionable strategy, so the thing you’ve been meaning to build actually exists.',
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
  text: 'This site isn’t public yet — thanks for agreeing to test it out. Please use the feedback button below to provide any inputs you have.',
  // Label for the inline button that opens the feedback widget. If the widget isn't on the
  // page for some reason, the button removes itself and `textFallback` runs instead.
  // ctaLabel: 'Tell me',
  // textFallback: 'Use the Feedback button in the corner.',
  // Trailing line after the CTA. Short on purpose — it lands the whole thing.
  // tail: 'That’s what it’s for.',
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
// REBUILT 2026-07-28 from Jon's own answers in .temp/services-copy-questions.md, after he read
// the first draft and said it didn't sound like him. It didn't: it was lists, parallel triads,
// and quotable aphorisms, and his writing is almost none of those.
//
// MOSTLY HIS SENTENCES NOW. `lead`, `price`, and `notItems` are near-verbatim; `intro`
// is his answer to "what are they actually buying" turned from third person to second and
// otherwise untouched. Before editing any of it, read his answers — the bar is his phrasing, not
// smoother phrasing. Two things that look like slips and are his, on purpose:
//   • "leverage modern technology" — the guide flags "leverage", but he wrote it. His word wins.
//   • "go forth and build it" — the driest line on the page. Don't soften it.
//
// PRICE: $2,500, decided 2026-08-05. Both long-open questions on this page are now closed.
//
// The number was never really a pricing question — it was "what size of work do you want?", and
// the assessment price is how a stranger answers that about you. Jon wants $15–30k builds, which
// the 10–20% rule puts behind a $1,500–6,000 diagnostic. $1,000 sat below that floor and, worse,
// silently ANNOUNCED $5–10k builds to anyone weighing whether to bring a bigger problem — a cost
// that is invisible, because nobody writes to say they didn't write. $2,500 is 10% of the middle
// of the range and reads as "$25k builds". Hour math, comparables and the arguments against are
// all in .temp/ASSESSMENT-PRICING.md.
//
// ⚠️ Do NOT "publish low and raise later". That path was considered and rejected: a published
// price is a SIGNAL, a private discount is a FAVOUR. Discounting the first one or two people in
// the flying community costs nothing permanent; raising a public number afterwards, in a small
// community where people talk, is awkward in a way the favour never is. List the real number and
// discount quietly.
//
// The price appears in FOUR rendered places and they must move together: `services.startPrice`
// and `assessment.price` below, the meta description in src/pages/assessment.astro, and
// PASTE_READY in functions/api/contact.js — the paragraph Jon pastes into a reply, which is the
// version a prospect reads in their inbox rather than on the site.
//
// SHAPES: the three bodies stay as drafted. Jon confirmed 2026-08-05 that they describe the work
// accurately, which closes the older "no source in your answers" flag — they still aren't his
// sentences, but they are now his call. `shapesLead` is his.
// "Fractional — roughly a day a week" was queried against the 5–8 hours/week capacity figure in
// ASSESSMENT-PRICING.md and confirmed real: that figure describes working around a day job Jon
// intends to leave, and this site is built for the other side of that. Read the capacity math in
// that doc as the old constraint, not the plan.
export const services = {
  title: 'How I work',
  // His answer to "someone at a party asks what you do" — verbatim, and it earns the top of
  // the page for the same reason it worked at the party: no jargon, and it covers wires and
  // walls as well as software.
  lead: 'I build things and solve problems in digital and physical spaces.',
  // SEGMENT ARRAY, not a string (2026-08-04) — same shape as about.js and the server-closet
  // blurb: 'plain text' runs, and { href, text } for a link. Astro escapes this, so there is
  // no markdown to reach for. Only this one field carries segments; the rest of `services`
  // is plain strings.
  //
  // Three fixes in this sentence, all Jon's call:
  //   · "the production-grade apps" → "production-grade apps". The article was pointing at
  //     apps the reader hasn't been introduced to, which is also why it now links to /work/.
  //   · "you`ll" → "you’ll". A BACKTICK, which rendered literally on the live page. Second
  //     time this file has caught one — see bfbcc56. If you draft in an editor that turns a
  //     lone quote into a backtick, check this field after every edit.
  //   · "production-grade apps" now links to /work/ (Jon), so the claim has the evidence
  //     one click away instead of asking to be taken on faith.
  intro: [
    'Partner with me and you’ll get the same energy that went into writing a book and building ',
    { href: '/work/', text: 'production-grade apps' },
    '; someone who knows what questions to ask, and who can save you money by helping you build the thing yourself.',
  ],

  startHeading: 'Start here',
  // SPLIT into two paragraphs 2026-08-05, after a beta reader said he didn't understand the
  // credit. He was right, and the reason was structural: the price and the credit were the last
  // clause of a 45-word sentence about something else, and "How I price" then explained the same
  // mechanic again further down. A reader met it twice and understood it neither time. The money
  // now gets its own paragraph — the one thing on this page a reader has to be certain about
  // shouldn't be riding on the back of the deliverables list.
  start:
    'We talk for an hour, and a week later you get a short written plan: what’s going on, what I’d build and in what order, what it costs, and which parts you could handle without me.',
  // The other half of what he couldn't tell: what happens to the money if he DOESN'T build with
  // Jon. The page had never answered it. Full credit, no time limit, and the plan is his either
  // way (Jon's call, 2026-08-05). The credit clause is worded to match `assessment.price`
  // verbatim — same promise on both pages, so a reader who lands on either gets the same answer.
  // ⚠️ These two sentences are a commitment to a paying customer. Change them in both places or
  // neither.
  startPrice:
    'It’s $2,500, and it’s the only thing paid up front. If we build together it comes off the price of the work — so if we go ahead, the assessment was free. If we don’t, the plan is still yours: take it to another builder, or build it yourself.',
  // 2026-08-02 (Jon): both CTAs on this page now go STRAIGHT to the intake form, not to the
  // /assessment/ explainer. The paragraph above already says what the assessment is, what it
  // costs, and what you get — so sending a reader who just read that to a page explaining it
  // again was a step that only added friction.
  // The label had to move with the href: "About the Build Assessment" on a button that opens a
  // form is a broken promise. /assessment/ is still reachable from /contact and from the
  // post-contact next-step card, so it isn't orphaned — it just isn't this page's job any more.
  startCtaLabel: 'Start a Build Assessment',
  startHref: '/assessment/intake/',

  shapesHeading: 'Three shapes the work takes',
  // Added 2026-08-05. The same beta reader asked whether naming three shapes meant Jon accepts
  // all three, and how that changed the price — and the section couldn't answer, because the
  // cards carry a name, a when, and a body, and no price signal at all. So a reader can't tell
  // whether these are three products with three prices or three descriptions of one custom
  // engagement. They're the second thing (Jon, 2026-08-05): one path in, scope decided by the
  // assessment. One line says so, which is cheaper than putting a number on each card that would
  // then have to be true.
  shapesLead:
    'All three start the same way — the assessment is where we work out which one you need and what it costs.',
  shapes: [
    {
      name: 'Zero-to-one',
      when: 'Nothing exists yet.',
      body: 'An idea or a mission with nothing underneath it. I design it, build it, and hand you something that runs.',
    },
    {
      name: 'Build-with-you',
      when: 'Something stalled.',
      body: 'A project that stopped moving, or a platform that no longer fits. I come in and finish it, and leave it somewhere your team can keep it running.',
    },
    {
      name: 'Fractional',
      when: 'Ongoing, roughly a day a week.',
      body: 'Architecture, systems, and straight answers about what’s worth building with AI — for organizations that need the judgment but not a full-time hire.',
    },
  ],

  priceHeading: 'How I price',
  // Verbatim. It replaced a manufactured aphorism about working slowly vs. fast, and it says
  // the same thing better by tying the pricing to the writing.
  price:
    'I like to be as clear in my pricing as I am in my writing, and a fixed model works better than an hourly rate.',
  // "and when it lands" added 2026-08-05 — the beta reader's suggestion, and a fair one: this
  // sentence is where the deal gets defined, and the timeline is part of the deal. Everything
  // else here is Jon's, near-verbatim.
  priceDetail:
    'First, we agree on what’s being built, what it costs, and when it lands. The assessment is the one thing paid up front, and it comes off the price of the build.',

  notHeading: 'What I’m not the right person for',
  notItems:
    'I’m probably not interested in projects involving fintech, crypto, multi-level or affiliate marketing, gaming, or lifestyle brands. My career is grounded in public service, small business, and nonprofits — I’ve done some work for a bootstrapped startup, but I don’t come from that world and don’t use startup lingo. What I do have is a strong grasp on how to leverage modern technology to build tools and apps that make life easier for people.',

  // REMOVED 2026-08-02 (Jon) — deleted rather than left unrendered, the same call as FlowDiagram
  // and the info callout. Both are in git history.
  //   · `notTail` — the "go forth and build it" sign-off that closed the section above.
  //   · `ctaHeading` ("Where to start") and `ctaLead`, the prose that introduced the buttons.
  // The two BUTTONS below stayed — Jon put them back the same session. So the page still closes
  // on an ask, just without a section wrapped around it: the last thing a reader meets after
  // "what I'm not the right person for" is the two doors, unannounced.
  // NOTE for anyone re-reading the older comments in this file: the one flagging "go forth and
  //   build it" as Jon's own line — don't soften it — referred to `notTail`. That line is gone
  //   by his own call, which is not the same thing as softening it.
  // Same change as `startHref` above — straight to the form. Note this label and `startCtaLabel`
  // are now identical, which is deliberate: it's the same ask at the top and the bottom of a long
  // page, not two different offers.
  ctaPrimaryLabel: 'Start a Build Assessment',
  ctaPrimaryHref: '/assessment/intake/',
  ctaSecondaryLabel: 'Just talk first →',
  ctaSecondaryHref: '/contact/',
};

// "Build Assessment" — the paid diagnostic (see .temp/PLANNING.md → Go-to-market → The diagnostic
// offer). Fixed-scope, written deliverable, $2,500 credited toward the build. Copy written as Jon
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
  // Second sentence added 2026-08-05, matching `services.startPrice` — this page explained what
  // happens when you DO build and said nothing about when you don't, which is the half a reader
  // deciding whether to spend $2,500 actually needs. ⚠️ Same promise as `services.startPrice`.
  // Change both or neither.
  price:
    '$2,500, flat. If you decide to build with me, it comes off the price of the work — so if we go ahead, the assessment was free. If you don’t, the plan is still yours: take it to another builder, or build it yourself.',
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
  // /notes ships built but UNLINKED (2026-08-03), the same way /now is hidden — the
  // surface was built before the writing exists, and pointing the nav at "Nothing here
  // yet" advertises an empty room. Notes sits next to Work because both are "things I
  // made"; Services/About/Contact are the offer ladder and splitting that run reads worse.
  // Uncomment this line and drop the matching /notes exclusion from astro.config.mjs
  // together, on the day the first note publishes. Both say so.
  // { label: 'Notes', href: '/notes' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  // Pulled from the nav 2026-07-29 (Jon). The page still builds and still works at /now/ —
  // it's unlinked and out of the sitemap, not deleted. Reason: its "Exploring next" section
  // is job-search copy ("transformation and change-agent roles", "player-coach, senior
  // individual-contributor-plus"), which reads as role-shopping now that /services sells a
  // Build Assessment and three engagement shapes. Rather than rush a rewrite, it's hidden.
  // Uncomment this line and drop the matching /now exclusion from astro.config.mjs to bring
  // it back — do the rewrite first (agreed direction: name the problems, not the job titles).
  // { label: 'Now', href: '/now' },
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
