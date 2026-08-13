import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ContinueExploringProps {
  onNavigate: (section: string) => void;
}

export const ContinueExploring: React.FC<ContinueExploringProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight">
              Continue Exploring
            </h2>
            <p className="text-sm text-[#57534E] max-w-md mx-auto">
              Discover more about Homer's journey, work, and exclusive experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('journal')}
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
            >
              Journal
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className="inline-flex items-center gap-2 bg-transparent border border-[#E8E5DF] hover:border-[#C9A84C] text-[#1C1917] font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
            >
              Experiences
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
