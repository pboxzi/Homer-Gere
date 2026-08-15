import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Send, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { paymentRequestsRepository, paymentMethodsRepository, profilesRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { PaymentRequest, PaymentMethod } from '../../types/database';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  instructions_sent: { label: 'Instructions Sent', color: 'text-blue-700', bg: 'bg-blue-100', icon: Send },
  submitted: { label: 'Submitted', color: 'text-purple-700', bg: 'bg-purple-100', icon: AlertCircle },
  under_review: { label: 'Under Review', color: 'text-orange-700', bg: 'bg-orange-100', icon: Eye },
  approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  expired: { label: 'Expired', color: 'text-gray-700', bg: 'bg-gray-100', icon: Clock },
};

const FILTER_TABS = ['all', 'pending', 'instructions_sent', 'submitted', 'under_review', 'approved', 'rejected'];

const STAT_STYLES: Record<string, { color: string }> = {
  total: { color: '#A6852F' },
  pending: { color: '#F59E0B' },
  instructions_sent: { color: '#3B82F6' },
  submitted: { color: '#8B5CF6' },
  under_review: { color: '#F97316' },
  approved: { color: '#16A34A' },
  rejected: { color: '#DC2626' },
};

export default function AdminPaymentRequests() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PaymentRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructionsForm, setInstructionsForm] = useState({ methodId: '', instructions: '' });
  const [stats, setStats] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<PaymentRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, m, s] = await Promise.all([
        paymentRequestsRepository.getAll(),
        paymentMethodsRepository.getActive(),
        paymentRequestsRepository.getStats(),
      ]);
      setRequests(r); setMethods(m); setStats(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const fetchUserProfile = async (userId: string | null) => {
    if (!userId) return { email: '', fullName: 'Member' };
    try {
      const profile = await profilesRepository.getById(userId);
      if (profile) return { email: profile.email, fullName: `${profile.first_name} ${profile.last_name}` };
    } catch { /* fallback */ }
    return { email: '', fullName: 'Member' };
  };

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.request_number.toLowerCase().includes(q); }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSendInstructions = async () => {
    if (!selected || !instructionsForm.methodId || !instructionsForm.instructions) return;
    setActionLoading(true);
    try {
      await paymentRequestsRepository.sendInstructions(selected.id, instructionsForm.instructions, instructionsForm.methodId);
      const user = await fetchUserProfile(selected.user_id);
      await notifyService.paymentInstructionsSent(selected.user_id, {
        email: user.email,
        fullName: user.fullName,
        amount: String(selected.amount),
        currency: selected.currency,
        paymentInstructions: instructionsForm.instructions,
        dueDate: selected.due_date || '',
      });
      setSuccessMsg('Payment instructions sent');
      setShowInstructionsModal(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleApprove = async (req: PaymentRequest) => {
    setActionLoading(true);
    try {
      await paymentRequestsRepository.updateStatus(req.id, 'approved', 'admin');
      const user = await fetchUserProfile(req.user_id);
      await notifyService.paymentApproved(req.user_id, {
        email: user.email,
        fullName: user.fullName,
        planName: req.payment_type,
        cardNumber: '',
        expiryDate: '',
      });
      setSuccessMsg(`Payment ${req.request_number} approved`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await paymentRequestsRepository.updateStatus(rejectTarget.id, 'rejected');
      const user = await fetchUserProfile(rejectTarget.user_id);
      await notifyService.paymentRejected(rejectTarget.user_id, {
        email: user.email,
        fullName: user.fullName,
        reason: rejectReason,
      });
      setSuccessMsg(`Payment ${rejectTarget.request_number} rejected`);
      setShowRejectModal(false);
      setRejectTarget(null);
      setRejectReason('');
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Payment Requests</h1>
        <p className="text-sm text-[#6b7280] mt-1">Manage payment requests for memberships and experiences</p>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        {['total', 'pending', 'instructions_sent', 'submitted', 'under_review', 'approved', 'rejected'].map(key => {
          const s = STAT_STYLES[key] || { color: '#A6852F' };
          return (
            <div key={key} className="rounded-xl border p-3 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: `${s.color}40`, borderColor: `${s.color}90`, boxShadow: `0 0 50px ${s.color}50` }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{stats[key] || 0}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider mt-1 capitalize" style={{ color: s.color, opacity: 0.7 }}>{key === 'total' ? 'Total' : key.replace(/_/g, ' ')}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => { setFilter(tab); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab ? 'bg-[#A6852F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab === 'all' ? 'All' : tab.replace(/_/g, ' ')}
            {tab !== 'all' && stats[tab] ? <span className="ml-1 text-xs">({stats[tab]})</span> : null}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by request number..."
          className="w-full pl-10 pr-4 py-2 border border-[#E8E5DF]/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No payment requests found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-[#A6852F]/20 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
            <table className="w-full text-sm">
              <thead className="bg-[#A6852F]/5 border-b border-[#A6852F]/15">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Request #</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Due Date</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6852F]/10">
                {paged.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={req.id} className="hover:bg-[#A6852F]/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{req.request_number}</td>
                      <td className="px-4 py-3 text-xs capitalize">{req.payment_type}</td>
                      <td className="px-4 py-3 font-medium">{req.amount} {req.currency}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-xs text-[#6b7280]">{req.due_date ? new Date(req.due_date).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(req); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {req.status === 'pending' && <button onClick={() => { setSelected(req); setShowInstructionsModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Send Instructions"><Send className="w-4 h-4" /></button>}
                          {(req.status === 'submitted' || req.status === 'under_review') && <button onClick={() => handleApprove(req)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>}
                          {req.status !== 'approved' && req.status !== 'rejected' && <button onClick={() => { setRejectTarget(req); setShowRejectModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map(req => {
              const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              return (
                <div key={req.id} className="bg-white rounded-xl border border-[#A6852F]/20 p-4 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs text-[#6b7280]">{req.request_number}</div>
                      <div className="font-medium text-[#1a1a1a] mt-1">{req.amount} {req.currency}</div>
                      <div className="text-xs text-[#6b7280] capitalize">{req.payment_type}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setSelected(req); setShowDetail(true); }} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">View</button>
                    {req.status === 'pending' && <button onClick={() => { setSelected(req); setShowInstructionsModal(true); }} className="flex-1 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Send Instructions</button>}
                  </div>
                </div>
              );
            })}
          </div>

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
              <div><span className="text-[#6b7280]">Type:</span> <span className="font-medium capitalize">{selected.payment_type}</span></div>
              <div><span className="text-[#6b7280]">Amount:</span> <span className="font-medium">{selected.amount} {selected.currency}</span></div>
              <div><span className="text-[#6b7280]">Status:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).bg} ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).color}`}>{(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).label}</span></div>
              <div><span className="text-[#6b7280]">Due Date:</span> <span className="font-medium">{selected.due_date ? new Date(selected.due_date).toLocaleDateString() : '—'}</span></div>
              {selected.payment_instructions && <div><span className="text-[#6b7280]">Instructions:</span><div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selected.payment_instructions}</div></div>}
              {selected.admin_notes && <div><span className="text-[#6b7280]">Admin Notes:</span> <span className="font-medium">{selected.admin_notes}</span></div>}
            </div>
            {(selected.status === 'submitted' || selected.status === 'under_review') && (
              <div className="flex gap-2 mt-6">
                <button onClick={() => handleApprove(selected)} disabled={actionLoading} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Approve</button>
                <button onClick={() => { setRejectTarget(selected); setShowRejectModal(true); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Instructions Modal */}
      {showInstructionsModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowInstructionsModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Send Payment Instructions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Method *</label>
                <select value={instructionsForm.methodId} onChange={e => setInstructionsForm(f => ({ ...f, methodId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                  <option value="">Select method...</option>
                  {methods.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Payment Instructions *</label>
                <textarea value={instructionsForm.instructions} onChange={e => setInstructionsForm(f => ({ ...f, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[120px]"
                  placeholder="Enter payment instructions..." />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSendInstructions} disabled={actionLoading || !instructionsForm.methodId || !instructionsForm.instructions.trim()}
                className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium disabled:opacity-50">Send Instructions</button>
              <button onClick={() => setShowInstructionsModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectReason(''); }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Reject Payment</h2>
            <div className="p-3 bg-gray-50 rounded-lg text-sm mb-4">
              <div className="font-medium">{rejectTarget.request_number}</div>
              <div className="text-[#6b7280]">{rejectTarget.amount} {rejectTarget.currency}</div>
            </div>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px]" />
            <div className="flex gap-2 mt-4">
              <button onClick={handleReject} disabled={actionLoading || !rejectReason.trim()} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">Reject</button>
              <button onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectReason(''); }} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
