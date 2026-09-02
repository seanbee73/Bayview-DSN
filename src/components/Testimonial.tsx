import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { REVIEWS_DATA } from '../data/salonData';

export const Testimonial: React.FC = () => {
  return (
    <section className="dark:bg-[#141414] border-y border-[#1D1D1D]/10 dark:border-white/10 z-10 fade-in bg-[#FAF9F6] w-full py-28 px-6 relative transition-colors duration-300 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        {/* Star Rating */}
        <div className="flex text-[#9A8C73] mb-6 gap-x-1.5 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={22} fill="#9A8C73" stroke="none" />
          ))}
        </div>

        {/* Featured Quote */}
        <h2 className="reveal-text font-serif text-3xl sm:text-4xl md:text-5xl leading-tight font-normal text-[#1D1D1D] dark:text-[#FAF9F6] tracking-tight mb-8">
          {REVIEWS_DATA.featuredQuote}
        </h2>

        {/* Author Details */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white">
              {REVIEWS_DATA.featuredAuthor}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5">
              <CheckCircle size={10} /> Verified
            </span>
          </div>
          <span className="text-xs text-[#9A8C73] uppercase tracking-[0.2em] mt-1 font-medium">
            {REVIEWS_DATA.featuredBadge}
          </span>
        </div>
      </div>
    </section>
  );
};
