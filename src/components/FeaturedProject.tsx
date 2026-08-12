import React from 'react';
import { ArrowRight, Film } from 'lucide-react';
import { FEATURED_PROJECT } from '../data/content';

interface FeaturedProjectProps {
  onDiscoverMore: (projectId: string) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ onDiscoverMore }) => {
  return (
    <section id="projects" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gray-950 text-white">
          
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={FEATURED_PROJECT.image}
              alt={FEATURED_PROJECT.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90" />
          </div>

          {/* Content Box */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-gold-light text-xs font-bold tracking-widest uppercase mb-6 font-outfit">
              <Film className="w-3.5 h-3.5 text-gold-light" />
              Featured Project
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-extrabold text-white tracking-tight mb-4">
              {FEATURED_PROJECT.title}
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              {FEATURED_PROJECT.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-xs font-semibold text-gray-200">
                {FEATURED_PROJECT.status}
              </span>
              <span className="text-sm text-gray-400">
                Director: <strong className="text-gold-light font-semibold">{FEATURED_PROJECT.director}</strong>
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onDiscoverMore(FEATURED_PROJECT.id)}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-semibold text-sm px-6 py-3.5 rounded-full transition-all transform active:scale-95 group focus:outline-none cursor-pointer"
              >
                Discover More
                <ArrowRight className="w-4 h-4 text-gray-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Slider Dots Visual Accent */}
          <div className="absolute bottom-6 right-8 hidden sm:flex items-center space-x-2 z-10">
            <span className="w-8 h-2 bg-blue-500 rounded-full" />
            <span className="w-2 h-2 bg-white/40 rounded-full hover:bg-white/80 cursor-pointer transition-colors" />
            <span className="w-2 h-2 bg-white/40 rounded-full hover:bg-white/80 cursor-pointer transition-colors" />
            <span className="w-2 h-2 bg-white/40 rounded-full hover:bg-white/80 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
};
