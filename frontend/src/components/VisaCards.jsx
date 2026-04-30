import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { countryVisas } from '../mock';

const tabs = ['All', 'Popular', 'e-Visa', 'Stamp Visa'];

const VisaCards = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = countryVisas.filter(v => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Popular') return v.popular;
    if (activeTab === 'e-Visa') return v.visaType === 'e-Visa';
    if (activeTab === 'Stamp Visa') return v.visaType === 'Stamp Visa';
    return true;
  }).slice(0, 12);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF2A2A] text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-wider">Trending Destinations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003D52] tracking-tight mb-3">
              Apply Your Visa With Banjara
            </h2>
            <p className="text-slate-600 max-w-xl">
              Pick your destination and start your application in minutes. Transparent pricing, expert review, and on-time delivery.
            </p>
          </div>
          <Link to="/visa" className="hidden md:inline-flex items-center gap-2 text-[#FF2A2A] font-semibold hover:gap-3 transition-all">
            View All Countries <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#003D52] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(visa => (
            <div
              key={visa.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#FF2A2A]/40 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                <img
                  src={visa.flag}
                  alt={`${visa.country} flag`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {visa.popular && (
                  <Badge className="absolute top-3 right-3 bg-[#00C2E6] hover:bg-[#00C2E6] text-white border-0 text-[10px]">
                    POPULAR
                  </Badge>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-90">{visa.type}</div>
                  <div className="font-bold text-sm leading-tight">{visa.country}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{visa.processingTime}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{visa.visaType}</div>
                    <div className="text-base font-bold text-[#003D52]">{visa.price}</div>
                  </div>
                  <Link to="/apply">
                    <Button size="sm" variant="ghost" className="text-[#FF2A2A] hover:bg-[#FF2A2A]/10 hover:text-[#FF2A2A] -mr-2">
                      Apply <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link to="/visa">
            <Button variant="outline" className="border-[#003D52] text-[#003D52]">
              View All Countries <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisaCards;
