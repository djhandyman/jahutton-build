# Architecture — jahutton.build

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
  outbound subscribe link (chosen).
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
