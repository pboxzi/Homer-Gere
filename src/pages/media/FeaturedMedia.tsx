import React from 'react';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import { MEDIA_VIDEOS } from '../../data/content';

interface FeaturedMediaProps {
  onWatch: (url: string) => void;
}

export const FeaturedMedia: React.FC<FeaturedMediaProps> = ({ onWatch }) => {
  const featured = MEDIA_VIDEOS.find((v) => v.featured) || MEDIA_VIDEOS[0];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Featured
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">
            Latest Release
          </h2>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer" onClick={() => onWatch(featured.url)}>
          {/* Thumbnail */}
          <div className="relative aspect-[16/7] sm:aspect-[16/6]">
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-medium tracking-widest uppercase">
                  <Play className="w-3 h-3 fill-current" />
                  {featured.category.replace('-', ' ')}
                </span>
                <span className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Calendar className="w-3 h-3" />
                  {featured.date}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial text-white tracking-tight leading-[1.1]">
                {featured.title}
              </h3>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg">
                {featured.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#1C1917] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer">
                  <Play className="w-4 h-4 fill-current" />
                  Watch Now
                </button>
                <span className="text-white/50 text-xs flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  {featured.source} · {featured.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
