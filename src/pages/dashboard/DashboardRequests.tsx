import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { RequestStatus } from '../../data/dashboardData';

const STATUS_CONFIG: Record<RequestStatus, { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: '#F59E0B', bg: '#F59E0B10' },
  under_review: { label: 'Under Review', icon: Hourglass, color: '#3B82F6', bg: '#3B82F610' },
  approved: { label: 'Approved', icon: CheckCircle, color: '#16A34A', bg: '#16A34A10' },
  declined: { label: 'Declined', icon: XCircle, color: '#DC2626', bg: '#DC262610' },
  completed: { label: 'Completed', icon: CheckCircle, color: '#57534E', bg: '#57534E10' },
};

export const DashboardRequests: React.FC = () => {
  const { requests } = useDashboard();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Requests</h1>
        <p className="text-sm text-[#57534E] mt-1">Track all your submitted enquiries and requests.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, config], i) => {
          const count = requests.filter((r) => r.status === key).length;
          return (
            <motion.div key={key} className="rounded-xl p-3 text-center" style={{ backgroundColor: config.bg }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <p className="text-lg font-editorial" style={{ color: config.color }}>{count}</p>
              <p className="text-[10px] font-medium" style={{ color: config.color }}>{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center">
            <p className="text-sm text-[#57534E]">No requests yet.</p>
            <p className="text-xs text-[#57534E]/60 mt-1">Submit a request from the Experiences page.</p>
          </div>
        ) : (
          requests.map((r, i) => {
            const status = STATUS_CONFIG[r.status];
            const StatusIcon = status.icon;
            return (
              <motion.div key={r.id} className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: status.bg }}><StatusIcon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-[#A6852F] uppercase">{r.type}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                  </div>
                  <p className="text-sm font-medium text-[#1C1917]">{r.title}</p>
                  <p className="text-xs text-[#57534E] mt-0.5">{r.description}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-1">{r.date}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
