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
    <section id="membership" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              Membership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-2 tracking-tight">
              Join the journey. <br className="hidden sm:inline" />
              Be part of more.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
              Become a member and unlock exclusive benefits, early access, and unforgettable experiences directly with Homer.
            </p>
          </div>

          <button
            onClick={onExploreMembership}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto focus:outline-none cursor-pointer"
          >
            Compare All Benefits &rarr;
          </button>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-gray-950 text-white shadow-2xl ring-2 ring-blue-500'
                    : 'bg-gray-50/80 hover:bg-white text-gray-900 hover:shadow-xl border border-gray-100'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Tier Title & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold tracking-widest uppercase ${isPopular ? 'text-blue-400' : 'text-gray-400'}`}>
                      {tier.name}
                    </span>
                    {tier.id === 'platinum' ? (
                      <Crown className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Star className={`w-5 h-5 ${isPopular ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl sm:text-5xl font-serif font-bold">
                      ${tier.price}
                    </span>
                    <span className={`text-xs font-medium ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>{tier.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={isPopular ? 'text-gray-200' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div>
                  <button
                    onClick={() => onSelectTier(tier)}
                    className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold transition-all transform active:scale-95 focus:outline-none cursor-pointer ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
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
