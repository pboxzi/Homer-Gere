import React from 'react';
import { Check, Star, Crown, ArrowRight } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../data/content';

interface MembershipSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onNavigate }) => {
  return (
    <section id="membership" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">Membership</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight leading-[1.1] hover-underline">
              Join the journey. <br className="hidden sm:inline" />Be part of more.
            </h2>
            <p className="text-[#78716C] text-sm sm:text-base mt-5 leading-relaxed">
              Become a member and unlock exclusive benefits, early access, and unforgettable experiences directly with Homer.
            </p>
          </div>
          <button onClick={() => onNavigate('membership')} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#C9A84C] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer group">
            View All Plans<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isPopular = tier.isPopular;
            return (
              <div key={tier.id} onClick={() => onNavigate('membership')} className={`relative p-8 sm:p-9 rounded-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer group ${isPopular ? 'bg-[#C9A84C]/8 text-[#1C1917] ring-1 ring-[#C9A84C]/30 shadow-lg shadow-[#C9A84C]/10' : 'text-[#1C1917] border border-[#E8E5DF]/60 hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5'}`}>
                {isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-white text-[10px] font-medium tracking-widest uppercase px-5 py-1 rounded-full">Most Popular</div>}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[11px] font-medium tracking-[0.15em] uppercase ${isPopular ? 'text-[#C9A84C]' : 'text-[#78716C]'}`}>{tier.name}</span>
                    {tier.id === 'platinum' ? <Crown className="w-5 h-5 text-[#C9A84C]" /> : <Star className={`w-5 h-5 ${isPopular ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#D1D5DB]'}`} />}
                  </div>
                  <div className="flex items-baseline gap-1 mb-7">
                    <span className="text-4xl sm:text-5xl font-editorial">${tier.price}</span>
                    <span className="text-xs font-medium text-[#78716C]">{tier.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {tier.features.filter((f) => f.included).slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                        <span className="text-[#44403C]">{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className={`w-full py-3.5 px-6 rounded-2xl text-xs font-medium transition-all duration-300 block text-center ${isPopular ? 'bg-[#C9A84C] text-white group-hover:bg-[#B8983A]' : 'bg-[#1C1917] text-white group-hover:bg-[#292524]'}`}>
                    {tier.ctaText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
