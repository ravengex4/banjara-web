import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileLoadId = useRef(0);

  // Defensive profile loader — never throws, never blocks UI
  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    const myId = ++profileLoadId.current;
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
      if (myId !== profileLoadId.current) return; // stale
      setProfile(prof || null);
    } catch (e) {
      // ignore — profile fetch failure shouldn't break auth
    }
    try {
      const { data: adminFlag } = await supabase.rpc('is_admin');
      if (myId !== profileLoadId.current) return;
      setIsAdmin(!!adminFlag);
    } catch (e) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        const u = session?.user || null;
        setUser(u);
        if (u) await loadProfile(u.id);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      // fire and forget — never await inside the listener (avoids stream race)
      if (u) {
        loadProfile(u.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const safeCall = async (fn) => {
    const isStreamErr = (m) => typeof m === 'string' && m.includes('body stream already read');
    try {
      const res = await fn();
      // Supabase returns errors in res.error; treat the stream race as benign
      if (res?.error && isStreamErr(res.error.message)) {
        // Try to recover the actual session
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) return { data: { session: data.session, user: data.session.user }, error: null };
        } catch (_) {}
        return { data: null, error: null };
      }
      return res;
    } catch (e) {
      const msg = (e && e.message) || '';
      if (isStreamErr(msg)) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) return { data: { session: data.session, user: data.session.user }, error: null };
        } catch (_) {}
        return { data: null, error: null };
      }
      return { data: null, error: { message: msg || 'Network error. Please try again.' } };
    }
  };

  const signUp = ({ email, password, fullName }) =>
    safeCall(() =>
      supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    );

  const signIn = ({ email, password }) =>
    safeCall(() => supabase.auth.signInWithPassword({ email, password }));

  const signInWithGoogle = () =>
    safeCall(() =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    );

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
