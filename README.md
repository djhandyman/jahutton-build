# jahutton.build

Professional portfolio and calling-card site for **Jonathan A. Hutton**. The
`.build` TLD is intentional: the site framing is **"I am a builder"** — of
software, systems, teams, physical spaces, organizations, and written work.

**Status:** 🏗️ Session 1 — scaffolding. Architecture done; no framework code yet.

## Stack (planned)
- **[Astro](https://astro.build)** — static output, near-zero JS.
- **Cloudflare Pages** — hosting + Git-push deploys.
- **Formspree** — contact form (no server code).
- **Substack** — newsletter embed + outbound subscribe link.
- Styling deferred to a separate design session; content and structure are kept
  cleanly separated so visual direction applies without restructuring.

## Structure
```
docs/
  architecture.md   # sitemap, "builder" framing, Work cards, IA decisions
src/                 # (empty) Astro app — added in Session 2
public/              # (empty) static assets / images — added in Session 2
```

## Site map
`/` Home · `/work` Work (project cards) · `/about` About · `/contact` Contact.
See [`docs/architecture.md`](docs/architecture.md).

## Sibling site
Cross-linked with the book site **unflappable.press** (separate repo).

## Content needed from Jonathan
Checklist to fill before/while building (mostly net-new copy):

- [ ] **Project blurbs** — for each of the 8 projects: 1-line role, 2–3 sentence
      "what I built / the challenge / the outcome," tools/tech, links, any metric.
  - [ ] Groundcrew (civic volunteer coordination platform)
  - [ ] chelancomps.org (solo multi-agent project)
  - [ ] Bello Modo (small-business growth & stabilization, operator-level)
  - [ ] Cloudbase Foundation (CRM, website, org revival, board governance)
  - [ ] Kitchen & bathroom remodel (design, planning, PM)
  - [ ] Chelan Falls Park signage (Illustrator, print-ready; Chelan County PUD site)
  - [ ] WAHBE AI strategy (Alation/MCP, agentic workflows, Copilot Studio, knowledge architecture)
  - [ ] WAHBE org development (agile assessment, BSA/PM maturity matrix, team dev)
- [ ] **Project images / screenshots** (optional but recommended) — Groundcrew UI,
      chelancomps, remodel before/after, Chelan Falls signage artwork, etc.
- [ ] **Hero / positioning statement** — the "I build ___" tagline + short
      professional bio (distinct from the book bio).
- [ ] **Professional headshot** (may reuse the author photo).
- [ ] **UW Medicine / Dr. Barber** — one approved sentence framing the
      grand-rounds interview as a credibility signal.
- [ ] **Second book** — 2–3 sentence "in progress" teaser + working title (if any).
- [ ] **Formspree** — create the form, provide the endpoint ID.
- [ ] **Substack** — confirm handle/URL for the embed (`@jahutton`).
- [ ] **Cloudflare** — confirm custom domain attach + DNS.
- [ ] **Résumé / CV PDF** to link (optional).

## Local development (Session 2+)
Astro is not yet scaffolded. Once it is:
```
npm install
npm run dev      # local dev server
npm run build    # static build → dist/
```

## Deploy
Cloudflare Pages, building from this repo's `main` branch (`dist/` output).
GitHub remote and Pages project are wired in a later session.
