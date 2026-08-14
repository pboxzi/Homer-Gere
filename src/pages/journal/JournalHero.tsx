import React from 'react';
import { motion } from 'motion/react';

import { SECTION_IMAGES } from '../../data/images';

interface JournalHeroProps {}

export const JournalHero: React.FC<JournalHeroProps> = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] bg-[#FAF9F7] overflow-hidden pt-20">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img 
          src={SECTION_IMAGES.hero.homepage}
          alt="Homer Gere — Editorial Portrait"
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
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Official Publication
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-[#1C1917] tracking-tight leading-[1.02]"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Journal
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-[#1C1917] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            The official source for verified news, project updates, interviews,
            and stories from Homer Gere's career. Every article is reviewed and
            approved before publication.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-6 text-sm text-[#57534E] pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>8 Articles</span>
            <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
            <span>8 Categories</span>
            <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
            <span>Updated August 2026</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
