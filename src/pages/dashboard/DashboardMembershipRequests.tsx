import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { membershipRequestsRepository } from '../../lib/repositories';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import type { MembershipRequest } from '../../types/database';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock; step: number }> = {
  pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock, step: 1 },
  approved_for_payment: { label: 'Approved — Payment Required', color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle, step: 2 },
  payment_submitted: { label: 'Payment Submitted', color: 'text-purple-700', bg: 'bg-purple-100', icon: AlertCircle, step: 3 },
  payment_under_review: { label: 'Payment Under Review', color: 'text-orange-700', bg: 'bg-orange-100', icon: Clock, step: 4 },
  payment_approved: { label: 'Payment Approved', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle, step: 5 },
  membership_active: { label: 'Membership Active', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle, step: 6 },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle, step: 0 },
};

const STEPS = ['Pending', 'Approved', 'Payment Submitted', 'Under Review', 'Payment Approved', 'Active'];

export default function DashboardMembershipRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      setRequests(await membershipRequestsRepository.getByUserId(user.id));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const activeRequest = requests.find(r => r.status !== 'rejected' && r.status !== 'membership_active');
  const pastRequests = requests.filter(r => r.status === 'rejected' || r.status === 'membership_active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Membership Requests</h1>
        <p className="text-sm text-[#6b7280] mt-1">Track your membership application status</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 text-center">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#6b7280]">No membership requests yet</p>
          <p className="text-sm text-[#6b7280] mt-1">Visit the Membership page to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Request */}
          {activeRequest && (() => {
            const sc = STATUS_CONFIG[activeRequest.status] || STATUS_CONFIG.pending;
            return (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-mono text-xs text-[#6b7280]">{activeRequest.request_number}</div>
                      <h3 className="text-lg font-bold text-[#1a1a1a] mt-1">{activeRequest.membership_plan_name}</h3>
                      <p className="text-sm text-[#6b7280] capitalize">{activeRequest.duration} plan</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-1 mt-4 mb-6">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex-1">
                        <div className={`h-2 rounded-full ${i < sc.step ? 'bg-[#A6852F]' : 'bg-gray-200'}`} />
                        <div className={`text-[10px] mt-1 text-center ${i < sc.step ? 'text-[#A6852F] font-medium' : 'text-[#6b7280]'}`}>{step}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-[#6b7280]">Requested:</span><div className="font-medium">{formatDate(activeRequest.requested_at)}</div></div>
                    <div><span className="text-[#6b7280]">Currency:</span><div className="font-medium">{activeRequest.currency}</div></div>
                    {activeRequest.preferred_payment_method && <div><span className="text-[#6b7280]">Payment Method:</span><div className="font-medium">{activeRequest.preferred_payment_method}</div></div>}
                    {activeRequest.admin_notes && <div><span className="text-[#6b7280]">Admin Notes:</span><div className="font-medium">{activeRequest.admin_notes}</div></div>}
                  </div>

                  {activeRequest.status === 'approved_for_payment' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">Payment instructions have been sent to your email. Please complete the payment and submit proof through the Payments section.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Past Requests */}
          {pastRequests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-3">Past Requests</h3>
              <div className="space-y-2">
                {pastRequests.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const isExpanded = expandedId === req.id;
                  return (
                    <div key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button onClick={() => setExpandedId(isExpanded ? null : req.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                          <div>
                            <div className="font-medium text-[#1a1a1a] text-sm">{req.membership_plan_name}</div>
                            <div className="text-xs text-[#6b7280]">{req.request_number}</div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#6b7280]" /> : <ChevronDown className="w-4 h-4 text-[#6b7280]" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3 text-sm space-y-2">
                          <div><span className="text-[#6b7280]">Duration:</span> <span className="font-medium capitalize">{req.duration}</span></div>
                          <div><span className="text-[#6b7280]">Requested:</span> <span className="font-medium">{formatDate(req.requested_at)}</span></div>
                          {req.rejection_reason && <div><span className="text-[#6b7280]">Reason:</span> <span className="font-medium text-red-600">{req.rejection_reason}</span></div>}
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
    </div>
  );
}
