import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  GraduationCap,
  Film,
  Award,
  Star,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TIMELINE_MILESTONES } from '../../data/content';

export const JourneyTimeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('today');
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const activeMilestone =
    TIMELINE_MILESTONES.find((m) => m.id === activeId) || TIMELINE_MILESTONES[5];

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="journey-timeline"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#F5F2EB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
            The Journey So Far
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] tracking-tight">
            Every step shapes the story.
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Scroll Controls */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-medium text-[#8A8580] uppercase tracking-wider">
              Scroll to explore
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => scrollTimeline('left')}
                className="w-9 h-9 rounded-xl border border-[#E4DFD5] flex items-center justify-center text-[#78716C] hover:bg-[#C8A96A]/10 hover:text-[#C8A96A] hover:border-[#C8A96A]/30 transition-all duration-300 focus:outline-none cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                className="w-9 h-9 rounded-xl border border-[#E4DFD5] flex items-center justify-center text-[#78716C] hover:bg-[#C8A96A]/10 hover:text-[#C8A96A] hover:border-[#C8A96A]/30 transition-all duration-300 focus:outline-none cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Timeline */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar pb-4 -mx-2 px-2"
          >
            <div className="relative min-w-max">
              {/* Connecting Line */}
              <div className="absolute top-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E4DFD5] to-transparent z-0" />

              {/* Timeline Nodes */}
              <div className="flex items-start gap-0 relative z-10">
                {TIMELINE_MILESTONES.map((item, idx) => {
                  const isSelected = item.id === activeId;
                  const isToday = item.id === 'today';

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className="flex flex-col items-center text-center group focus:outline-none cursor-pointer shrink-0"
                      style={{ width: '140px' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isToday || isSelected
                            ? 'bg-[#C8A96A] text-white shadow-lg shadow-[#C8A96A]/25 scale-110'
                            : 'bg-[#EDE9E0] text-[#78716C] group-hover:bg-[#C8A96A]/15 group-hover:text-[#C8A96A]'
                        }`}
                      >
                        {getMilestoneIcon(item.iconName)}
                        {isSelected && (
                          <span className="absolute inset-0 rounded-full bg-[#C8A96A]/25 animate-ping" />
                        )}
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
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Milestone Expanded Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              className="mt-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-[#EDE9E0]/60 rounded-[1.5rem] p-6 sm:p-8 border border-[#E4DFD5]/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        {activeMilestone.year}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#111827]">
                        {activeMilestone.title}
                      </h3>
                      {activeMilestone.highlight && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#C8A96A]/20">
                          <Sparkles className="w-3 h-3" />
                          {activeMilestone.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">
                      {activeMilestone.details}
                    </p>
                  </div>

                  <div className="shrink-0 hidden sm:block">
                    <div className="w-14 h-14 rounded-2xl bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]">
                      {getMilestoneIcon(activeMilestone.iconName)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
