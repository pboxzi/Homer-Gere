import React from 'react';
import { IMAGES } from '../../data/images';
import { Reveal } from './Reveal';

export const JourneyIntro: React.FC = () => {
  return (
    <section id="journey-intro" className="py-24 sm:py-32 bg-[#F3EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Editorial Photograph */}
          <Reveal direction="left">
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-[#ECE8E1]">
                <img
                  src={IMAGES.heroPortraitClean}
                  alt="Homer Gere - Editorial Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative accents */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-[1rem] bg-[#C8A96A]/10 border border-[#C8A96A]/15 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#C8A96A]/5 -z-10" />
            </div>
          </Reveal>

          {/* Right — Biography */}
          <Reveal direction="right" delay={0.15}>
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
                  Meet Homer
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] tracking-tight leading-[1.08]">
                  Meet Homer
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-[#6B7280] text-base sm:text-lg leading-[1.8]">
                  Homer Gere is a 24-year-old actor, storyteller, and creative professional whose
                  passion for performance began on the stages of small-town theaters. With an innate
                  ability to inhabit complex characters, he has quickly established himself as one of
                  the most compelling young talents in independent and studio cinema.
                </p>

                <p className="text-[#6B7280] text-base sm:text-lg leading-[1.8]">
                  From early training in Meisner and Stanislavski techniques to breakout roles in
                  acclaimed dramas, Homer's journey reflects a relentless pursuit of authenticity.
                  His upcoming starring role in "The Shards" — an intense coming-of-age drama set in
                  1980s New York — marks a defining chapter in a career built on dedication,
                  curiosity, and a deep love for the craft of storytelling.
                </p>

                <p className="text-[#6B7280] text-base sm:text-lg leading-[1.8]">
                  Beyond the screen, Homer is a photographer, avid reader, and advocate for
                  meaningful creative collaboration. He believes every story has the power to
                  transform both the teller and the listener — and he approaches every project with
                  that conviction.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
