import React from 'react';
import { ArrowRight, Users, Calendar, Heart, Mic, Briefcase, Sparkles, Video, Play } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ExperiencesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onNavigate }) => {
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

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />Available</span>;
      case 'limited':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />Limited</span>;
      default:
        return null;
    }
  };

  return (
    <section id="experiences" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">Experiences</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">Connect & Collaborate</h2>
          </div>
          <button onClick={() => onNavigate('experiences')} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 group focus:outline-none cursor-pointer">
            View All Experiences<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Featured large card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {experiences.slice(0, 2).map((exp) => (
            <div key={exp.id} onClick={() => onNavigate('experiences')} className="group relative rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-[#A6852F]/10 hover:-translate-y-1">
              {exp.image && (
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#E8E5DF]">
                  <img src={exp.image} alt={exp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
                  {exp.availability && (
                    <div className="absolute top-4 right-4">{getAvailabilityBadge(exp.availability)}</div>
                  )}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 text-white">
                  {getExperienceIcon(exp.iconName)}
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial text-white mb-2">{exp.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed line-clamp-2 mb-4">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#D4B86A]">{exp.price}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white group-hover:translate-x-0.5 transition-transform duration-300">
                    Learn More<ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Smaller cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.slice(2, 6).map((exp) => (
            <div key={exp.id} onClick={() => onNavigate('experiences')} className="group relative rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-[#A6852F]/10 hover:-translate-y-1">
              {exp.image && (
                <div className="relative h-44 overflow-hidden bg-[#E8E5DF]">
                  <img src={exp.image} alt={exp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 via-transparent to-transparent" />
                  {exp.availability && (
                    <div className="absolute top-3 right-3">{getAvailabilityBadge(exp.availability)}</div>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center mb-3 group-hover:bg-[#A6852F] group-hover:text-white text-[#A6852F] transition-all duration-500">
                  {getExperienceIcon(exp.iconName)}
                </div>
                <h3 className="text-base font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 mb-1">{exp.title}</h3>
                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2 mb-4">{exp.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E5DF]/60">
                  <span className="text-xs font-medium text-[#A6852F]">{exp.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#A6852F] group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button onClick={() => onNavigate('experiences')} className="inline-flex items-center gap-2.5 bg-[#A6852F] hover:bg-[#8B7226] text-white font-medium text-sm px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer">
            Request an Experience<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
