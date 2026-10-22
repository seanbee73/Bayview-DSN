import React, { useState } from 'react';
import { Sparkles, MessageSquare, Scissors } from 'lucide-react';

interface GeminiChatFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const GeminiChatFloatingButton: React.FC<GeminiChatFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  const [hovered, setHovered] = useState(false);

  if (isOpen) return null;

  return (
    <aside
      aria-label="Salon AI Concierge"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-fade-in"
    >
      {/* Expanded Pill Tag on Hover / Desktop view */}
      <div
        className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#18181b]/95 border border-amber-500/30 text-stone-200 text-xs shadow-xl backdrop-blur-md transition-all duration-300 ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-90 translate-x-1'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-serif tracking-wide text-amber-400 font-semibold">
          AI Style Concierge
        </span>
        <span className="text-stone-400 text-[11px]">· Master Barber Consultation</span>
      </div>

      {/* Main Circular Floating Button */}
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Open Gemini Salon Chatbot"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-stone-950 shadow-2xl flex items-center justify-center border-2 border-amber-300/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/30"
      >
        {/* Glow effect */}
        <span className="absolute -inset-1 rounded-full bg-amber-500/30 blur-md group-hover:bg-amber-400/40 transition-all -z-10" />

        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1.5 -right-1.5 animate-bounce" />
        </div>
      </button>
    </aside>
  );
};
