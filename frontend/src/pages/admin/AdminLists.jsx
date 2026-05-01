import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const SimpleList = ({ table, columns, title, emptyText }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from(table).select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRows(data || []);
      setLoading(false);
    });
  }, [table]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-[#003D52]">{title}</h2>
        <div className="text-sm text-slate-500">{rows.length} total</div>
      </div>
      {loading ? (
        <div className="p-10 flex items-center gap-2 text-slate-600"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-sm">{emptyText}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200">
                {columns.map(c => <th key={c.key} className="px-5 py-3 font-semibold">{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  {columns.map(c => (
                    <td key={c.key} className="px-5 py-3 align-top">
                      {c.render ? c.render(r) : (r[c.key] || '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminContacts = () => (
  <SimpleList
    table="contact_submissions"
    title="Contact Inquiries"
    emptyText="No contact submissions yet."
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'subject', label: 'Subject' },
      { key: 'message', label: 'Message', render: (r) => <div className="max-w-md text-slate-600 text-xs leading-relaxed line-clamp-3">{r.message}</div> },
      { key: 'created_at', label: 'Received', render: (r) => new Date(r.created_at).toLocaleString() },
    ]}
  />
);

export const AdminB2B = () => (
  <SimpleList
    table="b2b_registrations"
    title="B2B Partner Registrations"
    emptyText="No B2B registrations yet."
    columns={[
      { key: 'agency_name', label: 'Agency' },
      { key: 'contact_person', label: 'Contact' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      { key: 'description', label: 'About', render: (r) => <div className="max-w-xs text-slate-600 text-xs leading-relaxed line-clamp-2">{r.description || '—'}</div> },
      { key: 'created_at', label: 'Submitted', render: (r) => new Date(r.created_at).toLocaleDateString() },
    ]}
  />
);

export const AdminNewsletter = () => (
  <SimpleList
    table="newsletter_subscribers"
    title="Newsletter Subscribers"
    emptyText="No subscribers yet."
    columns={[
      { key: 'email', label: 'Email' },
      { key: 'subscribed_at', label: 'Subscribed', render: (r) => new Date(r.subscribed_at).toLocaleString() },
    ]}
  />
);
