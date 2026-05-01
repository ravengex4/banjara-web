import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';

const configs = {
  countries: {
    title: 'Countries',
    fields: [
      { key: 'name', label: 'Country Name', type: 'text', required: true },
      { key: 'flag_url', label: 'Flag Image URL', type: 'text' },
      { key: 'visa_type', label: 'Visa Type', type: 'text', placeholder: 'Tourist Visa / Business Visa' },
      { key: 'processing_time', label: 'Processing Time', type: 'text', placeholder: '4 Working days' },
      { key: 'visa_format', label: 'Visa Format', type: 'text', placeholder: 'e-Visa / Stamp Visa' },
      { key: 'price', label: 'Price', type: 'text', placeholder: 'INR 4,700' },
      { key: 'popular', label: 'Mark as Popular', type: 'boolean' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['name', 'visa_type', 'processing_time', 'price', 'popular'],
  },
  testimonials: {
    title: 'Testimonials',
    fields: [
      { key: 'name', label: 'Customer Name', type: 'text', required: true },
      { key: 'location', label: 'City', type: 'text' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'text', label: 'Testimonial Text', type: 'textarea', required: true },
      { key: 'avatar', label: 'Avatar Initials', type: 'text', placeholder: 'RK' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['name', 'location', 'rating', 'text'],
  },
  blog_posts: {
    title: 'Blog Posts',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'read_time', label: 'Read Time', type: 'text', placeholder: '5 min read' },
      { key: 'image_url', label: 'Cover Image URL', type: 'text' },
      { key: 'published_at', label: 'Published Date', type: 'date' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['title', 'category', 'read_time', 'published_at'],
  },
  offices: {
    title: 'Offices',
    fields: [
      { key: 'city', label: 'City', type: 'text', required: true },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['city', 'address', 'phone', 'email'],
  },
  faqs: {
    title: 'FAQs',
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea', required: true },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['question', 'answer'],
  },
  services: {
    title: 'Services',
    fields: [
      { key: 'title', label: 'Service Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'icon', label: 'Lucide Icon Name', type: 'text', placeholder: 'FileCheck, Globe, Stamp...' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    listColumns: ['title', 'icon', 'description'],
  },
};

const AdminCMS = ({ table }) => {
  const config = configs[table];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {} for new, row for edit
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [table]);

  const startNew = () => {
    const empty = {};
    config.fields.forEach(f => { empty[f.key] = f.type === 'boolean' ? false : f.type === 'number' ? 0 : ''; });
    setEditing(empty);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...editing };
    // Clean empty strings to null for date fields
    config.fields.forEach(f => {
      if (f.type === 'date' && payload[f.key] === '') payload[f.key] = null;
      if (f.type === 'number') payload[f.key] = Number(payload[f.key]) || 0;
    });
    let res;
    if (payload.id) {
      const { id, created_at, ...rest } = payload;
      res = await supabase.from(table).update(rest).eq('id', id);
    } else {
      const { id, created_at, ...rest } = payload;
      res = await supabase.from(table).insert(rest);
    }
    setSaving(false);
    if (res.error) { toast({ title: 'Save failed', description: res.error.message }); return; }
    toast({ title: 'Saved' });
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { toast({ title: 'Delete failed', description: error.message }); return; }
    toast({ title: 'Deleted' });
    load();
  };

  const renderCell = (row, key) => {
    const v = row[key];
    if (typeof v === 'boolean') return v ? <span className="text-[#FF2A2A] font-semibold text-xs">YES</span> : <span className="text-slate-400 text-xs">NO</span>;
    if (typeof v === 'string' && v.length > 80) return <div className="max-w-md text-slate-600 text-xs leading-relaxed line-clamp-2">{v}</div>;
    return v ?? '—';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#003D52]">{config.title}</h2>
          <div className="text-sm text-slate-500">{rows.length} total</div>
        </div>
        <Button onClick={startNew} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-2">
          <Plus className="w-4 h-4" /> Add new
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center gap-2 text-slate-600"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">No entries yet. Click "Add new" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  {config.listColumns.map(k => <th key={k} className="px-5 py-3 font-semibold">{k.replace(/_/g, ' ')}</th>)}
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    {config.listColumns.map(k => (
                      <td key={k} className="px-5 py-3 align-top">{renderCell(r, k)}</td>
                    ))}
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="border-slate-300 h-8 px-2.5" onClick={() => setEditing(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2.5" onClick={() => remove(r.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#003D52]">{editing?.id ? `Edit ${config.title}` : `New ${config.title}`}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              {config.fields.map(f => (
                <div key={f.key}>
                  <Label className="text-[#003D52] text-sm font-medium mb-1.5 block">{f.label}{f.required && ' *'}</Label>
                  {f.type === 'textarea' ? (
                    <Textarea value={editing[f.key] || ''} onChange={(e) => setEditing(s => ({ ...s, [f.key]: e.target.value }))} rows={4} placeholder={f.placeholder} />
                  ) : f.type === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <Checkbox checked={!!editing[f.key]} onCheckedChange={(v) => setEditing(s => ({ ...s, [f.key]: !!v }))} />
                      <span className="text-sm text-slate-600">{editing[f.key] ? 'Yes' : 'No'}</span>
                    </div>
                  ) : (
                    <Input
                      type={f.type}
                      value={editing[f.key] ?? ''}
                      onChange={(e) => setEditing(s => ({ ...s, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      placeholder={f.placeholder}
                      className="h-10"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF2A2A] hover:bg-[#E01F1F] text-white gap-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCMS;
