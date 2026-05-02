import { Search, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#003D52] via-[#00688A] to-[#00A6D6]">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#00C2E6] blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FF2A2A] blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><path d=%22M30 30m-2 0a2 2 0 1 1 4 0 2 2 0 1 1-4 0%22 fill=%22%23ffffff%22 fill-opacity=%220.05%22/></svg>')] opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-[#00C2E6]" />
              <span className="text-xs font-medium tracking-wide">India's Most Trusted Visa Consultancy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 tracking-tight">
              Your Visa, <span className="text-[#00C2E6]">Simplified</span>.
              <br />
              For 150+ Countries.
            </h1>
              <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl">
                From Tourist to Business, e-Visa to Stamp Visa — BanjaraTravels handles the paperwork while you plan the journey. Real-time tracking, expert review, on-time delivery.
              </p>

              {/* CTA Button */}
              <div className="mt-8">
                <Link to="/apply">
                  <Button className="h-14 px-10 bg-[#FF2A2A] hover:bg-[#E01F1F] text-white text-lg font-bold rounded-xl gap-3 shadow-xl shadow-[#FF2A2A]/30 transition-all hover:-translate-y-1">
                    <Search className="w-5 h-5" />
                    Search Visa Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-[#00C2E6]/20" />
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-[#FF2A2A]/20" />
                <img
                  src="https://images.unsplash.com/photo-1655722725332-9925c96dd627"
                  alt="Passport with visa stamps"
                  className="relative rounded-3xl shadow-2xl w-full h-[480px] object-cover"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
