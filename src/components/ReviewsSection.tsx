import React, { useState } from 'react';
import { Star, CheckCircle, Quote, ThumbsUp, Filter } from 'lucide-react';
import { REVIEWS_DATA } from '../data/salonData';

export const ReviewsSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredReviews = selectedTag === 'All'
    ? REVIEWS_DATA.reviews
    : REVIEWS_DATA.reviews.filter((r) => r.highlightTags.includes(selectedTag));

  return (
    <section id="reviews" className="py-24 border-b border-[#1D1D1D]/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#121212] fade-in transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold mb-3">
              <span>{REVIEWS_DATA.tag}</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#1D1D1D] dark:text-[#FAF9F6] font-normal tracking-tight">
              {REVIEWS_DATA.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-sm text-[#1D1D1D] dark:text-white">
                {REVIEWS_DATA.score}
              </span>
              <span className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                ({REVIEWS_DATA.reviewCount})
              </span>
              <span className="text-xs text-[#9A8C73]">·</span>
              <span className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                Bayview-Cummer Shopping Centre, North York
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {REVIEWS_DATA.badges.map((b, i) => (
              <span
                key={i}
                className="bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 px-3 py-1.5 text-xs text-[#1D1D1D] dark:text-white flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle size={12} className="text-[#9A8C73]" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          <span className="text-xs text-[#1D1D1D]/50 dark:text-white/50 flex items-center gap-1.5 mr-2 font-medium">
            <Filter size={12} /> Filter:
          </span>
          {REVIEWS_DATA.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all rounded-none cursor-pointer ${
                selectedTag === cat
                  ? 'bg-[#1D1D1D] dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-[#1A1A1A] border border-[#1D1D1D]/10 dark:border-white/10 text-[#1D1D1D]/70 dark:text-white/70 hover:border-[#9A8C73]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#9A8C73] transition-colors shadow-sm"
            >
              <div>
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#1D1D1D]/40 dark:text-white/40 font-mono">
                    {review.date}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#1D1D1D]/80 dark:text-white/80 leading-relaxed mb-6 font-normal">
                  "{review.content}"
                </p>
              </div>

              <div>
                {/* Highlight Tags */}
                <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-[#1D1D1D]/5 dark:border-white/5">
                  {review.highlightTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#FAF9F6] dark:bg-[#121212] px-2 py-0.5 text-[#9A8C73] border border-[#1D1D1D]/5 dark:border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1D1D1D]/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#9A8C73]/20 text-[#9A8C73] font-bold text-xs flex items-center justify-center">
                      {review.author[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1D1D1D] dark:text-white">
                        {review.author}
                      </h4>
                      <p className="text-[10px] text-[#1D1D1D]/50 dark:text-white/50">
                        {review.reviewerBadge}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle size={12} /> Google Verified
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
