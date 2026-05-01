import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Supabase parses the URL hash automatically. Wait for session establishment then redirect.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      navigate(data.session ? '/' : '/login', { replace: true });
    }, 600);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-[#003D52]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="font-medium">Signing you in...</span>
      </div>
    </div>
  );
};

export default AuthCallback;
