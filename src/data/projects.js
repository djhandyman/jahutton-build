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
//   blurb  — the full paragraph (detail-page body; or the card body when teaser-only)
//   link   — optional external CTA shown on the detail page, { href, label }
//   gallery — optional photos on the detail page (slugged projects only).
//     An array of before/after pairs: { caption, before: <img>, after: <img> }, where
//     <img> is { src, width, height, alt } and `src` is the EXTENSIONLESS public path —
//     the page appends .webp for the <source> and .jpg for the <img>, matching the
//     headshot/hero convention. width/height are the real pixel dims (they reserve
//     layout space so the page doesn't jump). Assets live in public/images/work/<slug>/.

export const projects = [
  {
    // Outcome + stack (2026-07-23): platform journey WooCommerce → BigCommerce → Shopify. Custom
    // bulk-lot catalog app verified from the private repo (djhandyman/bellomodo-catalog): an
    // Eleventy/Nunjucks static, searchable (Pagefind) product catalog built from Shopify data,
    // images on Cloudflare R2. Cut costs + grew profitability; simpler inventory. NOT claiming
    // revenue growth (net grew, gross didn't — ad-spend/market).
    // TODO(jon): both repos are private — make bellomodo-catalog public if you ever want to link it.
    slug: 'bello-modo',
    title: 'Bello Modo',
    category: 'organizations',
    role: 'Operator',
    status: null,
    teaser:
      'Stepped in as operator through an ownership sale — re-platformed a 20,000-SKU store and grew profitability.',
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
    slug: 'chelancomps',
    title: 'chelancomps.org',
    category: 'software · systems',
    role: 'Solo builder',
    status: 'Live',
    teaser:
      'A solo-built platform that cut competition volunteer coordination’s email load by more than 80%.',
    blurb:
      'Volunteer coordination for the Chelan paragliding competitions used to run on scattered email — applications, logistics, guidelines, all handled by hand. I designed and shipped a live platform for it, end to end and solo, using an AI multi-agent workflow to do the work of a team. It cut that back-and-forth by more than 80%, lets organizers recruit proven volunteers from past events and vet new applicants quickly, and keeps every event’s data in a reusable repository that carries forward to the next comp. Built with React and TypeScript on a Supabase backend, hosted on Cloudflare.',
    link: { href: 'https://chelancomps.org', label: 'Visit the live site' },
  },
  {
    // Facts sourced from Jon's own LinkedIn draft (.temp/linkedin-refresh.md) + Jon direct
    // (2026-07-23): wrote and self-published the memoir; planned and ran a THREE-city book tour
    // (the LinkedIn draft says "four-city" — Jon corrected it to three; fix that draft too).
    // Imprint/site is Unflappable Press. Nothing beyond that is claimed here.
    // Distribution confirmed by Jon (2026-07-23): Amazon KDP + IngramSpark.
    // TODO(jon): the remaining production specifics you want to claim — editor, cover designer,
    //   typesetting, ISBN. Name only the parts you actually did yourself.
    // TODO(jon): which three cities, and audience/turnout if you want a number. Copies sold too,
    //   if you want it public — leave it out entirely if you'd rather not.
    // TODO(jon): launch date, so the detail page can carry a "published <month year>" line.
    slug: 'unflappable',
    title: 'Unflappable: Soaring Beyond a Diagnosis',
    category: 'written work',
    role: 'Author / self-publisher',
    status: 'Published',
    teaser:
      'Wrote a memoir, published it myself, and took it on a three-city tour — the whole thing, end to end.',
    blurb:
      "A memoir about rare disease, paragliding, and finding healing when a cure isn't on the table. I wrote it, and then I published it — which turned out to be its own build. Getting a book out yourself means running every piece of it: the manuscript through editing and production, the cover and interior, distribution through Amazon KDP and IngramSpark, the launch, and then the part most writers skip, which is actually selling it. I planned and ran a three-city tour to do that. It's the same instinct as the rest of the work here — start from a blank sheet, and don't stop at the draft.",
    link: { href: 'https://unflappable.press', label: 'Read more at unflappable.press' },
  },
  {
    // Added 2026-07-23 (Jon's call). Framing chosen: "builder, taken literally" — the hands-on
    // craft, sitting alongside the kitchen remodel, NOT the "infrastructure that unblocked the
    // work" angle. Teaser-only for now (no slug) per the Chelan Falls precedent: thin content
    // gets a card, not a detail page. Promote it by adding a slug once the TODOs below land —
    // a server closet photographs well, and the detail page has a photo slot waiting.
    //
    // ⚠️ Everything in this blurb is from Jon verbatim: an Unraid build, the LAN, a server
    // closet, and that it accelerated his ability to build. NOTHING else is claimed — no rack,
    // no drive counts, no structured cabling, no cooling. Do not add specifics he hasn't given.
    //
    // TODO(jon): the hardware, in your own concrete register — drives + usable capacity, the
    //   box itself, how the closet is actually wired (drops? patch panel? dedicated circuit?
    //   cooling?). This card lives or dies on real numbers, the way "20,000+ SKUs" does.
    // TODO(jon): what actually runs on it, named. Which services earn their keep?
    // TODO(jon): what it replaced, and the speed difference — you said it "really accelerated"
    //   your ability to build. What did going from idea to running thing cost you before vs now?
    // TODO(jon): photos of the closet + the build in progress. Best argument on the whole page
    //   that "builder" is literal — and they'd unlock the detail page.
    title: 'LAN & Server Closet',
    category: 'physical spaces · systems',
    role: 'Design / build',
    status: null,
    teaser: null,
    blurb:
      'I built the server closet the rest of this work runs on — an Unraid box and the network around it, designed and put together myself. It is the least visible thing on this page and one of the most useful: somewhere to run and keep my own infrastructure instead of renting all of it, which is a good part of why shipping solo is practical at all.',
    link: null,
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
];

// The separate "Writing" card was removed 2026-07-23 (Jon): it and the Unflappable project card
// both led with the book, which read as duplication. The book now stands as a full project above
// (slug: 'unflappable'); Substack keeps its own placement — the footer subscribe block on every
// page, plus the embed on /about. Nothing was lost, so there's no `writing` export anymore.
// (Also dropped with it: the "second book — in progress" entry — an idea, not a project.)
