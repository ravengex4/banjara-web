import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, MessageSquare, Briefcase, Mail, TrendingUp, Loader2 } from 'lucide-react';

const Stat = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
    <div>
      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</div>
      <div className="text-3xl font-bold text-[#003D52]">{value}</div>
    </div>
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

const AdminOverview = () => {
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tables = ['visa_applications', 'contact_submissions', 'b2b_registrations', 'newsletter_subscribers'];
      const results = await Promise.all(tables.map(t => supabase.from(t).select('*', { count: 'exact', head: true })));
      setCounts({
        applications: results[0].count || 0,
        contacts: results[1].count || 0,
        b2b: results[2].count || 0,
        newsletter: results[3].count || 0,
      });
      const { data } = await supabase
        .from('visa_applications')
        .select('reference_number, full_name, country, visa_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecent(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center gap-2 text-slate-600"><Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat icon={FileText} label="Visa Applications" value={counts.applications} color="text-[#FF2A2A]" bg="bg-[#FF2A2A]/10" />
        <Stat icon={MessageSquare} label="Contact Inquiries" value={counts.contacts} color="text-[#00A6D6]" bg="bg-[#00A6D6]/10" />
        <Stat icon={Briefcase} label="B2B Registrations" value={counts.b2b} color="text-[#00C2E6]" bg="bg-[#00C2E6]/10" />
        <Stat icon={Mail} label="Newsletter Subs" value={counts.newsletter} color="text-[#003D52]" bg="bg-[#003D52]/10" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-[#FF2A2A]" />
          <h2 className="font-bold text-[#003D52] text-lg">Recent Applications</h2>
        </div>
        {recent.length === 0 ? (
          <div className="text-sm text-slate-500 py-6 text-center">No applications yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3 pr-4 font-semibold">Reference</th>
                  <th className="py-3 pr-4 font-semibold">Applicant</th>
                  <th className="py-3 pr-4 font-semibold">Country</th>
                  <th className="py-3 pr-4 font-semibold">Visa Type</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.reference_number} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-semibold text-[#003D52]">{r.reference_number}</td>
                    <td className="py-3 pr-4">{r.full_name}</td>
                    <td className="py-3 pr-4">{r.country}</td>
                    <td className="py-3 pr-4">{r.visa_type}</td>
                    <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-full bg-[#00C2E6]/15 text-[#005C75] text-xs font-semibold">{r.status}</span></td>
                    <td className="py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
