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

**Read the comments before changing anything.** This codebase carries its own decision record:
source comments state *why*, dated, often naming what was tried and rejected (see
`src/content.config.js`, `src/pages/rss.xml.js`, `astro.config.mjs`, the `nav` array in
`site.js`). They are the reason a change that looks like an obvious cleanup usually isn't. The
two files worth opening first are `src/data/projects.js` (930 lines — every project, every
optional slot, and the rules for each) and `src/pages/work/[slug].astro` (709 lines — the
renderer that consumes them). Everything else is small.

## Commands

```
npm install
npm run dev      # astro dev server (http://localhost:4321)
npm run build    # static build → dist/
npm run preview  # preview the built dist/
```

Node 22 is required (`.nvmrc`, `engines.node >=22.12.0`).

There is no linter or formatter configured. There **is** a test suite as of 2026-08-05
(`npm test`), and it adds **zero dependencies** — `node:test` and `node:assert` ship inside Node
22, which is the only reason it exists at all: a runner in `devDependencies` would falsify the
four-dependency claim in five places to test three files. Don't "upgrade" it to vitest.

```
npm test         # everything: the three Functions + the built-output guards
npm run build    # astro build, then the guards against dist/
```

- **`tests/*.test.js` import the real Functions.** They export `onRequestPost(context)` and use
  only Node globals, so the tests call the actual handlers with fabricated `Request` objects and
  a stubbed `globalThis.fetch` (`tests/helpers.js`). Nothing is reimplemented.
- **What they mostly pin is the failure-policy table** — contact requires Resend; assessment
  requires Resend but must survive Supabase and Claude failing; feedback requires the Supabase
  insert but must survive Claude failing. That inversion is the site's central design idea and
  the thing a refactor is most likely to break silently. If a test named `REQUIRED:` or
  `BEST-EFFORT:` fails, you changed the product, not the plumbing.
- **`tests/build-output.test.js` checks the built HTML**, because the bug that prompted all this
  lived in how three components' markup combined on a page none of them owns — no unit test could
  have seen it. It runs on every build and skips cleanly when `dist/` is absent.
- The test-sitekey guard fails **only when `CF_PAGES` is set**, i.e. during Cloudflare's own
  build. Locally the test key is the correct value and the guard just prints a note. This means a
  production build that would ship a dummy sitekey **fails the deploy on purpose** — that is the
  intent, not a bug to route around.

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
  (name, headline/positioning, nav, socials, `substack`, contact + services + assessment copy,
  beta banner, Turnstile site key), `projects.js` (the `projects` array — the separate writing
  list was deleted 2026-07-23, when the book became a full project card), `intake.js` (the
  multi-step Build Assessment form's questions/options), `about.js` (the bio, the tool list,
  and the page's remaining sections), `privacy.js`, `colophon.js` (the
  stack-diagram data for the `/work/this-site` exhibit), `notes.js` (the `/notes` furniture —
  lead, empty state, labels). Pages and components map over these;
  components are presentation-only. To change wording or add a project, edit the data file — never hard-code
  copy into `.astro` files. (`substack` is the outbound subscribe link `SubstackEmbed` puts on
  `/about` — an anchor, not an iframe; the embed read as clunky and was dropped.)

  **Segment arrays are how a sentence carries a link or emphasis** — `'plain text'`,
  `{ href, text }`, `{ strong }`, `{ em }` — because data files are escaped by Astro and never
  touch the markdown pipeline. Documented in `about.js`; also used by project blurbs and, since
  2026-08-04, `services.intro` (the only segment field in `site.js`; everything else there is a
  plain string). Convert a field only when it actually needs a link, and give the page the same
  three-line `asSegments` renderer the others use rather than a new one.

  **The one exception: `/notes` bodies are markdown**, in `src/content/notes/*.md`, via an
  Astro content collection (`src/content.config.js`). Added 2026-08-03. Prose with headings,
  lists, quotes and code inside a JS file is markup smuggled into data — the thing this rule
  exists to prevent — and the segment-array trick in `about.js` (right for two bold sentences)
  does not scale to a post. **The boundary is exact: markdown is for `src/content/notes/`
  only. Every other word on the site still lives in `src/data/*.js`.** Don't widen it.

  **Zero new dependencies, and that's load-bearing.** Content collections, the `glob` loader,
  and markdown rendering all ship inside `astro` itself; `/rss.xml` is a hand-written endpoint
  rather than `@astrojs/rss`. The count of **four** is claimed in the README badge, the README
  prose, the `/work/this-site` teaser and blurb, and a metrics card on that page — which links
  to this public repo, so a reader can check it in a minute. Adding a package to this feature
  falsifies all five at once.

- **Pages** (`src/pages/`): `index`, `work`, `work/[slug]`, `services`, `about`, `now`, `contact`,
  `notes`, `notes/[slug]`, `assessment`, `assessment/intake`, `privacy`, `thanks`,
  `thanks/build-assessment`, `404`. Each is
  a thin `.astro` file wrapping `BaseLayout` and rendering data. `rss.xml.js` is the site's
  **only endpoint** — a `.js` file exporting `GET`, prerendered to `dist/rss.xml`.
  **`/notes` is currently hidden** (2026-08-03), by the same two switches as `/now` and for a
  related reason: the surface shipped before the writing exists, and pointing the nav at
  "Nothing here yet" advertises an empty room. The commented-out nav entry in `src/data/site.js`
  and the `/notes` exclusion in `astro.config.mjs` move together on the day the first note
  publishes. Both say so.

- **`/notes` — the publishing surface.** Rolling short notes, reverse-chronological, dated.
  A note is one markdown file; **the filename is the URL** and the directory is flat (the
  entry `id` is its path, so a subfolder would yield `2026/foo` and `[slug].astro` couldn't
  match it). Frontmatter: `title`, `description`, `date` required; `draft`, `pinned`,
  `updated`, `ogImage`/`ogImageAlt` optional.
  `description` is required because one sentence does four jobs — the index card, the meta
  description, the OG description, and the RSS summary.
  **`draft: true` is one predicate with four consumers** — the index, `getStaticPaths()`, the
  feed, and the sitemap *by consequence*: a draft has no page, so there is nothing to crawl
  and **no sitemap rule for drafts exists or is needed**. Drafts render under `npm run dev`
  and never in a production build. `src/content/notes/kitchen-sink.md` is a permanent draft
  that exercises every element `.prose-md` styles — a free regression test; keep it.
  **A leading underscore hides a file from the loader entirely** — the glob pattern is
  `**/[^_]*.md`, which is what lets `_TEMPLATE.md` sit in the notes directory without being a
  note (no schema validation, no page, no feed item). Start a new note by copying that
  template; it documents the frontmatter in the place an author is already looking. Two
  different mechanisms, don't confuse them: `_` means *not content*, `draft: true` means
  *content that isn't published yet*.
  **`pinned: true`** lifts a note into the "Start here" group above the stream. It exists
  because rolling notes and evergreen pieces pull opposite ways: the buyer-question writing
  is what earns a lead, and in a pure reverse-chron list it sinks under last month's post.
  Keep it to three or four; a pinned group that fills the screen is just a second stream.
  **No cadence is promised anywhere** — no "last updated", no "latest post". That is
  deliberate, and it is the lesson from `/now`: a surface that promises currency and can't
  keep it gets hidden. An archive promises nothing, so a quiet month looks like nothing.
  **Notes are Jonathan's writing.** Per the voice guide, Claude builds the surface and drafts
  only the furniture in `notes.js` — never a note.
  **`/now` is currently hidden** (2026-07-29): still built and still resolving, but pulled from the
  nav and the sitemap until its "Exploring next" section is rewritten — it's job-search copy, which
  reads as role-shopping next to the engagement offer on `/services`. Two switches, and they must
  move together: the commented-out nav entry in `src/data/site.js` and the `/now` exclusion in
  `astro.config.mjs`. Both say so.

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
  `blurb` is either a string or an **array**; both the card and the detail page normalize it and
  render one `<p>` per entry. It's plain text through Astro's escaping — no markdown, no HTML (use
  curly quotes, not `_italics_`). An array entry may also be a **list block** — `{ heading, items }`
  — rendering as a small heading plus a `<ul>` (WAHBE's two inventories). Use it only where the copy
  is genuinely a list; prose that's been bulleted for looks is worse than the paragraph it came from.
  A detail page has two link slots and they
  do different jobs: `link` is the CTA pill under the body, `source` is a muted GitHub icon link
  pinned to the bottom — evidence, not a CTA. `link` is one `{ href, label }` or an array of them
  (first = solid pill, rest = ghost) and drops `rel="noopener"` for internal hrefs. The convention:
  a project links to **the live thing** where one exists (chelancomps, and Unflappable's
  unflappable.press as its ghost second link); where none does, the pill is `/contact/`. **Seven
  of ten** carry a contact pill — Bello Modo, Unflappable, server closet, the remodel, Cloudbase,
  Ascension, this site. Four of those close by turning to the reader, which is the clearest case;
  Bello Modo and Cloudbase end on the client's outcome and carry one anyway, because there's
  nothing live to point at. Don't read the "ends by asking" pattern as the gate — it correlates,
  it doesn't decide.
  **The label must NOT echo the closing line it sits under** — Jon rejected exactly that on
  2026-07-28 as cheesy; quoting his own sentence back at him reads as a template. Keep labels plain,
  and **keep them different from each other** — with seven in play the generic ones are spent
  ("Let's chat", "Let's talk", "Let's connect", "Get in touch", "Work with me", "Start building
  together"), so an eighth needs a genuinely new one. Identical CTAs across pages are the tell
  that nobody wrote them.
  An optional `diagram: true` renders the **stack exhibit** (`StackDiagram.astro`, data in
  `colophon.js` → `stack`) under an **"Under the hood"** heading below the CTA — the heading
  fences the technical material off as an appendix so it doesn't read as the page's headline.
  Two audiences, one artifact: the **boxes** are checkable facts for a reader evaluating whether
  Jon can build, the **notes** are plain language for a client deciding what it's like to own the
  thing. Without the notes it's just a wiring diagram — which is the failure mode Jon rejected on
  2026-07-30, so `note` (and `heading`/`lead`) are **Jonathan's to write** and render nothing
  while null. Specific to this site's own case study; not a general "architecture diagram" slot.
  It replaced the request-flow diagram on 2026-07-30; that component and its data were deleted
  in the same change rather than left unrendered, and are recoverable from git history.
  An optional `hero` ({ src, width, height, alt, caption }) is a scene-setter **above the body**,
  under the title and role — context, not evidence, which is why it sits outside the exhibit zone.
  It is the one eager-loaded image on the page. The slot caps by **height, not width**
  (`max-width: min(56rem, 30rem × aspect)`), because a 1.95:1 panoramic and a 1:1 square can't
  share one max-width without the square swallowing the page; `--ar` is emitted inline from the
  real pixel dims. Convert sources with the `sharp` that already ships inside Astro — no new
  dependency, and it strips EXIF by default. **Check for GPS before publishing any photo of a
  private place.**
  An optional `components` ({ heading, lead, placement, items: [{ name, items, link }] }) renders
  labelled cards with pills, via `ProjectParts.astro`. It reuses
  `TechStack.astro`'s pattern so the two exhibits that enumerate parts look like one idea, but its
  labels are rust rather than muted: there the label names a shelf of other people's tools, here
  it names something Jon built. Added 2026-08-02, replacing a single info callout that described
  one component and so misrepresented the scope; that slot was deleted, not left unrendered.
  **`placement` is a real editorial decision, not a layout preference** (added 2026-08-03):
  default is **above the body**, for a project where the *scope* is the headline and burying it
  under prose makes a multi-part system read as one app (chelancomps). `placement: 'after'` puts
  it below the prose, for a project where the deliverables are the *payoff* and the narrative has
  to set them up (Cloudbase — the body describes an organization in decline, the cards are the
  proof). It was inline in `[slug].astro` until the second placement existed; two positions meant
  duplicating the markup or lifting it, and duplicated markup is the version that drifts.
  `lead` is an optional standfirst under the heading — on Cloudbase it carries Jon's own "already
  passed, or will be very soon," which is what keeps a not-yet-shipped item honest.
  **The card labels earn their keep by echoing the body.** Cloudbase's three come straight out of
  the sentence above them ("finding the right people, getting aligned on purpose and direction,
  and then getting our hands dirty"), so the exhibit proves the line rather than repeating it. A
  flat list of nine bullets reads as busywork; three groups read as someone who knows what an
  organization is made of. Group by the client's own framing where one exists.
  An optional `metrics` array puts outcome numbers — `{ icon, value, label }` — in the same
  evidence zone as the testimonial, above the CTA: proof, then the ask. `icon` keys a small
  inline glyph set that lives in `src/components/ProjectMetrics.astro` — add a key there when a
  metric needs a glyph that isn't in it, and delete one that stops being used; an unknown or
  omitted key renders the number without a glyph rather than breaking the row.
  `value` is usually a number but may be a **short noun** where that's a checkable fact
  ("Dev cloud"); never where it asserts quality ("Hardened", "enterprise-grade").
  **These are public claims about a real client — same bar as the testimonial. Never invent or
  round one; every value comes from Jonathan, and the comment records the date he gave it.**
  An optional `testimonial`
  ({ quote, name, role, org, photo, placeholder, placement }) renders a quote block between the
  body and the CTA, via **`ProjectTestimonial.astro`** — round photo, or an initials monogram
  when there's no headshot yet. **`placeholder: true`
  prints a visible "not a real quote" flag; never strip it from invented copy.**
  **While a testimonial is a placeholder, `name` is a first name only** — Austin, Bailey,
  Timothy (Jon's call, 2026-08-04, applied to all three at once). The flag stops the quote
  deceiving anyone, but a fabricated sentence sitting under a full name still attaches invented
  words to one specific, findable person. A surname goes in when that person has seen the quote
  and agreed to be named — same gate as adding their `photo`. Don't "complete" one from the
  source comments or a git message.
  **`placement: 'after-cta'`** flips the block below the CTA. Default is quote-then-CTA — proof
  between the story and the ask. Ascension is the only page that inverts it (Jon, 2026-08-04),
  because its quote is a placeholder and a block flagged "not a real quote" shouldn't stand
  between the reader and the ask; delete the line when the real quote lands and the page returns
  to the default with no other change. **That second position is what lifted the markup out of
  `[slug].astro` into its own component** — same reasoning as `ProjectParts`, and the `.quote`
  styles moved with it, because Astro scopes CSS per component and a rule left behind in the
  page would silently reach nothing.
  An optional `logo` ({ src, width, height, alt, note }) puts a brand mark **at the top, under
  the title and role and above the body** (Jon's call, 2026-08-04) — Ascension is the only
  project with one and has no `hero`, so the mark does the hero's job. It used to sit with the
  body, on the reasoning that designing the mark was part of
  the job; on the one page that carries one it interrupted the narrative mid-story. Position is
  unconditional, not a `placement` prop: Ascension is the only project with a logo and a second
  position doesn't exist yet. Add the flag when a second case needs it, not before.
  An optional `gallery` is an array of groups: `{ heading, caption, note, shots: [{ label, img }] }`.
  `shots` is **ordered** and renders as columns in that order — two for a before/after, three where
  the design belongs between them (the bathroom's SketchUp model). `heading` is for a page covering
  distinct subjects (the remodel's two rooms) and omitted otherwise; `note` replaces shots for a
  group that's real work with nothing shippable yet, and says so plainly. Image `src` is the
  **extensionless** public path — the page appends `.webp` for the `<source>` and `.jpg` for the
  `<img>` — and `width`/`height` are the true pixel dims, so the page doesn't jump while they load.
  Half a before/after is worse than none: a group waits for its "after" rather than shipping alone.

- **`BaseLayout.astro`** wraps every page: imports fonts + global CSS, renders `Banner`/`Header`/
  `Footer`, sets `<title>`/description/canonical/OG tags (overridable via props), skip link.
  Two things that are easy to miss because no page opts into them: **`FeedbackWidget` renders
  site-wide** from here (so the feedback Function is reachable from every page, not just one),
  and so does the **`/rss.xml` autodiscovery `<link>`** — site-wide because the layout has no
  `<head>` slot for a page to add one. The `ogType`/`publishedTime`/`modifiedTime` props exist
  for `/notes/<slug>` only; their defaults leave every other page's `<head>` byte-identical.

- **Styling** is two plain CSS files, no framework:
  - `src/styles/tokens.css` — the design system: color roles, the Fraunces/Inter type scale, spacing,
    layout widths. **This scale is shared verbatim with unflappable.press** — keep them in sync.
  - `src/styles/global.css` — element and component styles built on those tokens, plus the
    **`.prose-md`** block for markdown output (`/notes` bodies). Three things about it:
    it is deliberately **not** `.prose` (that class is used on `/about`, `/now` and every
    `/work/<slug>`, each defining its own rules in a scoped block — redefining it globally
    would restyle twelve pages); **every selector is scoped under `.prose-md`**, because a
    bare `blockquote` would hit the testimonial on ten project pages and a bare `ul` would
    hit `/privacy`, `/services` and the footer; and it can't live in a page's scoped
    `<style>` because **Astro's scoping can't reach markdown output** — generated HTML
    carries no `data-astro-cid` attribute, so a scoped rule silently does nothing.
  Direction is "warm editorial": paper/cream ground, ink text, Fraunces headlines, rust accent.
  One style decision lives outside both files: `markdown.shikiConfig.theme` in `astro.config.mjs`
  is `github-light`, because Astro's default (`github-dark`) drops a black slab into the paper
  page. Shiki emits the theme background as an **inline** style on `<pre class="astro-code">`, so
  no CSS rule in `global.css` can override it — the fix has to be the config line.

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

- **Sitemap exclusions** live in `astro.config.mjs`. Currently filtered: **`/thanks*`** (post-submit
  redirect targets, nothing to crawl), **`/now`** (hidden pending a rewrite — see Pages above),
  and **`/notes`** (hidden until the first note publishes — an empty "Nothing here yet" page is
  a thin result for the one surface whose whole job is being found).
  The filter is **path-anchored** (`new URL(page).pathname`) as of 2026-08-03. It used to test
  the whole URL, which meant a note published at `/notes/now/` or `/notes/thanks/` would have
  been silently dropped. Individual notes need no rule, drafts need no rule (they have no page),
  and `/rss.xml` can't appear at all — `@astrojs/sitemap` only lists routes of type `page`, and
  an endpoint isn't one.
  **`/assessment*` is deliberately NOT excluded** as of 2026-07-28: it's linked from `/services` and
  `/contact`, so hiding it from the sitemap while advertising it everywhere else would just be a
  worse version of being indexed. Jon confirmed 2026-07-29 he's fine with it indexable. Don't
  "restore" that exclusion — it was removed on purpose.

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

- **`.prose` vs `.prose-md`.** Two different things. `.prose` is the hand-authored pages'
  hook, styled per-page in scoped blocks; `.prose-md` is the markdown one, styled globally.
  Don't merge them, and don't add bare element rules to `global.css` for markdown's sake —
  see the Styling section for what each would break.
- **The nav active state was dead site-wide until 2026-08-03.** `Header.astro` tested
  `path === item.href`, but Astro's default `build.format: "directory"` renders `/work/`
  while `site.js` writes `/work` — so `aria-current="page"` appeared on **zero** pages and
  the rust underline had never rendered in production. Now a prefix match, which also keeps
  a section lit on its detail pages. If nav hrefs ever gain trailing slashes, `isActive()`
  already strips them.
- **Four docs, four jobs — keep them in their lanes.** `README.md` is for a visiting hiring
  manager: short, and its claims (four dependencies, fourteen components, ten detail pages, what
  talks to what) are checkable against the repo, so a change to the architecture is a change to
  the README. **This file** is the working rules — every convention and the reason for it.
  `docs/architecture.md` is the current shape plus the **dated decision log**, including
  superseded decisions; add an entry there when a decision changes, rather than only editing the
  prose around it. It was rewritten 2026-08-04 after being stale since ~2026-07-23 (it described
  Formspree, Groundcrew, and "no detail pages"); it is accurate now, so don't carry the old
  "treat it as stale" warning forward. **`docs/roadmap.md`** (added 2026-08-05) is the inverse of
  `architecture.md`: that file is what the site *is* and why, this one is what it **isn't yet and
  why not** — feedback and known gaps that shouldn't block launch, newest first, each entry
  saying what it is, why it's not done, and what it would take. It is public and held to the same
  bar as the rest: no speculative feature lists, no dates. Put a deferred idea there rather than
  in a `// TODO` nobody reads. Source wins over all four.
- **`.claude/` is gitignored and holds worktrees** — full untracked copies of the repo including
  `node_modules/` and `dist/`. Repo-wide greps/finds will return duplicate hits; scope searches to
  `src/`, `functions/`, `supabase/`, and `docs/`.

## Planning / private context

`.temp/` is gitignored and holds the living planning doc, the voice guide, and job-search drafts.
Keep `.temp/PLANNING.md` current every working session (per the `maintain-living-planning-doc`
memory) — open action items, decisions with dates, session log. The locked positioning/strategy doc
lives at `~/.claude/plans/misty-dreaming-hinton.md`.
