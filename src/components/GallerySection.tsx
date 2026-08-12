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
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quote Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <Quote className="w-10 h-10 text-gold/50 mx-auto" />
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-gray-900 leading-snug">
            "Every role teaches me something new about the world and about myself."
          </blockquote>
          <div className="font-cinzel text-xl sm:text-2xl text-gold-gradient font-bold tracking-[0.15em] uppercase pt-2">
            Homer Gere
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase font-outfit">
              Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-gray-900 mt-1">
              Moments & Portraits
            </h2>
          </div>

          <button
            onClick={onViewFullGallery}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group focus:outline-none cursor-pointer"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectImage(item)}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 cursor-pointer transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                  {item.category}
                </span>
                <h4 className="text-base font-serif font-bold text-white mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300 line-clamp-1">
                  {item.caption}
                </p>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
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
