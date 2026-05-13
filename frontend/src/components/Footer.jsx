import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Send, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    setSubmitting(false);
    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Already subscribed', description: 'This email is already on our list.' });
      } else {
        toast({ title: 'Subscription failed', description: error.message });
      }
      return;
    }
    toast({ title: 'Subscribed!', description: 'You will receive our latest visa updates.' });
    setEmail('');
  };

  return (
    <footer className="bg-[#003D52] text-slate-200">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/assets/logo.webp" alt="BanjaraTravels" className="w-12 h-12 object-contain bg-white rounded p-1" />
              <div className="leading-tight">
                <div className="font-bold text-white text-lg">BanjaraTravels</div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              India's trusted visa consultancy & travel documentation partner. End-to-end visa, attestation & FRRO services.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF2A2A] flex items-center justify-center transition-colors">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {['About Us', 'Services', 'Apply Visa', 'Track Status', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/ /g, '-').replace('apply-visa', 'apply').replace('track-status', 'track').replace('about-us', 'about')}`} className="text-slate-400 hover:text-[#00C2E6] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Visas */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Popular Visas</h4>
            <ul className="space-y-2.5 text-sm">
              {['UAE Visa', 'USA Visa', 'UK Visa', 'Schengen Visa', 'Australia Visa', 'Canada Visa'].map(item => (
                <li key={item}>
                  <Link to="/visa" className="text-slate-400 hover:text-[#00C2E6] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm mb-5">
              <li className="flex gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-[#00C2E6] flex-shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/GaraAwM7jqhts5Pz8" target="_blank" rel="noopener noreferrer" className="hover:text-[#00C2E6]">Plot No 150, Phase 3, Kamalapuri Colony, Hyderabad 500073</a>
              </li>
              <li className="flex gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-[#00C2E6] flex-shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+919959940008" className="hover:text-[#00C2E6]">+91 99599 40008</a>
                  <a href="tel:+917842964008" className="hover:text-[#00C2E6]">78429 64008</a>
                  <a href="tel:+919515162008" className="hover:text-[#00C2E6]">95151 62008</a>
                </div>
              </li>
              <li className="flex gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-[#00C2E6] flex-shrink-0" />
                <a href="mailto:banjaratravel@gmail.com" className="hover:text-[#00C2E6]">banjaratravel@gmail.com</a>
              </li>
            </ul>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-[#00C2E6]"
              />
              <Button type="submit" size="icon" disabled={submitting} className="bg-[#FF2A2A] hover:bg-[#E01F1F] flex-shrink-0">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2026 BanjaraTravels. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#00C2E6]">Privacy Policy</a>
            <a href="#" className="hover:text-[#00C2E6]">Terms & Conditions</a>
            <a href="#" className="hover:text-[#00C2E6]">Refund Policy</a>
            <a href="https://optivaa.com" target="_blank" rel="nofollow noopener noreferrer" className="text-slate-600/30 hover:text-[#00C2E6] transition-colors font-light">Optivaa</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
