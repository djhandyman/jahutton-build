// Portfolio projects (single-page cards).
//
// ⚠️ DRAFT copy — reframed around the through-line "I turn organizational
// ambiguity into finished, working structure" (systems-level change agent).
// Each blurb follows: the mess I found → what I built → what changed.
// Jonathan reviews/approves each before launch. The `// TODO(jon):` comments
// mark where a real, citable outcome/metric still needs to be added — they live
// in the source (not the visible blurb) so nothing unfinished renders on the page.
// Never invent metrics or outcomes. Order leads with the most showable work.

export const projects = [
  {
    // TODO(jon): add the headline outcome to lead with (revenue held/grew, what the new owner got).
    // TODO(jon): stack — name the source→target e-commerce platforms for the 20k-SKU migration, to weave in as evidence.
    title: 'Bello Modo',
    category: 'organizations',
    role: 'Operator',
    blurb:
      'When this specialty e-commerce business changed hands, I stepped in at the operator level — not just advising — to steady it through the transition and lead a complex platform migration of more than 20,000 SKUs, delivered on schedule.',
    href: null,
    status: null,
  },
  {
    // TODO(jon): one line on what it does for pilots, plus any usage/adoption to cite.
    // TODO(jon): stack — confirm the build to weave in. Detected externally: Cloudflare-hosted, Vite-built SPA
    //   (single hashed /assets/index-*.js module); framework not identifiable from outside. You know the truth.
    title: 'chelancomps.org',
    category: 'software · systems',
    role: 'Solo builder',
    blurb:
      'A live platform for the Chelan flying community, designed and shipped end to end by one person — using an AI multi-agent workflow to do the work of a team.',
    href: 'https://chelancomps.org',
    status: 'Live',
  },
  {
    // TODO(jon): scope/budget line + before-and-after photos.
    title: 'Kitchen & Bathroom Remodel',
    category: 'physical spaces',
    role: 'Design / planning / project management',
    blurb:
      'Full-scope design, planning, and project management of a kitchen and bathroom remodel — from SketchUp design through materials, sequencing, and hands-on execution. Proof that "builder" is literal, not a metaphor.',
    href: null,
    status: null,
  },
  {
    // TODO(jon): the outcome to cite (promotions, retention, capability gains).
    title: 'WAHBE — Org Development',
    category: 'teams',
    role: 'Org development',
    blurb:
      'A growing team inside a state agency was missing its scaffolding. I built it: an agile maturity assessment, a BSA-to-PM progression and competency matrix, and the coaching to go with it — turning vague "grow the team" pressure into a structure people could actually navigate.',
    href: null,
    status: null,
  },
  {
    // TODO(jon): the mission in one line, and where it stands now (members / revenue / programs).
    // TODO(jon): stack — name the CRM you integrated and the site platform, to weave in as evidence.
    title: 'Cloudbase Foundation',
    category: 'organizations',
    role: 'Board member / builder',
    blurb:
      'Helped bring a dormant nonprofit back to life — standing up a new website, integrating a CRM, and rebuilding board governance so the organization could operate and grow again.',
    href: null,
    status: null,
  },
  // Groundcrew — parked/removed 2026-07-23 (no bandwidth to develop it further for now).
  //   Preserved for easy restore in .temp/PLANNING.md → "Parked / someday". Drop the card
  //   object back here (order-agnostic) if it becomes real.
  {
    // TODO(jon): confirm sign type (wayfinding / safety / interpretive) and whether it was installed.
    title: 'Chelan Falls Park Signage',
    category: 'physical spaces · design',
    role: 'Designer',
    blurb:
      'Print-ready signage designed in Illustrator for a paragliding and hang-gliding site managed by Chelan County PUD — bringing order and clarity to a launch used by the flying community.',
    href: null,
    status: null,
  },
  {
    // TODO(jon): keep only what you personally drove; name specific tools (e.g. Copilot Studio, MCP) ONLY where you want to claim them.
    title: 'WAHBE — AI Enablement',
    category: 'systems',
    role: 'AI enablement (contributor)',
    blurb:
      "I've been making the case — and doing the design thinking — for putting developer-grade AI coding tools in the hands of business systems analysts, so non-engineers can build. The thinking and the argument are mine; institutional adoption is a longer road through public-sector process.",
    href: null,
    status: 'In progress',
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
