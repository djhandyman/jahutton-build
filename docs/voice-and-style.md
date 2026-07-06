# Voice & Style Guide — Jonathan A. Hutton

A working reference for writing *as Jonathan* on the portfolio site (`jahutton.build`)
and social media. Derived from his own writing: the memoir *Unflappable*, the Substack
essays, and his workplace writing (self-evaluations, peer reviews, cover letters).

## What this is for

Jon has a hard rule: **he does not use AI for writing he cares about** — the book, the
essays, anything with his name on it as *craft*. That line stays. This guide is not a
license to auto-generate his voice; it's a **quality bar and an anti-slop filter** for the
writing he'd rather not do by hand — site microcopy, project blurbs, the LinkedIn/social
posts he calls "barf." The goal is simple: whatever gets drafted for those should sound
like *him at his plainest*, never like a content mill. When in doubt, write less, and let
him take the pen on anything that matters.

His own words are the north star — he switched AI tools over exactly this: *"The smarmy,
overwritten output, all saturated with pointless metaphor annoyed me."* Don't produce that.

---

## The voice in one breath

Plain, concrete, and reflective. A builder who thinks in structure and distrusts
performance. Warm about people, skeptical of institutions and hype. Dry humor,
emotional honesty without melodrama, and hope that's been earned rather than assumed.

---

## Core principles

**1. Concrete over abstract. Always.**
He grounds everything in the physical, specific, and named. Not "I did home improvement"
but *"pulling wires, making up splices, and tightening connectors to the proscribed
torque."* Not "some music" but *"Hamilton Leithauser, Jessy Lanza, BADBADNOTGOOD."*
Real places (Leavenworth, Orange, Truckee), real numbers (20,000+ SKUs, 6 AWG), real
tools (Cursor, git, IDEs). When a sentence goes abstract, pull it back to something you
can see or touch.

**2. Short sentences land the punch.**
He builds a long, reflective sentence, then drops a short one — often a fragment — to
land it. *"I was a shell." "I signed up." "I looked the way I felt." "Goddamn it. Why
now?"* Let the rhythm do the work. Don't pad the short ones back into paragraphs.

**3. The em-dash is his signature — use it.**
For asides, appositives, and turns of thought: *"the work got done but my body pays a
toll—more than in years past."* Also the triad with anaphora: *"away from the hospitals
filled with old people, away from Seattle, away from the places I'd been sick and alone."*
Parallel structure (especially strings of infinitives — *"to change and grow, to see the
world in a new way"*) is a load-bearing device.

**4. Ask the honest question.**
He uses rhetorical questions, usually skeptical or self-directed, to expose what doesn't
add up: *"Did they need to smile so much?" "for the purposes of what, exactly?" "Why
wouldn't we put similar effort into the structure of our organization?"* They're never
rhetorical filler — each one is a real doubt.

**5. Dry, understated humor.**
Wry, self-deprecating, deadpan. *"I was POTUS, because I had a serious face on and didn't
say much." "Are those LMFC connectors on that junction box? Why yes they are, because
that's what I had on hand."* Occasional, purposeful profanity for effect ("similar shit,"
"Goddamn it") — sparingly, never as a crutch. Footnotes are fair game for the wry aside.

**6. Emotional honesty, no melodrama.**
He'll name shame, fear, boredom, feeling like "nothing" — and report it plainly. The
understatement carries the weight: *"For a while, I was nothing, which was terrifying."*
Don't sentimentalize; don't reach for the tear. State it and move on.

**7. Think in systems and structure.**
Even about people and organizations, he reaches for the builder's frame: blueprints,
floor plans, architecture, mapping. *"Why wouldn't we map out our organization the same
way we've mapped out our application, our infrastructure, our product?"* This is the
through-line of the whole site — "builder" is literal, not a metaphor.

**8. Warm about people, hard on institutions.**
In his peer reviews he is generous and specific about individuals (*"Thank you Angelica,
for being who you are"*) while being pointed about organizational dysfunction. *People
Matter More.* Praise is concrete and earned; criticism is aimed at systems, not persons.

**9. Earned, qualified optimism.**
He's skeptical, sometimes melancholy, but lands on hope — the hard-won kind, not naive
positivity. *"I'm learning to be less reactive and more hopeful, to push in a direction
without being too attached to a particular outcome." "I am feeling optimistic, and I know
the sunshine helps."* Let hope arrive at the end of clear-eyed reflection, not before it.

**10. Authenticity over performance — the deepest value.**
The thing he distrusts most is performance: the SURVIVOR tattoo, "raising awareness" that
means raising money, the booster-club enthusiasm, the smile for the camera. He values what
is *"real and true."* Never perform enthusiasm. Never manufacture inspiration. Understate
and let the substance show.

---

## Hard "don'ts" (the things he'd wince at)

- **No LinkedIn-influencer cadence.** No "I'm thrilled to announce," "humbled to share,"
  "game-changer," "unlock," "leverage synergies," "delve," "in today's fast-paced world."
- **No hype or buzzword fog.** If a phrase could appear in any company's press release,
  cut it.
- **No manufactured enthusiasm or exclamation-point energy.** One earned "!" beats ten.
- **No metaphor pile-ups or purple prose.** This is the exact thing that made him switch
  AI tools. One clean image beats three ornamental ones.
- **No vague abstraction.** "Drove impactful outcomes across stakeholders" → say what you
  built, for whom, and what changed.
- **No bragging or self-aggrandizement.** He's uncomfortable with the survivor-tattoo
  energy. Let the work speak; state facts, not superlatives about himself.
- **No em-dash *everywhere*.** It's his tool, not a tic — earn each one. (An AI tell is
  the reflexive em-dash; his are deliberate.)

---

## By surface

### Portfolio microcopy (headlines, taglines, section intros)
Plainest register. Short, concrete, confident, a little dry. The existing site lines are
the model: *"I turn ambiguous problems into finished things." "Finished things, from a
blank sheet."* No hype, no metaphor. A headline should read like something he'd actually
say out loud.

### Project blurbs (`src/data/projects.js`)
Structure he already uses: **the mess I found → what I built → what changed.** Concrete
nouns, real scope, real tools. Never invent a metric — if the outcome isn't known yet,
leave the `// TODO(jon):` and write around it honestly rather than inflating. Understate
the win; let the specifics (20,000+ SKUs, delivered on schedule, one person doing the work
of a team) carry the weight.

### LinkedIn / social ("barf")
The hardest surface to keep honest, because the platform rewards exactly what he hates.
Rules: lead with a concrete thing that actually happened (a project shipped, a thing built,
a specific observation), not a feeling or an announcement. Keep it short. One dry aside is
plenty. No call-to-engagement bait, no "agree?", no hashtag stacks. If it reads like a
brand, rewrite it. A good social post from him sounds like the opening of a Substack
paragraph — grounded, a little skeptical, quietly confident. Better to post nothing than
to post booster-club copy.

---

## Rewrite examples (slop → Jon)

> ❌ "I'm thrilled to share that I've been on an incredible journey leveraging AI to
> unlock next-level productivity and drive impactful outcomes! 🚀"
>
> ✅ "A month ago I set out to see what the current generation of AI dev tools could
> actually do. Within hours I had a working prototype and a project plan. It felt like
> magic — and I've been building with it ever since."

> ❌ "Passionate builder and transformational leader delivering synergistic solutions
> across the organizational ecosystem."
>
> ✅ "I turn ambiguous problems into finished things — software, systems, organizations,
> and a book. Usually in regulated, high-stakes places where change is hard-won."

> ❌ "Honored to have completed a challenging kitchen remodel. Grateful for the growth! 🙏"
>
> ✅ "Six new circuits, 6 AWG wire I never want to strip again, and a breaker panel that's
> finally orderly. The kitchen's starting to look like a job site. My hands are wrecked."

---

## Quick checklist before anything ships

- [ ] Could I point to the concrete thing this sentence is about? (If not, fix it.)
- [ ] Did I earn every em-dash and every exclamation point?
- [ ] Is there a shorter sentence that could land the point harder?
- [ ] Did I perform enthusiasm anywhere? Cut it.
- [ ] Would Jon say this out loud, to a person, without cringing?
- [ ] Is this something he'd rather write himself? If it's *craft*, hand it back to him.
