import React from 'react';
import { ArrowRight, Users, Calendar, Heart, Mic, Briefcase, Sparkles, Video, Play } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ExperiencesSectionProps {
  onNavigate: (sectionId: string) => void;
  onRequestExperience?: () => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onNavigate, onRequestExperience }) => {
  const { experiences } = useSiteContent();

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

  const handleExperienceClick = () => {
    if (onRequestExperience) {
      onRequestExperience();
    } else {
      onNavigate('experiences');
    }
  };

  const handleRequestExperience = () => {
    if (onRequestExperience) {
      onRequestExperience();
    } else {
      onNavigate('experiences');
    }
  };

  return (
    <section id="experiences" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-14">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">Experiences</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">Connect & Collaborate</h2>
          </div>
          <button onClick={handleExperienceClick} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 group focus:outline-none cursor-pointer">
            View All Experiences<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Cards grid — same style as journal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.slice(0, 4).map((exp) => (
            <article key={exp.id} onClick={handleExperienceClick} className="group p-5 rounded-2xl border border-[#E8E5DF]/60 transition-all duration-500 flex flex-col justify-between cursor-pointer hover:border-[#A6852F]/30 hover:shadow-lg hover:shadow-[#A6852F]/5">
              <div>
                {exp.image && (
                  <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                    <img src={exp.image} alt={exp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-[#FAF9F7]/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-medium tracking-wider text-[#A6852F] uppercase flex items-center gap-1.5">
                      {getExperienceIcon(exp.iconName)}
                      Experience
                    </div>
                  </div>
                )}
                <h3 className="text-base font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 line-clamp-2 leading-snug">{exp.title}</h3>
                <p className="mt-2 text-xs text-[#57534E] line-clamp-2 leading-relaxed">{exp.description}</p>
              </div>
              <div className="mt-5 pt-4 flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-medium text-[#A6852F]">{exp.price}</span>
                <span className="font-medium text-[#A6852F] group-hover:translate-x-0.5 transition-transform duration-300">Learn More &rarr;</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button onClick={handleRequestExperience} className="inline-flex items-center gap-2.5 bg-[#A6852F] hover:bg-[#8B7226] text-white font-medium text-sm px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer">
            Request an Experience<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
