import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, X, Crown, Shield, Zap } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface MembershipPlansProps {
  onSelectTier: (tierId: string) => void;
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  silver: <Shield className="w-5 h-5" />,
  gold: <Crown className="w-5 h-5" />,
  platinum: <Zap className="w-5 h-5" />,
};

const TIER_COLORS: Record<string, string> = {
  silver: '#9CA3AF',
  gold: '#A6852F',
  platinum: '#8B5CF6',
};

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectTier }) => {
  const { membershipTiers } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="membership-plans" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Membership Plans
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Choose your tier.
          </h2>
          <p className="text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Every plan is managed by Homer's team. Select the tier that matches your level of interest.
          </p>
        </motion.div>

        {/* Plans Grid — ATM Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {membershipTiers.map((tier, idx) => {
            const tierColor = TIER_COLORS[tier.name.toLowerCase()] || TIER_COLORS[tier.id] || '#A6852F';
            const isPopular = tier.isPopular;

            return (
              <motion.div
                key={tier.id}
                className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] group flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${tierColor}F5, ${tierColor}E8 50%, ${tierColor}D9 75%, ${tierColor}E6)`,
                  boxShadow: `0 10px 40px ${tierColor}65, 0 0 60px ${tierColor}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onSelectTier(tier.id)}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-25%, 25%)' }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-50%, -50%)' }} />

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Card top: chip + badges */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-8 rounded-md border border-white/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}>
                      <div className="w-6 h-4 rounded-sm bg-white/40" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isPopular && tier.badge && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">{tier.badge}</span>}
                      {tier.requiresApproval && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">Approval Required</span>}
                    </div>
                  </div>

                  {/* Tier Name + Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-widest opacity-80 font-medium">{tier.name}</p>
                    <div className="opacity-80">
                      {TIER_ICONS[tier.name.toLowerCase()] || TIER_ICONS[tier.id] || <Crown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-white/70 leading-relaxed mb-4">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-5">
                    <p className="text-3xl font-editorial">${tier.price}<span className="text-sm font-normal opacity-70">/{tier.period}</span></p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[11px]">
                        {feature.included ? (
                          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/80" />
                        ) : (
                          <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/30" />
                        )}
                        <span className={feature.included ? 'text-white/80' : 'text-white/35'}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="pt-3 border-t border-white/20">
                    <span className="w-full py-3 px-6 rounded-xl text-xs font-medium transition-all duration-300 block text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 cursor-pointer active:scale-[0.98]">
                      {tier.ctaText}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
