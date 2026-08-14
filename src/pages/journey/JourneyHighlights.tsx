import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

const HIGHLIGHTS = [
  {
    id: 'euphoria-debut',
    title: 'Euphoria Season 3 — TV Debut',
    description:
      'Made his television debut portraying Dylan Reid in HBO\'s Euphoria Season 3. The casting was announced by BBC News in October 2025; the season premiered in May 2026.',
    date: '2026',
    image: SECTION_IMAGES.highlights.euphoriaDebut,
    slug: 'euphoria',
  },
  {
    id: 'the-shards',
    title: 'The Shards — First Lead Role',
    description:
      'Cast as Robert Mallory in Ryan Murphy and Bret Easton Ellis\'s FX/Hulu series, starring alongside Igby Rigney, Kaia Gerber, Hayes Warner, Graham Campbell, Wes Bentley, and Evan Rachel Wood. His first major leading role, premiered August 5, 2026.',
    date: '2025–2026',
    image: SECTION_IMAGES.highlights.firstLeadRole,
    slug: 'the-shards',
  },
  {
    id: 'white-lies',
    title: 'White Lies — Oliver Stone Film',
    description:
      'Cast in an upcoming film directed by Oliver Stone, announced in June 2026. Details about the role and release date are forthcoming.',
    date: '2026',
    image: SECTION_IMAGES.highlights.whiteLies,
    slug: 'white-lies',
  },
  {
    id: 'brown-university',
    title: 'Brown University',
    description:
      'Studied Cognitive Neuroscience and Visual Arts at Brown University in Providence, Rhode Island. Graduated in 2024.',
    date: '2019–2024',
    image: SECTION_IMAGES.highlights.brownUniversity,
    slug: 'journey-glance',
  },
];

interface JourneyHighlightsProps {
  onItemClick?: (slug: string) => void;
}

export const JourneyHighlights: React.FC<JourneyHighlightsProps> = ({ onItemClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-highlights" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Career Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Moments that defined the path.
          </h2>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.article
              key={item.id}
              className="group rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#A6852F]/5 cursor-pointer hover:-translate-y-1 bg-[#F3F1ED]/60"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onItemClick?.(item.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick?.(item.slug);
                }
              }}
            >
              {/* Image */}
              <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-[#E8E5DF]">
                <img 
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-5 left-5 bg-[#FAF9F7]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#1C1917] uppercase shadow-sm">
                  <Calendar className="w-3 h-3 text-[#A6852F]" />
                  {item.date}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-7 lg:p-9">
                <h3 className="text-xl sm:text-2xl font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#44403C] leading-relaxed mb-7 group-hover:text-[#1C1917] transition-colors duration-300">
                  {item.description}
                </p>

                <div className="flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
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
