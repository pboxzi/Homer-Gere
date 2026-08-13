import React from 'react';
import { ArrowRight, Check, Star, Crown } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../data/content';
import { MembershipTier } from '../types';

interface MembershipSectionProps {
  onSelectTier: (tier: MembershipTier) => void;
  onExploreMembership: () => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  onSelectTier,
  onExploreMembership,
}) => {
  return (
    <section id="membership" className="py-24 sm:py-32 bg-[#F3EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Membership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight leading-[1.1]">
              Join the journey. <br className="hidden sm:inline" />
              Be part of more.
            </h2>
            <p className="text-[#78716C] text-sm sm:text-base mt-5 leading-relaxed">
              Become a member and unlock exclusive benefits, early access, and unforgettable experiences directly with Homer.
            </p>
          </div>

          <button
            onClick={onExploreMembership}
            className="text-xs font-medium text-[#C9A84C] hover:text-[#B8983A] transition-colors duration-300 self-start md:self-auto focus:outline-none cursor-pointer"
          >
            Compare All Benefits &rarr;
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-[1.5rem] p-8 sm:p-9 transition-all duration-500 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-[#111827] text-white shadow-2xl shadow-[#111827]/20 ring-1 ring-[#C9A84C]/30'
                    : 'bg-[#FAF9F7] hover:bg-white text-[#1C1917] hover:shadow-xl hover:shadow-[#C9A84C]/5 border border-[#E8E5DF]/60'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-white text-[10px] font-medium tracking-widest uppercase px-5 py-1 rounded-full shadow-lg shadow-[#C9A84C]/25">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[11px] font-medium tracking-[0.15em] uppercase ${isPopular ? 'text-[#C9A84C]' : 'text-[#57534E]'}`}>
                      {tier.name}
                    </span>
                    {tier.id === 'platinum' ? (
                      <Crown className="w-5 h-5 text-[#C9A84C]" />
                    ) : (
                      <Star className={`w-5 h-5 ${isPopular ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#D1D5DB]'}`} />
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-7">
                    <span className="text-4xl sm:text-5xl font-editorial">
                      ${tier.price}
                    </span>
                    <span className={`text-xs font-medium ${isPopular ? 'text-[#57534E]' : 'text-[#57534E]'}`}>{tier.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                        <span className={isPopular ? 'text-[#D6D3D1]' : 'text-[#1C1917]'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => onSelectTier(tier)}
                    className={`w-full py-3.5 px-6 rounded-2xl text-xs font-medium transition-all duration-300 transform active:scale-95 focus:outline-none cursor-pointer ${
                      isPopular
                        ? 'bg-[#C9A84C] hover:bg-[#B8983A] text-white shadow-lg shadow-[#C9A84C]/25'
                        : 'bg-[#111827] hover:bg-[#1F2937] text-white'
                    }`}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
