# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`jahutton.build` — the professional portfolio / calling-card site for Jonathan A. Hutton.
The `.build` TLD carries the framing: **"I am a builder"** — of software, systems, teams,
physical spaces, organizations, and written work. Astro static site, deployed to Cloudflare
Pages, plus three Pages Functions (contact, Build Assessment intake, feedback widget).

Sibling site: **unflappable.press** (the book, separate repo). The two are intentionally
cross-linked and share a type/spacing scale; the rust accent (`#b55627`) is deliberately
common to both so they read as a family.

The repo is public and is itself a portfolio artifact — `README.md` is written for a visiting
hiring manager, not for maintainers. Its claims (dependency count, component count, what talks
to what) are load-bearing; if you change the architecture, change the README too.

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

### Exercising the Functions locally

The three forms are Cloudflare Pages Functions; the Astro dev server does **not** run them.
`npm run dev` will render the forms but every submit 404s. To actually test one:

```
npm run build
NODE_OPTIONS="--dns-result-order=ipv4first" npx wrangler pages dev dist
```

Wrangler reads secrets from `.dev.vars` (gitignored; copy `.dev.vars.example`, which documents
every var). Minimum per Function: `RESEND_API_KEY` for contact/assessment-intake,
`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` for feedback.

## Architecture

- **Content is data, not markup.** All site copy and links live in `src/data/` — `site.js`
  (name, headline/positioning, nav, socials, contact + services + assessment copy, beta banner,
  Turnstile site key), `projects.js` (project cards + writing list), `intake.js` (the
  multi-step Build Assessment form's questions/options), `privacy.js`, `colophon.js` (the
  request-flow diagram data). Pages and components map over these; components are
  presentation-only. To change wording or add a project, edit the data file — never hard-code
  copy into `.astro` files.

- **Pages** (`src/pages/`): `index`, `work`, `work/[slug]`, `services`, `about`, `now`, `contact`,
  `assessment`, `assessment/intake`, `privacy`, `thanks`, `thanks/build-assessment`, `404`. Each is
  a thin `.astro` file wrapping `BaseLayout` and rendering data.

- **The offer ladder.** `/services` is the "what I offer" page: the Build Assessment first (it's the
  front door, not a fourth product), then three engagement shapes — zero-to-one, build-with-you,
  fractional. `/assessment` and `/assessment/intake` hang off it. The assessment is also signposted
  from `/contact` under the prompt list, and offered after a qualifying contact submit (below).

- **Two thanks pages, not a query param.** `/thanks/` is the default no-JS redirect target;
  `/thanks/build-assessment/` is the same page plus the Build Assessment offer. They're separate
  prerendered pages because this is a **static build** — `?next=assessment` could only be read by
  client-side JS, and the no-JS submitter is precisely who gets redirected. A JS submit never
  navigates at all: it reveals the same `NextStepCard` inline on `/contact`. Don't "simplify" this
  into one page with a query string; it silently breaks the case it exists for.

- **Two-tier project presentation.** `src/pages/work/[slug].astro` prerenders one detail page per
  project *that has a `slug`* (via `getStaticPaths()` filtering `projects`). Those cards show the
  short `teaser` + "Read more →" and the full `blurb` becomes the detail-page body. A project
  **without** a `slug` is teaser-only: its card renders the `blurb` inline with no link. Promote or
  demote a project between tiers purely by adding/removing its `slug` — no page edits needed.
  `blurb` is either a string or an **array of paragraph strings**; both the card and the detail page
  normalize it and render one `<p>` per entry. It's plain text through Astro's escaping — no
  markdown, no HTML (use curly quotes, not `_italics_`).

- **`BaseLayout.astro`** wraps every page: imports fonts + global CSS, renders `Banner`/`Header`/
  `Footer`, sets `<title>`/description/canonical/OG tags (overridable via props), skip link.

- **Styling** is two plain CSS files, no framework:
  - `src/styles/tokens.css` — the design system: color roles, the Fraunces/Inter type scale, spacing,
    layout widths. **This scale is shared verbatim with unflappable.press** — keep them in sync.
  - `src/styles/global.css` — element and component styles built on those tokens.
  Direction is "warm editorial": paper/cream ground, ink text, Fraunces headlines, rust accent.

### The three Functions, and what's allowed to fail

This is the site's central design idea — the same building blocks with deliberately opposite
failure policies. Preserve it when editing `functions/api/*.js`:

| Function | Must succeed | Best-effort (failure swallowed) |
|---|---|---|
| `contact.js` | Resend email | — |
| `assessment-intake.js` | Resend email | Supabase insert, Claude triage |
| `feedback.js` | Supabase insert | Claude tagging / follow-up question |

The rule: whatever *is* the product for that form is the required step. For the assessment the
**email** is the lead, so a paused Supabase project must never cost it. For feedback the **saved
row** is the product, so the insert happens first and enrichment failure is invisible to the visitor.

Shared conventions across all three:

- **Dual-mode responses.** JSON for `fetch` submits, a 303 redirect (`/thanks/` or
  `?error=1`) for native no-JS form posts. Progressive enhancement is real here — don't
  regress it by making a form JS-only. Every visitor-facing decision has to be expressible
  in *both* modes: `contact.js` answers `{ next: 'assessment' }` to a fetch and 303s to
  `/thanks/build-assessment/` for the same case on a native post.
- **The contact form's timeline `<select>` submits `key|label`.** The stable key drives
  `QUALIFIED_TIMELINES` (who gets offered the Build Assessment after sending); the label is
  Jon's copy and only ever prints in his notification email. This keeps the wording in
  `src/data/site.js` as the single source while giving the server something stable to test —
  reword any label freely, nothing breaks. A value with no `|` degrades to label-only and
  simply doesn't qualify; drift can never reject a send.
- **Every key is server-side.** The browser only ever talks to this origin; no third-party
  service is reached from the visitor's device. `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and
  must never reach the client.
- **Turnstile** (`turnstileOk()`, duplicated in each Function): strict on `assessment-intake`
  and `feedback` (both spend money per submit), lenient on `contact` (verified when present,
  honeypot fallback so no-JS still works). **If `TURNSTILE_SECRET_KEY` is unset, verification
  is skipped entirely** — forms work, nothing is enforced. The public site key
  (`PUBLIC_TURNSTILE_SITE_KEY`, defaulting to Cloudflare's always-pass test key) and the server
  secret must be swapped from test → real *together*; a mismatch blocks every submit.

- **Supabase.** `supabase/migrations/` is the source of truth for the `feedback` and
  `assessment_intake` tables — re-runnable, RLS on with no policies (deny-all), reached only via
  PostgREST with the service-role key. The first version of the feedback table was clicked
  together in the dashboard and lost when the project auto-paused; that's why the schema is in
  the repo now. Column changes need a matching migration file.

- **Build-time env vars** (Cloudflare Pages build settings, not Function secrets):
  `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_BETA_BANNER` (set to `false` to kill the private-beta
  banner without a code edit; `banner.enabled` in `site.js` is the other switch).

- **Sitemap exclusions** live in `astro.config.mjs`: `/thanks/` and everything under
  `/assessment` are filtered out while the Build Assessment offer is unapproved. Revisit at launch.

- **Deployment.** There is no in-repo deploy config (no `wrangler.toml`, no deploy script). Production
  deploys are triggered by the Cloudflare Pages ↔ GitHub connection (repo `djhandyman/jahutton-build`),
  which builds from git — don't go looking for a deploy command here. `wrangler` is only used locally,
  via `npx`, to exercise the Functions (see above). Function secrets are set in the Cloudflare Pages
  dashboard (Settings → Environment variables).

## Content conventions (important)

`src/data/projects.js` copy is drafted around the through-line "I turn organizational ambiguity into
finished, working structure." When editing any site copy:

- **Write as Jon, per `.temp/voice-and-style.md`** (gitignored — outside the tracked repo). That
  guide is the quality bar / anti-slop filter for site microcopy and project blurbs: concrete over
  abstract, short sentences that land, em-dashes, no smarmy overwriting or decorative metaphor.
  Jon does *not* use AI for writing he cares about (the book, the essays) — don't draft those.
- **Never invent metrics, outcomes, or facts.** `// TODO(jon):` comments in the source mark where a
  real, citable outcome still needs to come from Jonathan. They live in comments, not visible blurbs,
  so nothing unfinished renders on the page. Leave them until Jonathan supplies the real number.
- Jonathan reviews/approves each blurb before launch. `src/data/privacy.js` and the beta banner
  copy are explicitly marked as un-approved drafts.
- **`colophon.js` and `privacy.js` are checked against the source.** Both describe what the
  Functions actually do, sitting next to a link to this public repo — a reader can verify them in
  a minute. If you change a Function's behaviour or what it collects, update both (and the README
  flow diagram) in the same change.

## Gotchas

- **`docs/architecture.md` is stale** — it predates several decisions and still describes Formspree
  (it's Resend), a Groundcrew project (removed), "no per-project detail pages" (they exist now), and
  knows nothing of Supabase, Turnstile, or the assessment/feedback Functions. Treat this file, the
  README, and the source as authoritative; update `docs/architecture.md` rather than trusting it.
- **`.claude/` is gitignored and holds worktrees** — full untracked copies of the repo including
  `node_modules/` and `dist/`. Repo-wide greps/finds will return duplicate hits; scope searches to
  `src/`, `functions/`, `supabase/`, and `docs/`.

## Planning / private context

`.temp/` is gitignored and holds the living planning doc, the voice guide, and job-search drafts.
Keep `.temp/PLANNING.md` current every working session (per the `maintain-living-planning-doc`
memory) — open action items, decisions with dates, session log. The locked positioning/strategy doc
lives at `~/.claude/plans/misty-dreaming-hinton.md`.
