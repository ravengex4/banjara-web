-- =========================================================
-- Banjara Tours - Phase 2 Schema (CMS + Auth + Admin)
-- Run this AFTER the first schema in your Supabase SQL Editor
-- =========================================================

-- =========================================================
-- 1. PROFILES (linked to auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 2. ADMIN EMAILS (whitelist)
-- =========================================================
create table if not exists public.admin_emails (
  email text primary key,
  added_at timestamptz default now()
);

-- Seed default admin (change/add more as needed)
insert into public.admin_emails (email) values ('admin@banjaratours.in')
  on conflict (email) do nothing;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails ae
    join auth.users u on u.email = ae.email
    where u.id = auth.uid()
  );
$$;

-- =========================================================
-- 3. CMS TABLES
-- =========================================================
create table if not exists public.countries (
  id serial primary key,
  name text not null,
  flag_url text,
  visa_type text,
  processing_time text,
  visa_format text,
  price text,
  popular boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.testimonials (
  id serial primary key,
  name text not null,
  location text,
  rating int default 5,
  text text not null,
  avatar text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.blog_posts (
  id serial primary key,
  title text not null,
  excerpt text,
  content text,
  category text,
  read_time text,
  image_url text,
  published_at date default current_date,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.offices (
  id serial primary key,
  city text not null,
  address text,
  phone text,
  email text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.faqs (
  id serial primary key,
  question text not null,
  answer text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.services (
  id serial primary key,
  title text not null,
  description text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- =========================================================
-- 4. SEED DATA
-- =========================================================

-- Countries
insert into public.countries (name, flag_url, visa_type, processing_time, visa_format, price, popular, sort_order) values
  ('United Arab Emirates', 'https://flagcdn.com/w320/ae.png', 'Tourist Visa', '4 Working days', 'e-Visa', 'INR 4,700', true, 1),
  ('United Kingdom', 'https://flagcdn.com/w320/gb.png', 'Tourist Visa', '30 Working days', 'Stamp Visa', 'INR 1,32,799', false, 2),
  ('Switzerland', 'https://flagcdn.com/w320/ch.png', 'Business Visa', '15 Working days', 'Stamp Visa', 'INR 14,904', false, 3),
  ('Singapore', 'https://flagcdn.com/w320/sg.png', 'Business Visa', '10 Working days', 'e-Visa', 'INR 3,490', false, 4),
  ('Qatar', 'https://flagcdn.com/w320/qa.png', 'Tourist Visa', '4 Working days', 'e-Visa', 'INR 5,500', false, 5),
  ('Kenya', 'https://flagcdn.com/w320/ke.png', 'Tourist Visa', '4 Working days', 'e-Visa', 'INR 4,300', false, 6),
  ('Jordan', 'https://flagcdn.com/w320/jo.png', 'Tourist Visa', '1 Working Day', 'e-Visa', 'INR 7,590', false, 7),
  ('United States', 'https://flagcdn.com/w320/us.png', 'Tourist Visa', '10-15 Days after Appt.', 'Stamp Visa', 'USD 205', true, 8),
  ('Russia', 'https://flagcdn.com/w320/ru.png', 'Tourist Visa', '5 Working days', 'e-Visa', 'INR 5,800', false, 9),
  ('Laos', 'https://flagcdn.com/w320/la.png', 'Tourist Visa', '5 Working days', 'e-Visa', 'INR 6,906', false, 10),
  ('China', 'https://flagcdn.com/w320/cn.png', 'Business Visa', '7-8 Working days', 'Stamp Visa', 'INR 6,280', false, 11),
  ('Georgia', 'https://flagcdn.com/w320/ge.png', 'Tourist Visa', '5 Working days', 'e-Visa', 'INR 4,000', false, 12),
  ('Bangladesh', 'https://flagcdn.com/w320/bd.png', 'Tourist Visa', '5 Working days', 'Normal Visa', 'INR 2,500', false, 13),
  ('Egypt', 'https://flagcdn.com/w320/eg.png', 'Tourist Visa', '3-5 Working Days', 'e-Visa', 'INR 6,668', false, 14),
  ('Azerbaijan', 'https://flagcdn.com/w320/az.png', 'Tourist Visa', '5 Working days', 'e-Visa', 'INR 3,200', false, 15),
  ('Australia', 'https://flagcdn.com/w320/au.png', 'Tourist Visa', '20-25 Working days', 'e-Visa', 'INR 12,500', true, 16),
  ('Canada', 'https://flagcdn.com/w320/ca.png', 'Tourist Visa', '25-30 Working days', 'Stamp Visa', 'INR 8,900', false, 17),
  ('Thailand', 'https://flagcdn.com/w320/th.png', 'Tourist Visa', '3 Working days', 'e-Visa', 'INR 2,800', false, 18),
  ('Malaysia', 'https://flagcdn.com/w320/my.png', 'Tourist Visa', '4 Working days', 'e-Visa', 'INR 3,200', false, 19),
  ('Vietnam', 'https://flagcdn.com/w320/vn.png', 'Tourist Visa', '5 Working days', 'e-Visa', 'INR 2,950', false, 20)
on conflict do nothing;

-- Testimonials
insert into public.testimonials (name, location, rating, text, avatar, sort_order) values
  ('Rajesh Kumar', 'Hyderabad', 5, 'Banjara Tours made my UAE visa process incredibly smooth. Got my visa in just 3 days! Highly recommend their services to anyone looking for hassle-free visa processing.', 'RK', 1),
  ('Priya Sharma', 'Delhi', 5, 'Excellent service for Schengen visa. The team was supportive throughout the documentation process. Their attention to detail saved me from rejection.', 'PS', 2),
  ('Mohammed Ali', 'Mumbai', 5, 'Best visa consultancy in India! They handled my entire family''s US visa interview prep professionally. Got our visas approved on first attempt.', 'MA', 3),
  ('Anita Reddy', 'Bengaluru', 5, 'Quick attestation services. MEA attestation done within a week. The team is knowledgeable and very responsive on WhatsApp.', 'AR', 4),
  ('Vikram Singh', 'Chennai', 5, 'As a frequent business traveler, I rely on Banjara Tours for all my visa needs. Their B2B portal is intuitive and saves us a lot of time.', 'VS', 5),
  ('Sneha Patel', 'Pune', 5, 'Got my UK student visa with their help. They guided me through every step and helped with the financial documentation. Truly grateful!', 'SP', 6)
on conflict do nothing;

-- Blog posts
insert into public.blog_posts (title, excerpt, content, category, read_time, image_url, published_at, sort_order) values
  ('How to Get Dubai Visa in 24 Hours from India', 'Complete guide to fast-track UAE visa processing with required documents and tips.', 'Detailed content here...', 'UAE Visa', '5 min read', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', '2025-07-10', 1),
  ('Schengen Visa Application: Complete Document Checklist', 'Everything you need to know about applying for Schengen visa from India in 2025.', 'Detailed content here...', 'Europe Visa', '8 min read', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', '2025-07-05', 2),
  ('USA B1/B2 Visa Interview Tips for Indian Applicants', 'Expert advice on cracking your US visa interview on the first attempt.', 'Detailed content here...', 'USA Visa', '6 min read', 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800', '2025-06-28', 3)
on conflict do nothing;

-- Offices
insert into public.offices (city, address, phone, email, sort_order) values
  ('Hyderabad', 'Banjara Hills, Road No. 12, Hyderabad, Telangana 500034', '+91 98765 43210', 'hyderabad@banjaratours.in', 1),
  ('Delhi', 'Connaught Place, Block A, New Delhi 110001', '+91 98765 43211', 'delhi@banjaratours.in', 2),
  ('Mumbai', 'Andheri East, Mumbai, Maharashtra 400069', '+91 98765 43212', 'mumbai@banjaratours.in', 3),
  ('Bengaluru', 'MG Road, Bengaluru, Karnataka 560001', '+91 98765 43213', 'bengaluru@banjaratours.in', 4)
on conflict do nothing;

-- FAQs
insert into public.faqs (question, answer, sort_order) values
  ('How long does it take to process a visa?', 'Visa processing time varies by country and visa type. e-Visas typically take 1-7 working days, while stamp visas may take 10-30 working days. We provide accurate timelines for each country on our service pages.', 1),
  ('What documents are required for a visa application?', 'Required documents vary by destination and visa type. Common documents include a valid passport (6+ months validity), photographs, financial statements, travel itinerary, and accommodation proof. Our document checklist generator provides specific requirements.', 2),
  ('Do you offer visa services for foreigners in India?', 'Yes, we provide comprehensive services for foreign nationals including FRRO registration, visa extensions, Indian e-Visa, business visa, and Port of Entry assistance. Our expert team guides you through every step.', 3),
  ('What is your visa success rate?', 'We maintain a 98% visa approval success rate due to thorough documentation review, expert guidance, and personalized attention to each application. Our experienced consultants ensure your application meets all requirements.', 4),
  ('Do you provide B2B services for travel agents?', 'Yes, we have a dedicated B2B portal for travel agents offering bulk visa submission, competitive pricing, commission tracking, and a dedicated account manager. Register on our B2B page to get started.', 5),
  ('Which payment methods do you accept?', 'We accept all major payment methods including UPI, debit/credit cards, net banking, and digital wallets through our secure Razorpay integration. International clients can pay via wire transfer.', 6)
on conflict do nothing;

-- Services
insert into public.services (title, description, icon, sort_order) values
  ('Visa Application', 'End-to-end Tourist & Business visa processing for 150+ countries', 'FileCheck', 1),
  ('E-Visa Services', 'Quick online e-visa applications with real-time status tracking', 'Globe', 2),
  ('Document Attestation', 'MEA, state-level attestation and embassy legalization services', 'Stamp', 3),
  ('Apostille Services', 'Apostille for personal & educational documents (Hague Convention)', 'BookCheck', 4),
  ('FRRO Registration', 'Online FRRO registration for foreigners staying 180+ days in India', 'UserCheck', 5),
  ('Travel Insurance', 'Visa-compliant travel insurance for individuals and groups', 'ShieldCheck', 6),
  ('Indian Visa', 'India tourist, business, e-visa processing for all nationalities', 'Plane', 7),
  ('B2B Agent Portal', 'Bulk visa submission, commission tracking and dedicated dashboard', 'Briefcase', 8)
on conflict do nothing;

-- =========================================================
-- 5. ROW-LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.admin_emails enable row level security;
alter table public.countries enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.offices enable row level security;
alter table public.faqs enable row level security;
alter table public.services enable row level security;

-- PROFILES: user can read/update own; admin can read all
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select
  to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update
  to authenticated using (auth.uid() = id);

-- ADMIN_EMAILS: only admin can read; nobody can modify via API (use SQL Editor)
drop policy if exists "admin read admin_emails" on public.admin_emails;
create policy "admin read admin_emails" on public.admin_emails for select
  to authenticated using (public.is_admin());

-- CMS: anyone (including anon) can READ; only admin can write
do $$
declare t text;
begin
  for t in select unnest(array['countries','testimonials','blog_posts','offices','faqs','services']) loop
    execute format('drop policy if exists "public read %1$I" on public.%1$I;', t);
    execute format('create policy "public read %1$I" on public.%1$I for select to anon, authenticated using (true);', t);
    execute format('drop policy if exists "admin write %1$I" on public.%1$I;', t);
    execute format('create policy "admin write %1$I" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ADMIN access to operational tables (visa_applications, contacts, b2b, newsletter)
drop policy if exists "admin read visa_applications" on public.visa_applications;
create policy "admin read visa_applications" on public.visa_applications for select
  to authenticated using (public.is_admin());
drop policy if exists "admin update visa_applications" on public.visa_applications;
create policy "admin update visa_applications" on public.visa_applications for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read contact_submissions" on public.contact_submissions;
create policy "admin read contact_submissions" on public.contact_submissions for select
  to authenticated using (public.is_admin());

drop policy if exists "admin read b2b_registrations" on public.b2b_registrations;
create policy "admin read b2b_registrations" on public.b2b_registrations for select
  to authenticated using (public.is_admin());

drop policy if exists "admin read newsletter" on public.newsletter_subscribers;
create policy "admin read newsletter" on public.newsletter_subscribers for select
  to authenticated using (public.is_admin());

-- =========================================================
-- DONE - Phase 2 Complete
-- =========================================================
