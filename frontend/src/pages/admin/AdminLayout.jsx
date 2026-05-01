import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Briefcase, Mail, Globe, Quote, BookOpen, Building2, HelpCircle, Wrench, LogOut, Plane, ExternalLink } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { Button } from '../../components/ui/button';

const sections = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { type: 'group', label: 'Operations' },
  { label: 'Visa Applications', to: '/admin/applications', icon: FileText },
  { label: 'Contact Inquiries', to: '/admin/contacts', icon: MessageSquare },
  { label: 'B2B Registrations', to: '/admin/b2b', icon: Briefcase },
  { label: 'Newsletter', to: '/admin/newsletter', icon: Mail },
  { type: 'group', label: 'Content (CMS)' },
  { label: 'Countries', to: '/admin/countries', icon: Globe },
  { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
  { label: 'Blog Posts', to: '/admin/blog', icon: BookOpen },
  { label: 'Offices', to: '/admin/offices', icon: Building2 },
  { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
  { label: 'Services', to: '/admin/services', icon: Wrench },
];

const AdminLayout = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#E9EEF2] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
          <img src="/assets/logo.png" alt="Banjara Tours" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <div className="font-bold text-[#003D52] text-base">Banjara Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-[#FF2A2A] font-semibold">Dashboard</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sections.map((s, i) => {
            if (s.type === 'group') {
              return (
                <div key={i} className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {s.label}
                </div>
              );
            }
            const Icon = s.icon;
            return (
              <NavLink
                key={s.to}
                to={s.to}
                end={s.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF2A2A]/10 text-[#FF2A2A]' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-2">Signed in as</div>
          <div className="text-sm font-semibold text-[#003D52] truncate">{profile?.full_name || user?.email}</div>
          <div className="text-xs text-slate-500 truncate mb-3">{user?.email}</div>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full gap-1.5 border-slate-300">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin</div>
            <h1 className="text-xl font-bold text-[#003D52]">Dashboard</h1>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-[#FF2A2A] flex items-center gap-1.5">
            View site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
