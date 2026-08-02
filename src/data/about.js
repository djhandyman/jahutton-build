// The About page. Jon's copy from .temp/about-me.md (2026-07-31), near-verbatim — see the
// edit notes at the bottom of this comment for every change made to it.
//
// This file exists because about.astro used to hard-code its copy inline, which contradicted
// both CLAUDE.md and the README's claim that every word on the site lives in src/data/. It
// doesn't any more.
//
// PARAGRAPH SHAPE. A paragraph is a string, or an ARRAY of segments so a sentence can carry
// emphasis or a link without markdown (copy goes through Astro's escaping, so there is no
// markdown pipeline and adding one for two bold sentences would be silly):
//   'plain text'              → a text run
//   { strong: 'text' }        → <strong>, for the two sentences Jon bolded in his draft
//   { href: '/work', text: '…' } → a link; `rel="noopener"` is added for external hrefs
//   { em: 'text' }            → <em>, for the book title
//
// ⚠️ EDITS TO JON'S DRAFT — all mechanical, none change meaning. Revert any you disagree with:
//   · "funiture" → "furniture"
//   · "is in entirely new era, once where" → "is in an entirely new era, one where"
//   · "Sketchup" → "SketchUp" (the product's own capitalisation, and what the bathroom
//     gallery copy already uses — see CLAUDE.md)
//   · "my Work page" became an actual link to /work
//   · "--" became a real em dash. His draft uses BOTH spacings — " -- " in the first
//     paragraph, closed-up "tools--electrical" in the stack intro — so each instance was
//     preserved as he set it rather than normalised. That inconsistency is the open
//     em-dash convention item in .temp/PLANNING.md; settling it is a one-line sweep here.
import { site } from './site.js';

export const about = {
  intro: [
    "I’m Jonathan and I’ve spent the past 10+ years building durable things in digital and physical space — standards, systems and tools, furniture and fixtures. I have a broad range of problem solving skills and techniques that I’ve employed to help small businesses, non-profits, and teams within public sector orgs do better work, reduce friction, and focus attention where it’s most needed.",
    [
      'I’m a solo builder but my approach is collaborative. I apply a deep sense of curiosity to new problems and try to hold ideas for potential solutions lightly, so they can be vetted and tested, ensuring they meet the underlying need before we commit to them. ',
      { strong: 'The way we build something really useful is in phases, with quick feedback and frequent experimentation.' },
    ],
    [
      'We are living in an unprecedented time. Technology, and software specifically, is in an entirely new era, one where a suitably motivated person can build things that would’ve been cost, time, and skill prohibitive just a year or two ago. ',
      { strong: 'The key question is how to leverage modern tooling to solve real, immediate problems that will benefit you, your business, your team. I can help you figure that out.' },
    ],
  ],

  // Sits directly under the intro, before the tool list — it's the turn the third paragraph
  // already sets up ("I can help you figure that out"), so the ask lands while that sentence is
  // still on screen rather than after five sections about tools and flying.
  // Both lines are Jon's, verbatim (2026-07-31). The label renders exactly as written: unlike
  // the project detail pages, buttons on this site don't get an arrow appended.
  // NOTE: pointed at /contact/, matching every other CTA pill. The label was "I think so!" for
  // about ten minutes; Jon strengthened it 2026-07-31. That also settles the href — a reader
  // clicking "Yes, let's go!" has committed, so send them straight to the form rather than to
  // /services to be sold again.
  cta: {
    text: 'Ready to build something useful and enduring?',
    href: '/contact/',
    label: 'Yes, let’s go!',
  },

  // The tool list. Groups are the blank-line breaks in Jon's draft; the `label` on each is the
  // naming he approved 2026-07-31 — without them the grouping was doing its work through
  // whitespace alone and a reader couldn't tell why Supabase and Cloudflare sat together.
  //
  // `hub: true` marks Claude Code (Jon's call, same day): it's the centre of the toolchain, not
  // first in a list, so it renders full-width above the others with its `under` items attached.
  // Exactly one group should carry it — the treatment means nothing if everything is a hub.
  //
  // ADDED 2026-07-31 after an audit of every repo Jon has access to, and only where the tool is
  // genuinely used: Eleventy (bellomodo-catalog — it's what built the catalog the Work page
  // describes — and CBF-documents), Next.js (CBF-site), Kan (the self-hosted kanban in
  // CBF-kanban, which belongs beside the other two self-hosted business tools), and a Testing
  // group for Playwright (bellomodo-catalog + CBF-site) and Vitest (chelan-comps).
  // Offered and declined for now: TypeScript, Tailwind, Docker, PostgreSQL, Jekyll, TinaCMS,
  // Style Dictionary, Pagefind, MinIO, nginx, Netlify, Cursor. The list is curated on purpose —
  // "tools I keep coming back to", not an inventory. Don't pad it.
  // ⚠️ ListMonk is the one entry NOT corroborated by any repo. Jon says he runs it; left in.
  stack: {
    heading: 'Tech stack',
    intro: [
      'I own a lot of tools—electrical, woodworking, power tools, floor standing machines, tools I stashed away and forgot about. But the tool itself is less important than knowing how and when to use it.',
      [
        'With the builds described on my ',
        { href: '/work', text: 'Work page' },
        ', these are the tools I keep coming back to:',
      ],
    ],
    groups: [
      {
        label: 'How I build',
        hub: true,
        items: [{ name: 'Claude Code', under: ['Local VMs (dev server)', 'VS Code/terminal', 'GitHub'] }],
      },
      {
        label: 'Infrastructure',
        items: [{ name: 'Supabase' }, { name: 'Cloudflare' }, { name: 'Resend' }, { name: 'DigitalOcean' }],
      },
      {
        label: 'What I build with',
        items: [{ name: 'React' }, { name: 'Astro' }, { name: 'Eleventy' }, { name: 'Next.js' }],
      },
      {
        label: 'Testing',
        items: [{ name: 'Playwright' }, { name: 'Vitest' }],
      },
      {
        label: 'Business tools',
        items: [{ name: 'TwentyCRM' }, { name: 'ListMonk' }, { name: 'Kan' }],
      },
      {
        label: 'Design & writing',
        items: [{ name: 'Canva' }, { name: 'draw.io' }, { name: 'Sublime Text' }, { name: 'Ulysses' }, { name: 'SketchUp' }],
      },
    ],
  },

  // Everything below was already on the page and is NOT from the new draft — moved here
  // unchanged so the whole page lives in one place.
  // TODO(jon): confirm/adjust the Recognition framing before launch (carried over).
  sections: [
    {
      heading: 'Volunteer work',
      body: [
        'I am currently an ambassador for the Head & Neck Cancer Alliance and also serve as the Director of the non-profit Cloudbase Foundation.',
      ],
    },
    {
      heading: 'Flying',
      // Northwest Paragliding linked 2026-08-02 (URL from Jon; verified live, HTTP 200).
      // ⚠️ Two mechanical fixes to this sentence at the same time — it is CARRIED-OVER page
      //    copy, not from the 2026-07-31 draft, so these aren't covered by the edit log at the
      //    top of this file. Neither changes meaning; revert either if you disagree:
      //      · "I learned to paragliding" → "I learned to paraglide"
      //      · "enjoy traveling to abroad" → "enjoy traveling abroad"
      body: [
        [
          'I learned to paraglide in 2023 with my friends at ',
          { href: 'https://www.nwparagliding.school/', text: 'Northwest Paragliding' },
          '. I fly when my schedule allows and enjoy traveling abroad, especially to South and Central America.',
        ],
      ],
    },
    {
      heading: 'The book',
      body: [
        [
          'I wrote ',
          { em: 'Unflappable: Soaring Beyond a Diagnosis' },
          ', a memoir about rare disease, paragliding, and finding healing even when cures are out of reach — published at ',
          { href: site.bookUrl, text: 'unflappable.press' },
          '. Writing it was one build; publishing it was another — the ',
          { href: '/work/unflappable', text: 'work page has the rest of that story' },
          '.',
        ],
      ],
    },
  ],
};
