import React from 'react';
import { Clock, Headphones, Users, Award, FileCheck, Globe, Stamp, BookCheck, UserCheck, ShieldCheck, Plane, Briefcase, MapPin, User, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trustBadges, services, steps, stats } from '../mock';
import { Button } from './ui/button';

const iconMap = { Clock, Headphones, Users, Award, FileCheck, Globe, Stamp, BookCheck, UserCheck, ShieldCheck, Plane, Briefcase, MapPin, User, Upload, CheckCircle };

export const TrustBadges = () => (
  <section className="py-14 bg-white border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustBadges.map(badge => {
          const Icon = iconMap[badge.icon];
          return (
            <div key={badge.id} className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E86C2C]/10 to-[#F5A623]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-[#E86C2C]" strokeWidth={2} />
              </div>
              <div>
                <div className="font-bold text-[#1A3C5E] text-sm md:text-base">{badge.title}</div>
                <div className="text-xs md:text-sm text-slate-500 leading-snug">{badge.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const Services = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14">
        <div className="text-[#E86C2C] text-sm font-semibold uppercase tracking-wider mb-3">Our Services</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A3C5E] tracking-tight mb-4">
          End-to-End Travel Documentation
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          From your first visa application to FRRO registration and travel insurance — we handle every paperwork detail.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map(service => {
          const Icon = iconMap[service.icon];
          return (
            <div key={service.id} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#E86C2C]/40 hover:shadow-lg transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E86C2C]/5 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-[#1A3C5E] group-hover:bg-[#E86C2C] transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1A3C5E] text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{service.description}</p>
                <Link to="/services" className="text-sm font-semibold text-[#E86C2C] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const Steps = () => (
  <section className="py-20 bg-gradient-to-br from-[#F8F9FA] to-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14">
        <div className="text-[#E86C2C] text-sm font-semibold uppercase tracking-wider mb-3">Easy Process</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A3C5E] tracking-tight mb-4">
          Apply Online Visa in 4 Simple Steps
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Steps are short and easy to apply for your visa. No more office visits, paperwork chaos, or long queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2 relative">
        {steps.map((step, idx) => {
          const Icon = iconMap[step.icon];
          return (
            <div key={step.id} className="relative">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#E86C2C]/40 hover:shadow-lg transition-all relative z-10 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E86C2C] to-[#F5A623] flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                  </div>
                  <span className="text-5xl font-bold text-slate-100">0{step.id}</span>
                </div>
                <h3 className="font-bold text-[#1A3C5E] text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 z-20">
                  <ArrowRight className="w-6 h-6 text-[#E86C2C]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to="/apply">
          <Button className="bg-[#E86C2C] hover:bg-[#d05f24] text-white px-8 py-6 text-base font-semibold gap-2">
            Start Application Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export const StatsSection = () => (
  <section className="py-16 bg-[#1A3C5E] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F5A623] blur-3xl" />
    </div>
    <div className="relative max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="text-4xl md:text-5xl font-bold text-[#F5A623] mb-2">{s.value}</div>
            <div className="text-sm md:text-base text-slate-300 uppercase tracking-wider font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
