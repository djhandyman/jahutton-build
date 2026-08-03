// Copy for the /notes surface. The notes THEMSELVES are markdown in src/content/notes/ —
// the one deliberate exception to "content is data, not markup" (see CLAUDE.md) — but the
// furniture around them is data like everything else, so the wording changes here, not in
// a page.
//
// ⚠️ Everything below is Claude-drafted. Notes are Jon's writing; so is the frame around
// them. TODO(jon): approve or replace all four strings before the first note publishes.
export const notes = {
  title: 'Notes',

  // Routes the reader to Substack for the long stuff on purpose — the two surfaces do
  // different jobs and saying so here is what keeps them from competing.
  lead: 'Short pieces on the work — what I’m building, what it cost, what I’d do differently. The essays live on Substack.',

  // The "Start here" group: notes with `pinned: true` in their frontmatter, above the
  // stream. Renders nothing at all when no note is pinned.
  pinnedHeading: 'Start here',

  // What /notes says before the first note lands, and what it would say again if every
  // note were pulled. The page can ship before the writing does — a heading over an empty
  // list looks broken rather than early.
  empty: 'Nothing here yet. First one’s coming.',

  backLabel: '← All notes',
  feedLabel: 'RSS',
};
