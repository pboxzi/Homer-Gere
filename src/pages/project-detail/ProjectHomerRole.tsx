import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { User, Film, FileText, Quote, Star } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectHomerRoleProps {
  project: ProjectDetail;
}

export const ProjectHomerRole: React.FC<ProjectHomerRoleProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Homer's Role
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            {project.homerRole.character}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
          {/* Image */}
          <motion.div
            className="rounded-[2rem] overflow-hidden shadow-2xl shadow-[#111827]/10"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src={project.heroImage}
              alt={`${project.homerRole.character} — ${project.title}`}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] object-cover object-top"
              loading="lazy" />
          </motion.div>

          {/* Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Character */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">Character</h3>
                <p className="text-xl text-[#1C1917] font-editorial mt-1">{project.homerRole.character}</p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">About the Role</h3>
                <p className="text-[#44403C] leading-[1.8] mt-2">{project.homerRole.description}</p>
              </div>
            </div>

            {/* Expanded Description */}
            {project.homerRole.expandedDescription && (
              <div className="bg-[#FAF9F7] rounded-2xl p-4 sm:p-6 border border-[#E8E5DF]">
                <h3 className="text-sm font-medium text-[#A6852F] uppercase tracking-wider mb-3">Character Deep Dive</h3>
                <div className="space-y-4">
                  {project.homerRole.expandedDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-sm text-[#44403C] leading-[1.8]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Episodes */}
            {project.homerRole.episodes && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">Episodes</h3>
                  <p className="text-[#1C1917] mt-1">{project.homerRole.episodes}</p>
                </div>
              </div>
            )}

            {/* Production Notes */}
            {project.homerRole.notes && (
              <div className="bg-[#FAF9F7] rounded-2xl p-4 sm:p-6 border border-[#E8E5DF]">
                <h3 className="text-sm font-medium text-[#A6852F] uppercase tracking-wider mb-2">Production Notes</h3>
                <p className="text-sm text-[#44403C] leading-relaxed">{project.homerRole.notes}</p>
              </div>
            )}

            {/* Quotes */}
            {project.homerRole.quotes && project.homerRole.quotes.length > 0 && (
              <div className="space-y-4">
                {project.homerRole.quotes.map((quote, idx) => (
                  <div key={idx} className="relative bg-[#111827] rounded-2xl p-4 sm:p-6 text-white">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-[#A6852F]/20" />
                    <p className="text-sm leading-relaxed italic relative z-10">
                      "{quote}"
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-1 h-1 rounded-full bg-[#A6852F]" />
                      <span className="text-xs text-[#A6852F] font-medium">Homer Gere</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
