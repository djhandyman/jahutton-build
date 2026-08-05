-- Build Assessment intake storage (functions/api/assessment-intake.js → AssessmentIntake.astro).
--
-- Mirrors the 0001_feedback.sql convention: this file is the source of truth, re-runnable,
-- RLS on with no policies (deny-all) because the Pages Function talks to PostgREST with the
-- service-role key, which bypasses RLS. The browser never touches Supabase directly.
--
-- Columns mirror exactly what the Function writes:
--   insert (durable-first) → situation, description, stage, tried, timeline, budget_band,
--                            links, name, email, org, referral
--                            (+ invest_band, added in 0003 — apply migrations in order)
--   update (Claude triage, may never arrive) → triage_summary, triage_fit, triage_rationale,
--                            triage_prep

create table if not exists public.assessment_intake (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- Written on submit. `description`, `name`, `email` are required at the app layer.
  situation          text,
  description        text not null,
  stage              text,
  tried              text,
  timeline           text,
  budget_band        text,
  links              text,
  name               text not null,
  email              text not null,
  org                text,
  referral           text,

  -- Written by the Claude triage pass. Nullable by design: the row is inserted first and
  -- triage failure is swallowed, so these stay null on an LLM hiccup.
  triage_summary     text,
  triage_fit         text,   -- strong | possible | weak | out-of-scope
  triage_rationale   text,
  triage_prep        text[]
);

create index if not exists assessment_intake_created_at_idx on public.assessment_intake (created_at desc);

-- RLS on with NO policies = deny all. Service-role key (server-only) bypasses this.
-- Do not add an anon insert policy — the browser never touches Supabase directly.
alter table public.assessment_intake enable row level security;
