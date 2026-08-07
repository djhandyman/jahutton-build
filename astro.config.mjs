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
  // /welcome IS excluded (2026-08-06) — the splash shown to anyone who reaches the site while
  // Cloudflare Access guards it. Excluded because it's TEMPORARY, not because it's private: a
  // "coming soon" page is the thin result that sits in front of the real home page for weeks
  // after launch. The page also carries a `noindex` meta tag; that and this move together, and
  // both are deleted on the day the Access application comes off. See `splash` in site.js.
  //
  // Individual notes never needed a rule: a draft has no page, so there is nothing to
  // crawl and nothing to exclude. /rss.xml can't appear either — it's a route of type
  // "endpoint", and @astrojs/sitemap only ever lists routes of type "page".
  integrations: [
    sitemap({
      // Anchored to the PATH, not tested against the whole URL. The old form matched
      // anywhere in the href, so a note published at /notes/now/ or /notes/thanks/ would
      // have been silently dropped from the sitemap.
      filter: (page) => !/^\/(thanks|now|notes|welcome)(\/|$)/.test(new URL(page).pathname),
    }),
  ],

  // "0 JavaScript bundles" is a metrics card on /work/this-site, repeated in the README, both
  // next to a link to this public repo. It has always been true — but until 2026-08-05 it was
  // true by ACCIDENT: Vite emits a script as an external file once it exceeds
  // assetsInlineLimit (4 kB by default), and the intake wizard's script sat just under that.
  // Adding the Turnstile reset logic pushed it to 4,259 bytes and dist/_astro/ gained its first
  // .js file — caught by tests/build-output.test.js, which is exactly why that guard exists.
  //
  // Raising the limit makes the intent explicit: scripts on this site are inline, deliberately,
  // and a routine edit to a form must not silently falsify a public claim. 16 kB leaves real
  // headroom over the largest script (the intake wizard) without being an invitation to ship a
  // framework. If something ever genuinely needs more than this, the honest move is to change
  // the claim, not to raise the number again.
  vite: {
    build: { assetsInlineLimit: 16384 },
  },

  markdown: {
    // Astro's default Shiki theme is github-dark, which drops a black slab into a
    // #faf7f1 paper page — confirmed in the build output of the kitchen-sink note.
    // github-light is bundled inside the shiki that ships inside astro: a config line,
    // not a dependency.
    shikiConfig: { theme: 'github-light' },
  },
});
