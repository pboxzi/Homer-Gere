import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SECTION_IMAGES } from '../../data/images';

export const ContactHero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative h-[65vh] min-h-[350px] sm:min-h-[500px] flex items-end overflow-hidden bg-[#FAF9F7]"
    >
      <div className="absolute inset-0">
        <img 
          src={SECTION_IMAGES.exploreMore.contact}
          alt="Contact Homer Gere"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/40 to-[#FAF9F7]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Contact
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#57534E] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Get in touch with Homer's official management team.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
