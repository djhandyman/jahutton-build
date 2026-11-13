// Cloudflare Pages middleware for /api/* — the off switch for the form endpoints.
//
// Added 2026-11-13, when the contact form and the Build Assessment pages were taken off the
// site (see docs/architecture.md). Removing a form from a page does nothing about the endpoint
// behind it: the bots that had been posting to /api/contact never needed the page, only the
// URL. So while a form is off, its endpoint is off too, and it is turned off HERE rather than
// inside each Function so that the three handlers and their tests stay exactly as they are —
// reopening is deleting a line from CLOSED, not reverting a change to a handler.
//
// This is not a fourth Function. It handles nothing; it only decides whether a request
// reaches one.
//
// ⚠️ Moves together with the page-side switches: `contact.formEnabled` and `feedback.enabled`
// in src/data/site.js, and the parked `_assessment/` pages in src/pages/. A Function can't
// import site.js (it reads import.meta.env, which doesn't exist here), so this list is a
// second copy on purpose. An endpoint open with no form is where spam comes in; a form
// rendered over a closed endpoint is a form that always fails. tests/build-output.test.js
// checks the page side, tests/middleware.test.js checks this side.
export const CLOSED = new Set(['/api/contact', '/api/assessment-intake', '/api/feedback']);

// Shown by a page that was loaded before the form came down and still has it on screen.
const MESSAGE = 'This form is offline for now. You can reach me on LinkedIn.';

export async function onRequest(context) {
  const { request, next } = context;
  const path = new URL(request.url).pathname.replace(/\/+$/, '');
  if (!CLOSED.has(path)) return next();

  // Same dual-mode rule as the Functions: JSON to a fetch, a redirect to a native form post.
  const accept = request.headers.get('accept') || '';
  const ctype = request.headers.get('content-type') || '';
  if (accept.includes('application/json') || ctype.includes('application/json')) {
    return new Response(JSON.stringify({ ok: false, error: MESSAGE }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(null, { status: 303, headers: { location: '/contact/' } });
}
