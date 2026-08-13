import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectMediaGalleryProps {
  project: ProjectDetail;
}

export const ProjectMediaGallery: React.FC<ProjectMediaGalleryProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % project.media.length);
    }
  };
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + project.media.length) % project.media.length);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Media Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Official Images
          </h2>
          <p className="text-[#52525B] max-w-lg mx-auto">
            {project.media.length} images — premiere events, production stills, and behind-the-scenes moments
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {project.media.map((item, idx) => (
            <motion.div
              key={item.id}
              className={`group relative rounded-[1.25rem] overflow-hidden bg-[#E8E5DF] cursor-pointer ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08 }}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={item.src}
                alt={item.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                style={{ minHeight: idx === 0 ? '400px' : '200px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Type Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#111827]/60 backdrop-blur-sm rounded-full text-white/90 text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.type.replace('-', ' ')}
              </div>

              {/* Expand Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {item.caption && (
                  <p className="text-sm text-white/90 leading-relaxed">{item.caption}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#111827]/95 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
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

            {/* Image */}
            <div className="flex flex-col items-center gap-4 max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightboxIndex}
                src={project.media[lightboxIndex].src}
                alt={project.media[lightboxIndex].alt}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              />
              {/* Caption below image */}
              <div className="text-center max-w-xl">
                <p className="text-sm text-white/80">{project.media[lightboxIndex].alt}</p>
                {project.media[lightboxIndex].caption && (
                  <p className="text-xs text-white/50 mt-1">{project.media[lightboxIndex].caption}</p>
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
              {lightboxIndex + 1} / {project.media.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
