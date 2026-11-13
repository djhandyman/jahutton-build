// functions/api/_middleware.js — the off switch for the form endpoints.
//
// The three Function test files call the handlers directly, so they keep passing whether an
// endpoint is open or closed; they pin what a handler does once a request reaches it. This file
// pins whether a request reaches it at all.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest, CLOSED } from '../functions/api/_middleware.js';
import { jsonRequest, formRequest, bodyOf } from './helpers.js';

const ORIGIN = 'https://jahutton.build';

// A `next` that records whether the middleware let the request through to a Function.
function run(request) {
  let reached = false;
  const next = async () => {
    reached = true;
    return new Response('handler');
  };
  return onRequest({ request, next }).then((res) => ({ res, reached: () => reached }));
}

test('CLOSED: a fetch to a closed endpoint gets a 503 and never reaches the Function', async () => {
  for (const path of CLOSED) {
    const { res, reached } = await run(jsonRequest(ORIGIN + path, { name: 'x' }));
    assert.equal(res.status, 503, path);
    const body = await bodyOf(res);
    assert.equal(body.ok, false);
    assert.match(body.error, /offline/i);
    assert.equal(reached(), false, `${path} must not reach its handler while closed`);
  }
});

test('CLOSED: a native form post to a closed endpoint is sent to /contact/, not to a handler', async () => {
  for (const path of CLOSED) {
    const { res, reached } = await run(formRequest(ORIGIN + path, { name: 'x' }));
    assert.equal(res.status, 303, path);
    assert.equal(res.headers.get('location'), '/contact/');
    assert.equal(reached(), false);
  }
});

test('a trailing slash does not get around the switch', async () => {
  const [path] = CLOSED;
  const { res, reached } = await run(jsonRequest(`${ORIGIN}${path}/`, {}));
  assert.equal(res.status, 503);
  assert.equal(reached(), false);
});

test('anything not on the list passes straight through', async () => {
  const { res, reached } = await run(jsonRequest(`${ORIGIN}/api/something-else`, {}));
  assert.equal(reached(), true);
  assert.equal(await res.text(), 'handler');
});

test('the contact endpoint is closed while the contact form is off the page', () => {
  // The pairing that matters most: this is the endpoint the spam was arriving at. If the form
  // goes back on /contact, this line and `contact.formEnabled` in src/data/site.js change together.
  assert.ok(CLOSED.has('/api/contact'));
});
