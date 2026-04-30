import React from 'react';
import { SimplePage } from './PageHeader';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Globe, Stamp, BookCheck, UserCheck, ShieldCheck, Plane, Briefcase, Check } from 'lucide-react';
import { services } from '../mock';
import { Button } from '../components/ui/button';

const iconMap = { FileCheck, Globe, Stamp, BookCheck, UserCheck, ShieldCheck, Plane, Briefcase };

const Services = () => (
  <SimplePage
    title="Our Services"
    subtitle="From visa applications to FRRO registration — a complete suite of travel documentation services."
    breadcrumb="Services"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map(s => {
        const Icon = iconMap[s.icon];
        return (
          <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-[#E86C2C]/40 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E86C2C]/5 to-transparent rounded-bl-full" />
            <div className="relative flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E86C2C] to-[#F5A623] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1A3C5E] text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {['Expert document review', 'Real-time tracking', '24/7 support'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#E86C2C]" strokeWidth={3} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to="/apply" className="text-sm font-semibold text-[#E86C2C] inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-16 text-center bg-gradient-to-br from-[#1A3C5E] to-[#1F4870] rounded-3xl p-12">
      <h2 className="text-3xl font-bold text-white mb-3">Need a Custom Service?</h2>
      <p className="text-slate-200 max-w-xl mx-auto mb-6">Our visa experts are available to assist with bulk applications, urgent processing, and complex cases.</p>
      <Link to="/contact">
        <Button className="bg-[#E86C2C] hover:bg-[#d05f24] text-white px-7 h-12 font-semibold gap-2">
          Talk to an Expert <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  </SimplePage>
);

export default Services;
