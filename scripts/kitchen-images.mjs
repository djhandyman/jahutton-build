// Builds every image /kitchen uses, plus src/data/kitchen-photos.js, from the party's originals.
//
//   npm run kitchen:images
//
// Added 2026-11-12. Inputs live in source-assets/kitchen-reveal/ (gitignored — 738 MB of
// originals); outputs are committed: public/images/kitchen/ and src/data/kitchen-photos.js.
//
// WHY A SCRIPT rather than astro:assets' <Picture>: the rest of the site pre-converts its images
// into public/ with the sharp that ships inside Astro (see the `hero` notes in CLAUDE.md), and a
// Cloudflare build that re-encodes ~250 variants on every deploy is slower for no gain — these
// photos don't change once the page ships. This extends the existing convention (extensionless
// src, .webp + .jpg) with a width ladder for srcset. `sharp` is Astro's own dependency, so this
// adds nothing to package.json's dependency count.
//
// WHAT IT DOES
//   · Reads "Titles and captions.csv" — the source of truth for every title and caption — and
//     writes them VERBATIM into kitchen-photos.js. Nothing is typed by hand.
//   · Skips every id in kitchen.js → heldPhotos. A held photo never reaches public/, because a
//     file there is fetchable by URL whether or not a page links it.
//   · Wipes public/images/kitchen/ first, so un-holding or re-holding a photo is always exact.
//   · Strips all metadata (sharp's default) — no EXIF, no GPS. The sources had none on
//     2026-11-12, but a replacement showcase photo straight off a phone will.
//   · Adds kitchen.js → extraPhotos (unprinted stills, pre-converted into Extras/), drafts flagged.
//   · Crops any filled before/after "after" photo to its before's proportions.
//   · Generates the hero ladder and the 1200×630 share image (og.jpg) from kitchen.js → hero,
//     and any filled showcase slots.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { sourceDir, heldPhotos, extraPhotos, hero, beforeAfter, showcase } from '../src/data/kitchen.js';

const OUT = 'public/images/kitchen';
const URL_BASE = '/images/kitchen';
const DATA_OUT = 'src/data/kitchen-photos.js';
const PRINTS = path.join(sourceDir, 'Reveal prints');
const LADDER = [480, 960, 1440]; // phone, phone@2x / desktop column, viewer
const JPG_MAX = 960; // the <img> fallback only serves browsers without WebP — keep it light

// ── CSV (RFC 4180 enough for this file: quoted fields, doubled quotes, commas in captions) ──
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some(Boolean));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Writes the width ladder (.webp) plus one .jpg, returns what the page needs to build srcset.
async function ladder(src, base, { ladderMax = LADDER.at(-1) } = {}) {
  const meta = await sharp(src).rotate().metadata();
  const srcW = meta.autoOrient?.width ?? meta.width;
  const srcH = meta.autoOrient?.height ?? meta.height;
  const top = Math.min(srcW, ladderMax);
  const widths = [...new Set([...LADDER.filter((w) => w < top), top])];
  for (const w of widths) {
    await sharp(src).rotate().resize({ width: w }).webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT, `${base}-${w}.webp`));
  }
  const jpgW = Math.min(srcW, JPG_MAX);
  await sharp(src).rotate().resize({ width: jpgW }).jpeg({ quality: 76, mozjpeg: true })
    .toFile(path.join(OUT, `${base}.jpg`));
  return {
    src: `${URL_BASE}/${base}`,
    widths,
    width: top,
    height: Math.round((srcH * top) / srcW),
  };
}

// ── go ──
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'photos'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'exhibits'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'showcase'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'before-after'), { recursive: true });

const rows = parseCsv(fs.readFileSync(path.join(PRINTS, 'Titles and captions.csv'), 'utf8'));
const photos = [];
const skipped = [];
for (const r of rows) {
  const id = r.file.slice(0, 5); // "05-03"
  if (heldPhotos[id]) { skipped.push(`${id} ${r.title} — ${heldPhotos[id]}`); continue; }
  const src = path.join(PRINTS, 'All photos by stage', r.stage, r.file);
  if (!fs.existsSync(src)) throw new Error(`CSV names a file that isn't there: ${src}`);
  const img = await ladder(src, `photos/${id}-${slugify(r.title)}`);
  photos.push({
    id,
    stage: r.stage.slice(0, 2),
    // Print-set number ("24") or null for an extra — the page leads with the print set.
    print: r.print_set ? Number(r.print_set.slice(0, 2)) : null,
    title: r.title,
    caption: r.caption,
    img,
  });
}
// The extras (kitchen.js → extraPhotos): unprinted stills, already converted to JPEG in Extras/.
// Their titles and captions are Claude's drafts, so they carry `draft: true` through to the data.
for (const x of extraPhotos) {
  const src = path.join(sourceDir, 'Extras', x.file);
  if (!fs.existsSync(src)) throw new Error(`extraPhotos names a file that isn't there: ${src}`);
  const img = await ladder(src, `photos/${x.id}-${slugify(x.title)}`);
  photos.push({ id: x.id, stage: x.id.slice(0, 2), print: null, title: x.title, caption: x.caption, draft: true, img });
}
// The id is the position: "07-13a" lands between 07-13 and 07-14.
photos.sort((a, b) => a.id.localeCompare(b.id));

// The poster illustrations (see kitchen.js → claude). Capped smaller: they're diagrams in a card.
const exhibits = {};
for (const f of fs.readdirSync(path.join(sourceDir, 'Exhibits')).filter((f) => !f.startsWith('.'))) {
  const name = f.replace(/\.[^.]+$/, '');
  exhibits[name] = await ladder(path.join(sourceDir, 'Exhibits', f), `exhibits/${name}`, { ladderMax: 1200 });
}

// Hero + share image.
const heroSrc = path.join(sourceDir, hero.source);
const heroImg = await ladder(heroSrc, 'hero', { ladderMax: 1600 });
{
  const m = await sharp(heroSrc).rotate().resize({ width: 1200 }).toBuffer({ resolveWithObject: true });
  const h = m.info.height;
  const top = Math.max(0, Math.min(h - 630, Math.round(h * hero.ogFocus - 315)));
  await sharp(m.data).extract({ left: 0, top, width: 1200, height: Math.min(630, h) })
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'og.jpg'));
}

// Showcase slots that have been filled. Empty ones render as placeholders and need nothing here.
const showcaseImages = {};
for (const slot of showcase.slots) {
  if (!slot.source) continue;
  showcaseImages[slot.id] = await ladder(path.join(sourceDir, slot.source), `showcase/${slot.id}`, { ladderMax: 1800 });
}

// Before/after pairs whose after photo exists. The after is cropped (centered) to the before's
// proportions so the two line up under the slider.
const afterImages = {};
for (const pair of beforeAfter.pairs) {
  const before = photos.find((p) => p.id === pair.before);
  if (!before) throw new Error(`beforeAfter "${pair.id}" names before photo ${pair.before}, which is missing or held`);
  if (!pair.after.source) continue;
  const { width, height } = before.img;
  const w = 1440;
  const cropped = await sharp(path.join(sourceDir, pair.after.source)).rotate()
    .resize(w, Math.round((height * w) / width), { fit: 'cover' }).jpeg({ quality: 95 }).toBuffer();
  afterImages[pair.id] = await ladder(cropped, `before-after/${pair.id}`);
}

fs.writeFileSync(
  DATA_OUT,
  `// GENERATED by scripts/kitchen-images.mjs — do not edit by hand. Re-run \`npm run kitchen:images\`.
// Titles and captions are copied verbatim from source-assets/kitchen-reveal/Reveal prints/
// Titles and captions.csv, which is the source of truth for them. Held photos (kitchen.js →
// heldPhotos) are absent on purpose. Photos with \`draft: true\` come from kitchen.js → extraPhotos
// instead, and their titles and captions are drafts awaiting Jon's sign-off.
// img: { src (extensionless), widths (one .webp per width: \`\${src}-\${w}.webp\`), width, height
// (of the largest .webp) }, plus \`\${src}.jpg\` at up to ${JPG_MAX}px as the fallback.

export const photos = ${JSON.stringify(photos, null, 2)};

export const exhibits = ${JSON.stringify(exhibits, null, 2)};

export const heroImage = ${JSON.stringify(heroImg, null, 2)};

export const showcaseImages = ${JSON.stringify(showcaseImages, null, 2)};

export const afterImages = ${JSON.stringify(afterImages, null, 2)};
`
);

console.log(`photos: ${photos.length} written, ${skipped.length} held`);
for (const s of skipped) console.log(`  held  ${s}`);
console.log(`exhibits: ${Object.keys(exhibits).join(', ')}`);
console.log(`before/after: ${Object.keys(afterImages).length} of ${beforeAfter.pairs.length} afters filled`);
console.log(`showcase: ${Object.keys(showcaseImages).length} of ${showcase.slots.length} slots filled`);
