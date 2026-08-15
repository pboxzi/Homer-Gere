import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, User, Users, GraduationCap, Film, Award, Star, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { TimelineMilestone } from '../types';
import { IMAGES, SECTION_IMAGES } from '../data/images';

interface JourneyTimelineProps {
  onSelectMilestone: (milestone: TimelineMilestone) => void;
  onViewFullTimeline: () => void;
}

const MILESTONE_IMAGES: Record<string, string> = {
  'birth': IMAGES.homerGqLifestyleStudio,
  'education': IMAGES.journalPortrait,
  'brown': SECTION_IMAGES.highlights.brownUniversity,
  'first-roles': IMAGES.journalOnset,
  'euphoria': SECTION_IMAGES.highlights.euphoriaDebut,
  'the-shards': SECTION_IMAGES.highlights.firstLeadRole,
  'white-lies': SECTION_IMAGES.highlights.whiteLies,
};

const FEATURED_IDS = ['euphoria', 'the-shards', 'white-lies'];

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ onSelectMilestone, onViewFullTimeline }) => {
  const [activeId, setActiveId] = useState<string>('today');
  const { timelineMilestones } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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

  const activeMilestone = timelineMilestones.find((m) => m.id === activeId) || timelineMilestones[5];
  const featuredMilestones = timelineMilestones.filter((m) => FEATURED_IDS.includes(m.id));

  return (
    <section id="journey" ref={sectionRef} className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">The Journey</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight leading-[1.1] hover-underline">Every step shapes the story.</h2>
          </div>
          <button onClick={onViewFullTimeline} className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer group">
            View Full Timeline<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Timeline Bar */}
        <motion.div
          className="relative py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Progress line */}
          <div className="absolute top-8 left-4 right-4 h-[1px] bg-[#E8E5DF] z-0 hidden md:block" />
          <motion.div
            className="absolute top-8 left-4 h-[1px] bg-[#A6852F] z-0 hidden md:block origin-left"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Milestone nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
            {timelineMilestones.map((item, idx) => {
              const isSelected = item.id === activeId;
              const isToday = item.id === 'today';
              const hasImage = MILESTONE_IMAGES[item.id];
              return (
                <motion.button
                  key={item.id}
                  onClick={() => { setActiveId(item.id); onSelectMilestone(item); }}
                  className={`flex flex-col items-center text-center group p-4 transition-all duration-300 focus:outline-none cursor-pointer rounded-2xl ${isSelected ? 'bg-[#A6852F]/8' : 'hover:bg-[#F3F1ED]/60'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${isToday || isSelected ? 'bg-[#A6852F] text-white shadow-lg shadow-[#A6852F]/25' : 'bg-[#F3F1ED] text-[#57534E] group-hover:bg-[#A6852F]/15 group-hover:text-[#A6852F]'}`}>
                    {hasImage && !isToday ? (
                      <img src={hasImage} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      getMilestoneIcon(item.iconName)
                    )}
                  </div>
                  <span className={`mt-3 text-xs sm:text-sm font-medium transition-colors duration-300 leading-tight ${isSelected ? 'text-[#A6852F]' : 'text-[#44403C] group-hover:text-[#44403C]'}`}>{item.title}</span>
                  <span className="text-[11px] text-[#78716C] font-medium mt-0.5">{item.year}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Active Milestone Detail */}
        <motion.div
          className="mt-10 pt-8 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 transition-all duration-500 rounded-2xl bg-[#F3F1ED]/40 overflow-hidden"
          key={activeMilestone.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {MILESTONE_IMAGES[activeMilestone.id] && (
            <div className="w-full sm:w-48 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 hidden sm:block">
              <img src={MILESTONE_IMAGES[activeMilestone.id]} alt={activeMilestone.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-medium text-[#A6852F] bg-[#A6852F]/10 px-3 py-1 rounded-full uppercase tracking-wider">{activeMilestone.year}</span>
              <h3 className="text-lg sm:text-xl font-editorial text-[#1C1917]">{activeMilestone.title}</h3>
              {activeMilestone.highlight && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#A6852F] bg-[#A6852F]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />{activeMilestone.highlight}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">{activeMilestone.details}</p>
          </div>
          <button onClick={() => onSelectMilestone(activeMilestone)} className="text-xs font-medium text-[#A6852F] hover:text-[#B8983A] transition-colors duration-300 shrink-0 focus:outline-none cursor-pointer group">
            Explore Milestone <ArrowRight className="w-3.5 h-3.5 inline group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Featured Milestones Showcase */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-editorial text-[#1C1917]">Key Milestones</h3>
            <div className="w-12 h-[1px] bg-[#A6852F]/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredMilestones.map((milestone, idx) => {
              const img = MILESTONE_IMAGES[milestone.id];
              return (
                <motion.button
                  key={milestone.id}
                  onClick={() => { setActiveId(milestone.id); onSelectMilestone(milestone); }}
                  className="group text-left rounded-2xl overflow-hidden bg-white border border-[#E8E5DF]/60 hover:border-[#A6852F]/30 hover:shadow-lg hover:shadow-[#A6852F]/5 transition-all duration-500 focus:outline-none cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {img && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={img} alt={milestone.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[10px] font-semibold text-[#A6852F] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">{milestone.year}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">{milestone.title}</h4>
                      {milestone.highlight && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-[#A6852F] bg-[#A6852F]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5" />{milestone.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">{milestone.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#A6852F] group-hover:gap-1.5 transition-all duration-300">
                      Learn more <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
