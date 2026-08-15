import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Crown, CheckCircle, XCircle, Clock, Ban, Edit, Eye, Plus,
  Trash2, Search, Filter, X, AlertTriangle, RotateCcw, ChevronLeft,
  ChevronRight, UserCheck, CreditCard, Sparkles, Shield, Mail,
  Loader2, Download, Copy, RefreshCw, Send, MessageCircle, Check,
} from 'lucide-react';
import { type AdminSection } from '../../data/adminData';
import { useAdmin } from '../../context/AdminContext';
import {
  profilesRepository,
  membershipsRepository,
  membershipPlansRepository,
  auditLogsRepository,
} from '../../lib/repositories';
import { getSupabaseClient } from '../../lib/repositories';
import { formatDate } from '../../utils/formatDate';

type MemberStatus = 'active' | 'suspended' | 'pending';
type ApplicationStatus = 'pending' | 'approved' | 'declined';
type ExperienceAvailability = 'available' | 'limited' | 'unavailable';

const PAGE_SIZE = 10;

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

const ConfirmDialog: React.FC<{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; confirmColor?: string }> = ({
  open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmColor = '#DC2626',
}) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl border border-[#A6852F]/10 p-6 w-full max-w-sm shadow-xl shadow-[#A6852F]/5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${confirmColor}10` }}>
              <AlertTriangle className="w-4 h-4" style={{ color: confirmColor }} />
            </div>
            <h4 className="text-sm font-medium text-[#1C1917]">{title}</h4>
          </div>
          <p className="text-xs text-[#57534E] mb-5">{message}</p>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onCancel} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-colors cursor-pointer" style={{ backgroundColor: confirmColor }}>{confirmLabel}</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ────────────────────────────────────────────────────────────
// Enhanced Member Profile Modal
// ────────────────────────────────────────────────────────────

interface MemberProfileModalProps {
  open: boolean;
  memberId: string | null;
  onClose: () => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onResetPassword: (email: string) => void;
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ open, memberId, onClose, onSuspend, onReactivate, onResetPassword }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'membership' | 'payments' | 'experiences' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [experienceRequests, setExperienceRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !memberId) return;
    const load = async () => {
      setLoading(true);
      try {
        const client = getSupabaseClient();
        const [profileRes, membershipRes, paymentsRes, expRes, auditRes] = await Promise.allSettled([
          client.from('profiles').select('*').eq('id', memberId).single(),
          client.from('memberships').select('*').eq('user_id', memberId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          client.from('payments').select('*').eq('member_id', memberId).order('created_at', { ascending: false }).limit(20),
          client.from('experience_requests').select('*').eq('user_id', memberId).order('created_at', { ascending: false }).limit(20),
          client.from('audit_logs').select('*').eq('user_id', memberId).order('created_at', { ascending: false }).limit(20),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setProfile((profileRes.value as any).data || profileRes.value);
        }
        if (membershipRes.status === 'fulfilled' && membershipRes.value) {
          const mData = (membershipRes.value as any).data || membershipRes.value;
          setMembership(mData);
          if (mData?.plan_id) {
            const planRes = await membershipPlansRepository.getAll();
            const found = planRes.find((p: any) => p.id === mData.plan_id);
            if (found) setPlan(found);
          }
        }
        if (paymentsRes.status === 'fulfilled') setPaymentHistory(((paymentsRes.value as any)?.data) || []);
        if (expRes.status === 'fulfilled') setExperienceRequests(((expRes.value as any)?.data) || []);
        if (auditRes.status === 'fulfilled') setAuditLogs(((auditRes.value as any)?.data) || []);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [open, memberId]);

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: Users },
    { key: 'membership' as const, label: 'Membership', icon: Crown },
    { key: 'payments' as const, label: 'Payments', icon: CreditCard },
    { key: 'experiences' as const, label: 'Experiences', icon: Sparkles },
    { key: 'audit' as const, label: 'Audit', icon: Shield },
  ];

  const formatAuditAction = (action: string) => {
    switch (action) {
      case 'create': return <span className="text-[#16A34A]">Created</span>;
      case 'update': return <span className="text-[#3B82F6]">Updated</span>;
      case 'delete': return <span className="text-[#DC2626]">Deleted</span>;
      case 'approve': return <span className="text-[#16A34A]">Approved</span>;
      case 'reject': return <span className="text-[#DC2626]">Rejected</span>;
      case 'login': return <span className="text-[#8B5CF6]">Login</span>;
      default: return <span className="text-[#57534E]">{action}</span>;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl border border-[#A6852F]/10 w-full max-w-3xl max-h-[85vh] shadow-xl shadow-[#A6852F]/5 flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5DF]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#A6852F]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#A6852F]">{(profile?.first_name || profile?.email || '?').charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#1C1917]">{profile?.first_name || profile?.last_name ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : profile?.email || 'Unknown'}</h4>
                  <p className="text-[11px] text-[#57534E]">{profile?.email || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {profile?.account_status !== 'suspended' ? (
                  <button onClick={() => memberId && onSuspend(memberId)} className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20 transition-colors cursor-pointer">
                    <Ban className="w-3 h-3 inline mr-1" /> Suspend
                  </button>
                ) : (
                  <button onClick={() => memberId && onReactivate(memberId)} className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#16A34A] bg-[#16A34A]/10 hover:bg-[#16A34A]/20 transition-colors cursor-pointer">
                    <RotateCcw className="w-3 h-3 inline mr-1" /> Reactivate
                  </button>
                )}
                <button onClick={() => profile?.email && onResetPassword(profile.email)} className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#57534E] bg-[#F3F1ED] hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  <Mail className="w-3 h-3 inline mr-1" /> Reset Password
                </button>
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-[#E8E5DF]/40">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab.key ? 'text-[#A6852F] border-[#A6852F]' : 'text-[#57534E] border-transparent hover:text-[#1C1917]'
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 text-[#A6852F] animate-spin" />
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Full Name</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.first_name || profile?.last_name ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Email</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.email || '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Role</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1 capitalize">{profile?.role || '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Status</p>
                          <div className="mt-1"><StatusBadge status={profile?.account_status === 'suspended' ? 'suspended' : 'active'} /></div>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Phone</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.phone && profile.phone !== 'N/A' ? profile.phone : '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Country</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.country || '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Joined</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
                        </div>
                        <div className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4" style={{ boxShadow: '0 0 30px #A6852F20' }}>
                          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-medium">Last Active</p>
                          <p className="text-sm text-[#1C1917] font-medium mt-1">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'membership' && (
                    <div className="space-y-4">
                      {membership ? (
                        <div className="rounded-xl border border-[#A6852F]/20 bg-[#A6852F]/5 p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Crown className="w-5 h-5 text-[#A6852F]" />
                              <h4 className="text-sm font-medium text-[#1C1917]">{plan?.name || 'Membership'}</h4>
                            </div>
                            <StatusBadge status={membership.status || 'active'} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div><span className="text-[#57534E]">Plan:</span> <span className="text-[#1C1917] font-medium">{plan?.name || '—'}</span></div>
                            <div><span className="text-[#57534E]">Price:</span> <span className="text-[#1C1917] font-medium">${plan?.price || 0}/{plan?.period || 'year'}</span></div>
                            <div><span className="text-[#57534E]">Start:</span> <span className="text-[#1C1917] font-medium">{membership.start_date ? new Date(membership.start_date).toLocaleDateString() : '—'}</span></div>
                            <div><span className="text-[#57534E]">Expiry:</span> <span className="text-[#1C1917] font-medium">{membership.end_date ? new Date(membership.end_date).toLocaleDateString() : '—'}</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Crown className="w-10 h-10 text-[#57534E]/20 mx-auto mb-2" />
                          <p className="text-sm text-[#57534E]">No active membership</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div className="space-y-3">
                      {paymentHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <CreditCard className="w-10 h-10 text-[#57534E]/20 mx-auto mb-2" />
                          <p className="text-sm text-[#57534E]">No payment history</p>
                        </div>
                      ) : paymentHistory.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E8E5DF]/40 hover:bg-[#F3F1ED]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-[#16A34A]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#1C1917] font-medium">${p.amount || 0}</p>
                              <p className="text-[10px] text-[#57534E]">{p.description || p.type || 'Payment'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={p.status || 'completed'} />
                            <p className="text-[10px] text-[#57534E] mt-0.5">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'experiences' && (
                    <div className="space-y-3">
                      {experienceRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Sparkles className="w-10 h-10 text-[#57534E]/20 mx-auto mb-2" />
                          <p className="text-sm text-[#57534E]">No experience requests</p>
                        </div>
                      ) : experienceRequests.map((e) => (
                        <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E8E5DF]/40 hover:bg-[#F3F1ED]/30 transition-colors">
                          <div>
                            <p className="text-xs text-[#1C1917] font-medium">{e.experience || e.title || 'Experience'}</p>
                            <p className="text-[10px] text-[#57534E]">{e.preferred_date || e.date || ''}</p>
                          </div>
                          <StatusBadge status={e.status || 'pending'} />
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'audit' && (
                    <div className="space-y-2">
                      {auditLogs.length === 0 ? (
                        <div className="text-center py-8">
                          <Shield className="w-10 h-10 text-[#57534E]/20 mx-auto mb-2" />
                          <p className="text-sm text-[#57534E]">No audit logs</p>
                        </div>
                      ) : auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F3F1ED]/50 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-[#F3F1ED] flex items-center justify-center shrink-0">
                            <Shield className="w-3.5 h-3.5 text-[#57534E]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-[#1C1917]">
                              {formatAuditAction(log.action)} <span className="text-[#57534E]">on</span> <span className="font-medium">{log.table_name}</span>
                            </p>
                            <p className="text-[9px] text-[#57534E]/50">{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ────────────────────────────────────────────────────────────
// Members Sub-Section (Enhanced)
// ────────────────────────────────────────────────────────────

const MembersSection: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [profileMemberId, setProfileMemberId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Just now') return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMs / 3600000);
      const diffDay = Math.floor(diffMs / 86400000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };
  const [successMsg, setSuccessMsg] = useState('');

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

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    addMember({ ...newMember, joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), lastActive: 'Just now' });
    setNewMember({ name: '', email: '', membership: 'Silver', status: 'active' });
    setShowAddForm(false);
    showSuccess('Member added');
  };

  const handleStartEdit = (m: typeof members[0]) => {
    setEditingId(m.id);
    setEditData({ name: m.name, email: m.email, membership: m.membership, status: m.status });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateMember(editingId, { name: editData.name, email: editData.email, membership: editData.membership, status: editData.status as MemberStatus });
    setEditingId(null);
    showSuccess('Member updated');
  };

  const handleToggleSuspend = async (m: typeof members[0]) => {
    const newStatus = m.status === 'active' ? 'suspended' : 'active';
    updateMember(m.id, { status: newStatus });
    try {
      const client = getSupabaseClient();
      await client.from('profiles').update({ account_status: newStatus }).eq('id', m.id);
    } catch { /* optimistic */ }
    showSuccess(`Member ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`);
  };

  const handleResetPassword = async (email: string) => {
    try {
      const client = getSupabaseClient();
      await client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      showSuccess('Password reset email sent');
    } catch { showSuccess('Password reset failed'); }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Membership', 'Status', 'Joined', 'Last Active'];
    const rows = filtered.map((m) => [m.name, m.email, m.membership, m.status, m.joinDate, m.lastActive]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const viewedMember = profileMemberId ? members.find((m) => m.id === profileMemberId) : null;

  return (
    <Section
      title="Members"
      subtitle={`${members.length} total members`}
      action={
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-[#E8E5DF]/60 px-3 py-1.5 rounded-xl hover:bg-[#F3F1ED] transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Member
          </button>
        </div>
      }
    >
      {successMsg && (
        <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium mb-3">{successMsg}</div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <input placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <select value={newMember.membership} onChange={(e) => setNewMember({ ...newMember, membership: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer">
                  <option value="None">None</option><option value="Silver">Silver</option><option value="Gold">Gold</option><option value="Platinum">Platinum</option>
                </select>
                <select value={newMember.status} onChange={(e) => setNewMember({ ...newMember, status: e.target.value as MemberStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer">
                  <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">Add Member</button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E]" />
          <input placeholder="Search members..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as MemberStatus | 'all'); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer">
          <option value="all">All Status</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="pending">Pending</option>
        </select>
      </div>

      <div className="rounded-2xl border border-[#A6852F]/15 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500" style={{ boxShadow: '0 0 30px #A6852F08' }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#A6852F]/5 via-[#C9A84C]/3 to-[#FAF9F7] border-b border-[#A6852F]/15">
                <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => (
                <tr key={m.id} className="border-b border-[#E8E5DF]/20 last:border-0 hover:bg-gradient-to-r hover:from-[#A6852F]/5 hover:to-transparent transition-all duration-300 group">
                  {editingId === m.id ? (
                    <>
                      <td className="px-5 py-3.5">
                        <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-[#A6852F]/30 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/60 focus:ring-1 focus:ring-[#A6852F]/20 mb-1" />
                        <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-[#A6852F]/30 bg-white text-[11px] text-[#57534E] focus:outline-none focus:border-[#A6852F]/60 focus:ring-1 focus:ring-[#A6852F]/20" />
                      </td>
                      <td className="px-5 py-3.5">
                        <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as MemberStatus })} className="px-3 py-1.5 rounded-lg border border-[#A6852F]/30 bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#A6852F]/60 cursor-pointer"><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#57534E]">{formatDate(m.joinDate)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={handleSaveEdit} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-[#A6852F]/20 group-hover:shadow-lg group-hover:shadow-[#A6852F]/30 transition-shadow">
                            {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1C1917]">{m.name}</p>
                            <p className="text-[11px] text-[#57534E]">{m.email}</p>
                            {m.membership !== 'None' && <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#A6852F] bg-[#A6852F]/10 border border-[#A6852F]/15 px-2 py-0.5 rounded-full">{m.membership}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={m.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-[#57534E] font-medium">{formatDate(m.joinDate)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setProfileMemberId(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer" title="View Profile"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleStartEdit(m)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleToggleSuspend(m)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${m.status === 'active' ? 'text-[#DC2626] hover:bg-[#DC2626]/10' : 'text-[#16A34A] hover:bg-[#16A34A]/10'}`} title={m.status === 'active' ? 'Suspend' : 'Reactivate'}>{m.status === 'active' ? <Ban className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}</button>
                          <button onClick={() => setDeleteId(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#A6852F]/10">
          {paginated.map((m) => (
            <div key={m.id} className="p-4 space-y-3 hover:bg-gradient-to-r hover:from-[#A6852F]/5 hover:to-transparent transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-[#A6852F]/20">
                    {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">{m.name}</p>
                    <p className="text-[11px] text-[#57534E]">{m.email}</p>
                    {m.membership !== 'None' && <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#A6852F] bg-[#A6852F]/10 border border-[#A6852F]/15 px-2 py-0.5 rounded-full">{m.membership}</span>}
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="flex items-center gap-1 pt-2 border-t border-[#A6852F]/10">
                <button onClick={() => setProfileMemberId(m.id)} className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer font-medium"><Eye className="w-3.5 h-3.5" /> Profile</button>
                <button onClick={() => handleStartEdit(m)} className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer font-medium"><Edit className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => handleToggleSuspend(m)} className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer font-medium ${m.status === 'active' ? 'text-[#DC2626] hover:bg-[#DC2626]/10' : 'text-[#16A34A] hover:bg-[#16A34A]/10'}`}>{m.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}</button>
                <button onClick={() => setDeleteId(m.id)} className="py-2 px-3 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#A6852F]/15 bg-gradient-to-r from-[#A6852F]/5 to-[#FAF9F7]/50">
            <span className="text-xs text-[#57534E] font-medium">{filtered.length} members · Page {page}/{totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Member" message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={() => { if (deleteId) { deleteMember(deleteId); setDeleteId(null); showSuccess('Member deleted'); } }} onCancel={() => setDeleteId(null)} />

      <MemberProfileModal open={!!profileMemberId} memberId={profileMemberId} onClose={() => setProfileMemberId(null)}
        onSuspend={(id) => { const m = members.find((x) => x.id === id); if (m) handleToggleSuspend(m); setProfileMemberId(null); }}
        onReactivate={(id) => { const m = members.find((x) => x.id === id); if (m) handleToggleSuspend(m); setProfileMemberId(null); }}
        onResetPassword={handleResetPassword} />
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
  const [successMsg, setSuccessMsg] = useState('');

  const [newPlan, setNewPlan] = useState({ name: '', price: 0, period: 'year', status: 'active' as 'active' | 'draft' | 'archived' });
  const [editData, setEditData] = useState({ name: '', price: 0, period: '', status: '' as 'active' | 'draft' | 'archived' | '' });

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = () => {
    if (!newPlan.name.trim() || newPlan.price <= 0) return;
    addPlan({ ...newPlan, members: 0 });
    setNewPlan({ name: '', price: 0, period: 'year', status: 'active' });
    setShowAddForm(false);
    showSuccess('Plan created');
  };

  const handleStartEdit = (p: typeof plans[0]) => {
    setEditingId(p.id);
    setEditData({ name: p.name, price: p.price, period: p.period, status: p.status });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updatePlan(editingId, { name: editData.name, price: editData.price, period: editData.period, status: editData.status as 'active' | 'draft' | 'archived' });
    setEditingId(null);
    showSuccess('Plan updated');
  };

  return (
    <Section title="Membership Plans" subtitle={`${plans.length} plans`}
      action={<button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Plan</button>}>
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium mb-3">{successMsg}</div>}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input placeholder="Plan name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <input type="number" placeholder="Price" value={newPlan.price || ''} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <select value={newPlan.period} onChange={(e) => setNewPlan({ ...newPlan, period: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="month">Month</option><option value="year">Year</option><option value="lifetime">Lifetime</option></select>
                <select value={newPlan.status} onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value as 'active' | 'draft' | 'archived' })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">Add Plan</button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-[#A6852F]/30 bg-[#A6852F]/8 p-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500" style={{ boxShadow: '0 0 40px #A6852F30, inset 0 1px 0 #A6852F25' }}>
            {editingId === plan.id ? (
              <div className="space-y-3">
                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                <input type="number" value={editData.price || ''} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                <select value={editData.period} onChange={(e) => setEditData({ ...editData, period: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="month">Month</option><option value="year">Year</option><option value="lifetime">Lifetime</option></select>
                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'draft' | 'archived' })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#1C1917]">{plan.name}</h4>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="text-2xl font-medium text-[#1C1917]">${plan.price}<span className="text-xs text-[#57534E] font-normal">/{plan.period}</span></p>
                <p className="text-[11px] text-[#57534E] mt-1">{plan.members} members</p>
                <div className="flex items-center gap-1 mt-3">
                  <button onClick={() => handleStartEdit(plan)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(plan.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Plan" message="Are you sure you want to delete this membership plan? Members currently on this plan will be affected."
        onConfirm={() => { if (deleteId) { deletePlan(deleteId); setDeleteId(null); showSuccess('Plan deleted'); } }} onCancel={() => setDeleteId(null)} />
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
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = useMemo(() => {
    if (filterTab === 'all') return applications;
    return applications.filter((a) => a.status === filterTab);
  }, [applications, filterTab]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const tabs: { key: ApplicationStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'approved', label: 'Approved' }, { key: 'declined', label: 'Declined' },
  ];

  const viewedApp = viewId ? applications.find((a) => a.id === viewId) : null;

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Plan', 'Date', 'Status'];
    const rows = filtered.map((a) => [a.name, a.email, a.plan, a.date, a.status]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section title="Applications" subtitle={`${applications.length} total applications`}
      action={<div className="flex items-center gap-2">
        <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] border border-[#E8E5DF]/60 px-3 py-1.5 rounded-xl hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Download className="w-3.5 h-3.5" /> Export</button>
        {pendingCount > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">{pendingCount} pending</span>}
      </div>}>
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium mb-3">{successMsg}</div>}
      <div className="flex items-center gap-1 mb-4 border-b border-[#E8E5DF]/40">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => { setFilterTab(tab.key); setPage(1); }}
            className={`px-3 py-2 text-[10px] font-medium uppercase tracking-[0.05em] transition-colors cursor-pointer ${filterTab === tab.key ? 'text-[#A6852F] border-b-2 border-[#A6852F]' : 'text-[#57534E] hover:text-[#1C1917]'}`}>
            {tab.label}{tab.key === 'pending' && pendingCount > 0 && <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
        <div className="hidden md:block">
          <div className="grid grid-cols-[1fr_100px_100px_100px_140px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Applicant</span><span>Plan</span><span>Date</span><span>Status</span><span>Actions</span>
          </div>
          {paginated.map((a) => (
            <div key={a.id} className="grid grid-cols-[1fr_100px_100px_100px_140px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              <div><p className="text-sm text-[#1C1917]">{a.name}</p><p className="text-[10px] text-[#57534E]">{a.email}</p>{a.device_type && <p className="text-[9px] text-[#57534E]/60 mt-0.5">{a.device_type} · {a.browser}</p>}</div>
              <span className="text-xs text-[#57534E]">{a.plan}</span>
              <span className="text-xs text-[#57534E]">{formatDate(a.date)}</span>
              <StatusBadge status={a.status} />
              <div className="flex items-center gap-1">
                {a.status === 'pending' && (<>
                  <button onClick={() => { updateApplication(a.id, { status: 'approved' }); showSuccess('Application approved'); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { updateApplication(a.id, { status: 'declined' }); showSuccess('Application declined'); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer" title="Decline"><XCircle className="w-3.5 h-3.5" /></button>
                </>)}
                <button onClick={() => setViewId(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden divide-y divide-[#E8E5DF]/20">
          {paginated.map((a) => (
            <div key={a.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-[#1C1917]">{a.name}</p><p className="text-[11px] text-[#57534E]">{a.email}</p>{a.device_type && <p className="text-[9px] text-[#57534E]/60 mt-0.5">{a.device_type} · {a.browser}</p>}</div>
                <StatusBadge status={a.status} />
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#57534E]"><span>{a.plan}</span><span className="text-[#E8E5DF]">·</span><span>{formatDate(a.date)}</span>{a.referral_source && <><span className="text-[#E8E5DF]">·</span><span>{a.referral_source}</span></>}</div>
              <div className="flex items-center gap-1 pt-2 border-t border-[#E8E5DF]/20">
                {a.status === 'pending' && (<>
                  <button onClick={() => { updateApplication(a.id, { status: 'approved' }); showSuccess('Approved'); }} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                  <button onClick={() => { updateApplication(a.id, { status: 'declined' }); showSuccess('Declined'); }} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /> Decline</button>
                </>)}
                <button onClick={() => setViewId(a.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => setDeleteId(a.id)} className="py-1.5 px-3 rounded-lg flex items-center justify-center text-xs text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
            <span className="text-xs text-[#57534E]">{filtered.length} items · Page {page}/{totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Application" message="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={() => { if (deleteId) { deleteApplication(deleteId); setDeleteId(null); showSuccess('Application deleted'); } }} onCancel={() => setDeleteId(null)} />

      <AnimatePresence>
        {viewId && viewedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewId(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-[#A6852F]/15 w-full max-w-md shadow-xl shadow-[#A6852F]/10 overflow-hidden max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 pt-5 pb-4 bg-gradient-to-br from-[#A6852F]/10 via-[#C9A84C]/5 to-[#FAF9F7] border-b border-[#A6852F]/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center shadow-lg shadow-[#A6852F]/25">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1C1917]">{viewedApp.name}</h4>
                      <p className="text-[10px] text-[#A6852F] font-medium mt-0.5">Registration Application</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={viewedApp.status} />
                    <button onClick={() => setViewId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#A6852F]/10 hover:text-[#A6852F] transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
                {/* Contact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-md bg-[#A6852F]/10 flex items-center justify-center"><Mail className="w-3 h-3 text-[#A6852F]" /></div>
                    <h5 className="text-[10px] font-semibold text-[#A6852F] uppercase tracking-[0.06em]">Contact</h5>
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-[#A6852F]/5 to-[#FAF9F7] border border-[#A6852F]/15 divide-y divide-[#A6852F]/10">
                    <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Email</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.email}</span></div>
                    <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Plan</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.plan || 'N/A'}</span></div>
                    <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Date</span><span className="text-xs text-[#1C1917] font-medium">{formatDate(viewedApp.date)}</span></div>
                  </div>
                </div>

                {/* Location */}
                {(viewedApp.country || viewedApp.country_detected) && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-md bg-[#C9A84C]/10 flex items-center justify-center"><svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                      <h5 className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.06em]">Location</h5>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-[#C9A84C]/5 to-[#FAF9F7] border border-[#C9A84C]/15 divide-y divide-[#C9A84C]/10">
                      {viewedApp.country && (
                        <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Selected</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.country}</span></div>
                      )}
                      {viewedApp.country_detected && (
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <span className="text-[10px] text-[#57534E] font-medium">Detected</span>
                          <span className={`text-xs font-medium ${viewedApp.country && viewedApp.country_detected && viewedApp.country !== viewedApp.country_detected ? 'text-[#DC2626]' : 'text-[#1C1917]'}`}>
                            {viewedApp.city_detected ? `${viewedApp.city_detected}, ${viewedApp.country_detected}` : viewedApp.country_detected}
                            {viewedApp.country && viewedApp.country_detected && viewedApp.country !== viewedApp.country_detected && ' ⚠'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Device & Source */}
                {(viewedApp.device_type || (viewedApp.browser && viewedApp.operating_system) || viewedApp.referral_source) && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-md bg-[#A6852F]/10 flex items-center justify-center"><svg className="w-3 h-3 text-[#A6852F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                      <h5 className="text-[10px] font-semibold text-[#A6852F] uppercase tracking-[0.06em]">Device & Source</h5>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-[#A6852F]/5 to-[#FAF9F7] border border-[#A6852F]/15 divide-y divide-[#A6852F]/10">
                      {viewedApp.device_type && (
                        <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Device</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.device_type}</span></div>
                      )}
                      {viewedApp.browser && viewedApp.operating_system && (
                        <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Browser / OS</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.browser} / {viewedApp.operating_system}</span></div>
                      )}
                      {viewedApp.referral_source && (
                        <div className="flex items-center justify-between px-3 py-2.5"><span className="text-[10px] text-[#57534E] font-medium">Found via</span><span className="text-xs text-[#1C1917] font-medium">{viewedApp.referral_source}</span></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#A6852F]/15 bg-gradient-to-r from-[#A6852F]/5 to-[#FAF9F7]/50 flex items-center justify-end">
                <button onClick={() => setViewId(null)} className="px-4 py-1.5 rounded-xl text-xs font-medium text-[#A6852F] border border-[#A6852F]/30 hover:bg-[#A6852F]/10 transition-colors cursor-pointer">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [successMsg, setSuccessMsg] = useState('');

  const [newExp, setNewExp] = useState({ title: '', type: '', price: '', availability: 'available' as ExperienceAvailability });
  const [editData, setEditData] = useState({ title: '', type: '', price: '', availability: '' as ExperienceAvailability | '' });

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = () => {
    if (!newExp.title.trim() || !newExp.price.trim()) return;
    addExperience({ ...newExp, requests: 0 });
    setNewExp({ title: '', type: '', price: '', availability: 'available' });
    setShowAddForm(false);
    showSuccess('Experience created');
  };

  const handleStartEdit = (e: typeof experiences[0]) => {
    setEditingId(e.id);
    setEditData({ title: e.title, type: e.type, price: e.price, availability: e.availability });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateExperience(editingId, { title: editData.title, type: editData.type, price: editData.price, availability: editData.availability as ExperienceAvailability });
    setEditingId(null);
    showSuccess('Experience updated');
  };

  return (
    <Section title="Experiences" subtitle={`${experiences.length} experiences`}
      action={<button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Experience</button>}>
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium mb-3">{successMsg}</div>}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input placeholder="Title" value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <input placeholder="Type (e.g. meet-and-greet)" value={newExp.type} onChange={(e) => setNewExp({ ...newExp, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <input placeholder="Price (e.g. $500)" value={newExp.price} onChange={(e) => setNewExp({ ...newExp, price: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40" />
                <select value={newExp.availability} onChange={(e) => setNewExp({ ...newExp, availability: e.target.value as ExperienceAvailability })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="available">Available</option><option value="limited">Limited</option><option value="unavailable">Unavailable</option></select>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">Add Experience</button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-[#16A34A]/30 bg-[#16A34A]/8 p-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500" style={{ boxShadow: '0 0 40px #16A34A30, inset 0 1px 0 #16A34A25' }}>
            {editingId === exp.id ? (
              <div className="space-y-3">
                <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                <input value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                <input value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40" />
                <select value={editData.availability} onChange={(e) => setEditData({ ...editData, availability: e.target.value as ExperienceAvailability })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 cursor-pointer"><option value="available">Available</option><option value="limited">Limited</option><option value="unavailable">Unavailable</option></select>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
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
                  <button onClick={() => handleStartEdit(exp)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(exp.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Experience" message="Are you sure you want to delete this experience? Pending requests will be affected."
        onConfirm={() => { if (deleteId) { deleteExperience(deleteId); setDeleteId(null); showSuccess('Experience deleted'); } }} onCancel={() => setDeleteId(null)} />
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
      case 'members': return <MembersSection />;
      case 'plans': return <PlansSection />;
      case 'applications': return <ApplicationsSection />;
      case 'experiences': return <ExperiencesSection />;
      default: return <MembersSection />;
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
