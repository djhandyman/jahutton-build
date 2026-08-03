// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output (default) → builds to dist/ for Cloudflare Pages.
export default defineConfig({
  site: 'https://jahutton.build',
  // Exclude the form-redirect targets from the sitemap — /thanks/ and its
  // /thanks/build-assessment/ variant are both post-submit pages with nothing to crawl.
  //
  // /assessment* is no longer excluded (2026-07-28): the Build Assessment is linked from
  // /services and /contact now, so hiding it from the sitemap while linking it everywhere
  // else would just be a worse version of being indexed.
  //
  // /now IS excluded (2026-07-29): it's pulled from the nav until its "Exploring next"
  // section is rewritten — it reads as role-shopping next to /services. The page still
  // builds and still resolves, so any existing link to it keeps working; it's just not
  // advertised. Drop this and restore the nav entry in src/data/site.js together.
  // /notes IS excluded for now (2026-08-03), for the same reason and by the same pattern
  // as /now: the page ships before the writing does, and an empty "Nothing here yet" page
  // in the sitemap is a thin result for the one surface whose whole job is being found.
  // Drop this exclusion and uncomment the nav entry in src/data/site.js together, on the
  // day the first note publishes. Both say so.
  //
  // Individual notes never needed a rule: a draft has no page, so there is nothing to
  // crawl and nothing to exclude. /rss.xml can't appear either — it's a route of type
  // "endpoint", and @astrojs/sitemap only ever lists routes of type "page".
  integrations: [
    sitemap({
      // Anchored to the PATH, not tested against the whole URL. The old form matched
      // anywhere in the href, so a note published at /notes/now/ or /notes/thanks/ would
      // have been silently dropped from the sitemap.
      filter: (page) => !/^\/(thanks|now|notes)(\/|$)/.test(new URL(page).pathname),
    }),
  ],

  markdown: {
    // Astro's default Shiki theme is github-dark, which drops a black slab into a
    // #faf7f1 paper page — confirmed in the build output of the kitchen-sink note.
    // github-light is bundled inside the shiki that ships inside astro: a config line,
    // not a dependency.
    shikiConfig: { theme: 'github-light' },
  },
});
