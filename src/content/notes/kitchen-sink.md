---
title: Kitchen sink — every element the markdown pipeline can emit
description: A permanent draft that exercises every tag .prose-md styles. Not writing. It exists so a CSS change can be eyeballed against the full set in one page.
date: 2026-08-03
draft: true
---

This file is a **regression test**, not a note. It is `draft: true` permanently, so it
renders under `npm run dev` and never ships. Deliberately NOT underscore-prefixed —
that would hide it from the loader entirely and it would be viewable nowhere. Open
`/notes/kitchen-sink/` in dev after touching `.prose-md` in `global.css`.

Body copy runs at `--text-lg` on a `--measure` column. A second paragraph, so the gap
between paragraphs is visible. Here is an [inline link](/work/), some `inline code`,
some *emphasis*, some **strong text**, and some ~~struck-through text~~ (GFM).

## Heading level two

The body starts at `##` — `#` belongs to the page title, which comes from frontmatter.

### Heading level three

#### Heading level four

`global.css` gives `h4` a family but no size; `.prose-md` is the first thing on this site
to size it.

##### Heading level five

###### Heading level six

## Lists

- First item
- Second item, which runs long enough to wrap onto a second line so the hanging indent
  can be checked against the marker
- Third item
  - A nested item
  - Another nested item

1. Ordered first
2. Ordered second
3. Ordered third

- [ ] An unchecked GFM task list item
- [x] A checked one

## A quotation

> A block quote, set in the heading face with a rust rule down the left. Deliberately
> lighter than the testimonial block on project pages — that one has attribution and
> earns a card.
>
> A second paragraph inside the quote, to check that the last child loses its margin.

## Code

A fenced block with a language, so Shiki highlights it:

```js
export async function GET(context) {
  const entries = await getCollection('notes', ({ data }) => !data.draft);
  return new Response(buildFeed(entries, context.site));
}
```

And one long line, to confirm `overflow-x: auto` keeps it from widening the page on a
phone — `shikiConfig.wrap` defaults to false:

```
this-is-a-deliberately-long-unbroken-token-that-should-scroll-inside-its-own-box-rather-than-stretching-the-whole-page-out-sideways
```

## A table

| Column | What it holds | Notes |
|---|---|---|
| `title` | The heading | Required |
| `description` | One sentence | Required — does four jobs |
| `draft` | The publish switch | Defaults to false |

## A horizontal rule

---

Text after the rule.

## A footnote

Markdown footnotes are on because GFM is on.[^1] The rendered block lands with a
visually-hidden `<h2 class="sr-only">`, and this site's helper is named
`.visually-hidden` — so `.sr-only` has to be defined in `.prose-md` or that heading
prints on the page.

[^1]: The footnote text, which appears at the bottom under a rule.
