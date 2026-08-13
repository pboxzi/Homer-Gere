import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { MOCK_ADMIN_PAYMENTS } from '../../data/adminData';

export const AdminPayments: React.FC = () => {
  const totalRevenue = MOCK_ADMIN_PAYMENTS.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Payments</h1>
        <p className="text-sm text-[#57534E] mt-1">Track membership payments and transactions.</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Total Revenue</p>
          <p className="text-2xl font-editorial text-[#1C1917] mt-1">${totalRevenue.toLocaleString()}</p>
        </motion.div>
        <motion.div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Completed</p>
          <p className="text-2xl font-editorial text-[#16A34A] mt-1">{MOCK_ADMIN_PAYMENTS.filter((p) => p.status === 'completed').length}</p>
        </motion.div>
        <motion.div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Pending</p>
          <p className="text-2xl font-editorial text-[#F59E0B] mt-1">{MOCK_ADMIN_PAYMENTS.filter((p) => p.status === 'pending').length}</p>
        </motion.div>
      </div>

      {/* Payments Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917]">Payments</h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Member</span><span>Plan</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          {MOCK_ADMIN_PAYMENTS.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              <span className="text-sm text-[#1C1917]">{p.member}</span>
              <span className="text-xs text-[#57534E]">{p.plan}</span>
              <span className="text-sm font-medium text-[#1C1917]">${p.amount}</span>
              <span className="text-xs text-[#57534E]">{p.date}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${
                p.status === 'completed' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                p.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                'bg-[#DC2626]/10 text-[#DC2626]'
              }`}>{p.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
