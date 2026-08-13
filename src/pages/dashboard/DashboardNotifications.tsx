import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Crown, MessageSquare, Sparkles, BookOpen, Settings as SettingsIcon, Check } from 'lucide-react';
import { MOCK_NOTIFICATIONS, NotificationType } from '../../data/dashboardData';

const TYPE_ICONS: Record<NotificationType, React.FC<{ className?: string }>> = {
  membership: Crown,
  reply: MessageSquare,
  experience: Sparkles,
  journal: BookOpen,
  system: SettingsIcon,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  membership: '#A6852F',
  reply: '#3B82F6',
  experience: '#8B5CF6',
  journal: '#16A34A',
  system: '#57534E',
};

export const DashboardNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Notifications</h1>
            <p className="text-sm text-[#57534E] mt-1">{unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}</p>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </motion.div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = TYPE_ICONS[n.type];
          const color = TYPE_COLORS[n.type];
          return (
            <motion.button
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                !n.read
                  ? 'border-[#A6852F]/20 bg-[#A6852F]/5 hover:bg-[#A6852F]/8'
                  : 'border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/10'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}12`, color }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917]">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-[#A6852F] shrink-0" />}
                </div>
                <p className="text-xs text-[#57534E] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
