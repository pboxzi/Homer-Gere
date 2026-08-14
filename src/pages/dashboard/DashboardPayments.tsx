import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Clock, ChevronDown, ChevronUp, Upload, FileCheck } from 'lucide-react';
import { paymentRequestsRepository, paymentSubmissionsRepository, paymentMethodsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { supabase } from '../../lib/supabase';
import type { PaymentRequest, PaymentSubmission, PaymentMethod } from '../../types/database';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  instructions_sent: { label: 'Instructions Ready', color: 'text-blue-700', bg: 'bg-blue-100' },
  submitted: { label: 'Submitted', color: 'text-purple-700', bg: 'bg-purple-100' },
  under_review: { label: 'Under Review', color: 'text-orange-700', bg: 'bg-orange-100' },
  approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
  expired: { label: 'Expired', color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function DashboardPayments() {
  const { user, profile } = useAuth();
  const { logActivity } = useDashboard();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitTarget, setSubmitTarget] = useState<PaymentRequest | null>(null);
  const [submitForm, setSubmitForm] = useState({ transactionReference: '', amountPaid: '', paymentDate: '', notes: '' });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [r, s, m] = await Promise.all([
        paymentRequestsRepository.getByUserId(user.id),
        paymentSubmissionsRepository.getByUserId(user.id),
        paymentMethodsRepository.getActive(),
      ]);
      setRequests(r); setSubmissions(s); setMethods(m);
    } catch { /* silent */ }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const getSubmissionForRequest = (reqId: string) => submissions.find(s => s.payment_request_id === reqId);
  const getMethodName = (methodId: string | null) => methods.find(m => m.id === methodId)?.name || '—';

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

  const handleSubmitPayment = async () => {
    if (!submitTarget || !user?.id || !submitForm.transactionReference || !submitForm.amountPaid || !submitForm.paymentDate) return;
    setActionLoading(true);
    try {
      const proofUrl = await uploadProof(user.id);
      await paymentSubmissionsRepository.create({
        payment_request_id: submitTarget.id,
        user_id: user.id,
        transaction_reference: submitForm.transactionReference,
        amount_paid: parseFloat(submitForm.amountPaid),
        currency: submitTarget.currency,
        payment_date: submitForm.paymentDate,
        proof_url: proofUrl,
        notes: submitForm.notes || null,
      });
      await paymentRequestsRepository.updateStatus(submitTarget.id, 'submitted');
      await notifyService.paymentSubmitted(user.id, {
        email: profile?.email || '', fullName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
        amount: String(submitTarget.amount), currency: submitTarget.currency, transactionReference: submitForm.transactionReference,
      });
      setSuccessMsg('Payment submitted for review');
      setShowSubmitModal(false);
      setSubmitTarget(null);
      setSubmitForm({ transactionReference: '', amountPaid: '', paymentDate: '', notes: '' });
      setProofFile(null);
      setProofPreview(null);
      logActivity('submit', 'payment', `Payment submitted: ${submitTarget.currency} ${submitTarget.amount}`, { payment_request_id: submitTarget.id });
      load();
    } catch { /* silent */ }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Payments</h1>
        <p className="text-sm text-[#57534E] mt-1">View payment requests and submit payment proofs</p>
      </div>

      {successMsg && <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#92400E] px-4 py-3 rounded-lg text-sm shadow-sm shadow-[#F59E0B]/10">{successMsg}</div>}

      {loading ? (
        <div className="text-center py-12 text-[#57534E]">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#A6852F]/20 p-5 sm:p-8 text-center shadow-sm shadow-[#A6852F]/5">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#57534E]">No payment requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const sub = getSubmissionForRequest(req.id);
            const isExpanded = expandedId === req.id;
            const canSubmit = req.status === 'instructions_sent' && !sub;
            return (
              <div key={req.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#A6852F30', boxShadow: '0 0 20px rgba(166,133,47,0.08), 0 2px 12px rgba(166,133,47,0.05)' }}>
                <button onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#A6852F]/5">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div>
                      <div className="font-medium text-[#1C1917] text-sm">{req.amount} {req.currency}</div>
                      <div className="text-xs text-[#57534E] font-mono">{req.request_number} · {req.payment_type}</div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#57534E]" /> : <ChevronDown className="w-4 h-4 text-[#57534E]" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#A6852F]/10 pt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-[#57534E]">Type:</span> <span className="font-medium capitalize">{req.payment_type}</span></div>
                      <div><span className="text-[#57534E]">Due Date:</span> <span className="font-medium">{req.due_date ? new Date(req.due_date).toLocaleDateString() : '—'}</span></div>
                      {req.payment_method_id && <div><span className="text-[#57534E]">Method:</span> <span className="font-medium">{getMethodName(req.payment_method_id)}</span></div>}
                    </div>

                    {req.payment_instructions && (
                      <div className="p-3 bg-[#F3F1ED]/50 rounded-lg text-sm">
                        <span className="text-[#57534E] font-medium">Payment Instructions:</span>
                        <p className="mt-1 text-[#1C1917] whitespace-pre-wrap">{req.payment_instructions}</p>
                      </div>
                    )}

                    {sub && (
                      <div className="p-3 bg-purple-50 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-purple-800">Your Submission</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[sub.status]?.bg} ${STATUS_CONFIG[sub.status]?.color}`}>{STATUS_CONFIG[sub.status]?.label}</span>
                        </div>
                        <div className="text-purple-700">Ref: {sub.transaction_reference} · {sub.amount_paid} {sub.currency}</div>
                      </div>
                    )}

                    {canSubmit && (
                      <button onClick={(e) => { e.stopPropagation(); setSubmitTarget(req); setShowSubmitModal(true); }}
                        className="w-full py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Submit Payment Proof
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Payment Modal */}
      {showSubmitModal && submitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSubmitModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1C1917] mb-4">Submit Payment Proof</h2>
            <div className="space-y-4">
              <div className="p-3 bg-[#F3F1ED]/50 rounded-lg text-sm">
                <div className="font-medium">{submitTarget.amount} {submitTarget.currency}</div>
                <div className="text-[#57534E]">Request: {submitTarget.request_number}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1">Transaction Reference *</label>
                <input value={submitForm.transactionReference} onChange={e => setSubmitForm(f => ({ ...f, transactionReference: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="e.g. TXN-123456" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1">Amount Paid *</label>
                <input type="number" value={submitForm.amountPaid} onChange={e => setSubmitForm(f => ({ ...f, amountPaid: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1">Payment Date *</label>
                <input type="date" value={submitForm.paymentDate} onChange={e => setSubmitForm(f => ({ ...f, paymentDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1">Notes</label>
                <textarea value={submitForm.notes} onChange={e => setSubmitForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[80px]" placeholder="Optional notes..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1">Payment Proof (Optional)</label>
                <div className="border-2 border-dashed border-[#A6852F]/30 rounded-lg p-4 text-center hover:border-[#A6852F]/50 transition-colors">
                  {proofPreview ? (
                    <div className="space-y-2">
                      <FileCheck className="w-8 h-8 text-[#A6852F] mx-auto" />
                      <p className="text-xs text-[#57534E] truncate max-w-[200px]">{proofFile?.name}</p>
                      <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
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
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSubmitPayment} disabled={actionLoading || uploading || !submitForm.transactionReference || !submitForm.amountPaid || !submitForm.paymentDate}
                className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {(actionLoading || uploading) ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
              <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2 bg-[#F3F1ED] text-[#57534E] rounded-lg hover:bg-[#E8E5DF] text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
