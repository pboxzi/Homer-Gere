import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Globe, Clock, MapPin, Building2, Calendar, Film } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectOverviewProps {
  project: ProjectDetail;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Synopsis */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-8">
              About the {project.type === 'Film' ? 'Film' : 'Series'}
            </h2>
            <p className="text-[#44403C] text-base sm:text-lg leading-[1.8] whitespace-pre-line">
              {project.synopsis}
            </p>
          </motion.div>

          {/* Details Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-[#F3F1ED] rounded-[1.5rem] p-8 space-y-6">
              <h3 className="text-lg font-editorial text-[#1C1917]">Details</h3>
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="text-[#C9A84C] mt-0.5">{detail.icon}</div>
                  <div>
                    <p className="text-[11px] font-medium tracking-wider text-[#71717A] uppercase">{detail.label}</p>
                    <p className="text-sm text-[#1C1917] mt-0.5">{detail.value}</p>
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
