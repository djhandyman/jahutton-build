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

// HTML comments are stripped before any check. Astro ships them to the output, and several of
// them quote the very markup these guards forbid — the `class="cf-turnstile"` warning in
// ContactForm.astro tripped its own guard the first time this ran.
const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

const built = existsSync(DIST);
const pages = built
  ? htmlFiles(DIST).map((f) => ({
      path: relative(DIST, f),
      html: stripComments(readFileSync(f, 'utf8')),
    }))
  : [];

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

  test('nothing renders implicitly any more', () => {
    // As of 2026-08-05 all three widgets render EXPLICITLY, so their ids can be retained and
    // reset between attempts (tokens are single-use; without that, every retry fails). A
    // `cf-turnstile` class reappearing means either a widget that gets double-rendered, or a
    // component that once again depends on the page-wide auto-scan — the exact coupling that
    // broke the intake form.
    for (const { path, html } of pages) {
      assert.ok(
        !/class="[^"]*\bcf-turnstile\b/.test(html),
        `${path} contains a .cf-turnstile element. Every widget on this site renders explicitly ` +
          'via turnstile.render() — see ContactForm.astro. Implicit rendering reintroduces the ' +
          'page-wide render-mode coupling and loses the widget id needed to reset it.',
      );
    }
  });

  test('each form page still carries its widget container', () => {
    // The flip side: having removed the class the auto-scan keyed on, make sure the explicit
    // containers themselves didn't get dropped in some later tidy-up. A form with no widget
    // silently posts an empty token, which the strict Functions reject.
    // EMPTY as of 2026-11-13: both forms are off the site (contact.formEnabled in site.js, and
    // the parked _assessment/ pages). Put 'contact/index.html' and 'assessment/intake/index.html'
    // back here as each form returns — the guard below is why this test exists.
    for (const required of []) {
      const page = pages.find((p) => p.path === required);
      assert.ok(page, `missing built page: ${required}`);
      const containers = [...page.html.matchAll(/data-turnstile\b/g)].length;
      assert.ok(containers >= 1, `${required} has no [data-turnstile] container`);
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
    // 2026-11-13: 'assessment/intake/index.html', 'thanks/index.html' and
    // 'thanks/build-assessment/index.html' left this list when those pages were parked. They
    // go back in when the pages do.
    for (const required of ['contact/index.html']) {
      assert.ok(pages.some((p) => p.path === required), `missing built page: ${required}`);
    }
  });

  test('a form is only on a page while its endpoint is open', () => {
    // The page-side half of the pairing in functions/api/_middleware.js. Every endpoint in
    // CLOSED answers 503, so a form rendered over one fails on every submit — and a parked page
    // that quietly starts building again is an offer back on the site that nobody switched on.
    // Reopening means editing CLOSED and this test in the same change; that is the point.
    const formPages = pages.filter(({ html }) => /<form\b[^>]*action="\/api\//.test(html));
    assert.deepEqual(
      formPages.map((p) => p.path),
      [],
      'these pages render a form that posts to /api/, but every form endpoint is closed',
    );
    for (const parked of ['services/', 'assessment/', 'thanks/']) {
      const stray = pages.filter((p) => p.path.startsWith(parked)).map((p) => p.path);
      assert.deepEqual(stray, [], `${parked} is parked (src/pages/_*) but was built`);
    }
    for (const { path, html } of pages) {
      assert.ok(
        !/href="\/(services|assessment|thanks)(\/|")/.test(html),
        `${path} links to a page that is not built`,
      );
    }
  });
});
