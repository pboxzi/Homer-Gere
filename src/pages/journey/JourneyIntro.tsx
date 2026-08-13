import React from 'react';
import { IMAGES } from '../../data/images';
import { Reveal } from './Reveal';

export const JourneyIntro: React.FC = () => {
  return (
    <section id="journey-intro" className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Editorial Photograph */}
          <Reveal direction="left">
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-[#E8E5DF]">
                <img
                  src={IMAGES.heroPortraitClean}
                  alt="Homer Gere - Editorial Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative accents */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-[1rem] bg-[#A6852F]/10 border border-[#A6852F]/15 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#A6852F]/5 -z-10" />
            </div>
          </Reveal>

          {/* Right — Biography */}
          <Reveal direction="right" delay={0.15}>
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
                  Biography
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.08]">
                  Homer James Jigme Gere
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-[#1C1917] text-base sm:text-lg leading-[1.8]">
                  Born February 6, 2000 in New York City, Homer Gere is an American actor and
                  the son of actor Richard Gere and actress and former Bond girl Carey Lowell.
                  His middle name "Jigme" is Tibetan for "fearless" or "courageous," reflecting
                  his father's Buddhist faith.
                </p>

                <p className="text-[#1C1917] text-base sm:text-lg leading-[1.8]">
                  Homer grew up in New York and attended the private Hackley School in
                  Westchester, graduating in 2018. He then enrolled at Brown University in
                  Providence, Rhode Island, where he studied Cognitive Neuroscience and Visual
                  Arts — a combination that would later inform his approach to performance.
                  He graduated in 2024.
                </p>

                <p className="text-[#1C1917] text-base sm:text-lg leading-[1.8]">
                  After appearing in several independent short films, Homer made his television
                  debut in 2026 as Dylan Reid in HBO's Euphoria Season 3. He was then cast as
                  Robert Mallory in Ryan Murphy and Bret Easton Ellis's FX/Hulu series
                  The Shards, marking his first major leading role. He stars alongside Igby Rigney,
                  Kaia Gerber, Hayes Warner, Graham Campbell, Wes Bentley, and Evan Rachel Wood.
                  The series premiered August 5, 2026. In June 2026, it was announced
                  that he was cast in an Oliver Stone film.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
