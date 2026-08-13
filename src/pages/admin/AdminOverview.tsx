import React from 'react';
import { motion } from 'motion/react';
import {
  Users, Crown, Clock, MessageSquare, Building2, Sparkles, FileText,
  Image, Film, Globe, TrendingUp, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { MOCK_ADMIN_STATS, MOCK_ADMIN_NOTIFICATIONS } from '../../data/adminData';

export const AdminOverview: React.FC = () => {
  const stats = MOCK_ADMIN_STATS;

  const cards = [
    { label: 'Total Members', value: stats.totalMembers.toLocaleString(), icon: Users, color: '#A6852F', change: '+12%', up: true },
    { label: 'Active Memberships', value: stats.activeMemberships.toLocaleString(), icon: Crown, color: '#16A34A', change: '+8%', up: true },
    { label: 'Pending Applications', value: stats.pendingApplications, icon: Clock, color: '#F59E0B', change: '+3', up: true },
    { label: 'Fan Chat Messages', value: stats.fanChatMessages.toLocaleString(), icon: MessageSquare, color: '#3B82F6', change: '+156', up: true },
    { label: 'Business Enquiries', value: stats.businessEnquiries, icon: Building2, color: '#8B5CF6', change: '+5', up: true },
    { label: 'Experience Requests', value: stats.experienceRequests, icon: Sparkles, color: '#EC4899', change: '+12', up: true },
    { label: 'Journal Articles', value: stats.journalArticles, icon: FileText, color: '#14B8A6', change: '+2', up: true },
    { label: 'Gallery Images', value: stats.galleryImages, icon: Image, color: '#F97316', change: '+18', up: true },
    { label: 'Media Items', value: stats.mediaItems, icon: Film, color: '#6366F1', change: '+7', up: true },
    { label: 'Website Visitors', value: stats.websiteVisitors.toLocaleString(), icon: Globe, color: '#A6852F', change: '+2.4K', up: true },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#57534E] mt-1">Welcome back, Super Admin. Here's your website overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default"
            style={{
              backgroundColor: `${card.color}12`,
              borderColor: `${card.color}30`,
              boxShadow: `0 8px 30px ${card.color}15`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}25`, color: card.color }}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full ${card.up ? 'bg-[#16A34A]/15 text-[#16A34A]' : 'bg-[#DC2626]/15 text-[#DC2626]'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <p className="text-3xl font-editorial" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-1.5 font-semibold uppercase tracking-[0.03em]">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="rounded-2xl border-2 border-[#E8E5DF]/80 bg-white p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4 uppercase tracking-[0.03em]">Recent Activity</h3>
          <div className="space-y-2">
            {MOCK_ADMIN_NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-xl transition-colors ${!n.read ? 'bg-[#A6852F]/10 border border-[#A6852F]/20' : 'hover:bg-[#F3F1ED]/60 border border-transparent'}`}>
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1C1917]">{n.title}</p>
                  <p className="text-[11px] text-[#57534E] mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border-2 border-[#E8E5DF]/80 bg-white p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4 uppercase tracking-[0.03em]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Members', icon: Users, color: '#A6852F' },
              { label: 'Review Applications', icon: Clock, color: '#F59E0B' },
              { label: 'Content Manager', icon: FileText, color: '#3B82F6' },
              { label: 'View Analytics', icon: TrendingUp, color: '#16A34A' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${action.color}10`,
                  borderColor: `${action.color}25`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}20`;
                  e.currentTarget.style.borderColor = `${action.color}45`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}10`;
                  e.currentTarget.style.borderColor = `${action.color}25`;
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: `${action.color}25`, color: action.color }}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#1C1917]">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
