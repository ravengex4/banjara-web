import React, { useEffect, useState } from 'react';
import { SimplePage } from './PageHeader';
import { Search, Clock, CheckCircle2, AlertCircle, FileText, Loader2, XCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';
import { SEO, breadcrumbSchema } from '../lib/SEO';

const Track = () => {
  const [params] = useSearchParams();
  const [ref, setRef] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fmtDate = (s) => {
    if (!s || s === 'Pending') return s || '-';
    try {
      return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return s; }
  };

  const fetchStatus = async (refValue) => {
    if (!refValue) return;
    setLoading(true);
    setError('');
    setResult(null);
    const { data, error } = await supabase
      .from('visa_applications')
      .select('reference_number, country, visa_type, status, status_timeline, expected_completion_date, created_at, full_name')
      .eq('reference_number', refValue.trim().toUpperCase())
      .maybeSingle();
    setLoading(false);
    if (error) {
      setError('Failed to fetch status. Please try again.');
      return;
    }
    if (!data) {
      setError(`No application found with reference "${refValue}". Please check the number and try again.`);
      return;
    }
    setResult(data);
  };

  useEffect(() => {
    const initial = params.get('ref');
    if (initial) {
      setRef(initial);
      fetchStatus(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    fetchStatus(ref);
  };

  return (
    <SimplePage title="Track Your Application" subtitle="Enter your reference number to see real-time status updates." breadcrumb="Track Status">
      <SEO
        title="Track Visa Application Status"
        description="Track your visa application status in real-time using your Banjara reference number. Get instant timeline updates from submission to approval."
        path="/track"
        noIndex
      />
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-[#003D52] mb-2">Application Reference Number</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. BTT-123456" className="pl-11 h-12 border-slate-300 focus-visible:ring-[#FF2A2A]" />
            </div>
            <Button type="submit" disabled={loading} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white h-12 px-6 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-3">Reference numbers start with BTT- followed by 6 digits.</p>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-[#FF2A2A] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {result && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-5 border-b border-slate-100">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Reference</div>
                <div className="text-xl font-bold text-[#003D52]">{result.reference_number}</div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#00C2E6]/15 text-[#005C75] text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {result.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
              <div><div className="text-xs text-slate-500 mb-1">Applicant</div><div className="font-semibold text-[#003D52] text-sm">{result.full_name}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Country</div><div className="font-semibold text-[#003D52] text-sm">{result.country}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Visa Type</div><div className="font-semibold text-[#003D52] text-sm">{result.visa_type}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Expected By</div><div className="font-semibold text-[#003D52] text-sm">{fmtDate(result.expected_completion_date)}</div></div>
            </div>

            <div className="text-sm font-semibold text-[#003D52] mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF2A2A]" /> Status Timeline</div>
            <div className="space-y-4">
              {(result.status_timeline || []).map((t, i, arr) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      t.completed ? 'bg-[#FF2A2A] text-white' : t.current ? 'bg-[#00C2E6] text-white animate-pulse' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {t.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    {i < arr.length - 1 && <div className={`w-0.5 flex-1 ${t.completed ? 'bg-[#FF2A2A]' : 'bg-slate-200'}`} />}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className={`font-semibold text-sm ${t.completed || t.current ? 'text-[#003D52]' : 'text-slate-400'}`}>{t.label}</div>
                    <div className="text-xs text-slate-500">{t.date && t.date !== 'Pending' ? fmtDate(t.date) : 'Pending'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimplePage>
  );
};

export default Track;
