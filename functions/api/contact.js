// Cloudflare Pages Function — handles POST /api/contact and emails the submission via Resend.
// Static site + serverless function: the Resend API key lives here as a secret, never in the
// browser. Replaces the old Formspree dependency.
//
// Required env var (Cloudflare Pages → Settings → Environment variables, and a local .dev.vars
// file for `wrangler pages dev` — see .dev.vars.example):
//   RESEND_API_KEY  — your Resend API key
// Optional env vars (defaults below):
//   CONTACT_TO      — where submissions land (default: jahutton@gmail.com)
//   CONTACT_FROM    — a verified Resend sender. Default uses Resend's shared onboarding sender,
//                     which delivers only to YOUR Resend account email until you verify a domain.
//                     After verifying jahutton.build in Resend, set this to e.g.
//                     "jahutton.build <forms@jahutton.build>".

const DEFAULT_TO = 'jahutton@gmail.com';
const DEFAULT_FROM = 'jahutton.build <onboarding@resend.dev>';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Timeline answers that earn the Build Assessment offer after a successful send. These are the
// stable `value` keys from contact.timelineOptions in src/data/site.js — NOT the labels, so Jon
// can reword every option without changing who gets offered what. An unknown key (or none at
// all) simply doesn't qualify; it is never an error.
//
// The rule is "is this person actually moving", not "do they need it". Someone still exploring
// gets the plain thank-you: they came to talk, and answering a first message with a $1,000 offer
// is the funnel behaviour the assessment copy was written to avoid.
const QUALIFIED_TIMELINES = new Set(['weeks', 'underway']);

// One paragraph Jon can paste straight into a reply. Lives here rather than in src/data/ because
// it is never rendered on the site — only the notification email he sends himself uses it.
// TODO(jon): approve this wording; it should sound like you, not like the site.
const PASTE_READY =
  'Before we build anything I do a Build Assessment — we talk for an hour, then a week later ' +
  'you get a short written plan: what’s going on, what I’d build and in what order, what it ' +
  'costs, and what you could do without me. $1,000, and it comes off the price of the work if ' +
  'we go ahead.';

// Cloudflare Turnstile server-side verification. Returns true when the token checks out.
// If TURNSTILE_SECRET_KEY isn't set, verification is SKIPPED (returns true) so an unconfigured
// deploy still works — set the secret in production to actually enforce it. The public site key
// (src/data/site.js) and this secret must be swapped from test → real together.
async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured — don't block submissions
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = await r.json();
    // Log WHY on failure. Cloudflare returns the reason in `error-codes` and this function used
    // to discard it, which made a rejected submit indistinguishable from any other — a beta
    // tester hit one on 2026-08-05 and there was nothing to look at. The codes are the whole
    // diagnosis and they are not subtle:
    //   invalid-input-secret   → the secret is wrong or belongs to a different widget
    //   invalid-input-response → token is malformed, or came from a DIFFERENT site key than
    //                            this secret pairs with (the test-key/real-secret mismatch), or
    //                            was issued for a hostname the widget doesn't allow
    //   timeout-or-duplicate   → token already spent, or older than 300s. Tokens are SINGLE
    //                            USE, so pressing Send twice always fails the second time.
    // No token content is logged — only the codes. Visible in the Pages function log stream.
    if (data.success !== true) {
      console.error('turnstile rejected:', (data['error-codes'] || []).join(',') || 'no error-codes');
    }
    return data.success === true;
  } catch {
    return false; // verifier unreachable — fail closed
  }
}

function wantsJson(request) {
  const accept = request.headers.get('accept') || '';
  const ctype = request.headers.get('content-type') || '';
  return accept.includes('application/json') || ctype.includes('application/json');
}

// Split the `key|label` timeline value. Splits on the FIRST separator only, so a label that
// ever contains a pipe survives intact. A value with no separator is treated as label-only with
// no key — it prints in the email and simply doesn't qualify.
function splitTimeline(raw) {
  const clean = raw.replace(/\s+/g, ' ').slice(0, 120);
  if (!clean) return { timelineKey: '', timeline: '' };
  const i = clean.indexOf('|');
  if (i === -1) return { timelineKey: '', timeline: clean.slice(0, 80) };
  return {
    timelineKey: clean.slice(0, i).trim(),
    timeline: clean.slice(i + 1).trim().slice(0, 80),
  };
}

async function readFields(request) {
  const ctype = request.headers.get('content-type') || '';
  const src = ctype.includes('application/json')
    ? await request.json()
    : Object.fromEntries(await request.formData());
  const get = (k) => (src[k] == null ? '' : String(src[k]).trim());
  return {
    name: get('name'),
    email: get('email'),
    message: get('message'),
    // Optional qualifier from the <select> on the form. Never required — a blank answer must
    // not block a send. The submitted value is `key|label` (see ContactForm.astro): the key is
    // stable and drives QUALIFIED_TIMELINES, the label is Jon's copy and only ever prints in
    // the email. Still not allow-listed against that copy — the list is Jon's to reword freely,
    // and a duplicated copy here would silently start rejecting valid submissions the moment
    // the two drift. An unsplittable value degrades to "no key, label is whatever was sent",
    // which is precisely the old behaviour. Sanitizing is enough: this only lands in a
    // plaintext email body, so collapse whitespace and cap the length so a hand-crafted POST
    // can't stuff the email with junk.
    ...splitTimeline(get('timeline')),
    // Honeypot — a real user never fills this hidden field; a bot that does is silently dropped.
    website: get('website'),
    // Turnstile token: 'turnstile' from the fetch (JSON) path, 'cf-turnstile-response' from a
    // native form POST. Absent on a no-JS submit — see the lenient policy in onRequestPost.
    turnstile: get('turnstile') || get('cf-turnstile-response'),
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = wantsJson(request);

  // Whether this send earned the Build Assessment offer. Set only once the message is actually
  // away, so an early return (honeypot, validation, a dead email service) can never trigger it.
  // Read at call time by the closure below, which is why it's a `let` up here.
  let offerAssessment = false;

  // For a native (no-JS) submit we redirect; for a fetch we return JSON. Both carry the same
  // decision: /thanks/build-assessment/ is the no-JS twin of the `next` flag, because a static
  // page can't read a query string without the JS this visitor doesn't have.
  const respond = (ok, status, extra = {}) =>
    json
      ? new Response(
          JSON.stringify({ ok, ...(offerAssessment ? { next: 'assessment' } : {}), ...extra }),
          { status, headers: { 'content-type': 'application/json' } },
        )
      : new Response(null, {
          status: 303,
          headers: {
            location: ok
              ? offerAssessment
                ? '/thanks/build-assessment/'
                : '/thanks/'
              : '/contact/?error=1',
          },
        });

  let f;
  try {
    f = await readFields(request);
  } catch {
    return respond(false, 400, { error: 'Could not read the form data.' });
  }

  // Honeypot: a bot filled the hidden field. Pretend success, send nothing.
  if (f.website) return respond(true, 200);

  // Turnstile — LENIENT here: verify only when a token is present (the JS path). A no-JS submit
  // carries no token and falls back to the honeypot above; the contact form is near-zero cost per
  // send, so we keep that progressive-enhancement path. A present-but-invalid token is rejected.
  if (f.turnstile) {
    const ok = await turnstileOk(env, f.turnstile, request.headers.get('cf-connecting-ip'));
    if (!ok) {
      return respond(false, 403, {
        error: 'That spam check didn’t pass — please reload the page and try again.',
      });
    }
  }

  if (!f.name || !f.email || !f.message) {
    return respond(false, 422, { error: 'Please fill in your name, email, and a message.' });
  }
  if (!EMAIL_RE.test(f.email)) {
    return respond(false, 422, { error: 'That email address looks off — mind checking it?' });
  }
  if (!env.RESEND_API_KEY) {
    return respond(false, 500, { error: 'The contact form isn’t configured yet.' });
  }

  const qualified = QUALIFIED_TIMELINES.has(f.timelineKey);
  // Absolute URL so the link is clickable from the inbox. Derived from the request rather than
  // hard-coded, so a wrangler/preview deploy links to itself instead of to production.
  const assessmentUrl = new URL('/assessment/', request.url).toString();

  // Footer for Jon, not for the sender. Its real job is the second line: it tells him what this
  // person has ALREADY been shown, so he doesn't open a reply by pitching something they just
  // read. The paste-ready paragraph is there so sending it stays a one-keystroke decision.
  const footer =
    `\n\n—\n` +
    `Build Assessment: ${assessmentUrl}\n` +
    (qualified
      ? `They were offered it after sending (timeline qualified).\n`
      : `They were NOT offered it after sending.\n`) +
    `\nPaste-ready:\n${PASTE_READY}\n${assessmentUrl}\n`;

  const text =
    `New message from jahutton.build\n\n` +
    `Name:  ${f.name}\n` +
    `Email: ${f.email}\n` +
    (f.timeline ? `Timeline: ${f.timeline}\n` : '') +
    `\n${f.message}\n` +
    footer;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || DEFAULT_FROM,
        to: env.CONTACT_TO || DEFAULT_TO,
        reply_to: f.email, // reply straight to the sender from your inbox
        subject: `New message from ${f.name} — jahutton.build`,
        text,
      }),
    });
    if (!r.ok) {
      return respond(false, 502, {
        error: 'The email service rejected the message.',
        detail: await r.text(),
      });
    }
  } catch {
    return respond(false, 502, { error: 'Could not reach the email service. Please try again.' });
  }

  // The message is away — only now can the offer ride along on the response.
  offerAssessment = qualified;
  return respond(true, 200);
}
