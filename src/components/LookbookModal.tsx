import React from 'react';
import { X, ArrowRight, Sparkles, Phone } from 'lucide-react';
import { LookbookItem } from '../types';
import { BRAND_DATA } from '../data/salonData';

interface LookbookModalProps {
  item: LookbookItem | null;
  onClose: () => void;
  onBookThisLook: (item: LookbookItem) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({ item, onClose, onBookThisLook }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0A0A0A] text-white border border-white/15 w-full max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar relative rounded-none shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/70 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close lookbook modal"
        >
          <X size={20} />
        </button>

        {/* Image Preview */}
        <div className="relative h-[320px] md:h-full bg-black">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#1D1D1D]/90 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border border-white/15">
            {item.category}
          </div>
        </div>

        {/* Information & Actions */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#9A8C73] mb-3">
              <Sparkles size={14} />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Style Archive</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-[#FAF9F6] font-normal mb-2">
              {item.title}
            </h2>
            <p className="text-[#9A8C73] text-xs uppercase tracking-[0.2em] font-semibold mb-5">
              {item.category}
            </p>

            <p className="text-white/75 text-sm font-normal leading-relaxed mb-6">
              {item.description}
            </p>

            <div className="space-y-3 pt-5 border-t border-white/10 text-xs text-white/60 font-normal">
              <div className="flex justify-between">
                <span>Technique</span>
                <span className="text-white/90 font-medium">{item.technique}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="text-white/90 font-medium">{item.maintenance}</span>
              </div>
              <div className="flex justify-between">
                <span>Suitability</span>
                <span className="text-white/90 font-medium">{item.suitability}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                onBookThisLook(item);
              }}
              className="w-full bg-[#FAF9F6] text-[#1D1D1D] font-bold text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-[#9A8C73] hover:text-white transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              Request Consultation On This Look <ArrowRight size={14} />
            </button>
            <a
              href={BRAND_DATA.phoneTel}
              className="text-center text-xs text-white/70 hover:text-[#9A8C73] transition-colors flex items-center justify-center gap-2 py-1 uppercase tracking-[0.15em] font-medium"
            >
              <Phone size={12} /> Or Call {BRAND_DATA.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
