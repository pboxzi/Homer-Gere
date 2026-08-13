import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { IMAGES } from '../../data/images';

const BTS_ITEMS = [
  {
    id: 'bts-1',
    title: 'Behind Filming',
    caption: 'On set during principal photography for The Shards',
    image: IMAGES.journalOnset,
    span: 'col-span-1 row-span-2',
  },
  {
    id: 'bts-2',
    title: 'Script Reading',
    caption: 'Table read with the cast and director',
    image: IMAGES.journalPortrait,
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'bts-3',
    title: 'Studio Moments',
    caption: 'Between takes in the recording studio',
    image: IMAGES.bwInterview,
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'bts-4',
    title: 'Interviews',
    caption: 'Press day for The Shards',
    image: IMAGES.homerPurePhotorealisticPortrait,
    span: 'col-span-1 row-span-2',
  },
  {
    id: 'bts-5',
    title: 'Travel',
    caption: 'Location scouting across the American Southwest',
    image: IMAGES.roadChasing,
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'bts-6',
    title: 'Natural Lifestyle',
    caption: 'A quiet afternoon in Brooklyn',
    image: IMAGES.galleryCafe,
    span: 'col-span-1 row-span-1',
  },
];

export const JourneyBehindTheScenes: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-bts" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
            Behind the Scenes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] tracking-tight">
            The moments in between.
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[240px]">
          {BTS_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              className={`group relative rounded-[1.25rem] overflow-hidden bg-[#ECE8E1] cursor-pointer ${item.span}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
              />

              {/* Always-visible title bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/25 to-transparent p-5">
                <h4 className="text-sm sm:text-base font-editorial font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-300/80 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>

              {/* Hover expand icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
