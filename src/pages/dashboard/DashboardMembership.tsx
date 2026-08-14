import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Check, Star, X, Sparkles, Heart, Shield, Zap, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';

const TIER_ICONS: Record<string, React.ReactNode> = {
  silver: <Shield className="w-4 h-4" />,
  gold: <Crown className="w-4 h-4" />,
  platinum: <Zap className="w-4 h-4" />,
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

  const currentTier = membershipTiers.find((t) => t.name === membership.plan);
  const currentIndex = membershipTiers.findIndex((t) => t.name === membership.plan);
  const nextTier = currentIndex < membershipTiers.length - 1 ? membershipTiers[currentIndex + 1] : null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Explore plans and manage your membership.</p>
      </motion.div>

      {/* Welcome Banner */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#A6852F] via-[#B8983A] to-[#8B6F1F]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 opacity-80" />
            <span className="text-[10px] font-medium opacity-80 uppercase tracking-[0.2em]">Welcome to the Club</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial mb-3 leading-snug">
            You're part of something<br />truly special.
          </h2>
          <p className="text-sm opacity-80 leading-relaxed max-w-lg mb-6">
            Your membership unlocks a world of exclusive experiences, direct access, and a community that shares your passion. Every tier is crafted to bring you closer to the moments that matter.
          </p>
          {currentTier && (
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                {TIER_ICONS[membership.plan.toLowerCase()] || <Crown className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-[10px] opacity-70 uppercase tracking-wider">Current Plan</p>
                <p className="text-sm font-medium">{membership.plan}</p>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 font-medium ml-2">{membership.status}</span>
            </div>
          )}
        </div>
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
            className="rounded-xl p-4 text-center border border-[#A6852F]/10 bg-white shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
          >
            <p className="text-sm font-editorial" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#57534E] mt-1 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upgrade Prompt */}
      {nextTier && (
        <motion.div
          className="rounded-2xl border border-[#A6852F]/20 bg-gradient-to-r from-[#A6852F]/5 to-transparent p-5 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1C1917]">Ready to level up?</p>
            <p className="text-xs text-[#57534E] mt-0.5">Upgrade to <span className="font-medium text-[#A6852F]">{nextTier.name}</span> and unlock even more exclusive perks.</p>
          </div>
          <button onClick={() => navigate('/membership')} className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer whitespace-nowrap">
            View Plans
          </button>
        </motion.div>
      )}

      {/* Available Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">All Membership Plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membershipTiers.map((tier, i) => {
            const isCurrent = tier.name === membership.plan;
            const isPopular = tier.isPopular;
            const tierColor = TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div
                key={tier.id}
                className={`rounded-2xl border bg-white overflow-hidden transition-all duration-500 ${isCurrent ? 'border-[#A6852F]/40 shadow-lg shadow-[#A6852F]/15 ring-1 ring-[#A6852F]/20' : 'border-[#A6852F]/10 shadow-sm shadow-[#A6852F]/3 hover:shadow-md hover:shadow-[#A6852F]/8 hover:border-[#A6852F]/25'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              >
                {/* Tier Header */}
                <div className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${tierColor}08, transparent)` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tierColor}15`, color: tierColor }}>
                        {TIER_ICONS[tier.id] || <Crown className="w-4 h-4" />}
                      </div>
                      <span className={`text-[11px] font-medium tracking-[0.1em] uppercase ${isCurrent ? 'text-[#A6852F]' : 'text-[#57534E]'}`}>{tier.name}</span>
                    </div>
                    {isCurrent && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#A6852F]/15 text-[#A6852F] font-medium">Current</span>}
                    {isPopular && !isCurrent && tier.badge && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#A6852F]/10 text-[#A6852F] font-medium">{tier.badge}</span>}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="px-5 py-4 border-t border-[#E8E5DF]/40">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] text-[#57534E]">{tier.currency === 'USD' ? '$' : tier.currency}</span>
                    <span className="text-3xl font-editorial text-[#1C1917]">{tier.price}</span>
                    <span className="text-[10px] text-[#57534E] font-medium">{tier.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-5 py-4 border-t border-[#E8E5DF]/40">
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        {feature.included ? (
                          <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#D1D5DB] mt-0.5 shrink-0" />
                        )}
                        <span className={feature.included ? 'text-[#1C1917]' : 'text-[#A8A29E]'}>{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigate('/membership')}
                    className={`w-full py-3 rounded-2xl text-xs font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${isCurrent ? 'bg-[#A6852F]/10 text-[#A6852F] border border-[#A6852F]/25 hover:bg-[#A6852F]/15' : 'bg-[#1C1917] text-white hover:bg-[#292524]'}`}
                  >
                    {isCurrent ? 'Current Plan' : tier.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
