import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTable } from '../lib/useTable';

const tabs = ['All', 'Popular', 'e-Visa', 'Stamp Visa'];

const VisaCards = () => {
  const [activeTab, setActiveTab] = useState('All');
  const { data: countries } = useTable('countries');

  const filtered = countries.filter(v => {
    // Only show countries that have visa data (price or type present)
    if (!v.price && !v.visa_type) return false;
    
    if (activeTab === 'All') return true;
    if (activeTab === 'Popular') return v.popular;
    if (activeTab === 'e-Visa') return v.visa_format === 'e-Visa';
    if (activeTab === 'Stamp Visa') return v.visa_format === 'Stamp Visa';
    return true;
  }).slice(0, 12);

  return (
    <section className="py-20 bg-[#E9EEF2]">
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
            Explore Countries <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 text-xs md:text-sm">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
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
                  src={visa.flag_url}
                  alt={`${visa.name} flag`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {visa.popular && (
                  <Badge className="absolute top-3 right-3 bg-[#00C2E6] hover:bg-[#00C2E6] text-white border-0 text-[10px]">
                    POPULAR
                  </Badge>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-90">{visa.visa_type}</div>
                  <div className="font-bold text-sm leading-tight">{visa.name}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{visa.processing_time}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{visa.visa_format}</div>
                    <div className="text-base font-bold text-[#003D52]">{visa.price}</div>
                  </div>
                  <Link to="/apply" state={{ country: visa.name, visaType: visa.visa_type }}>
                    <Button size="sm" variant="ghost" className="text-[#FF2A2A] hover:bg-[#FF2A2A]/10 hover:text-[#FF2A2A] -mr-2">
                      Apply <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/apply">
            <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-[#FF2A2A]/20 transition-all hover:-translate-y-1">
              View More & Apply Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisaCards;
