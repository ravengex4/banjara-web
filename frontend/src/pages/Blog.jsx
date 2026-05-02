import React, { useEffect } from 'react';
import { SimplePage } from './PageHeader';
import { Calendar, Clock, ArrowRight, Tag, Loader2, CheckCircle2 } from 'lucide-react';
import { useTable } from '../lib/useTable';
import { Button } from '../components/ui/button';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const dummyBlogs = [
  { id: 'd1', title: 'How to Get a UAE Tourist Visa in 24 Hours', excerpt: 'Looking to visit Dubai or Abu Dhabi? Here is our comprehensive guide on getting your eVisa approved within 24 hours.', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', category: 'Visa Guide', published_at: new Date().toISOString(), read_time: '5 min' },
  { id: 'd2', title: 'Top 10 Destinations for Indian Travelers in 2026', excerpt: 'From Vietnam to Kazakhstan, explore the trending visa-free and eVisa destinations for Indian passport holders.', image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592', category: 'Travel Tips', published_at: new Date().toISOString(), read_time: '8 min' },
  { id: 'd3', title: 'Understanding the Schengen Visa Process', excerpt: 'Navigating European visas can be tricky. We break down the documents, fees, and appointment system for your next Euro trip.', image_url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', category: 'Europe', published_at: new Date().toISOString(), read_time: '12 min' }
];

const completedVisas = [
  { id: 1, country: 'USA', type: 'B1/B2 Visa', img: 'https://images.unsplash.com/photo-1550184658-c2a8a17bfc63?w=800&q=80' },
  { id: 2, country: 'Schengen', type: 'Tourist Visa', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80' },
  { id: 3, country: 'UK', type: 'Standard Visitor', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80' },
  { id: 4, country: 'Australia', type: 'Subclass 600', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80' },
  { id: 5, country: 'UAE', type: 'Tourist eVisa', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' }
];

const Blog = () => {
  const { data: dbPosts, loading } = useTable('blog_posts', { orderBy: 'published_at', ascending: false });
  const blogPosts = dbPosts.length > 0 ? dbPosts : dummyBlogs;
  
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  const fmtDate = (s) => {
    if (!s) return '';
    try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }); }
    catch { return s; }
  };

  return (
    <SimplePage title="Travel & Visa Blog" subtitle="Country guides, visa tips, and travel news from our experts." breadcrumb="Blog">
      <SEO
        title="Visa & Travel Blog — Country Guides, Tips, News"
        description="Expert visa guides for India travelers — Dubai visa in 24 hours, Schengen documents, USA interview prep, embassy updates and travel tips."
        path="/blog"
        jsonLd={[orgSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])]}
      />
      
      {/* Completed Visas Gallery Carousel */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-[#FF2A2A]" />
          <h2 className="text-2xl font-bold text-[#003D52]">Recently Approved Visas</h2>
        </div>
        <div className="overflow-hidden bg-slate-50 rounded-2xl border border-slate-200 p-6" ref={emblaRef}>
          <div className="flex -ml-4">
            {completedVisas.map((visa) => (
              <div key={visa.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                <div className="relative h-64 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                  <img src={visa.img} alt={`${visa.country} Approved Visa`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003D52]/90 via-[#003D52]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-[#00C2E6]" />
                      <span className="text-xs font-semibold text-[#00C2E6] uppercase tracking-wider">Approved</span>
                    </div>
                    <h3 className="font-bold text-lg">{visa.country}</h3>
                    <p className="text-sm opacity-90">{visa.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-slate-600"><Loader2 className="w-5 h-5 animate-spin" /> Loading posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <article key={post.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#FF2A2A]/40 hover:shadow-xl hover:-translate-y-1 transition-all">
              {post.image_url && (
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  {post.category && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#FF2A2A] flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {post.category}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(post.published_at)}</span>
                  {post.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}</span>}
                </div>
                <h3 className="font-bold text-[#003D52] text-lg leading-tight mb-2 group-hover:text-[#FF2A2A] transition-colors">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>}
                <Button variant="ghost" className="text-[#FF2A2A] hover:bg-[#FF2A2A]/10 hover:text-[#FF2A2A] -ml-3 gap-1 group-hover:gap-2 transition-all" aria-label={`Read more about ${post.title}`}>
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </SimplePage>
  );
};

export default Blog;
