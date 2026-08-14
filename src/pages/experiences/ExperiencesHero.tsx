import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Star, Calendar, Users } from 'lucide-react';
import { EXPERIENCE_IMAGES } from '../../data/images';

interface ExperiencesHeroProps {
  onRequestExperience: () => void;
}

export const ExperiencesHero: React.FC<ExperiencesHeroProps> = ({ onRequestExperience }) => {
  return (
    <section className="relative h-[85vh] min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] bg-[#FAF9F7] overflow-hidden pt-20">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img 
          src={EXPERIENCE_IMAGES['brand-collaboration']}
          alt="Homer Gere — Official Experiences"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/30 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7]/15 via-transparent to-[#FAF9F7]" />
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
              Official Experiences
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight leading-[1.02]"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Experiences
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-[#1C1917] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Official experiences with Homer Gere can be requested through his management team.
            Every request is reviewed personally — availability is not guaranteed.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onRequestExperience}
              className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Request an Experience</span>
            </button>

            <div className="inline-flex items-center gap-2 text-sm text-[#57534E]">
              <Shield className="w-4 h-4 text-[#A6852F]" />
              <span>Verified by management</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#A6852F]" />
              <span className="text-sm text-[#57534E]">8 Experience Types</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A6852F]" />
              <span className="text-sm text-[#57534E]">5–10 Day Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A6852F]" />
              <span className="text-sm text-[#57534E]">Global Availability</span>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
