import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { Search, Clock, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useTable } from '../lib/useTable';
import { Link } from 'react-router-dom';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { countryVisas } from '../mock';
import VisaInquiryModal from '../components/VisaInquiryModal';

const customRates = {
  'United Arab Emirates': {
    packages: [
      {
        title: 'Normal Visa',
        items: [
          { label: '30 Days Adult', price: '₹ 8,250' },
          { label: '30 Days Child', price: '₹ 2,800' },
          { label: '60 Days Adult', price: '₹ 12,600' },
          { label: '60 Days Child', price: '₹ 5,500' },
          { label: '30 Days Extension', price: '₹ 25,200' },
        ]
      },
      {
        title: '⚡ Instant Visa',
        items: [
          { label: '30 Days Adult', price: '₹ 12,000' },
          { label: '30 Days Child', price: '₹ 5,500' },
          { label: '60 Days Adult', price: '₹ 15,500' },
          { label: '60 Days Child', price: '₹ 7,000' },
        ]
      },
      {
        title: '💜 Express Visa',
        items: [
          { label: '30 Days Adult', price: '₹ 10,500' },
          { label: '30 Days Child', price: '₹ 4,500' },
          { label: '60 Days Adult', price: '₹ 15,000' },
          { label: '60 Days Child', price: '₹ 6,500' },
        ]
      },
      {
        title: '✈️ Transit Visa',
        items: [
          { label: '48-Hour Dubai Transit', price: '₹ 2,700' },
          { label: '96-Hour Dubai Transit', price: '₹ 5,200' },
          { label: '48-Hour AUH Transit', price: '₹ 3,300' },
        ]
      },
      {
        title: '♻️ Multi Entry Visa (1-3 Days)',
        items: [
          { label: '30 Days Adult', price: '₹ 13,200' },
          { label: '30 Days Child', price: '₹ 5,200' },
          { label: '60 Days Adult', price: '₹ 19,900' },
          { label: '60 Days Child', price: '₹ 8,500' },
        ]
      },
      {
        title: 'Sharjah Visa (Deposit 1035)',
        items: [
          { label: '30 Days Adult', price: '₹ 15,700' },
          { label: '30 Days Child', price: '₹ 7,700' },
          { label: '60 Days Adult', price: '₹ 18,800' },
          { label: '60 Days Child', price: '₹ 9,000' },
          { label: '30 Days Adult w/o Dep.', price: '₹ 22,500' },
          { label: '60 Days Adult w/o Dep.', price: '₹ 28,000' },
          { label: '60 Days Child w/o Dep.', price: '₹ 12,500' },
        ]
      },
      {
        title: 'Multi Entry (Deposit 2040)',
        items: [
          { label: '30 Days Adult', price: '₹ 22,800' },
          { label: '60 Days Adult', price: '₹ 28,500' },
        ]
      },
      {
        title: 'Premium Multiple Entry',
        items: [
          { label: '5 Year Multiple Entry', price: '₹ 41,999*' }
        ]
      }
    ],
    warnings: [
      '🚫 Edited hotel bookings & tickets are NOT accepted.',
      '📌 Recently exited UAE visit visa holders must wait at least 30 days before applying for a new Dubai visa. This cooling-off period applies to all nationalities, including Indian passport holders. Re-entering before completing this period may result in rejection. Alternatively, you may consider Sharjah, subject to approval.'
    ]
  },
  'Kuwait': {
    packages: [
      {
        title: 'Kuwait Visa Options',
        items: [
          { label: '30 Days Visa (Standard)', price: '₹ 40,000*' },
          { label: '30 Days (GCC Residents)', price: '₹ 8,050' },
          { label: '30 Days (Non-Residents)', price: '₹ 35,000' },
        ]
      }
    ],
    warnings: []
  },
  'Oman': {
    packages: [
      {
        title: 'Oman Visa Options',
        items: [
          { label: '10 Days Visa', price: '₹ 3,700' },
          { label: '30 Days Visa', price: '₹ 7,000' },
          { label: '21 Days Business Visa', price: '₹ 11,500' },
          { label: '90 Days Visa', price: '₹ 26,500' },
        ]
      }
    ],
    warnings: []
  },
  'Bahrain': {
    packages: [
      {
        title: 'Bahrain Visa Options',
        items: [
          { label: '14 Days Visa', price: '₹ 5,850' },
          { label: '90 Days Multiple Entry', price: '₹ 8,700' },
          { label: '1 Year Multiple Entry', price: '₹ 13,500' },
        ]
      }
    ],
    warnings: []
  },
  'Qatar': {
    packages: [
      {
        title: 'Qatar Visa Options',
        items: [
          { label: '30 Days Tourist Visa', price: '₹ 3,500' },
        ]
      }
    ],
    warnings: []
  }
};

const Visa = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedVisa, setExpandedVisa] = useState(null);
  const { data: dbCountries, loading } = useTable('countries');
  const countries = dbCountries.length > 0 ? dbCountries : countryVisas;

  const filtered = countries.filter(v => {
    // Only show countries that have visa data (price or type present)
    if (!v.price && !v.visa_type && !v.type) return false;

    const name = v.name || v.country || '';
    const type = v.visa_type || v.type || '';
    const format = v.visa_format || v.visaType || '';
    
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      format === filter ||
      (filter === 'Tourist' && type.includes('Tourist')) ||
      (filter === 'Business' && type.includes('Business'));
    return matchesSearch && matchesFilter;
  });

  return (
    <SimplePage title="Visa Services" subtitle="Apply visa for 150+ countries with transparent pricing and expert document review." breadcrumb="Visa">
      <SEO
        title="Visa Services for 150+ Countries"
        description="Apply tourist, business or e-Visa for UAE, USA, UK, Schengen, Australia, Canada, Singapore and 150+ countries from India. Transparent fees, expert review, fast processing."
        path="/visa"
        jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Visa', path: '/visa' }])]}
      />
      <div className="flex flex-col md:flex-row gap-3 mb-8 justify-center">
        <div className="flex gap-2 overflow-x-auto mx-auto md:mx-0">
          {['All', 'Tourist', 'Business', 'e-Visa', 'Stamp Visa'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 h-12 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                filter === f ? 'bg-[#003D52] text-white' : 'bg-white text-slate-600 border border-slate-300 hover:border-[#003D52]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-5">
        <Filter className="w-4 h-4" />
        <span>Showing {filtered.length} {filtered.length === 1 ? 'country' : 'countries'}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-600 gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading countries...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(visa => (
            <div key={visa.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#FF2A2A]/40 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img src={visa.flag_url || visa.flag} alt={visa.name || visa.country} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {visa.popular && <Badge className="absolute top-3 right-3 bg-[#00C2E6] hover:bg-[#00C2E6] text-white border-0 text-[10px]">POPULAR</Badge>}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-90">{visa.visa_type || visa.type}</div>
                  <div className="font-bold text-sm">{visa.name || visa.country}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" /><span>{visa.processing_time || visa.processingTime}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{visa.visa_format || visa.visaType}</div>
                    <div className="text-base font-bold text-[#003D52]">{visa.price}</div>
                  </div>
                  <Link to="/apply" state={{ country: visa.name || visa.country, visaType: visa.visa_type || visa.type }}>
                    <Button 
                      size="sm" 
                      className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </div>

                <Collapsible 
                  open={expandedVisa === visa.id} 
                  onOpenChange={() => setExpandedVisa(expandedVisa === visa.id ? null : visa.id)}
                  className="mt-4 pt-4 border-t border-slate-100"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-slate-500 hover:text-[#003D52] h-8 px-2">
                      {expandedVisa === visa.id ? 'Hide Details & Rates' : 'View Details & Rates'}
                      {expandedVisa === visa.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-3">
                    {customRates[visa.name || visa.country] ? (
                      <div className="space-y-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-h-72 overflow-y-auto custom-scrollbar text-[11px]">
                        {customRates[visa.name || visa.country].packages.map((pkg, pIdx) => (
                          <div key={pIdx} className="space-y-1">
                            <div className="font-bold text-[#003D52] uppercase tracking-wider border-b border-slate-200 pb-1 flex justify-between items-center mb-1 text-[10px]">
                              <span>{pkg.title}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-600 font-medium">
                              {pkg.items.map((item, iIdx) => (
                                <React.Fragment key={iIdx}>
                                  <div className="truncate text-left text-[11px]">{item.label}</div>
                                  <div className="text-right font-extrabold text-[#FF2A2A] text-[11px]">{item.price}</div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                        {customRates[visa.name || visa.country].warnings && customRates[visa.name || visa.country].warnings.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2">
                            {customRates[visa.name || visa.country].warnings.map((warn, wIdx) => (
                              <div key={wIdx} className="text-[10px] text-red-600 font-semibold leading-normal flex gap-1.5 items-start text-left">
                                <span className="flex-shrink-0 text-xs">⚠️</span>
                                <span>{warn.replace('⚠️ ', '').replace('🚫 ', '').replace('📌 ', '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 mt-2">
                        {[
                          'Valid Passport (6+ Months Validity)',
                          'Recent Passport Size Photograph',
                          'Confirmed Flight Booking & Accommodation',
                          ...((visa.visa_type || visa.type || '').includes('Business') ? ['Business Invitation Letter'] : ['Financial Support Documents'])
                        ].map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 text-left">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="text-center mt-12 mb-8">
          <Link to="/apply">
            <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-[#FF2A2A]/20 transition-all hover:-translate-y-1">
              View More <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      <VisaInquiryModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        visaData={selectedVisa} 
      />
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">No countries match your search.</div>
      )}
    </SimplePage>
  );
};

export default Visa;
