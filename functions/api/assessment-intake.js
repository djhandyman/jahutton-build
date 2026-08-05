// Cloudflare Pages Function — POST /api/assessment-intake
//
// Handles the Build Assessment multi-step intake (AssessmentIntake.astro). Composes the two
// existing Functions on this site:
//   • functions/api/feedback.js — Supabase insert (durable-first) + Claude enrichment via tool-use
//   • functions/api/contact.js  — Resend email + dual-mode response (JSON for fetch / 303 for no-JS)
//
// Flow: honeypot → validate required → save to Supabase (best-effort) → Claude triage
// (best-effort) → email Jon via Resend → respond. Email is the primary notification, so it is
// the one step that must succeed: a paused/unconfigured Supabase or an LLM hiccup must never
// cost Jon the lead. (This is a deliberate softening of feedback.js's "insert is required" —
// there the row IS the product; here the email is.)
//
// Env (Cloudflare Pages → Settings → Environment variables, and .dev.vars locally):
//   RESEND_API_KEY             — required; the email send
//   SUPABASE_URL               — optional; if set with the key below, each intake is saved
//   SUPABASE_SERVICE_ROLE_KEY  — optional; service-role key, SERVER ONLY, bypasses RLS
//   ANTHROPIC_API_KEY          — optional; if set, Claude triages the intake before Jon sees it
// Optional:
//   CONTACT_TO / CONTACT_FROM  — reused from the contact form (same inbox / sender)
//   INTAKE_MODEL               — default 'claude-sonnet-4-6'

const DEFAULT_TO = 'jahutton@gmail.com';
const DEFAULT_FROM = 'jahutton.build <onboarding@resend.dev>';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FITS = ['strong', 'possible', 'weak', 'out-of-scope'];

// Cloudflare Turnstile server-side verification. Returns true when the token checks out.
// If TURNSTILE_SECRET_KEY isn't set, verification is SKIPPED (returns true) so an unconfigured
// deploy still works — set the secret in production to actually enforce it. The public site key
// (src/data/site.js) and this secret must be swapped from test → real together.
async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured — don't block submissions
  if (!token) {
    // No token reached the server at all — distinct from one Cloudflare rejected, and it returns
    // BEFORE siteverify, so the error-codes log below never fires for this case. Almost always a
    // CLIENT problem: the widget never rendered, or its token field was empty at submit.
    console.error('turnstile: no token in submission (widget did not render, or field was empty)');
    return false;
  }
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

function clip(v, n) {
  return v == null ? '' : String(v).trim().slice(0, n);
}

async function readFields(request) {
  const ctype = request.headers.get('content-type') || '';
  const src = ctype.includes('application/json')
    ? await request.json()
    : Object.fromEntries(await request.formData());
  return {
    situation: clip(src.situation, 120),
    description: clip(src.description, 5000),
    stage: clip(src.stage, 60),
    tried: clip(src.tried, 5000),
    timeline: clip(src.timeline, 80),
    budget_band: clip(src.budget_band, 80),
    // Size, as opposed to budget_band's readiness — the field that lets the intake filter for
    // the build size the pricing is aimed at. Added 2026-08-05; see src/data/intake.js.
    invest_band: clip(src.invest_band, 80),
    links: clip(src.links, 500),
    name: clip(src.name, 120),
    email: clip(src.email, 200),
    org: clip(src.org, 160),
    referral: clip(src.referral, 200),
    // Honeypot — a real user never fills this hidden field; a bot that does is silently dropped.
    website: clip(src.website, 100),
    // Turnstile token: 'turnstile' from the fetch (JSON) path, 'cf-turnstile-response' from a
    // native form POST. Required here — see the strict gate in onRequestPost.
    turnstile: clip(src.turnstile, 4000) || clip(src['cf-turnstile-response'], 4000),
  };
}

// --- Supabase (PostgREST) — service-role key, server-side only. Best-effort. ---

async function insertIntake(env, row) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/assessment_intake`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`supabase insert ${r.status}: ${await r.text()}`);
  return (await r.json())[0];
}

async function updateIntake(env, id, patch) {
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/assessment_intake?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(patch),
    },
  );
  if (!r.ok) throw new Error(`supabase update ${r.status}: ${await r.text()}`);
}

// --- Claude triage: summary + fit + prep. Thrown errors are handled by the caller. ---

async function triage(env, f) {
  const model = env.INTAKE_MODEL || DEFAULT_MODEL;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      thinking: { type: 'disabled' }, // low-latency classification
      system:
        'You triage inbound leads for Jonathan A. Hutton, an independent builder who sells a paid ' +
        '"Build Assessment" (a scoped written plan) to solo operators, small businesses, and nonprofits. ' +
        'His work: software, systems, and organizational structure — turning an ambiguous problem into a ' +
        'finished, working thing, usually solo with heavy AI leverage. Use the record_triage tool. ' +
        'STRONG fit = a concrete, buildable problem from a decision-maker with some readiness (a timeline ' +
        'or budget signal). WEAK = vague, no readiness, or barely related. OUT-OF-SCOPE = enterprise-scale, ' +
        'spam, a job pitch, or unrelated to what he builds. Be blunt and brief; this is a private note to Jon.',
      messages: [
        {
          role: 'user',
          content:
            `New Build Assessment intake:\n\n` +
            `Problem type: ${f.situation || '—'}\n` +
            `Description: ${f.description}\n` +
            `Stage: ${f.stage || '—'}\n` +
            `Tried: ${f.tried || '—'}\n` +
            `Timeline: ${f.timeline || '—'}\n` +
            `Budget: ${f.budget_band || '—'}\n` +
            `Able to invest: ${f.invest_band || '—'}\n` +
            `Links: ${f.links || '—'}\n` +
            `From: ${f.name} <${f.email}>${f.org ? ` · ${f.org}` : ''}\n`,
        },
      ],
      tools: [
        {
          name: 'record_triage',
          description: 'Record the triage read on this intake.',
          input_schema: {
            type: 'object',
            properties: {
              summary: { type: 'string', description: 'One-line summary of what they want.' },
              fit: { type: 'string', enum: FITS },
              rationale: { type: 'string', description: 'One or two sentences on the fit call.' },
              suggested_prep: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 3,
                description: 'Up to 3 short things for Jon to do/look at before the call.',
              },
            },
            required: ['summary', 'fit', 'rationale'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'record_triage' },
    }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const input = (data.content || []).find((b) => b.type === 'tool_use')?.input || {};
  const fit = FITS.includes(input.fit) ? input.fit : 'possible';
  const prep = Array.isArray(input.suggested_prep)
    ? input.suggested_prep.filter((s) => typeof s === 'string' && s.trim()).slice(0, 3)
    : [];
  return {
    summary: clip(input.summary, 300) || '(no summary)',
    fit,
    rationale: clip(input.rationale, 600),
    prep,
  };
}

function buildEmail(f, t) {
  const triageBlock = t
    ? `TRIAGE (Claude)\n` +
      `  Fit: ${t.fit}\n` +
      `  ${t.summary}\n` +
      (t.rationale ? `  ${t.rationale}\n` : '') +
      (t.prep.length ? `  Prep:\n${t.prep.map((p) => `   - ${p}`).join('\n')}\n` : '')
    : `TRIAGE (Claude)\n  Unavailable — triage didn’t run. Read the intake below.\n`;

  return (
    `NEW BUILD ASSESSMENT INTAKE\n\n` +
    triageBlock +
    `\n— — —\n` +
    `From:     ${f.name} <${f.email}>${f.org ? ` · ${f.org}` : ''}\n` +
    (f.referral ? `Referral: ${f.referral}\n` : '') +
    `\nProblem type: ${f.situation || '—'}\n` +
    `What’s going on:\n${f.description}\n` +
    `\nStage: ${f.stage || '—'}\n` +
    (f.tried ? `Tried:\n${f.tried}\n` : '') +
    `\nTimeline: ${f.timeline || '—'}\n` +
    `Budget:   ${f.budget_band || '—'}\n` +
    `Invest:   ${f.invest_band || '—'}\n` +
    (f.links ? `Links:    ${f.links}\n` : '')
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = wantsJson(request);

  const respond = (ok, status, extra = {}) =>
    json
      ? new Response(JSON.stringify({ ok, ...extra }), {
          status,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(null, {
          status: 303,
          headers: { location: ok ? '/thanks/' : '/assessment/intake/?error=1' },
        });

  let f;
  try {
    f = await readFields(request);
  } catch {
    return respond(false, 400, { error: 'Could not read the form data.' });
  }

  // Honeypot: a bot filled the hidden field. Pretend success, do nothing.
  if (f.website) return respond(true, 200);

  if (!f.name || !f.email || !f.description) {
    return respond(false, 422, { error: 'Please include your name, email, and a description.' });
  }
  if (!EMAIL_RE.test(f.email)) {
    return respond(false, 422, { error: 'That email address looks off — mind checking it?' });
  }

  // Turnstile — STRICT here, and BEFORE any billable work: this intake costs a Claude call + a
  // Supabase row + an email per submit, so a missing/invalid token is rejected outright (a no-JS
  // POST has no token and is dropped). turnstileOk() no-ops when TURNSTILE_SECRET_KEY is unset, so
  // local/unconfigured runs still work. This gate is the whole point of the split-by-cost policy.
  if (!(await turnstileOk(env, f.turnstile, request.headers.get('cf-connecting-ip')))) {
    return respond(false, 403, {
      error: 'That spam check didn’t pass — please reload the page and try again.',
    });
  }

  if (!env.RESEND_API_KEY) {
    return respond(false, 500, { error: 'The intake form isn’t configured yet.' });
  }

  // 1) Save to Supabase — best-effort. A paused/unconfigured project must not lose the lead;
  //    the email below is the real notification.
  let savedId = null;
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const saved = await insertIntake(env, {
        situation: f.situation || null,
        description: f.description,
        stage: f.stage || null,
        tried: f.tried || null,
        timeline: f.timeline || null,
        budget_band: f.budget_band || null,
        invest_band: f.invest_band || null,
        links: f.links || null,
        name: f.name,
        email: f.email,
        org: f.org || null,
        referral: f.referral || null,
      });
      savedId = saved?.id ?? null;
    } catch (e) {
      console.error('intake insert failed (continuing to email):', e);
    }
  }

  // 2) Triage — best-effort. Any failure is swallowed; the email still goes with a note.
  let t = null;
  if (env.ANTHROPIC_API_KEY) {
    try {
      t = await triage(env, f);
      if (savedId) {
        await updateIntake(env, savedId, {
          triage_summary: t.summary,
          triage_fit: t.fit,
          triage_rationale: t.rationale,
          triage_prep: t.prep,
        }).catch((e) => console.error('intake triage update failed (row already saved):', e));
      }
    } catch (e) {
      console.error('intake triage failed:', e);
      t = null;
    }
  }

  // 3) Email Jon — the one step that must succeed.
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
        reply_to: f.email,
        subject: `Build Assessment intake — ${f.name}${t ? ` [${t.fit}]` : ''}`,
        text: buildEmail(f, t),
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

  return respond(true, 200, { id: savedId });
}
