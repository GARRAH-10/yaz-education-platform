-- V22: richer programme records for search, advising and admin content management.
-- Safe to run after 001_initial_schema.sql.

alter table public.programmes
  add column if not exists arabic_name text,
  add column if not exists study_mode text,
  add column if not exists international_fee_amount numeric,
  add column if not exists fee_currency text default 'MYR',
  add column if not exists fee_period text,
  add column if not exists academic_requirements_en text,
  add column if not exists academic_requirements_ar text,
  add column if not exists english_requirements_en text,
  add column if not exists english_requirements_ar text,
  add column if not exists required_documents_en text[] not null default '{}',
  add column if not exists required_documents_ar text[] not null default '{}',
  add column if not exists accreditation text,
  add column if not exists scholarship_info_en text,
  add column if not exists scholarship_info_ar text,
  add column if not exists application_notes_en text,
  add column if not exists application_notes_ar text;

create index if not exists programmes_fee_amount_idx on public.programmes(international_fee_amount);
create index if not exists programmes_study_mode_idx on public.programmes(study_mode);
