import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Phone,
  Calendar,
  Send,
  RefreshCw,
  SlidersHorizontal,
  Info,
  Radio,
  Check,
  AlertCircle,
} from 'lucide-react';
import { LiveVoiceSession } from '../utils/audioStreamer';
import { BRAND_DATA } from '../data/salonData';

interface TranscriptItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

interface VoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

const VOICES = [
  { id: 'Zephyr', label: 'Zephyr', description: 'Warm & Professional (Recommended)' },
  { id: 'Puck', label: 'Puck', description: 'Enthusiastic & Lively' },
  { id: 'Kore', label: 'Kore', description: 'Gentle & Poised' },
  { id: 'Fenrir', label: 'Fenrir', description: 'Deep & Resonant' },
  { id: 'Charon', label: 'Charon', description: 'Calm & Classic' },
];

const SUGGESTIONS = [
  'What haircut fits an oval face shape?',
  "Tell me about Master Barber Joe's scissor craft",
  "What are Roya's balayage & color prices?",
  'Where do I park at Bayview & Cummer?',
  'Can I book a same-day appointment?',
];

export const VoiceConversationModal: React.FC<VoiceConversationModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [sessionStatus, setSessionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'
  >('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasMic, setHasMic] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [aiAudioLevel, setAiAudioLevel] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const sessionRef = useRef<LiveVoiceSession | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Connect when modal opens
  useEffect(() => {
    if (isOpen) {
      startSession(selectedVoice);
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  const startSession = async (voiceName: string) => {
    stopSession();
    setErrorMessage(null);
    setMicNotice(null);

    const session = new LiveVoiceSession({
      onStatusChange: (status) => {
        setSessionStatus(status);
        if (status === 'connected' || status === 'listening') {
          setErrorMessage(null);
        }
      },
      onTranscript: ({ role, text }) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setTranscripts((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            role,
            text,
            time,
          },
        ]);
      },
      onAudioLevel: (userLvl, aiLvl) => {
        setUserAudioLevel(userLvl);
        setAiAudioLevel(aiLvl);
      },
      onMicStatusChange: (enabled, reason) => {
        setHasMic(enabled);
        if (!enabled && reason) {
          setMicNotice(reason);
        } else {
          setMicNotice(null);
        }
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onInterrupted: () => {
        // AI speech interrupted by user
      },
    });

    sessionRef.current = session;
    await session.connect(voiceName);
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    setSessionStatus('disconnected');
    setHasMic(false);
    setUserAudioLevel(0);
    setAiAudioLevel(0);
  };

  const handleToggleMute = () => {
    if (sessionRef.current) {
      const muted = sessionRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleRequestMic = async () => {
    if (sessionRef.current) {
      const success = await sessionRef.current.requestMicrophone();
      if (!success) {
        setMicNotice(
          'Microphone permission was not granted in this browser context. You can type or tap suggestions below and listen to real-time voice responses.'
        );
      }
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setShowVoiceSettings(false);
    startSession(voiceId);
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;

    if (sessionRef.current && sessionStatus !== 'disconnected' && sessionStatus !== 'error') {
      sessionRef.current.resumeAudioPlayback();
      sessionRef.current.sendTextMessage(textInput.trim());
      setTextInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (sessionRef.current && sessionStatus !== 'disconnected' && sessionStatus !== 'error') {
      sessionRef.current.resumeAudioPlayback();
      sessionRef.current.sendTextMessage(suggestion);
    } else {
      setTextInput(suggestion);
    }
  };

  if (!isOpen) return null;

  const currentLevel = sessionStatus === 'speaking' ? aiAudioLevel : userAudioLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] dark:bg-[#161616] text-[#1D1D1D] dark:text-[#FAF9F6] border border-[#1D1D1D]/20 dark:border-white/15 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1D1D1D]/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 bg-[#9A8C73] text-white">
              <Sparkles size={18} />
              {(sessionStatus === 'listening' || (sessionStatus === 'connected' && hasMic)) && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
              {sessionStatus === 'speaking' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium leading-none">Bayview Live Voice</h3>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#9A8C73]/15 text-[#9A8C73] dark:text-[#C4B7A6] font-mono font-bold">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Real-time conversational concierge for Master Barber Joe & Roya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              title="Voice Settings"
              className={`p-2 transition-colors border ${
                showVoiceSettings
                  ? 'border-[#9A8C73] text-[#9A8C73] bg-[#9A8C73]/10'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close voice modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Voice Selector Drawer (collapsible) */}
        {showVoiceSettings && (
          <div className="px-5 py-3 bg-[#F0EFEA] dark:bg-[#1E1E1E] border-b border-[#1D1D1D]/10 dark:border-white/10 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-neutral-500 dark:text-neutral-400">
                Select Gemini Voice Persona
              </span>
              <span className="text-[10px] text-neutral-400">
                Changes take effect immediately
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVoiceChange(v.id)}
                  className={`flex items-start justify-between p-2.5 text-left border transition-all ${
                    selectedVoice === v.id
                      ? 'border-[#9A8C73] bg-white dark:bg-[#252525] shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      {v.label}
                      {selectedVoice === v.id && <Check size={12} className="text-[#9A8C73]" />}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                      {v.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Audio Visualizer Stage */}
        <div className="relative px-6 py-6 bg-gradient-to-b from-[#FAF9F6] to-[#F2EFE9] dark:from-[#181818] dark:to-[#121212] border-b border-[#1D1D1D]/10 dark:border-white/10 flex flex-col items-center justify-center">
          
          {/* Status Capsule */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 backdrop-blur-xs text-xs font-sans">
            {sessionStatus === 'connecting' && (
              <>
                <RefreshCw size={12} className="animate-spin text-[#9A8C73]" />
                <span className="text-neutral-600 dark:text-neutral-300">Connecting to Live API...</span>
              </>
            )}
            {sessionStatus === 'connected' && !hasMic && (
              <>
                <Radio size={12} className="text-emerald-500 animate-pulse" />
                <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                  Live Voice Active · Ready to Converse
                </span>
              </>
            )}
            {sessionStatus === 'connected' && hasMic && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Microphone Ready</span>
              </>
            )}
            {sessionStatus === 'listening' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {isMuted ? 'Microphone Muted' : 'Listening... Speak naturally'}
                </span>
              </>
            )}
            {sessionStatus === 'speaking' && (
              <>
                <Volume2 size={13} className="text-amber-500 animate-bounce" />
                <span className="text-amber-700 dark:text-amber-300 font-medium">
                  Concierge Speaking ({selectedVoice})
                </span>
              </>
            )}
            {sessionStatus === 'error' && (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-red-600 dark:text-red-400 font-medium">Session Error</span>
              </>
            )}
            {sessionStatus === 'disconnected' && (
              <>
                <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                <span className="text-neutral-500">Session Paused</span>
              </>
            )}
          </div>

          {/* Interactive Sound Wave Canvas Bars */}
          <div className="w-full max-w-md h-20 flex items-center justify-center gap-1.5 px-4">
            {Array.from({ length: 24 }).map((_, i) => {
              const distanceFromCenter = Math.abs(i - 11.5) / 12;
              const scaleFactor = 1 - distanceFromCenter * 0.6;
              const baseHeight = 8;
              const dynamicHeight =
                sessionStatus === 'listening' || sessionStatus === 'speaking'
                  ? Math.max(baseHeight, Math.min(68, (currentLevel * scaleFactor * (1.2 + Math.sin(i * 0.8) * 0.4))))
                  : baseHeight;

              const isUser = sessionStatus === 'listening';
              const isAi = sessionStatus === 'speaking';

              return (
                <div
                  key={i}
                  className="w-1.5 transition-all duration-75 rounded-full"
                  style={{
                    height: `${dynamicHeight}px`,
                    backgroundColor: isAi
                      ? '#9A8C73'
                      : isUser
                      ? isMuted
                        ? '#A3A3A3'
                        : '#10B981'
                      : '#D4D4D4',
                    opacity: dynamicHeight > baseHeight ? 1 : 0.4,
                  }}
                />
              );
            })}
          </div>

          {/* Interactive Action Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {/* Mute/Unmute if mic active */}
            {hasMic && (
              <button
                onClick={handleToggleMute}
                disabled={sessionStatus === 'disconnected' || sessionStatus === 'error'}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                className={`p-3 border transition-all ${
                  isMuted
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}

            {/* If mic not active, show Enable Mic button */}
            {!hasMic && sessionStatus !== 'disconnected' && sessionStatus !== 'error' && (
              <button
                onClick={handleRequestMic}
                className="flex items-center gap-2 border border-[#9A8C73] text-[#9A8C73] hover:bg-[#9A8C73] hover:text-white px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Mic size={15} />
                <span>Enable Mic</span>
              </button>
            )}

            {/* Main Connect / Reconnect Button */}
            {sessionStatus === 'disconnected' || sessionStatus === 'error' ? (
              <button
                onClick={() => startSession(selectedVoice)}
                className="flex items-center gap-2 bg-[#9A8C73] hover:bg-[#83765F] text-white px-6 py-3 font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-md active:scale-95"
              >
                <RefreshCw size={15} />
                <span>Start Live Voice</span>
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="flex items-center gap-2 bg-[#1D1D1D] dark:bg-white text-white dark:text-[#1D1D1D] hover:bg-red-700 dark:hover:bg-red-600 hover:text-white px-6 py-3 font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-md active:scale-95"
              >
                <VolumeX size={15} />
                <span>End Conversation</span>
              </button>
            )}

            {/* Quick Book Button */}
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              title="Book Chair Now"
              className="p-3 border border-[#9A8C73] text-[#9A8C73] hover:bg-[#9A8C73] hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Book Chair</span>
            </button>
          </div>

          {/* Polite Notice if Mic is restricted */}
          {micNotice && (
            <div className="mt-3 px-3 py-1.5 bg-[#9A8C73]/10 border border-[#9A8C73]/30 text-neutral-700 dark:text-neutral-300 text-[11px] text-center max-w-md flex items-center gap-2">
              <Info size={14} className="text-[#9A8C73] shrink-0" />
              <span>{micNotice}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center max-w-md flex items-center justify-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Conversation Transcript Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 min-h-[160px] max-h-[260px] bg-white/50 dark:bg-[#151515]">
          {transcripts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-6 text-neutral-400">
              <Info size={24} className="mb-2 text-[#9A8C73]/70" />
              <p className="text-xs max-w-sm">
                Say hello or ask Joe & Roya anything about haircuts, beard trims, balayage, or salon appointments.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="text-[11px] px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#9A8C73] hover:text-white transition-colors border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  >
                    "{item}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            transcripts.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                  <span>{t.role === 'user' ? 'You' : `Bayview Concierge (${selectedVoice})`}</span>
                  <span>·</span>
                  <span>{t.time}</span>
                </div>
                <div
                  className={`p-3 text-xs leading-relaxed max-w-[85%] ${
                    t.role === 'user'
                      ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                      : 'bg-[#F2EFE9] dark:bg-[#222222] text-[#1D1D1D] dark:text-[#FAF9F6] border border-[#1D1D1D]/10 dark:border-white/10'
                  }`}
                >
                  {t.text}
                </div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#FAF9F6] dark:bg-[#181818] border-t border-[#1D1D1D]/10 dark:border-white/10">
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask Joe & Roya anything (live voice audio responds)..."
              className="flex-1 bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs focus:outline-none focus:border-[#9A8C73] text-[#1D1D1D] dark:text-[#FAF9F6]"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || sessionStatus === 'disconnected'}
              className="bg-[#9A8C73] text-white px-4 py-2 text-xs uppercase font-bold tracking-wider hover:bg-[#83765F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={14} />
              <span>Ask & Hear</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-sans">
            <span>Floor 1 · Bayview-Cummer Shopping Centre</span>
            <a href={BRAND_DATA.phoneTel} className="flex items-center gap-1 text-[#9A8C73] hover:underline">
              <Phone size={10} />
              <span>{BRAND_DATA.phone}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
