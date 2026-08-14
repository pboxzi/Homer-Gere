import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Crown, CheckCircle, XCircle, Clock, Ban, Edit, Eye, Plus,
  Trash2, Search, Filter, X, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { type AdminSection } from '../../data/adminData';
import { useAdmin } from '../../context/AdminContext';

type MemberStatus = 'active' | 'suspended' | 'pending';
type ApplicationStatus = 'pending' | 'approved' | 'declined';
type ExperienceAvailability = 'available' | 'limited' | 'unavailable';
type ExperienceRequestStatus = 'pending' | 'approved' | 'declined' | 'completed';

const Section: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }> = ({
  title, subtitle, action, children,
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-[#1C1917]">{title}</h3>
        {subtitle && <p className="text-xs text-[#57534E] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

const StatusBadge: React.FC<{ status: string; variant?: 'status' | 'availability' }> = ({ status, variant = 'status' }) => {
  const styles: Record<string, string> = variant === 'status'
    ? {
        active: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
        suspended: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
        pending: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
        approved: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
        declined: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
        completed: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
        draft: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
        archived: 'bg-[#57534E]/10 text-[#57534E] border border-[#57534E]/15',
      }
    : {
        available: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
        limited: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
        unavailable: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
      };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold w-fit ${styles[status] || 'bg-[#57534E]/10 text-[#57534E] border border-[#57534E]/15'}`}>
      {status}
    </span>
  );
};

const ConfirmDialog: React.FC<{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }> = ({
  open, title, message, onConfirm, onCancel,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl border border-[#A6852F]/10 p-6 w-full max-w-sm shadow-xl shadow-[#A6852F]/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#DC2626]/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            </div>
            <h4 className="text-sm font-medium text-[#1C1917]">{title}</h4>
          </div>
          <p className="text-xs text-[#57534E] mb-5">{message}</p>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onCancel} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#DC2626] hover:bg-[#DC2626]/90 transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ViewModal: React.FC<{
  open: boolean;
  title: string;
  fields: { label: string; value: string }[];
  onClose: () => void;
}> = ({ open, title, fields, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl border border-[#A6852F]/10 p-6 w-full max-w-md shadow-xl shadow-[#A6852F]/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-medium text-[#1C1917]">{title}</h4>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">{f.label}</span>
                <span className="text-xs text-[#1C1917]">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ────────────────────────────────────────────────────────────
// Members Sub-Section
// ────────────────────────────────────────────────────────────

const MembersSection: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMember, setViewMember] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({ name: '', email: '', membership: 'Silver', status: 'active' as MemberStatus });
  const [editData, setEditData] = useState({ name: '', email: '', membership: '', status: '' as MemberStatus | '' });

  const filtered = useMemo(() => {
    let result = members;
    if (statusFilter !== 'all') result = result.filter((m) => m.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    return result;
  }, [members, search, statusFilter]);

  const handleAdd = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    addMember({ ...newMember, joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), lastActive: 'Just now' });
    setNewMember({ name: '', email: '', membership: 'Silver', status: 'active' });
    setShowAddForm(false);
  };

  const handleStartEdit = (m: typeof members[0]) => {
    setEditingId(m.id);
    setEditData({ name: m.name, email: m.email, membership: m.membership, status: m.status });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateMember(editingId, { name: editData.name, email: editData.email, membership: editData.membership, status: editData.status as MemberStatus });
    setEditingId(null);
  };

  const handleToggleSuspend = (m: typeof members[0]) => {
    updateMember(m.id, { status: m.status === 'active' ? 'suspended' : 'active' });
  };

  const viewedMember = viewMember ? members.find((m) => m.id === viewMember) : null;

  return (
    <Section
      title="Members"
      subtitle={`${members.length} total members`}
      action={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Member
        </button>
      }
    >
      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <select
                  value={newMember.membership}
                  onChange={(e) => setNewMember({ ...newMember, membership: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({ ...newMember, status: e.target.value as MemberStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                  Add Member
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E]" />
          <input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')}
          className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#A6852F]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <div className="grid grid-cols-[1fr_120px_100px_100px_80px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Member</span><span>Membership</span><span>Status</span><span>Joined</span><span>Last Active</span><span>Actions</span>
          </div>
          {filtered.map((m) => (
            <div key={m.id} className="grid grid-cols-[1fr_120px_100px_100px_80px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              {editingId === m.id ? (
                <>
                  <div className="space-y-1">
                    <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-2 py-1 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                    <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-2 py-1 rounded-lg border border-[#E8E5DF]/60 bg-white text-[10px] text-[#57534E] focus:outline-none focus:border-[#A6852F]/40" />
                  </div>
                  <select value={editData.membership} onChange={(e) => setEditData({ ...editData, membership: e.target.value })} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="None">None</option><option value="Silver">Silver</option><option value="Gold">Gold</option><option value="Platinum">Platinum</option></select>
                  <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as MemberStatus })} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select>
                  <span className="text-xs text-[#57534E]">{m.joinDate}</span>
                  <span className="text-[10px] text-[#57534E]">{m.lastActive}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={handleSaveEdit} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </>
              ) : (
                <>
                  <div><p className="text-sm text-[#1C1917]">{m.name}</p><p className="text-[10px] text-[#57534E]">{m.email}</p></div>
                  <span className="text-xs text-[#57534E]">{m.membership}</span>
                  <StatusBadge status={m.status} />
                  <span className="text-xs text-[#57534E]">{m.joinDate}</span>
                  <span className="text-[10px] text-[#57534E]">{m.lastActive}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewMember(m.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleStartEdit(m)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleToggleSuspend(m)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${m.status === 'active' ? 'text-[#DC2626] hover:bg-[#DC2626]/10' : 'text-[#16A34A] hover:bg-[#16A34A]/10'}`}>{m.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => setDeleteId(m.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#E8E5DF]/20">
          {filtered.map((m) => (
            <div key={m.id} className="p-4 space-y-3">
              {editingId === m.id ? (
                <div className="space-y-2">
                  <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                  <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={editData.membership} onChange={(e) => setEditData({ ...editData, membership: e.target.value })} className="px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="None">None</option><option value="Silver">Silver</option><option value="Gold">Gold</option><option value="Platinum">Platinum</option></select>
                    <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as MemberStatus })} className="px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveEdit} className="flex-1 py-1.5 rounded-lg bg-[#16A34A] text-white text-xs font-medium cursor-pointer">Save</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm font-medium text-[#1C1917]">{m.name}</p><p className="text-[11px] text-[#57534E]">{m.email}</p></div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#57534E]">
                    <span>{m.membership}</span><span className="text-[#E8E5DF]">·</span><span>{m.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1 pt-1 border-t border-[#E8E5DF]/20">
                    <button onClick={() => setViewMember(m.id)} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /> View</button>
                    <button onClick={() => handleStartEdit(m)} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={() => handleToggleSuspend(m)} className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer ${m.status === 'active' ? 'text-[#DC2626] hover:bg-[#DC2626]/10' : 'text-[#16A34A] hover:bg-[#16A34A]/10'}`}>{m.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => setDeleteId(m.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={() => { if (deleteId) { deleteMember(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />

      <ViewModal
        open={!!viewMember}
        title="Member Details"
        onClose={() => setViewMember(null)}
        fields={
          viewedMember
            ? [
                { label: 'Name', value: viewedMember.name },
                { label: 'Email', value: viewedMember.email },
                { label: 'Membership', value: viewedMember.membership },
                { label: 'Status', value: viewedMember.status },
                { label: 'Joined', value: viewedMember.joinDate },
                { label: 'Last Active', value: viewedMember.lastActive },
              ]
            : []
        }
      />
    </Section>
  );
};

// ────────────────────────────────────────────────────────────
// Plans Sub-Section
// ────────────────────────────────────────────────────────────

const PlansSection: React.FC = () => {
  const { plans, addPlan, updatePlan, deletePlan } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newPlan, setNewPlan] = useState({ name: '', price: 0, period: 'year', status: 'active' as 'active' | 'draft' | 'archived' });
  const [editData, setEditData] = useState({ name: '', price: 0, period: '', status: '' as 'active' | 'draft' | 'archived' | '' });

  const handleAdd = () => {
    if (!newPlan.name.trim() || newPlan.price <= 0) return;
    addPlan({ ...newPlan, members: 0 });
    setNewPlan({ name: '', price: 0, period: 'year', status: 'active' });
    setShowAddForm(false);
  };

  const handleStartEdit = (p: typeof plans[0]) => {
    setEditingId(p.id);
    setEditData({ name: p.name, price: p.price, period: p.period, status: p.status });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updatePlan(editingId, { name: editData.name, price: editData.price, period: editData.period, status: editData.status as 'active' | 'draft' | 'archived' });
    setEditingId(null);
  };

  return (
    <Section
      title="Membership Plans"
      subtitle={`${plans.length} plans`}
      action={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Plan
        </button>
      }
    >
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  placeholder="Plan name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newPlan.price || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <select
                  value={newPlan.period}
                  onChange={(e) => setNewPlan({ ...newPlan, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="lifetime">Lifetime</option>
                </select>
                <select
                  value={newPlan.status}
                  onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                  Add Plan
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-[#A6852F]/10 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#A6852F]/20 transition-all duration-300">
            {editingId === plan.id ? (
              <div className="space-y-3">
                <input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  type="number"
                  value={editData.price || ''}
                  onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                />
                <select
                  value={editData.period}
                  onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="lifetime">Lifetime</option>
                </select>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#1C1917]">{plan.name}</h4>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="text-2xl font-medium text-[#1C1917]">
                  ${plan.price}<span className="text-xs text-[#57534E] font-normal">/{plan.period}</span>
                </p>
                <p className="text-[11px] text-[#57534E] mt-1">{plan.members} members</p>
                <div className="flex items-center gap-1 mt-3">
                  <button onClick={() => handleStartEdit(plan)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(plan.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Plan"
        message="Are you sure you want to delete this membership plan? Members currently on this plan will be affected."
        onConfirm={() => { if (deleteId) { deletePlan(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />
    </Section>
  );
};

// ────────────────────────────────────────────────────────────
// Applications Sub-Section
// ────────────────────────────────────────────────────────────

const ApplicationsSection: React.FC = () => {
  const { applications, updateApplication, deleteApplication } = useAdmin();
  const [filterTab, setFilterTab] = useState<ApplicationStatus | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filterTab === 'all') return applications;
    return applications.filter((a) => a.status === filterTab);
  }, [applications, filterTab]);

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const tabs: { key: ApplicationStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'declined', label: 'Declined' },
  ];

  const viewedApp = viewId ? applications.find((a) => a.id === viewId) : null;

  return (
    <Section
      title="Applications"
      subtitle={`${applications.length} total applications`}
      action={
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">
          {pendingCount} pending
        </span>
      }
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#E8E5DF]/40">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3 py-2 text-[10px] font-medium uppercase tracking-[0.05em] transition-colors cursor-pointer ${
              filterTab === tab.key
                ? 'text-[#A6852F] border-b-2 border-[#A6852F]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Applicant</span><span>Plan</span><span>Date</span><span>Status</span><span>Actions</span>
          </div>
          {filtered.map((a) => (
            <div key={a.id} className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              <div><p className="text-sm text-[#1C1917]">{a.name}</p><p className="text-[10px] text-[#57534E]">{a.email}</p></div>
              <span className="text-xs text-[#57534E]">{a.plan}</span>
              <span className="text-xs text-[#57534E]">{a.date}</span>
              <StatusBadge status={a.status} />
              <div className="flex items-center gap-1">
                {a.status === 'pending' && (<>
                  <button onClick={() => updateApplication(a.id, { status: 'approved' })} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                  <button onClick={() => updateApplication(a.id, { status: 'declined' })} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer" title="Decline"><XCircle className="w-3.5 h-3.5" /></button>
                </>)}
                <button onClick={() => setViewId(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#E8E5DF]/20">
          {filtered.map((a) => (
            <div key={a.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-[#1C1917]">{a.name}</p><p className="text-[11px] text-[#57534E]">{a.email}</p></div>
                <StatusBadge status={a.status} />
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#57534E]">
                <span>{a.plan}</span><span className="text-[#E8E5DF]">·</span><span>{a.date}</span>
              </div>
              <div className="flex items-center gap-1 pt-2 border-t border-[#E8E5DF]/20">
                {a.status === 'pending' && (<>
                  <button onClick={() => updateApplication(a.id, { status: 'approved' })} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                  <button onClick={() => updateApplication(a.id, { status: 'declined' })} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /> Decline</button>
                </>)}
                <button onClick={() => setViewId(a.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => setDeleteId(a.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={() => { if (deleteId) { deleteApplication(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />

      <ViewModal
        open={!!viewId}
        title="Application Details"
        onClose={() => setViewId(null)}
        fields={
          viewedApp
            ? [
                { label: 'Name', value: viewedApp.name },
                { label: 'Email', value: viewedApp.email },
                { label: 'Plan', value: viewedApp.plan },
                { label: 'Date', value: viewedApp.date },
                { label: 'Status', value: viewedApp.status },
              ]
            : []
        }
      />
    </Section>
  );
};

// ────────────────────────────────────────────────────────────
// Experiences Sub-Section
// ────────────────────────────────────────────────────────────

const ExperiencesSection: React.FC = () => {
  const { experiences, addExperience, updateExperience, deleteExperience } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newExp, setNewExp] = useState({ title: '', type: '', price: '', availability: 'available' as ExperienceAvailability });
  const [editData, setEditData] = useState({ title: '', type: '', price: '', availability: '' as ExperienceAvailability | '' });

  const handleAdd = () => {
    if (!newExp.title.trim() || !newExp.price.trim()) return;
    addExperience({ ...newExp, requests: 0 });
    setNewExp({ title: '', type: '', price: '', availability: 'available' });
    setShowAddForm(false);
  };

  const handleStartEdit = (e: typeof experiences[0]) => {
    setEditingId(e.id);
    setEditData({ title: e.title, type: e.type, price: e.price, availability: e.availability });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateExperience(editingId, { title: editData.title, type: editData.type, price: editData.price, availability: editData.availability as ExperienceAvailability });
    setEditingId(null);
  };

  return (
    <Section
      title="Experiences"
      subtitle={`${experiences.length} experiences`}
      action={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      }
    >
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  placeholder="Title"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  placeholder="Type (e.g. meet-and-greet)"
                  value={newExp.type}
                  onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  placeholder="Price (e.g. $500)"
                  value={newExp.price}
                  onChange={(e) => setNewExp({ ...newExp, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40"
                />
                <select
                  value={newExp.availability}
                  onChange={(e) => setNewExp({ ...newExp, availability: e.target.value as ExperienceAvailability })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                  Add Experience
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-[#16A34A]/10 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#16A34A]/20 transition-all duration-300">
            {editingId === exp.id ? (
              <div className="space-y-3">
                <input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  value={editData.type}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                />
                <input
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                />
                <select
                  value={editData.availability}
                  onChange={(e) => setEditData({ ...editData, availability: e.target.value as ExperienceAvailability })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#1C1917]">{exp.title}</h4>
                  <StatusBadge status={exp.availability} variant="availability" />
                </div>
                <p className="text-xs text-[#57534E]">{exp.type}</p>
                <p className="text-sm font-medium text-[#1C1917] mt-1">{exp.price}</p>
                <p className="text-[11px] text-[#57534E] mt-1">{exp.requests} requests</p>
                <div className="flex items-center gap-1 mt-3">
                  <button onClick={() => handleStartEdit(exp)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(exp.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? Pending requests will be affected."
        onConfirm={() => { if (deleteId) { deleteExperience(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />
    </Section>
  );
};

// ────────────────────────────────────────────────────────────
// Experience Requests Sub-Section
// ────────────────────────────────────────────────────────────

const ExperienceRequestsSection: React.FC = () => {
  const { experienceRequests, experiences, updateExperience, updateExperienceRequest } = useAdmin();
  const [filterTab, setFilterTab] = useState<ExperienceRequestStatus | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filterTab === 'all') return experienceRequests;
    return experienceRequests.filter((r) => r.status === filterTab);
  }, [experienceRequests, filterTab]);

  const pendingCount = experienceRequests.filter((r) => r.status === 'pending').length;

  const tabs: { key: ExperienceRequestStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'declined', label: 'Declined' },
    { key: 'completed', label: 'Completed' },
  ];

  const handleApprove = (id: string) => {
    const req = experienceRequests.find((r) => r.id === id);
    if (!req) return;
    const exp = experiences.find((e) => req.experience.toLowerCase().includes(e.title.toLowerCase()));
    if (exp) {
      updateExperience(exp.id, { requests: exp.requests + 1 });
    }
    updateExperienceRequest(id, 'approved');
  };

  const handleDecline = (id: string) => {
    updateExperienceRequest(id, 'declined');
  };

  const viewedReq = viewId ? experienceRequests.find((r) => r.id === viewId) : null;

  return (
    <Section
      title="Experience Requests"
      subtitle={`${experienceRequests.length} total requests`}
      action={
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">
          {pendingCount} pending
        </span>
      }
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#E8E5DF]/40">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3 py-2 text-[10px] font-medium uppercase tracking-[0.05em] transition-colors cursor-pointer ${
              filterTab === tab.key
                ? 'text-[#A6852F] border-b-2 border-[#A6852F]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1fr_1fr_100px_100px_140px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Requester</span><span>Experience</span><span>Date</span><span>Status</span><span>Actions</span>
          </div>
          {filtered.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_1fr_100px_100px_140px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              <div><p className="text-sm text-[#1C1917]">{r.requester}</p></div>
              <span className="text-xs text-[#57534E] truncate">{r.experience}</span>
              <span className="text-xs text-[#57534E]">{r.date}</span>
              <StatusBadge status={r.status} />
              <div className="flex items-center gap-1">
                {r.status === 'pending' && (<>
                  <button onClick={() => handleApprove(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDecline(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer" title="Decline"><XCircle className="w-3.5 h-3.5" /></button>
                </>)}
                <button onClick={() => setViewId(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#E8E5DF]/20">
          {filtered.map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-[#1C1917]">{r.requester}</p>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-[11px] text-[#57534E] truncate">{r.experience}</p>
              <p className="text-[11px] text-[#57534E]">{r.date}</p>
              <div className="flex items-center gap-1 pt-2 border-t border-[#E8E5DF]/20">
                {r.status === 'pending' && (<>
                  <button onClick={() => handleApprove(r.id)} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                  <button onClick={() => handleDecline(r.id)} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /> Decline</button>
                </>)}
                <button onClick={() => setViewId(r.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => setDeleteId(r.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Request"
        message="Are you sure you want to delete this experience request? This action cannot be undone."
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />

      <ViewModal
        open={!!viewId}
        title="Experience Request Details"
        onClose={() => setViewId(null)}
        fields={
          viewedReq
            ? [
                { label: 'Requester', value: viewedReq.requester },
                { label: 'Experience', value: viewedReq.experience },
                { label: 'Date', value: viewedReq.date },
                { label: 'Status', value: viewedReq.status },
              ]
            : []
        }
      />
    </Section>
  );
};

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────

interface AdminCommunityProps {
  activeSection: AdminSection;
}

export const AdminCommunity: React.FC<AdminCommunityProps> = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'members':
        return <MembersSection />;
      case 'plans':
        return <PlansSection />;
      case 'applications':
        return <ApplicationsSection />;
      case 'experiences':
        return <ExperiencesSection />;
      case 'experience-requests':
        return <ExperienceRequestsSection />;
      default:
        return <MembersSection />;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-medium text-[#1C1917] tracking-tight">Community</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage members, membership plans, applications, and experiences.</p>
      </motion.div>

      {renderSection()}
    </div>
  );
};
