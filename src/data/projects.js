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
//     a single paragraph, or an ARRAY OF STRINGS for multi-paragraph copy — both the card
//     and the detail page normalize it and render one <p> per entry. Plain text only:
//     it goes through Astro's escaping, so no markdown/HTML (use “quotes”, not _italics_).
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
//   gallery — optional photos on the detail page (slugged projects only).
//     An array of before/after pairs: { caption, before: <img>, after: <img> }, where
//     <img> is { src, width, height, alt } and `src` is the EXTENSIONLESS public path —
//     the page appends .webp for the <source> and .jpg for the <img>, matching the
//     headshot/hero convention. width/height are the real pixel dims (they reserve
//     layout space so the page doesn't jump). Assets live in public/images/work/<slug>/.
//   diagram — optional `true` on slugged projects: renders the request-flow exhibit
//     (src/components/FlowDiagram.astro, data in src/data/colophon.js). Specific to this
//     site's own case study — it is not a general "architecture diagram" slot.

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
    role: 'Operator',
    status: null,
    teaser:
      'From acquisition, stabilization, and tech stack migration to increased profitability. I worked closely with a solo operator through complex challenges.',
    blurb:
      'When this specialty e-commerce business changed hands, I stepped in at the operator level — not just advising — to steady it through the transition and re-platform its 20,000-plus SKUs, migrating the store from WooCommerce to BigCommerce and ultimately Shopify, delivered on schedule. Costs came down, profitability went up, and inventory got dramatically simpler — helped by a custom, searchable catalog I built from the Shopify data to handle the bulk-lot inventory details — leaving the new owner with a site that just worked, free to focus on what she does best: customer service, purchasing, and fulfillment.',
    link: null, // store + catalog repos are private; nothing public to link yet
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
    blurb:
      'Every inquiry was an email, every application a spreadsheet line item, and every year the team started from scratch. I fixed that — designing and shipping a live platform for the Chelan paragliding competitions, end to end and solo, using an AI multi-agent workflow to do the work of a team. It cut the back-and-forth by more than 80% and gave the organizers better tools and process: recruit proven volunteers from past events, vet new applicants quickly, and keep every event’s data in a reusable repository that carries forward to the next comp. Less administration, more time on the work that actually matters. Built with React and TypeScript on a Supabase backend, hosted on Cloudflare.',
    link: { href: 'https://chelancomps.org', label: 'Visit the live site' },
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
    category: 'written work',
    role: 'Author / self-publisher',
    status: 'Published',
    teaser:
      'Ten months from concept to on-sale, then a book tour: Olympia, Seattle, Issaquah.',
    blurb: [
      "A memoir about rare disease, paragliding, and finding healing when a cure isn't on the table. Ten months from concept to on-sale. I wrote it, and then I published it, which turned out to be its own build: the manuscript through editing and production, working closely with an amazing editor and learning a lot along the way; the cover and the interior; distribution through Amazon KDP and IngramSpark; the launch; and then the part most writers skip, which is actually selling it. That part was a book tour — Olympia, Seattle, Issaquah.",
      'The process of writing this book changed me—I proved to myself in a very personal and tangible way that I can build complex and durable things, that I thrive when a project is daunting, requiring more effort than you can conceptualize before the work begins. And now we are going to direct that same energy into your problems, projects, and ideas.',
    ],
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
    // TODO(jon): the named services that earn their keep on the box, if you want them listed.
    // TODO(jon): photos of the closet + the build in progress. Best argument on the whole page
    //   that "builder" is literal, and the detail page now has the gallery slot waiting.
    slug: 'server-closet',
    title: 'LAN & Server Closet',
    category: 'physical spaces · systems',
    role: 'Design / build',
    status: null,
    teaser:
      '8TB, an Intel i5, and a few hundred feet of ethernet — the box the rest of this work runs on.',
    blurb: [
      '8TB of storage. A mix of solid state and spinning drives, powered by an Intel i5 chip perfectly suited for this application. Deep research went into curating the components—I wanted to build this box once and not worry about upgrading it for a long time.',
      'The closet also serves as the central hub for all the home networking equipment, which is now rack mounted, and the termination point for hundreds of feet of ethernet wire run throughout the home. It’s important to understand physical infrastructure, and the fact that so much of our digital lives is stored in the cloud abstracts this away most of the time. But really, “the cloud” is a box like this one, scaled to a degree that’s difficult to understand.',
      'Functionally, having an on-premise server is great for development work. I’m not bogging down any of my daily driver machines, and I can control how the network traffic flows, adding additional safeguards. I can spin up VMs and containers on Unraid whenever I need and quickly build test environments and sandboxes. Having this machine wired into the network has been a big unlock for my workflow—if you want to build something similar, let’s talk.',
    ],
    link: { href: '/contact/', label: 'Start building together' },
  },
  {
    // Bathroom before/after landed 2026-07-27 (gallery below).
    // TODO(jon): scope/budget line.
    // TODO(jon): kitchen before/after — .temp/photo-import/ has two kitchen BEFORE shots
    //   (kitchen-before1/2.jpeg) but no after, so the kitchen pair is held back until you
    //   supply one. Half a before/after is worse than none.
    slug: 'kitchen-bath-remodel',
    title: 'Kitchen & Bathroom Remodel',
    category: 'physical spaces',
    role: 'Design / planning / project management',
    status: null,
    teaser:
      'Full design-through-build of a kitchen and bath remodel — “builder,” taken literally.',
    blurb:
      'Full-scope design, planning, and project management of a kitchen and bathroom remodel — from SketchUp design through materials, sequencing, and hands-on execution. Proof that "builder" is literal, not a metaphor.',
    link: null,
    gallery: [
      {
        caption: 'The bathroom, before and after.',
        before: {
          src: '/images/work/kitchen-bath-remodel/bathroom-before',
          width: 324,
          height: 242,
          alt: 'The bathroom before the remodel: a laminate-top vanity with a drop-in sink, wall cabinet over the toilet, and a cluttered counter.',
        },
        after: {
          src: '/images/work/kitchen-bath-remodel/bathroom-after',
          width: 886,
          height: 886,
          alt: 'The bathroom after the remodel: a live-edge wood vanity top with a vessel sink and wall-mounted faucet, a tiled glass shower, and new flooring.',
        },
      },
    ],
  },
  {
    // Outcome drafted from Jon's facts (2026-07-23): 4 promotions along the progression
    // (2 associate PM → PM, 2 BSA → BSA II); every product staffer now has a clear advancement
    // path — unique in the org. (Note: this card's "teams"/people-mgmt framing is a P3 post-pivot
    // decision — see .temp/CONTENT-TODO.md §6.)
    slug: 'wahbe-org-development',
    title: 'WAHBE — Org Development',
    category: 'teams',
    role: 'Org development',
    status: null,
    teaser:
      'Built the progression and coaching that advanced four people and gave the team a real ladder.',
    blurb:
      'A growing team inside a public sector org was missing its scaffolding. I built it: an agile maturity assessment, a BSA-to-PM progression and competency matrix, and the coaching to go with it — turning vague "grow the team" pressure into a structure people could actually navigate. Four people have since advanced along it — two associate PMs to PM, two BSAs to BSA II — and for the first time every member of the product staff has a clear, concrete view of what advancement takes, which is still unique across the organization.',
    link: null,
  },
  {
    // TODO(jon): the mission in one line, and where it stands now (members / revenue / programs).
    // TODO(jon): stack — name the CRM you integrated and the site platform, to weave in as evidence.
    //   (Can be pulled from the repo like the others once you point me at it.)
    slug: 'cloudbase-foundation',
    title: 'Cloudbase Foundation',
    category: 'organizations',
    role: 'Board member / builder',
    status: null,
    teaser:
      'Helped bring a dormant nonprofit back to life — new website, CRM, and board governance.',
    blurb:
      'Helped bring a dormant nonprofit back to life — standing up a new website, integrating a CRM, and rebuilding board governance so the organization could operate and grow again.',
    link: null,
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
      'Print-ready signage designed in Illustrator for a paragliding and hang-gliding site managed by Chelan County PUD — bringing order and clarity to a launch used by the flying community.',
    link: null,
    gallery: [
      {
        caption: 'The old panel and its replacement, in place at the park.',
        before: {
          src: '/images/work/chelan-falls-signage/sign-before',
          width: 1024,
          height: 768,
          alt: 'The original "Soaring at Chelan" panel, sun-bleached to the point that most of the text and photographs have faded out.',
        },
        after: {
          src: '/images/work/chelan-falls-signage/sign-after',
          width: 1182,
          height: 665,
          alt: 'The replacement panel installed at the park: a dark teal layout with spectator safety rules, a pilot site overview, an aerial map with the landing area marked, and QR codes for full site info.',
        },
      },
    ],
  },
  {
    // Added 2026-07-24 (Jon): swapped in for the old "WAHBE — AI Enablement" card. Facts sourced
    // from Jon's LinkedIn (.temp/linkedin-refresh.md:136): "IT Consultant (2021–2022) — stood up
    // branding, web presence, and SaaS systems/integrations end to end for a start-up medical
    // practice." Blurb writes ONLY around that; nothing beyond it is claimed. Teaser-only for now
    // (thin facts), per the Chelan Falls / LAN-closet precedent — promote to a detail page by adding
    // a `slug` once the TODOs below land.
    //
    // TODO(jon): the actual stack, in concrete nouns — practice-management/EHR, scheduling, patient
    //   intake, billing, telehealth, the site platform — and the key integrations (what talks to
    //   what). This is the meat the card lives on, the way "20,000+ SKUs" carries Bello Modo.
    // TODO(jon): the healthcare-compliance angle, if it's real — was HIPAA a constraint you designed
    //   around? That's the distinctive part of this one; name it if you can stand behind it.
    // TODO(jon): outcome — did the practice open/operate on what you built? Anything citable at all.
    //   The moment there's a real outcome + the stack above, add a slug and this becomes a detail page.
    title: 'Ascension Medicines',
    category: 'software · systems',
    role: 'Consultant / builder',
    status: null,
    teaser: null,
    blurb:
      'A start-up medical practice needed everything a working clinic runs on stood up before it could see patients — and none of it existed yet. I stood it up end to end: the branding and web presence out front, and the SaaS systems and integrations behind them. From a blank sheet to the technology backbone a new practice needed to open and operate.',
    link: null,
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
