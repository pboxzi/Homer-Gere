import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Globe, Clock, MapPin, Building2, Calendar, Film, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectOverviewProps {
  project: ProjectDetail;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [showExpanded, setShowExpanded] = useState(false);

  const details = [
    { icon: <Film className="w-4 h-4" />, label: 'Genre', value: project.genre },
    { icon: <Clock className="w-4 h-4" />, label: 'Runtime', value: project.runtime },
    { icon: <Globe className="w-4 h-4" />, label: 'Language', value: project.language },
    { icon: <MapPin className="w-4 h-4" />, label: 'Country', value: project.country },
    { icon: <Building2 className="w-4 h-4" />, label: 'Production', value: project.productionCompany },
    { icon: <Building2 className="w-4 h-4" />, label: 'Distributor', value: project.distributor },
    { icon: <Calendar className="w-4 h-4" />, label: 'Release Date', value: project.releaseDate },
  ].filter((d) => d.value);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
          {/* Synopsis */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-8">
              About the {project.type === 'Film' ? 'Film' : project.type === 'Short Film' ? 'Short Film' : 'Series'}
            </h2>

            {/* Main Synopsis */}
            <div className="prose prose-lg max-w-none">
              <p className="text-[#44403C] text-base sm:text-lg leading-[1.9] whitespace-pre-line">
                {project.synopsis}
              </p>
            </div>

            {/* Expanded Synopsis */}
            {project.expandedSynopsis && (
              <AnimatePresence mode="wait">
                {showExpanded && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="prose prose-lg max-w-none">
                      {project.expandedSynopsis.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-[#44403C] text-base sm:text-lg leading-[1.9] mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Show More/Less Button */}
            {project.expandedSynopsis && (
              <motion.button
                onClick={() => setShowExpanded(!showExpanded)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#A6852F] hover:text-[#B8983A] transition-colors duration-300 cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                {showExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    <span>Read Full Synopsis</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Details Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-[#F3F1ED] rounded-[1.5rem] p-5 sm:p-8 space-y-6 sticky top-24">
              <h3 className="text-lg font-editorial text-[#1C1917]">Details</h3>
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="text-[#A6852F] mt-0.5 shrink-0">{detail.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium tracking-wider text-[#71717A] uppercase">{detail.label}</p>
                    <p className="text-sm text-[#1C1917] mt-0.5 leading-relaxed">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
