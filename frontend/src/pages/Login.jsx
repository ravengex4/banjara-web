import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Plane, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../lib/AuthContext';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  const { user, signIn, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!authLoading && user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    const { error } = await signIn({ email, password });
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    navigate(from, { replace: true });
  };

  const google = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E9EEF2] via-white to-[#BFEAF7]/40 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center shadow-md">
            <Plane className="w-5 h-5 text-white -rotate-45" strokeWidth={2.5} />
          </div>
          <div className="leading-tight text-left">
            <div className="font-bold text-[#003D52] text-lg">Banjara Tours</div>
            <div className="text-[10px] uppercase tracking-widest text-[#FF2A2A] font-semibold">& Travels</div>
          </div>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          <h1 className="text-2xl font-bold text-[#003D52] mb-1">Welcome back</h1>
          <p className="text-sm text-slate-600 mb-6">Sign in to track your applications</p>

          <Button type="button" onClick={google} variant="outline" className="w-full h-11 gap-2 mb-4 border-slate-300 hover:bg-slate-50">
            <GoogleIcon /> Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-[#003D52] text-sm font-medium mb-1.5 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-11" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <Label className="text-[#003D52] text-sm font-medium mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 h-11" placeholder="••••••••" />
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}
            <Button type="submit" disabled={submitting} className="w-full h-11 bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-semibold gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            New to Banjara? <Link to="/register" className="text-[#FF2A2A] font-semibold hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
