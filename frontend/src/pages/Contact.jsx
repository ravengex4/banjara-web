import React, { useState } from 'react';
import { SimplePage } from './PageHeader';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import { Loader2 } from 'lucide-react';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const Contact = () => {
  const { data: offices } = useTable('offices');
  const [data, setData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.message) {
      toast({ title: 'Please fill all required fields' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('contact_submissions').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Submission failed', description: error.message });
      return;
    }
    setSubmitted(true);
    toast({ title: 'Message sent!', description: 'We will get back to you within 24 hours.' });
    setData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <SimplePage title="Get In Touch" subtitle="Have questions? Our visa experts are here to help. Reach out via form, phone, email, or visit a branch." breadcrumb="Contact">
      <SEO
        title="Contact Us — Visa Experts in India"
        description="Reach Banjara Tours visa experts. Office at Plot 150, Phase 3, Kamalapuri Colony, Hyderabad. Phone +91 99599 40008, email info@banjaratours.in. Open Mon–Sat 9am–7pm IST."
        path="/contact"
        jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Phone, title: 'Call Us', text: '+91 99599 40008', sub: 'Mon–Sat, 9am–7pm IST' },
          { icon: Mail, title: 'Email Us', text: 'info@banjaratours.in', sub: 'Reply within 24 hours' },
          { icon: Clock, title: 'Working Hours', text: 'Mon – Sat', sub: '9:00 AM – 7:00 PM' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#FF2A2A]/40 hover:shadow-lg transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center flex-shrink-0 shadow-md">
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">{item.title}</div>
              <div className="font-bold text-[#003D52] text-base">{item.text}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#003D52] mb-2">Send us a message</h2>
          <p className="text-sm text-slate-600 mb-6">Fill the form below and our team will reach out within 24 hours.</p>
          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FF2A2A]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#FF2A2A]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D52] mb-2">Message sent!</h3>
              <p className="text-sm text-slate-600">We've received your enquiry and will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Name *</Label><Input value={data.name} onChange={(e) => update('name', e.target.value)} className="h-11" /></div>
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Email *</Label><Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} className="h-11" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Phone</Label><Input value={data.phone} onChange={(e) => update('phone', e.target.value)} className="h-11" /></div>
                <div>
                  <Label className="text-[#003D52] text-sm font-medium mb-2 block">Subject</Label>
                  <Select value={data.subject} onValueChange={(v) => update('subject', v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa Enquiry</SelectItem>
                      <SelectItem value="attestation">Attestation</SelectItem>
                      <SelectItem value="frro">FRRO</SelectItem>
                      <SelectItem value="b2b">B2B Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label className="text-[#003D52] text-sm font-medium mb-2 block">Message *</Label><Textarea rows={5} value={data.message} onChange={(e) => update('message', e.target.value)} /></div>
              <Button type="submit" disabled={submitting} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white h-12 px-7 gap-2 w-full sm:w-auto">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#003D52] mb-2">Our Branches</h2>
          <p className="text-sm text-slate-600 mb-5">Visit us in person at any of our offices across India.</p>
          <div className="space-y-4">
            {offices.map(o => (
              <div key={o.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#FF2A2A]/40 transition-all">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#FF2A2A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#003D52]">{o.city}</h3>
                    <p className="text-sm text-slate-600 leading-snug mb-2">{o.address}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
                      <span>{o.phone}</span>
                      <span>{o.email}</span>
                    </div>
                    {o.map_url && (
                      <a
                        href={o.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF2A2A] hover:gap-1.5 transition-all"
                      >
                        View on Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SimplePage>
  );
};

export default Contact;
