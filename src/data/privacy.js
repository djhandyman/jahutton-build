// Privacy policy content (src/pages/privacy.astro renders it; the page is presentation-only).
//
// ⚠️ DRAFT — written by Claude 2026-07-27, NOT reviewed by a lawyer and not legal advice.
// Jonathan to read every line before this ships. It exists for two reasons:
//   1. Three forms on this site send visitor data to four third parties. That was true before
//      this page existed; the page just says so out loud.
//   2. Cloudflare requires anyone using Turnstile's *invisible* widget mode to reference the
//      Turnstile Privacy Addendum in their own privacy policy. The site currently uses
//      `interaction-only` (visible widget, conditionally shown), which does NOT carry that
//      requirement — but having this page means invisible mode is available if wanted.
//
// EVERY CLAIM HERE IS CHECKED AGAINST THE SOURCE, same rule as src/data/colophon.js. If a
// Function changes what it collects or who it sends it to, change this too:
//   functions/api/contact.js · functions/api/assessment-intake.js · functions/api/feedback.js
//
// TODO(jon): set `updated` to the real launch date.
// TODO(jon): decide the retention answers — the two marked "TODO" in `sections` below are the
//   only places this page currently hedges, and they hedge because it's your call, not mine.
// TODO(jon): re-verify the third-party links + the Anthropic training claim before launch.
//   Other companies' policies change and this page asserts things about them.
// TODO(jon): decide whether you need explicit GDPR / CCPA sections. Deliberately not drafted —
//   that depends on who actually visits, and it's a question for someone qualified.

export const privacy = {
  title: 'Privacy',
  updated: '2026-07-27',

  lead:
    'This site is a portfolio with three forms on it. Here is exactly what happens to anything you type into them.',

  // The honest summary. Most people will read this and nothing else, so it has to be true
  // on its own — not a teaser for fine print that contradicts it.
  summary: {
    heading: 'The short version',
    points: [
      'No analytics, no tracking pixels, no advertising, no third-party cookies.',
      'I don’t sell, rent, or share your information with anyone.',
      'If you don’t use a form, nothing about you is stored.',
      'Fonts are served from this site, not a font network — so nobody else sees you reading it.',
    ],
  },

  sections: [
    {
      heading: 'What each form collects',
      body: 'Three forms, three different paths. Nothing is collected in the background — only what you type and send.',
      groups: [
        {
          name: 'Contact form',
          items: [
            'Your name, email, message, and optional timeline.',
            'It’s emailed straight to me. It is not saved to any database.',
          ],
        },
        {
          name: 'Build Assessment intake',
          items: [
            'Your answers, name, email, and optional organisation and referral source.',
            'Saved to a database, read by an AI model that summarises it for me, and emailed to me.',
            'While you’re filling it in, your progress is saved in your own browser so you don’t lose it. That draft stays on your device until you submit, and is cleared when you do.',
          ],
        },
        {
          name: 'Feedback widget',
          items: [
            'Your note, the page you were on, and your name and email if you choose to add them — both optional.',
            'Saved to a database and read by an AI model that tags it and sometimes writes one follow-up question back to you.',
          ],
        },
      ],
    },
    {
      heading: 'Who else touches it',
      body: 'I’m one person, so the machinery is other people’s. Your browser only ever talks to this site — these services are reached from the server, never directly from your device.',
      links: [
        {
          name: 'Cloudflare',
          role: 'Hosts the site, and runs the spam check on the forms. Receives your IP address as part of that check.',
          href: 'https://www.cloudflare.com/privacypolicy/',
        },
        {
          name: 'Cloudflare Turnstile',
          role: 'The spam check itself. It looks at signals from your browser to decide whether you’re a person.',
          href: 'https://www.cloudflare.com/turnstile-privacy-policy/',
        },
        {
          name: 'Resend',
          role: 'Delivers form submissions to my inbox as email.',
          href: 'https://resend.com/legal/privacy-policy',
        },
        {
          name: 'Supabase',
          role: 'The database behind the feedback widget and the assessment intake.',
          href: 'https://supabase.com/privacy',
        },
        {
          name: 'Anthropic',
          role: 'Provides the AI model that tags feedback and summarises assessment intakes. Anthropic does not use data sent through their API to train models.',
          href: 'https://www.anthropic.com/legal/privacy',
        },
      ],
    },
    {
      heading: 'Cookies and browser storage',
      body: 'I don’t set any cookies of my own, and there is no analytics or advertising code on this site. Cloudflare’s spam check may store something in your browser as part of deciding whether you’re a person — their policy, linked above, covers that. The assessment form saves your draft in your browser, and the pre-launch notice remembers that you dismissed it for the rest of your visit. Both stay on your device.',
    },
    {
      heading: 'How long I keep it',
      // TODO(jon): pick real answers. Options worth considering: delete feedback rows after the
      // beta wraps; purge intakes N months after an engagement closes or is declined. Whatever
      // you choose, it should be something you'll actually do — a promise here is a promise.
      body: 'Emails stay in my inbox. Feedback notes and assessment intakes stay in the database. I haven’t set a fixed deletion schedule yet — when I do, it will be written here. In the meantime, ask and I’ll delete yours.',
    },
    {
      heading: 'What you can ask me to do',
      body: 'Ask me what I have about you, ask me to correct it, or ask me to delete it. You don’t need a reason and you don’t need to explain. I’ll do it and tell you when it’s done.',
    },
    {
      heading: 'Changes',
      body: 'If this changes, the date at the top changes with it. I won’t quietly rewrite it.',
    },
  ],

  // Routed through the contact form ON PURPOSE — no address in the markup.
  //
  // A `mailto:` here would be the only place on the whole site where Jon's real address ships
  // to a browser (the Functions' CONTACT_TO default is server-side and never reaches the
  // client), and a privacy page is exactly the kind of stable, linked-from-every-page URL that
  // address harvesters crawl. The form reaches the same inbox.
  //
  // TODO(jon): if you'd rather show a real address, don't use the personal one — set up a
  //   Cloudflare Email Routing alias on jahutton.build (free, the domain is already there) and
  //   put that here. If it ever gets scraped you can burn the alias without touching your inbox.
  contact: {
    heading: 'Asking about any of this',
    body: 'Use the contact form and say it’s a privacy request. It reaches me directly — one person reads it, and it’s me.',
    cta: { href: '/contact/', label: 'Get in touch' },
  },
};
