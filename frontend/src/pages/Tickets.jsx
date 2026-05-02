import React, { useState, useEffect } from 'react';
import { SimplePage } from './PageHeader';
import { Plane, MapPin, Calendar, Users, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';
import { useToast } from '../hooks/use-toast';
import { formatDate } from '../lib/utils';
import { useForm as useFormspree } from '@formspree/react';

import { MAJOR_CITIES } from '../lib/constants';

const Tickets = () => {
  const [tripType, setTripType] = useState('One Way');
  const [details, setDetails] = useState({
    from: '',
    to: '',
    departure: '',
    returnDate: '',
    travellers: '1',
    classType: 'Economy'
  });

  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const updateDetails = (k, v) => setDetails(prev => ({ ...prev, [k]: v }));
  
  // Auto-generate message when modal opens
  useEffect(() => {
    if (showModal) {
      const depDate = formatDate(details.departure) || '[Date]';
      const retDate = formatDate(details.returnDate) || '[Date]';
      const msg = `I want a flight ticket from ${details.from || '[City]'} to ${details.to || '[City]'} on ${depDate}.${tripType === 'Round Trip' ? ` Return date: ${retDate}.` : ''} Travellers: ${details.travellers}. Class: ${details.classType}.`;
      setContact(prev => ({ ...prev, message: msg }));
    }
  }, [showModal, details, tripType]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.phone) {
      toast({ title: 'Missing Information', description: 'Please fill all required fields.' });
      return;
    }
    
    // Construct the final message for Formspree
    const depDate = formatDate(details.departure);
    const retDate = formatDate(details.returnDate);
    const finalMessage = `So and so wants ticket from ${details.from} to ${details.to} on ${depDate}\n${tripType === 'Round Trip' ? `Return Date: ${retDate}\n` : ''}Travellers: ${details.travellers}\nClass: ${details.classType}\n\nAdditional Note:\n${contact.message}`;

    setSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/xkoyojnl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'New Flight Ticket Enquiry Received',
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: finalMessage,
          from_city: details.from,
          to_city: details.to,
          departure_date: depDate,
          return_date: retDate,
          travellers: details.travellers,
          class: details.classType
        })
      });

      if (response.ok) {
        toast({ title: 'Enquiry Sent!', description: 'Our team will contact you shortly regarding your ticket enquiry ✈️' });
        setTimeout(() => {
          setShowModal(false);
          setContact({ name: '', email: '', phone: '', message: '' });
        }, 2000);
      } else {
        toast({ title: 'Submission Failed', description: 'Please try again later.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Submission Failed', description: 'Please check your internet connection and try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [activeField, setActiveField] = useState(null);

  const handleCityChange = (field, value) => {
    updateDetails(field, value);
    if (value.trim().length > 0) {
      const filtered = MAJOR_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [field]: filtered }));
      setActiveField(field);
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
      setActiveField(null);
    }
  };

  const selectCity = (field, city) => {
    updateDetails(field, city);
    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setActiveField(null);
  };

  return (
    <SimplePage title="Flight Tickets" subtitle="Expert flight booking assistance for domestic and international travel. Get the best fares with personalized support." breadcrumb="Tickets">
      <SEO
        title="Flight Ticket Enquiry — BanjaraTravels"
        description="Enquire for flight tickets. One way, round trip, and multi-city bookings for domestic and international flights at best prices."
        path="/tickets"
        jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Tickets', path: '/tickets' }])]}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden mb-12">
          {/* Trip Type Selector */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex gap-2 overflow-x-auto">
            {['One Way', 'Round Trip', 'Multi City'].map(type => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${tripType === type ? 'bg-[#003D52] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2 relative">
                <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF2A2A]" /> From
                </Label>
                <Input 
                  placeholder="Departure City" 
                  value={details.from} 
                  onChange={e => handleCityChange('from', e.target.value)}
                  onFocus={() => details.from && handleCityChange('from', details.from)}
                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  className="h-12 text-lg font-medium"
                />
                {activeField === 'from' && suggestions.from.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-1 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {suggestions.from.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity('from', city)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[#003D52] text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00C2E6]" /> To
                </Label>
                <Input 
                  placeholder="Destination City" 
                  value={details.to} 
                  onChange={e => handleCityChange('to', e.target.value)}
                  onFocus={() => details.to && handleCityChange('to', details.to)}
                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  className="h-12 text-lg font-medium"
                />
                {activeField === 'to' && suggestions.to.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-1 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {suggestions.to.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity('to', city)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[#003D52] text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF2A2A]" /> Departure
                </Label>
                <Input 
                  type="date" 
                  value={details.departure} 
                  onChange={e => updateDetails('departure', e.target.value)}
                  className="h-12"
                />
              </div>
              
              {tripType === 'Round Trip' && (
                <div className="space-y-2 transition-all">
                  <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF2A2A]" /> Return
                  </Label>
                  <Input 
                    type="date" 
                    value={details.returnDate} 
                    onChange={e => updateDetails('returnDate', e.target.value)}
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF2A2A]" /> Travellers
                </Label>
                <Select value={details.travellers} onValueChange={v => updateDetails('travellers', v)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n} Traveller{n > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#003D52] font-semibold flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#FF2A2A]" /> Class
                </Label>
                <Select value={details.classType} onValueChange={v => updateDetails('classType', v)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First Class">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={() => {
                if (!details.from || !details.to || !details.departure) {
                  toast({ title: 'Quick Tip', description: 'Fill in travel cities and date to get started!' });
                }
                setShowModal(true);
              }}
              className="w-full h-14 bg-[#FF2A2A] hover:bg-[#E01F1F] text-white text-lg font-bold rounded-2xl gap-2 shadow-lg shadow-[#FF2A2A]/20 transition-all hover:scale-[1.01]"
            >
              Enquire Now <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Best Fares', desc: 'Access to exclusive deals and corporate discounts.' },
            { title: '24/7 Support', desc: 'Personalized assistance for changes and cancellations.' },
            { title: 'Expert Advice', desc: 'Visa-aligned flight bookings for high approval rates.' }
          ].map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FF2A2A] shadow-sm flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#003D52] mb-1">{b.title}</h4>
                <p className="text-sm text-slate-600 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003D52]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-[#003D52] text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Complete Your Enquiry</h3>
                <p className="text-xs text-slate-300 mt-1">Our travel expert will contact you with the best fares.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={onFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Full Name *</Label>
                    <Input 
                      required 
                      name="name"
                      value={contact.name} 
                      onChange={e => setContact(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name" 
                      className="h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Phone Number *</Label>
                      <Input 
                        required 
                        name="phone"
                        value={contact.phone} 
                        onChange={e => setContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91" 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Email *</Label>
                      <Input 
                        required 
                        type="email" 
                        name="email"
                        value={contact.email} 
                        onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com" 
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Message</Label>
                    <Textarea 
                      rows={4} 
                      name="message"
                      value={contact.message} 
                      onChange={e => setContact(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Any specific airlines or timing preferences?"
                      className="resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-12 bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-bold rounded-xl gap-2 mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Confirm Enquiry <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
            </div>
          </div>
        </div>
      )}
    </SimplePage>
  );
};

export default Tickets;
