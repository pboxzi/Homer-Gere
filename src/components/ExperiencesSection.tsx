import React from 'react';
import { ArrowRight, Users, Video, UserCheck, PenTool, Star, Grid } from 'lucide-react';
import { EXPERIENCES } from '../data/content';
import { Experience } from '../types';

interface ExperiencesSectionProps {
  onSelectExperience: (experience: Experience) => void;
  onViewAllExperiences: () => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  onSelectExperience,
  onViewAllExperiences,
}) => {
  const getExperienceIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="w-5 h-5 text-[#C9A84C]" />;
      case 'video': return <Video className="w-5 h-5 text-[#C9A84C]" />;
      case 'user-check': return <UserCheck className="w-5 h-5 text-[#C9A84C]" />;
      case 'pen-tool': return <PenTool className="w-5 h-5 text-[#C9A84C]" />;
      case 'star': return <Star className="w-5 h-5 text-[#C9A84C]" />;
      case 'grid': return <Grid className="w-5 h-5 text-[#C9A84C]" />;
      default: return <Star className="w-5 h-5 text-[#C9A84C]" />;
    }
  };

  return (
    <section id="experiences" className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight">
              Connect & Collaborate
            </h2>
          </div>

          <button
            onClick={onViewAllExperiences}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#C9A84C] transition-colors duration-300 group focus:outline-none cursor-pointer"
          >
            View All Experiences
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperience(exp)}
              className="bg-[#F3F1ED]/60 hover:bg-white p-6 rounded-[1.25rem] transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5 flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:bg-[#C9A84C] group-hover:text-white transition-all duration-500">
                  {getExperienceIcon(exp.iconName)}
                </div>

                <h3 className="text-sm font-editorial text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300">
                  {exp.title}
                </h3>

                <p className="mt-1.5 text-[11px] text-[#44403C] leading-relaxed line-clamp-3">
                  {exp.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8E5DF] flex items-center justify-between">
                <span className="text-xs font-medium text-[#C9A84C]">
                  {exp.price}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
