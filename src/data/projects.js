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
    // TODO(jon): stack — name the source→target e-commerce platforms for the 20k-SKU migration, to weave in as evidence.
    // Outcome drafted from Jon's facts (2026-07-23): modernized mobile-forward site; cut costs +
    // grew profitability; simpler inventory; freed the new owner to focus on service/purchasing/
    // fulfillment. Deliberately NOT claiming revenue growth (net grew, gross didn't — ad-spend/market).
    title: 'Bello Modo',
    category: 'organizations',
    role: 'Operator',
    blurb:
      'When this specialty e-commerce business changed hands, I stepped in at the operator level — not just advising — to steady it through the transition and re-platform its 20,000-plus SKUs onto a modern, mobile-forward store, delivered on schedule. Costs came down, profitability went up, and inventory management got dramatically simpler — leaving the new owner with a site that just worked, free to focus on what she does best: customer service, purchasing, and fulfillment.',
    href: null,
    status: null,
  },
  {
    // TODO(jon): stack — confirm the build to weave in. Detected externally: Cloudflare-hosted, Vite-built SPA
    //   (single hashed /assets/index-*.js module); framework not identifiable from outside. You know the truth.
    // Outcome drafted from Jon's facts (2026-07-23): reframed from vague "flying community platform"
    // to its real job — volunteer/logistics coordination for the comps; cut >80% of email back-and-forth;
    // recruit proven volunteers, vet new applicants, reusable data repository. "80%" is Jon's figure.
    title: 'chelancomps.org',
    category: 'software · systems',
    role: 'Solo builder',
    blurb:
      'Volunteer coordination for the Chelan paragliding competitions used to run on scattered email — applications, logistics, guidelines, all handled by hand. I designed and shipped a live platform for it, end to end and solo, using an AI multi-agent workflow to do the work of a team. It cut that back-and-forth by more than 80%, lets organizers recruit proven volunteers from past events and vet new applicants quickly, and keeps every event’s data in a reusable repository that carries forward to the next comp.',
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
    // Outcome drafted from Jon's facts (2026-07-23): 4 promotions along the progression
    // (2 associate PM → PM, 2 BSA → BSA II); every product staffer now has a clear advancement
    // path — unique in the org. (Note: this card's "teams"/people-mgmt framing is a P3 post-pivot
    // decision — see .temp/CONTENT-TODO.md §6.)
    title: 'WAHBE — Org Development',
    category: 'teams',
    role: 'Org development',
    blurb:
      'A growing team inside a state agency was missing its scaffolding. I built it: an agile maturity assessment, a BSA-to-PM progression and competency matrix, and the coaching to go with it — turning vague "grow the team" pressure into a structure people could actually navigate. Four people have since advanced along it — two associate PMs to PM, two BSAs to BSA II — and for the first time every member of the product staff has a clear, concrete view of what advancement takes, which is still unique across the organization.',
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
