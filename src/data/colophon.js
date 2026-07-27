// Data for the "how this site is built" case study — currently just the request-flow
// diagram (src/components/FlowDiagram.astro renders it; the component is presentation-only).
//
// EVERY CLAIM HERE IS CHECKED AGAINST THE SOURCE. This diagram's whole value is that it's
// true — it sits next to a link to a public repo, so a reader can verify it in about a
// minute. If you change a Function's behaviour, change this too:
//   functions/api/contact.js · functions/api/assessment-intake.js · functions/api/feedback.js
//
// The `policy` field on each service is the point of the diagram, not decoration:
//   'required'    — if this fails, the visitor sees an error and the submit is lost
//   'best-effort' — if this fails, it's swallowed and the submit still succeeds
// Compare the assessment lane to the feedback lane: same two services, opposite policies,
// because the thing being protected is different. That contrast is the story.

export const flow = {
  heading: 'What happens when you use this site',
  lead:
    'Three forms, three Cloudflare Functions, three different ideas about what’s allowed to fail.',

  // Sits in front of every POST, before any billable work runs.
  gate: {
    label: 'The edge',
    items: ['Turnstile', 'honeypot', 'rate limit'],
    note: 'Every submission clears this before a Function spends a cent.',
  },

  lanes: [
    {
      form: 'Contact form',
      endpoint: '/api/contact',
      // Turnstile verifies when JS is present, but the honeypot carries the no-JS path —
      // deliberately softer than the two lanes below, because no LLM spend is at risk here.
      gateNote: 'Verified when JS is on; honeypot covers the rest',
      services: [
        { name: 'Resend', detail: 'sends the email', policy: 'required' },
      ],
    },
    {
      form: 'Build Assessment',
      endpoint: '/api/assessment-intake',
      gateNote: 'Strict — this lane spends money',
      services: [
        { name: 'Supabase', detail: 'saves the intake', policy: 'best-effort' },
        { name: 'Claude', detail: 'triages the lead', policy: 'best-effort' },
        { name: 'Resend', detail: 'sends the email', policy: 'required' },
      ],
    },
    {
      form: 'Feedback widget',
      endpoint: '/api/feedback',
      gateNote: 'Strict — this lane spends money',
      services: [
        { name: 'Supabase', detail: 'saves the note', policy: 'required' },
        { name: 'Claude', detail: 'tags it, sometimes asks more', policy: 'best-effort' },
      ],
      // The only lane where a model's output comes back to the visitor rather than to Jon.
      returns: 'Roughly a third of the time, one follow-up question comes back to you.',
    },
  ],

  legend: [
    { policy: 'required', text: 'Must succeed — the visitor sees an error if it doesn’t.' },
    { policy: 'best-effort', text: 'Allowed to fail quietly. The submission still lands.' },
  ],

  // The payoff. Without this, the diagram is just boxes.
  note:
    'Look at Supabase in the middle lane and the bottom one. Same service, opposite rules. On an assessment the email is the product, so a database hiccup must never cost me the lead. On feedback the saved row *is* the product, so that write is the one thing that has to happen. Which thing you protect depends on what you’d hate to lose.',
};
