import React from 'react';
import { motion } from 'motion/react';
import { Bell, Crown, MessageSquare, Sparkles, BookOpen, Settings as SettingsIcon, Check, Trash2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { NotificationType } from '../../data/dashboardData';

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
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useDashboard();
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
            <button onClick={markAllNotificationsRead} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      </motion.div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center">
            <Bell className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1C1917]">You're all caught up!</p>
            <p className="text-xs text-[#57534E] mt-1">No new notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const Icon = TYPE_ICONS[n.type];
            const color = TYPE_COLORS[n.type];
            return (
              <motion.div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 ${!n.read ? 'border-[#A6852F]/35 bg-[#A6852F]/10 hover:bg-[#A6852F]/15 shadow-sm shadow-[#A6852F]/10 hover:shadow-md hover:shadow-[#A6852F]/15' : 'border-[#A6852F]/15 bg-white hover:border-[#A6852F]/25 shadow-sm hover:shadow-md'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
              >
                <button onClick={() => markNotificationRead(n.id)} className="flex items-start gap-4 flex-1 text-left cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${color}12`, color }}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#1C1917]">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#A6852F] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#57534E] mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
                  </div>
                </button>
                <button onClick={() => deleteNotification(n.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E]/40 hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer shrink-0 mt-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
