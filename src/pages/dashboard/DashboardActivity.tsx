import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, User, Crown, DollarSign, Sparkles, MessageSquare, Shield, Settings } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { ActivityLog } from '../../types/database';

const MODULE_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  registration: { label: 'Registration', icon: User, color: '#3B82F6' },
  membership: { label: 'Membership', icon: Crown, color: '#A6852F' },
  payment: { label: 'Payment', icon: DollarSign, color: '#16A34A' },
  experience: { label: 'Experience', icon: Sparkles, color: '#8B5CF6' },
  chat: { label: 'Chat', icon: MessageSquare, color: '#F59E0B' },
  business: { label: 'Business', icon: MessageSquare, color: '#EC4899' },
  profile: { label: 'Profile', icon: User, color: '#3B82F6' },
  security: { label: 'Security', icon: Shield, color: '#DC2626' },
  system: { label: 'System', icon: Settings, color: '#57534E' },
};

const ACTION_CONFIG: Record<string, { label: string; color: string }> = {
  create: { label: 'Created', color: '#16A34A' },
  update: { label: 'Updated', color: '#3B82F6' },
  delete: { label: 'Deleted', color: '#DC2626' },
  login: { label: 'Logged In', color: '#16A34A' },
  logout: { label: 'Logged Out', color: '#57534E' },
  approve: { label: 'Approved', color: '#16A34A' },
  reject: { label: 'Rejected', color: '#DC2626' },
  export: { label: 'Exported', color: '#8B5CF6' },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function DashboardActivity() {
  const { activityLogs } = useDashboard();
  const [filterModule, setFilterModule] = useState<string>('all');

  const filtered = filterModule === 'all'
    ? activityLogs
    : activityLogs.filter((l) => l.module === filterModule);

  const modules = ['all', ...Array.from(new Set(activityLogs.map((l) => l.module)))];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Activity Timeline</h1>
        <p className="text-sm text-[#57534E] mt-1">A history of all actions on your account.</p>
      </motion.div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {modules.map((mod) => (
          <button key={mod} onClick={() => setFilterModule(mod)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filterModule === mod ? 'bg-[#A6852F] text-white shadow-md shadow-[#A6852F]/38' : 'bg-white border border-[#A6852F]/45 text-[#57534E] hover:bg-[#A6852F]/22'}`}>
            {mod === 'all' ? 'All Activity' : MODULE_CONFIG[mod]?.label || mod}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center">
          <Clock className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No activity yet</p>
          <p className="text-xs text-[#57534E] mt-1">Actions on your account will appear here.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#A6852F]/25" />

          <div className="space-y-1">
            {filtered.map((log, i) => {
              const modConfig = MODULE_CONFIG[log.module] || MODULE_CONFIG.system;
              const actionConfig = ACTION_CONFIG[log.action] || { label: log.action, color: '#57534E' };
              const ModIcon = modConfig.icon;
              return (
                <motion.div key={log.id} className="relative flex items-start gap-4 pl-12 py-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 + i * 0.03 }}>
                  {/* Timeline dot */}
                  <div className="absolute left-3.5 top-3.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm shadow-md" style={{ backgroundColor: modConfig.color }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium" style={{ color: actionConfig.color }}>{actionConfig.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${modConfig.color}18`, color: modConfig.color, boxShadow: `0 0 8px ${modConfig.color}12` }}>{modConfig.label}</span>
                    </div>
                    <p className="text-sm text-[#1C1917]">{log.description}</p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <p className="text-[10px] text-[#57534E]/60 mt-0.5">
                        {Object.entries(log.metadata).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
                      </p>
                    )}
                    <p className="text-[10px] text-[#57534E]/50 mt-0.5">{formatDate(log.created_at)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
