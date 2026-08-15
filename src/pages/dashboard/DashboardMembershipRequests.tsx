import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, CreditCard, ChevronDown, ChevronUp, Upload, FileCheck, Eye } from 'lucide-react';
import { membershipRequestsRepository, paymentRequestsRepository, paymentSubmissionsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';
import type { MembershipRequest, PaymentRequest, PaymentSubmission } from '../../types/database';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock; step: number }> = {
  pending: { label: 'Pending Admin Review', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock, step: 1 },
  approved_for_payment: { label: 'Payment Required', color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle, step: 2 },
  payment_submitted: { label: 'Payment Submitted', color: 'text-purple-700', bg: 'bg-purple-100', icon: AlertCircle, step: 3 },
  payment_under_review: { label: 'Payment Under Review', color: 'text-orange-700', bg: 'bg-orange-100', icon: Clock, step: 4 },
  payment_approved: { label: 'Payment Approved', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle, step: 5 },
  membership_active: { label: 'Membership Active', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle, step: 6 },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle, step: 0 },
};

const STEPS = ['Pending', 'Approved', 'Payment Submitted', 'Under Review', 'Payment Approved', 'Active'];

export default function DashboardMembershipRequests() {
  const { user } = useAuth();
  const { logActivity } = useDashboard();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentSubmissions, setPaymentSubmissions] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Payment proof upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<PaymentRequest | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ transactionReference: '', notes: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [reqs, pReqs, pSubs] = await Promise.all([
        membershipRequestsRepository.getByUserId(user.id),
        paymentRequestsRepository.getByUserId(user.id),
        paymentSubmissionsRepository.getByUserId(user.id),
      ]);
      setRequests(reqs);
      setPaymentRequests(pReqs);
      setPaymentSubmissions(pSubs);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (uploadSuccess) { const t = setTimeout(() => setUploadSuccess(''), 4000); return () => clearTimeout(t); }
  }, [uploadSuccess]);

  const activeRequest = requests.find(r => r.status !== 'rejected' && r.status !== 'membership_active');
  const pastRequests = requests.filter(r => r.status === 'rejected' || r.status === 'membership_active');

  const getPaymentRequestForMembership = (memRequestId: string) =>
    paymentRequests.find(pr => pr.related_record_id === memRequestId && pr.payment_type === 'membership');

  const getSubmissionForPaymentRequest = (paymentRequestId: string) =>
    paymentSubmissions.find(ps => ps.payment_request_id === paymentRequestId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadSuccess('File must be under 10MB');
      return;
    }
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadProof = async (userId: string): Promise<string | null> => {
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
      const proofUrl = await uploadProof(user.id);
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
        fullName: `${user?.email || ''}`.trim(),
        amount: String(uploadTarget.amount),
        currency: uploadTarget.currency,
        transactionReference: uploadForm.transactionReference,
      });
      setUploadSuccess('Payment proof submitted for review');
      setShowUploadModal(false);
      setUploadTarget(null);
      setProofFile(null);
      setProofPreview(null);
      setUploadForm({ transactionReference: '', notes: '' });
      logActivity('submit', 'payment', `Payment submitted: ${uploadTarget.currency} ${uploadTarget.amount}`, { payment_request_id: uploadTarget.id });
      load();
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const openUploadModal = (payReq: PaymentRequest) => {
    setUploadTarget(payReq);
    setUploadForm({ transactionReference: '', notes: '' });
    setProofFile(null);
    setProofPreview(null);
    setShowUploadModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership Requests</h1>
        <p className="text-sm text-[#57534E] mt-1">Track your membership application status</p>
      </div>

      {uploadSuccess && (
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#166534] px-4 py-3 rounded-lg text-sm shadow-sm">{uploadSuccess}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#57534E]">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center shadow-sm">
          <CreditCard className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No membership requests yet</p>
          <p className="text-xs text-[#57534E] mt-1">Visit the Membership page to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Request */}
          {activeRequest && (() => {
            const sc = STATUS_CONFIG[activeRequest.status] || STATUS_CONFIG.pending;
            const payReq = getPaymentRequestForMembership(activeRequest.id);
            const paySub = payReq ? getSubmissionForPaymentRequest(payReq.id) : null;
            const isRejected = activeRequest.status === 'rejected';
            const needsPayment = activeRequest.status === 'approved_for_payment' && payReq && !paySub;
            const proofSubmitted = !!paySub;
            const proofRejected = paySub?.status === 'rejected';

            return (
              <div className="rounded-2xl border border-[#A6852F]/22 bg-white overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-mono text-xs text-[#57534E]">{activeRequest.request_number}</div>
                      <h3 className="text-lg font-editorial text-[#1C1917] mt-1">{activeRequest.membership_plan_name}</h3>
                      <p className="text-xs text-[#57534E] capitalize">{activeRequest.duration} plan</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-1 mt-4 mb-6">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex-1">
                        <div className={`h-2 rounded-full ${i < sc.step ? 'bg-[#A6852F]' : 'bg-gray-200'}`} />
                        <div className={`text-[10px] mt-1 text-center ${i < sc.step ? 'text-[#A6852F] font-medium' : 'text-[#57534E]'}`}>{step}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-[#57534E]">Requested:</span><div className="font-medium">{formatDate(activeRequest.requested_at)}</div></div>
                    <div><span className="text-[#57534E]">Currency:</span><div className="font-medium">{activeRequest.currency}</div></div>
                    {activeRequest.preferred_payment_method && <div><span className="text-[#57534E]">Payment Method:</span><div className="font-medium">{activeRequest.preferred_payment_method}</div></div>}
                  </div>

                  {/* Rejected Status */}
                  {isRejected && activeRequest.rejection_reason && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-700">{activeRequest.rejection_reason}</p>
                    </div>
                  )}

                  {/* Payment Instructions */}
                  {activeRequest.status === 'approved_for_payment' && payReq && (
                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-xs font-medium text-blue-800 mb-2">Payment Instructions</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div><span className="text-blue-600">Amount:</span> <span className="font-medium text-blue-900">{payReq.amount} {payReq.currency}</span></div>
                          {payReq.payment_method && <div><span className="text-blue-600">Method:</span> <span className="font-medium text-blue-900">{payReq.payment_method}</span></div>}
                          {payReq.due_date && <div><span className="text-blue-600">Deadline:</span> <span className="font-medium text-blue-900">{formatDate(payReq.due_date)}</span></div>}
                        </div>
                        {payReq.payment_instructions && (
                          <div className="p-3 bg-white rounded-lg border border-blue-100">
                            <p className="text-xs font-medium text-blue-600 mb-1">Instructions</p>
                            <p className="text-sm text-[#1C1917] whitespace-pre-wrap">{payReq.payment_instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Proof Section */}
                  {needsPayment && (
                    <div className="mt-4">
                      <button onClick={() => openUploadModal(payReq)}
                        className="w-full py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                        <Upload className="w-4 h-4" /> Upload Payment Proof
                      </button>
                    </div>
                  )}

                  {/* Proof Submitted */}
                  {proofSubmitted && paySub && (
                    <div className="mt-4">
                      <div className={`p-4 rounded-xl border ${paySub.status === 'rejected' ? 'bg-red-50 border-red-200' : paySub.status === 'verified' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className={`w-4 h-4 ${paySub.status === 'rejected' ? 'text-red-600' : paySub.status === 'verified' ? 'text-green-600' : 'text-purple-600'}`} />
                          <span className={`text-xs font-medium ${paySub.status === 'rejected' ? 'text-red-800' : paySub.status === 'verified' ? 'text-green-800' : 'text-purple-800'}`}>
                            Payment Proof {paySub.status === 'verified' ? 'Verified' : paySub.status === 'rejected' ? 'Rejected' : 'Under Review'}
                          </span>
                        </div>
                        <div className="text-xs text-[#57534E] space-y-1">
                          <p>Reference: {paySub.transaction_reference}</p>
                          <p>Submitted: {formatDate(paySub.submitted_at)}</p>
                          {paySub.proof_url && (
                            <a href={paySub.proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#A6852F] hover:underline mt-1">
                              <Eye className="w-3 h-3" /> View Receipt
                            </a>
                          )}
                        </div>
                        {paySub.admin_notes && (
                          <div className="mt-2 text-xs text-[#57534E] italic">Admin: {paySub.admin_notes}</div>
                        )}
                      </div>
                      {proofRejected && (
                        <button onClick={() => openUploadModal(payReq)}
                          className="w-full mt-3 py-3 bg-[#A6852F] text-white rounded-xl hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                          <Upload className="w-4 h-4" /> Upload New Payment Proof
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Past Requests */}
          {pastRequests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#57534E] mb-3">Past Requests</h3>
              <div className="space-y-2">
                {pastRequests.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const isExpanded = expandedId === req.id;
                  return (
                    <div key={req.id} className="rounded-2xl border border-[#A6852F]/22 bg-white overflow-hidden shadow-sm">
                      <button onClick={() => setExpandedId(isExpanded ? null : req.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#A6852F]/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                          <div>
                            <div className="font-medium text-[#1C1917] text-sm">{req.membership_plan_name}</div>
                            <div className="text-xs text-[#57534E]">{req.request_number}</div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#57534E]" /> : <ChevronDown className="w-4 h-4 text-[#57534E]" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-[#A6852F]/10 pt-3 text-sm space-y-2">
                          <div><span className="text-[#57534E]">Duration:</span> <span className="font-medium capitalize">{req.duration}</span></div>
                          <div><span className="text-[#57534E]">Requested:</span> <span className="font-medium">{formatDate(req.requested_at)}</span></div>
                          {req.rejection_reason && <div><span className="text-[#57534E]">Reason:</span> <span className="font-medium text-red-600">{req.rejection_reason}</span></div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Payment Proof Modal */}
      {showUploadModal && uploadTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-4">Submit Payment Proof</h2>

            <div className="p-3 bg-[#F3F1ED]/50 rounded-lg text-sm mb-4">
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
                      <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); }} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
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

            <div className="flex gap-2 mt-6">
              <button onClick={handleSubmitProof} disabled={uploading || !uploadForm.transactionReference || !proofFile}
                className="flex-1 py-2.5 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer">
                {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Submit Payment Proof'}
              </button>
              <button onClick={() => { setShowUploadModal(false); setUploadTarget(null); setProofFile(null); setProofPreview(null); }} className="flex-1 py-2.5 bg-[#F3F1ED] text-[#57534E] rounded-lg hover:bg-[#E8E5DF] text-sm font-medium transition-all cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
