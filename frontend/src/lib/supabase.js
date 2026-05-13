import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('CRITICAL: Supabase environment variables are missing! Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder', 
  {
    auth: { persistSession: true },
  }
);

// Helper: generate visa application reference number
export const generateRefNumber = () => {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `BTT-${num}`;
};
