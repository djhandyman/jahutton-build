-- Adds `invest_band` to assessment_intake (2026-08-05).
--
-- Why a second money column when `budget_band` already exists: they ask different questions and
-- only one of them filters. `budget_band` asks about READINESS ("Budgeted and ready to move"),
-- which says nothing about SIZE — that answer is equally true of a $4k job and a $40k one. When
-- the Build Assessment moved to $2,500 it was explicitly aimed at $15–30k builds, and nothing
-- upstream of the assessment could tell those apart. Without this the 8-hour assessment does all
-- the filtering by itself, which is the most expensive filter available.
--
-- Nullable, like every other qualifier on this form: the field is optional in the UI and a blank
-- answer must never block a submission. The first option ("Not yet — that's part of what I need
-- help with") makes not knowing a real answer rather than a gap.
--
-- Same conventions as 0001 and 0002: this file is the source of truth, re-runnable, and the table
-- keeps RLS on with no policies (deny-all). The Function reaches it through PostgREST with the
-- service-role key, which bypasses RLS; the browser never touches Supabase directly.
--
-- Re-runnable on a table that may not exist yet only in the sense that 0002 runs first — apply
-- migrations in order.

alter table public.assessment_intake
  add column if not exists invest_band text;

comment on column public.assessment_intake.invest_band is
  'Self-reported size band ("Under $10k", "$10-25k", "$25-50k", "More than $50k", or a decline). '
  'Distinct from budget_band, which reports readiness rather than size. Optional.';
