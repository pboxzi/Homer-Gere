import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Check, Star, X, Shield, Zap, Clock, CreditCard } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';

const TIER_ICONS: Record<string, React.ReactNode> = {
  silver: <Shield className="w-3 h-3" />,
  gold: <Crown className="w-3 h-3" />,
  platinum: <Zap className="w-3 h-3" />,
};

const TIER_COLORS: Record<string, string> = {
  silver: '#9CA3AF',
  gold: '#A6852F',
  platinum: '#8B5CF6',
};

export const DashboardMembership: React.FC = () => {
  const navigate = useNavigate();
  const { membership } = useDashboard();
  const { membershipTiers } = useSiteContent();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Explore plans and manage your membership.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current Plan', value: membership.plan, color: '#A6852F' },
          { label: 'Member Since', value: membership.activationDate || '—', color: '#16A34A' },
          { label: 'Next Renewal', value: membership.renewalDate || '—', color: '#8B5CF6' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all duration-500"
            style={{ backgroundColor: `${s.color}10` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <p className="text-lg font-editorial" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-medium" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-sm font-medium text-[#1C1917] mb-3">All Membership Plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {membershipTiers.map((tier, i) => {
            const isCurrent = tier.name === membership.plan;
            const isPopular = tier.isPopular;
            const color = TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div
                key={tier.id}
                className="rounded-xl border bg-white p-4 transition-all duration-500 cursor-pointer hover:shadow-lg"
                style={{
                  borderColor: isCurrent ? `${color}60` : `${color}30`,
                  boxShadow: isCurrent ? `0 0 25px ${color}30, 0 4px 15px ${color}15` : `0 0 15px ${color}12, 0 2px 8px ${color}08`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: `${color}20`, color, boxShadow: `0 0 10px ${color}15` }}
                  >
                    {TIER_ICONS[tier.id] || <Crown className="w-3 h-3" />}
                    {tier.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCurrent && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color, boxShadow: `0 0 8px ${color}12` }}>Current</span>}
                    {isPopular && !isCurrent && tier.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color, boxShadow: `0 0 8px ${color}12` }}>{tier.badge}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#57534E]">
                    <CreditCard className="w-3 h-3" />
                    <span className="font-medium">{tier.currency === 'USD' ? '$' : tier.currency}{tier.price}</span>
                    <span>/{tier.period}</span>
                  </div>
                  <span className="text-[10px] text-[#57534E]/60">{tier.features.filter((f) => f.included).length} features</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
