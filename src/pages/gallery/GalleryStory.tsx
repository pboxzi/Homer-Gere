import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Quote } from 'lucide-react';
import { FEATURED_STORY, GALLERY_PHOTOS } from '../../data/gallery';

export const GalleryStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const photo = GALLERY_PHOTOS.find((p) => p.id === FEATURED_STORY.photoId);
  if (!photo) return null;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Featured Story
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-white tracking-tight">
            {FEATURED_STORY.headline}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Image */}
          <motion.div
            className="rounded-[2rem] overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src={photo.src}
              alt={photo.alt}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] object-cover object-top"
              loading="lazy" />
          </motion.div>

          {/* Story */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Quote className="w-10 h-10 text-[#A6852F]/30" />

            <div className="space-y-5">
              {FEATURED_STORY.story.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-[#A8A29E] text-base sm:text-lg leading-[1.9]">
                  {paragraph}
                </p>
              ))}
            </div>

            {FEATURED_STORY.attribution && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">{FEATURED_STORY.attribution}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
