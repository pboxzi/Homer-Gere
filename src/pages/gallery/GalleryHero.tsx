import React from 'react';
import { motion } from 'motion/react';
import { SECTION_IMAGES } from '../../data/images';

interface GalleryHeroProps {}

export const GalleryHero: React.FC<GalleryHeroProps> = () => {
  return (
    <section className="pt-24 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] overflow-hidden bg-[#F3F1ED] min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] w-full flex flex-col justify-between group transition-all duration-300">
          {/* Right Side — Image */}
          <div className="relative lg:absolute top-0 right-0 w-full lg:w-[55%] h-[200px] sm:h-[280px] lg:h-full shrink-0">
            <motion.img
              src={SECTION_IMAGES.media.hero}
              alt="Homer Gere — Editorial Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top lg:object-center transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
              loading="lazy"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent lg:hidden pointer-events-none" />
          </div>
          {/* Left Side — Content */}
          <div className="relative z-10 p-4 sm:p-10 md:p-14 lg:p-16 lg:pb-12 w-full lg:w-[48%] flex flex-col items-start justify-between h-full space-y-4 lg:space-y-0">
            <div className="flex flex-col items-start gap-3 sm:gap-6 max-w-xl">
              <motion.span
                className="text-[11px] sm:text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Official Visual Archive
              </motion.span>

              <motion.h1
                className="text-xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-tight"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                Gallery
              </motion.h1>

              <motion.p
                className="text-[11px] sm:text-base text-[#57534E] font-normal leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                A curated collection of official photography spanning premieres,
                editorial shoots, behind-the-scenes moments, and the milestones that
                define Homer Gere's career.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-2 sm:gap-4 mt-0 sm:mt-1 text-[11px] sm:text-sm text-[#57534E]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>16 Photos</span>
                <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
                <span>8 Categories</span>
                <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
                <span>Updated August 2026</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
