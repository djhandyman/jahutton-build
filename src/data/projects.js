// Portfolio projects.
//
// ⚠️ DRAFT copy — reframed around the through-line "I turn organizational
// ambiguity into finished, working structure" (systems-level change agent).
// Each blurb follows: the mess I found → what I built → what changed.
// Jonathan reviews/approves each before launch. The `// TODO(jon):` comments
// mark where a real, citable outcome/metric still needs to be added — they live
// in the source (not the visible blurb) so nothing unfinished renders on the page.
// Never invent metrics or outcomes. Order leads with the most showable work.
//
// PRESENTATION (2026-07-23): a project with a `slug` gets its own detail page at
// /work/<slug> — the card shows the short `teaser` + "Read more →", and the full
// `blurb` becomes the detail-page body (room for photos/links to grow). A project
// WITHOUT a slug is teaser-only: its card renders the `blurb` inline, no link.
// Promote/demote a project between the two tiers by adding/removing its `slug`.
//   teaser — short card hook (slugged projects only)
//   blurb  — the full body (detail page; or the card body when teaser-only). A string for
//     a single paragraph, or an ARRAY for multi-paragraph copy — both the card and the
//     detail page normalize it and render one <p> per entry. Plain text by default: it goes
//     through Astro's escaping, so no markdown/HTML (use “quotes”, not _italics_).
//     An entry may also be a SEGMENT ARRAY — the same shape as about.js — when a sentence
//     needs an inline link or emphasis (added 2026-08-03 for the server closet's parts list):
//       'plain text'                 → a text run
//       { href: '…', text: '…' }     → a link; rel="noopener" is added for external hrefs
//       { strong: '…' } / { em: '…' } → <strong> / <em>
//     Reach for it only when the link belongs INSIDE the sentence that earns it — a link that
//     can stand on its own is a `link` CTA pill or a `source`, both of which read better.
//     An entry may also be a LIST BLOCK — { heading, items: [...] } — rendering as a small
//     heading plus a <ul>. Added 2026-07-29 for WAHBE, where Jon's own copy is two labelled
//     inventories ("I supported" / "I innovated by"); flattening those into prose would have
//     been a rewrite, not an edit. Use it only where the copy is genuinely a list.
//   link   — optional CTA pill(s) on the detail page: one { href, label }, or an ARRAY of them
//     (first renders as the solid pill, the rest as ghosts). Usually just the live thing
//     (chelancomps.org). Where the blurb ENDS BY ASKING THE READER FOR SOMETHING — Unflappable,
//     the server closet, this site — the first pill is `/contact/` instead.
//     ⚠️ Label rule (Jon, 2026-07-28): a pill must NOT echo the sentence above it. Quoting his
//     own closing line back at him reads as cheesy. Keep the labels plain, and keep them
//     different from each other — three identical buttons read like a template.
//     ⚠️ TODO(jon): approve the three contact-pill labels (2026-07-28) — they're new microcopy.
//   source — optional repo link, { href, label }, rendered at the very bottom of the detail
//     page as a small GitHub icon + label. Quiet on purpose: it's evidence for the reader who
//     wants to check the claims, not a call to action competing with the pill.
//   gallery — optional photo exhibits on the detail page (slugged projects only). An array of
//     groups: { heading, caption, note, shots: [{ label, img }] }.
//       shots   — ordered, and they render as columns in that order, each under its own `label`.
//                 Two is the common case (Before/After); the bathroom runs three, because the
//                 SketchUp model belongs BETWEEN the before and the after — that's the actual
//                 sequence of the work. This replaced a fixed { before, after } pair plus a
//                 `labels` override on 2026-07-29: an ordered list says the same thing without
//                 the special case, and a third column had nowhere to go in the old shape.
//       heading — optional. Omit it for a project with a single exhibit (the server closet, the
//                 signage); set it where one page covers distinct subjects that shouldn't blur
//                 together — the remodel is a Bathroom and a Kitchen, not one undifferentiated
//                 pile of photos.
//       note    — optional muted line INSTEAD of shots, for a group that's real work but has
//                 nothing shippable to show yet. Say plainly that it's coming; don't dress up
//                 an empty section with half a before/after.
//     `img` is { src, width, height, alt } where `src` is the EXTENSIONLESS public path — the
//     page appends .webp for the <source> and .jpg for the <img>, matching the headshot/hero
//     convention. width/height are the real pixel dims (they reserve layout space so the page
//     doesn't jump). Assets live in public/images/work/<slug>/.
//   logo   — optional brand mark on the detail page (slugged projects only):
//     { src, width, height, alt, note }, the same extensionless-src convention as the gallery.
//     Renders small, on a white ground — the marks carry transparent backgrounds, and the .jpg
//     fallback is flattened onto white to match — with `note` as the caption. It sits with the
//     body rather than down in the exhibit zone: where a logo appears at all, the branding is
//     part of the work being described, not supporting evidence for it.
//   testimonial — optional client quote on the detail page, between the body and the CTA:
//     { quote, name, role, org, photo, placeholder }. `photo` is the same extensionless
//     { src, width, height, alt } shape as the gallery (rendered as a 56px circle, so supply
//     a square-ish crop); omit it and the block shows an initials monogram instead, which is
//     how a real quote can go live before its headshot does.
//     ⚠️ `placeholder: true` prints a visible "not a real quote" flag under the block. NEVER
//     remove that flag from invented copy — deleting it is the single step that says "a real
//     person said this." A fabricated testimonial is the worst thing this site could ship.
//   metrics — optional outcome numbers on the detail page (slugged projects only), rendered by
//     src/components/ProjectMetrics.astro between the body and the CTA — the same evidence zone
//     as the testimonial, because a number is proof and the ask comes after the proof. An array
//     of { icon, value, label }: `value` is the number as it should read ("+30%", "20,000+"),
//     `label` is what it measures, and `icon` keys the small inline glyph set in that component
//     ('box', 'trend-up', 'truck' so far — add a key there when a metric needs a new one; an
//     unknown or omitted icon just renders the number bare).
//     ⚠️ These are public claims about a real client, held to the same bar as the testimonial:
//     NEVER invent one, and never round a number up into a better story. Every value here comes
//     from Jonathan directly — record the date he gave it, the way the blurbs do.
//     Three reads best at the body measure; two or four also lay out.
//   prompt — optional mid-page invitation on a slugged project: { text, link }. Renders as a
//     filled box AFTER the journey and BEFORE the metrics, so the question aims the numbers
//     ("is this you?") and the proof lands before the ask. The answer is the `link` pill at
//     the foot of the page, which is why `prompt.link` is almost always omitted — a pill
//     inside the box plus a pill sixty pixels below is the same ask twice.
//     Split out of the metrics block by Jon on 2026-08-03 (Cloudbase), second consumer
//     2026-08-04 (Bello Modo). The question is what lets a project keep a contact pill
//     without its blurb ending in an ask — it does the turning-to-the-reader itself.
//     ⚠️ The pill label must NOT echo the question. Same rule as the closing-line pills.
//   journey — optional platform/migration exhibit on a slugged project, rendered inline by
//     work/[slug].astro AFTER the body and BEFORE the metrics: story → shape → results → ask.
//     { heading, lead, steps: [{ name, items, note }], branch: { name, items, note } }.
//     Same two-audience split as the stack diagram: BOXES are checkable facts, NOTES are
//     Jonathan's and answer "why did this move happen" — without them it's a wiring diagram,
//     which is the failure mode rejected on 2026-07-30. `note`, `heading` and `lead` all
//     render nothing while null, so the exhibit is honest while it waits.
//     `branch` is for a thing built FROM the last step rather than a further step in the
//     line — it renders indented, with a corner connector and a rust edge. Use it only for
//     that relationship; a fourth platform is a fourth `step`.
//     Added 2026-08-03 for Bello Modo (Woo → BigCommerce → Shopify, plus the catalog app).
//   diagram — optional `true` on slugged projects: renders the stack exhibit
//     (src/components/StackDiagram.astro, data in src/data/colophon.js → `stack`) under an
//     "Under the hood" heading below the CTA. The heading is what keeps it an appendix rather
//     than the page's headline. Specific to this site's own case study — not a general
//     "architecture" slot for other projects.
//     Replaced the request-flow exhibit here on 2026-07-30 (Jon): that one answered "what happens
//     on submit", which is a narrower question than a reader of this page is asking. It was
//     deleted rather than left unrendered; it's in git history if it's ever wanted back.

export const projects = [
  {
    // Outcome + stack (2026-07-23): platform journey WooCommerce → BigCommerce → Shopify. Custom
    // bulk-lot catalog app verified from the private repo (djhandyman/bellomodo-catalog): an
    // Eleventy/Nunjucks static, searchable (Pagefind) product catalog built from Shopify data,
    // images on Cloudflare R2. Cut costs + grew profitability; simpler inventory. NOT claiming
    // revenue growth (net grew, gross didn't — ad-spend/market).
    // TODO(jon): both repos are private — make bellomodo-catalog public if you ever want to link it.
    // Teaser replaced 2026-07-28 with Jon's own copy (.temp/project-copy.md), verbatim. The blurb
    // is the earlier draft, kept because it carries the specifics his line summarizes.
    slug: 'bello-modo',
    title: 'Bello Modo',
    category: 'organizations',
    role: 'Consultant',
    status: null,
    teaser:
      'From acquisition, stabilization, and tech stack migration. I worked closely with a solo operator, reducing operating expenses by -60% and increasing net margins 2x.',
    blurb:
      'When this specialty e-commerce business changed hands, I stepped in at the operator level to steady it through the transition and re-platform its 20,000-plus SKUs, migrating the store from WooCommerce to BigCommerce and ultimately Shopify, delivered on schedule. Costs came down, profitability went up, and inventory got dramatically simpler — helped by a custom, searchable catalog I built from the Shopify data to handle the bulk-lot inventory details — leaving the new owner with a site that just worked, free to focus on what she does best: customer service, purchasing, and fulfillment.',
    // Metrics supplied by Jon 2026-07-30, the first project to carry the block. The SKU count
    // matches the blurb's "20,000-plus"; profitability is the INCREASE, not a margin (Jon
    // confirmed 2026-07-30), which is also why it stays consistent with the note above about
    // not claiming revenue growth. Don't restate these three in the blurb — they're the
    // numbers version of the same story, not a second telling of it.
    metrics: [
      { icon: 'box', value: '20,000+', label: 'SKUs migrated' },
      { icon: 'trend-down', value: '-60%', label: 'Expenses' },
      { icon: 'trend-up', value: '2x', label: 'Net margins' },
    ],
    // The platform journey, added 2026-08-03 (Jon asked for it). Sits AFTER the body and
    // BEFORE the metrics: story → shape of the work → results → ask.
    //
    // Same two-audience split as the stack diagram on /work/this-site, and for the same
    // reason: the BOXES are checkable facts, the NOTES are Jon's and answer a different
    // question. Three platform names with arrows between them is a wiring diagram — which is
    // the exact failure mode Jon rejected on 2026-07-30. Nobody re-platforms 20,000 SKUs
    // twice for fun, and *why each move happened* is the part that says something about how
    // he works. That's what the notes carry, and they render nothing while null, so the
    // exhibit is honest while it waits rather than propped up with filler.
    //
    // The catalog app is a BRANCH, not a fourth step — it's built *from* Shopify data, so it
    // hangs off the last node rather than continuing the line. Getting that relationship
    // right is half the point of drawing this: it shows the owner was left with something the
    // platform didn't give her.
    //
    // Box contents are deliberately sparse. The only verified facts are the platform order
    // (blurb) and the catalog stack (private repo djhandyman/bellomodo-catalog, verified
    // 2026-07-23). "20,000+ SKUs" is deliberately NOT repeated here — it's already the blurb's
    // "20,000-plus" and a metrics card directly below, and a third telling on one page is
    // where a real number starts to read like a slogan.
    //
    // NOTES LANDED 2026-08-03 — all four are Jon's words, and so are the BigCommerce and
    // Shopify items. His note shape here is NOT the stack diagram's (all-caps label — em
    // dash — one sentence): it's two plain sentences, what happened then what it bought her.
    // That's deliberate and it suits a sequence better than a label would. Match HIS shape if
    // a leg is ever added; don't retrofit the colophon pattern onto it.
    // They answer the question the boxes can't: the Shopify note explains the second move as
    // the owner's downsizing decision rather than a fix, which is the thing no reader would
    // have guessed from three platform names.
    // ⚠️ These describe a real client's business decisions. Same bar as the metrics and the
    //   testimonial — don't sharpen or embellish them.
    // TODO(jon): `heading` and `lead` are still null — both render nothing while null, so the
    //   exhibit is complete without them. Worth a short heading, though: it currently sits
    //   between the prose and the numbers with nothing naming it.
    journey: {
      heading: null,
      lead: null,
      steps: [
        // tone: 'problem' marks the state that was WRONG — the thing the rest of the journey
        // is a response to. Renders teal (--color-secondary) rather than rust, because on
        // this exhibit rust already means "the thing Jon built" (the catalog branch below),
        // and one colour can't carry both. Teal is the palette's designated secondary
        // contrast accent, so this needs no new token and tokens.css stays in sync with
        // unflappable.press. Deliberately NOT a red: an alarm colour on a warm editorial
        // page reads as a UI error state, and this is a story about an inherited store, not
        // a validation failure.
        // Items below are Jon's, 2026-08-03.
        {
          name: 'WooCommerce',
          tone: 'problem',
          items: [
            'The inherited store',
            'Desktop only',
            'Legacy plugins',
            'Product catalog in disarray',
          ],
          note: 'The new owner had to deal with technical debt from years of digital neglect, which is where we started the project. After a thorough technical assessment, we decided a migration made more sense than trying to fix the existing platform.',
        },
        { name: 'BigCommerce', items: ['Mobile-optimized', 'Large catalog support', 'Updated product taxonomy', 'Improved user experience'], note: 'We migrated a massive catalog to a new platform, and also reorganized it. The impact was immediate and positive; customers could shop from any device and the owner no longer had to support a crash-prone and disorganized system.' },
        { name: 'Shopify', items: ['Smaller catalog', 'Weight-based shipping', 'Simpler admin interface'], note: 'The owner made a strategic decision to downsize, selling through a large percentage of inventory while on BigCommerce. After that, we reduced monthly tech spend even more by right-sizing the platform to the new need.' },
      ],
      branch: {
        name: 'Bulk-lot catalog',
        items: [
          'Eleventy + Nunjucks',
          'Pagefind search',
          'Built from Shopify data',
          'Images on Cloudflare R2',
        ],
        note: 'We kept all of the product inventory data in order to build a browsable static catalog that would sit alongside the remaining bulk product lots available for purchase. The early version of this web app was built in a week.',
      },
    },
    // The ask, added 2026-08-04 (Jon's wording). Same split as Cloudbase: question here,
    // above the metrics; the pill that answers it at the foot of the page.
    // Deliberately NOT an outbound link — the live store is the client's business, not
    // evidence of Jon's, and the catalog repo is private. The question is what makes a
    // contact pill sit right on a blurb that ends on the owner's outcome rather than an ask.
    prompt: {
      text: 'How would you like to improve your online store?',
    },
    // Answers the question above. Store + catalog repos are private, so there is nothing
    // public to point at and the ask is the page's job.
    // ⚠️ Label collides in shape with 'Let’s connect' (Cloudbase) and 'Let’s talk' (this site)
    //   — three "Let’s ___" pills across ten detail pages. Jon's call, flagged 2026-08-04.
    link: { href: '/contact/', label: 'Let’s chat' },
    // ⚠️ PLACEHOLDER, added 2026-08-04 while Jon writes the ask. NOBODY SAID THIS.
    // `name` and `role` are BRACKETED — Jon hasn't said who, and the blurb's closing line
    // ("what she does best: customer service, purchasing, and fulfillment") identifies the
    // owner without naming her, which is not a name to borrow. Fill in from the reply, first
    // name only (see CLAUDE.md), and keep `placeholder: true` until her real words land.
    // `org` stays unset — it would repeat the page's own title.
    // TODO(jon): this page carries the site's hardest numbers — 20,000+ SKUs, −60% expenses,
    //   2× net margins — so the quote's job is to corroborate them in her own words rather
    //   than to praise. The ask is what her week looked like before and after: what she was
    //   spending time on during the transition, and what she spends it on now.
    // ⚠️ Asking her for a quote is also the moment to confirm she's comfortable with those
    //   three figures being public. They're already on the live page and they're her
    //   business's numbers, not Jon's — worth one sentence in the same email rather than
    //   assuming the earlier sign-off still covers it.
    testimonial: {
      placeholder: false,
      quote:
        'Working with Jonathan was one of the best decisions I made for my business. I`m not a technical person, and he explained everything in a way that made sense to me. Two platform migrations and I never once felt lost. My costs went down, my inventory got easier to manage, and I could focus on my customers instead of my website.',
      name: 'Lindsay',
      role: 'Owner',
      photo: null, // → /images/work/bello-modo/<name>.{webp,jpg}, square crop
    },
  },
  {
    // Stack verified from the private repo (Cloudbase-Foundation/chelan-comps, 2026-07-23):
    //   React 19 + TypeScript (Vite), Supabase/Postgres backend, Tailwind + Radix UI, RHF + Zod;
    //   Cloudflare-hosted. Woven into the blurb as a light evidence tag.
    // Outcome (2026-07-23): reframed from vague "flying community platform" to its real job —
    // volunteer/logistics coordination for the comps; cut >80% of email; reusable data repository.
    // 2026-07-28: Jon's copy (.temp/project-copy.md) supplies the opening — his "every inquiry was
    // an email / every application a spreadsheet line item" triad is the concrete version of the
    // mess. It leads both the teaser and the blurb; the verified specifics follow it.
    slug: 'chelancomps',
    title: 'chelancomps.org',
    category: 'software · systems',
    role: 'Solo builder',
    status: 'Live',
    teaser:
      'Every inquiry was an email, every application a spreadsheet line item, and every year the team started from scratch. I fixed that.',
    // Scene-setter, added 2026-08-02 (Jon's photo). Source `.temp/photo-import/gaggle.jpg`,
    // 1275×653, converted to the .webp/.jpg pair with the sharp that already ships inside
    // Astro — no new dependency, so the README's four-dependency claim still holds. EXIF and
    // the Apple ICC profile were stripped in conversion; the original had no GPS.
    // ⚠️ 1275px wide is the native size, and the slot renders up to 56rem (896px) — fine at 1×,
    //   soft on a retina screen. TODO(jon): a higher-res original if you have one, then bump
    //   width/height here. Same caveat as the server-closet shots.
    // TODO(jon): approve the alt text below — it's drafted, not yours yet. It describes the
    //   picture for someone who can't see it; it is not a caption and shouldn't sell.
    // Caption is Jon's, supplied 2026-08-03.
    hero: {
      src: '/images/work/chelancomps/gaggle',
      width: 1275,
      height: 653,
      alt: 'Dozens of paragliders circling together in a thermal beside a tall cumulus cloud, seen from below against a deep blue sky.',
      caption: 'The beginning of a paragliding competition, seen from below.',
    },
    // The suite, up top. Jon's content and his three groupings, 2026-08-02 — this REPLACED the
    // single info callout tried earlier the same day, which he rejected. The callout described
    // one document; the project is three things, and leading with one of them misrepresented
    // the scope. The old `callout` slot was deleted with it rather than left unrendered (same
    // call as FlowDiagram on 2026-07-30) — both are in git history.
    // The guide link survived the swap: it's the one component with a public URL, verified live
    // 2026-08-02 (HTTP 200). The front end is chelancomps.org itself, already the page's CTA, so
    // linking it here would just be the same link twice. The admin backend is behind auth.
    // ⚠️ Only mechanical change to Jon's words: sentence case on the pill text ("expectations" →
    //   "Expectations"), because a lowercase pill beside a capitalised one looks like a bug.
    //   Names are his verbatim, CSS does the uppercasing.
    // TODO(jon): a `heading` for this block, if you want one — it renders nothing while null.
    //   Three unlabelled boxes above the first paragraph do assume the reader knows they're
    //   looking at the parts of one system. Something like "Three parts" would remove the guess.
    components: {
      heading: null,
      items: [
        {
          name: 'Guide',
          items: ['Expectations', 'Process', 'Narrative'],
          link: { href: 'https://chelancomps.org/guide', label: 'Read the guide' },
        },
        {
          // 'Volunteer applications' added 2026-08-03. Verified, not inferred: the live front
          // end's page title is "Chelan 2026 Volunteer Application" — it's the app's own name for
          // itself. The card previously listed two conveniences and never named the thing the
          // front end exists to do, so the scope read smaller than it is.
          // 'Availability' added 2026-08-03 from Jon direct: the form is where people apply to
          // volunteer and give their information and availability. The vetting he described in the
          // same breath is the team's work, so it sits on the admin card below, not this one.
          // TODO(jon): the multi-step form's own behaviour is the remaining candidate, if you want
          //   a fourth. PLANNING.md (2026-07-23) records stepped flow / per-step validation /
          //   progress bar / saved draft / review-before-submit — but that describes the vanilla
          //   port built for THIS site's intake wizard, ported from Chelan's pattern. Confirm
          //   which of them the Chelan form actually has before any becomes a pill here.
          name: 'App front end',
          items: ['Volunteer applications', 'Availability', 'Email automations', 'Autocomplete'],
        },
        {
          // 'Applicant vetting' added 2026-08-03 (Jon direct: "the team vets them"). It's also
          // already claimed in the approved blurb — "recruit proven volunteers from past events,
          // vet new applicants quickly" — so the card was listing less than the copy beside it.
          // Leads the list because it's the step that comes first in the manager's actual work:
          // vet, then plan the workforce, then check people in.
          // 'Scoring' REMOVED the same day, Jon's call — beside 'Applicant vetting' it reads as
          // scoring the applicants rather than scoring the competition. The word does two jobs in
          // this domain and the card can't disambiguate it. The feature still exists; if it comes
          // back it needs a name that says which scoring it means (e.g. 'Competition scoring').
          name: 'Admin backend',
          items: ['Applicant vetting', 'Workforce planning', 'Check-in', 'Camp census'],
        },
      ],
    },
    blurb:
      'Every inquiry was an email, every application a spreadsheet line item, and every year the team started from scratch. I fixed that — designing and shipping a live platform for the Chelan paragliding competitions, end to end and solo, using an AI multi-agent workflow to do the work of a team. It cut the back-and-forth by more than 80% and gave the organizers better tools and process: recruit proven volunteers from past events, vet new applicants quickly, and keep every event’s data in a reusable repository that carries forward to the next comp. Less administration, more time on the work that actually matters. Built with React and TypeScript on a Supabase backend, hosted on Cloudflare.',
    // Metrics supplied by Jon 2026-07-30. The 80% is the same figure the blurb already carries
    // ("cut the back-and-forth by more than 80%") — stated here as the conservative floor, so
    // the two never drift apart; if one is ever revised, revise both. Two metrics on purpose:
    // there is no third real number, and inventing one to balance the row is exactly the thing
    // this block must never do.
    metrics: [
      { icon: 'trend-down', value: '−80%', label: 'Admin overhead' },
      { icon: 'clock', value: '~3 weeks', label: 'Idea to production' },
    ],
    link: { href: 'https://chelancomps.org', label: 'Visit the live site' },
    // ⚠️ PLACEHOLDER, added 2026-07-28 to show the block's design. NOBODY SAID THIS. Jon
    // filled in the real name, role and org on 2026-08-04, so the brackets that used to do
    // half the work are gone: `placeholder: true` and the visible "not a real quote" flag it
    // prints are now the ONLY things standing between this block and a fabricated quote
    // attributed to a named person. Do not delete that line until Austin's actual words are in
    // the `quote` field — deleting it is the single step that says "Austin said this."
    // To make it live: replace `quote` with what he said, add his `photo`, then remove
    // `placeholder`.
    // TODO(jon): ask a Chelan organizer for a real one. The concrete before/after is the ask —
    //   what their week looked like running the comp on email vs. now. Get it in writing, and
    //   confirm they're happy to be named with their photo on a public site.
    testimonial: {
      placeholder: true,
      quote:
        'Placeholder — a real quote goes here. Two or three sentences in their own words, concrete about what changed: what running the comp used to cost them, and what they do with that time now. Roughly this long reads well in the block.',
      name: 'Austin',
      role: 'Owner / organizer',
      org: 'Northwest Paragliding',
      photo: null, // → /images/work/chelancomps/<name>.{webp,jpg}, square crop
    },
  },
  {
    // Facts sourced from Jon's own LinkedIn draft (.temp/linkedin-refresh.md) + Jon direct
    // (2026-07-23): wrote and self-published the memoir; planned and ran a THREE-city book tour
    // (the LinkedIn draft says "four-city" — Jon corrected it to three; fix that draft too).
    // Imprint/site is Unflappable Press. Nothing beyond that is claimed here.
    // Distribution confirmed by Jon (2026-07-23): Amazon KDP + IngramSpark.
    // 2026-07-28: Jon's copy (.temp/project-copy.md) landed and answered two of the old TODOs —
    // the three cities (Olympia, Seattle, Issaquah) and the timeline (10 months concept → on-sale).
    // Second paragraph is his, verbatim; it's the only place on the site the work talks about what
    // it cost him, so it stays in his words. Don't rewrite it.
    // TODO(jon): the remaining production specifics you want to claim — cover designer, typesetting,
    //   ISBN, and your editor's name if you want it here. Name only the parts you actually did.
    // TODO(jon): turnout or copies sold, if you want a number public — fine to leave out entirely.
    // TODO(jon): launch date, so the detail page can carry a "published <month year>" line.
    slug: 'unflappable',
    title: 'Unflappable: Soaring Beyond a Diagnosis',
    // Scene-setter, added 2026-08-02 (Jon's photo, `.temp/photo-import/reading-browsers.png`).
    // 640×640 PNG → the .webp/.jpg pair via Astro's bundled sharp. EXIF and XMP stripped in
    // conversion: the original carried iPhone 16 Plus / iOS 18.6.2 / a device UUID and a capture
    // timestamp, but NO GPS — checked before publishing.
    // ⚠️ SQUARE, unlike the chelancomps hero (1.95:1). This is what forced the .hero rule to cap
    //   by HEIGHT (max 30rem) instead of width — at a flat 56rem this would have been 896px of
    //   photo above the first line of copy. It renders ~30rem (480px) wide.
    // ⚠️ 640px native against a 480px slot leaves almost nothing for a retina screen.
    //   TODO(jon): a higher-res original if the phone still has it — this is a 2× crop away from
    //   being crisp, and it's the most human photo on the site.
    // TODO(jon): approve the alt text — drafted, not yours yet.
    // Caption is Jon's, supplied 2026-08-04 — which also settles the venue the old TODO was
    // holding out on: Browsers Bookshop, one of the three tour cities in the blurb. The
    // filename was evidence, not a citation; this is the citation.
    // Only mechanical changes: the comma before the state and a closing period, matching the
    // site's other captions.
    hero: {
      src: '/images/work/unflappable/reading-browsers',
      width: 640,
      height: 640,
      alt: 'A seated audience, seen from the back of the room, listening to Jonathan read aloud from Unflappable in a small bookshop lined with shelves.',
      caption: 'Reading at Browsers Bookshop, Olympia, WA.',
    },
    category: 'written work',
    role: 'Author / self-publisher',
    status: 'Published',
    teaser:
      'Ten months from concept to on-sale, then a book tour: Olympia, Seattle, Issaquah.',
    blurb: [
      "I wrote a memoir about rare disease, paragliding, and finding healing. Ten months from concept to on-sale. I’d been building a solid writing practice for over a year, and then realized that the 2,000 word essays I’d become comfortable producing could take the shape of something else with the right planning and focus. I knew I would need outside help, that I wasn’t an expert at writing books, and that memoir in particular required specialized editorial guidance. Luckily, I found an amazing editor and learned a great deal about the process along the way.",
      'The process of writing this book changed me—I proved to myself in a very personal and tangible way that I can build complex and durable things, that I thrive when a project is daunting, requiring more effort than you can conceptualize before the work begins. And now we are going to direct that same energy into your problems, projects, and ideas.',
    ],
    // Metrics supplied by Jon 2026-07-30. Order is his call and it is NOT the blurb's sequence:
    // the milestone leads, because "first book" is what he wants read before the reader starts
    // pricing the effort in months. The two duration/place numbers follow in narrative order.
    // Both already appear in the copy ("Ten months from concept to on-sale", the three named
    // cities), so revise them together.
    // ⚠️ The medal glyph reads as an AWARD. "1st" alone next to it would look like a ranking or a
    // prize — the label is doing the work of saying it's a milestone, a first book written and
    // published. Don't shorten it to "First book" or swap in "#1". See the note in
    // ProjectMetrics.astro. Flagged to Jon 2026-07-30; his call to keep the medal.
    metrics: [
      { icon: 'medal', value: '1st', label: 'Book, written and published' },
      { icon: 'clock', value: '10 months', label: 'Idea to publication' },
      { icon: 'pin', value: '3 cities', label: 'Book tour' },
    ],
    // ✅ REAL as of 2026-08-04 — Bailey's own words, supplied by Jon, replacing the placeholder
    // that stood here for a few hours. `placeholder: false` is correct BECAUSE the quote is
    // genuine. Never flip it to tidy a page up: the flag disappearing is this site saying "a
    // named person said this." Role is Jon's wording, same day.
    //
    // ⚠️ `photo` is an OBJECT and `src` is EXTENSIONLESS. The component renders a <picture> and
    // appends `.webp` for the <source> and `.jpg` for the <img>, so BOTH files must exist or the
    // fallback 404s. A bare string here silently renders `undefined.webp` — it type-checks
    // nowhere and the build stays green, so it only shows up as a broken avatar on the page.
    //
    // The headshot was converted from Jon's PNG with the sharp inside astro: square crop
    // anchored to the TOP (a centre crop shaved the crown of her head), 224px = 4× the 56px the
    // avatar renders at, EXIF and XMP stripped, and the jpeg flattened onto the page ground
    // because the source carried an alpha channel. The original lives in .temp/photo-import/,
    // out of public/, so it isn't deployed.
    // TODO(jon): approve the photo's alt text — it describes a real person and it's drafted,
    //   not hers. Also confirm she's happy with "Award-winning writer and book coach" as the
    //   public credit, and with her photo appearing on the site at all.
    testimonial: {
      placeholder: false,
      quote:
        'Jonathan is the ideal person to partner with on a creative project. As a client, he was dedicated to writing the best possible book and getting the support he needed to bring his memoir to fruition. He was always thoroughly prepared for our meetings, arriving with insightful questions about the feedback and a willingness to engage with my suggestions so that he could tell his story effectively. Jonathan is a thoughtful problem-solver with the ability to get to the heart of things quickly and the skill to turn a vision into reality.',
      name: 'Bailey',
      role: 'Award-winning writer and book coach',
      photo: {
        src: '/images/work/unflappable/bailey-headshot',
        width: 224,
        height: 224,
        alt: 'Bailey, smiling, in round tortoiseshell glasses and a floral shirt.',
      },
    },
    // Two pills. The contact one goes first because his last line turns to the reader
    // ("direct that same energy into your problems, projects, and ideas"). The book
    // cross-link stays as a ghost — CLAUDE.md: the two sites link to each other on purpose.
    // Label picked by Jon 2026-07-28, replacing a draft that called back to the blurb.
    link: [
      { href: '/contact/', label: 'Work with me' },
      { href: 'https://unflappable.press', label: 'Read more at unflappable.press' },
    ],
  },
  {
    // Added 2026-07-23 (Jon's call). Framing: "builder, taken literally" — the hands-on craft,
    // sitting alongside the kitchen remodel.
    //
    // PROMOTED to a detail page 2026-07-28: Jon supplied three real paragraphs
    // (.temp/project-copy.md), which answered the hardware/what-it-does TODOs this card was
    // waiting on. Body is his copy, near-verbatim — only cleanup: the markdown emphasis on
    // "the cloud" became quotes (blurbs render as plain text), and Unraid is named in the third
    // paragraph, carried over from the previous draft.
    //
    // Photos landed 2026-07-28 (gallery below) — the chassis mid-build and the finished rack.
    // Not a before/after, so the pair overrides the column labels.
    // TODO(jon): the named services that earn their keep on the box, if you want them listed.
    slug: 'server-closet',
    title: 'LAN & Server Closet',
    category: 'physical spaces · systems',
    role: 'Design / build',
    status: null,
    teaser:
      '8TB, an Intel i5, and a few hundred feet of ethernet — the box the rest of this work runs on.',
    blurb: [
      // Segment paragraph (2026-08-03, Jon): "components" links out to the PC Part Picker
      // build list — the receipts for "deep research went into curating" them, one click from
      // the sentence that makes the claim. Jon's words are untouched; only the shape changed.
      [
        '8TB of storage. A mix of solid state and spinning drives, powered by an Intel i5 chip perfectly suited for this application. Deep research went into curating the ',
        {
          href: 'https://pcpartpicker.com/user/djhandyman/saved/#view=gfqWBm',
          text: 'components',
        },
        '—I wanted to build this box once and not worry about upgrading it for a long time.',
      ],
      'The closet also serves as the central hub for all the home networking equipment, which is now rack mounted, and the termination point for hundreds of feet of ethernet wire run throughout the home. It’s important to understand physical infrastructure, and the fact that so much of our digital lives is stored in the cloud abstracts this away most of the time. But really, “the cloud” is a box like this one, scaled to a degree that’s difficult to understand.',
      'Functionally, having an on-premise server is great for development work. I’m not bogging down any of my daily driver machines, and I can control how the network traffic flows, adding additional safeguards. I can spin up VMs and containers on Unraid whenever I need and quickly build test environments and sandboxes. Having this machine wired into the network has been a big unlock for my workflow—if you want to build something similar, let’s talk.',
    ],
    // Metrics supplied by Jon 2026-07-30 — and the first set where only ONE card is a number.
    // "8TB" is a spec; the other two are capabilities. That's a deliberate extension of the
    // block (see ProjectMetrics.astro): a short noun is allowed where it's a checkable fact,
    // which "dev cloud" and "automation" are — both are described in the blurb below. The line
    // that must not be crossed is a card that asserts quality rather than fact.
    // TWO cards, not three (Jon, 2026-07-30). A third for home automation + network security was
    // built and cut: every candidate value for it was either a quality claim ("Hardened") or a
    // restatement of the card beside it ("Self-hosted" vs "Private, on-prem"). That story is
    // already in the blurb's second and third paragraphs, told better and with room to breathe.
    // Two cards also render wide, which suits values this long.
    metrics: [
      { icon: 'drive', value: '8TB', label: 'Storage' },
      { icon: 'layers', value: 'Dev cloud', label: 'Private, on-prem' },
    ],
    link: { href: '/contact/', label: 'Start building together' },
    gallery: [
      {
        caption: 'The chassis on the bench, and the rack it ended up in.',
        shots: [
          {
            label: 'Mid-build',
            img: {
              src: '/images/work/server-closet/server-being-built',
              width: 640,
              height: 640,
              alt: 'The server mid-build: an open 4U rackmount chassis on a wire shelf, showing the motherboard, a large tower CPU cooler, three case fans, the power supply, empty drive bays, and the PCIe slot covers.',
            },
          },
          {
            label: 'Installed',
            img: {
              src: '/images/work/server-closet/complete-rack',
              width: 480,
              height: 640,
              alt: 'The finished rack: a patch panel behind a cable manager at the top, a 24-port switch wired with purple patch cables, a firewall appliance, a rack PDU, a vented shelf, and the completed 4U server at the bottom.',
            },
          },
        ],
      },
    ],
  },
  {
    // Bathroom before/after landed 2026-07-27; the SketchUp render joined them 2026-07-29 and
    // sits BETWEEN them (Jon's call), which is the honest order — it's the design the finished
    // room was built from, and it's the only thing on this page that evidences the "from SketchUp
    // design through" claim in the blurb.
    //
    // The gallery is split into headed groups the same day: this page covers two rooms, and one
    // undifferentiated run of photos read as though the kitchen didn't exist. The Kitchen group
    // is deliberately a `note`, not photos — see below.
    // 2026-08-04: body is Jon's, from .temp/writing/project-copy.md — the full bathroom narrative
    // replacing the lone opening paragraph that had been standing in for it. Four paragraphs, his
    // words. Two mechanical fixes only: "a sliding glass good went in" → "door", and
    // "floor to ceiling tile" hyphenated as the compound modifier it is.
    // The closing line and the pill are DRAFTED, not Jon's — his copy ended on the kitchen tease
    // with nothing turning to the reader, and he asked for a CTA (2026-08-04). Chosen from four
    // options because it returns to the point HE already made two paragraphs up — the footprint
    // being off the table was a "helpful constraint to work within" — so the invitation lands the
    // page's own argument instead of importing a new one. Replace it with your own sentence
    // whenever you'd rather; the pill label is the only part that must not echo it.
    //
    // Label had to be new: "Let's chat", "Let's talk", "Let's connect", "Get in touch", "Work with
    // me" and "Start building together" are all taken by other projects, and identical CTAs across
    // pages are the tell that nobody wrote them.
    //
    // TODO(jon): scope/budget line.
    // TODO(jon): the kitchen copy, which is the thing actually missing — and the body now points
    //   straight at it: "the next remodel project would be orders of magnitude larger" is the last
    //   line a reader sees before a section that says "coming soon". That's a good setup while the
    //   kitchen is days away and a conspicuous one if it sits for months.
    //   .temp/photo-import/ still has two kitchen BEFORE shots (kitchen-before1/2.jpeg) and no
    //   after; they stay out until there's an after to pair them with. Half a before/after is
    //   worse than none, and that rule doesn't change just because the section now has a heading.
    slug: 'kitchen-bath-remodel',
    title: 'Kitchen & Bathroom Remodel',
    category: 'physical spaces',
    role: 'Design / planning / project management',
    status: null,
    teaser:
      'Full design-through-build of a kitchen and bath remodel — “builder,” taken literally.',
    blurb: [
      'Our sole bathroom was an artifact from another era, 30-some square feet, with a cutout in the countertop to allow the door to swing in. When I bought the house, I knew it would need remodeling and updating, but it took several years before the design concept came together.',
      'The bathtub had to go, that was the first thing. Changing the overall footprint of the space was off the table because of the added complexity and cost, which added a helpful constraint to work within. The outcome I wanted was a space that felt larger than it actually was, that was light and open and pleasant to be in, with modern fixtures set against wood grain and organic surfaces.',
      'The tub came out and a sliding glass door went in, floor-to-ceiling tile behind it. The orientation of the shower head was flipped to allow for any future repair or modification. And in order to give the appearance of roominess, the vanity and toilet would float off of the floor.',
      'From design through construction to a finished room, the bathroom remodel was involved, but the scope (like the size of the room) was fairly small. The next remodel project would be orders of magnitude larger.',
      'Every project has something you can’t move. Finding it, then designing around it, is most of the work.',
    ],
    link: { href: '/contact/', label: 'Tell me about your project' },
    gallery: [
      {
        heading: 'Bathroom',
        caption: 'The room I started with, the model I designed it from, and where it ended up.',
        shots: [
          {
            label: 'Before',
            img: {
              src: '/images/work/kitchen-bath-remodel/bathroom-before',
              width: 324,
              height: 242,
              alt: 'The bathroom before the remodel: a laminate-top vanity with a drop-in sink, wall cabinet over the toilet, and a cluttered counter.',
            },
          },
          {
            label: 'Design',
            img: {
              src: '/images/work/kitchen-bath-remodel/bathroom-3d',
              width: 600,
              height: 518,
              alt: 'The SketchUp model of the bathroom: an untextured 3D massing view looking down into the room with the near walls cut away, showing the shower with its fixed and handheld heads, a glass divider, the vanity and sink against the far wall, and the toilet.',
            },
          },
          {
            label: 'After',
            img: {
              src: '/images/work/kitchen-bath-remodel/bathroom-after',
              width: 886,
              height: 886,
              alt: 'The bathroom after the remodel: a live-edge wood vanity top with a vessel sink and wall-mounted faucet, a tiled glass shower, and new flooring.',
            },
          },
        ],
      },
      {
        heading: 'Kitchen',
        note: 'Kitchen details coming soon.',
      },
    ],
  },
  {
    // Outcome drafted from Jon's facts (2026-07-23): 4 promotions along the progression
    // (2 associate PM → PM, 2 BSA → BSA II); every product staffer now has a clear advancement
    // path — unique in the org. (Note: this card's "teams"/people-mgmt framing is a P3 post-pivot
    // decision — see .temp/CONTENT-TODO.md §6.)
    //
    // 2026-07-29: body replaced with Jon's own copy (.temp/project-copy.md) — his "supporting and
    // innovating" framing and the two inventories under it, verbatim, using the list-block shape
    // documented above. Twelve years is his claim to make and it reads better as a list than as
    // the paragraph Claude had drafted.
    // ⚠️ The closing paragraph is NOT his — it's the four-promotions outcome carried over from the
    // previous blurb, kept because it's the only citable result on this project and his copy
    // doesn't include it. It sits last so it lands as the payoff to the progression-framework
    // bullet. Delete it if you'd rather the page be your words end to end.
    slug: 'wahbe-org-development',
    title: 'WAHBE — Org Development',
    category: 'teams',
    role: 'Org development, innovation',
    status: null,
    teaser:
      'Built the progression and coaching that advanced four people and gave the team a real ladder.',
    // Scene-setter, added 2026-08-03. Jon running sound at the WAHBE all-staff picnic.
    // Source `.temp/photo-import/wahbe-picnic-me-audio.jpg`, 5392×3592 (exactly 1.5, same as
    // the Cloudbase hero), downsized to 1440 = 2× the 720px slot. EXIF/XMP/IPTC stripped; no
    // GPS in the original.
    //
    // CHOSEN OVER TWO OTHERS, and the reasoning matters if this is ever revisited:
    //   · A posed shot of the twelve-person product team fits the topic far better — this page
    //     is about developing that team. It was rejected anyway: eleven identifiable state
    //     employees, several with legible name tags, who agreed to a company picnic photo and
    //     not to a personal consulting site. On a page describing work Jon did developing them,
    //     publishing their faces makes a claim about THEM, not just him. Don't quietly promote
    //     it later without asking all eleven.
    //   · A candid of Jon and one colleague: weaker editorially and still costs a second
    //     person's consent.
    // This one has nobody else identifiable, and it does the job a hero is for — a hero is a
    // SCENE-SETTER, not evidence. The blurb proves the org-development work; the photo just
    // shows the senior PM crouched over a mixer running sound at the staff picnic, which is the
    // same unglamorous-competence note the server closet hits.
    //
    // Photographer: Nicholas Aaseby, a coworker — Jon confirmed 2026-08-03 that using these is
    // fine and asked for the credit below. The `credit` field renders a linked "Photo: …" line
    // after the caption. ⚠️ The Cloudbase hero has an uncredited photographer (David Gamez) and
    // could carry the same field if Jon wants it.
    // Caption is Jon's, supplied 2026-08-03. Only mechanical change: sentence case and a
    //   closing period, matching the site's other captions.
    // TODO(jon): approve the alt text — drafted, not yours. It describes the picture for
    //   someone who can't see it and deliberately doesn't mention playlists: the caption
    //   beneath already says that, and alt shouldn't repeat what's about to be read aloud.
    hero: {
      src: '/images/work/wahbe-org-development/picnic-sound',
      width: 1440,
      height: 959,
      alt: 'A man in a T-shirt leans over a folding table outdoors, connecting cables to a small audio mixer beside a laptop, with a microphone stand in front of him and a parking lot behind.',
      caption: 'Building playlists at the company picnic.',
      credit: { label: 'Aaseby Photography', href: 'https://aasebyphotography.smugmug.com/' },
    },
    blurb: [
      'It’s difficult to distill 12 years at an organization down to a few paragraphs, but the work I’m most proud of follows two key themes: supporting and innovating.',
      {
        heading: 'I supported',
        items: [
          'A high performing scrum team as the Product Owner',
          'An up-and-coming analyst in need of mentorship (who I helped train and promote into one of the best)',
          'Various executives with reports, pitch decks, and business cases',
          'A team of peers in the delivery management space',
          'My team of 7 Business Analysts',
        ],
      },
      {
        heading: 'I innovated by',
        items: [
          'Bringing to life a comprehensive carrier data audit standard that didn’t exist before',
          'Building a maturity matrix for product team roles',
          'Authoring and collaborating on a career progression framework',
          'Creating the authoritative system integration diagram',
          'Experimenting with running a business architecture practice within the organization',
        ],
      },
      'Four people have since advanced along that progression — two associate PMs to PM, two BSAs to BSA II — every member of the product staff has a clear, concrete view of what advancement takes.',
    ],
    link: null,
    // ⚠️ PLACEHOLDER, added 2026-08-04 while Jon writes to former colleagues. NOBODY SAID THIS.
    // `name` and `role` are BRACKETED because he hasn't said who yet, and no name has been
    // guessed from the blurb. Fill them in from the reply, first name only (see CLAUDE.md),
    // and keep `placeholder: true` until the real words land.
    // ⚠️ This page has NO CTA (`link: null`), so the quote is the last thing on it. That makes
    // it the note the page closes on — worth weighting when choosing whose it is.
    // TODO(jon): the strongest version of this one is the analyst you mentored and promoted —
    //   the blurb already claims that, and a quote from them turns your claim into their
    //   account of it. An exec or a scrum-team peer speaks to the delivery work instead.
    //   Either way: this is a named ex-colleague at a public agency, so get written
    //   confirmation they're happy to be quoted and named on a public site.
    testimonial: {
      placeholder: true,
      quote:
        'Placeholder — a real quote goes here. Two or three sentences in their own words, concrete about what changed: what the team or the career path looked like before this work existed, and what it made possible for them. Roughly this long reads well in the block.',
      name: '[Name]',
      role: '[Role]',
      photo: null, // → /images/work/wahbe-org-development/<name>.{webp,jpg}, square crop
    },
  },
  {
    // REWRITTEN 2026-08-03 from Jon's own narrative (.temp/cbf-project-narrative.md). The two
    // body paragraphs are his, verbatim except for mechanical fixes: `--` → a spaced em dash to
    // match every other blurb on the site, and a trailing space removed. Nothing was reworded.
    //
    // ROLE: "Director / builder" — Jon's call, 2026-08-03. It was "Board member / builder";
    //   his narrative states the promotion plainly (joined 2024, "took over as Director in early
    //   2026"), so the first half moved up. The "/ builder" half stays because he does the coding
    //   and design himself — and the page proves it: the "getting our hands dirty" card is a CRM,
    //   a document repository, a website and branding. Director alone would read as governance
    //   and undersell the half he actually built. Don't tidy it to just the title.
    // ⚠️ TEASER CHANGED. The old one said "new website, CRM, and board governance" as delivered
    //   facts, but the site doesn't go live until 8/7 — see the milestones note below. The new
    //   one leads with the turnaround rather than the artefacts, so nothing is claimed early.
    //   TODO(jon): approve it; it's new microcopy.
    // TODO(jon): still open — name the CRM product and the site platform once you're happy to.
    //   "Open source" is the only part confirmed, so it's the only part that ships.
    slug: 'cloudbase-foundation',
    title: 'Cloudbase Foundation',
    category: 'organizations',
    role: 'Director / builder',
    status: null,
    teaser:
      'A nonprofit in decline: process debt, technology debt, and no clear direction. I took it over and started rebuilding.',
    // Scene-setter, added 2026-08-03 (Jon's photo: him and Jacob, a CBF board member, at a
    // launch site in Honduras — an area where the foundation has active projects). Source
    // `.temp/photo-import/jonathan-jacob-honduras.jpg`, 6000×4000, DOWNSIZED to 1440 wide and
    // converted to the .webp/.jpg pair with the sharp that already ships inside Astro.
    // 1440 is exactly 2× the rendered slot — this is a 1.5:1 frame, so the slot resolves to
    // min(56rem, 30rem × 1.5) = 720 CSS px. Crisp on retina without shipping a 4MB original.
    // The first version of this file was a 640px PNG and was upscaled; Jon replaced it with
    // the full-size original on 2026-08-03. If the ratio ever changes, redo the slot maths.
    // EXIF, XMP and IPTC verified STRIPPED on both outputs; the original carried **no GPS** in
    // either metadata block (checked before conversion, per the standing rule about photos).
    // ⚠️ SHOT MARCH 2026 — Jon, 2026-08-03. The file's EXIF says 2026:07:20; that's an export
    //   timestamp, not the capture date. If a caption ever carries a date, it's March.
    // PHOTOGRAPHER: the original's XMP carries `dc:rights: David Gamez`. **Jon confirmed
    //   2026-08-03 he has permission to use these photos.** Recorded here rather than left as
    //   an open question, the same way the Red Williamson headshot was settled on 2026-08-02 —
    //   a retained copyright stamp is normal practice and says nothing about the right to use.
    //   If Jon ever decides to credit David by name, that goes in the visible caption; the
    //   metadata is stripped on the way out, so nobody would see it there.
    // Caption is Jon's, supplied 2026-08-03 — naming Jacob Kalmakoff is his call. It does the
    //   job the photo couldn't do alone: without it a reader has to guess why two men are
    //   crouching in a field, and with it the shot becomes evidence that the board is real and
    //   the work happens on the ground.
    //   Only mechanical change: a closing period, to match the site's other four captions.
    // TODO(jon): approve the alt text — drafted, not yours. It describes the picture for
    //   someone who can't see it; it is not a caption and shouldn't sell. Note it deliberately
    //   does NOT name anyone: the caption directly beneath already does, and a screen-reader
    //   user would otherwise hear the names twice.
    hero: {
      src: '/images/work/cloudbase-foundation/launch-honduras',
      width: 1440,
      height: 960,
      alt: 'Two men crouch on a grassy launch site beside a spread-out yellow paraglider wing, with packed gear around them, a group of people watching from a covered shelter behind, and a hazy mountain valley beyond.',
      caption:
        'Jonathan with Cloudbase board member Jacob Kalmakoff at the annual Festival de Parapente in Honduras.',
    },
    blurb: [
      'Cloudbase Foundation began as a way for pilots to give back to communities near free flight sites around the world. When I joined in 2024, it was clear the nonprofit was in a state of decline: process and technology debt, coupled with a lack of vision for where the organization was going. I took over as Director in early 2026 and set out to build an engaged board, make investments in tech modernization, and prepare to grow, while mapping out a plan to make it happen.',
      'My work with Cloudbase is illustrative of how I manage and lead — by finding the right people, getting aligned on purpose and direction, and then getting our hands dirty. Cloudbase is still in the stabilization period, but we are very close to the next phase: engaging with existing and potential donors, and bringing more visibility to our mission.',
    ],
    // The milestones, as an exhibit AFTER the body — the narrative explains an organization in
    // decline, and these are the proof. That's why `placement: 'after'`: on chelancomps the
    // scope is the headline and the block leads, here the prose has to set the cards up.
    //
    // The three groups are JON'S OWN SENTENCE from the paragraph directly above — "finding the
    // right people, getting aligned on purpose and direction, and then getting our hands dirty."
    // Every one of his nine bullets falls into one of the three. That's the whole reason this
    // works: a flat list of nine reads as busywork, three groups read as someone who knows what
    // an organization is made of and rebuilt all three layers. The cards prove the line above
    // them rather than repeating it.
    // TODO(jon): approve the three card labels — they're derived from your sentence, not lifted
    //   word for word, so they're new microcopy and yours to bless.
    //
    // ⚠️ THE SITE IS NOT LIVE YET. "Live 8/7" is stated on the pill and Jon's own lead-in says
    //   "already passed, or will be very soon" — together those keep the claim honest. A
    //   portfolio page listing an unlaunched site as delivered is exactly the kind of thing a
    //   board member could read and wince at. TODO(jon): on 8/7, confirm it shipped and drop the
    //   date from the pill. If it slips, move the date — don't quietly delete it.
    // NOTE: his sub-bullet about the site being CRM-integrated ("so we can build relationships
    //   with potential donors and grant recipients, while keeping our work out of email") did not
    //   fit a pill and is not on the page anywhere. It's a good detail — TODO(jon): a third body
    //   paragraph if you want it.
    components: {
      placement: 'after',
      heading: 'Milestones',
      lead: 'Some major milestones we’ve already passed, or will be very soon:',
      items: [
        {
          name: 'Finding the right people',
          items: ['3 new board members', 'Weekly working sessions'],
        },
        {
          name: 'Purpose and direction',
          items: ['New Theory of Change', '2026 technology roadmap'],
        },
        {
          name: 'Getting our hands dirty',
          items: [
            'Open-source CRM',
            'Document repository',
            'Site + branding — live 8/7',
            'Branded merchandise',
          ],
        },
      ],
    },
    // Metrics supplied by Jon 2026-07-30.
    // "3 · NEW board members" — Jon confirmed 2026-07-30 these are people brought ONTO the board,
    //   not the board's total size. The word "new" is load-bearing; dropping it silently converts
    //   a recruiting number into a claim about how big the board is.
    // ⚠️ The CRM card deliberately does NOT name the product: TODO(jon) above is still open on
    //   which CRM it is. "Open source" is the part Jon confirmed, so that's the part that ships.
    // 2026-08-03: the "Mission / Updated" card is GONE, replaced by the meeting cadence. It was
    //   already flagged here as the weakest of the three — a deliverable, not a measurement,
    //   asking the reader to take an update on faith. The cadence is the opposite: it's the
    //   sharpest number in Jon's whole narrative and it was buried in a parenthetical
    //   ("6 board meetings a year wasn't nearly enough"). Roughly 6 a year → ~50 is the most
    //   concrete evidence of "an engaged board" on the page.
    //   `clock` reuses an existing glyph rather than adding a calendar one for a single card.
    // 2026-08-03, Jon: "was 6 a year" REMOVED from the cadence label. It implied weekly
    //   replaced the six formal meetings, which is a claim about how a real board operates and
    //   isn't one he wanted to make. "Weekly / Working sessions" states only what's true.
    // 2026-08-03, Jon: two cards added — the technology roadmap and the Theory of Change.
    // Ordered to mirror the milestones block above: people, then direction, then what got
    //   built. The row reads as the same story in numbers.
    // ⚠️ Four of these five also appear as pills in the milestones block. That's the same
    //   relationship Bello Modo has between its metrics and its blurb — the numbers row is the
    //   measured view, the cards are the inventory — but it's a lot heavier here. If the page
    //   ever feels repetitive, this row is what to thin, not the cards.
    // ⚠️ These two new ones are deliverables rather than measurements, which is exactly why the
    //   old "Mission / Updated" card was cut. They're Jon's call and they're checkable facts
    //   (both exist), so the block's "short noun where that's a checkable fact" rule covers
    //   them — but the line to hold is the same as ever: never a card that asserts quality.
    metrics: [
      { icon: 'users', value: '3', label: 'New board members' },
      { icon: 'clock', value: 'Weekly', label: 'Working sessions' },
      { icon: 'compass', value: 'Theory of Change', label: 'Mission & strategy' },
      { icon: 'pin', value: '2026', label: 'Technology roadmap' },
      { icon: 'code', value: 'Open source', label: 'CRM' },
    ],
    // The question sits between the milestones and the metrics; the pill that answers it is
    // `link`, at the foot of the page. Jon's split, 2026-08-03 — and it's the better shape:
    // the question aims the numbers ("is this you?"), the numbers are the proof, and the ask
    // comes after the proof, which is the order the rest of the site uses.
    // Deliberately NO `prompt.link` here — the box is question-only. A pill inside it plus a
    // pill sixty pixels below would be the same ask twice.
    // TODO(jon): approve the wording — you said "something like this", so it's yours to settle.
    prompt: {
      text: 'Is your organization in need of a jump start?',
    },
    // The answer to the question in the .ask box above the metrics. Contact pill rather than
    // an outbound link — there is nothing public to point at, and the page's job is the ask.
    // Label is Jon's ("let's connect", 2026-08-03) and clears the pill rule: it doesn't echo
    // the question it answers.
    link: { href: '/contact/', label: 'Let’s connect' },
    // ⚠️ PLACEHOLDER, added 2026-08-04 while Jon writes to the board. NOBODY SAID THIS.
    // `name` and `role` are BRACKETED because he hasn't said who yet — the way chelancomps
    // started before Austin's details arrived. Nothing here is invented: no name has been
    // guessed from the photo credit, the blurb, or anywhere else. Fill them in from the reply,
    // first name only (see CLAUDE.md), and keep `placeholder: true` until the real words land.
    // `org` stays unset — it would repeat the page's own title.
    // TODO(jon): the ask is the before/after. This page claims an organization in decline that
    //   turned around, so the quote that earns it comes from someone who saw both states —
    //   what the board and the operation looked like when you stepped in, and what's different
    //   now. Confirm in writing they're happy to be named on a public site.
    testimonial: {
      placeholder: false,
      quote:
        'Jonathan is one of those unique people who are so good at listening and observing, that he builds consensus without you even noticing. With Cloudbase, he managed to inspire volunteer action, educate the board on how to be a better board, all whilst not losing sight of the mission, vision and altruistic goals of the organization.',
      name: 'Jacob',
      role: 'Board member',
      photo: null, // → /images/work/cloudbase-foundation/<name>.{webp,jpg}, square crop
    },
  },
  {
    // Promoted to a detail page 2026-07-27: the before/after photos are the "more to show"
    // this card was waiting on. The photos also settle the old open question — it's a combined
    // safety/interpretive panel (spectator rules + pilot site rules + landing-area map), and
    // the new one is installed in the park.
    // TODO(jon): approve the teaser below — it's new copy, written to match the photos.
    // TODO(jon): year the replacement went in, if you want it in the blurb.
    slug: 'chelan-falls-signage',
    title: 'Chelan Falls Park Signage',
    category: 'physical spaces · design',
    role: 'Designer',
    status: null,
    teaser:
      'Redesigned a sun-bleached, unreadable park sign — now installed at the Chelan Falls landing zone.',
    blurb:
      'Print-ready signage designed in Illustrator for a paragliding and hang-gliding site managed in Chelan.',
    link: null,
    gallery: [
      {
        caption: 'The old panel and its replacement, in place at the park.',
        shots: [
          {
            label: 'Before',
            img: {
              src: '/images/work/chelan-falls-signage/sign-before',
              width: 1024,
              height: 768,
              alt: 'The original "Soaring at Chelan" panel, sun-bleached to the point that most of the text and photographs have faded out.',
            },
          },
          {
            label: 'After',
            img: {
              src: '/images/work/chelan-falls-signage/sign-after',
              width: 1182,
              height: 665,
              alt: 'The replacement panel installed at the park: a dark teal layout with spectator safety rules, a pilot site overview, an aerial map with the landing area marked, and QR codes for full site info.',
            },
          },
        ],
      },
    ],
  },
  {
    // Added 2026-07-24 (Jon): swapped in for the old "WAHBE — AI Enablement" card. Facts sourced
    // from Jon's LinkedIn (.temp/linkedin-refresh.md:136): "IT Consultant (2021–2022) — stood up
    // branding, web presence, and SaaS systems/integrations end to end for a start-up medical
    // practice."
    //
    // PROMOTED to a detail page 2026-07-29: Jon's own copy (.temp/project-copy.md) landed and
    // answered all three TODOs this card was held back on — what it was (in-home monoclonal
    // antibody treatment during COVID), the compliance angle (HIPAA, real and his to claim), and
    // the outcome (idea → operating business in under three months; wound down early 2022 when
    // the variant shifted and the treatment stopped working). Body is his, near-verbatim.
    // Cleanup only: "for helping building" → "for help building", his double hyphens → em-dashes
    // kept CLOSED UP the way he types them (matching the book and server-closet paragraphs; the
    // spaced-vs-closed question is still open in PLANNING.md), and the markdown emphasis on "fast"
    // dropped rather than converted — blurbs are plain text, and quoting the word would read as
    // sarcasm where he meant urgency.
    // ⚠️ One word changed meaning: his draft said appointments were scheduled for "in-house"
    // treatment; the paragraph above it describes the business as in-HOME treatment, so it reads
    // as a typo and is set to "in-home".
    // TODO(jon): confirm that in-home fix, and approve the teaser — it's new copy.
    // TODO(jon): the SaaS tools by name, if you're willing to name them. "A complete set of
    //   tightly integrated, HIPAA-compliant SaaS tools" is the last soft spot in an otherwise
    //   concrete story — this is the one card where naming the stack would carry real weight.
    slug: 'ascension-medicines',
    title: 'Ascension Medicines',
    category: 'software · systems · design',
    role: 'Consultant / builder',
    status: null,
    teaser:
      'Two physicians, one idea, and a closing window — a HIPAA-compliant clinic stack built nights and weekends, live in under three months.',
    blurb: [
      'During the COVID-19 pandemic, two Atlanta physicians had an idea: offer in-home monoclonal antibody treatments to patients who would benefit from them. At the time, the meds were highly effective for the most common strain and no one else was offering this sort of service. They came to me for help building and operationalizing their entire tech stack, and it needed to be put together fast.',
      'Over nights and weekends, I spun up a complete set of tightly integrated, HIPAA-compliant SaaS tools that enabled these doctors to connect with potential patients, screen them, and schedule appointments for in-home treatment. The entire business went from an idea in the founder’s mind to reality in less than three months.',
      'Ultimately, when the variant changed shape in early 2022, the treatment was no longer effective and the business was shuttered—but it’s more than likely that several lives were saved, and the time invested into this venture benefitted everyone involved.',
      'What’s your next big idea?',
    ],
    logo: {
      src: '/images/work/ascension-medicines/ascension-logo',
      width: 560,
      height: 463,
      alt: 'The Ascension Medicines logo: an oval badge with a blue outer ring carrying “Ascension” arced across the top and “Medicines” across the bottom in white capitals, around a white centre holding a stylised letter A drawn as a mountain peak.',
      note: 'I designed the branding, this mark included, based on a sketch one of the founders drew in pencil',
    },
    // His last line turns to the reader, so the pill is the ask. Label kept plain and distinct
    // from the other contact pills per the rule above.
    link: { href: '/contact/', label: 'Get in touch' },
    // ⚠️ PLACEHOLDER, added 2026-08-04 at Jon's request to show the block on this page.
    // NOBODY SAID THIS. Jon supplied the attribution — "Timothy, Physician", one of the two
    // Atlanta founders the blurb opens with — so `placeholder: true` and the visible "not a
    // real quote" flag it prints are the ONLY things standing between this block and a
    // fabricated quote attributed to a named, identifiable doctor. Do not delete that line
    // until Timothy's actual words are in the `quote` field. Deleting it is the single step
    // that says "Timothy said this."
    // `org` is deliberately unset: the org is the page's own title, and "Physician, Ascension
    // Medicines" under a heading that already says Ascension Medicines just repeats itself.
    // To make it live: replace `quote` with what he said, add his `photo`, then remove
    // `placeholder`.
    // TODO(jon): get the real one, and note this is a harder ask than the Chelan quote — the
    //   business shut down in 2022 and he's a named physician being quoted about a COVID-era
    //   treatment venture. Worth asking whether he wants a surname, and confirming in writing
    //   that he's happy to be named on a public site before this goes live.
    testimonial: {
      placeholder: true,
      // Puts the CTA ABOVE this block — the only page that inverts the default (Jon,
      // 2026-08-04). While the quote is a placeholder it shouldn't stand between the reader
      // and the ask; delete this line when Timothy's real words land and the page returns to
      // the site-wide order with no other change.
      placement: 'after-cta',
      quote:
        'Placeholder — a real quote goes here. Two or three sentences in his own words, concrete about what changed: what standing up the practice looked like from the clinical side, and what it meant to be seeing patients in under three months. Roughly this long reads well in the block.',
      name: 'Timothy',
      role: 'Physician',
      photo: null, // → /images/work/ascension-medicines/<name>.{webp,jpg}, square crop
    },
  },
  {
    // Added 2026-07-27 so the flow diagram could be reviewed in its real context. Claude's
    // "Frame 3" draft was REPLACED 2026-07-28 by Jon's own copy (.temp/project-copy.md) —
    // this is the one project where the writing IS the product, so it's his words now.
    // Cleanup only: typos (WSIWYG, "and AI helper", "inquires"), and the four-dependency
    // count folded into his "small digital footprint" clause because it's the hardest
    // evidence on the page. .temp/CASE-STUDY-OPTIONS.md is now history, not a live decision.
    //
    // ⚠️ ACCURACY FIX in paragraph two: Jon's draft said the AI helper summarizes and
    // categorizes *contact form* submissions. It doesn't — `functions/api/contact.js` is
    // email-only. Claude triage runs on the Build Assessment intake, and Claude tagging on
    // the feedback widget. Reworded to "form submissions", which is true and doesn't name
    // the assessment while it's still an unapproved private beta.
    // TODO(jon): confirm that reword, or name the assessment outright once it launches.
    //
    // Position: LAST on purpose. `index.astro` features projects.slice(0, 4), so it stays off
    // the homepage until Jon decides the position-4 question. Move it up to feature it.
    //
    // TODO(jon): the `source` link below assumes the repo goes public. It 404s until it does —
    //   set source to null if you launch this card before flipping the repo.
    slug: 'this-site',
    title: 'This Website',
    category: 'software · systems',
    role: 'Designer / builder',
    status: null,
    teaser:
      'Open source tooling, free-tier platforms, and four dependencies — a pattern I’ve used repeatedly.',
    blurb: [
      'I’ve built a few of these before, back in the days when WYSIWYG editors were used to build websites. This time around I’ve zoomed in to showcase what I can build, covering primarily the span of the last three years. The site is well designed (imho), has a small digital footprint — four dependencies, no framework, no CSS library, no CMS — and costs almost nothing to host and run. jahutton.build represents a pattern I’ve used repeatedly: open source tooling plus free tier platforms plus thoughtful planning and design.',
      'There are also some less obvious features that make life easier for me, which is another build principle: make something that works for you, that’s designed around the way you like to work, that’s enjoyable to use, that you can improve over time as your needs change. For this site, I’ve incorporated an AI helper in the background, invoked for a specific purpose—summarizing and categorizing form submissions—so I’m not sifting through dozens of emails, something I really dislike doing. Eventually, I might extend this functionality, adding triggers and automations that fire for certain types of inquiries.',
      'There are infinite possibilities, but starting with a simple framework that you can extend over time is often the best way. What would you like to start building together?',
    ],
    // Metrics MEASURED from this repo 2026-07-30, not quoted from the README — and this is the
    // one page where a skeptical reader can check every card against the source link at the
    // bottom in about a minute. Re-measure them when the stack changes; a stale card here is
    // worse than no card, because the evidence to disprove it ships alongside it.
    //   4 — `dependencies` in package.json (also the README badge and this teaser's hook).
    //   0 — trackers/cookies: the only grep hit across dist/ was /privacy/ using the word
    //       "analytics" to say there isn't any.
    //   0 — external .js in dist/. ⚠️ NOT "no JavaScript": the forms ship ~3KB of INLINE script
    //       per page. "Bundles" is the exact and defensible word — do not shorten this label to
    //       "JavaScript", which would be false and trivially disproven by View Source.
    // Cost was considered and cut: Jon pays for Resend, spread across several projects, so it's
    // near zero but not zero. "Almost nothing" in the blurb is the honest version; a "$0" card
    // would not survive being asked about.
    metrics: [
      { icon: 'box', value: '4', label: 'Dependencies' },
      { icon: 'eye-off', value: '0', label: 'Trackers or cookies' },
      { icon: 'code', value: '0', label: 'JavaScript bundles' },
    ],
    // The repo moves to the bottom of the page as a quiet source link, so the pill is the ask.
    link: { href: '/contact/', label: 'Let’s talk' },
    source: { href: 'https://github.com/djhandyman/jahutton-build', label: 'View on GitHub' },
    diagram: true,
  },
];

// The separate "Writing" card was removed 2026-07-23 (Jon): it and the Unflappable project card
// both led with the book, which read as duplication. The book now stands as a full project above
// (slug: 'unflappable'); Substack keeps its own placement — the footer subscribe block on every
// page, plus the embed on /about. Nothing was lost, so there's no `writing` export anymore.
// (Also dropped with it: the "second book — in progress" entry — an idea, not a project.)
