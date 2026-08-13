import React from 'react';
import { motion } from 'motion/react';
import {
  Users, Crown, Clock, MessageSquare, Building2, Sparkles, FileText,
  Image, Film, Globe, TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, Zap, AlertTriangle, HardDrive,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { type AdminSection } from '../../data/adminData';

interface AdminOverviewProps {
  onNavigate: (section: AdminSection) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { stats, notifications } = useAdmin();

  const cards = [
    { label: 'Total Members', value: stats.totalMembers.toLocaleString(), icon: Users, color: '#A6852F' },
    { label: 'Active Memberships', value: stats.activeMemberships.toLocaleString(), icon: Crown, color: '#16A34A' },
    { label: 'Pending Applications', value: stats.pendingApplications, icon: Clock, color: '#F59E0B' },
    { label: 'Fan Chat Messages', value: stats.fanChatMessages.toLocaleString(), icon: MessageSquare, color: '#3B82F6' },
    { label: 'Business Enquiries', value: stats.businessEnquiries, icon: Building2, color: '#8B5CF6' },
    { label: 'Experience Requests', value: stats.experienceRequests, icon: Sparkles, color: '#EC4899' },
    { label: 'Journal Articles', value: stats.journalArticles, icon: FileText, color: '#14B8A6' },
    { label: 'Gallery Images', value: stats.galleryImages, icon: Image, color: '#F97316' },
    { label: 'Media Items', value: stats.mediaItems, icon: Film, color: '#6366F1' },
    { label: 'Website Visitors', value: stats.websiteVisitors.toLocaleString(), icon: Globe, color: '#A6852F' },
  ];

  const quickActions = [
    { label: 'Manage Members', icon: Users, color: '#A6852F', target: 'members' as AdminSection },
    { label: 'Review Applications', icon: Clock, color: '#F59E0B', target: 'applications' as AdminSection },
    { label: 'Content Manager', icon: FileText, color: '#3B82F6', target: 'journey' as AdminSection },
    { label: 'View Analytics', icon: TrendingUp, color: '#16A34A', target: 'visitors' as AdminSection },
  ];

  const systemHealth: { label: string; value: string; icon: React.ElementType; color: string }[] = [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#57534E] mt-1">Welcome back, Super Admin. Here's your website overview.</p>
      </motion.div>

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
            </div>
            <p className="text-xl font-editorial leading-none" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px] text-[#57534E] mt-1 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Recent Activity</h3>
          <div className="space-y-1.5">
            {notifications.map((n) => (
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
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.target)}
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

      <motion.div
        className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">System Health</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {systemHealth.map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              style={{ backgroundColor: `${item.color}08`, borderColor: `${item.color}18` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-[#57534E]">{item.label}</span>
              </div>
              <p className="text-lg font-editorial leading-none" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
