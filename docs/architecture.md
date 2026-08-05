# Architecture — jahutton.build

What the site is made of, and the record of how it got that way. Rewritten 2026-08-04; the
version before this had been wrong since roughly 2026-07-23 and is in git history if the old
plan is ever worth reading.

Three docs, three jobs. [`README.md`](../README.md) is for a visitor. [`CLAUDE.md`](../CLAUDE.md)
is the working rules — every convention, every constraint, why each one exists. This file is the
shape of the thing and the dated decision log. When they disagree, the source wins, then
`CLAUDE.md`, then this.

## Shape

Astro static build → `dist/` → Cloudflare Pages, plus three Pages Functions. 23 prerendered
pages and one endpoint.

| Route | What it is |
|---|---|
| `/` | Home. Positioning, entry points into Work and the offer. |
| `/work` | One card per project. |
| `/work/<slug>` | Ten detail pages, one per project with a `slug`. |
| `/services` | The offer: Build Assessment first, then three engagement shapes. |
| `/assessment`, `/assessment/intake` | The assessment explained, and the multi-step intake form. |
| `/about` | Bio, tool list, Substack link. |
| `/contact` | Contact form. Qualifying submits get offered the assessment. |
| `/thanks`, `/thanks/build-assessment` | Two no-JS redirect targets, not one page with a query string. |
| `/notes`, `/notes/<slug>` | The writing surface. **Built but hidden** — see below. |
| `/now` | **Built but hidden** — see below. |
| `/privacy` | What the forms collect, checked against the Functions. |
| `/404` | |
| `/rss.xml` | The only endpoint. Hand-written RSS 2.0, summary only. |

**Two pages are hidden, and each takes two switches.** `/now` (2026-07-29) and `/notes`
(2026-08-03) still build and still resolve — they're out of the nav and out of the sitemap, not
deleted. Bringing either back means uncommenting its `nav` entry in `src/data/site.js` *and*
dropping its exclusion from `astro.config.mjs`. Both files say so at the line.

## Projects

Ten, all with detail pages: Bello Modo · chelancomps.org · Unflappable · LAN & Server Closet ·
Kitchen & Bathroom Remodel · WAHBE Org Development · Cloudbase Foundation · Chelan Falls Park
Signage · Ascension Medicines · This Website.

A project's `slug` is the switch between two tiers — with one it gets a detail page and its card
shows a teaser; without one the card renders the full write-up inline and there's no page. Every
project currently has a slug, so the teaser-only tier is real, tested, and unused at the moment.

The detail page is a slot system. `hero`, `logo`, `components`, `gallery`, `metrics`,
`testimonial`, `diagram`, one or more `link`s, a `source` link — all optional, all driven by
whether the key exists in `src/data/projects.js`. `CLAUDE.md` has the rules for each, including
which are editorial decisions rather than layout preferences.

## Content and data

All copy lives in `src/data/*.js` — `site`, `projects`, `about`, `intake`, `privacy`, `colophon`,
`notes`. Pages map over it; components present it and hold no words of their own.

The one exception is `/notes`, where bodies are markdown in `src/content/notes/`, loaded through
an Astro content collection (`src/content.config.js`). The boundary is exact and shouldn't widen:
markdown for note bodies, data files for every other word on the site.

No new dependency was added for any of it. Content collections, the glob loader, markdown
rendering and Shiki all ship inside `astro`; `/rss.xml` is hand-written rather than
`@astrojs/rss`. The count of four is claimed publicly in five places that all move together — the
README badge, the README prose, and on `/work/this-site` the teaser, the blurb, and a metrics
card.

## The three Functions

`functions/api/` — `contact.js`, `assessment-intake.js`, `feedback.js`. Same building blocks,
deliberately opposite failure policies:

| Function | Must succeed | Swallowed on failure |
|---|---|---|
| `contact` | Resend email | — |
| `assessment-intake` | Resend email | Supabase insert, Claude triage |
| `feedback` | Supabase insert | Claude tagging |

Whatever *is* the product for that form is the required step. Everything else is enrichment, and
enrichment failure is invisible to the visitor.

Shared: every Function answers JSON to a `fetch` and a 303 redirect to a native form post, so the
forms work with JavaScript off. Every key is server-side — the browser only ever talks to this
origin. Turnstile is strict on the two Functions that spend money per submit, lenient on contact.

`supabase/migrations/` is the source of truth for both tables. RLS on, no policies, reached only
via PostgREST with the service-role key.

## Design system

`src/styles/tokens.css` is the system — color roles, the Fraunces/Inter scale, spacing, layout
widths — and is **shared verbatim with unflappable.press**, the sibling site for the book. Keep
them in sync. `global.css` builds on it. No framework, no CSS library.

## Decision log

Newest first. Superseded entries are kept, marked, and dated — knowing what was tried is most of
this file's value.

**2026-08-05** — Work cards gained a category glyph and metric chips. The index was ten text
boxes in a grid and read as a list of jobs; the feedback was that every card needs something to
look at. Photo thumbnails and per-project brand marks were both mocked up and both rejected:
seven of ten projects have a usable photo, one has a real logo and two have nothing, so either
route fails on some card and invites inventing marks for real clients — the visual version of a
fabricated testimonial. A glyph keyed on `category` plus chips read from `metrics` uses only
data every project already carries, so it can't fail on the eleventh project. Keyed on the
*first* segment of `category`, since those strings are written most-important-first and a
compound category resolves without a second field. Cards cap at three chips; the detail page
still renders the full set, so the order of `metrics` now decides what the index shows.
`docs/roadmap.md` started in the same change — a standing home for feedback that shouldn't
block launch, beginning with filtering on `/work`.

**2026-08-04** — Docs refactor. README cut to about half its length; this file rewritten from
stale plan to current reference.

**2026-08-03** — `/notes` shipped, hidden. Markdown accepted as the one exception to "content is
data," scoped to note bodies. `/rss.xml` hand-written to protect the dependency count.
Sitemap filter anchored to the path rather than the whole URL — the old form would have silently
dropped a note published at `/notes/now/`. Nav active state fixed: it compared `/work` to
`/work/` and had therefore never rendered on any page, ever. `ProjectParts` gained `placement`,
because Cloudbase needs its deliverables *after* the prose and chelancomps needs them before.

**2026-08-02** — `/about` rendered from data with a tech-stack exhibit. Hero and component slots
added to detail pages. Services page trimmed, both CTAs pointed at the intake form.

**2026-07-30** — The request-flow diagram was replaced by the stack exhibit, and deleted in the
same change rather than left unrendered. A wiring diagram with no plain-language notes was the
failure mode; the notes are Jon's to write and render nothing while empty. Outcome metrics added
to detail pages — real numbers only, sourced from Jon, dated in the comment.

**2026-07-29** — `/now` hidden pending a rewrite: its "Exploring next" section is job-search copy,
which reads as role-shopping next to an engagement offer. `/assessment` confirmed fine to index,
and its sitemap exclusion removed — hiding a page that's linked from everywhere else is just a
worse version of being indexed.

**2026-07-28** — Services page and the Build Assessment ladder. Jon's own project copy landed, so
blurbs became arrays of paragraphs. Testimonial and source-link slots added. Rule set that a CTA
label must not echo the closing line it sits under — quoting his own sentence back at him reads
as a template.

**2026-07-27** — Privacy policy, beta banner, Turnstile widgets hidden unless a challenge is
actually needed. README rewritten as a portfolio piece. Voice guide moved out of the tracked repo
into `.temp/`, which is gitignored.

**2026-07-24** — Turnstile on all three forms.

**2026-07-23** — Work cards graduated to per-project detail pages, reversing the June call.
Groundcrew removed from the portfolio (parked). The separate Writing card deleted; the book
became a full project instead.

**2026-07-08** — Feedback widget merged. Favicon, OG image, sitemap, robots, 404.

**2026-07-06** — `CLAUDE.md` added. Feedback widget built on Supabase + Claude.

**2026-07-04** — Contact form moved from Formspree to Resend.

**2026-06-26** — Astro scaffold. Substack added as an iframe embed.

### Superseded

| Was | Now | When |
|---|---|---|
| Formspree | Resend, in a Pages Function | 2026-07-04 |
| Single-page cards, no detail pages | Ten detail pages | 2026-07-23 |
| Groundcrew in the portfolio | Removed, parked | 2026-07-23 |
| A separate Writing card | The book is a full project card | 2026-07-23 |
| Substack iframe embed | Outbound link — the embed read as clunky | 2026-07-02 |
| Request-flow diagram | Stack diagram with plain-language notes | 2026-07-30 |
| One info callout describing a component | `ProjectParts`, labelled groups | 2026-08-02 |
| Feedback table clicked together in the dashboard | `supabase/migrations/` in the repo | 2026-07-06 |

## Deliberately absent

No framework, CSS library, CMS, form service, or analytics. No TypeScript and no `tsconfig.json`.
No test suite, linter, or formatter — `npm run build` is the check. No license file, so ordinary
copyright applies to the content. No in-repo deploy config: production builds come from the
Cloudflare Pages ↔ GitHub connection, and `wrangler` is only used locally to exercise the
Functions.
