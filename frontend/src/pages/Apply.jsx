import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Check, MapPin, User, Upload, FileCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { countryVisas } from '../mock';
import { useTable } from '../lib/useTable';
import { useToast } from '../hooks/use-toast';
import { supabase, generateRefNumber } from '../lib/supabase';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const stepsList = [
  { id: 1, label: 'Select Visa', icon: MapPin },
  { id: 2, label: 'Customer Details', icon: User },
  { id: 3, label: 'Upload Documents', icon: Upload },
  { id: 4, label: 'Submitted', icon: FileCheck },
];

const buildTimeline = () => {
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  return [
    { label: 'Application Submitted', date: fmt(today), completed: true },
    { label: 'Documents Verification', date: 'Pending', completed: false, current: true },
    { label: 'Embassy Submission', date: 'Pending', completed: false },
    { label: 'Under Review', date: 'Pending', completed: false },
    { label: 'Visa Approved', date: 'Pending', completed: false },
  ];
};

const Apply = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const { data: countries } = useTable('countries');
  const [data, setData] = useState({
    country: '', visaType: '', name: '', email: '', phone: '', dob: '', passport: '', nationality: 'Indian', notes: ''
  });
  const { toast } = useToast();
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const next = async () => {
    if (step === 1 && (!data.country || !data.visaType)) {
      toast({ title: 'Please select both country and visa type' });
      return;
    }
    if (step === 2 && (!data.name || !data.email || !data.phone)) {
      toast({ title: 'Please fill all required fields' });
      return;
    }
    if (step === 3) {
      // Submit to Supabase
      setSubmitting(true);
      const ref = generateRefNumber();
      const today = new Date();
      const expected = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      const { error } = await supabase.from('visa_applications').insert({
        reference_number: ref,
        country: data.country,
        visa_type: data.visaType,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.dob || null,
        passport_number: data.passport || null,
        nationality: data.nationality,
        notes: data.notes || null,
        status: 'Submitted',
        status_timeline: buildTimeline(),
        expected_completion_date: expected.toISOString().slice(0, 10),
      });
      setSubmitting(false);
      if (error) {
        toast({ title: 'Submission failed', description: error.message });
        return;
      }
      setRefNumber(ref);
      setStep(4);
      return;
    }
    if (step < 4) setStep(s => s + 1);
  };
  const back = () => step > 1 && setStep(s => s - 1);

  return (
    <SimplePage title="Apply for Visa" subtitle="Complete your application in 4 simple steps. Save and resume anytime." breadcrumb="Apply">
      <SEO
        title="Apply for Visa — Online Application"
        description="Apply online for tourist, business, student or transit visa to 150+ countries. 4-step application, document upload, real-time status tracking."
        path="/apply"
        jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Apply', path: '/apply' }])]}
      />
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {stepsList.map((s, i) => {
            const Icon = s.icon;
            const completed = step > s.id;
            const active = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    completed ? 'bg-[#FF2A2A] text-white' : active ? 'bg-[#003D52] text-white ring-4 ring-[#003D52]/15' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {completed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className={`text-xs font-semibold ${active || completed ? 'text-[#003D52]' : 'text-slate-400'}`}>{s.label}</div>
                </div>
                {i < stepsList.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s.id ? 'bg-[#FF2A2A]' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#003D52] mb-1">Where are you traveling?</h2>
            <p className="text-sm text-slate-600 mb-6">Pick your destination and visa type to begin.</p>
            <div>
              <Label className="text-[#003D52] font-medium mb-2 block">Destination Country *</Label>
              <Select value={data.country} onValueChange={(v) => update('country', v)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {(countries.length ? countries.map(c => ({ id: c.id, country: c.name })) : countryVisas).map(c => <SelectItem key={c.id} value={c.country}>{c.country}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#003D52] font-medium mb-2 block">Visa Type *</Label>
              <Select value={data.visaType} onValueChange={(v) => update('visaType', v)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tourist Visa">Tourist Visa</SelectItem>
                  <SelectItem value="Business Visa">Business Visa</SelectItem>
                  <SelectItem value="Student Visa">Student Visa</SelectItem>
                  <SelectItem value="Transit Visa">Transit Visa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#003D52] mb-1">Your details</h2>
            <p className="text-sm text-slate-600 mb-6">We'll use these details to set up your application.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-[#003D52] font-medium mb-2 block">Full Name *</Label><Input value={data.name} onChange={(e) => update('name', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Email *</Label><Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Phone *</Label><Input value={data.phone} onChange={(e) => update('phone', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Date of Birth</Label><Input type="date" value={data.dob} onChange={(e) => update('dob', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Passport Number</Label><Input value={data.passport} onChange={(e) => update('passport', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Nationality</Label><Input value={data.nationality} onChange={(e) => update('nationality', e.target.value)} className="h-11" /></div>
            </div>
            <div><Label className="text-[#003D52] font-medium mb-2 block">Additional Notes</Label><Textarea value={data.notes} onChange={(e) => update('notes', e.target.value)} rows={3} /></div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#003D52] mb-1">Upload Documents</h2>
            <p className="text-sm text-slate-600 mb-6">Document upload is illustrative — your application will be saved to our system. Our agent will reach out for actual document collection via email/WhatsApp.</p>
            {['Passport (front & back)', 'Recent Photograph', 'Bank Statement (3 months)', 'Travel Itinerary'].map(doc => (
              <div key={doc} className="border-2 border-dashed border-slate-300 rounded-xl p-5 hover:border-[#FF2A2A] hover:bg-[#FF2A2A]/5 transition-all">
                <div className="flex items-center gap-4">
                  <Upload className="w-6 h-6 text-[#FF2A2A]" />
                  <div className="flex-1">
                    <div className="font-medium text-[#003D52] text-sm">{doc}</div>
                    <div className="text-xs text-slate-500">Optional at this step</div>
                  </div>
                  <Button size="sm" variant="outline" className="border-[#003D52] text-[#003D52]">Browse</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-[#FF2A2A]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-[#003D52] mb-3">Application Submitted!</h2>
            <p className="text-slate-600 max-w-md mx-auto mb-2">Save your reference number to track status</p>
            <div className="text-2xl font-bold text-[#FF2A2A] tracking-wider mb-6">{refNumber}</div>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Our visa expert will review your application within 24 hours and reach out via email and WhatsApp.</p>
            <a href={`/track?ref=${refNumber}`} className="inline-block">
              <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2">Track Status <ArrowRight className="w-4 h-4" /></Button>
            </a>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          {step > 1 && step < 4 ? (
            <Button onClick={back} disabled={submitting} variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
          ) : <div />}
          {step < 4 && (
            <Button onClick={next} disabled={submitting} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2 ml-auto">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 3 ? (submitting ? 'Submitting...' : 'Submit Application') : 'Continue'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </SimplePage>
  );
};

export default Apply;
