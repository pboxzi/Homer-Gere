import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Bell, Film, Star, Ticket, Download, Users } from 'lucide-react';

export const MembershipWhy: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const benefits = [
    { icon: <Bell className="w-5 h-5" />, label: 'Exclusive Updates' },
    { icon: <Film className="w-5 h-5" />, label: 'Early Announcements' },
    { icon: <Star className="w-5 h-5" />, label: 'Members-Only Content' },
    { icon: <Ticket className="w-5 h-5" />, label: 'Priority Access' },
    { icon: <Download className="w-5 h-5" />, label: 'Digital Content' },
    { icon: <Users className="w-5 h-5" />, label: 'Member Communications' },
  ];

  return (
    <section id="membership-why" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <motion.span
            className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Why Become a Member
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            A deeper connection to the journey.
          </motion.h2>

          <motion.p
            className="text-base text-[#57534E] leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Homer's official membership is designed for fans who want to be part of his
            creative journey. Receive exclusive updates, early access to project news,
            and connect with a community of dedicated supporters.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#F3F1ED]/60"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
                {benefit.icon}
              </div>
              <span className="text-sm font-medium text-[#1C1917]">{benefit.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-[11px] text-[#57534E] leading-relaxed mt-10 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          All benefits are configured by Homer's management team and may be updated.
          Membership does not guarantee direct communication or meetings with Homer.
        </motion.p>
      </div>
    </section>
  );
};
