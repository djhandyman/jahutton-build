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
pages and one endpoint (counted from `dist/` 2026-11-12; the old figure of 24 predated
`/welcome`'s deletion).

| Route | What it is |
|---|---|
| `/` | Home. Positioning, entry points into Work and the offer. |
| `/work` | One card per project. |
| `/work/<slug>` | Ten detail pages, one per project with a `slug`. |
| `/kitchen` | The kitchen remodel, stage by stage — its own page, not a `/work/<slug>`. See the log, 2026-11-12. |
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

Nine, all with detail pages: Bello Modo · chelancomps.org · Unflappable · LAN & Server Closet ·
Kitchen & Bathroom Remodel · Cloudbase Foundation · Chelan Falls Park Signage · Ascension
Medicines · This Website.

A tenth is **hidden** (2026-08-07): the state-agency project is commented out in
`src/data/projects.js` rather than deleted. Unlike `/now` and `/notes` this takes one switch, not
two — the array feeds both the `/work` cards and `getStaticPaths()`, so the card and the page go
together and there's no sitemap rule to move. The entry states the reasoning and what would bring
it back.

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

Shared: every Function answers JSON to a `fetch` and a 303 redirect to a native form post. That
no longer means a form sends with JavaScript off — Turnstile needs it, and all three require a
token. Every key is server-side — the browser only ever talks to this
origin. Turnstile is strict on all three Functions (contact since 2026-11-13; see below).

`supabase/migrations/` is the source of truth for both tables. RLS on, no policies, reached only
via PostgREST with the service-role key.

## Design system

`src/styles/tokens.css` is the system — color roles, the Fraunces/Inter scale, spacing, layout
widths — and is **shared verbatim with unflappable.press**, the sibling site for the book. Keep
them in sync. `global.css` builds on it. No framework, no CSS library.

## Decision log

Newest first. Superseded entries are kept, marked, and dated — knowing what was tried is most of
this file's value.

**2026-11-13** — **The forms and the offer pages are off.** Two reasons, one change. The
contact form had delivered nothing but bot spam since 2026-10-18, and the offer on `/services`
and `/assessment` is being reworked. So: `contact.formEnabled` is false and `/contact` shows a
LinkedIn link where the form was; `/services`, `/assessment`, `/assessment/intake` and both
`/thanks` pages are parked under a leading underscore in `src/pages/`, which keeps them out of
the build without deleting them (`services.enabled` drops the links that pointed at them, and
the Services nav entry is commented out). Those URLs 404 — unlike `/now` and `/notes`, which
stay built and are only unlinked — because a hidden page that still resolves would have kept
the offer live for anyone arriving from a search result. `functions/api/_middleware.js` closes
all three form endpoints (503 to a fetch, 303 to `/contact/` for a native post), since the spam
was arriving at the URL and never needed the page. The Functions and their tests are untouched;
the route table and Functions section above describe the site with everything switched on.
Reopening is: rename the pages back, flip the two flags, restore the nav line, and take the
endpoint out of `CLOSED` — `tests/build-output.test.js` fails if a form is built over a closed
endpoint.
**2026-11-13** — **Turnstile is strict on contact too.** It had been lenient (verify a token only
when present) so the form still sent with JavaScript off, with the honeypot as the fallback. Once
the site went public, bots used exactly that path: all 14 contact emails from 2026-10-18 to
2026-11-12 were spam, posted with no token and the honeypot left empty. Contact now rejects a
token-less submit like the other two Functions, and `ContactForm` carries a `<noscript>` note
(`contact.noJsNote` in `site.js`) sending no-JS visitors to LinkedIn. The gate still no-ops when
`TURNSTILE_SECRET_KEY` is unset, so it only bites in production if that secret is set there.
Three things went in around it, the same day. **A same-origin check** runs first in `contact.js`:
the `Origin` header has to be this site's own host. It is forgeable and it is not the strong
layer, but it costs nothing, it turns away a script before a siteverify call is spent, and it is
the one check that still holds if the secret is ever unset. **The form waits for its token**
(up to eight seconds) instead of posting an empty one, which strictness would otherwise turn
into a spurious "reload and try again" for anyone who presses Send within a second of the page
loading or straight after a first message. **And when no token ever arrives** — a content
blocker, a network that blocks the challenge — the form says the check couldn't load and points
to LinkedIn, rather than sending the visitor round a reload that cannot work. Every rejection
gives the sender the same message and logs its real reason to the Pages function log.
Considered and left out: a minimum-time trap (anything that passes Turnstile has already waited
longer), keyword or language filtering (the cost of a false positive is a lost message from a
real person, and there is no spam yet that gets past the token to tune it on), and an in-repo
rate limit (it needs a KV or rate-limit binding, which is infrastructure this repo doesn't
otherwise have — the WAF rule does that job).

**2026-11-13** — **`/kitchen`: every photo inline, unprinted extras, and a before/after.** Jon
asked for more photos and not to hew to the printed set, especially for the before. The print-set-
first order and the "More photos" fold are gone: each stage shows all its photos in story order
(4-up from 64rem). Sixteen stills that never made the party CSV were added via `extraPhotos` in
`kitchen.js` — their ids encode position (`07-13a` sorts between 07-13 and 07-14), the iPhone
HEICs were converted once to JPEG in the gitignored `Extras/` (sharp's prebuilt libvips can't
decode HEVC), and their titles and captions are **drafts** carried as `draft: true`. The reveal
section now leads with three **before/after** pairs: a native range input wipes between the two
photos (no-JS: side by side), and an unshot "after" is a placeholder in the same frame. The
script crops a filled after to its before's proportions so the wipe lines up.

**2026-11-12** — **`/kitchen`: the kitchen remodel gets a page of its own.** Built for the people
who missed the reveal party (2026-11-14) and as the kitchen half of the remodel case study.
Decisions, in the order they were made:
- **A standalone page, not a `projects.js` entry.** Eleven stages, two maker sections and a
  six-card AI exhibit don't fit any `[slug].astro` slot; growing that renderer six slots for one
  project was the wrong trade. **One remodel card stays on `/work`** (Jon) — its Kitchen gallery
  group, previously "coming soon", now points here via a new optional `link` on a note group.
- **`/kitchen`, not `/work/kitchen`** (Jon) — it's the URL that goes out by text. The cost is
  that "Work" doesn't light in the nav on this page.
- **Content is data, twice over.** Copy lives in `src/data/kitchen.js`; photo titles and captions
  are *generated* from the party's CSV into `src/data/kitchen-photos.js` by
  `scripts/kitchen-images.mjs`, so the source of truth can't drift by hand-copying.
- **Images pre-built, not `astro:assets`.** Extends the existing public/ + extensionless-`src`
  convention with a 480/960/1440 WebP ladder and one ≤960 JPEG fallback, built with the `sharp`
  inside Astro. Rebuilding ~250 variants on every Cloudflare deploy bought nothing. Originals
  (`source-assets/`, 738 MB) are gitignored; output is ~22 MB.
- **Withheld, not deleted.** Jon's rules for the page — no recognizable people, no panel or
  permit number, nothing that locates the house, no dollar figures — are encoded as `heldPhotos`
  and `hold:` fields. The script skips held photos *entirely*, because a file in `public/` is
  fetchable whether or not anything links it.
- **No new components.** README claims fourteen; everything repeated is a loop on one page.
  The photo viewer is a native `<dialog>` over plain links (no-JS still works) and inlines under
  the 16 kB limit, so "0 JavaScript bundles" holds.
- **The posters' violet (`#5f4b6b`) is page-scoped**, for stage numbers and figures only; links
  and CTAs stay rust.
- **Showcase slots** ("The reveal") are placeholders until the staged photos are shot — one
  `source` field and a script run each.

**2026-09-02** — **The Cloudflare Access gate came off**, and `/welcome` went with it. Jon removed
the Access policies so the site could be submitted with an Anthropic application, which makes the
site public and resolves the contradiction logged on 2026-08-06: the 2026-07-27 decision to stay
crawlable is now actually in effect. Three of that entry's four deletions are done here — the
`splash` object, `src/pages/welcome.astro`, and the `/welcome` sitemap exclusion — the fourth was
the Access application itself, which Jon deleted in the dashboard. `bare` and `noindex` on
`BaseLayout` went too: `/welcome` was their only consumer, and a prop nothing passes is a prop
that drifts. Both are recoverable from git history if a second temporary page ever needs them.

**2026-09-02** — The **private-beta banner and the feedback widget are off**, same cause. The
banner announces a beta to an audience that no longer exists, and the widget collects notes from
invited testers, not from the public. `banner.enabled` is now a literal `false`, so the
`PUBLIC_BETA_BANNER` build var no longer controls it; the widget gained a matching
`feedback.enabled` switch in `site.js` and a guard in `BaseLayout`, rather than a commented-out
line in the layout. Neither component nor `/api/feedback` was touched — this is two booleans.

**2026-08-07** — The state-agency project is **hidden** — commented out in `src/data/projects.js`,
not deleted, taking the site from ten detail pages to nine. It was a career summary in a container
that promises a case study: no org name (anonymized the day before), no live link, no `source`,
and a placeholder testimonial, so it asked a reader to take twelve years on faith next to nine
cards that point at something checkable. This extends the 08-06 call one level up — that day's
note filed the Confluence achievements doc as "résumé material, not portfolio material," and the
card had the same problem. The anonymization had been a compromise between publishing it and not;
this resolves it. **The cost is real and currently unpaid**: it was the only card carrying
organizational scale (12 years, 7 analysts, exec-facing, a progression framework), which is the
ballast under the fractional and build-with-you offers on `/services`. That belongs on `/about`,
where an unlinkable career fact is native — explicitly **not** `/now`, which is itself hidden for
reading as job-search copy. That About section is not written yet. A real testimonial from the
mentored analyst is what would bring the card back; hiding it parks that ask, since quotes render
only on project cards.

**2026-08-06** — `/welcome`, a splash page, plus `bare` and `noindex` on `BaseLayout`. The site
sits behind a Cloudflare Access application on the apex, and a check that day found every URL —
including `/robots.txt`, `/sitemap-index.xml` and `/rss.xml` — 302ing to a login screen. Two
consequences. First, the **2026-07-27 decision to stay crawlable through the beta has not been in
effect**: no crawler can reach any page, so no early indexing has accumulated. That decision and
the gate contradict each other and one of them has to give. Second, Access intercepts before the
request reaches this origin, so a locked-out visitor cannot be shown anything this repo authors —
the only fix is a page Access doesn't guard.

`/welcome` is that page: the tease, how an invited tester gets in (Access one-time PIN — an
emailed six-digit code, which is what "email auth" and "access code" both resolve to here), and a
LinkedIn link for everyone else. It renders `bare` — no header, footer or feedback widget —
because each of those points somewhere gated, and a nav whose every link is a login wall is worse
than no nav. `noindex` plus a sitemap exclusion because the page is *temporary*, not private.
**It did nothing until `/welcome` was bypassed in the Access application**; the page was half the
fix and the dashboard was the other half. Four things were to be deleted at launch, and they were,
on 2026-09-02 — see the top of this log. **Superseded.**

**2026-08-06** — A testimonial `quote` may now be an **array of paragraphs**, with everything past
the first folded into a native `<details>` inside `ProjectTestimonial`. Austin's quote is long and
specific, and the specificity is the point — the alternative fixes were trimming it (which throws
away the concrete before/after that earns the block) or letting a wall of text push the CTA off
the screen. A `<details>` element rather than a JS toggle: static build, no dependencies, and the
expanded/collapsed semantics, keyboard handling and in-page find are already in the platform.
`expandAfter` sets how many paragraphs stay open. Quotation marks sit on the outside of the whole
quote only: the print convention of an opening mark on every paragraph shipped first and was
rejected the same day — on screen it reads as a stray character rather than as continuation. The
collapsed state therefore ends unclosed, with an ellipsis marking the fold.

**2026-08-05** — Turnstile was rejecting every Build Assessment submit, found by a beta tester.
Cause: `FeedbackWidget` (site-wide) loaded `api.js?render=explicit` while `ContactForm` and
`AssessmentIntake` rely on implicit rendering, and that query parameter disables the auto-scan
for the whole page — so on shared pages the intake widget often never rendered and posted an
empty token. Contact carried the identical fault and hid it, being the lenient Function. Fixed by
dropping the parameter so all three request an identical URL. `turnstileOk()` now logs
`error-codes`, and logs the no-token case separately, since that path returns before siteverify.

**2026-08-05** — The Build Assessment price **stays at $1,000**. It was changed to $2,500 and
pushed earlier the same day on the strength of a multiple-choice answer, then reverted at Jon's
instruction within the hour. Recorded rather than quietly rebased, because the lesson is the
useful part: **the price is Jonathan's alone, and a menu selection is not authorization to change
a public number.** The argument for raising it (in `.temp/ASSESSMENT-PRICING.md`) is unaffected
and still worth reading — it just isn't a pending task. The four rendered places that must always
move together are noted in `site.js`.

Two things from the same change stand on their own and were kept: the intake gained an optional
`invest_band` question, because `budget_band` asks about readiness rather than size and knowing
the size of a job is useful at any price (migration `0003`); and the three engagement shapes are
confirmed accurate rather than merely unchallenged, which closes the older "no source in Jon's
answers" flag.

**2026-08-05** — All three Turnstile widgets now render **explicitly**, retaining their widget id
so it can be `reset()` between attempts. Tokens are single-use, so `ContactForm` and
`AssessmentIntake` — which re-enabled Send without refreshing — turned any first failure into a
permanent one. This is Cloudflare's documented requirement for a page that stays active after a
submit, and the pattern `FeedbackWidget` already used. No component depends on the page-wide
auto-scan any more, which removes the coupling behind the render-mode bug entirely. Side effect:
the added code pushed the intake script past Vite's 4 kB `assetsInlineLimit`, Astro emitted a JS
bundle, and the "0 JavaScript bundles" claim briefly went false — caught by the build guard, and
now held by explicit config rather than luck.

**2026-08-05** — A test suite, with **zero new dependencies** — `node:test` and `node:assert` are
inside Node 22, and a runner in `devDependencies` would have falsified the four-dependency claim
in five places. The Functions export `onRequestPost` and use only Node globals, so the tests
drive the real handlers with a stubbed `fetch`. Most of the value is in pinning the failure-policy
table; the rest is `tests/build-output.test.js`, which asserts structural facts about the built
HTML — one Turnstile URL per page, no test sitekey in a production build, still zero JS bundles.
That file exists because the render-mode bug lived in how three components combined on a page
none of them owns, where no unit test could reach it. Verified by reintroducing the bug into
`dist/` and confirming the guard failed.

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
No linter or formatter. (A test suite arrived 2026-08-05 — `npm test`, zero dependencies, built
on `node:test`. See the decision log.) No license file, so ordinary
copyright applies to the content. No in-repo deploy config: production builds come from the
Cloudflare Pages ↔ GitHub connection, and `wrangler` is only used locally to exercise the
Functions.
