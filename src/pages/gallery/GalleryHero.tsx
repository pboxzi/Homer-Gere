import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

interface GalleryHeroProps {
  onBack: () => void;
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({ onBack }) => {
  return (
    <section className="relative h-[85vh] min-h-[600px] bg-[#111827] overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={SECTION_IMAGES.hero.journey}
          alt="Homer Gere — Editorial Portrait"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-[#111827]/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-3xl">
          <motion.span
            className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Official Visual Archive
          </motion.span>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-editorial text-white tracking-tight leading-[1.02] mt-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            Gallery
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            A curated collection of official photography spanning premieres,
            editorial shoots, behind-the-scenes moments, and the milestones that
            define Homer Gere's career.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 text-sm text-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <span>16 Photos</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>8 Categories</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Updated August 2026</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
