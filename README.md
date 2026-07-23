# jahutton.build

Professional portfolio and calling-card site for **Jonathan A. Hutton**. The
`.build` TLD is intentional: the site framing is **"I am a builder"** — of
software, systems, teams, physical spaces, organizations, and written work.

**Status:** 🏗️ Built and building clean on Node 22 / Astro 7. Pages, a warm-editorial
design pass, a Resend contact form, and a Substack embed are in place. Remaining work is
mostly real project outcomes/metrics from Jonathan (see the `// TODO(jon):` markers in
`src/data/projects.js`).

## Stack
- **[Astro](https://astro.build)** — static output, near-zero JS.
- **Cloudflare Pages** — hosting + Git-push deploys, plus one Pages Function for the contact form.
- **[Resend](https://resend.com)** — transactional email for the contact form (no third-party form service).
- **Substack** — newsletter embed (`unflappable.blog`) + outbound subscribe link.
- Plain CSS design system (`src/styles/tokens.css` + `global.css`) — warm editorial: paper/cream
  ground, ink text, Fraunces headlines, rust accent shared with the sibling book site.

## Structure
```
src/
  pages/        # index, work, about, now, contact, thanks
  layouts/      # BaseLayout (head/meta, header/footer wrapper)
  components/   # Header, Footer, ProjectCard, ContactForm, SubstackEmbed
  data/         # site.js (copy/links/nav) + projects.js (portfolio cards) — content lives here
  styles/       # tokens.css (design system) + global.css
functions/
  api/contact.js  # Cloudflare Pages Function: POST /api/contact → emails via Resend
public/         # static assets
docs/
  architecture.md # sitemap, "builder" framing, IA decisions
```

Content is data, not markup: edit `src/data/*.js` to change copy or add a project — pages just map
over the data. See [`CLAUDE.md`](CLAUDE.md) for architecture and conventions in depth.

## Site map
`/` Home · `/work` Work (project cards) · `/about` About · `/now` Now · `/contact` Contact
(`/thanks` is the no-JS form redirect target). See [`docs/architecture.md`](docs/architecture.md).

## Sibling site
Cross-linked with the book site **unflappable.press** (separate repo). The two share a type/spacing
scale and the rust accent color so they read as a family.

## Local development
```
npm install
npm run dev      # astro dev server → http://localhost:4321
npm run build    # static build → dist/
npm run preview  # preview the built dist/
```
Node 22 required (`.nvmrc`).

The contact form is a Cloudflare Pages Function, so the Astro dev server doesn't run it. To test it:
```
npm run build
npx wrangler pages dev dist
```
Wrangler reads secrets from `.dev.vars` — copy `.dev.vars.example` and add your `RESEND_API_KEY`.

## Deploy
Cloudflare Pages, building from this repo's `main` branch (`dist/` output). Set the contact-form
env vars in the Pages dashboard (Settings → Environment variables): `RESEND_API_KEY` (required),
`CONTACT_TO` / `CONTACT_FROM` (optional; defaults live in `functions/api/contact.js`).
