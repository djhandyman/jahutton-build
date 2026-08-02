// Data for the "how this site is built" case study — the stack diagram on /work/this-site
// (src/components/StackDiagram.astro renders it; the component is presentation-only).
//
// The request-flow diagram that used to live here was removed 2026-07-30 when StackDiagram
// replaced it as that page's exhibit. It answered "what happens on submit", which is narrower
// than what a reader of that page is asking. Recoverable from git history if the
// three-Functions/opposite-failure-policies story ever earns its own surface again.

// ─────────────────────────────────────────────────────────────────────────────
// The stack, top to bottom — added 2026-07-30 (Jon), replacing the request-flow
// diagram on /work/this-site as that page's exhibit.
//
// Two audiences, one artifact: the BOXES are for a reader evaluating whether Jon
// can build (they're specific and checkable against the repo linked at the bottom
// of the page), and the NOTES are for a client who wants to know what it's like to
// own the thing. Without the notes this is a wiring diagram, which is exactly the
// failure mode Jon rejected on 2026-07-30.
//
// EVERY BOX IS CHECKED AGAINST THE SOURCE — verified 2026-07-30:
//   no adapter in astro.config.mjs (static output) · @fontsource in BaseLayout
//   (fonts self-hosted, no CDN) · functions/api/{contact,assessment-intake,feedback}.js
//   · api.resend.com, supabase.co, api.anthropic.com, challenges.cloudflare.com are
//   the only outbound hosts in functions/ · no analytics anywhere in dist/.
//
// NOTES LANDED 2026-08-02 — all four are Jon's words. The shape is his: an all-caps
// benefit label, an em dash, then one plain sentence. They answer "what is this like to
// OWN?" (change / speed / cost / safety), which is deliberately a different question from
// the one the boxes answer ("can this guy build?"). Keep them flat — they read as true
// because they don't sell. Don't add a fifth idea to a line or restyle the labels.
//
// ⚠️ The "Forms only" note says Claude sorts "what comes in" and NOT "every submission",
//   because contact.js is Resend-only — Claude triages the assessment intake and tags
//   feedback, and touches the contact form nowhere. Don't tighten it into the false claim;
//   it's the same error already flagged in projects.js on the "This Website" card.
// ⚠️ That note also claims spam is stopped at the edge. TRUE ONLY IF the real Turnstile
//   keys are live: PUBLIC_TURNSTILE_SITE_KEY defaults to Cloudflare's always-pass TEST key,
//   and the Functions skip verification entirely when TURNSTILE_SECRET_KEY is unset.
//   TODO(jon): confirm both are set to the real widget's keys in Cloudflare Pages, or this
//   is the one uncheckable claim on an exhibit whose whole premise is that they're checkable.
//
// TODO(jon): `heading` and `lead` for the figure — still open, still null. The page's
//   "Under the hood" <h2> carries it until then, and they may not be needed at all.
export const stack = {
  heading: null,
  lead: null,

  layers: [
    {
      name: 'Content + code',
      items: ['Copy as data', 'Astro components', 'Public git repo'],
      note: 'SIMPLE TO UPDATE — copy text lives on a separate layer from the code that renders it.',
    },
    {
      name: 'Build + deploy',
      items: ['Astro static build', 'Cloudflare Pages, from git'],
      note: 'LIGHTNING FAST — builds are automated and take a fraction of a second.',
    },
    {
      name: 'The live site',
      items: ['Static files on a CDN', 'Self-hosted fonts', 'No analytics, no cookies'],
      note: 'LOW COST — since everything is static, there is minimal infrastructure to maintain or pay for.',
    },
    {
      name: 'Forms only',
      items: ['Turnstile at the edge', 'Three Pages Functions', 'Resend · Supabase · Claude'],
      note: 'SECURE AND SMART — the one place code runs, with spam stopped at the edge and Claude sorting what comes in.',
    },
  ],
};
