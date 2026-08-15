import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare, Crown, Sparkles, User, Bell,
  ArrowUpRight, Check,
  AlertCircle, DollarSign, Clock,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { DashboardSection } from '../../data/dashboardData';

export const DashboardHome: React.FC<{
  onOpenChat: () => void;
  onRequestExperience: () => void;
  onNavigate: (section: DashboardSection) => void;
}> = ({ onOpenChat, onRequestExperience, onNavigate }) => {
  const {
    profile, membership, membershipPlan, membershipRequests,
    paymentRequests, experienceRequests, notifications, activityLogs,
    unreadCount, pendingCount, completedCount,
  } = useDashboard();

  // Profile completion %
  const fields = [profile?.first_name, profile?.last_name, profile?.email, profile?.phone, profile?.country];
  const filled = fields.filter((f) => f && f.trim() !== '').length;
  const completionPct = Math.round((filled / fields.length) * 100);

  const activeMemReqs = membershipRequests.filter((r) => !['rejected', 'membership_active'].includes(r.status));
  const activePayReqs = paymentRequests.filter((r) => ['instructions_sent', 'submitted', 'under_review'].includes(r.status));

  const cards = [
    { label: 'Membership', value: membershipPlan?.name || 'Member', sub: membership?.status === 'active' ? 'Active' : 'No active plan', icon: Crown, color: '#A6852F' },
    { label: 'Notifications', value: `${unreadCount}`, sub: `${notifications.length} total`, icon: Bell, color: '#3B82F6' },
    { label: 'Pending', value: `${pendingCount}`, sub: 'Requests awaiting action', icon: Clock, color: '#F59E0B' },
    { label: 'Completed', value: `${completedCount}`, sub: 'Successfully processed', icon: Check, color: '#16A34A' },
  ];

  const firstName = profile?.first_name || 'Member';

  return (
    <div className="space-y-6">
      {/* Welcome + Profile Completion */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-sm text-[#57534E] mt-1">Here's what's happening with your account today.</p>
      </motion.div>

      {/* Profile Completion */}
      {completionPct < 100 && (
        <motion.div className="rounded-2xl border border-[#A6852F]/20 bg-gradient-to-r from-[#A6852F]/5 to-transparent p-4 flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-[#1C1917]">Complete your profile</p>
              <span className="text-[10px] font-bold text-[#A6852F]">{completionPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#A6852F] rounded-full" initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer whitespace-nowrap">
            Complete Now
          </button>
        </motion.div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 cursor-default group"
            style={{ backgroundColor: `${card.color}40`, borderColor: `${card.color}90`, boxShadow: `0 0 50px ${card.color}50, 0 0 100px ${card.color}25, inset 0 1px 0 ${card.color}35` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${card.color}45`, color: card.color }}>
                <card.icon className="w-4.5 h-4.5" />
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
            { icon: MessageSquare, label: 'Chat with Homer', onClick: onOpenChat, color: '#A6852F' },
            { icon: Crown, label: 'Upgrade Membership', onClick: () => onNavigate('membership'), color: '#F59E0B' },
            { icon: Sparkles, label: 'Request Experience', onClick: onRequestExperience, color: '#8B5CF6' },
            { icon: User, label: 'Edit Profile', onClick: () => onNavigate('profile'), color: '#3B82F6' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-500 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: `${action.color}40`, borderColor: `${action.color}90` }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${action.color}55`; e.currentTarget.style.borderColor = `${action.color}aa`; e.currentTarget.style.boxShadow = `0 8px 50px ${action.color}55, 0 0 80px ${action.color}25`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${action.color}40`; e.currentTarget.style.borderColor = `${action.color}90`; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300" style={{ backgroundColor: `${action.color}35`, color: action.color }}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#1C1917] leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Notifications</h3>
            <button onClick={() => onNavigate('notifications')} className="text-[9px] text-[#A6852F] font-bold hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-1.5">
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <Bell className="w-5 h-5 text-[#57534E]/20 mx-auto mb-1.5" />
                <p className="text-xs text-[#57534E]/60">No notifications yet</p>
              </div>
            ) : notifications.slice(0, 4).map((n) => (
              <button key={n.id} onClick={() => onNavigate('notifications')} className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg transition-colors text-left cursor-pointer ${!n.read ? 'bg-[#A6852F]/8 border border-[#A6852F]/15' : 'hover:bg-[#F3F1ED]/50 border border-transparent'}`}>
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{n.title}</p>
                  <p className="text-[10px] text-[#57534E] mt-0.5 leading-relaxed truncate">{n.message}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Activity</h3>
            <button onClick={() => onNavigate('activity')} className="text-[9px] text-[#A6852F] font-bold hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-1.5">
            {activityLogs.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-5 h-5 text-[#57534E]/20 mx-auto mb-1.5" />
                <p className="text-xs text-[#57534E]/60">No activity yet</p>
              </div>
            ) : activityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#F3F1ED]/50 border border-transparent">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#A6852F]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[#1C1917]">{log.description}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-0.5">{log.module} · {new Date(log.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Active Requests */}
      {(activeMemReqs.length > 0 || activePayReqs.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Active Requests</h2>
            <button onClick={() => onNavigate('experiences')} className="text-[9px] text-[#A6852F] font-bold hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-2">
            {activeMemReqs.slice(0, 2).map((r) => (
              <button key={r.id} onClick={() => onNavigate('membership')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E8E5DF]/80 bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]"><Crown className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{r.membership_plan_name}</p>
                  <p className="text-[10px] text-[#57534E]">{r.request_number}</p>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">{r.status.replace(/_/g, ' ')}</span>
              </button>
            ))}
            {activePayReqs.slice(0, 2).map((r) => (
              <button key={r.id} onClick={() => onNavigate('membership')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E8E5DF]/80 bg-white hover:border-[#16A34A]/20 transition-all cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]"><DollarSign className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1917]">{r.amount} {r.currency}</p>
                  <p className="text-[10px] text-[#57534E]">{r.request_number}</p>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">{r.status.replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
