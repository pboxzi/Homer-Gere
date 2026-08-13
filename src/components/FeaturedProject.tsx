import React from 'react';
import { ArrowRight, Film } from 'lucide-react';
import { FEATURED_PROJECT } from '../data/content';

interface FeaturedProjectProps {
  onDiscoverMore: (projectId: string) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ onDiscoverMore }) => {
  return (
    <section id="projects" className="py-20 sm:py-28 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] overflow-hidden bg-[#111827] text-white min-h-[500px] lg:min-h-[560px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={FEATURED_PROJECT.image}
              alt={FEATURED_PROJECT.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-between max-w-2xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-[#C9A84C] text-[11px] font-medium tracking-widest uppercase">
                <Film className="w-3.5 h-3.5" />
                Featured Project
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-white tracking-tight leading-[1.05]">
                {FEATURED_PROJECT.title}
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg">
                {FEATURED_PROJECT.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl text-xs font-medium text-gray-200">
                  {FEATURED_PROJECT.status}
                </span>
                <span className="text-sm text-gray-400">
                  Director: <strong className="text-[#C9A84C] font-medium">{FEATURED_PROJECT.director}</strong>
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onDiscoverMore(FEATURED_PROJECT.id)}
                className="inline-flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:shadow-[#C9A84C]/25 group focus:outline-none cursor-pointer"
              >
                Discover More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
