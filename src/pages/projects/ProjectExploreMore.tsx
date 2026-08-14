import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ImageIcon, BookOpen, Newspaper } from 'lucide-react';
import { SECTION_IMAGES } from '../../data/images';

interface ProjectExploreMoreProps {
  onNavigate: (sectionId: string) => void;
}

export const ProjectExploreMore: React.FC<ProjectExploreMoreProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const LINKS = [
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Browse editorial photography, premiere moments, and behind-the-scenes images.',
      icon: <ImageIcon className="w-5 h-5" />,
      image: SECTION_IMAGES.exploreMore.gallery,
    },
    {
      id: 'journal',
      title: 'Journal',
      description: 'Read behind-the-scenes insights, personal reflections, and career updates.',
      icon: <BookOpen className="w-5 h-5" />,
      image: SECTION_IMAGES.exploreMore.journal,
    },
    {
      id: 'media',
      title: 'Media',
      description: 'Watch interviews, listen to podcasts, and read press coverage.',
      icon: <Newspaper className="w-5 h-5" />,
      image: SECTION_IMAGES.exploreMore.press,
    },
  ];

  return (
    <section id="explore-more" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Explore More
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Keep exploring.
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {LINKS.map((link, idx) => (
            <motion.button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="group relative rounded-[1.5rem] overflow-hidden text-left bg-[#F3F1ED] hover:shadow-2xl hover:shadow-[#A6852F]/8 transition-all duration-500 hover:-translate-y-1 focus:outline-none cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-[#E8E5DF]">
                <img 
                  src={link.image}
                  alt={link.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-[#111827]/10 to-transparent" />
                <div className="absolute bottom-5 left-5 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                  {link.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7">
                <h3 className="text-lg sm:text-xl font-editorial text-[#111827] group-hover:text-[#A6852F] transition-colors duration-300 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-5">
                  {link.description}
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
