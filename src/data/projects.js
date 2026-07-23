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
    // TODO(jon): scope/budget line + before-and-after photos. Photos slot into the detail page.
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
    // Teaser-only (no slug): thin content for now — no detail page until there's more to show.
    // TODO(jon): confirm sign type (wayfinding / safety / interpretive) and whether it was installed.
    title: 'Chelan Falls Park Signage',
    category: 'physical spaces · design',
    role: 'Designer',
    status: null,
    teaser: null,
    blurb:
      'Print-ready signage designed in Illustrator for a paragliding and hang-gliding site managed by Chelan County PUD — bringing order and clarity to a launch used by the flying community.',
    link: null,
  },
  {
    // Teaser-only (no slug): "in progress", no hard outcome yet — no detail page until there is.
    // TODO(jon): keep only what you personally drove; name specific tools (e.g. Copilot Studio, MCP) ONLY where you want to claim them.
    title: 'WAHBE — AI Enablement',
    category: 'systems',
    role: 'AI enablement (contributor)',
    status: 'In progress',
    teaser: null,
    blurb:
      "I've been making the case — and doing the design thinking — for putting developer-grade AI coding tools in the hands of business systems analysts, so non-engineers can build. The thinking and the argument are mine; institutional adoption is a longer road through public-sector process.",
    link: null,
  },
];

// Writing is its own card on the Work page.
export const writing = {
  title: 'Writing',
  category: 'written work',
  items: [
    {
      label: 'Unflappable: Soaring Beyond a Diagnosis',
      note: 'Rare-disease memoir (ITAC; paragliding).',
      href: 'https://unflappable.press',
    },
    {
      label: 'Second book — in progress',
      note: 'Patient & provider stories in head & neck reconstructive surgery.',
      href: 'https://unflappable.press',
    },
    {
      label: 'Substack',
      note: 'Essays & thought leadership.',
      href: 'https://substack.com/@jahutton',
    },
  ],
};
