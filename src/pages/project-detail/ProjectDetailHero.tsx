import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Play, Calendar, Clock, Tv } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectDetailHeroProps {
  project: ProjectDetail;
  onBack: () => void;
}

export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ project, onBack }) => {
  return (
    <section className="relative h-[90vh] min-h-[700px] bg-[#111827] overflow-hidden">
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
          className="w-full h-full object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-[#111827]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-[#111827]/60" />
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
            <span>Back to Projects</span>
          </button>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-3xl">
          {/* Type & Status Badges */}
          <motion.div
            className="flex flex-wrap items-center gap-3 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="px-3.5 py-1 bg-[#A6852F]/20 backdrop-blur-sm rounded-full text-[#A6852F] text-[11px] font-medium tracking-widest uppercase border border-[#A6852F]/20">
              {project.type}
            </span>
            <span className="px-3.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-[11px] font-medium tracking-widest uppercase border border-white/10">
              {project.status}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-editorial text-white tracking-tight leading-[1.02] mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {project.title}
          </motion.h1>

          {/* Tagline */}
          {project.tagline && (
            <motion.p
              className="text-lg sm:text-xl text-[#A6852F] font-editorial italic mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              "{project.tagline}"
            </motion.p>
          )}

          {/* Quick Info Row */}
          <motion.div
            className="flex flex-wrap items-center gap-5 text-sm text-white/60 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {project.releaseDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#A6852F]" />
                {project.releaseDate}
              </span>
            )}
            {project.runtime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#A6852F]" />
                {project.runtime}
              </span>
            )}
            {project.genre && (
              <span className="inline-flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-[#A6852F]" />
                {project.genre.split('/')[0].trim()}
              </span>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {project.synopsis.length > 200 ? project.synopsis.slice(0, 200) + '...' : project.synopsis}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            {project.trailerUrl && (
              <a
                href={project.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 cursor-pointer"
              >
                <Play className="w-4 h-4" fill="white" />
                <span>Watch Trailer</span>
              </a>
            )}
            {project.officialUrl && (
              <a
                href={project.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer border border-white/10"
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
