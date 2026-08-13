import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface MembershipCTAProps {
  onBecomeMember: () => void;
  onOpenChat: () => void;
}

export const MembershipCTA: React.FC<MembershipCTAProps> = ({ onBecomeMember, onOpenChat }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="membership-cta" ref={sectionRef} className="py-24 sm:py-32 bg-[#1C1917]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Join Today
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-white tracking-tight leading-[1.1]">
            Join the Official Membership
          </h2>

          <p className="text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            Become part of Homer's inner circle. Access exclusive content, priority experiences,
            and a direct connection to his creative journey.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onBecomeMember}
              className="inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 focus:outline-none cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              Become a Member
            </button>

            <button
              onClick={onOpenChat}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 active:scale-95 text-white/80 hover:text-white font-medium text-sm px-7 py-4 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer border border-white/20 hover:border-white/30"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with Homer
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
