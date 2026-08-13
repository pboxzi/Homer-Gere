import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { IMAGES } from '../../data/images';

interface JourneyHeroProps {
  onExploreProjects: () => void;
  onViewJournal: () => void;
}

export const JourneyHero: React.FC<JourneyHeroProps> = ({ onExploreProjects, onViewJournal }) => {
  return (
    <section className="relative h-[75vh] min-h-[450px] sm:min-h-[550px] lg:min-h-[600px] bg-[#FAF9F7] overflow-hidden pt-20">
      {/* Right Side — Cinematic Portrait */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={IMAGES.homerBrightLuxuryEditorial}
          alt="Homer Gere - Editorial Portrait"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        {/* Warm fade into left space */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/15 to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7]/10 via-transparent to-[#FAF9F7]" />
      </motion.div>

      {/* Left Side — Editorial Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              The Journey
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-[#1C1917] tracking-tight leading-[1.02]"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            The Journey
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-[#1C1917] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            From New York City to Brown University to the sets of Euphoria and The Shards — explore
            the life and career of Homer Gere.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onExploreProjects}
              className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Explore Projects</span>
            </button>

            <button
              onClick={onViewJournal}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F3F1ED] active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#A6852F]" />
              <span>Latest Journal</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <a
          href="#journey-intro"
          className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
          aria-label="Scroll to continue"
        >
          <span className="text-[11px] font-medium text-[#57534E] group-hover:text-[#A6852F] transition-colors uppercase tracking-[0.25em]">
            Scroll
          </span>
          <div className="relative w-[1px] h-8 bg-[#E8E5DF] group-hover:bg-[#A6852F]/30 transition-colors overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#A6852F] rounded-full animate-scroll-line" />
          </div>
        </a>
      </motion.div>
    </section>
  );
};
