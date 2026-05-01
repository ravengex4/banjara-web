-- =========================================================
-- Banjara Tours - Phase 3 (Hyderabad contact update)
-- Run in Supabase SQL Editor
-- =========================================================

-- 1. Add map_url column to offices
alter table public.offices add column if not exists map_url text;

-- 2. Update Hyderabad office (or rename if currently 'Banjara Hills')
update public.offices
set
  address = 'Plot No 150, Phase 3, Kamalapuri Colony, Hyderabad 500073',
  phone = '+91 99599 40008',
  email = 'info@banjaratours.in',
  map_url = 'https://maps.app.goo.gl/GaraAwM7jqhts5Pz8'
where city = 'Hyderabad';

-- 3. Optional: delete the other demo offices if you only have the Hyderabad branch
-- (uncomment the next line if you want to remove Delhi, Mumbai, Bengaluru placeholders)
-- delete from public.offices where city in ('Delhi', 'Mumbai', 'Bengaluru');

-- =========================================================
-- DONE
-- =========================================================
