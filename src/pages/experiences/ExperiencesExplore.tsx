import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Crown, MessageSquare } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

interface ExperiencesExploreProps {
  onExploreMembership: () => void;
  onOpenChat: () => void;
}

export const ExperiencesExplore: React.FC<ExperiencesExploreProps> = ({
  onExploreMembership,
  onOpenChat,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="experiences-explore" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Continue Exploring
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Keep discovering.
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Membership */}
          <motion.button
            onClick={onExploreMembership}
            className="group relative rounded-[1.5rem] overflow-hidden text-left bg-[#F3F1ED] hover:shadow-2xl hover:shadow-[#C9A84C]/8 transition-all duration-500 hover:-translate-y-1 focus:outline-none cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[#E8E5DF]">
              <img
                src={SECTION_IMAGES.exploreMore.projects}
                alt="Membership"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-[#111827]/10 to-transparent" />
              <div className="absolute bottom-5 left-5 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="text-lg sm:text-xl font-editorial text-[#111827] group-hover:text-[#C9A84C] transition-colors duration-300 mb-2">
                Membership
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed mb-5">
                Join the inner circle for priority access, exclusive content, and VIP benefits.
              </p>
              <div className="flex items-center text-xs font-medium text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300">
                <span>Explore Membership</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </motion.button>

          {/* Chat with Homer */}
          <motion.button
            onClick={onOpenChat}
            className="group relative rounded-[1.5rem] overflow-hidden text-left bg-[#F3F1ED] hover:shadow-2xl hover:shadow-[#C9A84C]/8 transition-all duration-500 hover:-translate-y-1 focus:outline-none cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[#E8E5DF]">
              <img
                src={SECTION_IMAGES.exploreMore.contact}
                alt="Chat with Homer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-[#111827]/10 to-transparent" />
              <div className="absolute bottom-5 left-5 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="text-lg sm:text-xl font-editorial text-[#111827] group-hover:text-[#C9A84C] transition-colors duration-300 mb-2">
                Chat with Homer
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed mb-5">
                Connect directly for fan messages or business inquiries.
              </p>
              <div className="flex items-center text-xs font-medium text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300">
                <span>Start a Conversation</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
