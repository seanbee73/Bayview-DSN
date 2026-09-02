import React from 'react';
import { MapPin, ArrowRight, Phone, Star, CheckCircle } from 'lucide-react';
import { HERO_DATA, BRAND_DATA } from '../data/salonData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <header className="min-h-screen pt-28 md:pt-32 grid grid-cols-1 lg:grid-cols-12 border-b border-[#1D1D1D]/10 dark:border-white/10">
      {/* Text Content */}
      <div className="lg:col-span-7 flex flex-col sm:px-12 lg:px-20 dark:bg-[#141414] order-2 lg:order-1 bg-[#FAF9F6] pt-12 md:pt-16 pr-6 pb-16 pl-6 justify-center">
        {/* Trust Indicators / Plaza Location Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#9A8C73]/15 text-[#9A8C73] dark:text-[#C4B7A6] px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 bg-[#9A8C73] rounded-full animate-pulse"></span>
            {HERO_DATA.badge}
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#1D1D1D]/70 dark:text-white/70 font-sans">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold">{HERO_DATA.ratingScore}</span>
            <span className="text-xs text-[#1D1D1D]/50 dark:text-white/50">{HERO_DATA.reviewCountText}</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif leading-[0.95] font-normal tracking-tight mb-6 text-[#1D1D1D] dark:text-[#FAF9F6]">
          {HERO_DATA.headlinePrefix} <br className="hidden sm:inline" />
          <span className="italic font-light text-[#9A8C73]">{HERO_DATA.headlineAccent}</span>
        </h1>

        <p className="text-base md:text-lg text-[#1D1D1D]/80 dark:text-white/80 max-w-xl leading-relaxed font-normal mb-8">
          {HERO_DATA.description}
        </p>

        {/* 3 Key Stats */}
        <div className="grid grid-cols-3 gap-4 py-5 mb-8 border-y border-[#1D1D1D]/10 dark:border-white/10 max-w-xl font-sans">
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-[#1D1D1D] dark:text-[#FAF9F6]">
              {HERO_DATA.stat1Number}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#1D1D1D]/60 dark:text-white/60 font-semibold mt-1">
              {HERO_DATA.stat1Label}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-[#9A8C73] dark:text-[#C4B7A6]">
              {HERO_DATA.stat2Number}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#1D1D1D]/60 dark:text-white/60 font-semibold mt-1">
              {HERO_DATA.stat2Label}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-[#1D1D1D] dark:text-[#FAF9F6]">
              {HERO_DATA.stat3Number}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#1D1D1D]/60 dark:text-white/60 font-semibold mt-1">
              {HERO_DATA.stat3Label}
            </div>
          </div>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center font-sans" id="hero-cta">
          <button
            onClick={onOpenBooking}
            className="px-7 py-4 bg-[#1D1D1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#1D1D1D] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9A8C73] hover:text-white dark:hover:bg-[#9A8C73] dark:hover:text-white transition-colors flex items-center justify-center gap-2 rounded-none min-w-[160px] cursor-pointer"
          >
            Book Appointment <ArrowRight size={14} />
          </button>
          <a
            href={BRAND_DATA.phoneTel}
            className="px-7 py-4 border border-[#1D1D1D]/20 dark:border-white/20 text-[#1D1D1D] dark:text-white text-xs font-semibold tracking-[0.15em] uppercase hover:border-[#9A8C73] hover:text-[#9A8C73] transition-colors flex items-center justify-center gap-2 rounded-none"
          >
            <Phone size={14} className="text-[#9A8C73]" />
            <span>Call {BRAND_DATA.phone}</span>
          </a>
          <a
            href="#services"
            className="px-5 py-4 text-[#1D1D1D]/80 dark:text-white/80 text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#9A8C73] transition-colors flex items-center justify-center gap-1 rounded-none text-center"
          >
            Explore Services
          </a>
        </div>
      </div>

      {/* Hero Image */}
      <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full order-1 lg:order-2 border-l border-[#1D1D1D]/10 dark:border-white/10 overflow-hidden group">
        <img
          src={HERO_DATA.heroImage}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Traditional Italian Barber and Hair Styling at Bayview Mall Creative Hair Dsn"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-black/20 flex flex-col justify-end p-6 md:p-8">
          <div className="bg-[#1D1D1D]/85 backdrop-blur-md border border-white/15 p-4 rounded-none text-[#FAF9F6] shadow-xl max-w-sm">
            <div className="flex items-center gap-2 text-[#9A8C73] mb-1">
              <MapPin size={14} />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold">North York Landmark</span>
            </div>
            <p className="text-xs font-serif italic text-white/90">
              {BRAND_DATA.plazaLocation}
            </p>
            <p className="text-[11px] text-white/60 font-sans mt-1">
              {BRAND_DATA.appointmentNote}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

