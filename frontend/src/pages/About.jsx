import React from 'react';
import { SimplePage } from './PageHeader';
import { Award, Globe, Heart, Target, Users, MapPin } from 'lucide-react';
import { stats } from '../mock';
import { useTable } from '../lib/useTable';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const values = [
  { icon: Heart, title: 'Customer First', text: 'Every visa journey is treated with personal care and dedicated support.' },
  { icon: Target, title: 'Reliability', text: '98% success rate built on thorough documentation and expert review.' },
  { icon: Globe, title: 'Global Reach', text: '150+ countries covered with up-to-date embassy guidelines.' },
  { icon: Award, title: 'Excellence', text: 'Recognized by leading travel associations for quality service.' },
];

const About = () => {
  const { data: offices } = useTable('offices');
  return (
  <SimplePage
    title="About BanjaraTravels"
    subtitle="India's most trusted visa consultancy and travel documentation partner since 2010."
    breadcrumb="About Us"
  >
    <SEO
      title="About Us"
      description="Learn about BanjaraTravels — India's leading visa consultancy since 2010. 50,000+ visas processed, 150+ countries, 98% success rate."
      path="/about"
      jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
    />
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
      <div>
        <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-3">Our Story</div>
        <h2 className="text-3xl font-bold text-[#003D52] mb-5">15+ Years of Visa Excellence</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Founded in 2010 in the heart of Hyderabad, BanjaraTravels began with a simple mission — to make international travel accessible to every Indian. What started as a small office in Banjara Hills has grown into a nationwide network serving travelers across Tier 1, Tier 2, and Tier 3 cities.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Today, we process over 50,000 visa applications annually for 150+ countries. From individual travelers and corporate clients to B2B partners across India, our team of certified visa consultants ensures every paperwork detail is handled with precision.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Our digital-first approach combines decades of embassy expertise with modern technology — real-time tracking, secure document upload, and personalized expert review on every application.
        </p>
      </div>
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-[#00C2E6]/15" />
        <img
          src="https://images.unsplash.com/photo-1578894381163-e72c17f2d45f"
          alt="Travel documents"
          className="relative rounded-3xl shadow-xl w-full h-[420px] object-cover"
        />
      </div>
    </div>

    <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 mb-20 border border-slate-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="text-4xl font-bold text-[#FF2A2A] mb-1">{s.value}</div>
            <div className="text-sm text-slate-600 uppercase tracking-wider font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-20">
      <div className="text-center mb-10">
        <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-2">Our Values</div>
        <h2 className="text-3xl font-bold text-[#003D52]">What Drives Us Forward</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {values.map((v, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2A2A] to-[#00C2E6] flex items-center justify-center mb-4 shadow-md">
              <v.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#003D52] mb-2">{v.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <div className="text-center mb-10">
        <div className="text-[#FF2A2A] text-sm font-semibold uppercase tracking-wider mb-2">Our Office</div>
        <h2 className="text-3xl font-bold text-[#003D52]">Visit Us</h2>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center hover:border-[#FF2A2A]/40 hover:shadow-lg transition-all">
          <div className="text-[#FF2A2A] text-xs font-semibold uppercase tracking-wider mb-3">Headquarters</div>
          <h3 className="font-bold text-[#003D52] text-2xl mb-4">Hyderabad</h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">Plot No 150, Phase 3, Kamalapuri Colony, Hyderabad 500073</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#003D52]">Phone:</span> +91 99599 40008
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#003D52]">Email:</span> banjaratravel@gmail.com
            </div>
          </div>
          <div className="mt-8">
            <a 
              href="https://maps.app.goo.gl/GaraAwM7jqhts5Pz8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#003D52] text-white px-6 py-3 rounded-full hover:bg-[#002D3D] transition-colors"
            >
              <MapPin className="w-4 h-4" /> View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </SimplePage>
  );
};

export default About;
