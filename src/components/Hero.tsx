import React from 'react';
import {
  ArrowRight,
  Play,
  Clapperboard,
  Star,
  Users,
  Globe,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { METRICS, FEATURED_PROJECT } from '../data/content';
import { IMAGES } from '../data/images';

interface HeroProps {
  onExploreJourney?: () => void;
  onViewProject?: (projectId: string) => void;
  onOpenChat?: (mode?: 'fan' | 'business') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreJourney, onViewProject, onOpenChat }) => {
  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'clapperboard':
        return <Clapperboard className="w-4 h-4 text-[#C8A96A]" />;
      case 'star':
        return <Star className="w-4 h-4 text-[#C8A96A]" />;
      case 'globe':
        return <Globe className="w-4 h-4 text-[#C8A96A]" />;
      case 'users':
        return <Users className="w-4 h-4 text-[#C8A96A]" />;
      default:
        return <Star className="w-4 h-4 text-[#C8A96A]" />;
    }
  };

  return (
    <section id="home" className="pt-24 pb-0 bg-[#F8F5EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Container */}
        <div
          id="hero-container"
          className="relative rounded-[2rem] overflow-hidden bg-[#F3EFE7] min-h-[600px] lg:aspect-[16/9] w-full flex flex-col justify-between group transition-all duration-300"
        >
          {/* Right Side — Cinematic Lifestyle Editorial */}
          <div className="relative lg:absolute top-0 right-0 w-full lg:w-[55%] h-[340px] sm:h-[420px] lg:h-full shrink-0">
            <img
              src={IMAGES.homerGqLifestyleStudio}
              alt="Homer Gere - Editorial Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top lg:object-center transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
            />
            {/* Warm fade blend into left space */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/40 to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5EF] via-[#F8F5EF]/50 to-transparent lg:hidden pointer-events-none" />
          </div>

          {/* Left Side — Editorial Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 w-full lg:w-[48%] flex flex-col items-start justify-between h-full space-y-6 lg:space-y-0">
            <div className="flex flex-col items-start gap-4 sm:gap-5 max-w-xl">
              <p className="text-sm sm:text-base text-[#6B7280] font-normal leading-relaxed max-w-lg">
                A rising actor with a passion for storytelling, memorable performances, and meaningful connections. Discover his latest projects, exclusive experiences, and official updates.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                <button
                  onClick={() => onOpenChat?.('fan')}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#C8A96A] hover:bg-[#B89A5A] active:scale-95 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C8A96A]/25 focus:outline-none cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Homer Gere</span>
                </button>

                <button
                  onClick={() => onViewProject?.(FEATURED_PROJECT.id)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F3EFE7] active:scale-95 text-[#111827] font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#C8A96A] fill-[#C8A96A]" />
                  <span>Latest Project</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="w-full pt-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {METRICS.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start p-4 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#C8A96A]/10 flex items-center justify-center shrink-0">
                        {getMetricIcon(metric.icon)}
                      </div>
                      <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]/40" />
                    </div>
                    <div className="text-lg sm:text-xl font-editorial font-bold text-[#111827] tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] font-medium tracking-wide mt-0.5 uppercase">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="relative z-10 pt-1 pb-4 w-full flex flex-col items-center justify-center">
            <a
              href="#projects"
              className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
              aria-label="Scroll to explore content"
            >
              <span className="text-[10px] font-semibold text-[#A8A29E] group-hover:text-[#C8A96A] transition-colors uppercase tracking-[0.25em]">
                Scroll to Explore
              </span>
              <div className="relative w-[1px] h-8 bg-[#ECE8E1] group-hover:bg-[#C8A96A]/30 transition-colors overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#C8A96A] rounded-full animate-scroll-line" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
