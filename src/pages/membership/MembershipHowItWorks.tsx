import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Layout, UserPlus, CreditCard, ShieldCheck, Gift } from 'lucide-react';
import { MEMBERSHIP_STEPS } from '../../data/content';

export const MembershipHowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'layout': return <Layout className="w-5 h-5" />;
      case 'user-plus': return <UserPlus className="w-5 h-5" />;
      case 'credit-card': return <CreditCard className="w-5 h-5" />;
      case 'shield-check': return <ShieldCheck className="w-5 h-5" />;
      case 'gift': return <Gift className="w-5 h-5" />;
      default: return <Layout className="w-5 h-5" />;
    }
  };

  return (
    <section id="membership-how" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Simple steps to join.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {MEMBERSHIP_STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              className="flex items-start gap-6 p-6 sm:p-8 rounded-[1.5rem] bg-white border border-[#E8E5DF]/60 hover:border-[#A6852F]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Step Number */}
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
                {getStepIcon(step.icon)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-medium text-[#A6852F] bg-[#A6852F]/10 px-2.5 py-0.5 rounded-full">
                    Step {step.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-editorial text-[#1C1917]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
