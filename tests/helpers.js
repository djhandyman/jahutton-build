// Test harness for the three Pages Functions.
//
// ZERO DEPENDENCIES, on purpose. `node:test` and `node:assert` ship inside Node 22, so nothing
// here touches package.json — which matters, because "four dependencies" is a claim the README
// badge, the README prose, the /work/this-site teaser, its blurb, and a metrics card on that page
// all make, next to a link to this repo. A test runner in devDependencies would falsify five
// checkable claims to test three files.
//
// The Functions import cleanly under plain Node: they export `onRequestPost(context)` and use
// only `fetch`, `Request`, `Response` and `URLSearchParams`, all of which are Node globals since
// 18. So these are real tests against the real handlers — not a reimplementation of them.

/**
 * Replace globalThis.fetch with a router. `routes` is an array of [substring, handler] pairs,
 * matched in order against the request URL; `handler` is a Response or a function returning one.
 * An unmatched URL throws loudly rather than returning a plausible-looking empty response —
 * a test that silently stubs nothing is worse than no test.
 */
export function stubFetch(routes = []) {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(input && input.url ? input.url : input);
    calls.push({ url, init, body: init?.body ? safeParse(init.body) : null });
    for (const [pattern, handler] of routes) {
      if (url.includes(pattern)) {
        if (typeof handler === 'function') return await handler(url, init);
        // A Response body can only be read once, and the presets below are module-level
        // singletons shared across every test in a file. Hand out a clone and never read the
        // original, or the second test to use one gets an empty body, the Function's `r.json()`
        // throws, and it looks like an app failure. (It did, once.)
        return handler instanceof Response ? handler.clone() : handler;
      }
    }
    throw new Error(`unstubbed fetch in test: ${url}`);
  };
  return {
    calls,
    /** URLs hit, for asserting a billable step did or didn't run. */
    hit: (pattern) => calls.some((c) => c.url.includes(pattern)),
    count: (pattern) => calls.filter((c) => c.url.includes(pattern)).length,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

function safeParse(body) {
  try {
    return JSON.parse(String(body));
  } catch {
    return String(body);
  }
}

export const ok = (data = {}) =>
  new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } });
export const fail = (status = 500, text = 'nope') => new Response(text, { status });
export const boom = () => {
  throw new Error('network down');
};

/** Turnstile siteverify outcomes, by their real response shape. */
export const turnstilePass = ok({ success: true });
export const turnstileFail = ok({ success: false, 'error-codes': ['invalid-input-response'] });
export const turnstileSpent = ok({ success: false, 'error-codes': ['timeout-or-duplicate'] });

export const SITEVERIFY = 'challenges.cloudflare.com/turnstile/v0/siteverify';
export const RESEND = 'api.resend.com/emails';
export const SUPABASE = 'supabase.co/rest/v1';
export const ANTHROPIC = 'api.anthropic.com';

/** A fetch (JS) submit: JSON in, JSON out. */
export function jsonRequest(url, body, headers = {}) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

/**
 * A native no-JS form POST: urlencoded in, 303 out. Deliberately sends no `accept: json`, which
 * is the only thing that distinguishes the two response modes.
 */
export function formRequest(url, fields) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
}

/** Env presets. Turnstile is OFF unless a secret is given — matching the Functions' own default. */
export const env = {
  /** Everything configured; Turnstile enforced. */
  full: (over = {}) => ({
    RESEND_API_KEY: 'test-resend',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role',
    ANTHROPIC_API_KEY: 'test-anthropic',
    TURNSTILE_SECRET_KEY: 'test-secret',
    ...over,
  }),
  /** Email only — no Supabase, no Claude, no Turnstile. The minimum a lead needs. */
  minimal: (over = {}) => ({ RESEND_API_KEY: 'test-resend', ...over }),
};

/** Read a Response as JSON without exploding on an empty (303) body. */
export async function bodyOf(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
