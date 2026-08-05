// Structural guards on the BUILT output in dist/.
//
// These exist because of 2026-08-05: two Turnstile script tags in conflicting render modes on one
// page silently broke the intake form, and nothing in the build noticed. Every check here is one
// that would have failed on that commit. Unit tests can't catch it — the bug was in how three
// components' markup combined on a page none of them owns.
//
// Runs against dist/, so it needs a build first. `npm run build` runs it automatically; running
// it standalone against a stale or missing dist/ skips rather than lying.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TURNSTILE_API = 'challenges.cloudflare.com/turnstile/v0/api.js';
// Cloudflare's documented dummy sitekeys. The first is what src/data/site.js falls back to when
// PUBLIC_TURNSTILE_SITE_KEY is unset — correct locally, catastrophic in production, because a
// dummy token is rejected by a real secret and every strict form stops accepting submissions.
const TEST_SITEKEYS = [
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '1x00000000000000000000BB',
  '2x00000000000000000000BB',
  '3x00000000000000000000FF',
];

function htmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const built = existsSync(DIST);
const pages = built ? htmlFiles(DIST).map((f) => ({ path: relative(DIST, f), html: readFileSync(f, 'utf8') })) : [];

describe('built output', { skip: built ? false : 'no dist/ — run `npm run build` first' }, () => {
  test('every page loads the Turnstile API at most once, and always the same way', () => {
    // THE 2026-08-05 REGRESSION TEST. FeedbackWidget renders site-wide, so its script tag shares
    // a page with ContactForm's and AssessmentIntake's. When one of them asked for
    // `?render=explicit`, the implicit auto-scan was switched off for the whole page and the
    // other form's widget never rendered — producing an empty token and a rejected submit.
    for (const { path, html } of pages) {
      const urls = [...html.matchAll(new RegExp(`${TURNSTILE_API.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*`, 'g'))]
        .map((m) => m[0]);
      const distinct = [...new Set(urls)];
      assert.ok(
        distinct.length <= 1,
        `${path} loads the Turnstile API with ${distinct.length} different URLs:\n  ${distinct.join('\n  ')}\n` +
          'All components must request an identical URL — a query param on one of them switches ' +
          'the render mode for the whole page. See FeedbackWidget.astro.',
      );
    }
  });

  test('every implicit widget sits inside a form, so its token field has somewhere to land', () => {
    // Turnstile injects <input name="cf-turnstile-response"> into the ENCLOSING form. A
    // .cf-turnstile div outside one renders happily and produces a token nothing ever submits.
    for (const { path, html } of pages) {
      if (!html.includes('cf-turnstile')) continue;
      const formless = html
        .split(/<form\b/i)
        .slice(0, 1) // everything before the first <form>
        .join('');
      assert.ok(
        !/class="[^"]*\bcf-turnstile\b/.test(formless),
        `${path} has a .cf-turnstile element before any <form> — its token field would be orphaned`,
      );
    }
  });

  test('a production build never ships a Turnstile test sitekey', () => {
    // Locally PUBLIC_TURNSTILE_SITE_KEY is usually unset and the test key is CORRECT, so this
    // only fails where it matters: CF_PAGES is set by Cloudflare during its own builds.
    const onCloudflare = Boolean(process.env.CF_PAGES);
    const offenders = pages
      .filter(({ html }) => TEST_SITEKEYS.some((k) => html.includes(k)))
      .map(({ path }) => path);

    if (!onCloudflare) {
      assert.ok(true);
      if (offenders.length) {
        console.log(
          `  note: ${offenders.length} page(s) ship a Turnstile TEST sitekey. Expected locally ` +
            '(PUBLIC_TURNSTILE_SITE_KEY unset); this check enforces it only when CF_PAGES is set.',
        );
      }
      return;
    }
    assert.equal(
      offenders.length,
      0,
      `Production build ships a Turnstile TEST sitekey on ${offenders.length} page(s), starting ` +
        `with ${offenders[0]}. A dummy token is rejected by a real secret, so every strict form ` +
        'would refuse submissions. Set PUBLIC_TURNSTILE_SITE_KEY in the Pages build settings.',
    );
  });

  test('all pages agree on one sitekey', () => {
    const keys = new Set();
    for (const { html } of pages) {
      for (const m of html.matchAll(/data-sitekey="([^"]+)"/g)) keys.add(m[1]);
    }
    assert.ok(keys.size <= 1, `pages disagree on the Turnstile sitekey: ${[...keys].join(', ')}`);
  });

  test('still zero JavaScript bundles', () => {
    // "0 JavaScript bundles" is a metrics card on /work/this-site, repeated in the README, next
    // to a link to this public repo. Astro hoists a script into dist/_astro/*.js once it outgrows
    // the inline limit, which would falsify that claim without touching a word of the copy.
    const astroDir = join(DIST, '_astro');
    const bundles = existsSync(astroDir) ? readdirSync(astroDir).filter((f) => f.endsWith('.js')) : [];
    assert.deepEqual(
      bundles,
      [],
      `dist/_astro/ now contains ${bundles.length} JS bundle(s): ${bundles.join(', ')}. ` +
        'Five places on this site claim there are none.',
    );
  });

  test('the pages that must exist, do', () => {
    // Cheap smoke check that a route rename didn't silently drop a form or a redirect target.
    for (const required of [
      'contact/index.html',
      'assessment/intake/index.html',
      'thanks/index.html',
      'thanks/build-assessment/index.html',
    ]) {
      assert.ok(pages.some((p) => p.path === required), `missing built page: ${required}`);
    }
  });
});
