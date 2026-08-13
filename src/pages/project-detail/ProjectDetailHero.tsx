import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectDetailHeroProps {
  project: ProjectDetail;
  onBack: () => void;
}

export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ project, onBack }) => {
  return (
    <section className="relative h-[80vh] min-h-[640px] bg-[#111827] overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={project.heroImage}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-[#111827]/50" />
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
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-3xl">
          <motion.div
            className="flex flex-wrap items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="px-3 py-1 bg-[#C9A84C]/20 backdrop-blur-sm rounded-full text-[#C9A84C] text-[11px] font-medium tracking-widest uppercase">
              {project.type}
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-[11px] font-medium tracking-widest uppercase">
              {project.status}
            </span>
            <span className="text-white/60 text-sm">{project.year}</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-white tracking-tight leading-[1.02] mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {project.title}
          </motion.h1>

          {project.tagline && (
            <motion.p
              className="text-lg sm:text-xl text-[#C9A84C] font-editorial italic mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              "{project.tagline}"
            </motion.p>
          )}

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {project.trailerUrl && (
              <a
                href={project.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Watch Trailer</span>
              </a>
            )}
            {project.officialUrl && (
              <a
                href={project.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Official Website</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
