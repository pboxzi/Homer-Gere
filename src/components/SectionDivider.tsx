import React from 'react';

export const SectionDivider: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/30" />
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
    </div>
  </div>
);
