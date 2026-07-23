// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output (default) → builds to dist/ for Cloudflare Pages.
export default defineConfig({
  site: 'https://jahutton.build',
  // Exclude the form-redirect target from the sitemap — it's not a real page.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/thanks/') })],
});
