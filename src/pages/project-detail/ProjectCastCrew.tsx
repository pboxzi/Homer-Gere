import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectCastCrewProps {
  project: ProjectDetail;
}

export const ProjectCastCrew: React.FC<ProjectCastCrewProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cast */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Cast
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-12">
            Principal Cast
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {project.cast.map((member, idx) => (
              <motion.div
                key={member.name}
                className="group text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.08 }}
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#E8E5DF] mb-3">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-3xl font-editorial">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {member.profileUrl && (
                    <a
                      href={member.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <h4 className="text-sm font-medium text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300">
                  {member.name}
                </h4>
                <p className="text-xs text-[#71717A] mt-0.5 line-clamp-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Crew */}
        {project.crew.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Crew
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-12">
              Key Crew
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.crew.map((member, idx) => (
                <motion.div
                  key={member.name}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#F3F1ED] hover:bg-white transition-colors duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-editorial text-lg shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 truncate">
                        {member.name}
                      </h4>
                      {member.profileUrl && (
                        <a
                          href={member.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#71717A] hover:text-[#C9A84C] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5 truncate">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
