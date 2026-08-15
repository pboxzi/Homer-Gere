import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, Download, DollarSign, Send } from 'lucide-react';
import { membershipRequestsRepository, paymentRequestsRepository, auditLogsRepository, getSupabaseClient } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { formatDate } from '../../utils/formatDate';
import type { MembershipRequest } from '../../types/database';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  approved_for_payment: { label: 'Approved for Payment', color: 'text-blue-700', bg: 'bg-blue-100' },
  payment_submitted: { label: 'Payment Submitted', color: 'text-purple-700', bg: 'bg-purple-100' },
  payment_under_review: { label: 'Payment Under Review', color: 'text-orange-700', bg: 'bg-orange-100' },
  payment_approved: { label: 'Payment Approved', color: 'text-green-700', bg: 'bg-green-100' },
  membership_active: { label: 'Membership Active', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved_for_payment', label: 'Approved' },
  { key: 'payment_submitted', label: 'Payment Submitted' },
  { key: 'payment_under_review', label: 'Under Review' },
  { key: 'membership_active', label: 'Active' },
  { key: 'rejected', label: 'Rejected' },
];

const STAT_STYLES: Record<string, { color: string }> = {
  total: { color: '#A6852F' },
  pending: { color: '#F59E0B' },
  approved_for_payment: { color: '#3B82F6' },
  payment_submitted: { color: '#8B5CF6' },
  payment_under_review: { color: '#F97316' },
  membership_active: { color: '#16A34A' },
  rejected: { color: '#DC2626' },
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'NGN', symbol: '₦', label: 'NGN (₦)' },
  { code: 'GHS', symbol: 'GH₵', label: 'GHS (GH₵)' },
  { code: 'KES', symbol: 'KSh', label: 'KES (KSh)' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR (R)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'BRL', symbol: 'R$', label: 'BRL (R$)' },
];

const initialPaymentForm = {
  amount: '',
  currency: 'USD',
  paymentMethod: '',
  paymentInstructions: '',
  dueDate: '',
  internalNote: '',
};

export default function AdminMembershipRequests() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MembershipRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<MembershipRequest | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<MembershipRequest | null>(null);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, s] = await Promise.all([
        membershipRequestsRepository.getAll(),
        membershipRequestsRepository.getStats(),
      ]);
      setRequests(data);
      setStats(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.request_number.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = async (req: MembershipRequest) => {
    setPaymentTarget(req);
    setPaymentForm({
      ...initialPaymentForm,
      currency: req.currency || 'USD',
      amount: '',
    });
    setShowPaymentModal(true);
  };

  const getAdminUserId = async (): Promise<string | null> => {
    const client = getSupabaseClient();
    const { data } = await client.auth.getUser();
    return data?.user?.id || null;
  };

  const handleSendPaymentInstructions = async () => {
    if (!paymentTarget || !paymentForm.amount || !paymentForm.paymentMethod || !paymentForm.paymentInstructions) return;
    setActionLoading(true);
    try {
      const adminUserId = await getAdminUserId();
      await membershipRequestsRepository.approve(paymentTarget.id, adminUserId || undefined);

      await paymentRequestsRepository.create({
        user_id: paymentTarget.user_id || null as any,
        payment_type: 'membership',
        related_record_id: paymentTarget.id,
        amount: parseFloat(paymentForm.amount),
        currency: paymentForm.currency,
        payment_method: paymentForm.paymentMethod,
        due_date: paymentForm.dueDate ? new Date(paymentForm.dueDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        admin_notes: paymentForm.internalNote || null,
        payment_instructions: paymentForm.paymentInstructions,
      });

      await notifyService.paymentRequestCreated(paymentTarget.user_id || '', {
        email: paymentTarget.email,
        fullName: paymentTarget.full_name,
        amount: paymentForm.amount,
        currency: paymentForm.currency,
      });

      try {
        const adminUserId = await getAdminUserId();
        await auditLogsRepository.create({
          user_id: adminUserId || null,
          action: 'approve',
          table_name: 'membership_requests',
        });
      } catch { /* audit log non-critical */ }

      setSuccessMsg(`Payment instructions sent to ${paymentTarget.full_name}`);
      setShowPaymentModal(false);
      setPaymentTarget(null);
      setPaymentForm(initialPaymentForm);
      setShowDetail(false);
      load();
    } catch (e) {
      console.error('Failed to send payment instructions:', e);
      setSuccessMsg('Failed to send payment instructions. Check console for details.');
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await membershipRequestsRepository.reject(rejectTarget.id, rejectReason);
      await notifyService.membershipRequestRejected(rejectTarget.user_id || '', {
        fullName: rejectTarget.full_name, email: rejectTarget.email, rejectionReason: rejectReason,
      });
      try {
        const adminUserId = await getAdminUserId();
        await auditLogsRepository.create({
          user_id: adminUserId || null,
          action: 'reject',
          table_name: 'membership_requests',
        });
      } catch { /* audit log non-critical */ }
      setSuccessMsg(`Request ${rejectTarget.request_number} rejected`);
      setShowRejectModal(false);
      setRejectTarget(null);
      setRejectReason('');
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleDelete = async (req: MembershipRequest) => {
    if (!confirm(`Delete request ${req.request_number}?`)) return;
    try {
      await membershipRequestsRepository.delete(req.id);
      try {
        const adminUserId = await getAdminUserId();
        await auditLogsRepository.create({
          user_id: adminUserId || null,
          action: 'delete',
          table_name: 'membership_requests',
        });
      } catch { /* audit log non-critical */ }
      setSuccessMsg(`Request ${req.request_number} deleted`);
      load();
    } catch (e) { console.error(e); }
  };

  const exportCSV = () => {
    const headers = ['Request #', 'Name', 'Email', 'Plan', 'Duration', 'Status', 'Requested At'];
    const rows = filtered.map(r => [r.request_number, r.full_name, r.email, r.membership_plan_name, r.duration, r.status, r.requested_at]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'membership-requests.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrencySymbol = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || code;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Membership Requests</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage membership applications and approvals</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {['total', 'pending', 'approved_for_payment', 'payment_submitted', 'payment_under_review', 'membership_active', 'rejected'].map(key => {
          const s = STAT_STYLES[key] || { color: '#A6852F' };
          return (
            <div key={key} className="rounded-xl border p-3 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: `${s.color}40`, borderColor: `${s.color}90`, boxShadow: `0 0 50px ${s.color}50` }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{stats[key] || 0}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: s.color, opacity: 0.7 }}>{key === 'total' ? 'Total' : STATUS_CONFIG[key]?.label || key}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button key={tab.key} onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab.key ? 'bg-[#A6852F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab.label}
            {tab.key !== 'all' && stats[tab.key] ? <span className="ml-1 text-xs">({stats[tab.key]})</span> : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or request number..."
          className="w-full pl-10 pr-4 py-2 border border-[#E8E5DF]/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No membership requests found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-[#A6852F]/20 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
            <table className="w-full text-sm">
              <thead className="bg-[#A6852F]/5 border-b border-[#A6852F]/15">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Request #</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Member</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Duration</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Requested</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6852F]/10">
                {paged.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={req.id} className="hover:bg-[#A6852F]/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{req.request_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a]">{req.full_name}</div>
                        <div className="text-xs text-[#6b7280]">{req.email}</div>
                      </td>
                      <td className="px-4 py-3">{req.membership_plan_name}</td>
                      <td className="px-4 py-3 capitalize">{req.duration}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-xs text-[#6b7280]">{formatDate(req.requested_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(req); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {req.status === 'pending' && <button onClick={() => handleApprove(req)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve & Send Payment Instructions"><Send className="w-4 h-4" /></button>}
                          {req.status !== 'rejected' && req.status !== 'membership_active' && <button onClick={() => { setRejectTarget(req); setShowRejectModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>}
                          <button onClick={() => handleDelete(req)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><XCircle className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paged.map(req => {
              const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              return (
                <div key={req.id} className="bg-white rounded-xl border border-[#A6852F]/20 p-4 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs text-[#6b7280]">{req.request_number}</div>
                      <div className="font-medium text-[#1a1a1a] mt-1">{req.full_name}</div>
                      <div className="text-xs text-[#6b7280]">{req.membership_plan_name} · {req.duration}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => { setSelected(req); setShowDetail(true); }} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">View</button>
                    {req.status === 'pending' && <button onClick={() => handleApprove(req)} disabled={actionLoading} className="flex-1 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Approve</button>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">{filtered.length} requests · Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">{selected.request_number}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-[#6b7280]">Name:</span> <span className="font-medium">{selected.full_name}</span></div>
              <div><span className="text-[#6b7280]">Email:</span> <span className="font-medium">{selected.email}</span></div>
              <div><span className="text-[#6b7280]">Phone:</span> <span className="font-medium">{selected.phone && selected.phone !== 'N/A' ? selected.phone : '—'}</span></div>
              <div><span className="text-[#6b7280]">Country:</span> <span className="font-medium">{selected.country || '—'}</span></div>
              <div><span className="text-[#6b7280]">Plan:</span> <span className="font-medium">{selected.membership_plan_name}</span></div>
              <div><span className="text-[#6b7280]">Duration:</span> <span className="font-medium capitalize">{selected.duration}</span></div>
              <div><span className="text-[#6b7280]">Payment Method:</span> <span className="font-medium">{selected.preferred_payment_method || '—'}</span></div>
              <div><span className="text-[#6b7280]">Currency:</span> <span className="font-medium">{selected.currency}</span></div>
              <div><span className="text-[#6b7280]">Notes:</span> <span className="font-medium">{selected.notes || '—'}</span></div>
              <div><span className="text-[#6b7280]">Status:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).bg} ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).color}`}>{(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).label}</span></div>
              <div><span className="text-[#6b7280]">Requested:</span> <span className="font-medium">{formatDate(selected.requested_at)}</span></div>
              {selected.admin_notes && <div><span className="text-[#6b7280]">Admin Notes:</span> <span className="font-medium">{selected.admin_notes}</span></div>}
              {selected.rejection_reason && <div><span className="text-[#6b7280]">Rejection Reason:</span> <span className="font-medium text-red-600">{selected.rejection_reason}</span></div>}
            </div>
            {selected.status === 'pending' && (
              <div className="flex gap-2 mt-6">
                <button onClick={() => handleApprove(selected)} disabled={actionLoading} className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Payment Instructions
                </button>
                <button onClick={() => { setRejectTarget(selected); setShowRejectModal(true); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
              </div>
            )}
            {selected.status === 'approved_for_payment' && (
              <div className="flex gap-2 mt-6">
                <button onClick={() => { setPaymentTarget(selected); setPaymentForm({ ...initialPaymentForm, currency: selected.currency || 'USD' }); setShowPaymentModal(true); }} className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-2">
                  <DollarSign className="w-4 h-4" /> Send Payment Instructions
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Reject Request</h2>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px]" />
            <div className="flex gap-2 mt-4">
              <button onClick={handleReject} disabled={actionLoading || !rejectReason.trim()} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">Reject</button>
              <button onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectReason(''); }} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Payment Instructions Modal */}
      {showPaymentModal && paymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Send Payment Instructions</h2>
            <p className="text-sm text-[#6b7280] mb-4">Enter the payment details for this membership request. The member will see exactly what you enter here.</p>

            <div className="p-3 bg-gray-50 rounded-lg text-sm mb-4">
              <div className="font-medium">{paymentTarget.membership_plan_name} — {paymentTarget.full_name}</div>
              <div className="text-[#6b7280]">{paymentTarget.request_number} · {paymentTarget.email}</div>
              {paymentTarget.country && <div className="text-[#6b7280]">Country: {paymentTarget.country}</div>}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Amount *</label>
                  <input type="number" step="0.01" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Currency</label>
                  <select value={paymentForm.currency} onChange={e => setPaymentForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Method *</label>
                <input type="text" value={paymentForm.paymentMethod} onChange={e => setPaymentForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="e.g. Wire Transfer, Wise, Cash Deposit, Invoice, Cryptocurrency..." />
                <p className="text-[10px] text-[#6b7280] mt-1">Enter any payment method — this field is free text.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Instructions *</label>
                <textarea value={paymentForm.paymentInstructions} onChange={e => setPaymentForm(f => ({ ...f, paymentInstructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[140px]"
                  placeholder="Enter payment instructions for the member. Include any details they need to complete the payment — bank details, wallet addresses, payment links, invoice instructions, office address, reference requirements, etc." />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Deadline</label>
                <input type="date" value={paymentForm.dueDate} onChange={e => setPaymentForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Internal Note</label>
                <textarea value={paymentForm.internalNote} onChange={e => setPaymentForm(f => ({ ...f, internalNote: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]"
                  placeholder="Visible only to administrators. Never shown to members." />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={handleSendPaymentInstructions} disabled={actionLoading || !paymentForm.amount || !paymentForm.paymentMethod || !paymentForm.paymentInstructions}
                className="flex-1 py-2.5 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {actionLoading ? 'Sending...' : 'Send Payment Instructions'}
              </button>
              <button onClick={() => { setShowPaymentModal(false); setPaymentTarget(null); setPaymentForm(initialPaymentForm); }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
