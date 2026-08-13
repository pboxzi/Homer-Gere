import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Globe, MessageSquare, Sparkles, BarChart3 } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../../data/adminData';

export const AdminAnalytics: React.FC = () => {
  const stats = MOCK_ADMIN_STATS;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Analytics</h1>
        <p className="text-sm text-[#57534E] mt-1">Track visitors, membership stats, experience requests, and chat activity.</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Website Visitors', value: stats.websiteVisitors.toLocaleString(), icon: Globe, color: '#A6852F', change: '+12.4%' },
          { label: 'Total Members', value: stats.totalMembers.toLocaleString(), icon: Users, color: '#16A34A', change: '+8.2%' },
          { label: 'Chat Messages', value: stats.fanChatMessages.toLocaleString(), icon: MessageSquare, color: '#3B82F6', change: '+15.7%' },
          { label: 'Experience Requests', value: stats.experienceRequests, icon: Sparkles, color: '#8B5CF6', change: '+22.1%' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}12`, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-[#16A34A]">{card.change}</span>
            </div>
            <p className="text-2xl font-editorial text-[#1C1917]">{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Visitor Trends</h3>
          <div className="h-48 flex items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#A6852F]/20 hover:bg-[#A6852F]/40 transition-colors" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Membership Growth</h3>
          <div className="h-48 flex items-end gap-2">
            {[30, 35, 42, 48, 55, 62, 70, 78, 85, 92, 100, 105].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#16A34A]/20 hover:bg-[#16A34A]/40 transition-colors" style={{ height: `${(h / 110) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
