import React from 'react';
import { ArrowUpRight, Scissors, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { CRAFTSMEN_DATA } from '../data/salonData';
import { Stylist } from '../types';

interface TeamSectionProps {
  onSelectStylist: (stylist: Stylist) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onSelectStylist }) => {
  const joe = CRAFTSMEN_DATA.craftsmen[0];
  const roya = CRAFTSMEN_DATA.craftsmen[1];

  return (
    <section
      className="dark:bg-[#141414] border-b border-[#1D1D1D]/10 dark:border-white/10 fade-in overflow-hidden bg-[#FAF9F6] py-24 relative transition-colors duration-300 font-sans"
      id="craftsmen"
    >
      {/* Center Divider Line (Desktop) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-[#1D1D1D]/10 dark:bg-white/10 hidden md:block opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Header + Joe (Master Barber) */}
          <div className="flex flex-col gap-16">
            {/* Section Header */}
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-[#9A8C73]"></span>
                <span className="text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold">
                  {CRAFTSMEN_DATA.tag}
                </span>
              </div>
              <h2 className="dark:text-[#FAF9F6] leading-[0.95] md:text-5xl text-4xl text-[#1D1D1D] tracking-tight font-serif font-normal mb-6">
                Crafted by Hand. <br />
                <span className="italic font-light text-[#9A8C73]">Refined by Decades.</span>
              </h2>
              <p className="text-sm text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed font-normal">
                {CRAFTSMEN_DATA.description}
              </p>
            </div>

            {/* Craftsman 1 - Joe */}
            <div
              className="group relative w-full max-w-lg cursor-pointer bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 p-6 sm:p-8 hover:border-[#9A8C73] transition-all duration-300 shadow-sm"
              onClick={() => onSelectStylist(joe)}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0] dark:bg-[#1A1A1A] mb-6 relative border border-[#1D1D1D]/10 dark:border-white/10">
                <img
                  src={joe.image}
                  className="transition-all duration-700 ease-out group-hover:scale-105 w-full h-full object-cover grayscale group-hover:grayscale-0"
                  alt={joe.name}
                />
                <div className="absolute top-4 left-4 bg-[#1D1D1D]/90 dark:bg-black/90 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border border-white/10">
                  {joe.experienceBadge}
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#9A8C73] text-white flex items-center justify-center shadow-lg">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-serif text-3xl text-[#1D1D1D] dark:text-[#FAF9F6] group-hover:text-[#9A8C73] transition-colors font-normal">
                    {joe.name}
                  </h3>
                  <span className="text-xs text-[#9A8C73] font-mono font-medium">Owner</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A8C73] font-semibold mb-3">
                  {joe.role}
                </p>
                <p className="text-xs sm:text-sm text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed font-normal mb-4">
                  {joe.bio}
                </p>

                {/* Quote */}
                <div className="bg-[#FAF9F6] dark:bg-[#121212] p-3 border-l-2 border-[#9A8C73] text-xs font-serif italic text-[#1D1D1D]/80 dark:text-white/80 mb-4">
                  "{joe.quote}"
                </div>

                {/* Specialties */}
                <div className="space-y-1.5 pt-3 border-t border-[#1D1D1D]/10 dark:border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1D]/50 dark:text-white/50 font-bold block">
                    Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {joe.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-black/5 dark:bg-white/5 px-2 py-0.5 border border-[#1D1D1D]/10 dark:border-white/10 text-[#1D1D1D]/80 dark:text-white/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Roya (Senior Stylist) */}
          <div className="flex flex-col gap-16 md:pt-32">
            {/* Craftsman 2 - Roya */}
            <div
              className="group relative w-full max-w-lg ml-auto cursor-pointer bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 p-6 sm:p-8 hover:border-[#9A8C73] transition-all duration-300 shadow-sm"
              onClick={() => onSelectStylist(roya)}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0] dark:bg-[#1A1A1A] mb-6 relative border border-[#1D1D1D]/10 dark:border-white/10">
                <img
                  src={roya.image}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                  alt={roya.name}
                />
                <div className="absolute top-4 left-4 bg-[#1D1D1D]/90 dark:bg-black/90 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border border-white/10">
                  {roya.experienceBadge}
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#9A8C73] text-white flex items-center justify-center shadow-lg">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-serif text-3xl text-[#1D1D1D] dark:text-[#FAF9F6] group-hover:text-[#9A8C73] transition-colors font-normal">
                    {roya.name}
                  </h3>
                  <span className="text-xs text-[#9A8C73] font-mono font-medium">Stylist</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A8C73] font-semibold mb-3">
                  {roya.role}
                </p>
                <p className="text-xs sm:text-sm text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed font-normal mb-4">
                  {roya.bio}
                </p>

                {/* Quote */}
                <div className="bg-[#FAF9F6] dark:bg-[#121212] p-3 border-l-2 border-[#9A8C73] text-xs font-serif italic text-[#1D1D1D]/80 dark:text-white/80 mb-4">
                  "{roya.quote}"
                </div>

                {/* Specialties */}
                <div className="space-y-1.5 pt-3 border-t border-[#1D1D1D]/10 dark:border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1D]/50 dark:text-white/50 font-bold block">
                    Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {roya.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-black/5 dark:bg-white/5 px-2 py-0.5 border border-[#1D1D1D]/10 dark:border-white/10 text-[#1D1D1D]/80 dark:text-white/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
