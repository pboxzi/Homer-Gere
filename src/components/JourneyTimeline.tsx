import React, { useState } from 'react';
import { ArrowRight, User, Users, GraduationCap, Film, Award, Star, Heart, Sparkles } from 'lucide-react';
import { TIMELINE_MILESTONES } from '../data/content';
import { TimelineMilestone } from '../types';

interface JourneyTimelineProps {
  onSelectMilestone: (milestone: TimelineMilestone) => void;
  onViewFullTimeline: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ onSelectMilestone, onViewFullTimeline }) => {
  const [activeId, setActiveId] = useState<string>('today');

  const getMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'user': return <User className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'graduation-cap': return <GraduationCap className="w-5 h-5" />;
      case 'clapperboard': return <Film className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const activeMilestone = TIMELINE_MILESTONES.find((m) => m.id === activeId) || TIMELINE_MILESTONES[5];

  return (
    <section id="journey" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">The Journey</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight leading-[1.1] hover-underline">Every step shapes the story.</h2>
          </div>
          <button onClick={onViewFullTimeline} className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#C9A84C] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer group">
            View Full Timeline<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <div className="relative py-4">
          <div className="absolute top-8 left-4 right-4 h-[1px] bg-[#E8E5DF] z-0 hidden md:block" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
            {TIMELINE_MILESTONES.map((item) => {
              const isSelected = item.id === activeId;
              const isToday = item.id === 'today';
              return (
                <button key={item.id} onClick={() => { setActiveId(item.id); onSelectMilestone(item); }} className={`flex flex-col items-center text-center group p-4 transition-all duration-300 focus:outline-none cursor-pointer rounded-2xl ${isSelected ? 'bg-[#C9A84C]/8' : 'hover:bg-[#F3F1ED]/60'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isToday || isSelected ? 'bg-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/25' : 'bg-[#F3F1ED] text-[#57534E] group-hover:bg-[#C9A84C]/15 group-hover:text-[#C9A84C]'}`}>
                    {getMilestoneIcon(item.iconName)}
                  </div>
                  <span className={`mt-3 text-xs sm:text-sm font-medium transition-colors duration-300 leading-tight ${isSelected ? 'text-[#C9A84C]' : 'text-[#44403C] group-hover:text-[#44403C]'}`}>{item.title}</span>
                  <span className="text-[11px] text-[#78716C] font-medium mt-0.5">{item.year}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-10 pt-8 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-500 rounded-2xl bg-[#F3F1ED]/40">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-medium text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full uppercase tracking-wider">{activeMilestone.year}</span>
              <h3 className="text-lg sm:text-xl font-editorial text-[#1C1917]">{activeMilestone.title}</h3>
              {activeMilestone.highlight && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />{activeMilestone.highlight}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">{activeMilestone.details}</p>
          </div>
          <button onClick={() => onSelectMilestone(activeMilestone)} className="text-xs font-medium text-[#C9A84C] hover:text-[#B8983A] transition-colors duration-300 shrink-0 focus:outline-none cursor-pointer group">
            Explore Milestone <ArrowRight className="w-3.5 h-3.5 inline group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
