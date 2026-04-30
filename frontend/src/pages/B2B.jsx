import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { Briefcase, TrendingUp, Users, FileCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';

const benefits = [
  { icon: TrendingUp, title: 'Competitive Margins', text: 'Get the best B2B rates with transparent commission structure on every visa.' },
  { icon: Users, title: 'Dedicated Account Manager', text: 'A single point of contact for all your bulk submissions and queries.' },
  { icon: FileCheck, title: 'Bulk Processing', text: 'Submit hundreds of applications in a single batch through our portal.' },
  { icon: Briefcase, title: 'White-Label Reports', text: 'Branded status reports and invoices for your clients.' },
];

const B2B = () => {
  const { toast } = useToast();
  const [data, setData] = useState({ agency_name: '', contact_person: '', designation: '', email: '', phone: '', city: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!data.agency_name || !data.contact_person || !data.email || !data.phone) {
      toast({ title: 'Please fill all required fields' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('b2b_registrations').insert({
      agency_name: data.agency_name,
      contact_person: data.contact_person,
      designation: data.designation || null,
      email: data.email,
      phone: data.phone,
      city: data.city || null,
      description: data.description || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Submission failed', description: error.message });
      return;
    }
    setSubmitted(true);
    toast({ title: 'Application received!', description: 'Our team will reach out within 24 hours.' });
    setData({ agency_name: '', contact_person: '', designation: '', email: '', phone: '', city: '', description: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <SimplePage title="B2B Partner Portal" subtitle="Become a Banjara sub-agent and grow your travel agency with reliable visa services." breadcrumb="B2B Partner">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {benefits.map((b, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#FF2A2A]/40 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center mb-4 shadow-md">
              <b.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#003D52] text-base mb-2">{b.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-3">Why Partner With Us</div>
          <h2 className="text-3xl font-bold text-[#003D52] mb-5">Grow Your Travel Business Without the Visa Hassle</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Travel agents across India trust Banjara as their dedicated visa back-office. Focus on selling holidays — we handle visas, attestation, and FRRO end-to-end.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              '150+ countries covered with country-wise pricing',
              'Real-time application status via API',
              'Branded invoices and white-label communications',
              'Express processing for urgent bookings',
              'Monthly settlement with detailed reports',
            ].map(point => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#FF2A2A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                {point}
              </li>
            ))}
          </ul>
          <Link to="/contact">
            <Button variant="outline" className="border-[#003D52] text-[#003D52] hover:bg-[#003D52] hover:text-white gap-2">
              Schedule a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm space-y-4">
          <h3 className="text-2xl font-bold text-[#003D52] mb-1">Register as Partner</h3>
          <p className="text-sm text-slate-600 mb-2">Tell us about your agency.</p>
          {submitted ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-[#FF2A2A]" strokeWidth={3} />
              </div>
              <h4 className="text-lg font-bold text-[#003D52] mb-1">Application received!</h4>
              <p className="text-sm text-slate-600">Our partnership team will reach out within 24 hours.</p>
            </div>
          ) : (
            <>
              <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Agency Name *</Label><Input value={data.agency_name} onChange={(e) => update('agency_name', e.target.value)} className="h-11" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Contact Person *</Label><Input value={data.contact_person} onChange={(e) => update('contact_person', e.target.value)} className="h-11" /></div>
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Designation</Label><Input value={data.designation} onChange={(e) => update('designation', e.target.value)} className="h-11" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Email *</Label><Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} className="h-11" /></div>
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Phone *</Label><Input value={data.phone} onChange={(e) => update('phone', e.target.value)} className="h-11" /></div>
              </div>
              <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">City</Label><Input value={data.city} onChange={(e) => update('city', e.target.value)} className="h-11" /></div>
              <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Tell us about your agency</Label><Textarea rows={3} value={data.description} onChange={(e) => update('description', e.target.value)} /></div>
              <Button type="submit" disabled={submitting} className="w-full bg-[#FF2A2A] hover:bg-[#E01F1F] text-white h-12 gap-2 font-semibold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Submitting...' : 'Submit Partner Application'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </>
          )}
        </form>
      </div>
    </SimplePage>
  );
};

export default B2B;
