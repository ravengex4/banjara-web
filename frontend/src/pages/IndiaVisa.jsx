import React from 'react';
import { SimplePage } from './PageHeader';
import { Plane, Check, ArrowRight, FileText, Globe2, Clock, Sparkles, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const visaTypes = [
  { type: '30 Days India Visit e-Visa', duration: 'Valid for 30 Days', price: '₹ 4,500/-', features: ['Online application', 'Single entry e-Visa', 'Quick 4-day processing'] },
  { type: '1 Year India Visit e-Visa', duration: 'Valid for 1 Year', price: '₹ 9,000/-', features: ['Multiple entries e-Visa', 'Long-term visit', 'Dedicated processing'] },
  { type: '5 Years India Visit e-Visa', duration: 'Valid for 5 Years', price: '₹ 12,000/-', features: ['Multiple entries e-Visa', 'Maximum flexibility', 'Priority handling'] },
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
        { icon: Clock, title: '4-Day Processing', text: 'Fastest e-Visa turnaround for India visit visa.' },
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

    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center text-[#FF2A2A]">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-[#003D52]">India Visit e-Visa Options</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {visaTypes.map((visa, idx) => (
          <div key={idx} className="bg-white border border-[#FF2A2A]/10 hover:border-[#FF2A2A]/40 rounded-3xl p-6 hover:shadow-xl transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#BFEAF7]/40 text-[#005C75] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <Globe2 className="w-3.5 h-3.5 text-[#00C2E6]" />
                {visa.duration}
              </div>
              <h3 className="font-extrabold text-[#003D52] text-lg mb-2">{visa.type}</h3>
              <div className="text-2xl font-black text-[#FF2A2A] mb-4">{visa.price}</div>
              <ul className="space-y-2 mb-6">
                {visa.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-[#00C2E6] flex-shrink-0" strokeWidth={3} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/apply" state={{ country: 'India', visaType: visa.type }}>
              <Button className="w-full bg-[#003D52] hover:bg-[#005C75] text-white font-bold py-2 rounded-xl">
                Apply Now
              </Button>
            </Link>
          </div>
        ))}
      </div>
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
          "Passport Copy (valid for at least 6 months)",
          "Photograph (recent passport-size with white background)",
          "Occupation Details (profession/job profile details)",
          "Father & Mother Details (parent names & nationalities required during application)"
        ].map((doc, idx) => (
          <div key={idx} className="flex items-start gap-3 text-slate-700 font-semibold text-base">
            <div className="mt-1 flex-shrink-0">
              <Check className="w-5 h-5 text-[#FF2A2A] font-bold" strokeWidth={3} />
            </div>
            <span>{doc}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="p-6 bg-[#BFEAF7]/20 border border-[#00C2E6]/20 rounded-3xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#00C2E6] shadow-sm flex-shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-[#003D52] font-extrabold text-lg">Processing Time</h4>
            <p className="text-[#005C75] font-medium">Completed in just <span className="text-[#FF2A2A] font-bold text-lg">4 working days</span></p>
          </div>
        </div>

        <div className="p-6 bg-[#FF2A2A]/5 border border-[#FF2A2A]/10 rounded-3xl flex flex-col justify-center">
          <h4 className="text-[#003D52] font-extrabold text-lg mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2A2A]" /> Contact for Details
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <a href="tel:9959940008" className="flex items-center gap-2 text-slate-700 hover:text-[#FF2A2A] transition-colors">
              <Phone className="w-4 h-4 text-[#FF2A2A]" strokeWidth={2.5} />
              <span>📱 9959940008</span>
            </a>
            <a href="mailto:banjaratravel@gmail.com" className="flex items-center gap-2 text-slate-700 hover:text-[#FF2A2A] transition-colors">
              <Mail className="w-4 h-4 text-[#FF2A2A]" strokeWidth={2.5} />
              <span>📧 banjaratravel@gmail.com</span>
            </a>
          </div>
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
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Courier/VFS Charges (INR)</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Handling Charges (INR)</th>
              <th className="p-4 font-bold text-[#003D52] text-sm uppercase tracking-wider">Total Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-[#003D52]">30 Days Visit e-Visa</td>
              <td className="p-4">4,500.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4 font-bold text-[#FF2A2A]">4,500.00</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-[#003D52]">1 Year Visit e-Visa</td>
              <td className="p-4">9,000.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4 font-bold text-[#FF2A2A]">9,000.00</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-[#003D52]">5 Years Visit e-Visa</td>
              <td className="p-4">12,000.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4">0.00</td>
              <td className="p-4 font-bold text-[#FF2A2A]">12,000.00</td>
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
