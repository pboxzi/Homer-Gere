import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

interface MediaHeroProps {
  onWatchMedia: () => void;
}

export const MediaHero: React.FC<MediaHeroProps> = ({ onWatchMedia }) => {
  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
                Official Media
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-[#1C1917] tracking-tight leading-[1.05]">
                Media
              </h1>
              <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-lg">
                The official source for verified interviews, trailers, behind-the-scenes content,
                and press appearances featuring Homer Gere.
              </p>
            </div>

            <button
              onClick={onWatchMedia}
              className="inline-flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 focus:outline-none cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Featured</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                alt="Homer Gere — Media"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/30 to-transparent" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-lg shadow-black/5">
              <div className="text-2xl font-editorial text-[#1C1917]">20+</div>
              <div className="text-[11px] text-[#57534E] font-medium tracking-wide uppercase">
                Verified Appearances
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
