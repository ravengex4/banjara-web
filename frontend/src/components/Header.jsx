import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Plane, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../lib/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Visa', path: '/visa' },
  { label: 'Indian Visa', path: '/india-visa' },
  { label: 'B2B Partner', path: '/b2b' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = (profile?.full_name || user?.email || 'U').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden md:block bg-[#003D52] text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919959940008" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors">
              <Phone className="w-3 h-3" /> +91 99599 40008
            </a>
            <a href="tel:+917842964008" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors border-l border-white/20 pl-3">
              <Phone className="w-3 h-3" /> 78429 64008
            </a>
            <a href="tel:+919515162008" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors border-l border-white/20 pl-3">
              <Phone className="w-3 h-3" /> 95151 62008
            </a>
            <a href="mailto:banjaratrvel@gmail.com" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors border-l border-white/20 pl-3">
              <Mail className="w-3 h-3" /> banjaratrvel@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/track" className="hover:text-[#00C2E6] transition-colors">Track Application</Link>
            {!user && (
              <>
                <span className="opacity-30">|</span>
                <Link to="/login" className="hover:text-[#00C2E6] transition-colors">Login</Link>
                <Link to="/register" className="hover:text-[#00C2E6] transition-colors">Register</Link>
              </>
            )}
            {isAdmin && (
              <>
                <span className="opacity-30">|</span>
                <Link to="/admin" className="hover:text-[#00C2E6] transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-3 h-3" /> Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/assets/logo.webp"
              alt="BanjaraTravels"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="leading-tight">
              <div className="font-bold text-[#003D52] text-lg tracking-tight">BanjaraTravels</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative px-3 py-1.5 rounded-md ${active ? 'text-[#FF2A2A]' : 'text-[#003D52] hover:text-[#FF2A2A] hover:bg-slate-50'}`}
                >
                  {link.label}
                  {active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-[#FF2A2A] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link to="/track">
              <Button variant="outline" className="border-[#003D52] text-[#003D52] hover:bg-[#003D52] hover:text-white">Track Status</Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#E9EEF2] hover:bg-[#BFEAF7] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] text-white flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-[#003D52] max-w-[120px] truncate">{profile?.full_name || user.email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs text-slate-500 font-normal">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/track')}><User className="w-4 h-4 mr-2" /> My Applications</DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}><LayoutDashboard className="w-4 h-4 mr-2" /> Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-[#FF2A2A]"><LogOut className="w-4 h-4 mr-2" /> Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/apply">
                <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white shadow-md">Apply Visa</Button>
              </Link>
            )}
          </div>

          <button className="lg:hidden p-2 text-[#003D52] ml-auto" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2.5 px-3 rounded-md text-sm font-medium ${location.pathname === link.path ? 'bg-[#FF2A2A]/10 text-[#FF2A2A]' : 'text-[#003D52] hover:bg-slate-50'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3">
                <Link to="/track" className="flex-1">
                  <Button variant="outline" className="w-full border-[#003D52] text-[#003D52]">Track</Button>
                </Link>
                <Link to="/apply" className="flex-1">
                  <Button className="w-full bg-[#FF2A2A] hover:bg-[#E01F1F] text-white">Apply</Button>
                </Link>
              </div>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" className="py-2.5 px-3 rounded-md text-sm font-medium text-[#003D52] hover:bg-slate-50 flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Admin</Link>}
                  <button onClick={handleSignOut} className="text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#FF2A2A] hover:bg-slate-50 flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
                </>
              ) : (
                <div className="flex gap-2 mt-1">
                  <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link to="/register" className="flex-1"><Button variant="outline" className="w-full">Register</Button></Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
