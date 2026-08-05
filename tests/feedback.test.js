// functions/api/feedback.js — STRICT Turnstile, Supabase row required, Claude optional.
//
// The mirror image of assessment-intake.js, and that inversion is deliberate: here the SAVED ROW
// is the product, so the insert happens first and must succeed, while the Claude tagging and
// follow-up question are enrichment a visitor never sees fail. Get these two Functions' policies
// backwards and the site loses either leads or feedback, silently. That's what this file pins.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/feedback.js';
import {
  stubFetch, ok, fail, boom, turnstilePass, turnstileFail,
  SITEVERIFY, SUPABASE, ANTHROPIC, RESEND, jsonRequest, env, bodyOf,
} from './helpers.js';

const URL_ = 'https://jahutton.build/api/feedback';
const valid = {
  raw_text: 'The services page confused me.',
  turnstile: 'tok',
  page_url: 'https://jahutton.build/services/',
};

const enrichReply = ok({
  content: [{ type: 'text', text: JSON.stringify({ tags: ['copy'], sentiment: 'mixed' }) }],
});

const happy = [
  [SITEVERIFY, turnstilePass],
  [SUPABASE, ok([{ id: 'fb-1' }])],
  [ANTHROPIC, enrichReply],
];

async function post(fields = valid, environment = env.full(), routes = happy) {
  const f = stubFetch(routes);
  try {
    const res = await onRequestPost({ request: jsonRequest(URL_, fields), env: environment });
    return { res, body: await bodyOf(res), f };
  } finally {
    f.restore();
  }
}

test('the happy path saves the note and reports ok', async () => {
  const { res, body, f } = await post();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.ok(f.hit(SUPABASE));
});

test('REQUIRED: a failed insert fails the request — the row IS the product', async () => {
  const rejected = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, fail(503, 'paused')],
  ]);
  assert.equal(rejected.res.status, 502);
  assert.equal(rejected.body.ok, false);

  const unreachable = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, boom],
  ]);
  assert.equal(unreachable.res.status, 502);
});

test('BEST-EFFORT: enrichment failure is invisible to the visitor', async () => {
  const { res, body } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'fb-1' }])],
    [ANTHROPIC, fail(529, 'overloaded')],
  ]);
  assert.equal(res.status, 200, 'the note was saved; a dead LLM is not the visitor’s problem');
  assert.equal(body.ok, true);
});

test('BEST-EFFORT: unreachable Claude is also swallowed', async () => {
  const { res } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'fb-1' }])],
    [ANTHROPIC, boom],
  ]);
  assert.equal(res.status, 200);
});

test('the insert happens BEFORE any Claude call', async () => {
  const { f } = await post();
  const firstSupabase = f.calls.findIndex((c) => c.url.includes(SUPABASE));
  const firstClaude = f.calls.findIndex((c) => c.url.includes(ANTHROPIC));
  assert.ok(firstSupabase !== -1 && firstClaude !== -1);
  assert.ok(firstSupabase < firstClaude, 'save first, enrich second — order is the policy');
});

// --- Turnstile: strict, no no-JS path to protect ------------------------------------------------

test('STRICT: a missing token is rejected before the insert', async () => {
  const { raw_text, page_url } = valid;
  const { res, body, f } = await post({ raw_text, page_url }, env.full(), []);
  assert.equal(res.status, 403);
  assert.match(body.error, /spam check/i);
  assert.equal(f.hit(SUPABASE), false);
  assert.equal(f.hit(ANTHROPIC), false);
});

test('STRICT: an invalid token is rejected before the insert', async () => {
  const { res, f } = await post(valid, env.full(), [[SITEVERIFY, turnstileFail]]);
  assert.equal(res.status, 403);
  assert.equal(f.hit(SUPABASE), false);
});

test('an unconfigured secret skips verification', async () => {
  const { raw_text } = valid;
  const { res, f } = await post({ raw_text }, env.full({ TURNSTILE_SECRET_KEY: undefined }), [
    [SUPABASE, ok([{ id: 'fb-1' }])],
    [ANTHROPIC, enrichReply],
  ]);
  assert.equal(res.status, 200);
  assert.equal(f.hit(SITEVERIFY), false);
});

// --- Validation and honeypot ----------------------------------------------------------------------

test('honeypot: pretends success, saves nothing', async () => {
  const { res, body, f } = await post({ ...valid, website: 'http://spam.example' }, env.full(), []);
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(f.calls.length, 0);
});

test('an empty note is rejected, and a bad address with it', async () => {
  const empty = await post({ ...valid, raw_text: '' }, env.full(), []);
  assert.equal(empty.res.status, 422);

  const badEmail = await post({ ...valid, email: 'nope' }, env.full(), []);
  assert.equal(badEmail.res.status, 422);
});

test('unconfigured Supabase is a 500, not a pretend success', async () => {
  const noDb = env.full({ SUPABASE_URL: undefined, SUPABASE_SERVICE_ROLE_KEY: undefined });
  const { res, body } = await post(valid, noDb, [[SITEVERIFY, turnstilePass]]);
  assert.equal(res.status, 500);
  assert.equal(body.ok, false);
});

// --- Shape 2: the follow-up answer ------------------------------------------------------------------

test('a follow-up answer updates the row and is NOT spam-gated', async () => {
  // It needs a prior id and does no LLM work, so there's nothing to protect and no token to
  // expect — the widget's Turnstile token was already spent on the initial submit.
  const { res, body, f } = await post(
    { id: 'fb-1', follow_up_answer: 'Mostly the pricing section.' },
    env.full(),
    [[SUPABASE, ok([{ id: 'fb-1' }])]],
  );
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(f.hit(SITEVERIFY), false, 'the follow-up must not require a second token');
  assert.equal(f.hit(ANTHROPIC), false);
});

test('a follow-up whose update fails reports the failure', async () => {
  const { res } = await post(
    { id: 'fb-1', follow_up_answer: 'More detail.' },
    env.full(),
    [[SUPABASE, fail(503)]],
  );
  assert.equal(res.status, 502);
});

test('feedback never sends email — that is contact and intake only', async () => {
  const { f } = await post();
  assert.equal(f.hit(RESEND), false);
});
