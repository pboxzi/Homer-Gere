import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { IMAGES } from '../../data/images';

interface JourneyNextProps {
  onExploreProjects: () => void;
  onOpenChat: () => void;
}

export const JourneyNext: React.FC<JourneyNextProps> = ({ onExploreProjects, onOpenChat }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-next" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-[2rem] overflow-hidden bg-[#111827] text-white min-h-[300px] sm:min-h-[480px] flex items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={IMAGES.heroComposed}
              alt="Homer Gere"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top opacity-40 scale-105"
              loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-[#111827]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <motion.span
              className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase mb-5 block"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              The Story Continues
            </motion.span>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-white tracking-tight mb-6 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              The Story Continues
            </motion.h2>

            <motion.p
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Discover Homer's latest work, current projects, and future productions.
              The journey is just getting started.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={onExploreProjects}
                className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Explore Projects</span>
              </button>

              <button
                onClick={onOpenChat}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 active:scale-95 text-white font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer border border-white/15 hover:border-white/25"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Homer</span>
              </button>
            </motion.div>
          </div>

          {/* Decorative accent */}
          <div className="absolute bottom-8 right-8 hidden sm:flex items-center space-x-2 z-10">
            <span className="w-8 h-1.5 bg-[#A6852F] rounded-full" />
            <span className="w-2 h-1.5 bg-white/20 rounded-full" />
            <span className="w-2 h-1.5 bg-white/20 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
