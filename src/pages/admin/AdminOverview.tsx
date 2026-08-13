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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default group"
            style={{
              backgroundColor: `${card.color}10`,
              borderColor: `${card.color}20`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
              <div className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${card.up ? 'bg-[#16A34A]/12 text-[#16A34A]' : 'bg-[#DC2626]/12 text-[#DC2626]'}`}>
                {card.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {card.change}
              </div>
            </div>
            <p className="text-xl font-editorial leading-none" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px] text-[#57534E] mt-1 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Recent Activity</h3>
          <div className="space-y-1.5">
            {MOCK_ADMIN_NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${!n.read ? 'bg-[#A6852F]/8 border border-[#A6852F]/15' : 'hover:bg-[#F3F1ED]/50 border border-transparent'}`}>
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{n.title}</p>
                  <p className="text-[10px] text-[#57534E] mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[9px] text-[#57534E]/50 mt-0.5">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Manage Members', icon: Users, color: '#A6852F' },
              { label: 'Review Applications', icon: Clock, color: '#F59E0B' },
              { label: 'Content Manager', icon: FileText, color: '#3B82F6' },
              { label: 'View Analytics', icon: TrendingUp, color: '#16A34A' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-300 cursor-pointer group hover:shadow-md hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${action.color}08`,
                  borderColor: `${action.color}18`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}15`;
                  e.currentTarget.style.borderColor = `${action.color}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}08`;
                  e.currentTarget.style.borderColor = `${action.color}18`;
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${action.color}18`, color: action.color }}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#1C1917] leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
