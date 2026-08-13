import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ProjectDetail, getProjectBySlug } from '../../data/projectDetails';

interface ProjectRelatedProps {
  project: ProjectDetail;
  onNavigate: (slug: string) => void;
}

export const ProjectRelated: React.FC<ProjectRelatedProps> = ({ project, onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const relatedProjects = project.relatedSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter(Boolean) as ProjectDetail[];

  if (relatedProjects.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Related Projects
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            More from Homer
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProjects.map((related, idx) => (
            <motion.button
              key={related.slug}
              onClick={() => onNavigate(related.slug)}
              className="group relative rounded-[1.5rem] overflow-hidden bg-[#111827] text-left aspect-[3/4] cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.12 }}
            >
              {/* Image */}
              <img
                src={related.heroImage}
                alt={related.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-[#C9A84C]/20 rounded-full text-[#C9A84C] text-[10px] font-medium uppercase tracking-wider">
                    {related.type}
                  </span>
                  <span className="text-white/50 text-xs">{related.year}</span>
                </div>
                <h3 className="text-2xl font-editorial text-white group-hover:text-[#C9A84C] transition-colors duration-300 mb-2">
                  {related.title}
                </h3>
                <p className="text-sm text-white/60 line-clamp-2 mb-4">{related.homerRole.character}</p>
                <div className="flex items-center text-xs font-medium text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
