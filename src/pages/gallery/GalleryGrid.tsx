import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera, Calendar } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryGridProps {
  photos: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStart(null);
  };

  return (
    <>
      {/* Masonry Grid using CSS columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5">
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            className="break-inside-avoid mb-4 sm:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4) }}
          >
            <button
              className="group relative w-full rounded-[1.25rem] overflow-hidden bg-[#E8E5DF] cursor-pointer block"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={photo.image}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-700"
                loading="lazy" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#111827]/60 backdrop-blur-sm rounded-lg text-white/90 text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.category}
              </div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 w-11 h-11 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-sm text-white font-medium">{photo.caption}</p>
                {photo.event && (
                  <p className="text-xs text-white/60 mt-0.5">{photo.event}</p>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-20 rounded-[1.5rem] bg-[#F3F1ED]/60 border border-[#E8E5DF]/60">
          <Camera className="w-12 h-12 text-[#E8E5DF] mx-auto mb-4" />
          <p className="text-sm text-[#71717A]">No photos in this category yet.</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#111827]/95 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image + Info */}
            <div
              className="flex flex-col items-center gap-5 max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                src={photos[lightboxIndex].image}
                alt={photos[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-[90vw] object-contain rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              />

              {/* Photo Info */}
              <div className="text-center max-w-xl px-4">
                <p className="text-sm text-white font-medium">{photos[lightboxIndex].caption}</p>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-white/50">
                  {photos[lightboxIndex].event && (
                    <span>{photos[lightboxIndex].event}</span>
                  )}
                  {photos[lightboxIndex].date && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {photos[lightboxIndex].date}
                      </span>
                    </>
                  )}
                </div>
                {photos[lightboxIndex].photographer && (
                  <p className="text-xs text-white/30 mt-1.5">
                    Photo: {photos[lightboxIndex].photographer}
                  </p>
                )}
              </div>
            </div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
