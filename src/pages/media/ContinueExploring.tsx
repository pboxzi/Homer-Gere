import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Sparkles, MessageCircle } from 'lucide-react';

interface ContinueExploringProps {
  onNavigate: (section: string) => void;
}

export const ContinueExploring: React.FC<ContinueExploringProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 sm:py-32 bg-[#F3F1ED]">
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

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => onNavigate('journal')}
              className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Journal
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className="inline-flex items-center gap-2 bg-transparent border border-[#E8E5DF] hover:border-[#A6852F] text-[#1C1917] font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Experiences
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 bg-transparent border border-[#E8E5DF] hover:border-[#A6852F] text-[#1C1917] font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with Homer
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
