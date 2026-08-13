import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Check, ArrowRight, CreditCard } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardMembership: React.FC = () => {
  const navigate = useNavigate();
  const { membership } = useDashboard();

  const PAYMENT_HISTORY = [
    { id: 'p1', plan: `${membership.plan} Membership — Annual`, date: 'Jan 15, 2025', amount: '$199.00' },
    { id: 'p2', plan: `${membership.plan} Membership — Annual`, date: 'Jan 15, 2024', amount: '$199.00' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your membership plan and benefits.</p>
      </motion.div>

      <motion.div className="rounded-2xl border border-[#A6852F]/20 bg-gradient-to-br from-[#A6852F]/5 to-transparent p-6 sm:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-[#A6852F]" />
              <span className="text-[11px] font-medium text-[#A6852F] uppercase tracking-[0.1em]">Current Plan</span>
            </div>
            <h2 className="text-3xl font-editorial text-[#1C1917]">{membership.plan}</h2>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-medium uppercase">{membership.status}</span>
        </div>
        <p className="text-sm text-[#57534E] mb-4">Renewal date: <span className="font-medium text-[#1C1917]">{membership.renewalDate}</span></p>
        <button onClick={() => navigate('/membership')} className="inline-flex items-center gap-2 text-sm font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
          Upgrade Plan <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Your Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {membership.benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E5DF]/60">
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span className="text-sm text-[#57534E]">{b}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Payment History</h3>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
          {PAYMENT_HISTORY.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 p-4 ${i < PAYMENT_HISTORY.length - 1 ? 'border-b border-[#E8E5DF]/40' : ''}`}>
              <CreditCard className="w-4 h-4 text-[#57534E]" />
              <div className="flex-1">
                <p className="text-sm text-[#1C1917]">{p.plan}</p>
                <p className="text-[11px] text-[#57534E]">{p.date}</p>
              </div>
              <span className="text-sm font-medium text-[#1C1917]">{p.amount}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
