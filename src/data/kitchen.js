// /kitchen — the kitchen remodel, for everyone who missed the reveal party (2026-11-14) and as
// the kitchen half of the remodel case study. Added 2026-11-12.
//
// WHY A PAGE OF ITS OWN rather than a project entry in projects.js: eleven stages, two maker
// sections and a six-card AI exhibit don't fit any slot [slug].astro has, and growing that
// renderer six new slots for one project is the wrong trade. The remodel card on /work stays the
// single portfolio entry; its Kitchen gallery group links here. The URL is /kitchen, not
// /work/kitchen, on purpose (Jon, 2026-11-12) — it's the link that goes out by text message.
//
// WHERE THE WORDS CAME FROM — this matters, because most of it is Jon's and must stay his:
//   · Stage titles, "when", summaries and facts: the printed Stage placards, verbatim.
//   · The at-a-glance one-liners: the printed Stages overview poster, verbatim.
//   · Photo titles and captions: NOT in this file. They're generated from the party's
//     "Titles and captions.csv" into kitchen-photos.js by scripts/kitchen-images.mjs, so they
//     can't drift from the source by hand-copying. Never edit kitchen-photos.js directly.
//   · Durat, SawBox, Built with Claude: the three posters, verbatim, except the lines marked
//     DRAFT below — lines written for someone standing in the kitchen ("You're standing in it",
//     "Go ahead and touch it", "right here", "this room") that read wrong on a web page.
//   · hero.lead and closing: DRAFTED by Claude from Jon's poster lines. Needs his sign-off.
//
// HOLDING SOMETHING BACK. An id in `heldPhotos`, or a `hold: '<reason>'` field on a fact or an
// exhibit, keeps that item off the page. The image script SKIPS held photos entirely, so they
// never reach public/ — a file in public/ is reachable by URL even if no page links it. To
// release one: delete its line here, then `npm run kitchen:images`.
//
// RELEASED 2026-11-13 (Jon, after reviewing every held item in a local build): the six photos
// with people in them, the electrical panel, the two 2016 listing photos, two house exteriors,
// seven views out the window, the $75 window, the permit number and the cost-share chart. They
// had been withheld on first build under a cautious reading of "no people, no panel or permit,
// nothing that locates the house, no dollar figures"; the call to publish them is his. The one
// photo still held is his own editorial cut, not a privacy one.

// Where the image script finds its inputs. source-assets/ is gitignored (738 MB of originals);
// the generated, web-sized output in public/images/kitchen/ is what's committed.
export const sourceDir = 'source-assets/kitchen-reveal';

// Photo ids are the CSV's stage-folder prefix ("05-03"). Reasons are for Jon, not the page.
export const heldPhotos = {
  // Jon's call, not privacy (2026-11-13): shows the spots in the pour he later ground out.
  '04-07': 'Jon: cut — shows pour flaws that were ground out later',
};

// ── Extra photos: the ones that weren't printed ─────────────────────────────────────────────
// Added 2026-11-13 (Jon: "we don't need to hew to the printed ones, especially with the before
// stuff"). Stills from "Project photos/" that never made the CSV. The iPhone HEICs were converted
// once to JPEG into Extras/ (sharp's prebuilt libvips can't decode HEVC; the conversion was a
// one-off with a scratch Python venv, not a repo dependency). Filenames are "<id> <original>.jpg".
//
// THE ID IS THE POSITION. "07-13a" sorts after the CSV's 07-13 and before 07-14, so an extra
// slots into the story where it was taken; "05-00a" sorts before 05-01. The stage is the first two
// characters.
//
// ⚠️ TITLES AND CAPTIONS HERE ARE DRAFTS (Claude, 2026-11-13), written from what's visible in
// the frame and the date the phone recorded — the CSV's are Jon's. Each needs his sign-off.
// `flag` marks a photo published on a borderline privacy call, for Jon to confirm.
//
// Looked at and NOT added (stay out of public/ simply by not being listed): IMG_6493 (sink
// window: neighbors' houses and yard), IMG_6565 and IMG_8805 (people), IMG_6884 (person at the
// saw), IMG_8588 (a neighbor's house through the window), IMG_2776.heic (house exterior, same as
// held 06-02), IMG_6582.HEIC (same shot as 02-01), and every .MOV/.mp4 — the stills a video
// would give are motion-blurred pans.
export const extraPhotos = [
  { id: '00-05a', file: '00-05a IMG_6458.jpg', title: 'From the doorway',
    caption: 'May 12. Wall oven, sink window and the peninsula, from the doorway.',
    flag: 'backyard fence through the window, same view as published 00-05' },
  { id: '02-01a', file: '02-01a IMG_6581.jpg', title: 'Where the vinyl stopped',
    caption: 'The diagonal boards, with the old flooring peeled back.' },
  { id: '02-10a', file: '02-10a IMG_6579.jpg', title: 'Pattern on pattern',
    caption: 'Three vinyl patterns, each one laid over the last.' },
  { id: '03-05a', file: '03-05a IMG_6885.jpg', title: 'Studs in',
    caption: 'June 20. A temporary support wall, holding things up while the exterior wall section was reframed.',
    flag: 'backyard and fence through the open wall; a gloved hand at the right edge' },
  { id: '04-02a', file: '04-02a IMG_7197.jpg', title: 'The first section',
    caption: 'July 11. Leveler spreading out across the plywood.' },
  { id: '05-00a', file: '05-00a IMG_7827.jpg', title: 'The orange mat',
    caption: 'August 14. The membrane down, before any cable.' },
  { id: '07-09a', file: '07-09a IMG_8082.jpg', title: 'Mineral wool, delivered',
    caption: 'September 2. Bundles stacked and waiting for the stud bays.',
    flag: 'a corner of the backyard pergola through the window' },
  { id: '07-11a', file: '07-11a IMG_8084.jpg', title: 'More boxes',
    caption: 'Pantry boxes standing beside the fridge, drawers in.' },
  { id: '07-13a', file: '07-13a IMG_8586.jpg', title: 'Oven in',
    caption: 'October 6. The wall oven in its tower, drawers below.' },
  { id: '07-13b', file: '07-13b IMG_8587.jpg', title: 'Still in plastic',
    caption: 'October 6. The hood up, still wrapped.' },
  { id: '07-13c', file: '07-13c IMG_8590.jpg', title: 'Inside the new oven',
    caption: 'Blue enamel and new racks.' },
  { id: '07-14a', file: '07-14a IMG_8610.jpg', title: 'Wrapped',
    caption: 'October 8. Doors in their foam, ready to load.' },
  { id: '07-14b', file: '07-14b IMG_8611.jpg', title: 'Loaded',
    caption: 'October 8. Doors and drawer fronts in the back of the truck.' },
  { id: '07-15a', file: '07-15a IMG_8613.jpg', title: 'The first tall doors',
    caption: 'October 8. Pantry doors going up, one pair at a time.' },
  { id: '07-17a', file: '07-17a IMG_8631.jpg', title: 'Nearly closed in',
    caption: 'October 11. Pantry doors on, the oven tower still open.' },
  { id: '09-00a', file: '09-00a IMG_8166.jpg', title: 'First light',
    caption: 'September 6. A test bulb hanging from the new ceiling wiring.' },
];

// The finished-kitchen slot. A STAND-IN until the final photos exist: "Almost there" from the
// print set. To swap: put the new photo anywhere under sourceDir, point `source` at it, rewrite
// `alt`/`caption`, and run `npm run kitchen:images` — that regenerates the hero sizes AND the
// share image (og.jpg) from it. Nothing in the page changes.
export const hero = {
  source: 'Reveal prints/All photos by stage/10 Finishing touches/10-05 Almost there.jpg',
  alt: 'Almost there: the island painted, pendants up, and the Ash Violet pantry wall with its pulls on.',
  // The CSV caption for this photo, verbatim. Replace with the finished-kitchen caption.
  caption: 'October 18. Island painted, pendants up, pulls on.',
  // Where the share-image crop sits vertically, 0 (top) to 1 (bottom). This photo is portrait
  // and the share card is 1.9:1, so it has to choose a band; 0.45 keeps island and pantry.
  ogFocus: 0.45,
};

export const page = {
  title: 'The Kitchen',
  // Meta + share description. Drafted from the overview poster's own line.
  description:
    'A kitchen remodel in eleven stages, from demo to the reveal — six months of nights and weekends, finished November 2026.',
  eyebrow: 'Kitchen remodel · May to November 2026',
  // DRAFT (Claude, 2026-11-12) — needs Jon's sign-off. First sentence is his overview line and
  // his stage-00 fact; the second is new, and is the only line on the page addressed to guests.
  lead: [
    'Six months of nights and weekends, finished November 2026. The U became an L and an island.',
    'For everyone who couldn’t make the reveal on November 14: here’s the whole thing, stage by stage.',
  ],
  glanceHeading: 'Old kitchen to new, in eleven stages',
};

// One entry per placard. `id` is also the anchor (#stage-05). `glance` is the overview poster's
// one-liner; `summary`/`facts`/`when` are the placard's.
export const stages = [
  {
    id: '00',
    title: 'Before',
    when: '2016 to 2026',
    glance: 'A closed-in U with a peninsula, laminate counters and wallpaper.',
    summary: 'A closed-in U with a peninsula, laminate counters and wallpaper. Ten years with no dishwasher.',
    facts: [
      { value: '2016', label: 'the year we bought the house' },
      { value: '1 update', label: 'blue paint, in 2017' },
      { value: 'Same room', label: 'new layout: the U became an L and an island' },
    ],
  },
  {
    id: '01',
    title: 'Demo',
    when: 'May',
    glance: 'Cabinets, drywall and the soffit came out, down to the studs.',
    summary: 'The dumpster arrived on May 6. Cabinets, drywall and the soffit all came out.',
    facts: [
      { value: 'May 6', label: 'day one' },
      { value: 'A beam', label: 'found hiding inside the soffit' },
      { value: 'Water damage', label: 'found under the sink window' },
    ],
  },
  {
    id: '02',
    title: 'Floor and structure',
    when: 'May and June',
    glance: 'Rot repaired, a new footing under the beam, new plywood.',
    summary:
      'Under the old flooring: diagonal boards, rot in the middle of the floor, and a 14-foot beam that was never properly supported.',
    facts: [
      { value: 'New footing', label: 'rebar-reinforced concrete, directly under the beam' },
      { value: 'No more bow', label: 'it fixed a floor that had bowed upward' },
      { value: '2 rooms', label: 'kitchen and laundry both got new plywood' },
    ],
  },
  {
    id: '03',
    title: 'Window and walls',
    when: 'June',
    glance: 'A bigger sink window and a reframed wall for the pantry.',
    summary: 'A bigger opening for the sink window, and a wall reframed to hold the pantry.',
    facts: [
      { value: '$75', label: 'the window, salvaged from Second Use' },
      { value: '1 wall', label: 'reframed for the pantry cabinets' },
      { value: 'Later', label: 'the fir trim went on in November' },
    ],
  },
  {
    id: '04',
    title: 'Leveling the floor',
    when: 'July',
    glance: 'Self-leveling compound poured so the tile would sit flat.',
    summary: 'Self-leveling compound, poured over the plywood so the tile would sit flat.',
    facts: [
      { value: '215 sq ft', label: 'kitchen and laundry' },
      { value: 'July 11', label: 'the first pour' },
      { value: 'Miles better', label: 'than the floor it replaced' },
    ],
  },
  {
    id: '05',
    title: 'Heated floor and tile',
    when: 'August and September',
    glance: 'A heating cable in an orange mat, then porcelain planks.',
    summary: 'An electric heating cable pressed into an orange mat, then porcelain planks on top.',
    facts: [
      { value: '2 rooms', label: 'heated: kitchen and laundry' },
      { value: '6 × 24″', label: 'plank tile in Lumber Gray' },
      { value: 'Red clips', label: 'held every tile edge flush' },
    ],
  },
  {
    id: '06',
    title: 'Range hood vent',
    when: 'September',
    glance: 'A new duct up through the ceiling and out the gable.',
    summary: 'A new duct from the hood, up through the ceiling and out the side of the house.',
    facts: [
      { value: '10″', label: 'duct diameter' },
      { value: '34″', label: 'hood height above the cooktop' },
      { value: 'Gable', label: 'where it exits, high on the wall' },
    ],
  },
  {
    id: '07',
    title: 'Walls and cabinets',
    when: 'September and October',
    glance: 'Insulation, drywall and paint, then cabinets and doors.',
    summary:
      'Drywall and paint, then the cabinets: flat-packed from SawBox, assembled and set by Jon.',
    facts: [
      { value: 'Ash Violet', label: 'the cabinet color' },
      { value: '21', label: 'drawers, plus a waste pullout' },
      { value: '1 island', label: 'designed and built from scratch' },
    ],
  },
  {
    id: '08',
    title: 'Countertops',
    when: 'October',
    glance: 'Three sheets of Durat, cut, glued and polished on site.',
    summary: 'Three sheets of Durat, cut, glued and polished on site. A maple block tops the island.',
    facts: [
      { value: '3 sheets', label: 'about 100 pounds each' },
      { value: '1 template', label: 'guided the sink cutout' },
      { value: '4″ thick', label: 'end-grain maple block' },
    ],
  },
  {
    id: '09',
    title: 'Wiring and inspection',
    when: 'May to October',
    glance: 'New circuits throughout, signed off by the city inspector.',
    summary:
      'New circuits for the cooktop, oven, dishwasher, heated floor and lights, all run back to a reorganized main panel.',
    facts: [
      { value: '200 amp', label: 'main panel, rewired by Jon' },
      { value: 'Oct 27', label: 'final electrical inspection passed' },
      { value: '26-2544', label: 'City of Olympia permit number' },
    ],
  },
  {
    id: '10',
    title: 'Finishing touches',
    when: 'November',
    glance: 'Fir window trim, hardware and a maple doorway ramp.',
    summary:
      'Fir trim around the sink window, and a maple ramp where the new tile meets the old oak floor.',
    facts: [
      { value: 'Douglas fir', label: 'window trim, clear finish' },
      { value: 'Maple', label: 'ramp at the living room doorway' },
      { value: '1″', label: 'step the ramp makes up' },
    ],
  },
];

// The overview poster's twelfth tile. Poster copy: "You're standing in it. Six months of nights
// and weekends, finished November 2026." The first sentence is DROPPED for the web (Claude,
// 2026-11-12, flagged for Jon) — nobody reading this is standing in it.
export const revealTile = {
  title: 'The reveal',
  text: 'Six months of nights and weekends, finished November 2026.',
};

// ── Before and after ────────────────────────────────────────────────────────────────────────
// Added 2026-11-13 at Jon's request. Leads the reveal section: an old photo and a new one from
// the same spot, stacked, with a slider to wipe between them (arrow keys work; without JS the
// two sit side by side). `before` is a photo id from the gallery (CSV or extraPhotos — it must
// not be held). Until `after.source` is set, the after half is a PLACEHOLDER, so the pair still
// shows what the slider will do.
//
// To fill one: shoot from where the before was taken (the `shotNote` is the hint), drop the photo
// under sourceDir, set `after.source`, `after.alt`, `after.caption`, run `npm run kitchen:images`.
// The script crops the after to the before's proportions (centered), because a wipe between two
// differently-shaped photos doesn't line up. Same privacy rules as the showcase below.
export const beforeAfter = {
  heading: 'Before and after',
  // DRAFT (Claude, 2026-11-13).
  lead: 'The same spots, before the work and after. Drag the handle to compare.',
  placeholderNote: 'After photo coming soon',
  beforeLabel: 'Before',
  afterLabel: 'After',
  pairs: [
    {
      id: 'room',
      label: 'The whole room',
      before: '00-03',
      shotNote: 'From the living room doorway, looking toward the sink window',
      after: { source: null, alt: '', caption: '' },
    },
    {
      id: 'sink',
      label: 'The sink corner',
      before: '00-04',
      shotNote: 'From beside the old sink, looking across to the cooktop corner',
      after: { source: null, alt: '', caption: '' },
    },
    {
      id: 'peninsula',
      label: 'Where the peninsula was',
      before: '00-05a',
      shotNote: 'From the doorway by the wall oven',
      after: { source: null, alt: '', caption: '' },
    },
  ],
};

// ── The reveal: showcase photos ─────────────────────────────────────────────────────────────
// Added 2026-11-12 at Jon's request. This is where the page parts ways with the party: the
// guests saw the finished room in person; this section is the finished room for everyone else,
// shot once it's cleaned and staged. It sits after stage 10 because it's the end of the story,
// and the at-a-glance "The reveal" tile links here.
//
// Each slot is a PLACEHOLDER while `source` is null — a short dashed box labelled with what goes
// there, the same "pending" language the remodel card's empty Kitchen group used. To fill one:
// drop the photo under sourceDir (e.g. Showcase/), set `source` (a path relative to sourceDir),
// write `alt` and `caption`, run `npm run kitchen:images`. Reorder, rename or delete slots
// freely. A filled slot renders at the photo's own proportions; the first one runs full width
// and the rest pair up below it. The `label`s are a starting shot list, not page copy anyone
// signed off — they only show while a slot is empty.
//
// ⚠️ Same rules as the rest of the page before a slot is filled: no people, nothing out the
// window that locates the house (the sink window faces the backyard and neighbors — shoot it
// with the blinds or from an angle), no visible paperwork with the address.
export const showcase = {
  heading: 'The reveal',
  // DRAFT (Claude, 2026-11-12).
  lead: 'The finished kitchen, cleaned up and photographed after the party.',
  placeholderNote: 'Photo coming soon',
  // DRAFT (Claude, 2026-11-13). Subheading under the before/after pairs, over these slots.
  roomHeading: 'Around the room',
  slots: [
    { id: 'room', label: 'The whole room, from the living room doorway', source: null, alt: '', caption: '' },
    { id: 'island', label: 'The island and its maple block', source: null, alt: '', caption: '' },
    { id: 'pantry', label: 'The Ash Violet pantry wall', source: null, alt: '', caption: '' },
    { id: 'sink', label: 'The sink run and the fir-trimmed window', source: null, alt: '', caption: '' },
    { id: 'counter', label: 'Durat up close', source: null, alt: '', caption: '' },
    { id: 'ramp', label: 'Where the tile meets the oak', source: null, alt: '', caption: '' },
  ],
};

// ── Materials and makers ────────────────────────────────────────────────────────────────────
// Supplier claims link to the supplier's own page (Jon's rule). Checked 2026-11-12:
//   durat.com/pages/solid-surface — "approximately 30% recycled plastic and is 100% recyclable",
//     "developed in Finland", "Post-industrial plastic waste is granulated", "homogenous surface
//     can be renewed with light sanding". Note it does NOT say "polished like new" or "solid
//     color all the way through" — those are Jon's words from handling it, and read as his.
//   sawbox.com/#howitworks — the four process steps; footer lists the Kent, WA showroom with
//     "Email Us for an Appt."
//   caragreen.com/collections/durat — linked from CaraGreen's own nav, but rate-limited (429)
//     when checked, so its contents are UNVERIFIED. Re-check before launch.
export const durat = {
  eyebrow: 'The countertops are',
  title: 'Durat',
  // Poster: "...made with recycled plastic. Go ahead and touch it." Second sentence DROPPED for
  // the web (Claude, 2026-11-12, flagged) — it's an invitation to someone at the party.
  lead: 'A solid surface from Finland, made with recycled plastic.',
  stats: [
    { value: '~30%', label: 'recycled plastic, from factory waste' },
    { value: '100%', label: 'recyclable at the end of its life' },
    { value: '3', label: 'sheets, each 9-1/2 feet long and about 100 pounds' },
    { value: '1/2″', label: 'thick, solid color and chips all the way through' },
  ],
  claimsSource: { href: 'https://www.durat.com/pages/solid-surface', text: 'Material and recycling figures: Durat' },
  stepsHeading: 'How three sheets became a countertop',
  steps: [
    { title: 'Plan every cut', text: 'Each piece, edge strip and backsplash was mapped onto the sheets before a saw came out.' },
    { title: 'Saw, then rout', text: 'Cut slightly oversize with a track saw, then trimmed to the line with a router in shallow passes.' },
    { title: 'Sink and faucet', text: 'A plywood template guided the router around the sink opening.' },
    { title: 'Build the edge', text: 'A strip glued under the front makes the half-inch sheet look about an inch thick.' },
    { title: 'Glue the seams', text: 'Color-matched adhesive, clamped for two hours, then shaved flush.' },
    { title: 'Sand and polish', text: 'Sanded through finer and finer grits, then polished until the surface shines.' },
  ],
  cutPlan: {
    heading: 'The cut plan',
    caption: 'All three sheets, with every countertop piece laid out. The offcuts became the edges and backsplash.',
    // Read from the poster's own cut-plan artwork at full resolution, 2026-11-12. Inches.
    // Every row sums to the sheet length less saw kerfs — that check is why these are trusted.
    sheet: { w: 114.1875, h: 31.5, label: '114-3/16 × 31-1/2' },
    sheets: [
      {
        pieces: [
          { x: 0, y: 0, w: 97.75, h: 25.5, name: 'W1A · Wall 1 left', size: '97-3/4 × 25-1/2' },
          { x: 0, y: 26.75, w: 97.75, h: 3.5, name: 'backsplash · edge above, filler below', size: '97-3/4 × 3-1/2', strip: true },
          { x: 97.9, y: 0, w: 16.25, h: 31.5, name: 'spare', size: '16-1/4 × 31-1/2', spare: true },
        ],
      },
      {
        pieces: [
          { x: 0, y: 0, w: 48, h: 25.5, name: 'W2L · Wall 2 left', size: '48 × 25-1/2' },
          { x: 48.1, y: 0, w: 51, h: 25.5, name: 'W2R · Wall 2 right', size: '51 × 25-1/2' },
          { x: 0, y: 26.75, w: 99.125, h: 3.5, name: 'backsplash · edge above, filler below', size: '99-1/8 × 3-1/2', strip: true },
          { x: 99.3, y: 0, w: 14.875, h: 31.5, name: 'spare', size: '14-7/8 × 31-1/2', spare: true },
        ],
      },
      {
        pieces: [
          { x: 0, y: 0, w: 29.75, h: 25.5, name: 'W1B · Wall 1 right', size: '29-3/4 × 25-1/2' },
          { x: 0, y: 26.75, w: 29.75, h: 3.5, name: 'splash', size: '29-3/4 × 3-1/2', strip: true },
          { x: 29.9, y: 0, w: 48.75, h: 30, name: 'ISL · island, full width', size: '48-3/4 × 30' },
          { x: 78.8, y: 0, w: 35.375, h: 31.5, name: 'spare: island edge and filler, then splash strips', size: '35-3/8 × 31-1/2', spare: true },
        ],
      },
    ],
  },
  callout: {
    strong: 'Made to last.',
    text: 'The color and chips run all the way through, so a scratch or stain can be sanded out and the surface polished like new.',
  },
  credits: [
    // "supplied by CaraGreen" — see the 429 note above before launch.
    ['Durat color 100-52 · supplied by ', { href: 'https://caragreen.com/collections/durat', text: 'CaraGreen' }],
    ['Cut, seamed and polished by Jon'],
  ],
};

export const sawbox = {
  eyebrow: 'The cabinets in this kitchen are from',
  name: 'SawBox',
  href: 'https://sawbox.com/',
  // Logo deliberately NOT used — Jon's rule: name and link only, ask before using their file.
  // Poster: "...assembled right here by Jon". "right here" is DRAFT-reworded for the web.
  headline: 'Custom cabinets, cut in Kent, assembled on site by Jon',
  stepsHeading: 'How SawBox works',
  stepsSource: { href: 'https://sawbox.com/#howitworks', text: 'Their process, in their words: sawbox.com' },
  steps: [
    { title: 'Send a plan', text: 'A sketch or rough dimensions is enough.' },
    { title: 'Design it together', text: 'A planner lays out the cabinets. You pick doors and colors.' },
    { title: 'Approve the drawings', text: 'Every cabinet is drawn with its size and place.' },
    { title: 'Pick up the kit', text: 'Labeled parts, cut by machine, ready to assemble.' },
  ],
  specsHeading: 'In this kitchen',
  specs: [
    ['Boxes', 'Prefinished birch plywood, frameless'],
    ['Fronts', 'Shaker, painted Ash Violet'],
    ['Drawers', '21 plus a waste pullout, all soft-close'],
    ['Pantry', 'Three cabinets, each 90 inches tall'],
    ['Fit', 'Matching fillers, end panels and toe kicks'],
  ],
  footer: 'Showroom in Kent, WA · visits by appointment',
  // The poster's top-down shop drawing is SawBox's document; left out rather than reproduced.
};

// ── Built with Claude ───────────────────────────────────────────────────────────────────────
// The poster's three illustrations (island rendering, knob mock-up, pantry plan) are the
// original artwork, extracted from the poster PDF into sourceDir/Exhibits/ — not screenshots
// of the poster. The circuit table and the cut layout are rebuilt as HTML/SVG.
export const claude = {
  eyebrow: 'Behind the scenes',
  title: 'This kitchen had an AI on the crew',
  lead: 'Jon built it. Claude, an AI assistant, answered questions, read the manuals and drew the plans.',
  // "25+" per Jon, 2026-11-12 ("probably more than that by a decent margin") — the poster's
  // text layer said 25, its artwork said 25+.
  stats: [
    ['7', 'months'],
    ['25+', 'conversations'],
    ['8', 'trades'],
    ['16', 'plans and build sheets'],
    ['10', 'manuals on file'],
  ],
  roles: [
    {
      title: 'Code checker',
      text: 'Checked the electrical plan against code before each inspection, one circuit at a time.',
      exhibit: {
        kind: 'circuits',
        rows: [
          ['Induction cooktop', '40 amp', '8 gauge'],
          ['Wall oven', '30 amp', '10 gauge'],
          ['Dishwasher', '20 amp', '12 gauge'],
          ['Heated floor', '20 amp', '12 gauge'],
        ],
      },
      caption: 'Final electrical inspection passed October 27',
    },
    {
      title: 'Draftsman',
      text: 'Drew the island through three revisions, with a cut list for every plywood part.',
      exhibit: { kind: 'image', id: 'island-rendering', alt: 'A 3D rendering of the island: white cabinet boxes with open shelving on one end and an outlet on the side, a thick end-grain maple block on one end of the top, on a gray plank floor.' },
      caption: 'Island rendering, drawn before a board was cut',
    },
    {
      title: 'Manual reader',
      text: 'Read the install guides for the countertop, heated floor and appliances, and turned them into plans.',
      exhibit: { kind: 'cutsheet', sheet: 2 },
      caption: 'Cut layout for one of three countertop sheets',
    },
    {
      title: 'Shopper',
      text: 'Compared appliances, tile and cabinet hardware, and mocked up the options before anything was ordered.',
      exhibit: { kind: 'image', id: 'knob-mockup', alt: 'An elevation drawing of the pantry wall in Ash Violet: tall Shaker cabinets with knobs and pulls drawn on, the wall oven above three drawers, and the fridge at the right.' },
      caption: 'Knob and pull mock-up: 40 pieces counted from the drawings',
    },
    {
      title: 'Bookkeeper',
      text: 'Rebuilt the project cost from 93 receipts and bank records, and listed every tool bought.',
      // Released 2026-11-13 (Jon). The shares are the poster's; percentages only, no dollar
      // amounts anywhere on the page.
      exhibit: {
        kind: 'costs',
        rows: [
          ['Cabinets', 31],
          ['Countertops', 15],
          ['Appliances', 15],
          ['Tile and heated floor', 10],
          ['Subfloor and framing', 7],
        ],
      },
      // Poster, in full: "Where the money went · 65 tools · 37 Home Depot trips".
      caption: 'Where the money went · 65 tools · 37 Home Depot trips',
    },
    {
      title: 'Organizer',
      // Poster: "...captioned the photos in this room." DRAFT-reworded: "on this page" — and
      // literally true, the captions below come from the same file.
      text: 'Kept the build schedule, planned every pantry shelf, and captioned the photos on this page.',
      exhibit: { kind: 'image', id: 'pantry-plan', alt: 'A color-coded pantry plan: shelves labeled cereal, oats, snacks, noodles and quick lunch, treats, meds, canned goods, bulk dry goods and cooking backstock, with bins and roll-out trays marked.' },
      caption: 'Pantry plan: every shelf assigned',
    },
  ],
};

// DRAFT (Claude, 2026-11-12) — needs Jon's sign-off. CTA label is new: every generic one is
// taken by a project page (see CLAUDE.md), and this one has to suit a guest as well as a buyer.
export const closing = {
  heading: 'That’s the kitchen',
  text: 'Thanks for following along. Questions about any of it, or a room of your own you’re thinking about? Send me a note.',
  link: { href: '/contact/', label: 'Ask me about it' },
  // Back into the portfolio, for the reader who arrived from a text and wonders who built it.
  more: { href: '/work/kitchen-bath-remodel/', text: 'The bathroom, and the rest of my work' },
};
