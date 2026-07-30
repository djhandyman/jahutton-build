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
// TODO(jon): `note` on each layer — one short line, YOUR words, saying what that layer
//   means for someone who has to live with the site (speed / cost / ease of change).
//   Deliberately left null: this exhibit exists to answer a client's question, and the
//   answer has to sound like you. Nothing renders where a note is missing.
// TODO(jon): `heading` and `lead` for the figure, same reason. The page's "Under the
//   hood" <h2> carries it until then.
export const stack = {
  heading: null,
  lead: null,

  layers: [
    {
      name: 'Content + code',
      items: ['Copy as data', 'Astro components', 'Public git repo'],
      note: null,
    },
    {
      name: 'Build + deploy',
      items: ['Astro static build', 'Cloudflare Pages, from git'],
      note: null,
    },
    {
      name: 'The live site',
      items: ['Static files on a CDN', 'Self-hosted fonts', 'No analytics, no cookies'],
      note: null,
    },
    {
      name: 'Forms only',
      items: ['Turnstile at the edge', 'Three Pages Functions', 'Resend · Supabase · Claude'],
      note: null,
    },
  ],
};
