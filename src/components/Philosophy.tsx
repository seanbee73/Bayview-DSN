import React from 'react';
import { Scissors, UserCheck, Smile, Clock, Quote } from 'lucide-react';
import { HERITAGE_DATA } from '../data/salonData';

export const Philosophy: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'scissors':
        return <Scissors size={22} />;
      case 'userCheck':
        return <UserCheck size={22} />;
      case 'smile':
        return <Smile size={22} />;
      case 'clock':
      default:
        return <Clock size={22} />;
    }
  };

  return (
    <section id="heritage" className="py-24 border-b border-[#1D1D1D]/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#141414] fade-in transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Heading & Heritage Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold mb-4 block">
                {HERITAGE_DATA.tag}
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-6 text-[#1D1D1D] dark:text-[#FAF9F6] font-normal">
                Authentic Craft. <br />
                <span className="italic font-light text-[#9A8C73]">Personal Care.</span>
              </h2>
              <p className="text-sm md:text-base text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed font-normal mb-8">
                {HERITAGE_DATA.paragraph1}
              </p>
            </div>

            {/* Verified Quote Highlight */}
            <div className="bg-[#1D1D1D] dark:bg-[#1A1A1A] text-white p-6 sm:p-8 border border-white/10 relative">
              <Quote size={24} className="text-[#9A8C73] mb-3 opacity-80" />
              <p className="font-serif italic text-base sm:text-lg text-white/95 leading-relaxed mb-4">
                {HERITAGE_DATA.quote}
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10 font-sans">
                <span className="w-2 h-2 bg-[#9A8C73]"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6] font-semibold">
                  {HERITAGE_DATA.quoteAuthor}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
            {HERITAGE_DATA.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="group p-6 sm:p-8 bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 hover:border-[#9A8C73] dark:hover:border-[#9A8C73] transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 border border-[#1D1D1D]/15 dark:border-white/15 flex items-center justify-center mb-6 text-[#1D1D1D] dark:text-white group-hover:bg-[#9A8C73] group-hover:border-[#9A8C73] group-hover:text-white transition-colors">
                  {getIcon(pillar.iconName)}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl mb-3 text-[#1D1D1D] dark:text-[#FAF9F6] font-normal group-hover:text-[#9A8C73] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1D1D1D]/70 dark:text-white/70 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

