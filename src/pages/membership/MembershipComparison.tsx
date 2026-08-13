import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export const MembershipComparison: React.FC = () => {
  const { membershipTiers } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const allBenefitLabels = Array.from(
    new Set(membershipTiers.flatMap((tier) => tier.features.map((f) => f.label)))
  );

  return (
    <section id="membership-comparison" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Compare Plans
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Membership benefits.
          </h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="rounded-[1.5rem] overflow-hidden border border-[#E8E5DF]/60 bg-white"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_repeat(3,1fr)] border-b border-[#E8E5DF]/60 bg-[#F3F1ED]/40">
            <div className="p-5 sm:p-6">
              <span className="text-xs font-medium text-[#57534E] uppercase tracking-[0.05em]">Benefits</span>
            </div>
            {membershipTiers.map((tier) => (
              <div key={tier.id} className={`p-5 sm:p-6 text-center ${tier.isPopular ? 'bg-[#A6852F]/5' : ''}`}>
                <span className={`text-[11px] font-medium tracking-[0.1em] uppercase ${
                  tier.isPopular ? 'text-[#A6852F]' : 'text-[#57534E]'
                }`}>
                  {tier.name}
                </span>
                <div className="mt-2">
                  <span className="text-xl font-editorial text-[#1C1917]">${tier.price}</span>
                  <span className="text-[10px] text-[#57534E]">{tier.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {allBenefitLabels.map((benefitLabel, idx) => (
            <div
              key={benefitLabel}
              className={`grid grid-cols-[1fr_repeat(3,1fr)] ${
                idx < allBenefitLabels.length - 1 ? 'border-b border-[#E8E5DF]/40' : ''
              }`}
            >
              <div className="p-5 sm:p-6 flex items-center">
                <span className="text-sm text-[#1C1917]">{benefitLabel}</span>
              </div>
              {membershipTiers.map((tier) => {
                const benefit = tier.features.find((f) => f.label === benefitLabel);
                const isIncluded = benefit?.included ?? false;

                return (
                  <div key={tier.id} className={`p-5 sm:p-6 flex items-center justify-center ${tier.isPopular ? 'bg-[#A6852F]/5' : ''}`}>
                    {benefit ? (
                      isIncluded ? (
                        <Check className="w-5 h-5 text-[#16A34A]" />
                      ) : (
                        <X className="w-5 h-5 text-[#D1D5DB]" />
                      )
                    ) : (
                      <span className="text-[#D1D5DB]">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
