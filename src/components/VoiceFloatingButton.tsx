import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

interface VoiceFloatingButtonProps {
  onClick: () => void;
}

export const VoiceFloatingButton: React.FC<VoiceFloatingButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      id="voice-concierge-fab"
      aria-label="Open Live Voice Concierge"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-[#1D1D1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#1D1D1D] pl-3.5 pr-4 py-3 shadow-2xl border border-white/20 dark:border-black/20 hover:bg-[#9A8C73] dark:hover:bg-[#9A8C73] hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <div className="relative flex items-center justify-center w-7 h-7 bg-[#9A8C73] text-white">
        <Mic size={16} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Voice Concierge
          </span>
          <Sparkles size={11} className="text-[#9A8C73] group-hover:text-white" />
        </div>
        <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 group-hover:text-white/80 font-mono mt-0.5">
          Gemini 3.8 Live
        </span>
      </div>
    </button>
  );
};
