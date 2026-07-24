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

function wantsJson(request) {
  const accept = request.headers.get('accept') || '';
  const ctype = request.headers.get('content-type') || '';
  return accept.includes('application/json') || ctype.includes('application/json');
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
    // Optional qualifier from the <select> on the form. Never required — a blank
    // answer must not block a send. Not allow-listed against the option copy in
    // src/data/site.js on purpose: that list is Jon's to reword freely, and a
    // duplicated copy here would silently start rejecting valid submissions the
    // moment the two drift. Sanitizing is enough — this value only ever lands in
    // a plaintext email body, so collapse whitespace and cap the length so a
    // hand-crafted POST can't stuff the email with junk.
    timeline: get('timeline').replace(/\s+/g, ' ').slice(0, 80),
    gotcha: get('_gotcha'),
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = wantsJson(request);

  // For a native (no-JS) submit we redirect; for a fetch we return JSON.
  const respond = (ok, status, extra = {}) =>
    json
      ? new Response(JSON.stringify({ ok, ...extra }), {
          status,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(null, {
          status: 303,
          headers: { location: ok ? '/thanks/' : '/contact/?error=1' },
        });

  let f;
  try {
    f = await readFields(request);
  } catch {
    return respond(false, 400, { error: 'Could not read the form data.' });
  }

  // Honeypot: a bot filled the hidden field. Pretend success, send nothing.
  if (f.gotcha) return respond(true, 200);

  if (!f.name || !f.email || !f.message) {
    return respond(false, 422, { error: 'Please fill in your name, email, and a message.' });
  }
  if (!EMAIL_RE.test(f.email)) {
    return respond(false, 422, { error: 'That email address looks off — mind checking it?' });
  }
  if (!env.RESEND_API_KEY) {
    return respond(false, 500, { error: 'The contact form isn’t configured yet.' });
  }

  const text =
    `New message from jahutton.build\n\n` +
    `Name:  ${f.name}\n` +
    `Email: ${f.email}\n` +
    (f.timeline ? `Timeline: ${f.timeline}\n` : '') +
    `\n${f.message}\n`;

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

  return respond(true, 200);
}
