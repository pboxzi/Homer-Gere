import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectCastCrewProps {
  project: ProjectDetail;
}

export const ProjectCastCrew: React.FC<ProjectCastCrewProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [expandedBio, setExpandedBio] = useState<string | null>(null);

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
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
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
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#111827] mb-3">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#A6852F] text-4xl font-editorial font-bold">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
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
                <h4 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">
                  {member.name}
                </h4>
                <p className="text-xs text-[#71717A] mt-0.5 line-clamp-2">{member.role.split('—')[0].trim()}</p>
              </motion.div>
            ))}
          </div>

          {/* Expanded Cast Details */}
          <div className="mt-12 space-y-4">
            {project.cast.filter(m => m.bio).map((member, idx) => (
              <motion.div
                key={member.name}
                className="bg-[#F3F1ED] rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
              >
                <button
                  onClick={() => setExpandedBio(expandedBio === member.name ? null : member.name)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-[#E8E5DF]/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] font-editorial text-lg shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#1C1917]">{member.name}</h4>
                      <p className="text-xs text-[#71717A] mt-0.5">{member.role.split('—')[0].trim()}</p>
                    </div>
                  </div>
                  {expandedBio === member.name ? (
                    <ChevronUp className="w-4 h-4 text-[#71717A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#71717A]" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedBio === member.name && member.bio && (
                    <motion.div
                      className="px-5 pb-5"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-[#44403C] leading-relaxed pl-14">{member.bio}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Crew
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-12">
              Key Crew
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.crew.map((member, idx) => (
                <motion.div
                  key={member.name}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#F3F1ED] hover:bg-white transition-colors duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] font-editorial text-lg shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">
                        {member.name}
                      </h4>
                      {member.profileUrl && (
                        <a
                          href={member.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#71717A] hover:text-[#A6852F] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5">{member.role}</p>
                    {member.bio && (
                      <p className="text-xs text-[#52525B] mt-2 leading-relaxed line-clamp-2">{member.bio}</p>
                    )}
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
