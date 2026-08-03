// Content collections — the ONE deliberate exception to "content is data, not markup".
// See CLAUDE.md → Architecture for the boundary: markdown is for src/content/notes/ only.
// Every other word on this site still lives in src/data/*.js.
//
// NO NEW DEPENDENCY. Verified against node_modules/astro@7.0.3 on 2026-08-03:
//   · `astro:content` is a virtual module Astro generates from a template inside the
//     package (node_modules/astro/templates/content/module.mjs)
//   · `astro/loaders` is a declared subpath export → dist/content/loaders/index.js,
//     whose runtime exports are exactly [ 'file', 'glob' ]
//   · markdown rendering is @astrojs/markdown-satteri + shiki, both bundled inside astro
// package.json, the README badge, and the /work/this-site metrics card all stay at four.
// Re-check this comment before adding anything to this file.
//
// This is src/content.config.js, not src/content/config.js — the former is the current
// path (astro/dist/content/utils.js → searchConfig), the latter is legacy. `.js` rather
// than `.ts` because this repo has no TypeScript and no tsconfig.json.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  // `[^_]*` is load-bearing: a filename starting with an underscore is invisible to the
  // loader, which is what lets _TEMPLATE.md sit next to the posts without shipping.
  // Flat directory, no subfolders — the entry id is its path, so notes/2026/foo.md would
  // yield the id "2026/foo", which [slug].astro cannot match. Year folders would need
  // [...slug].astro instead.
  loader: glob({ base: './src/content/notes', pattern: '**/[^_]*.md' }),

  schema: z
    .object({
      title: z.string().max(80),

      // REQUIRED, on purpose. This one sentence is the card copy on /notes, the page's
      // <meta name="description">, its og:description, AND the RSS <description> —
      // written once, used four times. Deriving it from the body would give all four a
      // worse answer and would mean stripping HTML to do it.
      description: z.string().max(200),

      // coerce, not z.date(): YAML already turns a bare 2026-08-03 into a Date, and
      // coerce also accepts "2026-08-03" in quotes. An author can't break this by
      // quoting a date.
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),

      // The publish switch, and the only one. Default false, so a note that says nothing
      // about drafts is finished — requiring `draft: false` on every post would be
      // ceremony that eventually gets copy-pasted wrong.
      // A draft is VISIBLE under `npm run dev` and never built in production, so it has
      // no page, no sitemap entry, and no feed item. See src/pages/notes/index.astro.
      draft: z.boolean().default(false),

      // Lifts a note into the "Start here" group above the stream. This exists because
      // rolling notes and evergreen pieces pull in opposite directions: the buyer-question
      // writing is what earns a lead, and in a pure reverse-chron stream it sinks under
      // whatever was posted last month. Keep this to three or four notes — a pinned
      // group that fills the screen is just a second stream.
      pinned: z.boolean().default(false),

      // Optional per-note social card. NOTE this deliberately breaks the site's
      // extensionless-path convention: a social crawler can't negotiate a <picture>, so
      // give it a real single file — /images/notes/whatever.png. Alt is not optional when
      // the image is present; the refine below makes that a build failure, not a review
      // catch.
      ogImage: z.string().optional(),
      ogImageAlt: z.string().optional(),
    })
    .refine((d) => !d.ogImage || d.ogImageAlt, {
      message: 'ogImageAlt is required whenever ogImage is set.',
      path: ['ogImageAlt'],
    }),

  // NO `tags` FIELD, on purpose. Nothing renders tags. A schema field with no renderer is
  // dead weight that invites an author to fill it in for nothing. Add it in the same
  // change as a /notes/tags/<tag> page, never before.
});

export const collections = { notes };
