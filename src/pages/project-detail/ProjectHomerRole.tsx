import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { User, Film, FileText } from 'lucide-react';
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
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Homer's Role
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            {project.homerRole.character}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="rounded-[2rem] overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={project.heroImage}
              alt={`${project.homerRole.character} — ${project.title}`}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] object-cover object-top"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">Character</h3>
                  <p className="text-lg text-[#1C1917] font-editorial mt-1">{project.homerRole.character}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">Description</h3>
                  <p className="text-[#44403C] leading-relaxed mt-1">{project.homerRole.description}</p>
                </div>
              </div>

              {project.homerRole.episodes && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider">Episodes</h3>
                    <p className="text-[#1C1917] mt-1">{project.homerRole.episodes}</p>
                  </div>
                </div>
              )}

              {project.homerRole.notes && (
                <div className="bg-[#FAF9F7] rounded-2xl p-6 border border-[#E8E5DF]">
                  <h3 className="text-sm font-medium text-[#C9A84C] uppercase tracking-wider mb-2">Production Notes</h3>
                  <p className="text-sm text-[#44403C] leading-relaxed">{project.homerRole.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
