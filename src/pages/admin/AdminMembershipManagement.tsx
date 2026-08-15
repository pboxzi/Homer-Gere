import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, Download, DollarSign, Send, AlertCircle, HelpCircle, CreditCard, Clock } from 'lucide-react';
import {
  membershipRequestsRepository,
  paymentRequestsRepository,
  paymentSubmissionsRepository,
  membershipsRepository,
  membershipCardsRepository,
  profilesRepository,
  auditLogsRepository,
  getSupabaseClient,
} from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { formatDate } from '../../utils/formatDate';
import type { MembershipRequest, PaymentRequest, PaymentSubmission, Membership, MembershipCard } from '../../types/database';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100' },
  approved_for_payment: { label: 'Awaiting Payment', color: 'text-blue-700', bg: 'bg-blue-100' },
  payment_submitted: { label: 'Payment Submitted', color: 'text-purple-700', bg: 'bg-purple-100' },
  payment_under_review: { label: 'Under Review', color: 'text-orange-700', bg: 'bg-orange-100' },
  payment_approved: { label: 'Payment Approved', color: 'text-green-700', bg: 'bg-green-100' },
  membership_active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
};

const SUBMISSION_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  verified: { label: 'Verified', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
  needs_info: { label: 'Needs Info', color: 'text-orange-700', bg: 'bg-orange-100' },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending Review' },
  { key: 'approved_for_payment', label: 'Awaiting Payment' },
  { key: 'payment_submitted', label: 'Payment Submitted' },
  { key: 'membership_active', label: 'Active' },
  { key: 'rejected', label: 'Rejected' },
];

const STAT_STYLES: Record<string, { color: string }> = {
  total: { color: '#A6852F' },
  pending: { color: '#F59E0B' },
  approved_for_payment: { color: '#3B82F6' },
  payment_submitted: { color: '#8B5CF6' },
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

type UnifiedItem = {
  type: 'membership_request';
  request: MembershipRequest;
  paymentRequest: PaymentRequest | null;
  submission: PaymentSubmission | null;
  membership: Membership | null;
  card: MembershipCard | null;
};

export default function AdminMembershipManagement() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<UnifiedItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<MembershipRequest | null>(null);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<MembershipRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false);
  const [rejectPaymentTarget, setRejectPaymentTarget] = useState<{ sub: PaymentSubmission; pr: PaymentRequest } | null>(null);
  const [rejectPaymentReason, setRejectPaymentReason] = useState('');

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTarget, setInfoTarget] = useState<{ sub: PaymentSubmission } | null>(null);
  const [infoMessage, setInfoMessage] = useState('');

  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<UnifiedItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [reqs, prs, subs, mems] = await Promise.all([
        membershipRequestsRepository.getAll(),
        paymentRequestsRepository.getAll(),
        paymentSubmissionsRepository.getAll(),
        membershipsRepository.getAll(),
      ]);
      setRequests(reqs);
      setPaymentRequests(prs.filter(p => p.payment_type === 'membership'));
      setSubmissions(subs);
      setMemberships(mems);

      const st: Record<string, number> = { total: 0 };
      for (const r of reqs) {
        st.total++;
        st[r.status] = (st[r.status] || 0) + 1;
      }
      setStats(st);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const getUnifiedItems = useCallback((): UnifiedItem[] => {
    return requests.map(req => {
      const pr = paymentRequests.find(p => p.related_record_id === req.id && p.payment_type === 'membership') || null;
      const sub = pr ? submissions.find(s => s.payment_request_id === pr.id) || null : null;
      const mem = memberships.find(m => m.membership_request_id === req.id) || null;
      const card = mem ? submissions.length > 0 ? null : null : null;
      return { type: 'membership_request' as const, request: req, paymentRequest: pr, submission: sub, membership: mem, card };
    });
  }, [requests, paymentRequests, submissions, memberships]);

  const unifiedItems = getUnifiedItems();

  const getDisplayStatus = (item: UnifiedItem): string => {
    const req = item.request;
    if (req.status === 'rejected') return 'rejected';
    if (req.status === 'membership_active') return 'membership_active';
    if (req.status === 'pending') return 'pending';
    if (req.status === 'approved_for_payment') {
      if (item.submission && item.submission.status === 'pending') return 'payment_submitted';
      if (item.submission && (item.submission.status === 'verified' || item.submission.status === 'rejected' || item.submission.status === 'needs_info')) return req.status;
      return 'approved_for_payment';
    }
    return req.status;
  };

  const filtered = unifiedItems.filter(item => {
    const displayStatus = getDisplayStatus(item);
    if (filter !== 'all' && displayStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.request.full_name.toLowerCase().includes(q) ||
        item.request.email.toLowerCase().includes(q) ||
        item.request.request_number.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getCurrencySymbol = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || code;

  const getAdminUserId = async (): Promise<string | null> => {
    const client = getSupabaseClient();
    const { data } = await client.auth.getUser();
    return data?.user?.id || null;
  };

  const handleApprove = (item: UnifiedItem) => {
    setPaymentTarget(item.request);
    setPaymentForm({
      ...initialPaymentForm,
      currency: item.request.currency || 'USD',
      amount: '',
    });
    setShowPaymentModal(true);
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
        const aid = await getAdminUserId();
        await auditLogsRepository.create({
          user_id: aid || null,
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

  const handleRejectRequest = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await membershipRequestsRepository.reject(rejectTarget.id, rejectReason);
      await notifyService.membershipRequestRejected(rejectTarget.user_id || '', {
        fullName: rejectTarget.full_name,
        email: rejectTarget.email,
        rejectionReason: rejectReason,
      });
      try {
        const aid = await getAdminUserId();
        await auditLogsRepository.create({
          user_id: aid || null,
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
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleVerifyPayment = async () => {
    if (!verifyTarget || !verifyTarget.submission || !verifyTarget.paymentRequest) return;
    setActionLoading(true);
    setShowVerifyConfirm(false);
    const sub = verifyTarget.submission;
    const pr = verifyTarget.paymentRequest;
    try {
      await paymentSubmissionsRepository.verify(sub.id, 'admin');
      await paymentRequestsRepository.updateStatus(pr.id, 'approved', 'admin');

      if (pr.user_id) {
        try {
          const memRequest = verifyTarget.request;
          const plans = await import('../../lib/repositories').then(m => m.membershipPlansRepository.getAll());
          const plan = plans.find(p => p.id === memRequest.membership_plan_id);

          const startDate = new Date().toISOString().split('T')[0];
          const endDate = new Date(Date.now() + (plan?.duration || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          const membership = await membershipsRepository.create({
            user_id: pr.user_id,
            plan_id: memRequest.membership_plan_id || '',
            status: 'active',
            start_date: startDate,
            end_date: endDate,
            membership_request_id: memRequest.id,
            auto_renew: false,
            renewal_date: null,
            payment_id: null,
            card_id: null,
            last_payment_id: null,
          });

          const cardNumber = 'HG-' + Date.now().toString(36).toUpperCase().slice(-8);
          const card = await membershipCardsRepository.create({
            user_id: pr.user_id,
            membership_id: membership.id,
            membership_request_id: memRequest.id,
            card_number: cardNumber,
            qr_code_data: cardNumber,
            issue_date: startDate,
            expiry_date: endDate,
            card_design: memRequest.membership_plan_name?.toLowerCase() || 'gold',
          });

          await membershipsRepository.update(membership.id, { card_id: card.id });
          await membershipRequestsRepository.updateStatus(memRequest.id, 'membership_active');

          const profile = await profilesRepository.getById(pr.user_id);
          if (profile) {
            await notifyService.membershipActivated(pr.user_id, {
              email: profile.email,
              fullName: `${profile.first_name} ${profile.last_name}`.trim(),
              planName: memRequest.membership_plan_name,
              cardNumber: card.card_number,
              expiryDate: card.expiry_date || 'No Expiry',
            });
          }
        } catch (activationError) {
          console.error('Membership activation failed, rolling back payment status:', activationError);
          await paymentRequestsRepository.updateStatus(pr.id, 'submitted', 'admin');
          await paymentSubmissionsRepository.update(sub.id, { status: 'pending' } as any);
          setSuccessMsg('Payment verified but membership activation failed. Payment status reverted for manual review.');
          setShowDetail(false);
          load();
          setActionLoading(false);
          return;
        }
      }

      setSuccessMsg(`Submission ${sub.submission_number} verified and membership activated`);
      setShowDetail(false);
      load();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleRejectPayment = async () => {
    if (!rejectPaymentTarget) return;
    const { sub, pr } = rejectPaymentTarget;
    setActionLoading(true);
    try {
      await paymentSubmissionsRepository.reject(sub.id, rejectPaymentReason);
      await paymentRequestsRepository.updateStatus(pr.id, 'rejected');

      let email = '';
      let fullName = 'Member';
      if (sub.user_id) {
        try {
          const profile = await profilesRepository.getById(sub.user_id);
          if (profile) {
            email = profile.email;
            fullName = `${profile.first_name} ${profile.last_name}`.trim();
          }
        } catch { /* use defaults */ }
      }
      await notifyService.paymentRejected(sub.user_id, {
        email,
        fullName,
        reason: rejectPaymentReason || 'Payment could not be verified.',
      });

      setSuccessMsg(`Submission ${sub.submission_number} rejected`);
      setShowRejectPaymentModal(false);
      setRejectPaymentTarget(null);
      setRejectPaymentReason('');
      setShowDetail(false);
      load();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleRequestInfo = async () => {
    if (!infoTarget) return;
    const { sub } = infoTarget;
    setActionLoading(true);
    try {
      await paymentSubmissionsRepository.requestMoreInfo(sub.id, infoMessage);

      let email = '';
      let fullName = 'Member';
      if (sub.user_id) {
        try {
          const profile = await profilesRepository.getById(sub.user_id);
          if (profile) {
            email = profile.email;
            fullName = `${profile.first_name} ${profile.last_name}`.trim();
          }
        } catch { /* use defaults */ }
      }
      await notifyService.paymentNeedsInfo(sub.user_id, {
        email,
        fullName,
        paymentType: 'membership',
        amount: String(sub.amount_paid),
        currency: sub.currency,
        reason: infoMessage || 'Additional information required.',
      });

      setSuccessMsg(`More info requested for ${sub.submission_number}`);
      setShowInfoModal(false);
      setInfoTarget(null);
      setInfoMessage('');
      setShowDetail(false);
      load();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const exportCSV = () => {
    const headers = ['Request #', 'Name', 'Email', 'Plan', 'Duration', 'Status', 'Requested At'];
    const rows = filtered.map(item => [
      item.request.request_number,
      item.request.full_name,
      item.request.email,
      item.request.membership_plan_name,
      item.request.duration,
      getDisplayStatus(item),
      item.request.requested_at,
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'membership-management.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Membership Management</h1>
          <p className="text-sm text-[#6b7280] mt-1">Complete membership lifecycle — applications, payments, and active members</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {['total', 'pending', 'approved_for_payment', 'payment_submitted', 'membership_active', 'rejected'].map(key => {
          const s = STAT_STYLES[key] || { color: '#A6852F' };
          return (
            <div key={key} className="rounded-xl border p-3 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: `${s.color}40`, borderColor: `${s.color}90`, boxShadow: `0 0 50px ${s.color}50` }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{stats[key] || 0}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: s.color, opacity: 0.7 }}>{key === 'total' ? 'Total' : STATUS_CONFIG[key]?.label || key}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button key={tab.key} onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab.key ? 'bg-[#A6852F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab.label}
            {tab.key !== 'all' && stats[tab.key] ? <span className="ml-1 text-xs">({stats[tab.key]})</span> : null}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or request number..."
          className="w-full pl-10 pr-4 py-2 border border-[#E8E5DF]/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

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
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Requested</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6852F]/10">
                {paged.map(item => {
                  const displayStatus = getDisplayStatus(item);
                  const sc = STATUS_CONFIG[displayStatus] || STATUS_CONFIG.pending;
                  return (
                    <tr key={item.request.id} className="hover:bg-[#A6852F]/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{item.request.request_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a]">{item.request.full_name}</div>
                        <div className="text-xs text-[#6b7280]">{item.request.email}</div>
                      </td>
                      <td className="px-4 py-3">{item.request.membership_plan_name}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-xs text-[#6b7280]">{formatDate(item.request.requested_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(item); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {item.request.status === 'pending' && <button onClick={() => handleApprove(item)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve & Send Payment"><Send className="w-4 h-4" /></button>}
                          {item.request.status !== 'rejected' && item.request.status !== 'membership_active' && <button onClick={() => { setRejectTarget(item.request); setShowRejectModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map(item => {
              const displayStatus = getDisplayStatus(item);
              const sc = STATUS_CONFIG[displayStatus] || STATUS_CONFIG.pending;
              return (
                <div key={item.request.id} className="bg-white rounded-xl border border-[#A6852F]/20 p-4 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs text-[#6b7280]">{item.request.request_number}</div>
                      <div className="font-medium text-[#1a1a1a] mt-1">{item.request.full_name}</div>
                      <div className="text-xs text-[#6b7280]">{item.request.membership_plan_name} · {item.request.duration}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => { setSelected(item); setShowDetail(true); }} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">View</button>
                    {item.request.status === 'pending' && <button onClick={() => handleApprove(item)} disabled={actionLoading} className="flex-1 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Approve</button>}
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

      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={() => setShowDetail(false)}>
          <div className="bg-white h-full w-full max-w-lg overflow-y-auto p-6 border-l border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">{selected.request.request_number}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-[#1a1a1a]">{selected.request.full_name}</div>
                <div className="text-[#6b7280]">{selected.request.email}</div>
                {selected.request.phone && selected.request.phone !== 'N/A' && <div className="text-[#6b7280]">{selected.request.phone}</div>}
                {selected.request.country && <div className="text-[#6b7280]">{selected.request.country}</div>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[#6b7280]">Plan</span><span className="font-medium">{selected.request.membership_plan_name}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Duration</span><span className="font-medium capitalize">{selected.request.duration}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Currency</span><span className="font-medium">{selected.request.currency}</span></div>
                {selected.request.preferred_payment_method && <div className="flex justify-between"><span className="text-[#6b7280]">Payment Method</span><span className="font-medium">{selected.request.preferred_payment_method}</span></div>}
                {selected.request.notes && <div className="flex justify-between"><span className="text-[#6b7280]">Notes</span><span className="font-medium text-right max-w-[60%]">{selected.request.notes}</span></div>}
                <div className="flex justify-between"><span className="text-[#6b7280]">Requested</span><span className="font-medium">{formatDate(selected.request.requested_at)}</span></div>
              </div>

              {selected.request.status === 'rejected' && selected.request.rejection_reason && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-xs font-medium text-red-700 mb-1">Rejection Reason</div>
                  <div className="text-sm text-red-800">{selected.request.rejection_reason}</div>
                </div>
              )}

              {selected.paymentRequest && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs font-medium text-blue-700 mb-2">Payment Request</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-blue-600">Amount</span><span className="font-medium">{getCurrencySymbol(selected.paymentRequest.currency)}{selected.paymentRequest.amount} {selected.paymentRequest.currency}</span></div>
                    {selected.paymentRequest.payment_method && <div className="flex justify-between"><span className="text-blue-600">Method</span><span className="font-medium">{selected.paymentRequest.payment_method}</span></div>}
                    {selected.paymentRequest.payment_instructions && <div className="mt-2 p-2 bg-white rounded text-xs text-[#6b7280]">{selected.paymentRequest.payment_instructions}</div>}
                    {selected.paymentRequest.due_date && <div className="flex justify-between"><span className="text-blue-600">Due</span><span className="font-medium">{formatDate(selected.paymentRequest.due_date)}</span></div>}
                  </div>
                </div>
              )}

              {selected.submission && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs font-medium text-purple-700 mb-2">Payment Submission</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-purple-600">Submission #</span><span className="font-medium font-mono">{selected.submission.submission_number}</span></div>
                    <div className="flex justify-between"><span className="text-purple-600">Amount Paid</span><span className="font-medium">{selected.submission.amount_paid} {selected.submission.currency}</span></div>
                    <div className="flex justify-between"><span className="text-purple-600">Transaction Ref</span><span className="font-medium font-mono">{selected.submission.transaction_reference}</span></div>
                    <div className="flex justify-between"><span className="text-purple-600">Payment Date</span><span className="font-medium">{selected.submission.payment_date}</span></div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Status</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${(SUBMISSION_STATUS_CONFIG[selected.submission.status] || SUBMISSION_STATUS_CONFIG.pending).bg} ${(SUBMISSION_STATUS_CONFIG[selected.submission.status] || SUBMISSION_STATUS_CONFIG.pending).color}`}>
                        {(SUBMISSION_STATUS_CONFIG[selected.submission.status] || SUBMISSION_STATUS_CONFIG.pending).label}
                      </span>
                    </div>
                    {selected.submission.notes && <div className="mt-2 p-2 bg-white rounded text-xs text-[#6b7280]">{selected.submission.notes}</div>}
                    {selected.submission.proof_url && <div><a href={selected.submission.proof_url} target="_blank" rel="noopener noreferrer" className="text-[#A6852F] underline text-xs">View Proof</a></div>}
                  </div>
                </div>
              )}

              {selected.membership && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-xs font-medium text-emerald-700 mb-2">Active Membership</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-emerald-600">Status</span><span className="font-medium capitalize">{selected.membership.status}</span></div>
                    {selected.membership.start_date && <div className="flex justify-between"><span className="text-emerald-600">Start</span><span className="font-medium">{formatDate(selected.membership.start_date)}</span></div>}
                    {selected.membership.end_date && <div className="flex justify-between"><span className="text-emerald-600">End</span><span className="font-medium">{formatDate(selected.membership.end_date)}</span></div>}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {selected.request.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selected)} disabled={actionLoading} className="w-full py-2.5 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Approve & Send Payment
                  </button>
                  <button onClick={() => { setRejectTarget(selected.request); setShowRejectModal(true); }} className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject Request
                  </button>
                </>
              )}

              {selected.request.status === 'approved_for_payment' && !selected.submission && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Awaiting member payment. Payment instructions have been sent.
                </div>
              )}

              {selected.submission && selected.submission.status === 'pending' && (
                <>
                  <button onClick={() => { setVerifyTarget(selected); setShowVerifyConfirm(true); }} disabled={actionLoading} className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Approve Payment
                  </button>
                  <button onClick={() => { setRejectPaymentTarget({ sub: selected.submission!, pr: selected.paymentRequest! }); setShowRejectPaymentModal(true); }} disabled={actionLoading} className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject Payment
                  </button>
                  <button onClick={() => { setInfoTarget({ sub: selected.submission! }); setShowInfoModal(true); }} disabled={actionLoading} className="w-full py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Request More Info
                  </button>
                </>
              )}

              {selected.submission && selected.submission.status === 'needs_info' && (
                <div className="p-3 bg-orange-50 rounded-lg text-sm text-orange-800">
                  <HelpCircle className="w-4 h-4 inline mr-1" />
                  Additional information has been requested from the member.
                </div>
              )}

              {selected.request.status === 'membership_active' && (
                <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Membership is active.
                </div>
              )}

              {selected.request.status === 'rejected' && (
                <div className="p-3 bg-red-50 rounded-lg text-sm text-red-800">
                  <XCircle className="w-4 h-4 inline mr-1" />
                  This request has been rejected.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Reject Request</h2>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px]" />
            <div className="flex gap-2 mt-4">
              <button onClick={handleRejectRequest} disabled={actionLoading || !rejectReason.trim()} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">Reject</button>
              <button onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectReason(''); }} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showVerifyConfirm && verifyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowVerifyConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1a1a1a]">Approve Payment</h2>
                <p className="text-sm text-[#6b7280]">This will activate the membership</p>
              </div>
            </div>
            <p className="text-sm text-[#6b7280] mb-4">
              Verify this payment and activate the membership for <strong>{verifyTarget.request.full_name}</strong>? This will:
            </p>
            <ul className="text-sm text-[#6b7280] space-y-1 mb-4 list-disc list-inside">
              <li>Mark the payment submission as verified</li>
              <li>Create an active membership</li>
              <li>Generate a membership card</li>
              <li>Notify the member</li>
            </ul>
            <p className="text-xs text-red-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleVerifyPayment} disabled={actionLoading} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Confirm & Activate'}
              </button>
              <button onClick={() => setShowVerifyConfirm(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showRejectPaymentModal && rejectPaymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRejectPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Reject Payment</h2>
            <textarea value={rejectPaymentReason} onChange={e => setRejectPaymentReason(e.target.value)} placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px]" />
            <div className="flex gap-2 mt-4">
              <button onClick={handleRejectPayment} disabled={actionLoading} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">Reject Payment</button>
              <button onClick={() => { setShowRejectPaymentModal(false); setRejectPaymentTarget(null); setRejectPaymentReason(''); }} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showInfoModal && infoTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Request More Information</h2>
            <textarea value={infoMessage} onChange={e => setInfoMessage(e.target.value)} placeholder="What information do you need from the member?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[100px]" />
            <div className="flex gap-2 mt-4">
              <button onClick={handleRequestInfo} disabled={actionLoading || !infoMessage.trim()} className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium disabled:opacity-50">Send Request</button>
              <button onClick={() => { setShowInfoModal(false); setInfoTarget(null); setInfoMessage(''); }} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
