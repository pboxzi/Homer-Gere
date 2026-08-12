import React, { useState } from 'react';
import { ArrowRight, User, Users, GraduationCap, Film, Award, Star, Heart } from 'lucide-react';
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
      case 'user':
        return <User className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'graduation-cap':
        return <GraduationCap className="w-5 h-5" />;
      case 'clapperboard':
        return <Film className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      case 'star':
        return <Star className="w-5 h-5" />;
      case 'heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const activeMilestone = TIMELINE_MILESTONES.find((m) => m.id === activeId) || TIMELINE_MILESTONES[5];

  return (
    <section id="journey" className="py-16 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase font-outfit">
              The Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-extrabold text-gray-900 mt-2 tracking-tight">
              Every step shapes the story.
            </h2>
          </div>

          <button
            onClick={onViewFullTimeline}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 bg-white px-5 py-2.5 rounded-full transition-all self-start md:self-auto focus:outline-none cursor-pointer"
          >
            View Full Timeline
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* Timeline Node Container */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl mb-8">
          
          {/* Timeline Nodes Row */}
          <div className="relative py-4">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2 z-0 hidden md:block" />

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
                    className={`flex flex-col items-center text-center group p-3 rounded-xl transition-all focus:outline-none cursor-pointer ${
                      isSelected ? 'bg-blue-50/80 scale-105' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Node Icon Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isToday || isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}
                    >
                      {getMilestoneIcon(item.iconName)}
                    </div>

                    {/* Label & Year */}
                    <span
                      className={`mt-3 text-xs sm:text-sm font-semibold transition-colors ${
                        isSelected ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {item.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Spotlight Panel */}
          <div className="mt-8 pt-6 bg-blue-50/40 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                  {activeMilestone.year}
                </span>
                <h3 className="text-lg font-bold font-serif text-gray-900">
                  {activeMilestone.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">
                {activeMilestone.details}
              </p>
            </div>

            <button
              onClick={() => onSelectMilestone(activeMilestone)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-full transition-all shrink-0 focus:outline-none cursor-pointer"
            >
              Explore Milestone Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
