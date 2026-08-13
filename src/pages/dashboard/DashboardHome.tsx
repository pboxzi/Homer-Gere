import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageSquare, Crown, Sparkles, User, Bell, ArrowRight,
  Calendar, Clock,
} from 'lucide-react';
import {
  MOCK_MEMBER, MOCK_MEMBERSHIP, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_REQUESTS,
} from '../../data/dashboardData';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const upcoming = MOCK_REQUESTS.filter((r) => r.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
          Welcome back, {MOCK_MEMBER.firstName}
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Membership"
          value={MOCK_MEMBERSHIP.plan}
          sub={MOCK_MEMBERSHIP.status === 'active' ? `Renews ${MOCK_MEMBERSHIP.renewalDate}` : 'No active plan'}
          icon={<Crown className="w-5 h-5" />}
          color="#A6852F"
          delay={0.1}
        />
        <StatusCard
          label="Notifications"
          value={`${unread} unread`}
          sub={`${MOCK_NOTIFICATIONS.length} total`}
          icon={<Bell className="w-5 h-5" />}
          color="#3B82F6"
          delay={0.15}
        />
        <StatusCard
          label="Conversations"
          value={`${MOCK_CONVERSATIONS.length} active`}
          sub="With Homer"
          icon={<MessageSquare className="w-5 h-5" />}
          color="#16A34A"
          delay={0.2}
        />
        <StatusCard
          label="Requests"
          value={`${upcoming.length} approved`}
          sub={`${MOCK_REQUESTS.length} total`}
          icon={<Sparkles className="w-5 h-5" />}
          color="#8B5CF6"
          delay={0.25}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-sm font-medium text-[#1C1917] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={<MessageSquare className="w-4 h-4" />} label="Chat with Homer" onClick={() => navigate('/chat')} />
          <QuickAction icon={<Crown className="w-4 h-4" />} label="Upgrade Membership" onClick={() => navigate('/membership')} />
          <QuickAction icon={<Sparkles className="w-4 h-4" />} label="Request Experience" onClick={() => navigate('/experiences')} />
          <QuickAction icon={<User className="w-4 h-4" />} label="Update Profile" onClick={() => {}} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <motion.div
          className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#1C1917]">Recent Notifications</h3>
            <button className="text-[10px] text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-[#A6852F]/5' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1C1917]">{n.title}</p>
                  <p className="text-[11px] text-[#57534E] mt-0.5 truncate">{n.message}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Conversations */}
        <motion.div
          className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#1C1917]">Recent Conversations</h3>
            <button onClick={() => navigate('/chat')} className="text-[10px] text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">View All</button>
          </div>
          <div className="space-y-3">
            {MOCK_CONVERSATIONS.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3F1ED]/40 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-[#A6852F] uppercase">{c.type}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                      c.status === 'replied' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                      'bg-[#57534E]/10 text-[#57534E]'
                    }`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-[#57534E] truncate mt-0.5">{c.lastMessage}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-0.5">{c.date}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#57534E]/40" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-sm font-medium text-[#1C1917] mb-4">Upcoming Experiences</h2>
          <div className="space-y-3">
            {upcoming.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C1917]">{r.title}</p>
                  <p className="text-xs text-[#57534E] mt-0.5">{r.description}</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-medium">{r.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const StatusCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}> = ({ label, value, sub, icon, color, delay }) => (
  <motion.div
    className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">{label}</span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}12`, color }}>
        {icon}
      </div>
    </div>
    <p className="text-xl font-editorial text-[#1C1917]">{value}</p>
    <p className="text-[11px] text-[#57534E] mt-0.5">{sub}</p>
  </motion.div>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/30 hover:bg-[#A6852F]/5 transition-all duration-300 cursor-pointer group text-left"
  >
    <div className="w-9 h-9 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <span className="text-xs font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">{label}</span>
  </button>
);
