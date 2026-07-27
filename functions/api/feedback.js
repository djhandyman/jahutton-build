// Cloudflare Pages Function — POST /api/feedback
//
// Collects a short piece of visitor feedback, saves it to Supabase, and (server-side)
// enriches it with an LLM: 1–3 category tags and, ~30% of the time, one short follow-up
// question returned to the client. Mirrors functions/api/contact.js: secrets live here,
// never in the browser; the client only ever talks to this function.
//
// Two request shapes (both POST /api/feedback, JSON):
//   1. Initial submit  → { raw_text, name?, email?, page_url, website? (honeypot), turnstile }
//        Requires a valid Turnstile token (this path calls Claude). Inserts the row FIRST
//        (durable), then tries to tag + maybe generate a follow-up. Returns { ok: true, id,
//        followUpQuestion? }. LLM failure is swallowed — the row is already saved, so the
//        visitor never sees an error from a tagging hiccup.
//   2. Follow-up answer → { id, follow_up_answer }
//        Updates just that row's follow_up_answer. No LLM work and needs a prior id, so it is
//        not Turnstile-gated. Never blocks the initial submission.
//
// Required env (Cloudflare Pages → Settings → Environment variables, and .dev.vars locally):
//   ANTHROPIC_API_KEY          — Claude API key (for tagging / follow-up)
//   SUPABASE_URL               — e.g. https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  — service-role key; bypasses RLS. SERVER ONLY. Never ship to the browser.
// Optional:
//   FEEDBACK_MODEL             — default 'claude-sonnet-4-6'
//   FEEDBACK_FOLLOWUP_RATE     — 0..1, default '0.3'
//   TURNSTILE_SECRET_KEY       — if set, the initial submit requires a valid Turnstile token
//                                (verification is skipped when unset). See .dev.vars.example.

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_FOLLOWUP_RATE = 0.3;
// The tag vocabulary Claude classifies into. `category_tags` is an unconstrained text[] in
// Postgres (supabase/migrations/0001_feedback.sql), so this list is the only definition —
// adding to it needs no migration. Tags added here are NOT backfilled onto existing rows.
//
// positioning / call to action / credibility were added 2026-07-27 for the content beta
// (.temp/BETA-TEST-PLAN.md). Without them, "I can't tell what this guy does" collapsed into
// `clarity` or `other` — which is precisely the signal the beta exists to measure. They're
// general-purpose, not beta-scoped; leave them in afterwards.
const CATEGORIES = [
  'clarity',
  'tone',
  'positioning',      // what he does / who for — is it landing?
  'call to action',   // the ask itself: contact, Build Assessment, next step
  'credibility',      // do you believe he can do it — proof, evidence, trust
  'technical depth',
  'visual design',
  'missing content',
  'other',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (ok, status, extra = {}) =>
  new Response(JSON.stringify({ ok, ...extra }), {
    status,
    headers: { 'content-type': 'application/json' },
  });

function str(v) {
  return v == null ? '' : String(v).trim();
}

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
    return data.success === true;
  } catch {
    return false; // verifier unreachable — fail closed
  }
}

// --- Supabase (PostgREST) helpers — service-role key, server-side only ---

function sbHeaders(env) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'content-type': 'application/json',
  };
}

async function insertFeedback(env, row) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: { ...sbHeaders(env), prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`supabase insert ${r.status}: ${await r.text()}`);
  const rows = await r.json();
  return rows[0];
}

async function updateFeedback(env, id, patch) {
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/feedback?id=eq.${encodeURIComponent(id)}`,
    { method: 'PATCH', headers: sbHeaders(env), body: JSON.stringify(patch) },
  );
  if (!r.ok) throw new Error(`supabase update ${r.status}: ${await r.text()}`);
}

// --- Claude enrichment: tag + optional follow-up. Thrown errors are handled by the caller. ---

async function enrich(env, rawText, wantFollowUp) {
  const model = env.FEEDBACK_MODEL || DEFAULT_MODEL;
  const followUpInstruction = wantFollowUp
    ? 'Also write ONE short, specific follow-up question (max ~15 words) grounded in what they actually wrote, that would help the site author act on this feedback. Put it in follow_up_question.'
    : 'Do not write a follow-up question. Set follow_up_question to null.';

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      thinking: { type: 'disabled' }, // low-latency: this is a quick classification
      system:
        'You classify short visitor feedback left on a personal portfolio site (jahutton.build). ' +
        'Use the record_feedback tool. Pick the 1–3 category tags from the allowed set that best fit; ' +
        'do not invent categories.',
      messages: [
        {
          role: 'user',
          content:
            `Feedback:\n"""${rawText}"""\n\n` +
            `Tag it with 1–3 of these categories: ${CATEGORIES.join(', ')}. ` +
            followUpInstruction,
        },
      ],
      tools: [
        {
          name: 'record_feedback',
          description: 'Record the category tags and optional follow-up question for this feedback.',
          input_schema: {
            type: 'object',
            properties: {
              category_tags: {
                type: 'array',
                items: { type: 'string', enum: CATEGORIES },
                minItems: 1,
                maxItems: 3,
              },
              follow_up_question: {
                type: ['string', 'null'],
                description: 'One short follow-up question, or null.',
              },
            },
            required: ['category_tags'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'record_feedback' },
    }),
  });

  if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const block = (data.content || []).find((b) => b.type === 'tool_use' && b.name === 'record_feedback');
  const input = block?.input || {};

  // Defensive: keep only allowed tags, dedupe, cap at 3, never empty.
  let tags = Array.isArray(input.category_tags) ? input.category_tags.filter((t) => CATEGORIES.includes(t)) : [];
  tags = [...new Set(tags)].slice(0, 3);
  if (tags.length === 0) tags = ['other'];

  const followUp =
    wantFollowUp && typeof input.follow_up_question === 'string' && input.follow_up_question.trim()
      ? input.follow_up_question.trim()
      : null;

  return { tags, followUp };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json(false, 400, { error: 'Could not read the request.' });
  }

  // --- Shape 2: follow-up answer update ---
  const answer = str(body.follow_up_answer);
  const id = str(body.id);
  if (id && answer && !str(body.raw_text)) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(false, 500, { error: 'Not configured.' });
    }
    try {
      await updateFeedback(env, id, { follow_up_answer: answer });
      return json(true, 200);
    } catch (e) {
      console.error('feedback answer update failed:', e);
      return json(false, 502, { error: 'Could not save your answer.' });
    }
  }

  // --- Shape 1: initial submit ---
  // Honeypot: a bot filled the hidden field. Pretend success, save nothing.
  if (str(body.website)) return json(true, 200);

  const rawText = str(body.raw_text);
  const name = str(body.name);
  const email = str(body.email);
  const pageUrl = str(body.page_url);

  if (!rawText) return json(false, 422, { error: 'Please add a note before sending.' });
  if (email && !EMAIL_RE.test(email)) {
    return json(false, 422, { error: 'That email looks off — mind checking it?' });
  }

  // Turnstile — STRICT, and BEFORE the Supabase insert + Claude enrichment: the initial submit is
  // the billable path. The widget is JS-only, so there's no no-JS path to preserve. (The follow-up
  // answer shape above needs a prior id and does no LLM work, so it isn't gated.) turnstileOk()
  // no-ops when TURNSTILE_SECRET_KEY is unset, so local/unconfigured runs still work.
  const turnstile = str(body.turnstile) || str(body['cf-turnstile-response']);
  if (!(await turnstileOk(env, turnstile, request.headers.get('cf-connecting-ip')))) {
    return json(false, 403, {
      error: 'That spam check didn’t pass — please reload the page and try again.',
    });
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(false, 500, { error: 'The feedback form isn’t configured yet.' });
  }

  // 1) Save first — this must survive any LLM failure.
  let saved;
  try {
    saved = await insertFeedback(env, {
      page_url: pageUrl || null,
      raw_text: rawText,
      name: name || null,
      email: email || null,
    });
  } catch (e) {
    console.error('feedback insert failed:', e);
    return json(false, 502, { error: 'Couldn’t save that just now — please try again.' });
  }

  // 2) Enrich — tag + maybe a follow-up. Any failure here is silent; the row is safe.
  let followUpQuestion = null;
  if (env.ANTHROPIC_API_KEY) {
    const rate = Number(env.FEEDBACK_FOLLOWUP_RATE ?? DEFAULT_FOLLOWUP_RATE);
    const wantFollowUp = Math.random() < (Number.isFinite(rate) ? rate : DEFAULT_FOLLOWUP_RATE);
    try {
      const { tags, followUp } = await enrich(env, rawText, wantFollowUp);
      followUpQuestion = followUp;
      await updateFeedback(env, saved.id, {
        category_tags: tags,
        follow_up_question: followUp,
      });
    } catch (e) {
      console.error('feedback enrichment failed (row already saved):', e);
      followUpQuestion = null; // fail closed on the follow-up
    }
  }

  return json(true, 200, { id: saved.id, followUpQuestion });
}
