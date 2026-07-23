-- Feedback widget storage (functions/api/feedback.js → FeedbackWidget.astro).
--
-- This table was originally created by hand in the Supabase dashboard, which meant the
-- schema lived nowhere in the repo. When the project was paused for inactivity
-- (2026-07-23) there was no way to tell what had to be recreated. This file is the
-- source of truth now — re-runnable, so applying it against a live project is safe.
--
-- Columns mirror exactly what the Pages Function reads and writes:
--   insertFeedback() → page_url, raw_text, name, email
--   updateFeedback() → category_tags, follow_up_question  (enrichment, may never arrive)
--   updateFeedback() → follow_up_answer                   (second round trip, optional)

create table if not exists public.feedback (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Written on the initial submit.
  raw_text            text not null,
  page_url            text,
  name                text,
  email               text,

  -- Written by the Claude enrichment pass. Nullable by design: the row is inserted
  -- first and enrichment failure is swallowed, so these stay null on an LLM hiccup.
  category_tags       text[],
  follow_up_question  text,

  -- Written if the visitor answers the follow-up question.
  follow_up_answer    text
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

-- RLS on with NO policies = deny all. The Function talks to PostgREST with the
-- service-role key, which bypasses RLS; nothing else should ever reach this table.
-- Do not add an anon insert policy — the browser never touches Supabase directly.
alter table public.feedback enable row level security;
