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
    <section id="gallery" className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote Block */}
        <div className="relative rounded-[2rem] overflow-hidden mb-24 bg-[#FAF9F7] border border-[#E8E5DF]">
          <div className="relative z-10 max-w-4xl mx-auto text-center py-20 sm:py-24 px-8 sm:px-12">
            {/* Large decorative quote mark */}
            <div className="font-editorial text-[8rem] sm:text-[10rem] leading-none text-[#C9A84C]/15 absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none">
              &ldquo;
            </div>

            {/* Quote icon */}
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-10">
              <Quote className="w-6 h-6 text-[#C9A84C]" />
            </div>

            {/* Quote text */}
            <blockquote className="relative text-3xl sm:text-4xl md:text-5xl font-editorial italic text-[#1C1917] leading-[1.4] tracking-wide max-w-3xl mx-auto">
              Every role teaches me something new about the world and about myself.
            </blockquote>

            {/* Gold divider */}
            <div className="flex items-center justify-center gap-5 mt-12 mb-8">
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
              <div className="w-2 h-2 rotate-45 border border-[#C9A84C]/60" />
              <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
            </div>

            {/* Attribution */}
            <div className="space-y-1">
              <div className="font-editorial italic text-lg sm:text-xl text-[#C9A84C] tracking-[0.2em] uppercase">
                Homer Gere
              </div>
              <div className="text-[11px] text-[#78716C] tracking-[0.15em] uppercase">
                Actor & Storyteller
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight">
              Moments & Portraits
            </h2>
          </div>

          <button
            onClick={onViewFullGallery}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1C1917] hover:text-[#C9A84C] transition-colors duration-300 group focus:outline-none cursor-pointer"
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
              className="group relative rounded-[1.5rem] overflow-hidden aspect-square bg-[#E8E5DF] cursor-pointer transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-medium tracking-widest text-[#C9A84C] uppercase">
                  {item.category}
                </span>
                <h4 className="text-base font-editorial text-white mt-1">
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
