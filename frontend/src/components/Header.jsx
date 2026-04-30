import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown, Plane } from 'lucide-react';
import { Button } from './ui/button';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden md:block bg-[#003D52] text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919821811221" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors">
              <Phone className="w-3.5 h-3.5" /> +91 98218 11221
            </a>
            <a href="mailto:info@banjaratours.in" className="flex items-center gap-1.5 hover:text-[#00C2E6] transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@banjaratours.in
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/track" className="hover:text-[#00C2E6] transition-colors">Track Application</Link>
            <span className="opacity-40">|</span>
            <Link to="/login" className="hover:text-[#00C2E6] transition-colors">Login</Link>
            <Link to="/register" className="hover:text-[#00C2E6] transition-colors">Register</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Plane className="w-5 h-5 text-white -rotate-45" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#003D52] text-lg tracking-tight">Banjara Tours</div>
              <div className="text-[10px] uppercase tracking-widest text-[#FF2A2A] font-semibold">& Travels</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${active ? 'text-[#FF2A2A]' : 'text-[#003D52] hover:text-[#FF2A2A]'}`}
                >
                  {link.label}
                  {active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF2A2A] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/track">
              <Button variant="outline" className="border-[#003D52] text-[#003D52] hover:bg-[#003D52] hover:text-white">Track Status</Button>
            </Link>
            <Link to="/apply">
              <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white shadow-md">Apply Visa</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-[#003D52]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
