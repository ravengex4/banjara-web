import React, { useState } from 'react';
import { Search, MapPin, Plane, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTable } from '../lib/useTable';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const { data: countries } = useTable('countries');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#003D52] via-[#00688A] to-[#00A6D6]">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#00C2E6] blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FF2A2A] blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><path d=%22M30 30m-2 0a2 2 0 1 1 4 0 2 2 0 1 1-4 0%22 fill=%22%23ffffff%22 fill-opacity=%220.05%22/></svg>')] opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-[#00C2E6]" />
              <span className="text-xs font-medium tracking-wide">India's Most Trusted Visa Consultancy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 tracking-tight">
              Your Visa, <span className="text-[#00C2E6]">Simplified</span>.
              <br />
              For 150+ Countries.
            </h1>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl">
              From Tourist to Business, e-Visa to Stamp Visa — Banjara Tours handles the paperwork while you plan the journey. Real-time tracking, expert review, on-time delivery.
            </p>

            {/* Search box */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <MapPin className="w-5 h-5 text-[#FF2A2A] flex-shrink-0" />
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="border-0 shadow-none focus:ring-0 text-[#003D52] font-medium h-12">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {countries.map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden md:block w-px bg-slate-200" />
              <div className="flex-1 flex items-center gap-2 px-3">
                <Plane className="w-5 h-5 text-[#FF2A2A] flex-shrink-0" />
                <Select value={visaType} onValueChange={setVisaType}>
                  <SelectTrigger className="border-0 shadow-none focus:ring-0 text-[#003D52] font-medium h-12">
                    <SelectValue placeholder="Visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Tourist Visa</SelectItem>
                    <SelectItem value="business">Business Visa</SelectItem>
                    <SelectItem value="student">Student Visa</SelectItem>
                    <SelectItem value="transit">Transit Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link to="/apply">
                <Button className="w-full md:w-auto h-12 px-7 bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-semibold gap-2">
                  <Search className="w-4 h-4" />
                  Search Visa
                </Button>
              </Link>
            </div>

            {/* Bottom badges */}
            <div className="flex flex-wrap gap-5 mt-8">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Clock className="w-4 h-4 text-[#00C2E6]" />
                <span>Visa in as fast as 24 hrs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Shield className="w-4 h-4 text-[#00C2E6]" />
                <span>98% Approval Rate</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Plane className="w-4 h-4 text-[#00C2E6]" />
                <span>50,000+ Happy Travelers</span>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-[#00C2E6]/20" />
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-[#FF2A2A]/20" />
              <img
                src="https://images.unsplash.com/photo-1655722725332-9925c96dd627"
                alt="Passport with visa stamps"
                className="relative rounded-3xl shadow-2xl w-full h-[480px] object-cover"
              />
              {/* Floating cards */}
              <div className="absolute -left-6 top-12 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-[#FF2A2A]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Visa Approved</div>
                  <div className="text-sm font-bold text-[#003D52]">UAE · 4 Days</div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-12 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00C2E6]/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00C2E6]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Trust Score</div>
                  <div className="text-sm font-bold text-[#003D52]">4.9 / 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
