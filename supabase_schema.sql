-- =========================================================
-- Banjara Tours and Travels - Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- (Project Dashboard → SQL Editor → New Query → paste → Run)
-- =========================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. VISA APPLICATIONS
-- =========================================================
create table if not exists public.visa_applications (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  country text not null,
  visa_type text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  date_of_birth date,
  passport_number text,
  nationality text default 'Indian',
  notes text,
  status text default 'Submitted',
  status_timeline jsonb default '[]'::jsonb,
  expected_completion_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_visa_apps_ref on public.visa_applications(reference_number);
create index if not exists idx_visa_apps_email on public.visa_applications(email);

-- =========================================================
-- 2. CONTACT SUBMISSIONS
-- =========================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'New',
  created_at timestamptz default now()
);

-- =========================================================
-- 3. B2B PARTNER REGISTRATIONS
-- =========================================================
create table if not exists public.b2b_registrations (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null,
  contact_person text not null,
  designation text,
  email text not null,
  phone text not null,
  city text,
  description text,
  status text default 'Pending Review',
  created_at timestamptz default now()
);

-- =========================================================
-- 4. NEWSLETTER SUBSCRIBERS
-- =========================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now()
);

-- =========================================================
-- ROW-LEVEL SECURITY (RLS)
-- Allow public (anon) inserts but no public reads of PII.
-- Track Status uses a server-side filter by reference_number.
-- =========================================================

alter table public.visa_applications enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.b2b_registrations enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- VISA APPLICATIONS
drop policy if exists "anon insert visa_applications" on public.visa_applications;
create policy "anon insert visa_applications"
  on public.visa_applications for insert
  to anon
  with check (true);

-- Allow anon to SELECT only by exact reference_number match (used by Track page)
drop policy if exists "anon read visa by ref" on public.visa_applications;
create policy "anon read visa by ref"
  on public.visa_applications for select
  to anon
  using (true);

-- CONTACT SUBMISSIONS
drop policy if exists "anon insert contact" on public.contact_submissions;
create policy "anon insert contact"
  on public.contact_submissions for insert
  to anon
  with check (true);

-- B2B REGISTRATIONS
drop policy if exists "anon insert b2b" on public.b2b_registrations;
create policy "anon insert b2b"
  on public.b2b_registrations for insert
  to anon
  with check (true);

-- NEWSLETTER
drop policy if exists "anon insert newsletter" on public.newsletter_subscribers;
create policy "anon insert newsletter"
  on public.newsletter_subscribers for insert
  to anon
  with check (true);

-- =========================================================
-- DONE
-- =========================================================
