import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Calendar, MapPin, GraduationCap, Users, Film, Sparkles } from 'lucide-react';
import { IMAGES } from '../../data/images';

const FACTS = [
  { icon: <Calendar className="w-4 h-4" />, label: 'Born', value: 'February 6, 2000' },
  { icon: <MapPin className="w-4 h-4" />, label: 'From', value: 'New York City' },
  { icon: <GraduationCap className="w-4 h-4" />, label: 'Education', value: 'Brown University' },
  { icon: <Users className="w-4 h-4" />, label: 'Parents', value: 'Richard Gere & Carey Lowell' },
  { icon: <Film className="w-4 h-4" />, label: 'Years Active', value: '2023 – Present' },
  { icon: <Sparkles className="w-4 h-4" />, label: 'Known For', value: 'Euphoria, The Shards' },
];

export const JourneyGlance: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-glance" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 lg:gap-20 items-start">
          {/* Left — Portrait */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] bg-[#E8E5DF]">
                <img 
                  src={IMAGES.heroPortraitClean}
                  alt="Homer Gere — Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 rounded-[1rem] bg-[#A6852F]/8 border border-[#A6852F]/10 -z-10" />
            </div>
          </motion.div>

          {/* Right — Quick Facts */}
          <motion.div
            className="lg:col-span-7 space-y-10"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-4">
              <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
                Life At A Glance
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight leading-[1.08]">
                The essentials.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FACTS.map((fact, idx) => (
                <motion.div
                  key={fact.label}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0 group-hover:bg-[#A6852F]/15 transition-colors duration-300">
                    {fact.icon}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#71717A] uppercase tracking-wider">
                      {fact.label}
                    </span>
                    <p className="text-base sm:text-lg font-editorial text-[#111827] mt-0.5">
                      {fact.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E5DF]">
              <p className="text-sm text-[#71717A] leading-relaxed max-w-lg">
                Homer James Jigme Gere is an American actor, the son of Richard Gere and Carey
                Lowell. His middle name "Jigme" is Tibetan for "fearless." He studied Cognitive
                Neuroscience and Visual Arts at Brown University before pursuing acting full-time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
