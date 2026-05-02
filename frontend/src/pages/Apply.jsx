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
import { formatDate } from '../lib/utils';
import visaDataJson from '../visaRequirements.json';
import { WORLD_COUNTRIES } from '../lib/constants';

const stepsList = [
  { id: 1, label: 'Select Visa', icon: MapPin },
  { id: 2, label: 'Customer Details', icon: User },
  { id: 3, label: 'Review', icon: FileCheck },
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

const Apply = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { data: countries, loading } = useTable('countries');
  const [data, setData] = useState({
    country: '', consulate: '', visaType: '', name: '', email: '', phone: '', dob: '', passport: '', nationality: 'Indian', notes: ''
  });
  // const [file, setFile] = useState(null); // Removed file upload
  const { toast } = useToast();
  const location = useLocation();
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);

  const handleCountryChange = (val) => {
    update('country', val);
    if (val.trim().length > 0) {
      const filtered = WORLD_COUNTRIES.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCountrySuggestions(filtered);
      setShowCountrySuggestions(true);
    } else {
      setCountrySuggestions([]);
      setShowCountrySuggestions(false);
    }
  };

  const selectCountry = (countryName) => {
    update('country', countryName);
    setShowCountrySuggestions(false);
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.country) update('country', location.state.country);
      if (location.state.visaType) update('visaType', location.state.visaType);
      if (location.state.consulate) update('consulate', location.state.consulate);
      
      if (location.state.country && location.state.visaType && location.state.consulate) {
        setStep(2);
      }
    }
  }, [location.state]);

  // handleFileChange removed as PDF upload is disabled

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
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('_subject', 'New Visa Application Received');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('country', data.country);
        formData.append('visa_type', data.visaType);
        formData.append('consulate', data.consulate);
        formData.append('dob', formatDate(data.dob));
        formData.append('passport', data.passport);
        formData.append('nationality', data.nationality);
        formData.append('notes', data.notes);


        const response = await fetch('https://formspree.io/f/xeenoajz', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });
        if (response.ok) {
          setSucceeded(true);
        } else {
          toast({ title: 'Submission Failed', description: 'Failed to submit the form. Please try again.', variant: 'destructive' });
        }
      } catch (err) {
        toast({ title: 'Submission Failed', description: 'Please check your internet connection and try again.', variant: 'destructive' });
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (step < 3) setStep(s => s + 1);
  };
  const back = () => step > 1 && setStep(s => s - 1);
  
  const currentReqs = getRequirements(data.country, data.visaType);
  const currentStep = succeeded ? 4 : step;



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
            <div className="relative">
              <Label className="text-[#003D52] font-medium mb-2 block">Destination Country *</Label>
              <Input 
                value={data.country} 
                onChange={(e) => handleCountryChange(e.target.value)}
                onFocus={() => data.country && handleCountryChange(data.country)}
                onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
                placeholder="Type to search country..." 
                className="h-12"
              />
              {showCountrySuggestions && countrySuggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-1 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {countrySuggestions.map(c => (
                    <button
                      key={c}
                      onMouseDown={(e) => { e.preventDefault(); selectCountry(c); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[#003D52] text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label className="text-[#003D52] font-medium mb-2 block">Select Consulate *</Label>
              <Select value={data.consulate} onValueChange={(v) => update('consulate', v)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select consulate" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
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
                    if (!val.startsWith('+91')) val = '+91' + val.replace(/^\+91/, '');
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
          </div>
        )}
        {succeeded && (
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

        {!succeeded && step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 mb-2">
              <h2 className="text-2xl font-bold text-[#003D52] mb-1">Review Visa Requirements</h2>
              <p className="text-sm text-slate-600">Please review the required documents before submitting your application.</p>
            </div>
            
            <div className="bg-[#003D52]/5 rounded-xl p-5 border border-[#003D52]/10 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-[#003D52]" />
                <span className="font-bold text-[#003D52] text-sm uppercase tracking-wider">{data.country} — {data.visaType}</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                {currentReqs.docs.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3 h-3 text-[#FF2A2A]" /> {req}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[#003D52]/70 italic mt-2">
                Note: Our experts will contact you for the documents listed above.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          {step > 1 && !succeeded ? (
            <Button onClick={back} variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
          ) : <div />}
          {step < 3 && (
            <Button onClick={next} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2 ml-auto">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {!succeeded && step === 3 && (
            <Button onClick={next} disabled={submitting} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2 ml-auto px-8 font-bold">
              {submitting ? (
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

