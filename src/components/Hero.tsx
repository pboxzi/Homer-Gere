import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Clapperboard, 
  Star, 
  Users, 
  Globe, 
  Calendar, 
  BookOpen, 
  ChevronDown,
  Sparkles,
  MessageSquare
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
        return <Clapperboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />;
      case 'star':
        return <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />;
      case 'globe':
        return <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />;
      case 'users':
        return <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />;
      default:
        return <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />;
    }
  };

  return (
    <section id="home" className="pt-2 sm:pt-4 pb-8 sm:pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ultra-Wide 16:9 Master Split Hero Container matching #hero-container */}
        <div 
          id="hero-container" 
          className="relative rounded-3xl overflow-hidden bg-[#FAFAFA] min-h-[580px] lg:aspect-[16/9] w-full flex flex-col justify-between group transition-all duration-300 mb-6 sm:mb-8"
        >
          {/* RIGHT SIDE (about 55% width) - GQ / Esquire Lifestyle Editorial Photograph */}
          <div className="relative lg:absolute top-0 right-0 w-full lg:w-[55%] h-[320px] sm:h-[400px] lg:h-full shrink-0">
            <img
              src={IMAGES.homerGqLifestyleStudio}
              alt="Homer Gere - GQ Lifestyle Editorial Studio Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top lg:object-center transition-transform duration-1000 ease-out group-hover:scale-[1.012]"
            />

            {/* Seamless Soft Fade Blend from Photograph into Left White/Off-White Space */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/30 to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/60 to-transparent lg:hidden pointer-events-none" />

            {/* Floating Premium UI Element 1: "Latest Project" Preview */}
            <div className="absolute top-6 right-6 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md p-3 pr-4 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                 onClick={() => onViewProject?.(FEATURED_PROJECT.id)}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                <Play className="w-4 h-4 fill-[#2563EB]" />
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">LATEST PROJECT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-gray-900 truncate">The Shards</div>
                <div className="text-[10px] text-gray-500 font-medium">In Post-Production • 2026</div>
              </div>
            </div>

            {/* Floating Premium UI Element 2: Upcoming Premiere */}
            <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Calendar className="w-4 h-4 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-gold uppercase tracking-wider font-outfit">UPCOMING PREMIERE</div>
                <div className="text-xs font-bold text-gray-900">TIFF Gala Premiere • Sept 18</div>
              </div>
            </div>

            {/* Floating Premium UI Element 3: Recent Journal */}
            <div className="absolute bottom-28 right-12 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 px-3.5 rounded-xl">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-medium text-gray-700">"On Crafting Authenticity" • 4 min read</span>
            </div>
          </div>

          {/* LEFT SIDE (about 45% width) - Integrated Editorial Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 w-full lg:w-[48%] flex flex-col items-start justify-between h-full space-y-6 lg:space-y-0">
            
            <div className="flex flex-col items-start gap-3 sm:gap-4 max-w-xl">
              
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-accent" />
                <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase font-outfit">
                  Official Portfolio
                </span>
              </div>

              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Homer Gere
              </h1>

              {/* Supporting Copy */}
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-normal leading-relaxed max-w-lg">
                A rising actor with a passion for storytelling, memorable performances, and meaningful connections. Discover his latest projects, exclusive experiences, and official updates.
              </p>

              {/* Two Call-To-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                {/* Chat with Homer Gere (Primary Royal Blue) */}
                <button
                  onClick={() => onOpenChat?.('fan')}
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 py-3 sm:px-7 sm:py-3.5 rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Homer Gere</span>
                </button>

                {/* Latest Project (Secondary Flat Button) */}
                <button
                  onClick={() => onViewProject?.(FEATURED_PROJECT.id)}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 active:scale-95 text-[#111827] font-semibold text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
                  <span>Latest Project</span>
                </button>
              </div>
            </div>

            {/* Four Clean Statistic Displays */}
            <div className="w-full pt-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {METRICS.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white/80 transition-all"
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0">
                        {getMetricIcon(metric.icon)}
                      </div>
                      <Sparkles className="w-2.5 h-2.5 text-blue-300 opacity-60" />
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-bold font-sans text-[#111827] tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#6B7280] font-medium tracking-wide mt-0.5">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Minimal 'Scroll to Explore' Indicator with Thin Animated Line */}
          <div className="relative z-10 pt-1 pb-3 w-full flex flex-col items-center justify-center">
            <a 
              href="#projects" 
              className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
              aria-label="Scroll to explore content"
            >
              <span className="text-[10px] font-semibold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-[0.25em]">
                Scroll to Explore
              </span>
              <div className="relative w-[1px] h-8 bg-gray-200 group-hover:bg-blue-200 transition-colors overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600 rounded-full animate-scroll-line" />
              </div>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};




