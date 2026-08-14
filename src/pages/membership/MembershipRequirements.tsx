import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { FileCheck, Clock, ShieldCheck, UserCheck } from 'lucide-react';

const REQUIREMENTS = [
  {
    icon: FileCheck,
    title: 'Complete Application',
    description: 'Fill out the membership application form with your details and select your preferred tier.',
  },
  {
    icon: UserCheck,
    title: 'Review Process',
    description: 'Our team reviews each application to ensure a genuine and respectful community.',
  },
  {
    icon: Clock,
    title: 'Approval & Payment',
    description: 'Once approved, you\'ll receive payment instructions to activate your membership.',
  },
  {
    icon: ShieldCheck,
    title: 'Welcome to the Community',
    description: 'After payment confirmation, your membership is active and all benefits unlock immediately.',
  },
];

export const MembershipRequirements: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <motion.span
            className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Requirements
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            What you need to know.
          </motion.h2>
          <motion.p
            className="text-base text-[#57534E] leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Membership is open to fans who share a genuine appreciation for Homer's work.
            Each application is reviewed to maintain a respectful community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {REQUIREMENTS.map((req, idx) => (
            <motion.div
              key={req.title}
              className="flex items-start gap-5 p-6 rounded-[1.5rem] bg-[#F3F1ED]/60 border border-[#E8E5DF]/40"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                <req.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-editorial text-[#1C1917] mb-1">{req.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{req.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
