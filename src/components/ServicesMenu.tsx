import React from 'react';
import { ArrowRight, Check, Phone, Sparkles } from 'lucide-react';
import { SERVICES_DATA, BRAND_DATA } from '../data/salonData';
import { SignatureService, AdditionalService } from '../types';

interface ServicesMenuProps {
  onSelectService: (service: SignatureService | AdditionalService) => void;
  onOpenBooking: () => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({ onSelectService, onOpenBooking }) => {
  return (
    <section id="services" className="py-24 border-b border-[#1D1D1D]/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#121212] fade-in transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#9A8C73] text-[10px] tracking-[0.25em] uppercase font-semibold mb-4 block">
              {SERVICES_DATA.tag}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1D1D1D] dark:text-[#FAF9F6] leading-none tracking-tight font-normal">
              {SERVICES_DATA.title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-block bg-[#9A8C73]/15 text-[#9A8C73] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
              {SERVICES_DATA.subtitle}
            </span>
          </div>
        </div>

        {/* Signature Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SERVICES_DATA.signatureServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 flex flex-col justify-between group hover:border-[#9A8C73] dark:hover:border-[#9A8C73] transition-all duration-300 shadow-sm"
            >
              <div>
                {/* Service Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1D1D1D]/90 dark:bg-black/90 text-[#FAF9F6] text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border border-white/10">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-[#FAF9F6] font-normal group-hover:text-[#9A8C73] transition-colors">
                      {service.title}
                    </h3>
                    <span className="font-mono text-base font-bold text-[#9A8C73] whitespace-nowrap">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-xs font-serif italic text-[#9A8C73] mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#1D1D1D]/75 dark:text-white/75 leading-relaxed font-normal mb-6">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-4 border-t border-[#1D1D1D]/10 dark:border-white/10">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#1D1D1D]/70 dark:text-white/70">
                        <Check size={14} className="text-[#9A8C73] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full py-3 bg-[#FAF9F6] dark:bg-[#202020] text-[#1D1D1D] dark:text-white border border-[#1D1D1D]/10 dark:border-white/10 hover:bg-[#9A8C73] hover:text-white dark:hover:bg-[#9A8C73] dark:hover:text-white hover:border-[#9A8C73] text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Select & Book <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Grooming & Styling Services */}
        <div className="bg-white dark:bg-[#181818] border border-[#1D1D1D]/10 dark:border-white/10 p-8 sm:p-10 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D1D]/10 dark:border-white/10 pb-6 mb-6">
            <div>
              <span className="text-[#9A8C73] text-[10px] tracking-[0.2em] uppercase font-bold">
                Complementary Offerings
              </span>
              <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-[#FAF9F6] font-normal mt-1">
                Additional Services & Custom Requests
              </h3>
            </div>
            <span className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
              Combine with any signature cut or book separately
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_DATA.additionalServices.map((addon) => (
              <div
                key={addon.id}
                onClick={() => onSelectService(addon)}
                className="p-5 bg-[#FAF9F6] dark:bg-[#121212] border border-[#1D1D1D]/10 dark:border-white/10 hover:border-[#9A8C73] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-[#FAF9F6]">
                      {addon.name}
                    </h4>
                    <span className="font-mono text-sm font-bold text-[#9A8C73]">
                      {addon.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#1D1D1D]/70 dark:text-white/70 leading-relaxed font-normal">
                    {addon.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1D1D1D]/5 dark:border-white/5 flex justify-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9A8C73] flex items-center gap-1">
                    Book Service <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-in & Phone Notice Banner */}
        <div className="p-6 sm:p-8 bg-[#1D1D1D] dark:bg-black text-[#FAF9F6] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#9A8C73]">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Punctual & Accommodating</span>
            </div>
            <p className="text-sm text-white/80">
              Appointments receive dedicated 1-on-1 focus. Walk-ins are always welcomed subject to barber availability.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={BRAND_DATA.phoneTel}
              className="inline-flex items-center gap-2 bg-[#9A8C73] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-[#1D1D1D] transition-colors"
            >
              <Phone size={14} /> Call {BRAND_DATA.phone}
            </a>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:border-[#9A8C73] hover:text-[#9A8C73] transition-colors cursor-pointer"
            >
              Online Request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
