import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Film } from 'lucide-react';
import { IMAGES } from '../../data/images';

interface ProjectHeroProps {
  onExploreFilms: () => void;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ onExploreFilms }) => {
  return (
    <section className="relative h-[70vh] min-h-[560px] bg-[#111827] overflow-hidden pt-14">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={IMAGES.shardsBanner}
          alt="Homer Gere — Projects"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Film & Television
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-white tracking-tight leading-[1.02]"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Projects
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            From HBO's Euphoria to Ryan Murphy's The Shards and Oliver Stone's White Lies —
            a look at Homer's verified acting credits and upcoming productions.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onExploreFilms}
              className="inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 focus:outline-none cursor-pointer"
            >
              <Film className="w-4 h-4" />
              <span>View Filmography</span>
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
          href="#featured-project"
          className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
          aria-label="Scroll to continue"
        >
          <span className="text-[10px] font-medium text-white/50 group-hover:text-[#C9A84C] transition-colors uppercase tracking-[0.25em]">
            Scroll
          </span>
          <div className="relative w-[1px] h-8 bg-white/20 group-hover:bg-[#C9A84C]/30 transition-colors overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#C9A84C] rounded-full animate-scroll-line" />
          </div>
        </a>
      </motion.div>
    </section>
  );
};
