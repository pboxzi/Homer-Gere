import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Quote, Pen } from 'lucide-react';
import { IMAGES } from '../../data/images';

export const JourneyQuote: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-quote" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Portrait */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] rounded-[2rem] overflow-hidden bg-[#E8E5DF]">
                <img
                  src={IMAGES.heroSplitBanner}
                  alt="Homer Gere Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-[1.25rem] bg-[#C9A84C]/8 border border-[#C9A84C]/10 -z-10" />
            </div>
          </motion.div>

          {/* Quote Placeholder */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Quote className="w-14 h-14 text-[#C9A84C]/20" />

            <blockquote className="text-2xl sm:text-3xl lg:text-[2.5rem] font-editorial font-medium text-[#3F3F46]/40 leading-[1.3] italic">
              "An official quote from Homer will be added here."
            </blockquote>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-[1.5px] bg-[#C9A84C]" />
              <span className="font-editorial text-lg sm:text-xl text-[#C9A84C] font-medium tracking-[0.12em] uppercase">
                Homer Gere
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Pen className="w-3.5 h-3.5" />
              <span>Official quote pending — to be updated when available.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
