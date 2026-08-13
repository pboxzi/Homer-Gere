import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare, Crown, Sparkles, User, Bell, ArrowRight,
  Calendar, ArrowUpRight,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { DashboardSection } from '../../data/dashboardData';

export const DashboardHome: React.FC<{
  onOpenChat: (mode?: 'fan' | 'business') => void;
  onRequestExperience: () => void;
  onNavigate: (section: DashboardSection) => void;
}> = ({ onOpenChat, onRequestExperience, onNavigate }) => {
  const { profile, membership, notifications, conversations, requests, markNotificationRead } = useDashboard();
  const unread = notifications.filter((n) => !n.read).length;
  const upcoming = requests.filter((r) => r.status === 'approved');

  const cards = [
    { label: 'Membership', value: membership.plan, sub: membership.status === 'active' ? `Renews ${membership.renewalDate}` : 'No active plan', icon: Crown, color: '#A6852F' },
    { label: 'Notifications', value: `${unread}`, sub: `${notifications.length} total`, icon: Bell, color: '#3B82F6' },
    { label: 'Conversations', value: `${conversations.length}`, sub: 'Active chats', icon: MessageSquare, color: '#16A34A' },
    { label: 'Requests', value: `${upcoming.length}`, sub: `${requests.length} total`, icon: Sparkles, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Welcome back, {profile.firstName}</h1>
        <p className="text-sm text-[#57534E] mt-1">Here's what's happening with your account today.</p>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default group"
            style={{ backgroundColor: `${card.color}10`, borderColor: `${card.color}20` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: card.color }} />
            </div>
            <p className="text-xl font-editorial leading-none" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px] text-[#57534E] mt-1 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <h2 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { icon: MessageSquare, label: 'Chat with Homer', onClick: () => onOpenChat('fan'), color: '#A6852F' },
            { icon: Crown, label: 'Upgrade Membership', onClick: () => onNavigate('membership'), color: '#F59E0B' },
            { icon: Sparkles, label: 'Request Experience', onClick: onRequestExperience, color: '#8B5CF6' },
            { icon: User, label: 'Update Profile', onClick: () => onNavigate('profile'), color: '#3B82F6' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: `${action.color}12`, borderColor: `${action.color}25` }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${action.color}22`; e.currentTarget.style.borderColor = `${action.color}45`; e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${action.color}12`; e.currentTarget.style.borderColor = `${action.color}25`; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300" style={{ backgroundColor: `${action.color}22`, color: action.color }}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#1C1917] leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications + Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Notifications</h3>
            <button onClick={() => onNavigate('notifications')} className="text-[9px] text-[#A6852F] font-bold hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-1.5">
            {notifications.length === 0 ? (
              <p className="text-xs text-[#57534E]/60 text-center py-4">No notifications yet.</p>
            ) : notifications.slice(0, 4).map((n) => (
              <button key={n.id} onClick={() => { markNotificationRead(n.id); onNavigate('notifications'); }} className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg transition-colors text-left cursor-pointer ${!n.read ? 'bg-[#A6852F]/8 border border-[#A6852F]/15' : 'hover:bg-[#F3F1ED]/50 border border-transparent'}`}>
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{n.title}</p>
                  <p className="text-[10px] text-[#57534E] mt-0.5 leading-relaxed truncate">{n.message}</p>
                  <p className="text-[9px] text-[#57534E]/50 mt-0.5">{n.date}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Conversations</h3>
            <button onClick={() => onNavigate('messages')} className="text-[9px] text-[#A6852F] font-bold hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-1.5">
            {conversations.length === 0 ? (
              <p className="text-xs text-[#57534E]/60 text-center py-4">No conversations yet.</p>
            ) : conversations.map((c) => (
              <button key={c.id} onClick={() => onNavigate('messages')} className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#F3F1ED]/50 transition-colors cursor-pointer border border-transparent hover:border-[#E8E5DF]/60 text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.type === 'fan' ? '#A6852F12' : '#8B5CF612', color: c.type === 'fan' ? '#A6852F' : '#8B5CF6' }}>
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase" style={{ color: c.type === 'fan' ? '#A6852F' : '#8B5CF6' }}>{c.type}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' : c.status === 'replied' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#57534E]/10 text-[#57534E]'}`}>{c.status}</span>
                  </div>
                  <p className="text-[10px] text-[#57534E] truncate mt-0.5">{c.lastMessage}</p>
                  <p className="text-[9px] text-[#57534E]/50 mt-0.5">{c.date}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#57534E]/30 shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <h2 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Upcoming Experiences</h2>
          <div className="space-y-2">
            {upcoming.map((r) => (
              <button key={r.id} onClick={() => onNavigate('requests')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E8E5DF]/80 bg-white hover:border-[#16A34A]/20 transition-all cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]"><Calendar className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{r.title}</p>
                  <p className="text-[10px] text-[#57534E] truncate">{r.description}</p>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-bold">{r.status}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
