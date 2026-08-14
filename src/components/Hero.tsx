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
  const heroDescription = activeSlide?.description || 'American actor known for Euphoria Season 3, The Shards, and upcoming projects with Oliver Stone. Discover his work, exclusive experiences, and official updates.';
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
      case 'clapperboard': return <Clapperboard className="w-4 h-4 text-[#A6852F]" />;
      case 'star': return <Star className="w-4 h-4 text-[#A6852F]" />;
      case 'globe': return <Globe className="w-4 h-4 text-[#A6852F]" />;
      case 'users': return <Users className="w-4 h-4 text-[#A6852F]" />;
      default: return <Star className="w-4 h-4 text-[#A6852F]" />;
    }
  };

  return (
    <section id="home" className="pt-20 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="hero-container" className="relative rounded-[2rem] overflow-hidden bg-[#F3F1ED] min-h-[520px] sm:min-h-[620px] lg:min-h-[740px] w-full flex flex-col justify-between group transition-all duration-300">

          {/* Background Image — Full Cinematic */}
          <div className="absolute inset-0">
            <img
              src={heroImage || IMAGES.homerGqLifestyleStudio}
              alt="Homer Gere — Cinematic Editorial"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-top transition-transform duration-[1500ms] ease-out group-hover:scale-[1.02]"
            />
            {/* Multi-layer gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/70 to-transparent sm:via-[#FAF9F7]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7]/80 via-transparent to-[#FAF9F7]/30 pointer-events-none" />
            {/* Subtle grain texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          </div>

          {/* Floating gold accent line */}
          <div className="absolute top-0 left-[5%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#A6852F]/15 to-transparent pointer-events-none hidden lg:block" />

          {/* Content — Editorial Layout */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 lg:pb-12 w-full lg:w-[52%] flex flex-col items-start justify-between h-full space-y-6 lg:space-y-0">
            <div className="flex flex-col items-start gap-4 sm:gap-5 max-w-xl">
              {/* Overline */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-[1px] bg-[#A6852F]" />
                <span className="text-[11px] font-bold text-[#A6852F] uppercase tracking-[0.3em]">Official Website</span>
              </div>

              {/* Title */}
              {heroTitle ? (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-editorial text-[#1C1917] tracking-tight leading-[1.1]">
                  {heroTitle}
                </h1>
              ) : (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-editorial text-[#1C1917] tracking-tight leading-[1.1]">
                  Homer<span className="text-[#A6852F]"> Gere</span>
                </h1>
              )}

              {/* Subtitle */}
              {heroSubtitle && (
                <p className="text-base sm:text-lg text-[#A6852F] font-medium tracking-wide">{heroSubtitle}</p>
              )}

              {/* Description */}
              <p className="text-sm sm:text-[15px] text-[#57534E] font-normal leading-relaxed max-w-lg">
                {heroDescription}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                {heroButtonLink ? (
                  <a href={heroButtonLink} className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_24px_rgba(166,133,47,0.25)] hover:shadow-[0_8px_32px_rgba(166,133,47,0.35)] focus:outline-none">
                    <MessageSquare className="w-4 h-4" /><span>{heroButtonText}</span>
                  </a>
                ) : (
                  <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_24px_rgba(166,133,47,0.25)] hover:shadow-[0_8px_32px_rgba(166,133,47,0.35)] focus:outline-none cursor-pointer">
                    <MessageSquare className="w-4 h-4" /><span>{heroButtonText}</span>
                  </button>
                )}
                {secondaryButtonLink ? (
                  <a href={secondaryButtonLink} className="inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/70 active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 border border-[#E8E5DF]/50 focus:outline-none group/btn">
                    <Play className="w-3.5 h-3.5 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </a>
                ) : (
                  <button onClick={() => onViewProject?.(featuredProject.id)} className="inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/70 active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 border border-[#E8E5DF]/50 focus:outline-none cursor-pointer group/btn">
                    <Play className="w-3.5 h-3.5 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="w-full pt-5 mt-4 sm:mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {displayMetrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col items-start p-3.5 sm:p-4 transition-all duration-300 rounded-2xl bg-white/40 backdrop-blur-sm hover:bg-white/60 border border-white/30">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center shrink-0">{getMetricIcon(metric.icon)}</div>
                      <Sparkles className="w-2.5 h-2.5 text-[#A6852F]/30" />
                    </div>
                    <div className="text-lg sm:text-xl font-editorial text-[#1C1917] tracking-tight">{metric.value}</div>
                    <div className="text-[10px] sm:text-[11px] text-[#57534E] font-medium tracking-wide mt-0.5 uppercase">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="relative z-10 pt-1 pb-4 w-full flex flex-col items-center justify-center">
            <a href="#projects" className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer" aria-label="Scroll to explore content">
              <span className="text-[11px] font-medium text-[#A8A29E] group-hover:text-[#A6852F] transition-colors uppercase tracking-[0.25em]">Scroll to Explore</span>
              <div className="relative w-[1px] h-8 bg-[#E8E5DF] group-hover:bg-[#A6852F]/30 transition-colors overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#A6852F] rounded-full animate-scroll-line" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
