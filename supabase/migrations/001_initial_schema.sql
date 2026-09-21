-- YAZ Education V18 database schema
-- Run this in Supabase SQL Editor for a fresh project.

create extension if not exists pgcrypto;

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text not null,
  arabic_name text,
  city text,
  institution_type text,
  campus text,
  overview_en text,
  overview_ar text,
  study_areas_en text[] not null default '{}',
  study_areas_ar text[] not null default '{}',
  official_url text,
  logo_path text,
  verified boolean not null default false,
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.language_institutes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text not null,
  arabic_name text,
  city text,
  institution_type text,
  overview_en text,
  overview_ar text,
  course_types_en text[] not null default '{}',
  course_types_ar text[] not null default '{}',
  official_url text,
  logo_path text,
  verified boolean not null default false,
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  level text not null,
  field text,
  duration text,
  campus text,
  intakes text[] not null default '{}',
  international_fee text,
  specialisations text[] not null default '{}',
  source_url text,
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nationality text not null,
  whatsapp text not null,
  email text,
  study_level text not null,
  field_of_study text,
  preferred_intake text,
  message text,
  locale text not null default 'en' check (locale in ('en','ar')),
  source text not null default 'website',
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  created_at timestamptz not null default now()
);

create index if not exists programmes_university_id_idx on public.programmes(university_id);
create index if not exists programmes_level_idx on public.programmes(level);
create index if not exists programmes_field_idx on public.programmes(field);
create index if not exists consultations_created_at_idx on public.consultations(created_at desc);
create index if not exists consultations_status_idx on public.consultations(status);

alter table public.universities enable row level security;
alter table public.language_institutes enable row level security;
alter table public.programmes enable row level security;
alter table public.consultations enable row level security;

-- Public visitors may read verified catalogue data only.
drop policy if exists "Public read verified universities" on public.universities;
create policy "Public read verified universities"
on public.universities for select
to anon, authenticated
using (verified = true);

drop policy if exists "Public read verified language institutes" on public.language_institutes;
create policy "Public read verified language institutes"
on public.language_institutes for select
to anon, authenticated
using (verified = true);

drop policy if exists "Public read verified programmes" on public.programmes;
create policy "Public read verified programmes"
on public.programmes for select
to anon, authenticated
using (verified_at is not null);

-- No public consultation select/insert/update/delete policy is created.
-- The Next.js server route inserts using SUPABASE_SERVICE_ROLE_KEY.
-- Never expose the service-role key to browser code.
