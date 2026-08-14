import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Camera } from 'lucide-react';
import { FEATURED_COLLECTION } from '../../data/gallery';

interface GalleryFeaturedProps {
  onViewCollection: (collectionId: string) => void;
}

export const GalleryFeatured: React.FC<GalleryFeaturedProps> = ({ onViewCollection }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Featured Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Latest Official Series
          </h2>
        </motion.div>

        <motion.button
          className="group relative w-full rounded-[2rem] overflow-hidden bg-[#111827] cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          onClick={() => onViewCollection(FEATURED_COLLECTION.id)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-80 lg:h-[480px] overflow-hidden">
              <img 
                src={FEATURED_COLLECTION.coverImage}
                alt={FEATURED_COLLECTION.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827]/30 lg:to-[#111827]/60" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#A6852F]/15 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#A6852F]" />
                  </div>
                  <span className="text-xs font-medium text-[#A6852F] uppercase tracking-wider">
                    {FEATURED_COLLECTION.date}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial text-white leading-tight">
                  {FEATURED_COLLECTION.title}
                </h3>

                <p className="text-[#A8A29E] leading-relaxed">
                  {FEATURED_COLLECTION.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-[#71717A]">
                  <span>{FEATURED_COLLECTION.photoCount} Photos</span>
                  <span className="w-1 h-1 rounded-full bg-[#71717A]" />
                  <span>Official Collection</span>
                </div>

                <div className="flex items-center text-sm font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300 pt-2">
                  <span>View Collection</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    </section>
  );
};
