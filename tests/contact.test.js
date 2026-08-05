// functions/api/contact.js — the LENIENT form.
//
// Its failure policy: the Resend email is the product, so it is the only required step. Turnstile
// is verified when a token is present and skipped when it isn't, because a no-JS submit carries
// no token and contact is near-zero cost per send. That leniency is exactly why the Turnstile
// render-mode bug of 2026-08-05 was invisible here while it broke the intake form — so the test
// that a token-less submit still sends is guarding a real, load-bearing decision, not an accident.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/contact.js';
import {
  stubFetch, ok, fail, boom, turnstilePass, turnstileFail,
  SITEVERIFY, RESEND, jsonRequest, formRequest, env, bodyOf,
} from './helpers.js';

const URL_ = 'https://jahutton.build/api/contact';
const valid = { name: 'Jesse', email: 'jesse@example.com', message: 'Hello there.' };

async function post(fields, environment = env.minimal(), routes = [[RESEND, ok({ id: 'e1' })]]) {
  const f = stubFetch(routes);
  try {
    const res = await onRequestPost({ request: jsonRequest(URL_, fields), env: environment });
    return { res, body: await bodyOf(res), f };
  } finally {
    f.restore();
  }
}

test('sends the email and reports ok', async () => {
  const { res, body, f } = await post(valid);
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(f.count(RESEND), 1);
});

test('honeypot: pretends success and sends nothing', async () => {
  const { res, body, f } = await post({ ...valid, website: 'http://spam.example' }, env.minimal(), []);
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(f.hit(RESEND), false, 'a honeypot hit must not cost an email');
});

test('missing fields and bad addresses are rejected before the email', async () => {
  for (const fields of [{ ...valid, name: '' }, { ...valid, email: '' }, { ...valid, message: '' }]) {
    const { res, f } = await post(fields, env.minimal(), []);
    assert.equal(res.status, 422);
    assert.equal(f.hit(RESEND), false);
  }
  const { res } = await post({ ...valid, email: 'not-an-address' }, env.minimal(), []);
  assert.equal(res.status, 422);
});

test('unconfigured email service is a 500, not a silent success', async () => {
  const { res, body } = await post(valid, {}, []);
  assert.equal(res.status, 500);
  assert.equal(body.ok, false);
});

test('the email is the required step — a rejection or an outage fails the request', async () => {
  const rejected = await post(valid, env.minimal(), [[RESEND, fail(422, 'bad sender')]]);
  assert.equal(rejected.res.status, 502);
  assert.equal(rejected.body.ok, false);

  const unreachable = await post(valid, env.minimal(), [[RESEND, boom]]);
  assert.equal(unreachable.res.status, 502);
  assert.equal(unreachable.body.ok, false);
});

// --- Turnstile: lenient by design ------------------------------------------------------------

test('no token and no secret: verification is skipped entirely', async () => {
  const { res, f } = await post(valid, env.minimal(), [[RESEND, ok()]]);
  assert.equal(res.status, 200);
  assert.equal(f.hit(SITEVERIFY), false, 'nothing to verify, so siteverify must not be called');
});

test('LENIENT: a token-less submit still sends even when the secret IS configured', async () => {
  // The no-JS path, and the reason contact kept working through the render-mode bug.
  const { res, f } = await post(valid, env.full(), [[RESEND, ok()]]);
  assert.equal(res.status, 200);
  assert.equal(f.hit(SITEVERIFY), false);
  assert.equal(f.count(RESEND), 1);
});

test('a token that is present but invalid is rejected, and costs no email', async () => {
  const { res, body, f } = await post({ ...valid, turnstile: 'tok' }, env.full(), [
    [SITEVERIFY, turnstileFail],
  ]);
  assert.equal(res.status, 403);
  assert.match(body.error, /spam check/i);
  assert.equal(f.hit(RESEND), false);
});

test('a valid token verifies and then sends', async () => {
  const { res, f } = await post({ ...valid, turnstile: 'tok' }, env.full(), [
    [SITEVERIFY, turnstilePass],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200);
  assert.equal(f.count(SITEVERIFY), 1);
  assert.equal(f.count(RESEND), 1);
});

test('cf-turnstile-response is accepted as well as turnstile', async () => {
  const { res, f } = await post({ ...valid, 'cf-turnstile-response': 'tok' }, env.full(), [
    [SITEVERIFY, turnstilePass],
    [RESEND, ok()],
  ]);
  assert.equal(res.status, 200);
  assert.equal(f.count(SITEVERIFY), 1);
});

// --- The timeline key|label contract ----------------------------------------------------------

test('a qualifying timeline key offers the assessment; the label never decides', async () => {
  const { body } = await post({ ...valid, timeline: 'weeks|Whatever Jon reworded this to' });
  assert.equal(body.next, 'assessment');
});

test('a non-qualifying key does not offer it', async () => {
  const { body } = await post({ ...valid, timeline: 'someday|Just exploring' });
  assert.equal(body.next, undefined);
});

test('a value with no pipe degrades to label-only and can never block the send', async () => {
  const { res, body, f } = await post({ ...valid, timeline: 'Sometime next year' });
  assert.equal(res.status, 200, 'drift between copy and keys must not reject a submission');
  assert.equal(body.next, undefined);
  const sent = f.calls.find((c) => c.url.includes(RESEND));
  assert.match(sent.body.text, /Sometime next year/, 'the label still prints in the email');
});

test('the offer rides only on a message that actually left', async () => {
  // Qualified timeline, but the email fails: the response must not advertise the assessment.
  const { res, body } = await post({ ...valid, timeline: 'weeks|soon' }, env.minimal(), [
    [RESEND, fail(500)],
  ]);
  assert.equal(res.status, 502);
  assert.equal(body.next, undefined);
});

// --- Dual-mode responses ------------------------------------------------------------------------

test('a native form POST redirects instead of returning JSON', async () => {
  const f = stubFetch([[RESEND, ok()]]);
  try {
    const res = await onRequestPost({ request: formRequest(URL_, valid), env: env.minimal() });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), '/thanks/');
  } finally {
    f.restore();
  }
});

test('a qualified no-JS submit lands on the assessment thanks page', async () => {
  // The whole reason two prerendered thanks pages exist: a static page can't read ?next=.
  const f = stubFetch([[RESEND, ok()]]);
  try {
    const res = await onRequestPost({
      request: formRequest(URL_, { ...valid, timeline: 'underway|Already started' }),
      env: env.minimal(),
    });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), '/thanks/build-assessment/');
  } finally {
    f.restore();
  }
});

test('a failed no-JS submit goes back to the form with an error flag', async () => {
  const f = stubFetch([[RESEND, fail(500)]]);
  try {
    const res = await onRequestPost({ request: formRequest(URL_, valid), env: env.minimal() });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), '/contact/?error=1');
  } finally {
    f.restore();
  }
});
