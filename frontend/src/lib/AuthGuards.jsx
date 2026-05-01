import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';

const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <Loader2 className="w-8 h-8 animate-spin text-[#FF2A2A]" />
  </div>
);

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const RequireAdmin = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#003D52] mb-2">Admin access required</h1>
          <p className="text-sm text-slate-600 mb-5">Your account is not authorized for the admin dashboard. Contact the website owner to request access.</p>
          <a href="/" className="text-[#FF2A2A] text-sm font-semibold hover:underline">← Return to home</a>
        </div>
      </div>
    );
  }
  return children;
};
