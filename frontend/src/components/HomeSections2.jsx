import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useTable } from '../lib/useTable';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Phone, Mail } from 'lucide-react';

export const Testimonials = () => {
  const { data: testimonials } = useTable('testimonials');
  const [index, setIndex] = useState(0);
  const visible = 3;
  const max = Math.max(0, testimonials.length - visible);

  const next = () => setIndex(i => Math.min(i + 1, max));
  const prev = () => setIndex(i => Math.max(i - 1, 0));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-3">Testimonials</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003D52] tracking-tight mb-3">
              What Our Travelers Say
            </h2>
            <p className="text-slate-600 max-w-xl">
              Real stories from real travelers who trusted Banjara for their visa journey.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={prev} disabled={index === 0} variant="outline" size="icon" aria-label="Previous testimonial" className="rounded-full border-slate-300 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button onClick={next} disabled={index === max} variant="outline" size="icon" aria-label="Next testimonial" className="rounded-full border-slate-300 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${index} * (100% / 3 + 1.5rem / 3)))` }}
          >
            {testimonials.map(t => (
              <div
                key={t.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 relative"
              >
                <Quote className="absolute top-5 right-5 w-8 h-8 text-[#FF2A2A]/15" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#00C2E6] text-[#00C2E6]" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003D52] to-[#00A6D6] text-white flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#003D52] text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ = () => {
  const { data: faqs } = useTable('faqs');
  return (
  <section className="py-20 bg-slate-50">
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-3">FAQ</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#003D52] tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600">
          Got questions? We've got answers. Here are the most common queries from our travelers.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map(faq => (
          <AccordionItem
            key={faq.id}
            value={`item-${faq.id}`}
            className="bg-white border border-slate-200 rounded-xl px-5 data-[state=open]:border-[#FF2A2A]/40 data-[state=open]:shadow-md"
          >
            <AccordionTrigger className="text-left text-[#003D52] font-semibold hover:no-underline py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
  );
};

export const CTA = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003D52] via-[#005C75] to-[#003D52] p-10 md:p-14">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#00C2E6]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FF2A2A]/20 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Plane className="w-3.5 h-3.5 text-[#00C2E6] -rotate-45" />
              <span className="text-xs font-medium text-white">Ready to fly?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Start Your Visa Application Today
            </h2>
            <p className="text-slate-200 leading-relaxed mb-6 max-w-md">
              Get expert guidance from India's most trusted visa consultancy. Free document review on every application.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/apply">
                <Button className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white px-7 h-12 font-semibold gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+919959940008" className="inline-flex items-center justify-center bg-white text-[#003D52] hover:bg-[#BFEAF7] h-12 px-7 rounded-md font-semibold transition-colors gap-2">
                  <Phone className="w-4 h-4" /> Call Expert
                </a>
                <a href="mailto:banjaratravel@gmail.com" className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 h-12 px-7 rounded-md font-semibold transition-colors gap-2">
                  <Mail className="w-4 h-4" /> Email Us
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1686278530308-1e6ef38b5ed6"
              alt="Airplane in sky"
              className="rounded-2xl shadow-2xl h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
