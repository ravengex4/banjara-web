import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';

const statusOptions = ['Submitted', 'Documents Verification', 'Embassy Submission', 'Under Review', 'Visa Approved', 'Visa Rejected', 'On Hold'];

const statusColor = (s) => {
  if (s === 'Visa Approved') return 'bg-green-100 text-green-700';
  if (s === 'Visa Rejected') return 'bg-red-100 text-red-700';
  if (s === 'On Hold') return 'bg-amber-100 text-amber-700';
  return 'bg-[#00C2E6]/15 text-[#005C75]';
};

const AdminApplications = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('visa_applications').select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => {
    const matchesSearch = !search || [r.reference_number, r.full_name, r.email, r.country].some(v => (v || '').toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id, newStatus, currentRow) => {
    const timeline = (currentRow.status_timeline || []).map(t => {
      if (t.label === newStatus || (newStatus === 'Documents Verification' && t.label === 'Documents Verification')) {
        return { ...t, completed: true, current: false, date: new Date().toISOString().slice(0, 10) };
      }
      return t;
    });
    const { error } = await supabase.from('visa_applications').update({ status: newStatus, status_timeline: timeline, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast({ title: 'Update failed', description: error.message }); return; }
    toast({ title: 'Status updated' });
    load();
    if (selected?.id === id) setSelected({ ...selected, status: newStatus, status_timeline: timeline });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference, name, email, country..." className="pl-9 h-10 max-w-md" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-10 w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-slate-600 self-center">{filtered.length} of {rows.length}</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center gap-2 text-slate-600"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">No applications match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Country / Type</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-[#003D52]">{r.reference_number}</td>
                    <td className="px-5 py-3">{r.full_name}</td>
                    <td className="px-5 py-3"><div className="font-medium">{r.country}</div><div className="text-xs text-slate-500">{r.visa_type}</div></td>
                    <td className="px-5 py-3 text-xs text-slate-600"><div>{r.email}</div><div>{r.phone}</div></td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span></td>
                    <td className="px-5 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="outline" className="border-slate-300" onClick={() => setSelected(r)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#003D52]">{selected?.reference_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs text-slate-500">Applicant</div><div className="font-medium">{selected.full_name}</div></div>
                <div><div className="text-xs text-slate-500">Email</div><div className="font-medium">{selected.email}</div></div>
                <div><div className="text-xs text-slate-500">Phone</div><div className="font-medium">{selected.phone}</div></div>
                <div><div className="text-xs text-slate-500">Nationality</div><div className="font-medium">{selected.nationality}</div></div>
                <div><div className="text-xs text-slate-500">Country</div><div className="font-medium">{selected.country}</div></div>
                <div><div className="text-xs text-slate-500">Visa Type</div><div className="font-medium">{selected.visa_type}</div></div>
                <div><div className="text-xs text-slate-500">Date of Birth</div><div className="font-medium">{selected.date_of_birth || '—'}</div></div>
                <div><div className="text-xs text-slate-500">Passport</div><div className="font-medium">{selected.passport_number || '—'}</div></div>
              </div>
              {selected.notes && (
                <div><div className="text-xs text-slate-500">Notes</div><div className="text-sm">{selected.notes}</div></div>
              )}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 mb-2">Update status</div>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v, selected)}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
