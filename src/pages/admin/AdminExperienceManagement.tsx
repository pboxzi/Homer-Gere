import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Search, X, CheckCircle, XCircle, Eye,
  ChevronLeft, ChevronRight, Loader2, CreditCard,
  MessageCircle,
} from 'lucide-react';
import {
  experienceRequestsRepository,
  paymentRequestsRepository,
  paymentSubmissionsRepository,
  profilesRepository,
} from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { ExperienceRequest, PaymentRequest, PaymentSubmission, Profile } from '../../types/database';

const PAGE_SIZE = 10;

type FilterTab = 'all' | 'pending' | 'awaiting_payment' | 'payment_submitted' | 'confirmed' | 'rejected';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending Review' },
  { key: 'awaiting_payment', label: 'Awaiting Payment' },
  { key: 'payment_submitted', label: 'Payment Submitted' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
  under_review: 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20',
  approved: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
  declined: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
  completed: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
  instructions_sent: 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20',
  submitted: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
  under_review: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20',
  approved: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
  rejected: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
};

const SUBMISSION_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20',
  verified: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20',
  rejected: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20',
  needs_info: 'bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/20',
};

interface EnrichedExperienceRequest {
  exp: ExperienceRequest;
  paymentRequest: PaymentRequest | null;
  paymentSubmission: PaymentSubmission | null;
  profile: Profile | null;
  category: FilterTab;
}

function classifyRequest(
  exp: ExperienceRequest,
  paymentRequests: PaymentRequest[],
  paymentSubmissions: PaymentSubmission[]
): FilterTab {
  if (exp.status === 'completed') return 'confirmed';
  if (exp.status === 'declined') return 'rejected';

  const pr = paymentRequests.find(
    (r) => r.payment_type === 'experience' && r.related_record_id === exp.id
  );

  if (exp.status === 'pending' || exp.status === 'under_review') {
    if (!pr) return 'pending';
  }

  if (exp.status === 'approved') {
    if (!pr) return 'awaiting_payment';
    const sub = paymentSubmissions.find((s) => s.payment_request_id === pr.id);
    if (!sub) return 'awaiting_payment';
    if (sub.status === 'pending') return 'payment_submitted';
    if (sub.status === 'verified' || sub.status === 'needs_info') return 'payment_submitted';
    return 'awaiting_payment';
  }

  return 'pending';
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014';
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
}

const StatusBadge: React.FC<{ status: string; styles?: Record<string, string> }> = ({
  status,
  styles = STATUS_BADGE_STYLES,
}) => (
  <span
    className={`text-xs px-2.5 py-1 rounded-full font-semibold w-fit ${
      styles[status] || 'bg-[#57534E]/10 text-[#57534E] border border-[#57534E]/15'
    }`}
  >
    {status.replace(/_/g, ' ')}
  </span>
);
export default function AdminExperienceManagement() {
  const [allRequests, setAllRequests] = useState<ExperienceRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentSubmissions, setPaymentSubmissions] = useState<PaymentSubmission[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<EnrichedExperienceRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [paymentAdminNote, setPaymentAdminNote] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expReqs, payReqs, paySubs] = await Promise.all([
        experienceRequestsRepository.getAll(),
        paymentRequestsRepository.getAll(),
        paymentSubmissionsRepository.getAll(),
      ]);
      setAllRequests(expReqs);
      setPaymentRequests(payReqs);
      setPaymentSubmissions(paySubs);

      const userIds = [...new Set(expReqs.map((r) => r.user_id).filter(Boolean))] as string[];
      const profileMap: Record<string, Profile> = {};
      await Promise.all(
        userIds.map(async (uid) => {
          try {
            const p = await profilesRepository.getById(uid);
            if (p) profileMap[uid] = p;
          } catch {
            /* skip */
          }
        })
      );
      setProfiles(profileMap);
    } catch (e) {
      console.error('Failed to load experience management data:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const enrichedRequests = useMemo<EnrichedExperienceRequest[]>(() => {
    return allRequests.map((exp) => {
      const pr =
        paymentRequests.find(
          (r) => r.payment_type === 'experience' && r.related_record_id === exp.id
        ) || null;
      const sub = pr
        ? paymentSubmissions.find((s) => s.payment_request_id === pr.id) || null
        : null;
      const profile = exp.user_id ? profiles[exp.user_id] || null : null;
      const category = classifyRequest(exp, paymentRequests, paymentSubmissions);
      return { exp, paymentRequest: pr, paymentSubmission: sub, profile, category };
    });
  }, [allRequests, paymentRequests, paymentSubmissions, profiles]);

  const filtered = useMemo(() => {
    let result = enrichedRequests;
    if (filter !== 'all') {
      result = result.filter((r) => r.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.exp.full_name.toLowerCase().includes(q) ||
          r.exp.email.toLowerCase().includes(q) ||
          r.exp.experience_type.toLowerCase().includes(q) ||
          r.exp.request_number.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enrichedRequests, filter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const s: Record<FilterTab, number> = {
      all: enrichedRequests.length,
      pending: 0,
      awaiting_payment: 0,
      payment_submitted: 0,
      confirmed: 0,
      rejected: 0,
    };
    for (const r of enrichedRequests) {
      s[r.category]++;
    }
    return s;
  }, [enrichedRequests]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const resetForms = () => {
    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentCurrency('USD');
    setPaymentMethod('');
    setPaymentInstructions('');
    setPaymentDeadline('');
    setPaymentAdminNote('');
    setShowRejectModal(false);
    setRejectReason('');
    setShowInfoModal(false);
    setInfoMessage('');
  };

  const handleApproveWithPayment = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      const { exp } = selectedRequest;
      await experienceRequestsRepository.updateStatus(exp.id, 'approved');

      await paymentRequestsRepository.create({
        user_id: exp.user_id || '',
        payment_type: 'experience',
        related_record_id: exp.id,
        payment_method: paymentMethod || null,
        amount: Number(paymentAmount) || 0,
        currency: paymentCurrency,
        payment_instructions: paymentInstructions || null,
        due_date: paymentDeadline || null,
        admin_notes: paymentAdminNote || null,
      });

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.experienceApproved(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            eventDate: exp.event_date || exp.preferred_date || 'TBD',
          });
          await notifyService.experiencePaymentRequired(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            amount: paymentAmount || '0',
            currency: paymentCurrency,
            paymentInstructions: paymentInstructions || '',
          });
        }
      }

      setSuccessMsg('Experience approved with payment request');
      resetForms();
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error approving experience');
    }
    setActionLoading(false);
  };

  const handleApproveWithoutPayment = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      const { exp } = selectedRequest;
      await experienceRequestsRepository.updateStatus(exp.id, 'approved');

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.experienceApproved(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            eventDate: exp.event_date || exp.preferred_date || 'TBD',
          });
        }
      }

      setSuccessMsg('Experience approved without payment');
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error approving experience');
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const { exp } = selectedRequest;
      await experienceRequestsRepository.update(exp.id, {
        status: 'declined',
        rejection_reason: rejectReason,
      });

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.experienceRejected(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            rejectionReason: rejectReason,
          });
        }
      }

      setSuccessMsg('Experience request rejected');
      resetForms();
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error rejecting experience');
    }
    setActionLoading(false);
  };

  const handleRequestInfo = async () => {
    if (!selectedRequest || !infoMessage.trim()) return;
    setActionLoading(true);
    try {
      const { exp } = selectedRequest;
      await experienceRequestsRepository.update(exp.id, { admin_notes: infoMessage });

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.experienceApproved(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            eventDate: exp.event_date || exp.preferred_date || 'TBD',
          });
        }
      }

      setSuccessMsg('More info requested');
      resetForms();
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error requesting info');
    }
    setActionLoading(false);
  };

  const handleApprovePayment = async () => {
    if (!selectedRequest || !selectedRequest.paymentSubmission || !selectedRequest.paymentRequest) return;
    setActionLoading(true);
    try {
      const { exp, paymentSubmission: sub, paymentRequest: pr } = selectedRequest;
      await paymentSubmissionsRepository.verify(sub.id, 'admin');
      await paymentRequestsRepository.updateStatus(pr.id, 'approved', 'admin');
      await experienceRequestsRepository.confirmExperience(exp.id);

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.experienceConfirmed(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            experienceType: exp.experience_type,
            eventDate: exp.event_date || exp.preferred_date || 'TBD',
            eventLocation: exp.event_location || 'TBD',
          });
        }
      }

      setSuccessMsg('Payment approved and experience confirmed');
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error approving payment');
    }
    setActionLoading(false);
  };

  const handleRejectPayment = async () => {
    if (!selectedRequest || !selectedRequest.paymentSubmission || !selectedRequest.paymentRequest || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const { paymentSubmission: sub, paymentRequest: pr, exp } = selectedRequest;
      await paymentSubmissionsRepository.reject(sub.id, rejectReason);
      await paymentRequestsRepository.updateStatus(pr.id, 'rejected');

      if (exp.user_id) {
        const profile = profiles[exp.user_id];
        if (profile) {
          await notifyService.paymentRejected(exp.user_id, {
            email: profile.email,
            fullName: `${profile.first_name} ${profile.last_name}`.trim(),
            reason: rejectReason,
          });
        }
      }

      setSuccessMsg('Payment rejected');
      resetForms();
      setShowDetail(false);
      setSelectedRequest(null);
      loadData();
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error rejecting payment');
    }
    setActionLoading(false);
  };

  const openPaymentForm = () => {
    resetForms();
    setShowPaymentForm(true);
  };

  const openRejectModal = () => {
    resetForms();
    setShowRejectModal(true);
  };

  const openInfoModal = () => {
    resetForms();
    setShowInfoModal(true);
  };

  const renderDetailContent = () => {
    if (!selectedRequest) return null;
    const { exp, paymentRequest: pr, paymentSubmission: sub } = selectedRequest;

    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#1C1917]">{exp.experience_type}</h3>
            <p className="text-xs text-[#57534E] mt-0.5 font-mono">{exp.request_number}</p>
          </div>
          <StatusBadge status={exp.status} />
        </div>

        <div className="rounded-xl border border-[#A6852F]/20 bg-[#A6852F]/5 p-4 space-y-3">
          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-bold">Requester Information</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#57534E]">Name:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.full_name}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Email:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.email}</span>
            </div>
            {exp.phone && (
              <div>
                <span className="text-[#57534E]">Phone:</span>{' '}
                <span className="font-medium text-[#1C1917]">{exp.phone}</span>
              </div>
            )}
            {exp.country && (
              <div>
                <span className="text-[#57534E]">Country:</span>{' '}
                <span className="font-medium text-[#1C1917]">{exp.country}</span>
              </div>
            )}
            {exp.organization && (
              <div>
                <span className="text-[#57534E]">Organization:</span>{' '}
                <span className="font-medium text-[#1C1917]">{exp.organization}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E8E5DF]/40 p-4 space-y-3">
          <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-bold">Experience Details</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#57534E]">Experience Type:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.experience_type}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Preferred Date:</span>{' '}
              <span className="font-medium text-[#1C1917]">{formatDate(exp.preferred_date || exp.event_date)}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Event Date:</span>{' '}
              <span className="font-medium text-[#1C1917]">{formatDate(exp.event_date)}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Location:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.event_location || '\u2014'}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Guests:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.num_guests || 1}</span>
            </div>
            <div>
              <span className="text-[#57534E]">Budget:</span>{' '}
              <span className="font-medium text-[#1C1917]">{exp.budget || '\u2014'}</span>
            </div>
          </div>
          {exp.purpose && (
            <div className="text-xs">
              <span className="text-[#57534E]">Purpose:</span>
              <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2">{exp.purpose}</p>
            </div>
          )}
          {exp.special_requirements && (
            <div className="text-xs">
              <span className="text-[#57534E]">Special Requirements:</span>
              <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2">{exp.special_requirements}</p>
            </div>
          )}
          {exp.additional_details && (
            <div className="text-xs">
              <span className="text-[#57534E]">Additional Details:</span>
              <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2">{exp.additional_details}</p>
            </div>
          )}
        </div>

        {exp.status === 'completed' && exp.confirmed_at && (
          <div className="rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/5 p-4">
            <p className="text-[10px] text-[#16A34A] uppercase tracking-wider font-bold">Confirmed</p>
            <p className="text-xs text-[#1C1917] mt-1">
              Confirmed on {formatDate(exp.confirmed_at)}
            </p>
          </div>
        )}

        {exp.status === 'declined' && exp.rejection_reason && (
          <div className="rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4">
            <p className="text-[10px] text-[#DC2626] uppercase tracking-wider font-bold">Rejection Reason</p>
            <p className="text-xs text-[#1C1917] mt-1">{exp.rejection_reason}</p>
          </div>
        )}

        {pr && (
          <div className="rounded-xl border border-[#E8E5DF]/40 p-4 space-y-3">
            <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-bold">Payment Request</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#57534E]">Request #:</span>{' '}
                <span className="font-medium text-[#1C1917] font-mono">{pr.request_number}</span>
              </div>
              <div>
                <span className="text-[#57534E]">Amount:</span>{' '}
                <span className="font-medium text-[#1C1917]">
                  {pr.amount} {pr.currency}
                </span>
              </div>
              {pr.payment_method && (
                <div>
                  <span className="text-[#57534E]">Method:</span>{' '}
                  <span className="font-medium text-[#1C1917]">{pr.payment_method}</span>
                </div>
              )}
              <div>
                <span className="text-[#57534E]">Status:</span>{' '}
                <StatusBadge status={pr.status} styles={PAYMENT_STATUS_STYLES} />
              </div>
              {pr.due_date && (
                <div>
                  <span className="text-[#57534E]">Due Date:</span>{' '}
                  <span className="font-medium text-[#1C1917]">{formatDate(pr.due_date)}</span>
                </div>
              )}
            </div>
            {pr.payment_instructions && (
              <div className="text-xs">
                <span className="text-[#57534E]">Payment Instructions:</span>
                <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2 whitespace-pre-wrap">
                  {pr.payment_instructions}
                </p>
              </div>
            )}
            {pr.admin_notes && (
              <div className="text-xs">
                <span className="text-[#57534E]">Internal Note:</span>
                <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2">{pr.admin_notes}</p>
              </div>
            )}
          </div>
        )}

        {sub && (
          <div className="rounded-xl border border-[#E8E5DF]/40 p-4 space-y-3">
            <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-bold">Payment Submission</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#57534E]">Submission #:</span>{' '}
                <span className="font-medium text-[#1C1917] font-mono">{sub.submission_number}</span>
              </div>
              <div>
                <span className="text-[#57534E]">Amount Paid:</span>{' '}
                <span className="font-medium text-[#1C1917]">
                  {sub.amount_paid} {sub.currency}
                </span>
              </div>
              <div>
                <span className="text-[#57534E]">Transaction Ref:</span>{' '}
                <span className="font-medium text-[#1C1917] font-mono">{sub.transaction_reference}</span>
              </div>
              <div>
                <span className="text-[#57534E]">Payment Date:</span>{' '}
                <span className="font-medium text-[#1C1917]">{sub.payment_date}</span>
              </div>
              <div>
                <span className="text-[#57534E]">Status:</span>{' '}
                <StatusBadge status={sub.status} styles={SUBMISSION_STATUS_STYLES} />
              </div>
              <div>
                <span className="text-[#57534E]">Submitted:</span>{' '}
                <span className="font-medium text-[#1C1917]">{formatDate(sub.submitted_at)}</span>
              </div>
            </div>
            {sub.notes && (
              <div className="text-xs">
                <span className="text-[#57534E]">Notes:</span>
                <p className="mt-1 text-[#1C1917] bg-white/60 rounded-lg p-2">{sub.notes}</p>
              </div>
            )}
            {sub.proof_url && (
              <div className="text-xs">
                <span className="text-[#57534E]">Proof:</span>{' '}
                <a
                  href={sub.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A6852F] underline"
                >
                  View Proof
                </a>
              </div>
            )}
            {sub.admin_notes && (
              <div className="text-xs">
                <span className="text-[#57534E]">Admin Notes:</span>{' '}
                <span className="font-medium text-[#1C1917]">{sub.admin_notes}</span>
              </div>
            )}
          </div>
        )}

        {exp.admin_notes && (exp.status === 'pending' || exp.status === 'under_review' || exp.status === 'approved') && !pr && (
          <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4">
            <p className="text-[10px] text-[#F59E0B] uppercase tracking-wider font-bold">Admin Notes</p>
            <p className="text-xs text-[#1C1917] mt-1">{exp.admin_notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#A6852F]" /> Experience Management
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Manage the complete experience request lifecycle from submission to confirmation
        </p>
      </div>

      {successMsg && (
        <div className="px-4 py-2.5 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium border border-[#16A34A]/20">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {FILTER_TABS.map((tab) => {
          const count = stats[tab.key] || 0;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-xl border p-3 text-center transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#A6852F]/10 border-[#A6852F]/40 shadow-md shadow-[#A6852F]/10'
                  : 'bg-white border-[#E8E5DF]/40 hover:bg-[#F3F1ED]/50 hover:shadow-md'
              }`}
            >
              <div className={`text-xl font-bold ${isActive ? 'text-[#A6852F]' : 'text-[#1C1917]'}`}>
                {count}
              </div>
              <div
                className={`text-[9px] font-medium uppercase tracking-wider mt-0.5 ${
                  isActive ? 'text-[#A6852F]' : 'text-[#57534E]'
                }`}
              >
                {tab.key === 'all'
                  ? 'Total'
                  : tab.key === 'awaiting_payment'
                  ? 'Awaiting'
                  : tab.key === 'payment_submitted'
                  ? 'Submitted'
                  : tab.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === tab.key
                ? 'bg-[#A6852F] text-white'
                : 'bg-[#F3F1ED] text-[#57534E] hover:bg-[#E8E5DF]'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && stats[tab.key] > 0 && (
              <span className="ml-1 text-[10px]">({stats[tab.key]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, type, or request #..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A6852F]/40 focus:ring-2 focus:ring-[#A6852F]/10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
        </div>
      ) : paged.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-[#57534E]/20 mx-auto mb-3" />
          <p className="text-sm text-[#57534E]">No experience requests found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-2xl border border-[#A6852F]/15 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#A6852F]/5 via-[#C9A84C]/3 to-[#FAF9F7] border-b border-[#A6852F]/15">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Request #
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="text-right px-5 py-3.5 text-[10px] font-bold text-[#A6852F] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map(({ exp, profile, paymentRequest: pr, paymentSubmission: sub }) => (
                  <tr
                    key={exp.id}
                    className="border-b border-[#E8E5DF]/20 last:border-0 hover:bg-gradient-to-r hover:from-[#A6852F]/5 hover:to-transparent transition-all duration-300 group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-[#57534E]">{exp.request_number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md shadow-[#A6852F]/20 group-hover:shadow-lg group-hover:shadow-[#A6852F]/30 transition-shadow">
                          {exp.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1C1917]">{exp.full_name}</p>
                          <p className="text-[10px] text-[#57534E]">{exp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-[#1C1917]">{exp.experience_type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={exp.status} />
                        {pr && (
                          <StatusBadge
                            status={sub ? sub.status : pr.status}
                            styles={sub ? SUBMISSION_STATUS_STYLES : PAYMENT_STATUS_STYLES}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#57534E] font-medium">
                      {formatRelative(exp.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedRequest({
                              exp,
                              paymentRequest: pr,
                              paymentSubmission: sub,
                              profile,
                              category: classifyRequest(exp, paymentRequests, paymentSubmissions),
                            });
                            setShowDetail(true);
                            resetForms();
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-[#A6852F]/10 rounded-2xl border border-[#A6852F]/15 bg-white overflow-hidden">
            {paged.map(({ exp, profile, paymentRequest: pr, paymentSubmission: sub }) => (
              <div
                key={exp.id}
                className="p-4 space-y-3 hover:bg-gradient-to-r hover:from-[#A6852F]/5 hover:to-transparent transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-[#A6852F]/20">
                      {exp.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1C1917]">{exp.full_name}</p>
                      <p className="text-[11px] text-[#57534E]">{exp.experience_type}</p>
                      <p className="text-[10px] text-[#57534E] font-mono">{exp.request_number}</p>
                    </div>
                  </div>
                  <StatusBadge status={exp.status} />
                </div>
                {pr && (
                  <div className="flex flex-col gap-1">
                    <StatusBadge
                      status={sub ? sub.status : pr.status}
                      styles={sub ? SUBMISSION_STATUS_STYLES : PAYMENT_STATUS_STYLES}
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-[#A6852F]/10">
                  <button
                    onClick={() => {
                      setSelectedRequest({
                        exp,
                        paymentRequest: pr,
                        paymentSubmission: sub,
                        profile,
                        category: classifyRequest(exp, paymentRequests, paymentSubmissions),
                      });
                      setShowDetail(true);
                      resetForms();
                    }}
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">
                {filtered.length} requests &middot; Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-[#F3F1ED] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#57534E]" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-[#F3F1ED] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#57534E]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showDetail && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => { setShowDetail(false); setSelectedRequest(null); resetForms(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#A6852F]/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5DF]/40 sticky top-0 bg-white z-10">
                <h2 className="text-sm font-semibold text-[#1C1917]">Experience Request Details</h2>
                <button
                  onClick={() => { setShowDetail(false); setSelectedRequest(null); resetForms(); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {renderDetailContent()}

                {selectedRequest.exp.status === 'pending' || selectedRequest.exp.status === 'under_review' ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={openPaymentForm}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Approve with Payment
                    </button>
                    <button
                      onClick={handleApproveWithoutPayment}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Without Payment
                    </button>
                    <button
                      onClick={openRejectModal}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={openInfoModal}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#57534E] bg-[#F3F1ED] hover:bg-[#E8E5DF] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Request More Info
                    </button>
                  </div>
                ) : selectedRequest.exp.status === 'approved' && !selectedRequest.paymentSubmission ? (
                  <div className="mt-4 p-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                    <p className="text-xs text-[#3B82F6] font-medium">Awaiting member payment submission</p>
                  </div>
                ) : selectedRequest.paymentSubmission && (selectedRequest.paymentSubmission.status === 'pending' || selectedRequest.paymentSubmission.status === 'needs_info') ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={handleApprovePayment}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Payment
                    </button>
                    <button
                      onClick={openRejectModal}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Payment
                    </button>
                  </div>
                ) : null}

                <AnimatePresence>
                  {showPaymentForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-xl border border-[#A6852F]/20 bg-[#FAF9F7] p-4 space-y-3">
                        <p className="text-[10px] text-[#A6852F] uppercase tracking-wider font-bold">Payment Instructions</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-[#57534E] font-medium mb-1">Amount *</label>
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#57534E] font-medium mb-1">Currency</label>
                            <input
                              value={paymentCurrency}
                              onChange={(e) => setPaymentCurrency(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                              placeholder="USD"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#57534E] font-medium mb-1">Payment Method</label>
                          <input
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                            placeholder="e.g. Bank Transfer, Mobile Money"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#57534E] font-medium mb-1">Payment Instructions *</label>
                          <textarea
                            value={paymentInstructions}
                            onChange={(e) => setPaymentInstructions(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 resize-none"
                            placeholder="Enter detailed payment instructions for the member..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-[#57534E] font-medium mb-1">Deadline (optional)</label>
                            <input
                              type="date"
                              value={paymentDeadline}
                              onChange={(e) => setPaymentDeadline(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#57534E] font-medium mb-1">Internal Note (optional)</label>
                            <input
                              value={paymentAdminNote}
                              onChange={(e) => setPaymentAdminNote(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
                              placeholder="Admin-only note"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleApproveWithPayment}
                            disabled={actionLoading || !paymentAmount || !paymentInstructions}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : 'Submit'}
                          </button>
                          <button
                            onClick={() => setShowPaymentForm(false)}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-[#57534E] bg-white border border-[#E8E5DF]/60 hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-[#A6852F]/10 p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#DC2626]/10">
                  <XCircle className="w-4 h-4 text-[#DC2626]" />
                </div>
                <h4 className="text-sm font-medium text-[#1C1917]">Reject Request</h4>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#DC2626]/40 resize-none mb-4"
                placeholder="Enter rejection reason..."
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedRequest?.paymentSubmission ? handleRejectPayment : handleReject}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : 'Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => { setShowInfoModal(false); setInfoMessage(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-[#A6852F]/10 p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F59E0B]/10">
                  <MessageCircle className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <h4 className="text-sm font-medium text-[#1C1917]">Request More Info</h4>
              </div>
              <textarea
                value={infoMessage}
                onChange={(e) => setInfoMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 resize-none mb-4"
                placeholder="What additional information do you need?"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setShowInfoModal(false); setInfoMessage(''); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestInfo}
                  disabled={actionLoading || !infoMessage.trim()}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#A6852F] hover:bg-[#8B6F1F] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : 'Send'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
