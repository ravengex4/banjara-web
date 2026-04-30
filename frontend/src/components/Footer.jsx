import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: 'Subscribed!', description: 'You will receive our latest visa updates.' });
    setEmail('');
  };

  return (
    <footer className="bg-[#0F2942] text-slate-200">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E86C2C] to-[#F5A623] flex items-center justify-center shadow-md">
                <Plane className="w-5 h-5 text-white -rotate-45" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-white text-lg">Banjara Tours</div>
                <div className="text-[10px] uppercase tracking-widest text-[#F5A623] font-semibold">& Travels</div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              India's trusted visa consultancy & travel documentation partner. End-to-end visa, attestation & FRRO services.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E86C2C] flex items-center justify-center transition-colors">
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
                  <Link to={`/${item.toLowerCase().replace(/ /g, '-').replace('apply-visa', 'apply').replace('track-status', 'track')}`} className="text-slate-400 hover:text-[#F5A623] transition-colors">{item}</Link>
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
                  <Link to="/visa" className="text-slate-400 hover:text-[#F5A623] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm mb-5">
              <li className="flex gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
                <span>Banjara Hills, Road No. 12, Hyderabad 500034</span>
              </li>
              <li className="flex gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <a href="tel:+919821811221" className="hover:text-[#F5A623]">+91 98218 11221</a>
              </li>
              <li className="flex gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <a href="mailto:info@banjaratours.in" className="hover:text-[#F5A623]">info@banjaratours.in</a>
              </li>
            </ul>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-[#F5A623]"
              />
              <Button type="submit" size="icon" className="bg-[#E86C2C] hover:bg-[#d05f24] flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2025 Banjara Tours and Travels. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#F5A623]">Privacy Policy</a>
            <a href="#" className="hover:text-[#F5A623]">Terms & Conditions</a>
            <a href="#" className="hover:text-[#F5A623]">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
