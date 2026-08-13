import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Clock, ChevronDown } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { GalleryGrid } from './GalleryGrid';

interface GalleryLatestProps {
  initialCount?: number;
  loadMore?: number;
}

export const GalleryLatest: React.FC<GalleryLatestProps> = ({
  initialCount = 8,
  loadMore = 4,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const { galleryItems } = useSiteContent();

  const allPhotos = galleryItems.slice(0, 16);
  const visiblePhotos = allPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < allPhotos.length;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Latest Additions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
              Recently Added
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#71717A]">
            <Clock className="w-4 h-4" />
            <span>Sorted by newest first</span>
          </div>
        </motion.div>

        <GalleryGrid photos={visiblePhotos} />

        {hasMore && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button
              onClick={() => setVisibleCount((prev) => prev + loadMore)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111827] hover:bg-[#1C1917] text-white text-sm font-medium rounded-2xl transition-all duration-300 cursor-pointer group"
            >
              <span>Load More</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
