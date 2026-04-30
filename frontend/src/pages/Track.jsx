import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { Search, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Track = () => {
  const [ref, setRef] = useState('');
  const [result, setResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!ref) return;
    setResult({
      ref: ref.toUpperCase(),
      country: 'United Arab Emirates',
      visaType: 'Tourist Visa',
      status: 'Under Review',
      submitted: '12 Jul 2025',
      expected: '16 Jul 2025',
      timeline: [
        { label: 'Application Submitted', date: '12 Jul 2025', completed: true },
        { label: 'Documents Verified', date: '13 Jul 2025', completed: true },
        { label: 'Embassy Submission', date: '14 Jul 2025', completed: true },
        { label: 'Under Review', date: 'In Progress', completed: false, current: true },
        { label: 'Visa Approved', date: 'Expected 16 Jul', completed: false },
      ],
    });
  };

  return (
    <SimplePage title="Track Your Application" subtitle="Enter your reference number to see real-time status updates." breadcrumb="Track Status">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-[#1A3C5E] mb-2">Application Reference Number</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. BTT-123456"
                className="pl-11 h-12 border-slate-300 focus-visible:ring-[#E86C2C]"
              />
            </div>
            <Button type="submit" className="bg-[#E86C2C] hover:bg-[#d05f24] text-white h-12 px-6 gap-2">
              <Search className="w-4 h-4" /> Track
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-3">Try any reference number to see a sample tracking view (mock data).</p>
        </form>

        {result && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-5 border-b border-slate-100">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Reference</div>
                <div className="text-xl font-bold text-[#1A3C5E]">{result.ref}</div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#F5A623]/15 text-[#B17A0E] text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {result.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
              <div><div className="text-xs text-slate-500 mb-1">Country</div><div className="font-semibold text-[#1A3C5E] text-sm">{result.country}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Visa Type</div><div className="font-semibold text-[#1A3C5E] text-sm">{result.visaType}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Submitted</div><div className="font-semibold text-[#1A3C5E] text-sm">{result.submitted}</div></div>
              <div><div className="text-xs text-slate-500 mb-1">Expected</div><div className="font-semibold text-[#1A3C5E] text-sm">{result.expected}</div></div>
            </div>

            <div className="text-sm font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#E86C2C]" /> Status Timeline</div>
            <div className="space-y-4">
              {result.timeline.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      t.completed ? 'bg-[#E86C2C] text-white' : t.current ? 'bg-[#F5A623] text-white animate-pulse' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {t.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    {i < result.timeline.length - 1 && <div className={`w-0.5 flex-1 ${t.completed ? 'bg-[#E86C2C]' : 'bg-slate-200'}`} />}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className={`font-semibold text-sm ${t.completed || t.current ? 'text-[#1A3C5E]' : 'text-slate-400'}`}>{t.label}</div>
                    <div className="text-xs text-slate-500">{t.date}</div>
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
