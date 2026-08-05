# Roadmap — jahutton.build

`architecture.md` is what this site is and why. This file is what it **isn't yet, and why not**.

Entries land here when a good idea arrives that shouldn't hold up launch — feedback from a
reader, a pattern worth borrowing, a gap I already know about. Each one says what it is, why
it's not done, and what it would actually take. Nothing here is a promise, and there are no
dates: a roadmap that commits to a quarter is a roadmap that lies twice a year.

Newest first.

---

## Turnstile rejected every intake submit — found, fixed 2026-08-05

**Status: launch blocker, not a roadmap item.** Recorded here because a beta reader found it and
the failure mode is worth writing down: it is silent, and it looks like something it isn't.

**The symptom.** A tester submitted the Build Assessment intake and got *"That spam check didn't
pass — please reload the page and try again."*

**What that string rules out.** It is this site's own message, from
`functions/api/assessment-intake.js` — not a Cloudflare Access login and not a dead deployment.
The request reached the Function and the Function rejected it. It also rules out an
*unconfigured* deployment: `turnstileOk()` returns `true` immediately when
`TURNSTILE_SECRET_KEY` is unset, so a deployment with no secret cannot produce this error at
all. The secret is set, and Cloudflare actively rejected the token.

**What it wasn't.** The obvious candidate was `PUBLIC_TURNSTILE_SITE_KEY` falling back to
Cloudflare's always-pass **test** key while the secret was real. Ruled out — production ships a
genuine site key, verified by its `0x4…` prefix. (Test keys begin `1x`, `2x` or `3x`; the
distinction is invisible unless you read the prefix, which is why "the key is there" wasn't the
same answer as "the right key is there".)

**The actual cause: two Turnstile script tags in conflicting modes on one page.**

`ContactForm` and `AssessmentIntake` use **implicit** rendering — a `<div class="cf-turnstile">`
that Turnstile finds by scanning the page on load, then injects a hidden `cf-turnstile-response`
field into the surrounding form. `FeedbackWidget` uses **explicit** rendering and was loading
`api.js?render=explicit`.

That query parameter turns the auto-scan off **for the whole page**, and the feedback widget
renders site-wide from `BaseLayout` — so on `/contact/` and `/assessment/intake/` both script
tags were present, two different URLs, both `async defer`, racing to decide the page's mode.
When the explicit one won, the intake form's div was never rendered, no token field was created,
an empty token was posted, and the strict Function rejected it with exactly the message the
tester saw.

Every observation fits: `feedback` was unaffected because it renders explicitly and its
container is `fw__turnstile`, deliberately not `cf-turnstile`. `contact` carried the identical
fault and hid it, because it's the lenient one — a missing token falls back to the honeypot and
the mail still sends. So the bug was live on two forms and visible on one.

**The fix** was to drop `?render=explicit` from the feedback widget's script tag. The parameter
only suppresses the auto-scan; `turnstile.render()` is on the global API either way, and that
widget's container is ignored by the scan regardless. All three components now request the
identical URL. **Adding a query param to any one of them re-opens this**, which is why the
omission is commented in place rather than left to look like an oversight.

**Two things kept from the hunt.**

- `turnstileOk()` discarded `data['error-codes']`, so a rejected submit was indistinguishable
  from any other and there was nothing to look at. It now logs them, and logs the no-token case
  separately — that path returns before siteverify, so it would otherwise still be silent. All
  three Functions carry byte-identical copies of that helper by design.
- **Still worth doing:** a pre-launch check that greps the built HTML for
  `1x00000000000000000000AA` and fails if a production build ships the test key. The site key and
  the secret have to move from test to real together, and nothing enforces that.

**The retry loop, fixed the same day.** Turnstile tokens are single-use, and `AssessmentIntake`
and `ContactForm` re-enabled Send without refreshing the widget — so whatever caused a first
failure, every retry after it was guaranteed to fail too. Both now follow Cloudflare's own
guidance for a page that stays active after a submit, and the pattern `FeedbackWidget` already
used: render **explicitly**, retain the widget id, and `reset()` after each attempt. The intake
form additionally refuses to post an empty token, because on the strict Function that is a
certain 403 and "that spam check didn't pass" would be a lie — nothing failed a check; none ran.

That change also raised `vite.build.assetsInlineLimit` to 16 kB. The extra code pushed the intake
wizard's script past Vite's 4 kB default, Astro emitted `dist/_astro/*.js`, and the **0
JavaScript bundles** claim was false for about a minute. The build guard caught it. Worth noting
the claim had been true only by accident until then; it is now enforced by config and by a test.

---

## Filtering on /work

**What.** Filter the work index by the kind of work — pill row, click to narrow, live count of
what's showing. Feedback from a reader, and it gets more useful every time the portfolio grows.

**The model to port.** Cloudbase Foundation's projects page already does this
([preview](https://preview.cloudbase.foundation/projects/), source in `CBF-site`,
`assets/js/projects-filter.js`): two single-select pill rows, additive AND logic between them,
an active-pill class, a reset, and a live "Showing 18 projects" count. That behaviour is the
part worth taking.

**What must not come with it.** Cloudbase fetches `data/projects.json` and rebuilds the grid
with `grid.innerHTML = …`. That's the wrong shape here. This site prerenders every card from
`src/data/projects.js` through `ProjectCard.astro`, so the port filters **nodes already in the
page** — no JSON endpoint, no fetch, no loading or error state, copy stays in `src/data/` where
the content-is-data rule wants it, and a visitor without JavaScript gets the whole list rather
than an empty grid.

**Facets.** Reuse the first segment of `category` — the same key `ProjectCard.astro`'s `GLYPHS`
map already splits out: `software`, `organizations`, `teams`, `physical spaces`, `written work`.
Categories here are compound (`software · systems · design`), so matching is *contains a
segment*, not Cloudbase's `p.category === activeCategory` equality; one project can sit under
more than one facet. One row is enough at ten projects. A second row earns its place somewhere
north of twenty, not before.

**Why it's not done.** Because of a claim this site makes about itself. `/work/this-site`
publishes a metrics card reading **0 JavaScript bundles**, the README repeats it, and both link
to this repo so a reader can check it in a minute.

That claim is specifically about *bundles*, and it is currently true in the strict sense:
`dist/_astro/` holds zero `.js` files, while the three forms ship about 4 KB of inline
`<script type="module">` each. Small inline JavaScript is already how this site does
progressive enhancement, so filtering can follow the same rule — the full list renders
server-side and script only hides and shows.

The threshold to watch is exact: **Astro hoists a script into `dist/_astro/*.js` once it
outgrows the inline limit**, which would falsify that claim in five places at once. Any
implementation has to end with `ls dist/_astro/*.js` still returning nothing.

**The open design question.** A `?filter=software` URL can only be applied by client-side JS on
a static build — the same physics behind the "two thanks pages, not a query param" rule. So a
shareable, linkable filtered view isn't a query string here; it's prerendered
`/work/category/<segment>/` pages. Decide whether linkable views matter *before* writing the
pills, because that answer picks the implementation.

**Worth fixing in the port.** The Cloudbase buttons carry no `aria-pressed` and the count is not
a live region, so a screen reader gets no feedback when the grid changes underneath. Don't
inherit that.

---

## /notes and /now are built but hidden

**What.** Two finished, resolving pages that aren't in the nav or the sitemap.

**Why.** `/notes` shipped before the writing did, and pointing a nav item at "Nothing here yet"
advertises an empty room. `/now` promises currency its "Exploring next" section can't keep —
that section is job-search copy, which reads as role-shopping next to the engagement offer on
`/services`.

**What it takes.** `/notes` unhides the day the first note publishes. `/now` unhides once that
section is rewritten. Each is **two switches that must move together** — the commented-out nav
entry in `src/data/site.js` and the exclusion in `astro.config.mjs`. Both switches say so in
place, and CLAUDE.md carries the full reasoning.

---

## Two projects have no imagery

**What.** Bello Modo and `/work/this-site` have neither a photograph nor a logo.
`public/images/work/` covers the other eight.

**Why it matters.** It's the constraint that shaped the work cards. Every image-based treatment
explored for the index — photo thumbnails, brand marks — failed on exactly these two, which is
why the cards carry a category glyph and metric chips instead: a mark built from data every
project already has, so it can't fail on the eleventh project either.

**What it takes.** A storefront screenshot for Bello Modo, and a photograph of the rack this
site actually builds on. Two standing rules apply: **check for GPS before publishing anything
shot in a private place**, and convert with the `sharp` that already ships inside Astro — it
strips EXIF by default and it isn't a new dependency.

Note what the gap does *not* justify: inventing a logo or a monogram for Bello Modo, Cloudbase
or WAHBE. Those are real organizations with real identities, and a mark I made up for one of
them is the visual version of a fabricated testimonial.
