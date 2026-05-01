import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { Search, Clock, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useTable } from '../lib/useTable';
import { Link } from 'react-router-dom';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const Visa = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const { data: countries, loading } = useTable('countries');

  const filtered = countries.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      v.visa_format === filter ||
      (filter === 'Tourist' && (v.visa_type || '').includes('Tourist')) ||
      (filter === 'Business' && (v.visa_type || '').includes('Business'));
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
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by country name..." className="pl-11 h-12 border-slate-300 focus-visible:ring-[#FF2A2A]" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
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
                <img src={visa.flag_url} alt={visa.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {visa.popular && <Badge className="absolute top-3 right-3 bg-[#00C2E6] hover:bg-[#00C2E6] text-white border-0 text-[10px]">POPULAR</Badge>}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-90">{visa.visa_type}</div>
                  <div className="font-bold text-sm">{visa.name}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" /><span>{visa.processing_time}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{visa.visa_format}</div>
                    <div className="text-base font-bold text-[#003D52]">{visa.price}</div>
                  </div>
                  <Link to="/apply">
                    <Button size="sm" variant="ghost" className="text-[#FF2A2A] hover:bg-[#FF2A2A]/10 hover:text-[#FF2A2A]">
                      Apply <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">No countries match your search.</div>
      )}
    </SimplePage>
  );
};

export default Visa;
