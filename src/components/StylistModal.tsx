import React from 'react';
import { X, ArrowRight, Sparkles, Phone, Scissors, CheckCircle } from 'lucide-react';
import { Stylist } from '../types';
import { BRAND_DATA } from '../data/salonData';

interface StylistModalProps {
  stylist: Stylist | null;
  onClose: () => void;
  onBookWithStylist: (stylist: Stylist) => void;
}

export const StylistModal: React.FC<StylistModalProps> = ({
  stylist,
  onClose,
  onBookWithStylist,
}) => {
  if (!stylist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0D0D0D] text-white border border-white/15 w-full max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar relative rounded-none shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/70 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close artist profile modal"
        >
          <X size={20} />
        </button>

        {/* Artist Image */}
        <div className="relative h-[340px] md:h-full bg-[#111]">
          <img
            src={stylist.image}
            alt={stylist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#1D1D1D]/90 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border border-white/15">
            {stylist.experienceBadge}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#9A8C73] mb-2">
              <Scissors size={14} />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                Bayview Mall Craftsman
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-[#FAF9F6] font-normal mb-1">
              {stylist.name}
            </h2>
            <p className="text-[#9A8C73] text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              {stylist.role}
            </p>

            <p className="text-white/75 text-sm font-normal leading-relaxed mb-4">
              {stylist.bio}
            </p>

            {/* Quote */}
            <div className="bg-white/5 border-l-2 border-[#9A8C73] p-3 mb-6">
              <p className="text-xs font-serif italic text-white/90">
                "{stylist.quote}"
              </p>
            </div>

            {/* Specialties */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-semibold">
                Signature Expertise
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stylist.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono bg-white/5 border border-white/15 px-2.5 py-1 text-white/90"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                onBookWithStylist(stylist);
              }}
              className="w-full bg-[#FAF9F6] text-[#1D1D1D] font-bold text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-[#9A8C73] hover:text-white transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              Request Chair with {stylist.name.split(' ')[0]} <ArrowRight size={14} />
            </button>
            <a
              href={BRAND_DATA.phoneTel}
              className="text-center text-xs text-white/70 hover:text-[#9A8C73] transition-colors flex items-center justify-center gap-2 py-1 uppercase tracking-[0.15em] font-medium"
            >
              <Phone size={12} /> Call Direct {BRAND_DATA.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
