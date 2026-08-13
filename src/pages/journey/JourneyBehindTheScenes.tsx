import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Camera, ArrowUpRight } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

const BTS_ITEMS = [
  {
    id: 'bts-premiere',
    title: 'The Shards Premiere After Party',
    caption: 'With Carey Lowell at SVA Theatre, July 2026',
    category: 'Events',
    image: SECTION_IMAGES.bts[0],
    size: 'large' as const,
  },
  {
    id: 'bts-on-set',
    title: 'The Shards — In Character',
    caption: 'On set during principal photography',
    category: 'Behind The Scenes',
    image: SECTION_IMAGES.bts[1],
    size: 'tall' as const,
  },
  {
    id: 'bts-portrait',
    title: 'Euphoria Season 3',
    caption: 'Between takes on the HBO set',
    category: 'Film Set',
    image: SECTION_IMAGES.bts[2],
    size: 'small' as const,
  },
  {
    id: 'bts-bw',
    title: 'Press Day Portrait',
    caption: 'Editorial portrait session',
    category: 'Portrait',
    image: SECTION_IMAGES.bts[3],
    size: 'small' as const,
  },
  {
    id: 'bts-editorial',
    title: 'In Conversation',
    caption: 'Interview session',
    category: 'Interview',
    image: SECTION_IMAGES.bts[4],
    size: 'tall' as const,
  },
  {
    id: 'bts-travel',
    title: 'On the Move',
    caption: 'Traveling between locations',
    category: 'Travel',
    image: SECTION_IMAGES.bts[5],
    size: 'small' as const,
  },
  {
    id: 'bts-editorial-shoot',
    title: 'Editorial Shoot',
    caption: 'Behind the camera with the creative team',
    category: 'Editorial',
    image: SECTION_IMAGES.bts[6],
    size: 'small' as const,
  },
  {
    id: 'bts-studio',
    title: 'Studio Session',
    caption: 'GQ lifestyle feature shoot',
    category: 'Editorial',
    image: SECTION_IMAGES.bts[7],
    size: 'wide' as const,
  },
];

interface JourneyBehindTheScenesProps {
  onImageClick?: (imageSrc: string, title: string) => void;
}

export const JourneyBehindTheScenes: React.FC<JourneyBehindTheScenesProps> = ({ onImageClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'tall':
        return 'col-span-1 row-span-2';
      case 'wide':
        return 'col-span-2 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <section id="journey-bts" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Behind the Scenes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
              The moments in between.
            </h2>
          </div>
          <p className="text-sm text-[#57534E] max-w-sm leading-relaxed">
            From premiere nights to quiet moments on set — a look at the world behind the camera.
          </p>
        </motion.div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[220px]">
          {BTS_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              className={`group relative rounded-[1.25rem] overflow-hidden bg-[#E8E5DF] cursor-pointer ${getSizeClasses(item.size)}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + idx * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onImageClick?.(item.image, item.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick?.(item.image, item.title);
                }
              }}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
              />

              {/* Dark gradient overlay — always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 via-[#111827]/10 to-transparent" />

              {/* Category tag */}
              <div className="absolute top-4 left-4 bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg">
                <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Expand icon on hover */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-1">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-editorial text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-white/60 mt-1 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                  <Camera className="w-4 h-4 text-white/40 shrink-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
