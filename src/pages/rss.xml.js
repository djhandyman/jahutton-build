// RSS 2.0, hand-written.
//
// @astrojs/rss would be a FIFTH dependency for about forty lines of string building, and
// the number four is a public claim in four places that all move together: the shields.io
// badge in README.md, the "Four dependencies" line under the what-I-didn't-build table,
// and — on /work/this-site — the teaser, the blurb, and a metrics card. That page carries
// a "View on GitHub" link, so a reader can check package.json in under a minute.
//
// A .js file under src/pages/ exporting GET is a route of type "endpoint". With static
// output and no adapter it is prerendered to dist/rss.xml at build time; no
// `export const prerender = true` is needed.
//
// It is an ENDPOINT, not a page, which is why it never appears in the sitemap and needs no
// filter rule: astro's build only calls addPageName() when route.type === "page", and
// @astrojs/sitemap likewise skips every route whose type isn't "page".
//
// This is also not a newsletter. No list, no send, no obligation — it's how someone
// follows the notes without handing over an email address.
import { getCollection } from 'astro:content';
import { site as siteData } from '../data/site.js';
import { notes as copy } from '../data/notes.js';

// XML escaping. The ampersand MUST be replaced first, or the entities introduced by the
// later replacements get double-escaped into &amp;lt;.
// CDATA was the alternative and is worse: it breaks on a literal "]]>" in a title and buys
// nothing here, since every value below is short plain text.
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(context) {
  // context.site is the `site:` value from astro.config.mjs, as a URL.
  const base = context.site;

  // Note the predicate: !draft with NO dev escape hatch. The pages show drafts under
  // `npm run dev` so they can be previewed; a feed never should.
  const entries = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date - a.data.date,
  );

  const items = entries
    .map((n) => {
      const url = new URL(`/notes/${n.id}/`, base).href;
      // toUTCString() → "Mon, 03 Aug 2026 00:00:00 GMT" — RFC 1123, which every reader
      // accepts as the RFC 822 date RSS asks for. No date library.
      return `    <item>
      <title>${esc(n.data.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${n.data.date.toUTCString()}</pubDate>
      <description>${esc(n.data.description)}</description>
    </item>`;
    })
    .join('\n');

  // Zero entries is fine: a channel with no items is valid RSS.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${copy.title} — ${siteData.name}`)}</title>
    <link>${esc(new URL('/notes/', base).href)}</link>
    <description>${esc(copy.lead)}</description>
    <language>en-us</language>
    <atom:link href="${esc(new URL('/rss.xml', base).href)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  // Summary only, no <content:encoded>. The rendered HTML is available without the
  // container API (entry.rendered.html), but relative links and /images/... sources inside
  // it break in a feed reader, so shipping full text means writing a URL-rewriting pass
  // first. Summary-only is the honest v1.
  //
  // ⚠️ This header is BUILD-TIME ONLY. In a static build the body is written to
  // dist/rss.xml and the header is discarded — Cloudflare Pages then serves the file with
  // a Content-Type derived from the .xml extension (application/xml), which every reader
  // accepts. Getting application/rss+xml would take a public/_headers file, not a change
  // here.
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
