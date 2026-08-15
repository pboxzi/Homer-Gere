import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Check, Shield, Zap, Calendar, CreditCard, Clock, Star, X, Send, AlertCircle, Upload, FileCheck, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAuth } from '../../context/AuthContext';
import { membershipRequestsRepository, paymentRequestsRepository, paymentSubmissionsRepository, membershipCardsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';
import type { MembershipTier } from '../../types';
import type { PaymentRequest as DbPaymentRequest, PaymentSubmission, MembershipCard } from '../../types/database';

const TIER_ICONS: Record<string, React.ReactNode> = {
  silver: <Shield className="w-4 h-4" />,
  gold: <Crown className="w-4 h-4" />,
  platinum: <Zap className="w-4 h-4" />,
};

const TIER_COLORS: Record<string, string> = {
  silver: '#9CA3AF',
  gold: '#A6852F',
  platinum: '#8B5CF6',
};

const PROGRESS_STEPS = ['Pending', 'Approved', 'Payment Submitted', 'Under Review', 'Payment Approved', 'Active'];

function downloadCard(card: MembershipCard) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#A6852F"/>
        <stop offset="100%" style="stop-color:#8B6F24"/>
      </linearGradient>
    </defs>
    <rect width="600" height="380" rx="20" fill="url(#bg)"/>
    <text x="40" y="60" fill="white" font-family="sans-serif" font-size="26" font-weight="bold" letter-spacing="4">HOMER GERE</text>
    <text x="40" y="85" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-size="12" letter-spacing="6">CLUB</text>
    <text x="40" y="200" fill="white" font-family="monospace" font-size="30" letter-spacing="5">${card.card_number}</text>
    <text x="40" y="290" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="10" letter-spacing="2">ISSUED</text>
    <text x="40" y="315" fill="white" font-family="sans-serif" font-size="16">${formatDate(card.issue_date) || 'N/A'}</text>
    <text x="250" y="290" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="10" letter-spacing="2">EXPIRES</text>
    <text x="250" y="315" fill="white" font-family="sans-serif" font-size="16">${card.expiry_date ? formatDate(card.expiry_date) : 'No Expiry'}</text>
    <text x="460" y="290" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="10" letter-spacing="2">DESIGN</text>
    <text x="460" y="315" fill="white" font-family="sans-serif" font-size="16" text-transform="capitalize">${(card.card_design || 'gold').toUpperCase()}</text>
  </svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `homer-gere-card-${card.card_number}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const getProgressStep = (status: string): number => {
  const map: Record<string, number> = {
    pending: 0,
    approved_for_payment: 1,
    payment_submitted: 2,
    payment_under_review: 3,
    payment_approved: 4,
    membership_active: 5,
    rejected: -1,
  };
  return map[status] ?? 0;
};

export const DashboardMembership: React.FC = () => {
  const { user, profile } = useAuth();
  const { membership, membershipPlan, membershipRequests, paymentRequests, paymentSubmissions, logActivity, refreshData } = useDashboard();
  const { membershipTiers } = useSiteContent();

  const [selectedPlan, setSelectedPlan] = useState<MembershipTier | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<DbPaymentRequest | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ transactionReference: '', notes: '' });
  const [uploading, setUploading] = useState(false);

  const [card, setCard] = useState<MembershipCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');

  const [historyExpanded, setHistoryExpanded] = useState(false);

  const activeRequest = membershipRequests.find((r) => r.status !== 'rejected' && r.status !== 'membership_active');
  const pastRequests = membershipRequests.filter((r) => r.status === 'rejected' || r.status === 'membership_active');

  const activePayReq = activeRequest
    ? paymentRequests.find((pr) => pr.related_record_id === activeRequest.id && pr.payment_type === 'membership')
    : null;

  const activePaySub = activePayReq
    ? paymentSubmissions.find((ps) => ps.payment_request_id === activePayReq.id)
    : null;

  const isActive = membership?.status === 'active';
  const hasActiveRequest = !!activeRequest;
  const needsPayment = activeRequest?.status === 'approved_for_payment' && activePayReq && !activePaySub;
  const proofSubmitted = !!activePaySub;
  const proofRejected = activePaySub?.status === 'rejected';
  const isRejected = activeRequest?.status === 'rejected';

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const loadCard = useCallback(async () => {
    if (!user?.id) return;
    setLoadingCard(true);
    try {
      setCard(await membershipCardsRepository.getActiveByUserId(user.id));
    } catch { /* silent */ }
    setLoadingCard(false);
  }, [user?.id]);

  useEffect(() => {
    if (isActive) loadCard();
  }, [isActive, loadCard]);

  const daysUntilExpiry = membership?.end_date
    ? Math.ceil((new Date(membership.end_date).getTime() - Date.now()) / 86400000)
    : null;

  const handleSelectPlan = (plan: MembershipTier) => {
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan || !user?.id || !profile) return;
    setActionLoading(true);
    try {
      const requestData = {
        user_id: user.id,
        full_name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        phone: profile.phone || null,
        country: profile.country || null,
        membership_plan_id: selectedPlan.id,
        membership_plan_name: selectedPlan.name,
        duration: selectedPlan.period || 'monthly',
        preferred_payment_method: null,
        currency: 'USD',
        notes: null,
      };
      const created = await membershipRequestsRepository.create(requestData);
      await notifyService.membershipRequestReceived(user.id, {
        fullName: requestData.full_name,
        email: requestData.email,
        planName: requestData.membership_plan_name,
        requestNumber: created.request_number,
      });
      await logActivity('create', 'membership', `Membership request submitted: ${selectedPlan.name}`, { membership_plan_id: selectedPlan.id, request_number: created.request_number });
      setSuccessMsg('Membership request submitted successfully');
      setShowConfirmModal(false);
      setSelectedPlan(null);
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const openUploadModal = (payReq: DbPaymentRequest) => {
    setUploadTarget(payReq);
    setUploadForm({ transactionReference: '', notes: '' });
    setProofFile(null);
    setProofPreview(null);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setSuccessMsg('File must be under 10MB');
      return;
    }
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadProofFile = async (userId: string): Promise<string | null> => {
    if (!proofFile) return null;
    setUploading(true);
    try {
      const ext = proofFile.name.split('.').pop() || 'jpg';
      const path = `payment-proofs/${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, proofFile, { contentType: proofFile.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      return urlData?.publicUrl || null;
    } catch (e) {
      console.error('Upload failed:', e);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!uploadTarget || !user?.id || !uploadForm.transactionReference || !proofFile) return;
    setUploading(true);
    try {
      const proofUrl = await uploadProofFile(user.id);
      await paymentSubmissionsRepository.create({
        payment_request_id: uploadTarget.id,
        user_id: user.id,
        transaction_reference: uploadForm.transactionReference,
        amount_paid: uploadTarget.amount,
        currency: uploadTarget.currency,
        payment_date: new Date().toISOString().split('T')[0],
        proof_url: proofUrl,
        notes: uploadForm.notes || null,
      });
      await paymentRequestsRepository.updateStatus(uploadTarget.id, 'submitted');
      await notifyService.paymentSubmitted(user.id, {
        email: user?.email || '',
        fullName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
        amount: String(uploadTarget.amount),
        currency: uploadTarget.currency,
        transactionReference: uploadForm.transactionReference,
      });
      setSuccessMsg('Payment proof submitted for review');
      setShowUploadModal(false);
      setUploadTarget(null);
      setProofFile(null);
      setProofPreview(null);
      setUploadForm({ transactionReference: '', notes: '' });
      await logActivity('submit', 'payment', `Payment submitted: ${uploadTarget.currency} ${uploadTarget.amount}`, { payment_request_id: uploadTarget.id });
      refreshData();
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handleViewCard = () => {
    if (card) downloadCard(card);
  };

  // STAGE 8: Active Membership
  if (isActive) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
          <p className="text-sm text-[#57534E] mt-1">Your active membership and card details.</p>
        </motion.div>

        {successMsg && (
          <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#166534] px-4 py-3 rounded-xl text-sm shadow-sm">{successMsg}</div>
        )}

        {/* Active Membership Card */}
        <motion.div className="rounded-2xl border border-[#16A34A]/30 bg-gradient-to-br from-[#16A34A]/10 via-[#16A34A]/5 to-transparent p-6 shadow-lg shadow-[#16A34A]/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/20 flex items-center justify-center text-[#16A34A] shadow-lg shadow-[#16A34A]/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-editorial text-[#1C1917]">{membershipPlan?.name || 'Member'}</h3>
              <p className="text-xs text-[#16A34A] font-medium">Membership Active</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl border border-[#16A34A]/20 bg-white/50">
              <Calendar className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
              <p className="text-xs font-medium text-[#1C1917]">{membership?.start_date ? formatDate(membership.start_date) : '—'}</p>
              <p className="text-[10px] text-[#57534E]">Start Date</p>
            </div>
            <div className="text-center p-3 rounded-xl border border-[#16A34A]/20 bg-white/50">
              <Clock className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
              <p className="text-xs font-medium text-[#1C1917]">{membership?.end_date ? formatDate(membership.end_date) : '—'}</p>
              <p className="text-[10px] text-[#57534E]">Expiry Date</p>
            </div>
            <div className="text-center p-3 rounded-xl border border-[#16A34A]/20 bg-white/50">
              <CreditCard className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
              <p className="text-xs font-medium text-[#1C1917]">{membership?.auto_renew ? 'Auto' : 'Manual'}</p>
              <p className="text-[10px] text-[#57534E]">Renewal</p>
            </div>
            <div className="text-center p-3 rounded-xl border border-[#16A34A]/20 bg-white/50">
              <Star className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
              <p className="text-xs font-medium text-[#1C1917]">{daysUntilExpiry !== null ? `${daysUntilExpiry} days` : '—'}</p>
              <p className="text-[10px] text-[#57534E]">Until Expiry</p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        {membershipPlan?.features && membershipPlan.features.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="text-sm font-medium text-[#1C1917] mb-3">Your Benefits</h3>
            <div className="rounded-2xl border border-[#16A34A]/15 bg-white p-4 shadow-sm">
              <ul className="space-y-2.5">
                {(Array.isArray(membershipPlan.features) ? membershipPlan.features : []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                    <span className="text-[#1C1917]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Membership Card */}
        {loadingCard ? (
          <div className="text-center py-6 text-[#57534E] text-sm">Loading card...</div>
        ) : card ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h3 className="text-sm font-medium text-[#1C1917] mb-3">Membership Card</h3>
            <div className="bg-gradient-to-br from-[#A6852F] to-[#8B6F24] rounded-2xl p-5 sm:p-8 text-white shadow-xl shadow-[#A6852F]/20 max-w-md">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-lg font-bold tracking-[0.15em]">HOMER GERE</div>
                  <div className="text-xs opacity-70 tracking-[0.3em]">CLUB</div>
                </div>
                <CreditCard className="w-8 h-8 opacity-80" />
              </div>
              <div className="font-mono text-2xl tracking-[0.2em] mb-8">{card.card_number}</div>
              <div className="flex items-end justify-between text-sm">
                <div>
                  <div className="text-[10px] opacity-60 uppercase tracking-wider">Issued</div>
                  <div className="font-medium">{formatDate(card.issue_date)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-60 uppercase tracking-wider">Expires</div>
                  <div className="font-medium">{card.expiry_date ? formatDate(card.expiry_date) : 'No Expiry'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-60 uppercase tracking-wider">Design</div>
                  <div className="font-medium capitalize">{card.card_design}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4 max-w-md">
              <button onClick={handleViewCard} className="flex-1 py-2.5 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Download className="w-4 h-4" /> Download Card
              </button>
            </div>
          </motion.div>
        ) : null}

        {/* Past Requests */}
        {pastRequests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <button onClick={() => setHistoryExpanded(!historyExpanded)} className="flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer">
              Request History ({pastRequests.length})
              {historyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {historyExpanded && (
              <div className="mt-3 space-y-2">
                {pastRequests.map((req) => (
                  <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/15 bg-white">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${req.status === 'membership_active' ? 'bg-[#16A34A]/15 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1917]">{req.membership_plan_name}</p>
                      <p className="text-[10px] text-[#57534E]">{req.request_number} · {req.duration} plan</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${req.status === 'membership_active' ? 'bg-[#16A34A]/15 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                      {req.status === 'membership_active' ? 'Active' : 'Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // STAGES 1-7: No active membership — handle request lifecycle
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Select a plan, track your request, and manage your membership.</p>
      </motion.div>

      {successMsg && (
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#166534] px-4 py-3 rounded-xl text-sm shadow-sm">{successMsg}</div>
      )}

      {/* STAGE 3: Request Submitted — show progress card */}
      {hasActiveRequest && activeRequest && (
        <motion.div className="rounded-2xl border border-[#A6852F]/25 bg-white overflow-hidden shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-xs text-[#57534E]">{activeRequest.request_number}</div>
                <h3 className="text-lg font-editorial text-[#1C1917] mt-1">{activeRequest.membership_plan_name}</h3>
                <p className="text-xs text-[#57534E] capitalize">{activeRequest.duration} plan</p>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                isRejected ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                activeRequest.status === 'membership_active' ? 'bg-[#16A34A]/15 text-[#16A34A]' :
                'bg-[#F59E0B]/15 text-[#F59E0B]'
              }`}>
                {isRejected ? 'Rejected' : activeRequest.status === 'membership_active' ? 'Active' : activeRequest.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Progress Bar */}
            {!isRejected && (
              <div className="flex items-center gap-1 mt-4 mb-6">
                {PROGRESS_STEPS.map((step, i) => {
                  const currentStep = getProgressStep(activeRequest.status);
                  return (
                    <div key={step} className="flex-1">
                      <div className={`h-2 rounded-full transition-all ${i <= currentStep ? 'bg-[#A6852F]' : 'bg-gray-200'}`} />
                      <div className={`text-[10px] mt-1 text-center ${i <= currentStep ? 'text-[#A6852F] font-medium' : 'text-[#57534E]'}`}>{step}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Request Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#57534E]">Requested:</span><div className="font-medium">{formatDate(activeRequest.requested_at)}</div></div>
              <div><span className="text-[#57534E]">Currency:</span><div className="font-medium">{activeRequest.currency}</div></div>
            </div>

            {/* STAGE 7: Rejected */}
            {isRejected && activeRequest.rejection_reason && (
              <div className="mt-4 p-4 bg-[#DC2626]/8 border border-[#DC2626]/20 rounded-xl">
                <p className="text-xs font-medium text-[#DC2626] mb-1">Rejection Reason</p>
                <p className="text-sm text-[#1C1917]">{activeRequest.rejection_reason}</p>
              </div>
            )}

            {/* STAGE 4: Payment Instructions */}
            {activeRequest.status === 'approved_for_payment' && activePayReq && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-[#3B82F6]/8 border border-[#3B82F6]/20 rounded-xl">
                  <p className="text-xs font-medium text-[#3B82F6] mb-2">Payment Required</p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div><span className="text-[#3B82F6]">Amount:</span> <span className="font-medium text-[#1C1917]">{activePayReq.amount} {activePayReq.currency}</span></div>
                    {activePayReq.payment_method && <div><span className="text-[#3B82F6]">Method:</span> <span className="font-medium text-[#1C1917]">{activePayReq.payment_method}</span></div>}
                    {activePayReq.due_date && <div><span className="text-[#3B82F6]">Deadline:</span> <span className="font-medium text-[#1C1917]">{formatDate(activePayReq.due_date)}</span></div>}
                  </div>
                  {activePayReq.payment_instructions && (
                    <div className="p-3 bg-white rounded-lg border border-[#3B82F6]/10">
                      <p className="text-xs font-medium text-[#3B82F6] mb-1">Instructions</p>
                      <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{activePayReq.payment_instructions}</p>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                {!proofSubmitted && (
                  <button onClick={() => openUploadModal(activePayReq)}
                    className="w-full py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload Payment Proof
                  </button>
                )}
              </div>
            )}

            {/* STAGE 5: Proof Submitted / Under Review */}
            {proofSubmitted && activePaySub && activePaySub.status !== 'rejected' && activePaySub.status !== 'needs_info' && (
              <div className="mt-4">
                <div className={`p-4 rounded-xl border ${
                  activePaySub.status === 'verified' ? 'bg-[#16A34A]/8 border-[#16A34A]/20' :
                  'bg-[#8B5CF6]/8 border-[#8B5CF6]/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className={`w-4 h-4 ${
                      activePaySub.status === 'verified' ? 'text-[#16A34A]' : 'text-[#8B5CF6]'
                    }`} />
                    <span className={`text-xs font-medium ${
                      activePaySub.status === 'verified' ? 'text-[#16A34A]' : 'text-[#8B5CF6]'
                    }`}>
                      Payment Proof {activePaySub.status === 'verified' ? 'Verified' : 'Under Review'}
                    </span>
                  </div>
                  <div className="text-xs text-[#57534E] space-y-1">
                    <p>Reference: {activePaySub.transaction_reference}</p>
                    <p>Submitted: {formatDate(activePaySub.submitted_at)}</p>
                    {activePaySub.proof_url && (
                      <a href={activePaySub.proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#A6852F] hover:underline mt-1">
                        <Eye className="w-3 h-3" /> View Receipt
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 6: Admin Requests More Information */}
            {proofSubmitted && activePaySub && activePaySub.status === 'needs_info' && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-xs font-medium text-[#F59E0B]">More Information Requested</span>
                  </div>
                  {activePaySub.admin_notes && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-[#F59E0B]/10">
                      <p className="text-xs font-medium text-[#57534E] mb-1">Admin Message</p>
                      <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{activePaySub.admin_notes}</p>
                    </div>
                  )}
                  <div className="text-xs text-[#57534E] mt-2 space-y-1">
                    <p>Your previous submission (Ref: {activePaySub.transaction_reference}) needs updating.</p>
                  </div>
                </div>
                {activePayReq && (
                  <button onClick={() => openUploadModal(activePayReq)}
                    className="w-full py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" /> Resubmit Payment Proof
                  </button>
                )}
              </div>
            )}

            {/* STAGE 7: Payment Rejected */}
            {proofSubmitted && activePaySub && activePaySub.status === 'rejected' && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-[#DC2626]/8 border border-[#DC2626]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-xs font-medium text-[#DC2626]">Payment Rejected</span>
                  </div>
                  {activePaySub.admin_notes && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-[#DC2626]/10">
                      <p className="text-xs font-medium text-[#57534E] mb-1">Reason</p>
                      <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{activePaySub.admin_notes}</p>
                    </div>
                  )}
                  <div className="text-xs text-[#57534E] mt-2">
                    <p>Reference: {activePaySub.transaction_reference}</p>
                  </div>
                </div>
                {activePayReq && (
                  <button onClick={() => openUploadModal(activePayReq)}
                    className="w-full py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload New Payment Proof
                  </button>
                )}
              </div>
            )}

            {/* STAGE 2 (still pending): Message */}
            {activeRequest.status === 'pending' && !proofSubmitted && !needsPayment && (
              <div className="mt-4 p-4 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div className="text-sm text-[#1C1917]">
                    <p className="font-medium mb-1">Pending Admin Review</p>
                    <p className="text-xs text-[#57534E]">Our team is reviewing your request. You will receive payment instructions once approved.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* STAGE 1: Available Plans (only when no active request) */}
      {!hasActiveRequest && !isActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membershipTiers.map((tier, i) => {
            const tierColor = TIER_COLORS[tier.name.toLowerCase()] || TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div key={tier.id} className="rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-500" style={{ background: `linear-gradient(135deg, ${tierColor}F5, ${tierColor}E8 50%, ${tierColor}D9 75%, ${tierColor}E6)`, boxShadow: `0 12px 50px ${tierColor}80, 0 0 80px ${tierColor}55, inset 0 1px 0 rgba(255,255,255,0.2)` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-25" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-25" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(-25%, 25%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-8 rounded-md border border-white/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}>
                      <div className="w-6 h-4 rounded-sm bg-white/40" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {tier.isPopular && tier.badge && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">{tier.badge}</span>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-widest opacity-80 mb-1 font-medium">{tier.name}</p>
                    <p className="text-3xl font-editorial">${tier.price}<span className="text-sm font-normal opacity-70">/{tier.period}</span></p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 mb-4">
                    <p className="text-[10px] opacity-70">{tier.features.filter((f) => f.included).length} features included</p>
                    <div className="flex items-center gap-1 opacity-80">
                      {TIER_ICONS[tier.name.toLowerCase()] || TIER_ICONS[tier.id] || <Crown className="w-4 h-4" />}
                    </div>
                  </div>
                  <button onClick={() => handleSelectPlan(tier)} className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20">
                    <Send className="w-3.5 h-3.5" /> Request Membership
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Past Requests (when no active request but has history) */}
      {!hasActiveRequest && !isActive && pastRequests.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <button onClick={() => setHistoryExpanded(!historyExpanded)} className="flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer">
            Request History ({pastRequests.length})
            {historyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {historyExpanded && (
            <div className="mt-3 space-y-2">
              {pastRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/15 bg-white">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${req.status === 'membership_active' ? 'bg-[#16A34A]/15 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1917]">{req.membership_plan_name}</p>
                    <p className="text-[10px] text-[#57534E]">{req.request_number} · {req.duration} plan</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${req.status === 'membership_active' ? 'bg-[#16A34A]/15 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
                    {req.status === 'membership_active' ? 'Active' : 'Rejected'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Confirm Request Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedPlan && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !actionLoading && setShowConfirmModal(false)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-editorial text-[#1C1917]">Confirm Request</h3>
                <button onClick={() => setShowConfirmModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <div className="rounded-xl p-4 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${TIER_COLORS[selectedPlan.name.toLowerCase()] || '#A6852F'}F5, ${TIER_COLORS[selectedPlan.name.toLowerCase()] || '#A6852F'}E8)` }}>
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mb-0.5">{selectedPlan.name} Plan</p>
                  <p className="text-2xl font-editorial">${selectedPlan.price}<span className="text-xs opacity-60">/{selectedPlan.period}</span></p>
                </div>
              </div>

              <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div className="text-sm text-[#1C1917]">
                    <p className="font-medium mb-1">You are about to submit this request.</p>
                    <p className="text-xs text-[#57534E]">After approval you will receive payment instructions. No payment information is required at this time.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button onClick={handleSubmitRequest} disabled={actionLoading}
                  className="flex-1 py-3 bg-[#A6852F] hover:bg-[#8B6F1F] text-white rounded-xl shadow-md shadow-[#A6852F]/25 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]">
                  {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  {actionLoading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button onClick={() => setShowConfirmModal(false)} disabled={actionLoading} className="px-5 py-3 bg-[#F3F1ED] text-[#57534E] rounded-xl hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50 transition-all cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Payment Proof Modal */}
      <AnimatePresence>
        {showUploadModal && uploadTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !uploading && setShowUploadModal(false)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-editorial text-[#1C1917]">Submit Payment Proof</h3>
                <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-3 bg-[#F3F1ED]/50 rounded-lg text-sm">
                <div className="font-medium">{uploadTarget.amount} {uploadTarget.currency}</div>
                <div className="text-[#57534E]">Request: {uploadTarget.request_number}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-1">Transaction Reference *</label>
                  <input value={uploadForm.transactionReference} onChange={e => setUploadForm(f => ({ ...f, transactionReference: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="e.g. TXN-123456" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-1">Upload Receipt *</label>
                  <div className="border-2 border-dashed border-[#A6852F]/30 rounded-lg p-4 text-center hover:border-[#A6852F]/50 transition-colors">
                    {proofPreview ? (
                      <div className="space-y-2">
                        {proofFile?.type === 'application/pdf' ? (
                          <FileCheck className="w-8 h-8 text-[#A6852F] mx-auto" />
                        ) : (
                          <img src={proofPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                        )}
                        <p className="text-xs text-[#57534E] truncate max-w-[200px]">{proofFile?.name}</p>
                        <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); }} className="text-xs text-[#DC2626] hover:text-[#B91C1C] cursor-pointer">Remove</button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload className="w-6 h-6 text-[#A6852F]/50 mx-auto mb-1" />
                        <p className="text-xs text-[#57534E]">Click to upload receipt or proof</p>
                        <p className="text-[10px] text-[#57534E]/60 mt-0.5">JPG, PNG, PDF (max 10MB)</p>
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileSelect} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-1">Notes</label>
                  <textarea value={uploadForm.notes} onChange={e => setUploadForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]" placeholder="Optional notes..." />
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button onClick={handleSubmitProof} disabled={uploading || !uploadForm.transactionReference || !proofFile}
                  className="flex-1 py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer">
                  {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Submit Payment Proof'}
                </button>
                <button onClick={() => setShowUploadModal(false)} disabled={uploading} className="px-5 py-3 bg-[#F3F1ED] text-[#57534E] rounded-xl hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50 transition-all cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
