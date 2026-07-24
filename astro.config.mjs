// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output (default) → builds to dist/ for Cloudflare Pages.
export default defineConfig({
  site: 'https://jahutton.build',
  // Exclude the form-redirect target and the still-unapproved Build Assessment draft
  // (offer page + its intake) from the sitemap. Revisit /assessment* at launch.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/thanks/') && !/\/assessment(\/|$)/.test(page),
    }),
  ],
});
