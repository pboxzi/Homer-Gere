import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { IMAGES } from '../../data/images';

const HIGHLIGHTS = [
  {
    id: 'early-theater',
    title: 'First Steps on Stage',
    description:
      'At age 13, Homer stepped onto a regional theater stage for the first time in a production of "Our Town," discovering a lifelong calling for performance.',
    date: '2013',
    image: IMAGES.journalPortrait,
  },
  {
    id: 'drama-training',
    title: 'Intensive Drama Training',
    description:
      'Enrolled in an intensive drama studio in New York, immersing in Meisner and Stanislavski techniques under the guidance of renowned coaches.',
    date: '2015',
    image: IMAGES.homerGqLifestyleStudio,
  },
  {
    id: 'breakthrough-role',
    title: 'Breakout in "Echoes of Midnight"',
    description:
      'A compelling lead performance in the feature drama "Echoes of Midnight" captured critical acclaim and established Homer as a rising talent.',
    date: '2020',
    image: IMAGES.shardsBanner,
  },
  {
    id: 'the-shards',
    title: 'Starring in "The Shards"',
    description:
      'Leading a major studio feature set in 1980s New York, delivering a haunting performance that marks the next defining chapter in Homer\'s career.',
    date: '2026',
    image: IMAGES.homerBrightLuxuryEditorial,
  },
];

export const JourneyHighlights: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-highlights" ref={sectionRef} className="py-24 sm:py-32 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
            Career Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] tracking-tight">
            Moments that defined the path.
          </h2>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.article
              key={item.id}
              className="group rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#C8A96A]/5 cursor-pointer hover:-translate-y-1 bg-[#EDE9E0]/60"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Image */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-[#E4DFD5]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-5 left-5 bg-[#F5F2EB]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#57534E] uppercase shadow-sm">
                  <Calendar className="w-3 h-3 text-[#C8A96A]" />
                  {item.date}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 sm:p-9">
                <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#111827] group-hover:text-[#C8A96A] transition-colors duration-300 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#78716C] leading-relaxed mb-7 group-hover:text-[#57534E] transition-colors duration-300">
                  {item.description}
                </p>

                <div className="flex items-center text-xs font-semibold text-[#C8A96A] group-hover:translate-x-1 transition-transform duration-300">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
