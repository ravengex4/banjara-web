import React from 'react';
import { SimplePage } from './PageHeader';
import { Plane, Check, ArrowRight, FileText, Globe2, Clock, Sparkles } from 'lucide-react';
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

    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 mb-12 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center text-[#FF2A2A]">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#003D52]">Documents Required for India Visa</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
        {[
          "Passport with a minimum of six months validity from the date of arrival in India",
          "Photograph",
          "Proof of travel plans (return tickets or detailed itinerary)",
          "Proof of accommodation arrangements during stay in India",
          "Supporting documents depending on visa type:",
          "Business invitation letter (Business Visa)",
          "Conference registration (Conference Visa)",
          "Medical treatment documents (Medical Visa)",
          "Parent’s name required during application"
        ].map((doc, idx) => (
          <div key={idx} className={`flex items-start gap-3 text-slate-700 ${idx >= 5 && idx <= 7 ? 'ml-8 text-sm' : 'font-medium'}`}>
            <div className="mt-1 flex-shrink-0">
              <Check className={`w-4 h-4 ${idx >= 5 && idx <= 7 ? 'text-[#00C2E6]' : 'text-[#FF2A2A]'} font-bold`} strokeWidth={3} />
            </div>
            <span>{doc}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-[#BFEAF7]/30 border border-[#00C2E6]/20 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#00C2E6] shadow-sm">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-[#003D52] font-bold text-lg">Processing Time</h4>
          <p className="text-[#005C75] font-medium">Processing time takes minimum <span className="text-[#FF2A2A] font-bold">3–4 working days</span></p>
        </div>
      </div>
    </div>

    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#00C2E6]/10 flex items-center justify-center text-[#00C2E6]">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-[#003D52]">Visa Fee Structure</h2>
      </div>
      
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Visa Type</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Visa Fee (INR)</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">VFS & Courier Charges (INR)</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Handling Charges (INR)</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Total Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-[#003D52]">30 Day's visa</td>
              <td className="p-4">11,987.50</td>
              <td className="p-4">0.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4 font-bold text-[#FF2A2A]">11,987.50</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-[#003D52]">1 Year visa</td>
              <td className="p-4">19,987.50</td>
              <td className="p-4">0.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4 font-bold text-[#FF2A2A]">19,987.50</td>
            </tr>
          </tbody>
        </table>
      </div>
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
