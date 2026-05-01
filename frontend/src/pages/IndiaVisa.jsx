import React from 'react';
import { SimplePage } from './PageHeader';
import { Plane, Check, ArrowRight, FileText, Globe2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const visaTypes = [
  { type: 'Tourist Visa (e-Visa)', duration: '30 / 60 / 1 Year', price: 'From INR 1,800', features: ['Online application', 'Single & Multiple entry', 'Quick processing'] },
  { type: 'Business Visa', duration: '1 / 5 / 10 Year', price: 'From INR 4,500', features: ['Multiple entries', 'Long validity', 'Dedicated processing'] },
  { type: 'Medical Visa', duration: '60 days extendable', price: 'From INR 3,200', features: ['Up to 3 attendants', 'Medical institution proof', 'Express handling'] },
  { type: 'Conference Visa', duration: 'Event duration', price: 'From INR 2,800', features: ['Conference invitation', 'MEA clearance', 'Quick approval'] },
];

const IndiaVisa = () => (
  <SimplePage title="Indian Visa for Foreigners" subtitle="Hassle-free India visa processing for all nationalities — tourist, business, medical and conference visas." breadcrumb="Indian Visa">
    <SEO
      title="Indian Visa for Foreigners — Tourist, Business, e-Visa"
      description="Apply Indian e-Visa, tourist visa, business visa, medical visa from any nationality. 72-hour processing, FRRO assistance, Port of Entry guidance."
      path="/india-visa"
      jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Indian Visa', path: '/india-visa' }])]}
    />
    <div className="grid lg:grid-cols-3 gap-5 mb-12">
      {[
        { icon: Globe2, title: '180+ Nationalities', text: 'Visa services for travelers from 180+ countries.' },
        { icon: Clock, title: '72-Hour Processing', text: 'Fastest e-Visa turnaround for India tourist visa.' },
        { icon: FileText, title: 'POE Assistance', text: 'On-arrival guidance at all major Indian airports.' },
      ].map((it, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 hover:border-[#FF2A2A]/40 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center flex-shrink-0 shadow-md">
            <it.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#003D52] mb-1">{it.title}</h3>
            <p className="text-sm text-slate-600 leading-snug">{it.text}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
      {visaTypes.map((v, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#FF2A2A]/40 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#003D52] mb-1">{v.type}</h3>
              <div className="text-xs text-slate-500">Validity: {v.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Starting</div>
              <div className="text-lg font-bold text-[#FF2A2A]">{v.price}</div>
            </div>
          </div>
          <ul className="space-y-2 mb-5">
            {v.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-[#FF2A2A]" strokeWidth={3} /> {f}
              </li>
            ))}
          </ul>
          <Link to="/apply">
            <Button variant="outline" className="w-full border-[#003D52] text-[#003D52] hover:bg-[#003D52] hover:text-white gap-2">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-br from-[#003D52] to-[#005C75] rounded-3xl p-10 text-center">
      <Plane className="w-12 h-12 text-[#00C2E6] mx-auto mb-4 -rotate-45" />
      <h2 className="text-3xl font-bold text-white mb-3">Need FRRO Registration?</h2>
      <p className="text-slate-200 max-w-xl mx-auto mb-6">If you're staying in India for over 180 days, FRRO registration is mandatory. We handle the entire process online.</p>
      <Link to="/contact">
        <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white px-7 h-12 font-semibold gap-2">
          Start FRRO Registration <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  </SimplePage>
);

export default IndiaVisa;
