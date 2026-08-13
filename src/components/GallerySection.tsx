import React from 'react';
import { ArrowRight, Quote, Maximize2 } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/content';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onSelectImage: (item: GalleryItem) => void;
  onViewFullGallery: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onSelectImage,
  onViewFullGallery,
}) => {
  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote Block */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-5">
          <Quote className="w-10 h-10 text-[#C8A96A]/30 mx-auto" />
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-editorial font-semibold text-[#111827] leading-[1.3]">
            "Every role teaches me something new about the world and about myself."
          </blockquote>
          <div className="font-editorial text-lg sm:text-xl text-[#C8A96A] font-bold tracking-[0.12em] uppercase pt-2">
            Homer Gere
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
              Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] mt-3 tracking-tight">
              Moments & Portraits
            </h2>
          </div>

          <button
            onClick={onViewFullGallery}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#C8A96A] transition-colors duration-300 group focus:outline-none cursor-pointer"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectImage(item)}
              className="group relative rounded-[1.5rem] overflow-hidden aspect-square bg-[#E4DFD5] cursor-pointer transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-semibold tracking-widest text-[#C8A96A] uppercase">
                  {item.category}
                </span>
                <h4 className="text-base font-editorial font-bold text-white mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>

                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
