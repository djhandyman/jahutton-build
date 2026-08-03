# Architecture — jahutton.build

> ⚠️ **This document is stale and has been since roughly 2026-07-23.** It is kept for
> its record of early decisions, not as a description of the site. Known-wrong below:
> the contact form is **Resend**, not Formspree; **Groundcrew was removed** from the
> portfolio; **per-project detail pages exist** (`/work/[slug]`, ten of them); the
> separate **Writing card was deleted** and the book is a full project card; and the
> whole `/services` + Build Assessment offer ladder, the three Pages Functions,
> Supabase, and Turnstile are absent from this file entirely.
> **`CLAUDE.md`, `README.md`, and the source are authoritative.** The `/notes` rows
> added 2026-08-03 are accurate; most of what surrounds them is not.

Professional portfolio / calling-card site for Jonathan A. Hutton, built on
**Astro → Cloudflare Pages**. The `.build` TLD drives the framing: **"I am a
builder"** — of software, systems, teams, physical spaces, organizations, and
written work. That through-line runs through the site architecture and copy.

## Sitemap

| Route      | Page    | Contents |
|------------|---------|----------|
| `/`        | Home    | Hero — "I build ____" positioning across software / systems / teams / spaces / organizations / writing; short positioning statement; entry points into Work + About |
| `/work`    | Work    | One **card per project** (title, role, 1-line build, outcome, links) + a Writing card. No per-project detail pages this round (cards can graduate to detail pages later) |
| `/about`   | About   | Builder narrative; credibility signals incl. UW Medicine / Dr. Barber grand-rounds interview; cross-link to unflappable.press |
| `/contact` | Contact | Formspree form + professional links (LinkedIn) |
| `/notes`   | Notes   | *(added 2026-08-03)* Reverse-chronological list of short notes, with a pinned "Start here" group above the stream. Hidden from nav + sitemap until the first note publishes |
| `/notes/<slug>` | Note | One prerendered page per non-draft markdown file in `src/content/notes/` |
| `/rss.xml` | —       | *(added 2026-08-03)* The site's only endpoint. Hand-written RSS 2.0, summary-only, no dependency |

Global footer: Substack embed + subscribe link · socials · cross-link to
unflappable.press.

## Work cards (8 projects + writing)
- **Groundcrew** — civic volunteer coordination platform (software)
- **chelancomps.org** — solo multi-agent project (software/systems)
- **Bello Modo** — small-business growth & stabilization, operator-level over
  several years (organizations)
- **Cloudbase Foundation** — CRM integration, website, org revival, board
  governance (organizations)
- **Kitchen & bathroom remodel** — design, planning, project management (spaces)
- **Chelan Falls Park signage** — print-ready Illustrator design for a
  paragliding/hang-gliding site managed by Chelan County PUD (spaces/design)
- **WAHBE AI strategy** — Alation/MCP integration, agentic workflow design,
  Microsoft Copilot Studio, institutional knowledge architecture (systems)
- **WAHBE org development** — agile assessment, BSA/PM progression & maturity
  matrix, team development (teams)
- **Unflappable** — the memoir as a full project: writing, self-publishing (KDP +
  IngramSpark), and a three-city tour (written work)
- **Writing** card → *Unflappable* (→ its own detail page) + Substack.

## Key decisions
- **Stack:** Astro, near-zero JS, static output, Cloudflare Pages. See root README.
- **Portfolio depth:** single-page cards (chosen). Flagships can become detail
  pages in a later iteration.
- **Contact form:** Formspree (one endpoint for this site).
- **Writing/Substack:** no dedicated page — Substack embed in footer/About +
  outbound subscribe link (chosen). **Superseded in part, 2026-08-03:** `/notes` is now
  a publishing surface on this site. Substack is untouched and still the home of the
  essays — the split is by kind, not by channel: feelings and stories go to Substack,
  findings and answers go to notes, and anything past ~800 reflective words is an essay.
- **Notes as markdown (2026-08-03):** the one deliberate exception to "content is data,"
  scoped to `src/content/notes/` only. **No new dependency** — content collections and
  markdown ship inside `astro`, and `/rss.xml` is hand-written rather than `@astrojs/rss`,
  because the count of four is a public claim in five places. `draft: true` is a single
  boolean that removes a note from the index, the routes, the feed, and — by consequence,
  since the page doesn't exist — the sitemap.
- **Credibility signal:** UW Medicine / Dr. Barber grand-rounds interview in About.
- **Cross-link:** Work + About link to unflappable.press (the book). No second book
  is mentioned anywhere — it's an idea, not a project (Jon, 2026-07-23).
- **Content/style separation:** structure in components/layouts; copy in Markdown
  or data; styling deferred to the design session via `tokens.css` + one stylesheet.

## Content needed
Tracked as a checklist in the root [`README.md`](../README.md#content-needed-from-jonathan).

## Deferred (later sessions)
Astro scaffold & components · visual design/tokens · GitHub remote · Cloudflare
Pages project + custom domain · project images.
