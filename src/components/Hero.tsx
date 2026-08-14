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
      case 'clapperboard': return <Clapperboard className="w-4 h-4 text-[#A6852F]" />;
      case 'star': return <Star className="w-4 h-4 text-[#A6852F]" />;
      case 'globe': return <Globe className="w-4 h-4 text-[#A6852F]" />;
      case 'users': return <Users className="w-4 h-4 text-[#A6852F]" />;
      default: return <Star className="w-4 h-4 text-[#A6852F]" />;
    }
  };

  return (
    <section id="home" className="pt-24 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="hero-container" className="relative rounded-[2rem] overflow-hidden bg-[#F3F1ED] min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] w-full flex flex-col justify-between group transition-all duration-300">
          {/* Right Side — Image */}
          <div className="relative lg:absolute top-0 right-0 w-full lg:w-[55%] h-[280px] sm:h-[380px] lg:h-full shrink-0">
            <img src={heroImage || IMAGES.homerGqLifestyleStudio} alt="Homer Gere - Editorial Portrait" referrerPolicy="no-referrer" className="w-full h-full object-cover object-top lg:object-center transition-transform duration-1000 ease-out group-hover:scale-[1.01]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent lg:hidden pointer-events-none" />
          </div>
          {/* Left Side — Editorial Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 lg:pb-12 w-full lg:w-[48%] flex flex-col items-start justify-between h-full space-y-6 lg:space-y-0">
            <div className="flex flex-col items-start gap-5 sm:gap-6 max-w-xl">
              {heroTitle && (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-tight">
                  {heroTitle}
                </h1>
              )}
              {heroSubtitle && (
                <p className="text-lg sm:text-xl text-[#A6852F] font-medium">{heroSubtitle}</p>
              )}
              <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed max-w-lg">
                {heroDescription}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                {heroButtonLink ? (
                  <a href={heroButtonLink} className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none">
                    <MessageSquare className="w-4 h-4" /><span>{heroButtonText}</span>
                  </a>
                ) : (
                  <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer">
                    <MessageSquare className="w-4 h-4" /><span>{heroButtonText}</span>
                  </button>
                )}
                {secondaryButtonLink ? (
                  <a href={secondaryButtonLink} className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F3F1ED] active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none group/btn">
                    <Play className="w-3.5 h-3.5 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </a>
                ) : (
                  <button onClick={() => onViewProject?.(featuredProject.id)} className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F3F1ED] active:scale-95 text-[#1C1917] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer group/btn">
                    <Play className="w-3.5 h-3.5 text-[#A6852F] fill-[#A6852F]" /><span>{secondaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#57534E] group-hover/btn:text-[#A6852F] group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </button>
                )}
              </div>
            </div>
            {/* Statistics */}
            <div className="w-full pt-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-2 gap-3">
                {displayMetrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col items-start p-4 transition-all duration-300 rounded-2xl hover:bg-[#F3F1ED]/60">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#A6852F]/10 flex items-center justify-center shrink-0">{getMetricIcon(metric.icon)}</div>
                      <Sparkles className="w-2.5 h-2.5 text-[#A6852F]/40" />
                    </div>
                    <div className="text-lg sm:text-xl font-editorial text-[#1C1917] tracking-tight">{metric.value}</div>
                    <div className="text-xs text-[#57534E] font-medium tracking-wide mt-0.5 uppercase">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
