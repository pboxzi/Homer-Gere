import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Users, Calendar, Heart, Mic, Briefcase, Sparkles, Video, Play } from 'lucide-react';
import { EXPERIENCES } from '../../data/content';
import { Experience } from '../../types';

interface FeaturedExperiencesProps {
  onSelectExperience: (experience: Experience) => void;
  onRequestExperience: () => void;
}

export const FeaturedExperiences: React.FC<FeaturedExperiencesProps> = ({
  onSelectExperience,
  onRequestExperience,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const getExperienceIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="w-5 h-5" />;
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'mic': return <Mic className="w-5 h-5" />;
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'play': return <Play className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />Available</span>;
      case 'limited':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />Limited</span>;
      case 'unavailable':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#DC2626] bg-[#DC2626]/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />Unavailable</span>;
      default:
        return null;
    }
  };

  return (
    <section id="experiences-grid" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Featured Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Available experiences.
          </h2>
          <p className="text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Each experience is managed and approved by Homer's official team.
            Submit a request to get started.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              className="group relative rounded-[1.5rem] overflow-hidden bg-white border border-[#E8E5DF]/60 hover:border-[#A6852F]/30 hover:shadow-xl hover:shadow-[#A6852F]/5 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelectExperience(exp)}
            >
              {/* Image */}
              {exp.image && (
                <div className="relative h-48 overflow-hidden bg-[#E8E5DF]">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/40 via-transparent to-transparent" />
                  {exp.availability && (
                    <div className="absolute top-4 right-4">
                      {getAvailabilityBadge(exp.availability)}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center mb-4 group-hover:bg-[#A6852F] group-hover:text-white text-[#A6852F] transition-all duration-500">
                  {getExperienceIcon(exp.iconName)}
                </div>

                <h3 className="text-base font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 mb-2">
                  {exp.title}
                </h3>

                <p className="text-sm text-[#57534E] leading-relaxed line-clamp-2 mb-5">
                  {exp.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E5DF]/60">
                  <span className="text-xs font-medium text-[#A6852F]">
                    {exp.price}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#57534E] group-hover:text-[#A6852F] transition-colors duration-300">
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <button
            onClick={onRequestExperience}
            className="inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer"
          >
            Request an Experience
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
