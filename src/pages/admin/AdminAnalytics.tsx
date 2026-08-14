import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  UserCheck,
  DollarSign,
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Heart,
  Briefcase,
  Timer,
  ThumbsUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminSection } from '../../data/adminData';

interface AdminAnalyticsProps {
  activeSection: AdminSection;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTHLY_VISITORS: number[] = [];
const DAILY_VISITORS: number[] = [];

const TOP_PAGES: { page: string; views: number; unique: number; avgTime: string }[] = [];

const MEMBERSHIP_GROWTH: number[] = [];

const EXPERIENCE_REQUESTS_MONTHLY: number[] = [];

const CHAT_ACTIVITY_MONTHLY: number[] = [];

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  approved: '#16A34A',
  declined: '#EF4444',
  completed: '#3B82F6',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function VisitorsSection() {
  const { stats } = useAdmin();

  const summaryCards = [
    { label: 'Total Visitors', value: stats.websiteVisitors.toLocaleString(), icon: Eye, color: '#A6852F', bg: '#A6852F15' },
    { label: 'Page Views', value: '0', icon: BarChart3, color: '#3B82F6', bg: '#3B82F615' },
    { label: 'Bounce Rate', value: '0%', icon: ArrowDownRight, color: '#EF4444', bg: '#EF444415' },
    { label: 'Avg Session Duration', value: '0m 0s', icon: Clock, color: '#16A34A', bg: '#16A34A15' },
  ];

  const maxVisitor = Math.max(...MONTHLY_VISITORS);
  const maxDaily = Math.max(...DAILY_VISITORS);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border border-[#E8E5DF]/60 bg-white transition-shadow duration-300 hover:shadow-lg"
            style={{ boxShadow: `0 0 20px ${card.bg}, 0 4px 15px rgba(0,0,0,0.03)` }}
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1C1917]">{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Monthly Visitor Trends</h3>
          <div className="h-48 flex items-end gap-1.5">
            {MONTHLY_VISITORS.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t bg-[#A6852F]/30 hover:bg-[#A6852F] transition-all duration-300 cursor-pointer relative"
                  style={{ height: `${(val / maxVisitor) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm border border-[#E8E5DF]/60">
                    {val.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Daily Visitors (Last 30 Days)</h3>
          <div className="h-48 flex items-end gap-0.5">
            {DAILY_VISITORS.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full rounded-t transition-all duration-300 cursor-pointer relative"
                  style={{
                    height: `${(val / maxDaily) * 100}%`,
                    backgroundColor: i === DAILY_VISITORS.length - 1 ? '#A6852F' : '#A6852F40',
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-medium text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 py-0.5 rounded shadow-sm border border-[#E8E5DF]/60">
                    {val}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            <span>1</span>
            <span>7</span>
            <span>15</span>
            <span>22</span>
            <span>30</span>
          </div>
        </motion.div>
      </div>

      <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Top Pages</h3>
        <div className="overflow-x-auto">
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-[#E8E5DF]/60">
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider">Page</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Views</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Unique Visitors</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Avg Time</span>
            </div>
            {TOP_PAGES.map((page, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-2.5 border-b border-[#E8E5DF]/30 hover:bg-[#F5F0E8]/30 transition-colors">
                <span className="text-xs font-medium text-[#1C1917]">{page.page}</span>
                <span className="text-xs text-[#57534E] text-right">{page.views.toLocaleString()}</span>
                <span className="text-xs text-[#57534E] text-right">{page.unique.toLocaleString()}</span>
                <span className="text-xs text-[#57534E] text-right">{page.avgTime}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MembershipStatsSection() {
  const { stats, members, plans, payments } = useAdmin();

  const revenue = useMemo(
    () => payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    [payments]
  );

  const tierBreakdown = useMemo(() => {
    const counts: Record<string, number> = { Silver: 0, Gold: 0, Platinum: 0 };
    members.forEach((m) => {
      if (m.membership in counts) counts[m.membership]++;
    });
    const total = members.length || 1;
    return [
      { label: 'Silver', count: counts.Silver, pct: Math.round((counts.Silver / total) * 100), color: '#94A3B8' },
      { label: 'Gold', count: counts.Gold, pct: Math.round((counts.Gold / total) * 100), color: '#A6852F' },
      { label: 'Platinum', count: counts.Platinum, pct: Math.round((counts.Platinum / total) * 100), color: '#6366F1' },
    ];
  }, [members]);

  const recentSignups = useMemo(() => members.slice(0, 5), [members]);

  const maxGrowth = Math.max(...MEMBERSHIP_GROWTH);

  const summaryCards = [
    { label: 'Total Members', value: stats.totalMembers.toLocaleString(), icon: Users, color: '#A6852F', bg: '#A6852F15' },
    { label: 'Active Members', value: stats.activeMemberships.toLocaleString(), icon: UserCheck, color: '#16A34A', bg: '#16A34A15' },
    { label: 'Growth Rate', value: '0%', icon: TrendingUp, color: '#3B82F6', bg: '#3B82F615' },
    { label: 'Revenue', value: `$${(revenue / 1000).toFixed(1)}k`, icon: DollarSign, color: '#8B5CF6', bg: '#8B5CF615' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border border-[#E8E5DF]/60 bg-white transition-shadow duration-300 hover:shadow-lg"
            style={{ boxShadow: `0 0 20px ${card.bg}, 0 4px 15px rgba(0,0,0,0.03)` }}
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1C1917]">{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Membership Growth</h3>
          <div className="h-48 flex items-end gap-1.5">
            {MEMBERSHIP_GROWTH.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t bg-[#16A34A]/30 hover:bg-[#16A34A] transition-all duration-300 cursor-pointer relative"
                  style={{ height: `${(val / maxGrowth) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm border border-[#E8E5DF]/60">
                    {val.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Tier Breakdown</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-36 h-36 flex-shrink-0">
              {(() => {
                let offset = 0;
                return tierBreakdown.map((tier, i) => {
                  const dash = (tier.pct / 100) * 283;
                  const gap = 3;
                  const el = (
                    <circle
                      key={i}
                      cx="56"
                      cy="56"
                      r="45"
                      fill="none"
                      stroke={tier.color}
                      strokeWidth="18"
                      strokeDasharray={`${Math.max(dash - gap, 0)} ${283 - dash + gap}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  );
                  offset += dash;
                  return el;
                });
              })()}
              <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return tierBreakdown.map((tier, i) => {
                    const dash = (tier.pct / 100) * 283;
                    const gap = 3;
                    const el = (
                      <circle
                        key={i}
                        cx="56"
                        cy="56"
                        r="45"
                        fill="none"
                        stroke={tier.color}
                        strokeWidth="18"
                        strokeDasharray={`${Math.max(dash - gap, 0)} ${283 - dash + gap}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              {tierBreakdown.map((tier) => (
                <div key={tier.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tier.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#1C1917]">{tier.label}</span>
                      <span className="text-[10px] text-[#57534E]">{tier.count} members</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F0E8] rounded-full mt-1">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${tier.pct}%`, backgroundColor: tier.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Recent Signups</h3>
        <div className="space-y-2">
          {recentSignups.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#F5F0E8]/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#A6852F]/15 flex items-center justify-center text-[10px] font-bold text-[#A6852F]">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1C1917] truncate">{member.name}</p>
                <p className="text-[10px] text-[#57534E]">{member.email}</p>
              </div>
              <div className="text-right">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${member.membership === 'Platinum' ? '#6366F1' : member.membership === 'Gold' ? '#A6852F' : '#94A3B8'}18`,
                    color: member.membership === 'Platinum' ? '#6366F1' : member.membership === 'Gold' ? '#A6852F' : '#94A3B8',
                  }}
                >
                  {member.membership}
                </span>
                <p className="text-[9px] text-[#57534E] mt-0.5">{member.joinDate}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ExperienceStatsSection() {
  const { stats, experienceRequests, experiences } = useAdmin();

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, declined: 0, completed: 0 };
    experienceRequests.forEach((r) => {
      counts[r.status]++;
    });
    return counts;
  }, [experienceRequests]);

  const total = experienceRequests.length || 1;

  const maxRequests = Math.max(...EXPERIENCE_REQUESTS_MONTHLY);

  const summaryCards = [
    { label: 'Total Requests', value: stats.experienceRequests.toString(), icon: Sparkles, color: '#8B5CF6', bg: '#8B5CF615' },
    { label: 'Pending', value: statusCounts.pending.toString(), icon: AlertCircle, color: '#F59E0B', bg: '#F59E0B15' },
    { label: 'Completed', value: statusCounts.completed.toString(), icon: CheckCircle, color: '#16A34A', bg: '#16A34A15' },
    { label: 'Revenue', value: '$0.0k', icon: DollarSign, color: '#A6852F', bg: '#A6852F15' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border border-[#E8E5DF]/60 bg-white transition-shadow duration-300 hover:shadow-lg"
            style={{ boxShadow: `0 0 20px ${card.bg}, 0 4px 15px rgba(0,0,0,0.03)` }}
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1C1917]">{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Requests Over Time</h3>
          <div className="h-48 flex items-end gap-1.5">
            {EXPERIENCE_REQUESTS_MONTHLY.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t bg-[#8B5CF6]/30 hover:bg-[#8B5CF6] transition-all duration-300 cursor-pointer relative"
                  style={{ height: `${(val / maxRequests) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm border border-[#E8E5DF]/60">
                    {val}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Status Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                    <span className="text-xs font-medium text-[#1C1917] capitalize">{status}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: STATUS_COLORS[status] }}>{count}</span>
                </div>
                <div className="w-full h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(count / total) * 100}%`, backgroundColor: STATUS_COLORS[status] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Top Experiences</h3>
        <div className="overflow-x-auto">
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-[#E8E5DF]/60">
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider">Experience</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Type</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Price</span>
              <span className="text-[10px] font-semibold text-[#57534E] uppercase tracking-wider text-right">Requests</span>
            </div>
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4 py-2.5 border-b border-[#E8E5DF]/30 hover:bg-[#F5F0E8]/30 transition-colors">
                <span className="text-xs font-medium text-[#1C1917]">{exp.title}</span>
                <span className="text-xs text-[#57534E] text-right capitalize">{exp.type.replace(/-/g, ' ')}</span>
                <span className="text-xs text-[#57534E] text-right">{exp.price}</span>
                <span className="text-xs text-[#57534E] text-right font-medium">{exp.requests}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ChatStatsSection() {
  const { stats, conversations } = useAdmin();

  const fanConversations = useMemo(() => conversations.filter((c) => c.type === 'fan'), [conversations]);
  const businessConversations = useMemo(() => conversations.filter((c) => c.type === 'business'), [conversations]);
  const openConversations = useMemo(() => conversations.filter((c) => c.status === 'open'), [conversations]);

  const maxChat = Math.max(...CHAT_ACTIVITY_MONTHLY);

  const summaryCards = [
    { label: 'Total Conversations', value: conversations.length.toString(), icon: MessageSquare, color: '#3B82F6', bg: '#3B82F615' },
    { label: 'Open', value: openConversations.length.toString(), icon: AlertCircle, color: '#F59E0B', bg: '#F59E0B15' },
    { label: 'Avg Response Time', value: '0h', icon: Timer, color: '#16A34A', bg: '#16A34A15' },
    { label: 'Satisfaction', value: '0%', icon: ThumbsUp, color: '#8B5CF6', bg: '#8B5CF615' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl p-4 border border-[#E8E5DF]/60 bg-white transition-shadow duration-300 hover:shadow-lg"
            style={{ boxShadow: `0 0 20px ${card.bg}, 0 4px 15px rgba(0,0,0,0.03)` }}
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1C1917]">{card.value}</p>
            <p className="text-[11px] text-[#57534E] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Chat Activity</h3>
          <div className="h-48 flex items-end gap-1.5">
            {CHAT_ACTIVITY_MONTHLY.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t bg-[#3B82F6]/30 hover:bg-[#3B82F6] transition-all duration-300 cursor-pointer relative"
                  style={{ height: `${(val / maxChat) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm border border-[#E8E5DF]/60">
                    {val}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-[#57534E]">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Fan vs Business</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span className="text-xs font-medium text-[#1C1917]">Fan Conversations</span>
                </div>
                <span className="text-xs font-bold text-[#EC4899]">{fanConversations.length}</span>
              </div>
              <div className="w-full h-3 bg-[#F5F0E8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#EC4899] transition-all duration-700"
                  style={{ width: `${(fanConversations.length / (conversations.length || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs font-medium text-[#1C1917]">Business Conversations</span>
                </div>
                <span className="text-xs font-bold text-[#3B82F6]">{businessConversations.length}</span>
              </div>
              <div className="w-full h-3 bg-[#F5F0E8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#3B82F6] transition-all duration-700"
                  style={{ width: `${(businessConversations.length / (conversations.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div className="rounded-xl border border-[#A6852F]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300" {...fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <h3 className="text-sm font-semibold text-[#1C1917] mb-4">Recent Conversations</h3>
        <div className="space-y-2">
          {conversations.slice(0, 5).map((conv) => (
            <div key={conv.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#F5F0E8]/30 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                conv.type === 'fan' ? 'bg-[#EC4899]/15 text-[#EC4899]' : 'bg-[#3B82F6]/15 text-[#3B82F6]'
              }`}>
                {conv.type === 'fan' ? <Heart className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-[#1C1917] truncate">{conv.participant}</p>
                  {conv.company && (
                    <span className="text-[9px] text-[#57534E] truncate">· {conv.company}</span>
                  )}
                </div>
                <p className="text-[10px] text-[#57534E] truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                  conv.status === 'open' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
                  conv.status === 'in_progress' ? 'bg-[#3B82F6]/15 text-[#3B82F6]' :
                  'bg-[#16A34A]/15 text-[#16A34A]'
                }`}>
                  {conv.status.replace('_', ' ')}
                </span>
                <p className="text-[9px] text-[#57534E] mt-0.5">{conv.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'visitors':
        return <VisitorsSection />;
      case 'membership-stats':
        return <MembershipStatsSection />;
      case 'experience-stats':
        return <ExperienceStatsSection />;
      case 'chat-stats':
        return <ChatStatsSection />;
      default:
        return <VisitorsSection />;
    }
  };

  const titles: Record<string, { title: string; desc: string }> = {
    visitors: { title: 'Visitor Analytics', desc: 'Track website traffic, page views, and user engagement.' },
    'membership-stats': { title: 'Membership Statistics', desc: 'Monitor membership growth, tier distribution, and revenue.' },
    'experience-stats': { title: 'Experience Analytics', desc: 'Track experience requests, approvals, and top experiences.' },
    'chat-stats': { title: 'Chat Statistics', desc: 'Monitor conversations, response times, and fan engagement.' },
  };

  const current = titles[activeSection] || titles.visitors;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">{current.title}</h1>
        <p className="text-sm text-[#57534E] mt-1">{current.desc}</p>
      </motion.div>

      {renderSection()}
    </div>
  );
};

export default AdminAnalytics;
