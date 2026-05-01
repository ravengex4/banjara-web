import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const errParam = params.get('error') || params.get('error_description');
    const hash = window.location.hash || '';
    const hashErr = /error=([^&]+)/.exec(hash)?.[1];
    const hashErrDesc = /error_description=([^&]+)/.exec(hash)?.[1];
    if (errParam || hashErr) {
      setError(decodeURIComponent(hashErrDesc || hashErr || errParam || 'Sign-in failed'));
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        navigate(data.session ? '/' : '/login', { replace: true });
      } catch (e) {
        setError(e?.message || 'Unable to complete sign-in. Please try again.');
      }
    }, 700);
    return () => clearTimeout(t);
  }, [navigate, params]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-[#FF2A2A]" />
          </div>
          <h1 className="text-xl font-bold text-[#003D52] mb-2">Sign-in failed</h1>
          <p className="text-sm text-slate-600 mb-5 break-words">{error.replace(/\+/g, ' ')}</p>
          <a href="/login" className="text-[#FF2A2A] text-sm font-semibold hover:underline">← Back to login</a>
        </div>
      </div>
    );
  }

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
