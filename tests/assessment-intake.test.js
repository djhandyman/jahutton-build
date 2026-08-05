// functions/api/assessment-intake.js — STRICT Turnstile, email required, everything else optional.
//
// The failure policy is the point of this file, and it is the opposite of feedback.js:
//   Resend email   REQUIRED  — the email IS the lead
//   Supabase row   best-effort — a paused project must never cost a lead
//   Claude triage  best-effort — a nice-to-have on Jon's notification
// If a refactor ever makes Supabase or Claude able to fail the request, these tests are what
// catches it. That inversion between the two Functions is the site's central design idea.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/assessment-intake.js';
import {
  stubFetch, ok, fail, boom, turnstilePass, turnstileFail,
  SITEVERIFY, RESEND, SUPABASE, ANTHROPIC, jsonRequest, formRequest, env, bodyOf,
} from './helpers.js';

const URL_ = 'https://jahutton.build/api/assessment-intake';
const valid = {
  name: 'Jesse',
  email: 'jesse@example.com',
  description: 'A membership system held together by spreadsheets.',
  turnstile: 'tok',
};

// Claude's triage response, in the shape the Function parses out of the Messages API.
const triageReply = ok({
  content: [
    {
      type: 'text',
      text: JSON.stringify({
        summary: 'Spreadsheet-bound membership ops.',
        fit: 'strong',
        rationale: 'Clear scope.',
        prep: 'Ask about headcount.',
      }),
    },
  ],
});

const happy = [
  [SITEVERIFY, turnstilePass],
  [SUPABASE, ok([{ id: 'row-1' }])],
  [ANTHROPIC, triageReply],
  [RESEND, ok({ id: 'e1' })],
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

test('the happy path saves, triages, emails, and returns the row id', async () => {
  const { res, body, f } = await post();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.id, 'row-1');
  assert.equal(f.count(RESEND), 1);
  assert.ok(f.hit(SUPABASE));
  assert.ok(f.hit(ANTHROPIC));
});

// --- Turnstile: strict, and before anything billable -----------------------------------------

test('STRICT: a missing token is rejected, and nothing billable runs', async () => {
  const { name, email, description } = valid;
  const { res, body, f } = await post({ name, email, description }, env.full(), []);
  assert.equal(res.status, 403);
  assert.match(body.error, /spam check/i);
  // This is the assertion that matters: the gate exists to protect spend.
  assert.equal(f.hit(SUPABASE), false, 'no row');
  assert.equal(f.hit(ANTHROPIC), false, 'no Claude call');
  assert.equal(f.hit(RESEND), false, 'no email');
});

test('STRICT: an invalid token is rejected the same way', async () => {
  const { res, f } = await post(valid, env.full(), [[SITEVERIFY, turnstileFail]]);
  assert.equal(res.status, 403);
  assert.equal(f.hit(RESEND), false);
});

test('an unconfigured secret skips verification so local runs work', async () => {
  const { name, email, description } = valid;
  const routes = [[SUPABASE, ok([{ id: 'r' }])], [ANTHROPIC, triageReply], [RESEND, ok()]];
  const { res, f } = await post({ name, email, description }, env.full({ TURNSTILE_SECRET_KEY: undefined }), routes);
  assert.equal(res.status, 200);
  assert.equal(f.hit(SITEVERIFY), false);
});

// --- The failure policy ------------------------------------------------------------------------

test('BEST-EFFORT: a dead Supabase must not cost the lead', async () => {
  const { res, body, f } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, fail(503, 'project paused')],
    [ANTHROPIC, triageReply],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200, 'a paused Supabase project must never lose a lead');
  assert.equal(body.ok, true);
  assert.equal(body.id, null, 'no row was saved, and the response says so honestly');
  assert.equal(f.count(RESEND), 1, 'the email still went');
});

test('BEST-EFFORT: an unreachable Supabase must not cost the lead', async () => {
  const { res, f } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, boom],
    [ANTHROPIC, triageReply],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200);
  assert.equal(f.count(RESEND), 1);
});

test('BEST-EFFORT: a failed triage still emails, just without the verdict', async () => {
  const { res, f } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'row-1' }])],
    [ANTHROPIC, fail(529, 'overloaded')],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200);
  const sent = f.calls.find((c) => c.url.includes(RESEND));
  assert.doesNotMatch(sent.body.subject, /\[/, 'no fit tag when triage failed');
});

test('BEST-EFFORT: garbage back from Claude is swallowed, not thrown', async () => {
  const { res } = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'row-1' }])],
    [ANTHROPIC, ok({ content: [{ type: 'text', text: 'not json at all' }] })],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200);
});

test('REQUIRED: the email is the one step allowed to fail the request', async () => {
  const rejected = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'r' }])],
    [ANTHROPIC, triageReply],
    [RESEND, fail(422, 'bad sender')],
  ]);
  assert.equal(rejected.res.status, 502);
  assert.equal(rejected.body.ok, false);

  const unreachable = await post(valid, env.full(), [
    [SITEVERIFY, turnstilePass],
    [SUPABASE, ok([{ id: 'r' }])],
    [ANTHROPIC, triageReply],
    [RESEND, boom],
  ]);
  assert.equal(unreachable.res.status, 502);
});

test('no Resend key at all is a 500 before any work happens', async () => {
  const { res, f } = await post(valid, env.full({ RESEND_API_KEY: undefined }), [
    [SITEVERIFY, turnstilePass],
  ]);
  assert.equal(res.status, 500);
  assert.equal(f.hit(SUPABASE), false);
});

test('invest_band reaches the email, the triage prompt and the row', async () => {
  // Added with the $2,500 price (2026-08-05). It's the only field that filters for build SIZE —
  // budget_band reports readiness — so a refactor that quietly drops it costs the filter the
  // price change was made to support, and nothing visible would break.
  const { res, f } = await post({ ...valid, invest_band: '$25–50k' });
  assert.equal(res.status, 200);

  const email = f.calls.find((c) => c.url.includes(RESEND));
  assert.match(email.body.text, /\$25–50k/, 'the email Jon actually reads must carry it');

  const claude = f.calls.find((c) => c.url.includes(ANTHROPIC));
  assert.match(JSON.stringify(claude.body), /\$25–50k/, 'triage should see it too');

  const row = f.calls.find((c) => c.url.includes(SUPABASE));
  assert.equal(row.body.invest_band, '$25–50k');
});

test('a blank invest_band is stored as null and never blocks a submit', async () => {
  const { res, f } = await post();
  assert.equal(res.status, 200, 'every qualifier on this form is optional');
  const row = f.calls.find((c) => c.url.includes(SUPABASE));
  assert.equal(row.body.invest_band, null);
});

// --- Validation and honeypot --------------------------------------------------------------------

test('honeypot: pretends success, spends nothing', async () => {
  const { res, body, f } = await post({ ...valid, website: 'http://spam.example' }, env.full(), []);
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(f.calls.length, 0, 'not even a siteverify call');
});

test('validation runs before the spam check and before any spend', async () => {
  const { res, f } = await post({ ...valid, description: '' }, env.full(), []);
  assert.equal(res.status, 422);
  assert.equal(f.calls.length, 0);
});

// --- Dual-mode responses --------------------------------------------------------------------------

test('a native form POST redirects rather than returning JSON', async () => {
  const f = stubFetch([[SITEVERIFY, turnstilePass], [SUPABASE, ok([{ id: 'r' }])], [ANTHROPIC, triageReply], [RESEND, ok()]]);
  try {
    const res = await onRequestPost({ request: formRequest(URL_, valid), env: env.full() });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), '/thanks/');
  } finally {
    f.restore();
  }
});

test('a rejected no-JS submit returns to the form with an error flag', async () => {
  const f = stubFetch([[SITEVERIFY, turnstileFail]]);
  try {
    const res = await onRequestPost({ request: formRequest(URL_, valid), env: env.full() });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), '/assessment/intake/?error=1');
  } finally {
    f.restore();
  }
});
