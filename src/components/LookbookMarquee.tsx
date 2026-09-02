import React from 'react';
import { LOOKBOOK_DATA } from '../data/salonData';
import { LookbookItem } from '../types';

interface LookbookMarqueeProps {
  onSelectLook: (item: LookbookItem) => void;
}

export const LookbookMarquee: React.FC<LookbookMarqueeProps> = ({ onSelectLook }) => {
  return (
    <section
      className="dark:bg-[#121212] bg-[#FAF9F6] border-b border-[#1D1D1D]/10 dark:border-white/10 overflow-hidden fade-in py-24 transition-colors duration-300 font-sans"
      id="lookbook"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-end justify-between gap-4">
        <div>
          <span className="text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold mb-3 block">
            {LOOKBOOK_DATA.tag}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1D1D1D] dark:text-[#FAF9F6] leading-none tracking-tight font-normal">
            {LOOKBOOK_DATA.title}
          </h2>
        </div>
        <div className="flex items-center gap-4 opacity-70">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white font-medium">
            {LOOKBOOK_DATA.subtitle}
          </span>
          <div className="w-12 h-px bg-[#1D1D1D] dark:bg-white hidden sm:block"></div>
        </div>
      </div>

      <div className="relative w-full group">
        {/* Fade Gradients for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FAF9F6] dark:from-[#121212] to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FAF9F6] dark:from-[#121212] to-transparent z-10 pointer-events-none transition-colors duration-300"></div>

        {/* Marquee with hardcoded 50s linear infinite and duplicate items for seamless loop */}
        <div className="flex space-x-6 animate-marquee-50s w-max px-6 hover:[animation-play-state:paused] transition-all duration-700">
          {/* First Set */}
          {LOOKBOOK_DATA.items.map((item, index) => (
            <div
              key={`set1-${item.id}-${index}`}
              onClick={() => onSelectLook(item)}
              className="w-[280px] sm:w-[360px] md:w-[440px] h-[260px] sm:h-[320px] md:h-[360px] relative overflow-hidden group/card cursor-pointer flex-shrink-0 border border-[#1D1D1D]/10 dark:border-white/10"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700 group-hover/card:scale-105"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 p-5 md:p-6 translate-y-3 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                <span className="text-[#FAF9F6] text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1D1D1D]/90 backdrop-blur-md px-3.5 py-1.5 border border-white/10 inline-block">
                  {item.title}
                </span>
                <p className="text-[#FAF9F6]/90 text-xs font-serif italic mt-1.5 hidden sm:block">
                  {item.category}
                </p>
              </div>
            </div>
          ))}

          {/* Duplicate Set for Seamless 50s Marquee Loop */}
          {LOOKBOOK_DATA.items.map((item, index) => (
            <div
              key={`set2-${item.id}-${index}`}
              onClick={() => onSelectLook(item)}
              className="w-[280px] sm:w-[360px] md:w-[440px] h-[260px] sm:h-[320px] md:h-[360px] relative overflow-hidden group/card cursor-pointer flex-shrink-0 border border-[#1D1D1D]/10 dark:border-white/10"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700 group-hover/card:scale-105"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 p-5 md:p-6 translate-y-3 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                <span className="text-[#FAF9F6] text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1D1D1D]/90 backdrop-blur-md px-3.5 py-1.5 border border-white/10 inline-block">
                  {item.title}
                </span>
                <p className="text-[#FAF9F6]/90 text-xs font-serif italic mt-1.5 hidden sm:block">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
