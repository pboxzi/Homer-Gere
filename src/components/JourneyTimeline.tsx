import React, { useState } from 'react';
import { ArrowRight, User, Users, GraduationCap, Film, Award, Star, Heart, Sparkles } from 'lucide-react';
import { TIMELINE_MILESTONES } from '../data/content';
import { TimelineMilestone } from '../types';

interface JourneyTimelineProps {
  onSelectMilestone: (milestone: TimelineMilestone) => void;
  onViewFullTimeline: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  onSelectMilestone,
  onViewFullTimeline,
}) => {
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
    <section id="journey" className="py-24 sm:py-32 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
              The Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] mt-3 tracking-tight leading-[1.1]">
              Every step shapes the story.
            </h2>
          </div>

          <button
            onClick={onViewFullTimeline}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#C8A96A] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer"
          >
            View Full Timeline
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline */}
        <div className="relative py-4">
          {/* Connecting Line */}
          <div className="absolute top-6 left-4 right-4 h-[1px] bg-[#E4DFD5] z-0 hidden md:block" />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
            {TIMELINE_MILESTONES.map((item) => {
              const isSelected = item.id === activeId;
              const isToday = item.id === 'today';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveId(item.id);
                    onSelectMilestone(item);
                  }}
                  className={`flex flex-col items-center text-center group p-3 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer ${
                    isSelected ? 'bg-[#C8A96A]/8' : 'hover:bg-[#EDE9E0]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isToday || isSelected
                        ? 'bg-[#C8A96A] text-white shadow-lg shadow-[#C8A96A]/20'
                        : 'bg-[#EDE9E0] text-[#78716C] group-hover:bg-[#C8A96A]/15 group-hover:text-[#C8A96A]'
                    }`}
                  >
                    {getMilestoneIcon(item.iconName)}
                  </div>

                  <span
                    className={`mt-3 text-xs sm:text-sm font-semibold transition-colors duration-300 leading-tight ${
                      isSelected ? 'text-[#C8A96A]' : 'text-[#57534E] group-hover:text-[#111827]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#8A8580] font-medium mt-0.5">
                    {item.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Milestone Spotlight */}
        <div className="mt-10 pt-8 bg-[#EDE9E0]/60 rounded-[1.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-500">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                {activeMilestone.year}
              </span>
              <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#111827]">
                {activeMilestone.title}
              </h3>
              {activeMilestone.highlight && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {activeMilestone.highlight}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">
              {activeMilestone.details}
            </p>
          </div>

          <button
            onClick={() => onSelectMilestone(activeMilestone)}
            className="text-xs font-semibold text-[#C8A96A] hover:text-[#B89A5A] transition-colors duration-300 shrink-0 focus:outline-none cursor-pointer"
          >
            Explore Milestone &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
