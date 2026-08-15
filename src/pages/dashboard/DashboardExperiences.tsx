import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, X, Star, Clock, Users, Heart, Mic, Briefcase, Sparkles, Video, Play, Send, AlertCircle, Upload, FileCheck, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAuth } from '../../context/AuthContext';
import { experienceRequestsRepository, paymentRequestsRepository, paymentSubmissionsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';
import type { Experience } from '../../types';
import type { PaymentRequest as DbPaymentRequest } from '../../types/database';

const ICON_MAP: Record<string, React.ReactNode> = {
  users: <Users className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  mic: <Mic className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  play: <Play className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'meet-and-greet': '#F59E0B',
  'fan-event': '#3B82F6',
  'charity-appearance': '#16A34A',
  'speaking-engagement': '#8B5CF6',
  'brand-collaboration': '#EC4899',
  'private-event': '#A6852F',
  'virtual-appearance': '#3B82F6',
  'video-greeting': '#8B5CF6',
};

const TIER_ACCESS: Record<string, string[]> = {
  'meet-and-greet': ['Gold', 'Platinum'],
  'fan-event': ['Silver', 'Gold', 'Platinum'],
  'charity-appearance': ['Silver', 'Gold', 'Platinum'],
  'speaking-engagement': ['Gold', 'Platinum'],
  'brand-collaboration': ['Platinum'],
  'private-event': ['Gold', 'Platinum'],
  'virtual-appearance': ['Silver', 'Gold', 'Platinum'],
  'video-greeting': ['Silver', 'Gold', 'Platinum'],
};

type ModalStep = 'form' | 'confirm' | 'submitted';

export const DashboardExperiences: React.FC<{ openRequestForm?: boolean; onRequestFormOpened?: () => void }> = ({ openRequestForm, onRequestFormOpened }) => {
  const { user, profile } = useAuth();
  const { experienceRequests, paymentRequests, paymentSubmissions, membershipPlan, refreshExperiences, logActivity } = useDashboard();
  const { experiences } = useSiteContent();

  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({ preferredDate: '', location: '', guests: '1', specialRequirements: '', notes: '' });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<DbPaymentRequest | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ transactionReference: '', notes: '' });
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (openRequestForm) {
      setSelectedExp(experiences[0]);
      setModalStep('form');
      onRequestFormOpened?.();
    }
  }, [openRequestForm, onRequestFormOpened]);

  React.useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 4000); return () => clearTimeout(t); }
  }, [successMsg]);

  const canAccess = (exp: Experience) => {
    const requiredTiers = TIER_ACCESS[exp.type] || ['Silver', 'Gold', 'Platinum'];
    return requiredTiers.includes(membershipPlan?.name || '');
  };

  const handleSelectExperience = (exp: Experience) => {
    if (!canAccess(exp) || exp.availability === 'unavailable') return;
    setSelectedExp(exp);
    setModalStep('form');
  };

  const handleSubmit = async () => {
    if (!selectedExp || !user?.id || !profile) return;
    setModalStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    if (!selectedExp || !user?.id || !profile) return;
    setSubmitting(true);
    try {
      await experienceRequestsRepository.create({
        user_id: user.id,
        experience_type: selectedExp.type,
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || null,
        country: profile.country || null,
        organization: null,
        event_date: requestForm.preferredDate || null,
        event_location: requestForm.location || null,
        budget: null,
        purpose: requestForm.notes || null,
        additional_details: requestForm.specialRequirements || null,
        preferred_date: requestForm.preferredDate || null,
        num_guests: parseInt(requestForm.guests) || 1,
        special_requirements: requestForm.specialRequirements || null,
        timeline: null,
        status: 'pending',
      });
      setModalStep('submitted');
      refreshExperiences();
      logActivity('create', 'experience', `Experience request submitted: ${selectedExp.type}`, { experience_type: selectedExp.type });
      await notifyService.experienceRequestSubmitted(user.id, {
        email: profile.email,
        fullName: `${profile.first_name} ${profile.last_name}`.trim(),
        experienceType: selectedExp.type,
        preferredDate: requestForm.preferredDate || 'TBD',
      });
    } catch { /* silent */ }
    setSubmitting(false);
  };

  const handleCloseModal = () => {
    setSelectedExp(null);
    setModalStep('form');
    setRequestForm({ preferredDate: '', location: '', guests: '1', specialRequirements: '', notes: '' });
  };

  const getPayReq = (expRequestId: string) =>
    paymentRequests.find((pr) => pr.related_record_id === expRequestId && pr.payment_type === 'experience');

  const getPaySub = (paymentRequestId: string) =>
    paymentSubmissions.find((ps) => ps.payment_request_id === paymentRequestId);

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
    if (file.size > 10 * 1024 * 1024) { setSuccessMsg('File must be under 10MB'); return; }
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
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, proofFile, { contentType: proofFile.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      return urlData?.publicUrl || null;
    } catch (e) { console.error('Upload failed:', e); return null; }
    finally { setUploading(false); }
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
      await logActivity('submit', 'payment', `Experience payment submitted: ${uploadTarget.currency} ${uploadTarget.amount}`, { payment_request_id: uploadTarget.id });
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Experiences</h1>
        <p className="text-sm text-[#57534E] mt-1">Browse and request exclusive experiences with Homer.</p>
      </motion.div>

      {successMsg && (
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#166534] px-4 py-3 rounded-xl text-sm shadow-sm">{successMsg}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', count: experienceRequests.filter((r) => r.status === 'pending' || r.status === 'under_review').length, color: '#F59E0B' },
          { label: 'Approved', count: experienceRequests.filter((r) => r.status === 'approved').length, color: '#16A34A' },
          { label: 'Completed', count: experienceRequests.filter((r) => r.status === 'completed').length, color: '#57534E' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-4 text-center border" style={{ borderColor: `${s.color}45`, background: `linear-gradient(135deg, ${s.color}22, ${s.color}0A)`, boxShadow: `0 0 35px ${s.color}35, 0 6px 20px ${s.color}25` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
            <p className="text-xl font-editorial" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] font-semibold mt-1" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Section 1: Available Experiences */}
      <div>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Available Experiences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experiences.map((exp, i) => {
            const accessible = canAccess(exp);
            const color = CATEGORY_COLORS[exp.type] || '#57534E';
            const hasActiveRequest = experienceRequests.some(r => r.experience_type === exp.type && r.status !== 'completed' && r.status !== 'declined');
            return (
              <motion.div
                key={exp.id}
                className={`rounded-2xl p-5 transition-all duration-500 border bg-white ${accessible && exp.availability !== 'unavailable' && !hasActiveRequest ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-60'}`}
                style={{ borderColor: `${color}45`, boxShadow: `0 0 40px ${color}40, 0 8px 25px ${color}30, inset 0 1px 0 ${color}15` }}
                onClick={() => handleSelectExperience(exp)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: `${color}18`, color, boxShadow: `0 0 12px ${color}22` }}>
                    {ICON_MAP[exp.iconName] || <Sparkles className="w-3 h-3" />}
                    {exp.title}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color }}>{exp.availability === 'available' ? 'Available' : exp.availability === 'limited' ? 'Limited' : 'Unavailable'}</span>
                </div>
                <h4 className="text-sm font-medium text-[#1C1917] mb-1">{exp.title}</h4>
                <p className="text-xs text-[#57534E] mb-3">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {exp.price}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.duration}</span>
                  </div>
                  {accessible && exp.availability !== 'unavailable' && !hasActiveRequest ? (
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>Request Experience</span>
                  ) : hasActiveRequest ? (
                    <span className="text-[10px] text-[#57534E]/60">Active request</span>
                  ) : (
                    <span className="text-[10px] text-[#57534E]/60">{!accessible ? 'Upgrade required' : 'Unavailable'}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section 2: My Experience Requests */}
      {experienceRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">My Experience Requests</h3>
          <div className="space-y-3">
            {experienceRequests.map((r, i) => {
              const reqColor = r.status === 'approved' ? '#16A34A' : r.status === 'completed' ? '#57534E' : r.status === 'declined' ? '#DC2626' : '#F59E0B';
              const isExpanded = expandedId === r.id;
              const payReq = getPayReq(r.id);
              const paySub = payReq ? getPaySub(payReq.id) : null;
              const hasPayment = !!payReq;
              const proofSubmitted = !!paySub;
              const proofRejected = paySub?.status === 'rejected';
              const needsInfo = paySub?.status === 'needs_info';
              const proofUnderReview = paySub && paySub.status !== 'rejected' && paySub.status !== 'verified' && paySub.status !== 'needs_info';
              const needsPayment = hasPayment && !proofSubmitted;

              const statusLabel = r.status === 'declined' ? 'Declined' :
                r.status === 'completed' ? 'Confirmed' :
                r.status === 'approved' && hasPayment && proofSubmitted && paySub?.status === 'verified' ? 'Confirmed' :
                r.status === 'approved' && hasPayment && proofSubmitted && paySub?.status === 'rejected' ? 'Proof Rejected' :
                r.status === 'approved' && hasPayment && proofSubmitted && needsInfo ? 'Info Needed' :
                r.status === 'approved' && hasPayment && proofSubmitted && proofUnderReview ? 'Payment Under Review' :
                r.status === 'approved' && hasPayment && !proofSubmitted ? 'Payment Required' :
                r.status === 'approved' ? 'Approved' :
                r.status === 'under_review' ? 'Under Review' :
                r.admin_notes ? 'Info Needed' : 'Pending Review';

              return (
                <motion.div key={r.id} className="rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: `${reqColor}40`, boxShadow: `0 0 30px ${reqColor}25, 0 6px 20px ${reqColor}18` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}>
                  <button onClick={() => setExpandedId(isExpanded ? null : r.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#A6852F]/5 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: `${reqColor}15`, color: reqColor }}>
                      {r.status === 'approved' || r.status === 'completed' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1917]">{r.experience_type}</p>
                      <p className="text-[10px] text-[#57534E] mt-0.5">{r.request_number} · {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${reqColor}12`, color: reqColor }}>{statusLabel}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#57534E]" /> : <ChevronDown className="w-4 h-4 text-[#57534E]" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-[#A6852F]/10 pt-3 space-y-3">
                      {/* Request Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {r.event_date && <div><span className="text-[#57534E]">Event Date:</span> <span className="font-medium">{formatDate(r.event_date)}</span></div>}
                        {r.event_location && <div><span className="text-[#57534E]">Location:</span> <span className="font-medium">{r.event_location}</span></div>}
                        <div><span className="text-[#57534E]">Guests:</span> <span className="font-medium">{r.num_guests}</span></div>
                        {r.special_requirements && <div className="col-span-2"><span className="text-[#57534E]">Requirements:</span> <span className="font-medium">{r.special_requirements}</span></div>}
                        {r.purpose && <div className="col-span-2"><span className="text-[#57534E]">Notes:</span> <span className="font-medium">{r.purpose}</span></div>}
                      </div>

                      {/* Rejection */}
                      {r.status === 'declined' && r.rejection_reason && (
                        <div className="p-3 bg-[#DC2626]/8 border border-[#DC2626]/20 rounded-xl">
                          <p className="text-xs font-medium text-[#DC2626] mb-1">Rejection Reason</p>
                          <p className="text-sm text-[#1C1917]">{r.rejection_reason}</p>
                        </div>
                      )}

                      {/* Admin Notes / Request More Info */}
                      {r.admin_notes && r.status !== 'declined' && (
                        <div className="p-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                            <span className="text-xs font-medium text-[#F59E0B]">Additional Information Requested</span>
                          </div>
                          <div className="mt-2 p-2 bg-white rounded-lg border border-[#F59E0B]/10">
                            <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{r.admin_notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment Instructions */}
                      {hasPayment && payReq && (
                        <div className="p-3 bg-[#3B82F6]/8 border border-[#3B82F6]/20 rounded-xl">
                          <p className="text-xs font-medium text-[#3B82F6] mb-2">Payment Instructions</p>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div><span className="text-[#3B82F6]">Amount:</span> <span className="font-medium text-[#1C1917]">{payReq.amount} {payReq.currency}</span></div>
                            {payReq.payment_method && <div><span className="text-[#3B82F6]">Method:</span> <span className="font-medium text-[#1C1917]">{payReq.payment_method}</span></div>}
                            {payReq.due_date && <div><span className="text-[#3B82F6]">Deadline:</span> <span className="font-medium text-[#1C1917]">{formatDate(payReq.due_date)}</span></div>}
                          </div>
                          {payReq.payment_instructions && (
                            <div className="p-2 bg-white rounded-lg border border-[#3B82F6]/10 mt-2">
                              <p className="text-xs text-[#57534E] mb-0.5">Instructions</p>
                              <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{payReq.payment_instructions}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Needs Payment */}
                      {needsPayment && payReq && (
                        <button onClick={() => openUploadModal(payReq)} className="w-full py-2.5 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                          <Upload className="w-4 h-4" /> Upload Payment Proof
                        </button>
                      )}

                      {/* Proof Under Review */}
                      {proofUnderReview && paySub && (
                        <div className="p-3 bg-[#8B5CF6]/8 border border-[#8B5CF6]/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCheck className="w-4 h-4 text-[#8B5CF6]" />
                            <span className="text-xs font-medium text-[#8B5CF6]">Payment Under Review</span>
                          </div>
                          <div className="text-xs text-[#57534E] space-y-1">
                            <p>Reference: {paySub.transaction_reference}</p>
                            {paySub.proof_url && (
                              <a href={paySub.proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#A6852F] hover:underline">
                                <Eye className="w-3 h-3" /> View Receipt
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Admin Needs More Info */}
                      {needsInfo && paySub && (
                        <div className="space-y-2">
                          <div className="p-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                              <span className="text-xs font-medium text-[#F59E0B]">More Information Requested</span>
                            </div>
                            {paySub.admin_notes && (
                              <div className="mt-2 p-2 bg-white rounded-lg border border-[#F59E0B]/10">
                                <p className="text-xs font-medium text-[#57534E] mb-0.5">Admin Message</p>
                                <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{paySub.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          {payReq && (
                            <button onClick={() => openUploadModal(payReq)} className="w-full py-2.5 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                              <Upload className="w-4 h-4" /> Resubmit Payment Proof
                            </button>
                          )}
                        </div>
                      )}

                      {/* Proof Rejected */}
                      {proofRejected && paySub && (
                        <div className="space-y-2">
                          <div className="p-3 bg-[#DC2626]/8 border border-[#DC2626]/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                              <span className="text-xs font-medium text-[#DC2626]">Payment Rejected</span>
                            </div>
                            {paySub.admin_notes && (
                              <div className="mt-2 p-2 bg-white rounded-lg border border-[#DC2626]/10">
                                <p className="text-xs font-medium text-[#57534E] mb-0.5">Reason</p>
                                <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{paySub.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          {payReq && (
                            <button onClick={() => openUploadModal(payReq)} className="w-full py-2.5 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                              <Upload className="w-4 h-4" /> Upload New Payment Proof
                            </button>
                          )}
                        </div>
                      )}

                      {/* Proof Verified */}
                      {paySub?.status === 'verified' && (
                        <div className="p-3 bg-[#16A34A]/8 border border-[#16A34A]/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="w-4 h-4 text-[#16A34A]" />
                            <span className="text-xs font-medium text-[#16A34A]">Payment Verified</span>
                          </div>
                          <div className="text-xs text-[#57534E]">
                            <p>Reference: {paySub.transaction_reference}</p>
                          </div>
                        </div>
                      )}

                      {/* Confirmed (no payment or payment verified) */}
                      {r.status === 'approved' && (!hasPayment || paySub?.status === 'verified') && (
                        <div className="p-3 bg-[#16A34A]/8 border border-[#16A34A]/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#16A34A]" />
                            <span className="text-xs font-medium text-[#16A34A]">Experience Confirmed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {selectedExp && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !submitting && handleCloseModal()} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>

              {modalStep === 'form' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">{selectedExp.title}</h3>
                    <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-[#57534E]">{selectedExp.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {selectedExp.price}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedExp.duration}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">Preferred Date</label>
                      <input type="date" value={requestForm.preferredDate} onChange={e => setRequestForm(f => ({ ...f, preferredDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">Guests</label>
                      <input type="number" min="1" max="20" value={requestForm.guests} onChange={e => setRequestForm(f => ({ ...f, guests: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Preferred Location</label>
                    <input value={requestForm.location} onChange={e => setRequestForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="e.g. Los Angeles, CA" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Special Requirements</label>
                    <textarea value={requestForm.specialRequirements} onChange={e => setRequestForm(f => ({ ...f, specialRequirements: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]" placeholder="Accessibility needs, dietary restrictions, etc." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Additional Notes</label>
                    <textarea value={requestForm.notes} onChange={e => setRequestForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]" placeholder="Any additional details..." />
                  </div>
                  <button onClick={handleSubmit} className="w-full bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Review Request
                  </button>
                </>
              )}

              {modalStep === 'confirm' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">Confirm Request</h3>
                    <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="rounded-xl border border-[#A6852F]/20 p-4 bg-[#FAF9F7]">
                    <p className="text-sm font-medium text-[#1C1917]">{selectedExp.title}</p>
                    <div className="mt-2 space-y-1 text-xs text-[#57534E]">
                      {requestForm.preferredDate && <p>Date: {requestForm.preferredDate}</p>}
                      {requestForm.location && <p>Location: {requestForm.location}</p>}
                      <p>Guests: {requestForm.guests}</p>
                      {requestForm.specialRequirements && <p>Requirements: {requestForm.specialRequirements}</p>}
                    </div>
                  </div>
                  <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/30 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div className="text-sm text-[#1C1917]">
                        <p className="font-medium mb-1">You are about to submit this request.</p>
                        <p className="text-xs text-[#57534E]">After approval you will receive payment instructions if applicable. Our team will review your request shortly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <button onClick={handleConfirmSubmit} disabled={submitting}
                      className="flex-1 py-3 bg-[#A6852F] hover:bg-[#8B6F1F] text-white rounded-xl shadow-md shadow-[#A6852F]/25 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]">
                      {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button onClick={() => setModalStep('form')} disabled={submitting} className="px-5 py-3 bg-[#F3F1ED] text-[#57534E] rounded-xl hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50 transition-all cursor-pointer">Back</button>
                  </div>
                </>
              )}

              {modalStep === 'submitted' && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#16A34A]/22 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#16A34A]" />
                  </div>
                  <p className="text-lg font-editorial text-[#1C1917] mb-2">Request Submitted!</p>
                  <div className="space-y-2 text-sm text-[#57534E] max-w-xs mx-auto">
                    <p>Your <strong className="text-[#1C1917]">{selectedExp.title}</strong> request has been submitted successfully.</p>
                    <p>Our team is reviewing your request. You will receive an email and dashboard notification once a decision has been made.</p>
                  </div>
                  <button onClick={handleCloseModal} className="mt-6 px-8 py-2.5 bg-[#A6852F] text-white rounded-xl text-sm font-medium hover:bg-[#8B6F1F] transition-all cursor-pointer">
                    Close
                  </button>
                </div>
              )}
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
