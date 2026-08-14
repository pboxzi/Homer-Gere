import React from 'react';
import { ArrowRight, Film, Calendar, User } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FeaturedProjectProps {
  onDiscoverMore: (projectId: string) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ onDiscoverMore }) => {
  const { featuredProject } = useSiteContent();

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[350px] sm:min-h-[560px] lg:min-h-[640px]">
          <div className="absolute inset-0 z-0">
            <img src={featuredProject.image} alt={featuredProject.title} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top scale-105 hover:scale-100 transition-transform duration-[1.5s]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5EF] via-transparent to-[#F8F5EF]/40" />
          </div>
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-between max-w-3xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A6852F]/15 border border-[#A6852F]/25 text-[#A6852F] text-[11px] font-medium tracking-widest uppercase">
                <Film className="w-3.5 h-3.5" />Featured Project
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight leading-[1.05]">{featuredProject.title}</h2>
              <p className="text-[#44403C] text-base sm:text-lg leading-relaxed max-w-lg">{featuredProject.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F3F1ED] backdrop-blur-sm rounded-xl text-xs font-medium text-[#1C1917]">
                  <Calendar className="w-3.5 h-3.5 text-[#A6852F]" />
                  {featuredProject.status}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-[#57534E]">
                  <User className="w-3.5 h-3.5 text-[#A6852F]" />
                  Director: <strong className="text-[#A6852F] font-medium">{featuredProject.director}</strong>
                </span>
              </div>
            </div>
            <div className="pt-6">
              <button onClick={() => onDiscoverMore(featuredProject.id)} className="inline-flex items-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:shadow-[#A6852F]/25 group focus:outline-none cursor-pointer">
                Discover More<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
