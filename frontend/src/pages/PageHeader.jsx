import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div className="bg-gradient-to-br from-[#003D52] via-[#005C75] to-[#003D52] py-16 md:py-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00C2E6]/10 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#FF2A2A]/10 blur-3xl" />
    <div className="relative max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
        <Link to="/" className="hover:text-[#00C2E6]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#00C2E6]">{breadcrumb || title}</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">{title}</h1>
      {subtitle && <p className="text-slate-200 max-w-2xl text-base md:text-lg">{subtitle}</p>}
    </div>
  </div>
);

export const SimplePage = ({ title, subtitle, breadcrumb, children }) => (
  <Layout>
    <PageHeader title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
    <div className="max-w-7xl mx-auto px-6 py-16">{children}</div>
  </Layout>
);

export default PageHeader;
