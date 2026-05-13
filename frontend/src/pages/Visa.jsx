import React, { useState, useEffect } from 'react';
import { SimplePage } from './PageHeader';
import { Search, Clock, ArrowRight, Filter, Loader2, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useTable } from '../lib/useTable';
import { Link } from 'react-router-dom';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { countryVisas } from '../mock';
import VisaInquiryModal from '../components/VisaInquiryModal';

const countryToCode = {
  'united arab emirates': 'ae', 'uae': 'ae', 'dubai': 'ae',
  'united kingdom': 'gb', 'uk': 'gb', 'england': 'gb',
  'united states': 'us', 'usa': 'us', 'america': 'us',
  'switzerland': 'ch', 'singapore': 'sg', 'qatar': 'qa',
  'kenya': 'ke', 'jordan': 'jo', 'russia': 'ru', 'laos': 'la',
  'china': 'cn', 'georgia': 'ge', 'bangladesh': 'bd', 'egypt': 'eg',
  'azerbaijan': 'az', 'australia': 'au', 'canada': 'ca', 'thailand': 'th',
  'malaysia': 'my', 'vietnam': 'vn', 'cambodia': 'kh', 'oman': 'om',
  'kuwait': 'kw', 'bahrain': 'bh', 'india': 'in', 'france': 'fr',
  'germany': 'de', 'italy': 'it', 'spain': 'es', 'japan': 'jp',
  'sri lanka': 'lk', 'nepal': 'np', 'maldives': 'mv', 'indonesia': 'id',
  'turkey': 'tr', 'saudi arabia': 'sa', 'south africa': 'za',
  'brazil': 'br', 'mexico': 'mx', 'new zealand': 'nz', 'ireland': 'ie',
  'netherlands': 'nl', 'belgium': 'be', 'austria': 'at', 'greece': 'gr'
};

const getFlagUrl = (name) => {
  const norm = (name || '').toLowerCase().trim();
  const code = countryToCode[norm] || (norm.length === 2 ? norm : 'un');
  return `https://flagcdn.com/w320/${code}.png`;
};

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
  
  const { user } = useAuth();
  const { data: dbCountries, loading, refresh } = useTable('countries');
  const countries = dbCountries.length > 0 ? dbCountries : countryVisas;
  
  const [visaList, setVisaList] = useState([]);
  const isAdmin = (user?.email === 'banjaratravel@gmail.com') || (localStorage.getItem('visa_admin') === 'true');
  const suppressDBEffect = React.useRef(false);

  // Add/Edit Visa Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditVisa, setSelectedEditVisa] = useState(null);

  const emptyForm = {
    countryName: '', countryFlag: 'https://flagcdn.com/w320/un.png',
    visaType: 'Tourist Visa', visaFormat: 'e-Visa',
    processingTime: '3-5 Working days', visaPrice: 'From INR 4,500',
    popular: false, requirements: '', warnings: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [priceRows, setPriceRows] = useState([{ label: '', price: '' }]);

  const setField = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const setCountryName = (val) => { setField('countryName', val); setField('countryFlag', getFlagUrl(val)); };

  const addPriceRow = () => setPriceRows(r => [...r, { label: '', price: '' }]);
  const removePriceRow = (i) => setPriceRows(r => r.filter((_, idx) => idx !== i));
  const updatePriceRow = (i, key, val) => setPriceRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  const parseNotes = (rows) => rows.map(v => {
    try {
      const meta = v.notes ? JSON.parse(v.notes) : null;
      if (meta) return { ...v, requirements: meta.requirements, warnings: meta.warnings, pricePackage: meta.pricePackage };
    } catch (_) {}
    return v;
  });

  useEffect(() => {
    // Skip DB refresh if we just did an optimistic update — prevents overwriting admin edits
    if (suppressDBEffect.current) {
      suppressDBEffect.current = false;
      return;
    }
    localStorage.removeItem('custom_visas');
    if (dbCountries && dbCountries.length > 0) {
      setVisaList(parseNotes(dbCountries));
    } else if (countryVisas.length > 0) {
      setVisaList(countryVisas);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbCountries]);

  const saveList = async (updated, item, action) => {
    // 1. Instant optimistic UI
    suppressDBEffect.current = true; // prevent next DB re-fetch from overwriting this
    setVisaList(updated);

    // 2. Sync to Supabase — works for both Supabase-authed AND localStorage-fallback admins.
    // We use the anon key client which has write access via RLS (or no RLS on this table).
    if (!isAdmin) return;
    try {
      if (action === 'delete') {
        const { error } = await supabase.from('countries').delete().eq('id', item.id);
        if (error) console.error('Delete error:', error.message);
      } else {
        const adminMeta = JSON.stringify({
          requirements: item.requirements || [],
          warnings: item.warnings || [],
          pricePackage: item.pricePackage || null,
        });
        const basePayload = {
          name: item.name,
          flag_url: item.flag_url,
          visa_type: item.visa_type,
          processing_time: item.processing_time,
          visa_format: item.visa_format,
          price: item.price,
          popular: !!item.popular,
        };
        // Try writing notes; if the column doesn't exist Supabase will error — we catch it
        const payloadWithNotes = { ...basePayload, notes: adminMeta };

        let result;
        if (action === 'add') {
          result = await supabase.from('countries').insert([{ ...payloadWithNotes, sort_order: 100 }]);
          if (result.error?.message?.includes('notes')) {
            // notes column doesn't exist yet — insert without it
            result = await supabase.from('countries').insert([{ ...basePayload, sort_order: 100 }]);
          }
        } else if (action === 'edit') {
          result = await supabase.from('countries').update(payloadWithNotes).eq('id', item.id);
          if (result.error?.message?.includes('notes')) {
            result = await supabase.from('countries').update(basePayload).eq('id', item.id);
          }
        }
        if (result?.error) console.error('Save error:', result.error.message);
      }
      // Refresh DB — useEffect will skip overwriting because suppressDBEffect is reset to false
      // only after the flag fires once. Set it again so the refresh doesn't wipe optimistic state.
      suppressDBEffect.current = true;
      refresh();
    } catch (e) {
      console.error('Supabase sync error:', e);
    }
  };

  const handleAddVisa = (e) => {
    e.preventDefault();
    if (!formData.countryName) return;
    const validRows = priceRows.filter(r => r.label.trim() && r.price.trim());
    const newVisa = {
      id: Date.now(),
      name: formData.countryName,
      flag_url: formData.countryFlag,
      visa_type: formData.visaType,
      visa_format: formData.visaFormat,
      processing_time: formData.processingTime,
      price: formData.visaPrice,
      popular: formData.popular,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      warnings: formData.warnings.split('\n').filter(r => r.trim()),
      pricePackage: validRows.length ? { title: 'Visa Prices', items: validRows } : null,
    };
    saveList([newVisa, ...visaList], newVisa, 'add');
    setFormData(emptyForm);
    setPriceRows([{ label: '', price: '' }]);
    setIsAddModalOpen(false);
  };

  const handleEditVisa = (e) => {
    e.preventDefault();
    if (!selectedEditVisa) return;
    const validRows = priceRows.filter(r => r.label.trim() && r.price.trim());
    const editedItem = {
      id: selectedEditVisa.id,
      name: formData.countryName,
      flag_url: formData.countryFlag,
      visa_type: formData.visaType,
      visa_format: formData.visaFormat,
      processing_time: formData.processingTime,
      price: formData.visaPrice,
      popular: formData.popular,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      warnings: formData.warnings.split('\n').filter(r => r.trim()),
      pricePackage: validRows.length ? { title: 'Visa Prices', items: validRows } : null,
    };
    const updated = visaList.map(v => v.id === selectedEditVisa.id ? editedItem : v);
    saveList(updated, editedItem, 'edit');
    setIsEditModalOpen(false);
    setSelectedEditVisa(null);
  };

  const handleDeleteVisa = (id) => {
    if (!window.confirm('Delete this visa? This cannot be undone.')) return;
    const itemToDelete = visaList.find(v => v.id === id);
    saveList(visaList.filter(v => v.id !== id), itemToDelete, 'delete');
  };

  const handleOpenEdit = (visa) => {
    setSelectedEditVisa(visa);
    setFormData({
      countryName: visa.name || visa.country || '',
      countryFlag: visa.flag_url || visa.flag || '',
      visaType: visa.visa_type || visa.type || 'Tourist Visa',
      visaFormat: visa.visa_format || visa.visaType || 'e-Visa',
      processingTime: visa.processing_time || visa.processingTime || '3-5 Working days',
      visaPrice: visa.price || 'From INR 4,500',
      popular: !!visa.popular,
      requirements: (visa.requirements || []).join('\n'),
      warnings: (visa.warnings || []).join('\n'),
    });
    setPriceRows(visa.pricePackage?.items?.length ? visa.pricePackage.items : [{ label: '', price: '' }]);
    setIsEditModalOpen(true);
  };

  const openAdd = () => { setFormData(emptyForm); setPriceRows([{ label: '', price: '' }]); setIsAddModalOpen(true); };

  const filtered = visaList.filter(v => {
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

      {isAdmin && (
        <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-[#003D52] to-[#00526e] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-[#003D52]/50">
          <div className="flex items-center gap-3 text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50" />
            <div>
              <span className="text-sm font-bold tracking-wide block">Banjara Travels Admin Portal</span>
              <span className="text-xs opacity-75">You can edit any card, set custom rates and add new visas.</span>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={openAdd}
              className="flex-1 sm:flex-initial bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-bold rounded-xl h-11 px-5 shadow-lg shadow-[#FF2A2A]/20 hover:-translate-y-0.5 transition-all"
            >
              + Add New Visa
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('visa_admin');
                window.location.reload();
              }}
              className="text-white border-white/20 hover:bg-white/10 hover:text-white font-semibold rounded-xl h-11 px-4"
            >
              Exit Admin
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search visa countries..." 
          className="pl-12 h-12 rounded-xl shadow-sm border-slate-200 focus:border-[#003D52] focus:ring-1 focus:ring-[#003D52]"
        />
      </div>

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
                  <div className="flex gap-2 flex-wrap">
                    {isAdmin && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(visa)} className="border-[#003D52] text-[#003D52] hover:bg-[#003D52]/10 font-semibold">Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVisa(visa.id)} className="border-red-300 text-red-600 hover:bg-red-50 font-semibold">Delete</Button>
                      </>
                    )}
                    <Link to="/apply" state={{ country: visa.name || visa.country, visaType: visa.visa_type || visa.type }}>
                      <Button size="sm" className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white">Apply Now</Button>
                    </Link>
                  </div>
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
                    {/* Admin-defined price rows take highest priority */}
                    {visa.pricePackage?.items?.length ? (
                      <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-h-72 overflow-y-auto text-[11px]">
                        <div className="font-bold text-[#003D52] uppercase tracking-wider border-b border-slate-200 pb-1 text-[10px]">{visa.pricePackage.title}</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-600 font-medium">
                          {visa.pricePackage.items.map((item, i) => (
                            <React.Fragment key={i}>
                              <div className="truncate text-left text-[11px]">{item.label}</div>
                              <div className="text-right font-extrabold text-[#FF2A2A] text-[11px]">{item.price}</div>
                            </React.Fragment>
                          ))}
                        </div>
                        {visa.warnings?.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2">
                            {visa.warnings.map((warn, wi) => (
                              <div key={wi} className="text-[10px] text-red-600 font-semibold leading-normal flex gap-1.5 items-start text-left">
                                <span className="flex-shrink-0">⚠️</span><span>{warn.replace('⚠️ ', '').replace('🚫 ', '').replace('📌 ', '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : customRates[visa.name || visa.country] ? (
                      <div className="space-y-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-h-72 overflow-y-auto custom-scrollbar text-[11px]">
                        {customRates[visa.name || visa.country].packages.map((pkg, pIdx) => (
                          <div key={pIdx} className="space-y-1">
                            <div className="font-bold text-[#003D52] uppercase tracking-wider border-b border-slate-200 pb-1 flex justify-between items-center mb-1 text-[10px]"><span>{pkg.title}</span></div>
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
                        {customRates[visa.name || visa.country].warnings?.length > 0 && (
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
                        {(visa.requirements || [
                          'Valid Passport (6+ Months Validity)',
                          'Recent Passport Size Photograph',
                          'Confirmed Flight Booking & Accommodation',
                          ...((visa.visa_type || visa.type || '').includes('Business') ? ['Business Invitation Letter'] : ['Financial Support Documents'])
                        ]).map((req, idx) => (
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

      <VisaInquiryModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} visaData={selectedVisa} />
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">No countries match your search.</div>
      )}

      {/* SHARED FORM FIELDS - rendered inside both Add & Edit dialogs */}
      {[
        { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, title: 'Add New Visa', desc: 'Enter country details. Flag appears automatically.', onSubmit: handleAddVisa, btnLabel: 'Add Visa' },
        { open: isEditModalOpen, onOpenChange: setIsEditModalOpen, title: 'Edit Visa', desc: 'Update any visa details below.', onSubmit: handleEditVisa, btnLabel: 'Save Changes' }
      ].map(({ open, onOpenChange, title, desc, onSubmit, btnLabel }) => (
        <Dialog key={title} open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border-0 p-0">
            <div className="bg-gradient-to-r from-[#003D52] to-[#00526e] px-6 pt-6 pb-4 rounded-t-2xl">
              <DialogTitle className="text-white text-lg font-bold">{title}</DialogTitle>
              <DialogDescription className="text-white/70 text-xs mt-0.5">{desc}</DialogDescription>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-5">

              {/* Country + Flag */}
              <div>
                <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Country Name *</Label>
                <div className="flex gap-2 items-center">
                  <Input value={formData.countryName} onChange={e => setCountryName(e.target.value)} placeholder="e.g. Germany" required className="h-10 flex-1" />
                  <div className="w-14 h-9 rounded-lg border-2 border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={formData.countryFlag} alt="flag" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://flagcdn.com/w320/un.png'; }} />
                  </div>
                </div>
              </div>

              {/* Visa Type + Format */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Visa Type *</Label>
                  <Input value={formData.visaType} onChange={e => setField('visaType', e.target.value)} placeholder="Tourist Visa" required className="h-10" />
                </div>
                <div>
                  <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Visa Format</Label>
                  <select value={formData.visaFormat} onChange={e => setField('visaFormat', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#003D52]">
                    <option value="e-Visa">e-Visa</option>
                    <option value="Stamp Visa">Stamp Visa</option>
                    <option value="Normal Visa">Normal Visa</option>
                    <option value="On Arrival">On Arrival</option>
                  </select>
                </div>
              </div>

              {/* Processing Time + Display Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Processing Time *</Label>
                  <Input value={formData.processingTime} onChange={e => setField('processingTime', e.target.value)} placeholder="3-5 Working days" required className="h-10" />
                </div>
                <div>
                  <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Display Price *</Label>
                  <Input value={formData.visaPrice} onChange={e => setField('visaPrice', e.target.value)} placeholder="From INR 4,500" required className="h-10" />
                </div>
              </div>

              {/* Popular toggle */}
              <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                <input type="checkbox" id={`pop-${title}`} checked={formData.popular} onChange={e => setField('popular', e.target.checked)} className="w-4 h-4 accent-[#003D52]" />
                <label htmlFor={`pop-${title}`} className="text-sm font-semibold text-[#003D52] cursor-pointer select-none">Mark as Popular <span className="font-normal text-slate-500 text-xs">(shows POPULAR badge)</span></label>
              </div>

              {/* Dynamic Price Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[#003D52] font-semibold text-xs">Price Options <span className="font-normal text-slate-400">(shown in Details &amp; Rates)</span></Label>
                  <button type="button" onClick={addPriceRow} className="flex items-center gap-1 text-xs font-bold text-[#FF2A2A] hover:text-[#E01F1F] px-2 py-1 rounded-md hover:bg-[#FF2A2A]/10 transition-all">
                    <span className="text-base leading-none">+</span> Add Row
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {priceRows.map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input value={row.label} onChange={e => updatePriceRow(i, 'label', e.target.value)} placeholder="e.g. 30 Days Adult" className="h-9 text-xs flex-1" />
                      <Input value={row.price} onChange={e => updatePriceRow(i, 'price', e.target.value)} placeholder="e.g. ₹ 8,250" className="h-9 text-xs w-32" />
                      {priceRows.length > 1 && (
                        <button type="button" onClick={() => removePriceRow(i)} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none w-6 flex-shrink-0 hover:bg-red-50 rounded transition-all">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Requirements <span className="font-normal text-slate-400">(one per line)</span></Label>
                <Textarea value={formData.requirements} onChange={e => setField('requirements', e.target.value)} placeholder="Enter the visa requirements..." rows={3} className="text-sm" />
              </div>

              {/* Warnings */}
              <div>
                <Label className="text-[#003D52] font-semibold text-xs block mb-1.5">Warnings / Notes <span className="font-normal text-slate-400">(one per line, shown in red)</span></Label>
                <Textarea value={formData.warnings} onChange={e => setField('warnings', e.target.value)} placeholder="Enter warnings or notes..." rows={2} className="text-sm" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-bold px-6">{btnLabel}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ))}
    </SimplePage>
  );
};

export default Visa;

