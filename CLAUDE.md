# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`jahutton.build` — the professional portfolio / calling-card site for Jonathan A. Hutton.
The `.build` TLD carries the framing: **"I am a builder"** — of software, systems, teams,
physical spaces, organizations, and written work. Astro static site, deployed to Cloudflare
Pages, with a single serverless function for the contact form.

Sibling site: **unflappable.press** (the book, separate repo). The two are intentionally
cross-linked and share a type/spacing scale; the rust accent (`#b55627`) is deliberately
common to both so they read as a family.

## Commands

```
npm install
npm run dev      # astro dev server (http://localhost:4321)
npm run build    # static build → dist/
npm run preview  # preview the built dist/
```

Node 22 is required (`.nvmrc`, `engines.node >=22.12.0`).

There is no test suite, linter, or formatter configured — `npm run build` is the check.

**npx/npm hang on this machine** unless IPv4 is forced. Prefix network-touching commands with
`NODE_OPTIONS="--dns-result-order=ipv4first"` (see the `vm-ipv6-broken-force-ipv4` memory).

### Testing the contact form locally

The contact form is a Cloudflare Pages Function, not part of the Astro dev server. To exercise it:

```
npm run build
NODE_OPTIONS="--dns-result-order=ipv4first" npx wrangler pages dev dist
```

Wrangler reads secrets from `.dev.vars` (gitignored; copy `.dev.vars.example`). `RESEND_API_KEY`
is required for a real send.

## Architecture

- **Content is data, not markup.** All site copy and links live in `src/data/`:
  - `src/data/site.js` — name, taglines, headline/positioning, nav, socials, Substack embed, contact endpoint.
  - `src/data/projects.js` — the portfolio project cards and the writing list.
  Pages import these and map over them; components are presentation-only. To change wording or add
  a project, edit the data file — do not hard-code copy into `.astro` pages.

- **Pages** (`src/pages/`): `index`, `work`, `about`, `now`, `contact`, `thanks` — each is a thin
  `.astro` file wrapping `BaseLayout` and rendering data. `thanks.astro` is the no-JS form redirect target.

- **Two-tier project presentation.** `src/pages/work/[slug].astro` prerenders one detail page per
  project *that has a `slug`* (via `getStaticPaths()` filtering `projects`). Those cards show the
  short `teaser` + "Read more →" and the full `blurb` becomes the detail-page body. A project
  **without** a `slug` is teaser-only: its card renders the `blurb` inline with no link. Promote or
  demote a project between tiers purely by adding/removing its `slug` — no page edits needed.

- **`BaseLayout.astro`** wraps every page: imports fonts + global CSS, renders `Header`/`Footer`,
  sets `<title>`/description/canonical/OG tags (overridable via props), and provides the skip link.

- **Styling** is two plain CSS files, no framework:
  - `src/styles/tokens.css` — the design system: color roles, the Fraunces/Inter type scale, spacing,
    layout widths. **This scale is shared verbatim with unflappable.press** — keep them in sync.
  - `src/styles/global.css` — element and component styles built on those tokens.
  Direction is "warm editorial": paper/cream ground, ink text, Fraunces headlines, rust accent.

- **Contact flow** (`functions/api/contact.js`): a Cloudflare Pages Function handling `POST /api/contact`.
  It validates fields, checks a `_gotcha` honeypot, and emails via the **Resend** API. It responds two
  ways by design — JSON for `fetch` submits, a 303 redirect (`/thanks/` or `/contact/?error=1`) for
  native no-JS submits. Env: `RESEND_API_KEY` (required), `CONTACT_TO` / `CONTACT_FROM` (optional, have
  defaults). Set these in the Cloudflare Pages dashboard for production.

- **Deployment.** There is no in-repo deploy config (no `wrangler.toml`, no deploy script). Production
  deploys are triggered by the Cloudflare Pages ↔ GitHub connection (repo `djhandyman/jahutton-build`),
  which builds from git — don't go looking for a deploy command here. `wrangler` is only used locally,
  via `npx`, to exercise the contact Function (see above).

## Content conventions (important)

`src/data/projects.js` copy is drafted around the through-line "I turn organizational ambiguity into
finished, working structure." When editing project copy:

- **Write as Jon, per `.temp/voice-and-style.md`.** That guide is the quality bar / anti-slop filter
  for site microcopy and project blurbs: concrete over abstract, short sentences that land, em-dashes,
  no smarmy overwriting or decorative metaphor. Jon does *not* use AI for writing he cares about
  (the book, the essays) — don't draft those.
- **Never invent metrics, outcomes, or facts.** `// TODO(jon):` comments in the source mark where a
  real, citable outcome still needs to come from Jonathan. They live in comments, not visible blurbs,
  so nothing unfinished renders on the page. Leave them until Jonathan supplies the real number.
- Jonathan reviews/approves each blurb before launch.

## Gotchas

- **`docs/architecture.md` is stale** — it predates several decisions and still describes Formspree
  (it's Resend), a Groundcrew project (removed), and "no per-project detail pages" (they exist now).
  Treat this file and the source as authoritative; update `docs/architecture.md` rather than trusting it.
- **`.claude/worktrees/` holds a full untracked copy of the repo** (including `node_modules/` and
  `dist/`). Repo-wide greps/finds will return duplicate hits from it — scope searches to `src/`,
  `functions/`, and `docs/`.

## Planning / private context

`.temp/` is gitignored and holds the living planning doc and job-search drafts. Keep `.temp/PLANNING.md`
current every working session (per the `maintain-living-planning-doc` memory) — open action items,
decisions with dates, session log. The locked positioning/strategy doc lives at
`~/.claude/plans/misty-dreaming-hinton.md`.
