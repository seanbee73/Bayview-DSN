import React from 'react';
import { UserCheck, Scissors, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { BRAND_DATA, HERITAGE_DATA } from '../data/salonData';

export const ConsultationProcess: React.FC = () => {
  return (
    <section className="py-24 border-b border-[#1D1D1D]/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#121212] fade-in transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text Content (Left) */}
          <div className="order-2 lg:order-1">
            <span className="text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold mb-4 block">
              The Barber Standard
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-6 text-[#1D1D1D] dark:text-[#FAF9F6] font-normal">
              Head Contour <br /><span className="italic font-light text-[#9A8C73]">Analysis & Shape.</span>
            </h2>
            <p className="text-sm md:text-base text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed mb-8 max-w-lg font-normal">
              Unlike generic clippers-only quick cuts, Master Barber Joe assesses your natural hair growth direction, cowlicks, head bone structure, and facial proportions before picking up shears.
            </p>

            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 border border-[#1D1D1D]/15 dark:border-white/15 flex items-center justify-center text-[#9A8C73] group-hover:bg-[#9A8C73] group-hover:text-white transition-colors flex-shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-[#FAF9F6] mb-1 font-normal">
                    Pre-Cut Skull & Growth Assessment
                  </h4>
                  <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60 font-normal leading-relaxed">
                    Checking the scalp topology and natural crown cowlicks so the hair sits perfectly as it grows out over 4–6 weeks.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 border border-[#1D1D1D]/15 dark:border-white/15 flex items-center justify-center text-[#9A8C73] group-hover:bg-[#9A8C73] group-hover:text-white transition-colors flex-shrink-0">
                  <Scissors size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-[#FAF9F6] mb-1 font-normal">
                    Italian Scissor-Over-Comb Discipline
                  </h4>
                  <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60 font-normal leading-relaxed">
                    Precise micro-tapering that blends seamlessly without blunt harsh clipper lines.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 border border-[#1D1D1D]/15 dark:border-white/15 flex items-center justify-center text-[#9A8C73] group-hover:bg-[#9A8C73] group-hover:text-white transition-colors flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-[#FAF9F6] mb-1 font-normal">
                    Punctual, Unhurried 1-on-1 Service
                  </h4>
                  <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60 font-normal leading-relaxed">
                    You sit in the chair at your reserved time. No long lobby queues or rushed 10-minute turnaround.
                  </p>
                </div>
              </li>
            </ul>

            <a
              href="#craftsmen"
              className="inline-flex items-center gap-2 border-b border-[#1D1D1D] dark:border-white pb-1 text-xs uppercase tracking-[0.2em] font-semibold hover:text-[#9A8C73] hover:border-[#9A8C73] dark:hover:text-[#9A8C73] dark:hover:border-[#9A8C73] transition-colors"
            >
              Meet Joe & Roya <ArrowRight size={14} />
            </a>
          </div>

          {/* Image Content (Right) */}
          <div className="order-1 lg:order-2 relative h-[450px] lg:h-[600px] overflow-hidden group border border-[#1D1D1D]/10 dark:border-white/10">
            <img
              src="https://ik.imagekit.io/kevfun/IMG-20260915-WA4829.jpg"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Italian Barber Scissor Precision at Bayview Mall Creative Hair Dsn"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="bg-[#1D1D1D]/85 backdrop-blur-md border border-white/15 p-5 max-w-sm">
                <p className="text-xs text-[#FAF9F6] leading-relaxed font-serif italic mb-2">
                  "Joe is a true craftsman. He analyzed my head shape and gave me the best haircut of my life."
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A8C73] font-semibold block">
                  — Barat K., Verified Google Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
