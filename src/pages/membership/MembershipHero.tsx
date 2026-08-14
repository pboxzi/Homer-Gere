import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { MEMBERSHIP_IMAGES, SECTION_IMAGES } from '../../data/images';

interface MembershipHeroProps {
  onBecomeMember: () => void;
  onComparePlans: () => void;
}

export const MembershipHero: React.FC<MembershipHeroProps> = ({ onBecomeMember, onComparePlans }) => {
  return (
    <section className="relative h-[75vh] min-h-[320px] sm:min-h-[550px] bg-[#FAF9F7] overflow-hidden pt-20">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img 
          src={SECTION_IMAGES.media.hero}
          alt="Homer Gere — Official Membership"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/15 to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7]/10 via-transparent to-[#FAF9F7]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Official Membership
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight leading-[1.02]"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Official Membership
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-[#1C1917] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Join Homer's official membership program for exclusive updates,
            priority access, and a direct connection to his career and creative journey.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onBecomeMember}
              className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Become a Member</span>
            </button>

            <button
              onClick={onComparePlans}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F3F1ED] active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#A6852F]" />
              <span>Compare Plans</span>
            </button>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
