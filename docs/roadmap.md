# Roadmap — jahutton.build

`architecture.md` is what this site is and why. This file is what it **isn't yet, and why not**.

Entries land here when a good idea arrives that shouldn't hold up launch — feedback from a
reader, a pattern worth borrowing, a gap I already know about. Each one says what it is, why
it's not done, and what it would actually take. Nothing here is a promise, and there are no
dates: a roadmap that commits to a quarter is a roadmap that lies twice a year.

Newest first.

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
