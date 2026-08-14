import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, XCircle, Hourglass, ChevronDown, ChevronUp } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const STATUS_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: '#F59E0B', bg: '#F59E0B18' },
  under_review: { label: 'Under Review', icon: Hourglass, color: '#3B82F6', bg: '#3B82F618' },
  approved: { label: 'Approved', icon: CheckCircle, color: '#16A34A', bg: '#16A34A18' },
  declined: { label: 'Declined', icon: XCircle, color: '#DC2626', bg: '#DC262618' },
  completed: { label: 'Completed', icon: CheckCircle, color: '#57534E', bg: '#57534E18' },
  rejected: { label: 'Rejected', icon: XCircle, color: '#DC2626', bg: '#DC262618' },
  approved_for_payment: { label: 'Approved', icon: CheckCircle, color: '#16A34A', bg: '#16A34A18' },
  payment_submitted: { label: 'Payment Submitted', icon: Clock, color: '#8B5CF6', bg: '#8B5CF618' },
  payment_under_review: { label: 'Under Review', icon: Hourglass, color: '#F59E0B', bg: '#F59E0B18' },
  payment_approved: { label: 'Payment Approved', icon: CheckCircle, color: '#16A34A', bg: '#16A34A18' },
  membership_active: { label: 'Active', icon: CheckCircle, color: '#16A34A', bg: '#16A34A18' },
};

export const DashboardRequests: React.FC = () => {
  const { experienceRequests, membershipRequests } = useDashboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Combine experience requests and membership requests into a unified list
  const allRequests = [
    ...experienceRequests.map((r) => ({
      id: r.id,
      type: 'experience' as const,
      title: r.experience_type,
      description: r.purpose || r.additional_details || '',
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString(),
      requestNumber: r.request_number,
    })),
    ...membershipRequests.map((r) => ({
      id: r.id,
      type: 'membership' as const,
      title: r.membership_plan_name,
      description: r.notes || `${r.duration} plan`,
      status: r.status,
      date: new Date(r.requested_at).toLocaleDateString(),
      requestNumber: r.request_number,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Requests</h1>
        <p className="text-sm text-[#57534E] mt-1">Track all your submitted enquiries and requests.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Experience', count: experienceRequests.length, color: '#8B5CF6' },
          { label: 'Membership', count: membershipRequests.length, color: '#A6852F' },
          { label: 'Pending', count: allRequests.filter((r) => ['pending', 'under_review', 'approved_for_payment', 'payment_submitted', 'payment_under_review'].includes(r.status)).length, color: '#F59E0B' },
          { label: 'Active', count: allRequests.filter((r) => ['approved', 'completed', 'membership_active'].includes(r.status)).length, color: '#16A34A' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all duration-500" style={{ backgroundColor: `${s.color}10` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
            <p className="text-lg font-editorial" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] font-medium" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        {allRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/45 p-6 sm:p-12 text-center">
            <Clock className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1C1917]">No requests yet</p>
            <p className="text-xs text-[#57534E] mt-1">Submit a request from the Experiences or Membership pages.</p>
          </div>
        ) : (
          allRequests.map((r, i) => {
            const status = STATUS_CONFIG[r.status] || { label: r.status, icon: Clock, color: '#57534E', bg: '#57534E18' };
            const StatusIcon = status.icon;
            const isExpanded = expandedId === r.id;
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}>
                <button onClick={() => setExpandedId(isExpanded ? null : r.id)} className="w-full flex items-start gap-4 p-5 rounded-2xl border border-[#A6852F]/45 bg-white hover:border-[#A6852F]/55 transition-all duration-500 cursor-pointer text-left shadow-sm shadow-[#A6852F]/18 hover:shadow-md hover:shadow-[#A6852F]/22">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: status.bg }}><StatusIcon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-[#A6852F] uppercase">{r.type}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                    </div>
                    <p className="text-sm font-medium text-[#1C1917]">{r.title}</p>
                    {r.description && <p className="text-xs text-[#57534E] mt-0.5 line-clamp-1">{r.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[10px] text-[#57534E]/60">{r.requestNumber}</p>
                      <p className="text-[10px] text-[#57534E]/60">Submitted: {r.date}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#57534E]/40 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-[#57534E]/40 shrink-0 mt-1" />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-5 pb-4 pt-1 ml-14">
                        <div className="rounded-xl bg-[#F3F1ED]/50 p-4 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#57534E]">Request Number</span>
                            <span className="font-medium text-[#1C1917]">{r.requestNumber}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#57534E]">Type</span>
                            <span className="font-medium text-[#1C1917] capitalize">{r.type}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#57534E]">Submitted</span>
                            <span className="font-medium text-[#1C1917]">{r.date}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#57534E]">Status</span>
                            <span className="font-medium capitalize" style={{ color: status.color }}>{status.label}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
