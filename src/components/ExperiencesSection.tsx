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
      case 'users':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'user-check':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'pen-tool':
        return <PenTool className="w-5 h-5 text-blue-600" />;
      case 'star':
        return <Star className="w-5 h-5 text-blue-600" />;
      case 'grid':
        return <Grid className="w-5 h-5 text-blue-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="experiences" className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-1">
              Connect & Collaborate
            </h2>
          </div>

          <button
            onClick={onViewAllExperiences}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group focus:outline-none cursor-pointer"
          >
            View All Experiences
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperience(exp)}
              className="bg-white p-5 rounded-2xl transition-all duration-300 hover:shadow-md flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {getExperienceIcon(exp.iconName)}
                </div>

                <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {exp.title}
                </h3>

                <p className="mt-1 text-[11px] text-gray-500 leading-relaxed line-clamp-3">
                  {exp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">
                  {exp.price}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
