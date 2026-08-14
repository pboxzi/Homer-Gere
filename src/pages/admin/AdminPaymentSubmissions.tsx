import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { paymentSubmissionsRepository, paymentRequestsRepository, membershipRequestsRepository, membershipsRepository, membershipCardsRepository, profilesRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { PaymentSubmission, PaymentRequest } from '../../types/database';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  verified: { label: 'Verified', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
  needs_info: { label: 'Needs Info', color: 'text-orange-700', bg: 'bg-orange-100' },
};

const FILTER_TABS = ['all', 'pending', 'verified', 'rejected', 'needs_info'];

export default function AdminPaymentSubmissions() {
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PaymentSubmission | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, pr] = await Promise.all([
        paymentSubmissionsRepository.getAll(),
        paymentRequestsRepository.getAll(),
      ]);
      setSubmissions(s);
      setPaymentRequests(pr);
      const st = await paymentSubmissionsRepository.getStats();
      setStats(st);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const getRequestForSubmission = (reqId: string) => paymentRequests.find(r => r.id === reqId);

  const filtered = submissions.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return s.submission_number.toLowerCase().includes(q) || s.transaction_reference.toLowerCase().includes(q); }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleVerify = async (sub: PaymentSubmission) => {
    setActionLoading(true);
    try {
      await paymentSubmissionsRepository.verify(sub.id, 'admin');
      await paymentRequestsRepository.updateStatus(sub.payment_request_id, 'approved', 'admin');

      // Check if this is a membership payment and activate membership
      const paymentReq = paymentRequests.find(r => r.id === sub.payment_request_id);
      if (paymentReq && paymentReq.payment_type === 'membership' && paymentReq.user_id) {
        // Get membership request
        const memRequests = await membershipRequestsRepository.getByUserId(paymentReq.user_id);
        const memRequest = memRequests.find(r => r.id === paymentReq.related_record_id);

        if (memRequest) {
          // Get the plan details to calculate duration
          const plans = await import('../../lib/repositories').then(m => m.membershipPlansRepository.getAll());
          const plan = plans.find(p => p.id === memRequest.membership_plan_id);

          // Create membership
          const startDate = new Date().toISOString().split('T')[0];
          const endDate = new Date(Date.now() + (plan?.duration || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          const membership = await membershipsRepository.create({
            user_id: paymentReq.user_id,
            plan_id: memRequest.membership_plan_id || '',
            status: 'active',
            start_date: startDate,
            end_date: endDate,
            membership_request_id: memRequest.id,
            auto_renew: false,
          });

          // Generate membership card
          const cardNumber = 'HG-' + Date.now().toString(36).toUpperCase().slice(-8);
          const card = await membershipCardsRepository.create({
            user_id: paymentReq.user_id,
            membership_id: membership.id,
            membership_request_id: memRequest.id,
            card_number: cardNumber,
            qr_code_data: cardNumber,
            issue_date: startDate,
            expiry_date: endDate,
            card_design: memRequest.membership_plan_name?.toLowerCase() || 'gold',
          });

          // Update membership with card_id
          await membershipsRepository.update(membership.id, { card_id: card.id });

          // Update membership request status
          await membershipRequestsRepository.updateStatus(memRequest.id, 'membership_active');

          // Notify member
          const profile = await profilesRepository.getById(paymentReq.user_id);
          if (profile) {
            await notifyService.membershipActivated(paymentReq.user_id, {
              email: profile.email,
              fullName: `${profile.first_name} ${profile.last_name}`.trim(),
              planName: memRequest.membership_plan_name,
              cardNumber: card.card_number,
              expiryDate: card.expiry_date || 'No Expiry',
            });
          }
        }
      }

      setSuccessMsg(`Submission ${sub.submission_number} verified and payment approved`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleReject = async (sub: PaymentSubmission) => {
    setActionLoading(true);
    try {
      await paymentSubmissionsRepository.reject(sub.id, adminNotes);
      await paymentRequestsRepository.updateStatus(sub.payment_request_id, 'rejected');
      setSuccessMsg(`Submission ${sub.submission_number} rejected`);
      setShowDetail(false);
      setAdminNotes('');
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleRequestInfo = async (sub: PaymentSubmission) => {
    setActionLoading(true);
    try {
      await paymentSubmissionsRepository.requestMoreInfo(sub.id, adminNotes);
      setSuccessMsg(`More info requested for ${sub.submission_number}`);
      setShowDetail(false);
      setAdminNotes('');
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Payment Submissions</h1>
        <p className="text-sm text-[#6b7280] mt-1">Review and verify payment proofs submitted by members</p>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {['total', 'pending', 'verified', 'rejected', 'needs_info'].map(key => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-[#1a1a1a]">{stats[key] || 0}</div>
            <div className="text-xs text-[#6b7280] mt-1 capitalize">{key === 'total' ? 'Total' : key.replace(/_/g, ' ')}</div>
          </div>
        ))}
      </div>

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
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by submission or transaction number..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No payment submissions found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Submission #</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Request #</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Transaction Ref</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Submitted</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map(sub => {
                  const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                  const req = getRequestForSubmission(sub.payment_request_id);
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{sub.submission_number}</td>
                      <td className="px-4 py-3 font-mono text-xs">{req?.request_number || '—'}</td>
                      <td className="px-4 py-3 font-medium">{sub.amount_paid} {sub.currency}</td>
                      <td className="px-4 py-3 text-xs font-mono">{sub.transaction_reference}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-xs text-[#6b7280]">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(sub); setShowDetail(true); setAdminNotes(''); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {sub.status === 'pending' && <button onClick={() => handleVerify(sub)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Verify"><CheckCircle className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map(sub => {
              const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
              return (
                <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs text-[#6b7280]">{sub.submission_number}</div>
                      <div className="font-medium text-[#1a1a1a] mt-1">{sub.amount_paid} {sub.currency}</div>
                      <div className="text-xs text-[#6b7280] font-mono">{sub.transaction_reference}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setSelected(sub); setShowDetail(true); setAdminNotes(''); }} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">View</button>
                    {sub.status === 'pending' && <button onClick={() => handleVerify(sub)} disabled={actionLoading} className="flex-1 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Verify</button>}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">{filtered.length} submissions · Page {page} of {totalPages}</span>
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
              <h2 className="text-lg font-bold text-[#1a1a1a]">{selected.submission_number}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-[#6b7280]">Payment Request:</span> <span className="font-medium font-mono">{getRequestForSubmission(selected.payment_request_id)?.request_number || '—'}</span></div>
              <div><span className="text-[#6b7280]">Amount Paid:</span> <span className="font-medium">{selected.amount_paid} {selected.currency}</span></div>
              <div><span className="text-[#6b7280]">Transaction Ref:</span> <span className="font-medium font-mono">{selected.transaction_reference}</span></div>
              <div><span className="text-[#6b7280]">Payment Date:</span> <span className="font-medium">{selected.payment_date}</span></div>
              <div><span className="text-[#6b7280]">Status:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).bg} ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).color}`}>{(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending).label}</span></div>
              {selected.notes && <div><span className="text-[#6b7280]">Notes:</span><div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selected.notes}</div></div>}
              {selected.proof_url && <div><span className="text-[#6b7280]">Proof:</span><a href={selected.proof_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#A6852F] underline">View Proof</a></div>}
              {selected.admin_notes && <div><span className="text-[#6b7280]">Admin Notes:</span> <span className="font-medium">{selected.admin_notes}</span></div>}
            </div>
            {selected.status === 'pending' && (
              <div className="mt-4">
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Admin notes (optional)..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[80px] mb-3" />
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(selected)} disabled={actionLoading} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Verify & Approve</button>
                  <button onClick={() => handleRequestInfo(selected)} disabled={actionLoading} className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium">Request Info</button>
                  <button onClick={() => handleReject(selected)} disabled={actionLoading} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
