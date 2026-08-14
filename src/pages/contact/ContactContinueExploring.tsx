import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

interface ContactContinueExploringProps {
  onExploreExperiences: () => void;
  onExploreMembership: () => void;
}

export const ContactContinueExploring: React.FC<ContactContinueExploringProps> = ({
  onExploreExperiences,
  onExploreMembership,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const options = [
    {
      title: 'Experiences',
      description: 'Book exclusive experiences and meet Homer in person.',
      icon: Sparkles,
      image: SECTION_IMAGES.exploreMore.projects,
      onClick: onExploreExperiences,
      delay: 0.1,
    },
    {
      title: 'Membership',
      description: 'Join the inner circle for priority access and VIP benefits.',
      icon: Crown,
      image: SECTION_IMAGES.exploreMore.gallery,
      onClick: onExploreMembership,
      delay: 0.2,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Continue Exploring
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Keep discovering.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {options.map((option) => (
            <motion.button
              key={option.title}
              onClick={option.onClick}
              className="group relative rounded-[1.5rem] overflow-hidden text-left bg-[#F3F1ED] hover:shadow-2xl hover:shadow-[#A6852F]/8 transition-all duration-500 hover:-translate-y-1 focus:outline-none cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: option.delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-48 overflow-hidden bg-[#E8E5DF]">
                <img 
                  src={option.image}
                  alt={option.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-[#111827]/10 to-transparent" />
                <div className="absolute bottom-4 left-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                  <option.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-editorial text-[#111827] group-hover:text-[#A6852F] transition-colors duration-300 mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-4">
                  {option.description}
                </p>
                <div className="flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
