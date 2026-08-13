import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, X, Star, Crown } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../../data/content';

interface MembershipPlansProps {
  onSelectTier: (tierId: string) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectTier }) => {
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
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Membership Plans
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Choose your tier.
          </h2>
          <p className="text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Every plan is managed by Homer's team. Select the tier that matches your level of interest.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_TIERS.map((tier, idx) => {
            const isPopular = tier.isPopular;

            return (
              <motion.div
                key={tier.id}
                className={`relative rounded-[1.5rem] overflow-hidden transition-all duration-500 flex flex-col ${
                  isPopular
                    ? 'bg-[#C9A84C]/8 ring-1 ring-[#C9A84C]/30 shadow-xl shadow-[#C9A84C]/5'
                    : 'bg-white border border-[#E8E5DF]/60'
                }`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Badge */}
                {isPopular && tier.badge && (
                  <div className="bg-[#C9A84C] text-white text-[10px] font-medium tracking-widest uppercase text-center py-2">
                    {tier.badge}
                  </div>
                )}

                <div className="p-8 sm:p-9 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {tier.id === 'platinum' ? (
                        <Crown className="w-5 h-5 text-[#C9A84C]" />
                      ) : (
                        <Star className={`w-5 h-5 ${isPopular ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#D1D5DB]'}`} />
                      )}
                      <span className={`text-[11px] font-medium tracking-[0.15em] uppercase ${
                        isPopular ? 'text-[#C9A84C]' : 'text-[#57534E]'
                      }`}>
                        {tier.name}
                      </span>
                    </div>
                    {tier.requiresApproval && (
                      <span className="text-[9px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
                        Approval Required
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-[13px] text-[#57534E]">{tier.currency === 'USD' ? '$' : tier.currency}</span>
                    <span className="text-4xl sm:text-5xl font-editorial text-[#1C1917]">{tier.price}</span>
                    <span className="text-xs text-[#57534E] font-medium">{tier.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-8 flex-1">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-[#D1D5DB] mt-0.5 shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3.5 px-6 rounded-2xl text-xs font-medium transition-all duration-300 active:scale-[0.98] focus:outline-none cursor-pointer ${
                      isPopular
                        ? 'bg-[#C9A84C] hover:bg-[#B8983A] text-white'
                        : 'bg-[#1C1917] hover:bg-[#292524] text-white'
                    }`}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
