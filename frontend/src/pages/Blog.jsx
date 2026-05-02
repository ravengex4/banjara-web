import React from 'react';
import { SimplePage } from './PageHeader';
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { useTable } from '../lib/useTable';
import { Button } from '../components/ui/button';
import { SEO, orgSchema, breadcrumbSchema } from '../lib/SEO';

const dummyBlogs = [
  { id: 'd1', title: 'How to Get a UAE Tourist Visa in 24 Hours', excerpt: 'Looking to visit Dubai or Abu Dhabi? Here is our comprehensive guide on getting your eVisa approved within 24 hours.', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', category: 'Visa Guide', published_at: new Date().toISOString(), read_time: '5 min' },
  { id: 'd2', title: 'Top 10 Destinations for Indian Travelers in 2026', excerpt: 'From Vietnam to Kazakhstan, explore the trending visa-free and eVisa destinations for Indian passport holders.', image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592', category: 'Travel Tips', published_at: new Date().toISOString(), read_time: '8 min' },
  { id: 'd3', title: 'Understanding the Schengen Visa Process', excerpt: 'Navigating European visas can be tricky. We break down the documents, fees, and appointment system for your next Euro trip.', image_url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', category: 'Europe', published_at: new Date().toISOString(), read_time: '12 min' }
];

const Blog = () => {
  const { data: dbPosts, loading } = useTable('blog_posts', { orderBy: 'published_at', ascending: false });
  const blogPosts = dbPosts.length > 0 ? dbPosts : dummyBlogs;

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
