import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { BookOpen, Sparkles, TrendingUp, Briefcase, Heart } from 'lucide-react';

const VALUES = [
  {
    icon: BookOpen,
    title: 'Storytelling',
    description:
      'Every script is an invitation to explore the depths of human experience. Storytelling is the thread that connects every role, every performance, and every creative endeavor.',
  },
  {
    icon: Sparkles,
    title: 'Creativity',
    description:
      'Creativity means looking beyond the obvious and finding new perspectives. It drives every choice on screen and every decision off it.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description:
      'Growth is a continuous process — of skill, of understanding, of self. Each project teaches something new, and every challenge is an opportunity to evolve.',
  },
  {
    icon: Briefcase,
    title: 'Professionalism',
    description:
      'Professionalism is the foundation of every collaboration. Preparation, reliability, and respect for the craft define how stories come to life.',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description:
      'Authenticity means staying true to the story and to oneself. It is the commitment to honest, grounded performances that resonate with audiences.',
  },
];

export const JourneyValues: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-values" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Driven By Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#3F3F46] tracking-tight">
            The principles behind the craft.
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {VALUES.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={idx}
                className="bg-[#FAF9F7] hover:bg-white rounded-[1.5rem] p-7 sm:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5 flex flex-col items-start group cursor-default transform hover:-translate-y-1 border border-transparent hover:border-[#E8E5DF]/60"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mb-6 group-hover:bg-[#C9A84C] group-hover:text-white transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#C9A84C]/20">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-editorial text-[#3F3F46] group-hover:text-[#C9A84C] transition-colors duration-300 mb-3">
                  {value.title}
                </h3>

                <p className="text-sm text-[#52525B] leading-relaxed group-hover:text-[#3F3F46] transition-colors duration-300">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
