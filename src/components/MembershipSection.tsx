import React from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Shield, Zap, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface MembershipSectionProps {
  onNavigate: (sectionId: string) => void;
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

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onNavigate }) => {
  const { membershipTiers } = useSiteContent();

  return (
    <section id="membership" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">Membership</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight leading-[1.1] hover-underline">
              Join the journey. <br className="hidden sm:inline" />Be part of more.
            </h2>
            <p className="text-[#78716C] text-sm sm:text-base mt-5 leading-relaxed">
              Become a member and unlock exclusive benefits, early access, and unforgettable experiences directly with Homer.
            </p>
          </div>
          <button onClick={() => onNavigate('membership')} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer group">
            View All Plans<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {membershipTiers.map((tier, i) => {
            const tierColor = TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div
                key={tier.id}
                onClick={() => onNavigate('membership')}
                className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] group"
                style={{
                  background: `linear-gradient(135deg, ${tierColor}, ${tierColor} 50%, ${tierColor}E6 75%, ${tierColor}F2)`,
                  boxShadow: `0 12px 48px ${tierColor}80, 0 0 80px ${tierColor}50, inset 0 1px 0 rgba(255,255,255,0.25)`,
                }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-25%, 25%)' }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-50%, -50%)' }} />

                <div className="relative z-10">
                  {/* Card top: chip + badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-8 rounded-md border border-white/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}>
                      <div className="w-6 h-4 rounded-sm bg-white/40" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {tier.isPopular && tier.badge && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">{tier.badge}</span>}
                    </div>
                  </div>

                  {/* Name + Price */}
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-widest opacity-80 mb-1 font-medium">{tier.name}</p>
                    <p className="text-3xl font-editorial">${tier.price}<span className="text-sm font-normal opacity-70">/{tier.period}</span></p>
                  </div>

                  {/* Features preview */}
                  <ul className="space-y-2 mb-5">
                    {tier.features.filter((f) => f.included).slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px]">
                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/80" />
                        <span className="text-white/80">{feature.label}</span>
                      </li>
                    ))}
                    {tier.features.filter((f) => f.included).length > 3 && (
                      <li className="text-[10px] text-white/50 pl-5.5">+{tier.features.filter((f) => f.included).length - 3} more</li>
                    )}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <p className="text-[10px] opacity-70">{tier.features.filter((f) => f.included).length} features</p>
                    <div className="flex items-center gap-1 opacity-80">
                      {TIER_ICONS[tier.id] || <Crown className="w-5 h-5" />}
                    </div>
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
