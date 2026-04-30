import React from 'react';
import { SimplePage } from './PageHeader';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts } from '../mock';
import { Button } from '../components/ui/button';

const Blog = () => (
  <SimplePage title="Travel & Visa Blog" subtitle="Country guides, visa tips, and travel news from our experts." breadcrumb="Blog">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map(post => (
        <article key={post.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#FF2A2A]/40 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="relative h-52 overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#FF2A2A] flex items-center gap-1">
              <Tag className="w-3 h-3" /> {post.category}
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            </div>
            <h3 className="font-bold text-[#003D52] text-lg leading-tight mb-2 group-hover:text-[#FF2A2A] transition-colors">{post.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
            <Button variant="ghost" className="text-[#FF2A2A] hover:bg-[#FF2A2A]/10 hover:text-[#FF2A2A] -ml-3 gap-1 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </article>
      ))}
    </div>
  </SimplePage>
);

export default Blog;
