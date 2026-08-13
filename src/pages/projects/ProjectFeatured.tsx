import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Film, Calendar, Users } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

interface ProjectFeaturedProps {
  onViewProject: (projectId: string) => void;
}

export const ProjectFeatured: React.FC<ProjectFeaturedProps> = ({ onViewProject }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="featured-project" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-[2rem] overflow-hidden bg-[#111827] text-white min-h-[520px] lg:min-h-[580px]"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={SECTION_IMAGES.hero.projects}
              alt="The Shards"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top scale-105 hover:scale-100 transition-transform duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-between max-w-2xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A6852F]/15 border border-[#A6852F]/25 text-[#A6852F] text-[11px] font-medium tracking-widest uppercase">
                <Film className="w-3.5 h-3.5" />
                Featured Project
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-white tracking-tight leading-[1.05]">
                The Shards
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg">
                A Ryan Murphy and Bret Easton Ellis adaptation of the bestselling novel on FX and Hulu —
                Homer's first lead role, alongside Igby Rigney, Kaia Gerber, and an ensemble cast.
                Premiered August 5, 2026.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl text-xs font-medium text-gray-200">
                  <Calendar className="w-3 h-3" />
                  Premiered August 5, 2026
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl text-xs font-medium text-gray-200">
                  <Users className="w-3 h-3" />
                  Robert Mallory (Lead)
                </span>
                <span className="text-sm text-gray-400">
                  Creator: <strong className="text-[#A6852F] font-medium">Ryan Murphy</strong>
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onViewProject('the-shards')}
                className="inline-flex items-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:shadow-[#A6852F]/25 group focus:outline-none cursor-pointer"
              >
                View Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
