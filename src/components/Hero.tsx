import React from 'react';
import { Play, Clapperboard, Star, Users, Globe, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { IMAGES } from '../data/images';

interface HeroProps {
  onExploreJourney?: () => void;
  onViewProject?: (projectId: string) => void;
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreJourney, onViewProject, onOpenChat }) => {
  const { metrics, featuredProject, heroSlides, homepageStatistics } = useSiteContent();

  const activeSlide = heroSlides.length > 0 ? heroSlides[0] : null;
  const heroTitle = activeSlide?.title || null;
  const heroSubtitle = activeSlide?.subtitle || null;
  const heroDescription = activeSlide?.description || 'Rising talent in Hollywood — from Euphoria Season 3 to The Shards and a highly anticipated Oliver Stone project. Explore his journey, exclusive experiences, and behind-the-scenes moments.';
  const heroImage = activeSlide?.image_url || null;
  const heroButtonText = activeSlide?.button_text || 'Chat with Homer Gere';
  const heroButtonLink = activeSlide?.button_link || null;
  const secondaryButtonText = activeSlide?.secondary_button_text || 'Latest Project';
  const secondaryButtonLink = activeSlide?.secondary_button_link || null;

  const displayMetrics = homepageStatistics.length > 0
    ? homepageStatistics.map(s => ({ label: s.label, value: s.value, icon: s.icon || 'star' }))
    : metrics;

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'clapperboard': return <Clapperboard className="w-4 h-4" />;
      case 'star': return <Star className="w-4 h-4" />;
      case 'globe': return <Globe className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <section id="home" className="pt-20 pb-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div id="hero-container" className="relative rounded-[2rem] overflow-hidden bg-[#FAF9F7] min-h-[520px] sm:min-h-[620px] lg:min-h-[760px] w-full group">

          {/* Full-bleed background image */}
          <div className="absolute inset-0">
            <img
              src={heroImage || IMAGES.homerGqLifestyleStudio}
              alt="Homer Gere"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Light gradient overlay — soft fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7]/95 via-[#FAF9F7]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7]/70 via-transparent to-[#FAF9F7]/20 pointer-events-none" />

          {/* Gold accent line — vertical */}
          <div className="absolute top-8 left-[52%] w-[1px] h-24 bg-gradient-to-b from-[#A6852F] to-transparent pointer-events-none hidden lg:block" />

          {/* Content — left aligned, vertically centered */}
          <div className="relative z-10 h-full flex flex-col justify-center p-5 sm:p-12 md:p-16 lg:p-20 lg:pl-16 w-full lg:w-[55%]">

            {/* Overline */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-6 sm:w-10 h-[1px] bg-[#A6852F]" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#A6852F] uppercase tracking-[0.3em] sm:tracking-[0.35em]">Official Website</span>
            </div>

            {/* Title */}
            {heroTitle ? (
              <h1 className="text-[1.75rem] sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-editorial text-[#1C1917] tracking-tight leading-[1.05] mb-3 sm:mb-5">
                {heroTitle}
              </h1>
            ) : (
              <h1 className="text-[1.75rem] sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-editorial text-[#1C1917] tracking-tight leading-[1.05] mb-3 sm:mb-5">
                Homer<span className="text-[#A6852F]"> Gere</span>
              </h1>
            )}

            {/* Subtitle */}
            {heroSubtitle && (
              <p className="text-base sm:text-xl text-[#A6852F] font-medium tracking-wide mb-3 sm:mb-4">{heroSubtitle}</p>
            )}

            {/* Description */}
            <p className="text-[13px] sm:text-base text-[#57534E] font-normal leading-relaxed max-w-lg mb-5 sm:mb-8">
              {heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              {heroButtonLink ? (
                <a href={heroButtonLink} className="inline-flex items-center justify-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#A6852F]/30 focus:outline-none">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>{heroButtonText}</span>
                </a>
              ) : (
                <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#A6852F]/30 focus:outline-none cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>{heroButtonText}</span>
                </button>
              )}
              {secondaryButtonLink ? (
                <a href={secondaryButtonLink} className="inline-flex items-center justify-center gap-2 bg-[#1C1917]/5 backdrop-blur-sm hover:bg-[#1C1917]/10 active:scale-95 text-[#1C1917] font-medium text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-[#1C1917]/15 transition-all duration-300 focus:outline-none group/btn">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                </a>
              ) : (
                <button onClick={() => onViewProject?.(featuredProject.id)} className="inline-flex items-center justify-center gap-2 bg-[#1C1917]/5 backdrop-blur-sm hover:bg-[#1C1917]/10 active:scale-95 text-[#1C1917] font-medium text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-[#1C1917]/15 transition-all duration-300 focus:outline-none cursor-pointer group/btn">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {displayMetrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col gap-1 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#1C1917]/5 backdrop-blur-sm border border-[#1C1917]/10 hover:border-[#A6852F]/40 hover:bg-[#1C1917]/10 transition-all duration-300">
                  <div className="text-[#A6852F]">{getMetricIcon(metric.icon)}</div>
                  <div className="text-base sm:text-2xl font-editorial text-[#1C1917] tracking-tight">{metric.value}</div>
                  <div className="text-[10px] sm:text-[11px] text-[#57534E] font-medium uppercase tracking-wider">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator — bottom center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <a href="#projects" className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer" aria-label="Scroll to explore">
              <span className="text-[10px] font-medium text-[#A8A29E] group-hover:text-[#A6852F] transition-colors uppercase tracking-[0.3em]">Scroll</span>
              <div className="relative w-[1px] h-8 bg-[#D6D3D1] group-hover:bg-[#A6852F]/40 transition-colors overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#A6852F] rounded-full animate-scroll-line" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
