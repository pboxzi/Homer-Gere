import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Users, Crown, Clock, MessageSquare, Building2, Sparkles, FileText,
  Image, Film, Globe, TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, Zap, AlertTriangle, HardDrive, CreditCard, Mail,
  Bell, Shield, Database, RefreshCw, DollarSign, UserCheck, UserX,
  CheckCircle, XCircle, ChevronRight, Loader2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { type AdminSection } from '../../data/adminData';
import {
  profilesRepository,
  auditLogsRepository,
} from '../../lib/repositories';
import { getSupabaseClient } from '../../lib/repositories';

interface AdminOverviewProps {
  onNavigate: (section: AdminSection) => void;
}

interface LiveStats {
  pendingRegistrations: number;
  pendingMembershipRequests: number;
  pendingPaymentRequests: number;
  pendingPaymentSubmissions: number;
  totalMembers: number;
  activeMembers: number;
  totalMedia: number;
  mediaUsedBytes: number;
}

interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  module: string | null;
  created_at: string;
  user_id: string | null;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { stats, notifications, conversations, businessEnquiries } = useAdmin();
  const [liveStats, setLiveStats] = useState<LiveStats>({
    pendingRegistrations: 0,
    pendingMembershipRequests: 0,
    pendingPaymentRequests: 0,
    pendingPaymentSubmissions: 0,
    totalMembers: 0,
    activeMembers: 0,
    totalMedia: 0,
    mediaUsedBytes: 0,
  });
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveStats = useCallback(async () => {
    try {
      const client = getSupabaseClient();

      const [
        pendingRegsRes,
        pendingMemReqRes,
        pendingPayReqRes,
        pendingPaySubRes,
        profilesRes,
        activeMemsRes,
        mediaRes,
        auditRes,
      ] = await Promise.allSettled([
        client.from('registration_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        client.from('membership_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        client.from('payment_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        client.from('payment_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        client.from('profiles').select('id', { count: 'exact', head: true }),
        client.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        client.from('site_media').select('id, file_size'),
        client.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(8),
      ]);

      const totalMediaCount = mediaRes.status === 'fulfilled' ? (((mediaRes.value as any)?.data)?.length || 0) : 0;
      const mediaBytes = mediaRes.status === 'fulfilled'
        ? (((mediaRes.value as any)?.data) || []).reduce((sum: number, m: { file_size: number | null }) => sum + (m.file_size || 0), 0)
        : 0;

      setLiveStats({
        pendingRegistrations: pendingRegsRes.status === 'fulfilled' ? (pendingRegsRes.value as { count: number } | null)?.count || 0 : 0,
        pendingMembershipRequests: pendingMemReqRes.status === 'fulfilled' ? (pendingMemReqRes.value as { count: number } | null)?.count || 0 : 0,
        pendingPaymentRequests: pendingPayReqRes.status === 'fulfilled' ? (pendingPayReqRes.value as { count: number } | null)?.count || 0 : 0,
        pendingPaymentSubmissions: pendingPaySubRes.status === 'fulfilled' ? (pendingPaySubRes.value as { count: number } | null)?.count || 0 : 0,
        totalMembers: profilesRes.status === 'fulfilled' ? (profilesRes.value as { count: number } | null)?.count || 0 : 0,
        activeMembers: activeMemsRes.status === 'fulfilled' ? (activeMemsRes.value as { count: number } | null)?.count || 0 : 0,
        totalMedia: totalMediaCount,
        mediaUsedBytes: mediaBytes,
      });

      if (auditRes.status === 'fulfilled') {
        setRecentAuditLogs(((auditRes.value as any)?.data || []) as AuditLogEntry[]);
      }
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchLiveStats();
      setLoading(false);
    };
    load();
  }, [fetchLiveStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLiveStats();
    setRefreshing(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const liveFanChatCount = useMemo(() => conversations.filter((c) => c.type === 'fan' && c.status === 'open').length, [conversations]);
  const liveBizEnqCount = useMemo(() => businessEnquiries.filter((c) => c.type === 'business' && c.status === 'open').length, [businessEnquiries]);

  const statCards = [
    { label: 'Total Members', value: liveStats.totalMembers.toLocaleString(), icon: Users, color: '#A6852F', target: 'members' as AdminSection },
    { label: 'Active Members', value: liveStats.activeMembers.toLocaleString(), icon: UserCheck, color: '#16A34A', target: 'members' as AdminSection },
    { label: 'Pending Registrations', value: liveStats.pendingRegistrations, icon: Clock, color: '#F59E0B', target: 'applications' as AdminSection },
    { label: 'Membership Requests', value: liveStats.pendingMembershipRequests, icon: Crown, color: '#8B5CF6', target: 'membership-requests' as AdminSection },
    { label: 'Payment Requests', value: liveStats.pendingPaymentRequests, icon: DollarSign, color: '#EC4899', target: 'payment-requests' as AdminSection },
    { label: 'Payment Submissions', value: liveStats.pendingPaymentSubmissions, icon: CreditCard, color: '#F97316', target: 'payment-submissions' as AdminSection },
    { label: 'Fan Chat Open', value: liveFanChatCount, icon: MessageSquare, color: '#3B82F6', target: 'fan-chat' as AdminSection },
    { label: 'Business Enquiries', value: liveBizEnqCount, icon: Building2, color: '#6366F1', target: 'business-chat' as AdminSection },
    { label: 'Experience Requests', value: stats.experienceRequests, icon: Sparkles, color: '#EC4899', target: 'experience-requests' as AdminSection },
    { label: 'Media Assets', value: liveStats.totalMedia, icon: Film, color: '#14B8A6', target: 'images' as AdminSection },
  ];

  const pendingActions = [
    { label: 'Pending Registrations', count: liveStats.pendingRegistrations, icon: Clock, color: '#F59E0B', target: 'applications' as AdminSection },
    { label: 'Membership Requests', count: liveStats.pendingMembershipRequests, icon: Crown, color: '#8B5CF6', target: 'membership-requests' as AdminSection },
    { label: 'Payment Requests', count: liveStats.pendingPaymentRequests, icon: DollarSign, color: '#EC4899', target: 'payment-requests' as AdminSection },
    { label: 'Payment Submissions', count: liveStats.pendingPaymentSubmissions, icon: CreditCard, color: '#F97316', target: 'payment-submissions' as AdminSection },
    { label: 'Open Fan Chats', count: liveFanChatCount, icon: MessageSquare, color: '#3B82F6', target: 'fan-chat' as AdminSection },
    { label: 'Business Enquiries', count: liveBizEnqCount, icon: Building2, color: '#6366F1', target: 'business-chat' as AdminSection },
  ];

  const quickActions = [
    { label: 'Manage Members', icon: Users, color: '#A6852F', target: 'members' as AdminSection },
    { label: 'Review Applications', icon: Clock, color: '#F59E0B', target: 'applications' as AdminSection },
    { label: 'Content Manager', icon: FileText, color: '#3B82F6', target: 'journey' as AdminSection },
    { label: 'View Analytics', icon: TrendingUp, color: '#16A34A', target: 'visitors' as AdminSection },
    { label: 'Media Library', icon: Image, color: '#8B5CF6', target: 'images' as AdminSection },
    { label: 'System Settings', icon: Shield, color: '#6366F1', target: 'website-settings' as AdminSection },
  ];

  const systemHealth = [
    { label: 'Storage Used', value: formatBytes(liveStats.mediaUsedBytes), icon: HardDrive, color: '#A6852F' },
    { label: 'Total Media', value: liveStats.totalMedia.toString(), icon: Database, color: '#3B82F6' },
    { label: 'Active Members', value: liveStats.activeMembers.toString(), icon: UserCheck, color: '#16A34A' },
    { label: 'Pending Items', value: (liveStats.pendingRegistrations + liveStats.pendingMembershipRequests + liveStats.pendingPaymentRequests + liveStats.pendingPaymentSubmissions).toString(), icon: AlertTriangle, color: '#F59E0B' },
  ];

  const getAuditActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <CheckCircle className="w-3 h-3 text-[#16A34A]" />;
      case 'update': return <RefreshCw className="w-3 h-3 text-[#3B82F6]" />;
      case 'delete': return <XCircle className="w-3 h-3 text-[#DC2626]" />;
      case 'approve': return <CheckCircle className="w-3 h-3 text-[#16A34A]" />;
      case 'reject': return <XCircle className="w-3 h-3 text-[#DC2626]" />;
      case 'login': return <Shield className="w-3 h-3 text-[#8B5CF6]" />;
      default: return <Activity className="w-3 h-3 text-[#57534E]" />;
    }
  };

  const formatAuditTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#57534E] mt-1">Welcome back, Super Admin. Here's your website overview.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Pending Actions Banner */}
      {pendingActions.some((a) => a.count > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-xl border border-[#F59E0B]/30 bg-gradient-to-r from-[#F59E0B]/8 to-transparent p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Pending Actions Required</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pendingActions.filter((a) => a.count > 0).map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.target)}
                className="flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-500 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${action.color}40`,
                  borderColor: `${action.color}90`,
                  boxShadow: `0 0 30px ${action.color}30`,
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                  <action.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-none" style={{ color: action.color }}>{action.count}</p>
                  <p className="text-[9px] text-[#57534E] mt-0.5 truncate">{action.label}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group"
            style={{
              backgroundColor: `${card.color}40`,
              borderColor: `${card.color}90`,
              boxShadow: `0 0 50px ${card.color}50, 0 0 100px ${card.color}25, inset 0 1px 0 ${card.color}35`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            onClick={() => onNavigate(card.target)}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${card.color}45`, color: card.color }}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: card.color }} />
            </div>
            <p className="text-xl font-editorial leading-none" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: card.color, opacity: 0.7 }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Notifications</h3>
            <button onClick={() => onNavigate('admin-notifications')} className="text-[10px] text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-1.5">
            {notifications.length === 0 ? (
              <p className="text-xs text-[#57534E] py-4 text-center">No notifications</p>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div key={n.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${!n.read ? 'bg-[#A6852F]/8 border border-[#A6852F]/15' : 'hover:bg-[#F3F1ED]/50 border border-transparent'}`}>
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${!n.read ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[#1C1917]">{n.title}</p>
                    <p className="text-[10px] text-[#57534E] mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-[#57534E]/50 mt-0.5">{n.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.target)}
                className="flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-500 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${action.color}40`,
                  borderColor: `${action.color}90`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}55`;
                  e.currentTarget.style.borderColor = `${action.color}aa`;
                  e.currentTarget.style.boxShadow = `0 8px 50px ${action.color}55, 0 0 80px ${action.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}40`;
                  e.currentTarget.style.borderColor = `${action.color}90`;
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${action.color}35`, color: action.color }}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#1C1917] leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Audit Logs */}
        <motion.div
          className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-[0.05em]">Recent Audit Logs</h3>
            <button onClick={() => onNavigate('overview')} className="text-[10px] text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-1.5">
            {recentAuditLogs.length === 0 ? (
              <p className="text-xs text-[#57534E] py-4 text-center">No audit logs</p>
            ) : (
              recentAuditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F3F1ED]/50 transition-colors">
                  {getAuditActionIcon(log.action)}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#1C1917]">
                      <span className="font-medium capitalize">{log.action}</span>
                      <span className="text-[#57534E]"> on </span>
                      <span className="font-medium">{log.table_name}</span>
                    </p>
                    <p className="text-[9px] text-[#57534E]/50">{formatAuditTime(log.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          className="rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xs font-semibold text-[#1C1917] mb-3 uppercase tracking-[0.05em]">System Health</h3>
          <div className="grid grid-cols-2 gap-3">
            {systemHealth.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 border-2 transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${item.color}40`,
                  borderColor: `${item.color}90`,
                  boxShadow: `0 0 40px ${item.color}40, inset 0 1px 0 ${item.color}30`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}45`, color: item.color }}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.label}</span>
                </div>
                <p className="text-lg font-editorial leading-none" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
