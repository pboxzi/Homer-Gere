import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Eye, FileText, Download, DollarSign } from 'lucide-react';
import { membershipRequestsRepository, paymentRequestsRepository, paymentMethodsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { MembershipRequest, PaymentMethod } from '../../types/database';

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
  { key: 'membership_active', label: 'Active' },
  { key: 'rejected', label: 'Rejected' },
];

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

  // Payment request modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<MembershipRequest | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentForm, setPaymentForm] = useState({ amount: '', currency: 'USD', methodId: '', instructions: '', dueDate: '' });

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
    paymentMethodsRepository.getActive().then(setPaymentMethods).catch(() => {});
  }, []);

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
    setActionLoading(true);
    try {
      await membershipRequestsRepository.approve(req.id, 'admin');
      await notifyService.membershipRequestApproved(req.user_id || '', {
        fullName: req.full_name, email: req.email, planName: req.membership_plan_name,
        amount: '0', currency: req.currency, paymentMethod: req.preferred_payment_method || 'Bank Transfer',
        paymentInstructions: 'Please contact admin for payment instructions.', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setSuccessMsg(`Request ${req.request_number} approved for payment`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
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
      setSuccessMsg(`Request ${req.request_number} deleted`);
      load();
    } catch (e) { console.error(e); }
  };

  const handleCreatePaymentRequest = async () => {
    if (!paymentTarget || !paymentForm.amount || !paymentForm.methodId) return;
    setActionLoading(true);
    try {
      await paymentRequestsRepository.create({
        user_id: paymentTarget.user_id || '',
        payment_type: 'membership',
        related_record_id: paymentTarget.id,
        payment_method_id: paymentForm.methodId,
        amount: parseFloat(paymentForm.amount),
        currency: paymentForm.currency,
        due_date: paymentForm.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        admin_notes: `Payment request for ${paymentTarget.membership_plan_name} membership`,
        payment_instructions: paymentForm.instructions || null,
      });
      await notifyService.paymentRequestCreated(paymentTarget.user_id || '', {
        email: paymentTarget.email,
        fullName: paymentTarget.full_name,
        amount: paymentForm.amount,
        currency: paymentForm.currency,
      });
      setSuccessMsg(`Payment request created for ${paymentTarget.full_name}`);
      setShowPaymentModal(false);
      setPaymentTarget(null);
      setPaymentForm({ amount: '', currency: 'USD', methodId: '', instructions: '', dueDate: '' });
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
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
        {['total', 'pending', 'approved_for_payment', 'payment_submitted', 'payment_under_review', 'membership_active', 'rejected'].map(key => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-[#1a1a1a]">{stats[key] || 0}</div>
            <div className="text-xs text-[#6b7280] mt-1">{key === 'total' ? 'Total' : STATUS_CONFIG[key]?.label || key}</div>
          </div>
        ))}
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
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No membership requests found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
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
              <tbody className="divide-y divide-gray-100">
                {paged.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{req.request_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a]">{req.full_name}</div>
                        <div className="text-xs text-[#6b7280]">{req.email}</div>
                      </td>
                      <td className="px-4 py-3">{req.membership_plan_name}</td>
                      <td className="px-4 py-3 capitalize">{req.duration}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-xs text-[#6b7280]">{new Date(req.requested_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(req); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {req.status === 'pending' && <button onClick={() => handleApprove(req)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>}
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
                <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-4">
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
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">{selected.request_number}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-[#6b7280]">Name:</span> <span className="font-medium">{selected.full_name}</span></div>
              <div><span className="text-[#6b7280]">Email:</span> <span className="font-medium">{selected.email}</span></div>
              <div><span className="text-[#6b7280]">Phone:</span> <span className="font-medium">{selected.phone || '—'}</span></div>
              <div><span className="text-[#6b7280]">Country:</span> <span className="font-medium">{selected.country || '—'}</span></div>
              <div><span className="text-[#6b7280]">Plan:</span> <span className="font-medium">{selected.membership_plan_name}</span></div>
              <div><span className="text-[#6b7280]">Duration:</span> <span className="font-medium capitalize">{selected.duration}</span></div>
              <div><span className="text-[#6b7280]">Payment Method:</span> <span className="font-medium">{selected.preferred_payment_method || '—'}</span></div>
              <div><span className="text-[#6b7280]">Currency:</span> <span className="font-medium">{selected.currency}</span></div>
              <div><span className="text-[#6b7280]">Notes:</span> <span className="font-medium">{selected.notes || '—'}</span></div>
              <div><span className="text-[#6b7280]">Status:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).bg} ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).color}`}>{(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).label}</span></div>
              <div><span className="text-[#6b7280]">Requested:</span> <span className="font-medium">{new Date(selected.requested_at).toLocaleString()}</span></div>
              {selected.admin_notes && <div><span className="text-[#6b7280]">Admin Notes:</span> <span className="font-medium">{selected.admin_notes}</span></div>}
              {selected.rejection_reason && <div><span className="text-[#6b7280]">Rejection Reason:</span> <span className="font-medium text-red-600">{selected.rejection_reason}</span></div>}
            </div>
            {selected.status === 'pending' && (
              <div className="flex gap-2 mt-6">
                <button onClick={() => handleApprove(selected)} disabled={actionLoading} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Approve for Payment</button>
                <button onClick={() => { setRejectTarget(selected); setShowRejectModal(true); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
              </div>
            )}
            {selected.status === 'approved_for_payment' && (
              <div className="flex gap-2 mt-6">
                <button onClick={() => { setPaymentTarget(selected); setPaymentForm(f => ({ ...f, amount: '', instructions: '' })); setShowPaymentModal(true); }} className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-2">
                  <DollarSign className="w-4 h-4" /> Create Payment Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
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

      {/* Create Payment Request Modal */}
      {showPaymentModal && paymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Create Payment Request</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="font-medium">{paymentTarget.membership_plan_name} — {paymentTarget.full_name}</div>
                <div className="text-[#6b7280]">{paymentTarget.request_number}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Amount *</label>
                  <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Currency</label>
                  <select value={paymentForm.currency} onChange={e => setPaymentForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Method *</label>
                <select value={paymentForm.methodId} onChange={e => setPaymentForm(f => ({ ...f, methodId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                  <option value="">Select method...</option>
                  {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type.replace(/_/g, ' ')})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Instructions</label>
                <textarea value={paymentForm.instructions} onChange={e => setPaymentForm(f => ({ ...f, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[100px]"
                  placeholder="Bank details, account number, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Due Date</label>
                <input type="date" value={paymentForm.dueDate} onChange={e => setPaymentForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleCreatePaymentRequest} disabled={actionLoading || !paymentForm.amount || !paymentForm.methodId}
                className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium disabled:opacity-50">Create Payment Request</button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
