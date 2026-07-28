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
  integrations: [
    sitemap({
      filter: (page) => !/\/thanks(\/|$)/.test(page),
    }),
  ],
});
