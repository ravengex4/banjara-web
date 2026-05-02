import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SimplePage } from './PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Check, MapPin, User, FileCheck, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { countryVisas } from '../mock';
import { useTable } from '../lib/useTable';
import { useToast } from '../hooks/use-toast';
import { supabase, generateRefNumber } from '../lib/supabase';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';
import { useForm as useFormspree } from '@formspree/react';
import { Link } from 'react-router-dom';
import visaDataJson from '../visaRequirements.json';

const stepsList = [
  { id: 1, label: 'Select Visa', icon: MapPin },
  { id: 2, label: 'Customer Details', icon: User },
  { id: 3, label: 'Requirements', icon: FileCheck },
  { id: 4, label: 'Submitted', icon: CheckCircle },
];

const getRequirements = (countryName, visaType) => {
  const match = visaDataJson.find(v => v.Country === countryName && (!visaType || v['Visa Type'] === visaType)) 
    || visaDataJson.find(v => v.Country === countryName);
  
  if (match && match['Key Documents Needed']) {
    return {
      docs: match['Key Documents Needed'].split(',').map(d => d.trim()),
      time: match['Processing Time (Days)'] || '7-14 days'
    };
  }
  return {
    docs: [
      'Valid passport (6+ months)',
      'Visa form',
      'Photo',
      'Flight itinerary',
      'Accommodation proof',
      'Bank statement (3 months)',
      'Travel insurance',
      'Employment/income proof'
    ],
    time: '7-14 days'
  };
};

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
  const [state, handleSubmit] = useFormspree('xeenoajz');
  const { data: countries } = useTable('countries');
  const [data, setData] = useState({
    country: '', consulate: '', visaType: '', name: '', email: '', phone: '', dob: '', passport: '', nationality: 'Indian', notes: ''
  });
  const { toast } = useToast();
  const location = useLocation();
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  useEffect(() => {
    if (location.state) {
      if (location.state.country) update('country', location.state.country);
      if (location.state.visaType) update('visaType', location.state.visaType);
      if (location.state.consulate) update('consulate', location.state.consulate);
      
      // Auto advance to step 2 if all required fields for step 1 are provided
      if (location.state.country && location.state.visaType && location.state.consulate) {
        setStep(2);
      }
    }
  }, [location.state]);

  const next = async () => {
    if (step === 1 && (!data.country || !data.visaType || !data.consulate)) {
      toast({ title: 'Please select country, consulate and visa type' });
      return;
    }
    if (step === 2 && (!data.name || !data.email || !data.phone)) {
      toast({ title: 'Please fill all required fields' });
      return;
    }
    if (step === 3) {
      await handleSubmit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        visa_type: data.visaType,
        country: data.country,
        consulate: data.consulate
      });
      return;
    }
    if (step < 3) setStep(s => s + 1);
  };
  const back = () => step > 1 && setStep(s => s - 1);
  
  const currentReqs = getRequirements(data.country, data.visaType);
  const currentStep = state.succeeded ? 4 : step;

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
            const completed = currentStep > s.id;
            const active = currentStep === s.id;
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
                  <div className={`flex-1 h-0.5 mx-2 -mt-6 ${currentStep > s.id ? 'bg-[#FF2A2A]' : 'bg-slate-200'}`} />
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
                  {(countries.length ? countries.map(c => ({ id: c.id, country: c.name })) : countryVisas).map(c => <SelectItem key={c.id || c.country} value={c.country}>{c.country}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#003D52] font-medium mb-2 block">Select Consulate *</Label>
              <Select value={data.consulate} onValueChange={(v) => update('consulate', v)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select consulate" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
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
              <div>
                <Label className="text-[#003D52] font-medium mb-2 block">Phone *</Label>
                <Input 
                  type="tel" 
                  value={data.phone} 
                  onFocus={(e) => { if (!data.phone) update('phone', '+91'); }}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith('+91')) {
                      val = '+91' + val.replace(/^\+91/, '');
                    }
                    val = val.replace(/[^\d+]/g, '');
                    update('phone', val);
                  }} 
                  className="h-11" 
                  placeholder="+919876543210"
                />
              </div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Date of Birth</Label><Input type="date" value={data.dob} onChange={(e) => update('dob', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Passport Number</Label><Input value={data.passport} onChange={(e) => update('passport', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] font-medium mb-2 block">Nationality</Label><Input value={data.nationality} onChange={(e) => update('nationality', e.target.value)} className="h-11" /></div>
            </div>
            <div><Label className="text-[#003D52] font-medium mb-2 block">Additional Notes</Label><Textarea value={data.notes} onChange={(e) => update('notes', e.target.value)} rows={3} /></div>
            {state.errors && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md">
                Submission failed. Please check your connection and try again.
              </div>
            )}
          </div>
        )}
        {state.succeeded && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-[#FF2A2A]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-[#003D52] mb-3">Inquiry Received!</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Thank you for your inquiry. Our visa expert will review your details and reach out via email/WhatsApp shortly.</p>
            <Link to="/">
              <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2">Back to Home</Button>
            </Link>
          </div>
        )}

        {!state.succeeded && step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 mb-2">
              <h2 className="text-2xl font-bold text-[#003D52] mb-1">Visa Requirements</h2>
              <p className="text-sm text-slate-600">Please ensure you have these documents ready before proceeding.</p>
            </div>
            
            <div className="bg-[#003D52]/5 rounded-xl p-5 border border-[#003D52]/10 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-[#003D52]" />
                <span className="font-bold text-[#003D52] text-sm uppercase tracking-wider">{data.country} — {data.visaType} ({data.consulate} Consulate)</span>
              </div>
              <div className="mb-4 inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
                Processing Time: {currentReqs.time}
              </div>
              <ul className="space-y-3">
                {currentReqs.docs.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-white border border-[#FF2A2A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#FF2A2A]" />
                    </div>
                    <span className="capitalize">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <div className="text-amber-500 font-bold text-lg mt-0.5">!</div>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Note:</strong> Some countries may require additional documents like income tax returns (3 years) or specific vaccination certificates. Our agent will guide you after you apply.
              </p>
            </div>
          </div>
        )}


        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          {step > 1 && !state.succeeded ? (
            <Button onClick={back} variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
          ) : <div />}
          {step < 3 && (
            <Button onClick={next} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2 ml-auto">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {!state.succeeded && step === 3 && (
            <Button onClick={next} disabled={state.submitting} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2 ml-auto px-8 font-bold">
              {state.submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </SimplePage>
  );
};

export default Apply;
