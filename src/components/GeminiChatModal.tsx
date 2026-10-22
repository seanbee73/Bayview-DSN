import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Scissors,
  User,
  Zap,
  Brain,
  Trash2,
  Phone,
  Calendar,
  ChevronDown,
  Info,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export type ChatRole = 'concierge' | 'barber' | 'stylist';
export type GeminiModel = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  persona?: ChatRole;
  modelUsed?: string;
  isError?: boolean;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onBookWithStylist?: (stylistId: string) => void;
}

const PERSONA_DETAILS: Record<
  ChatRole,
  {
    name: string;
    title: string;
    badge: string;
    avatar: string;
    welcome: string;
    starterPrompts: string[];
  }
> = {
  concierge: {
    name: 'Salon Concierge',
    title: 'Floor 1 Hostess & Coordinator',
    badge: 'Guest Relations',
    avatar: '🛎️',
    welcome:
      "Welcome to Bayview Mall Creative Hair Dsn! I'm your digital concierge. I can help with service details, pricing, appointment booking, or directions & parking at Bayview-Cummer Shopping Centre.",
    starterPrompts: [
      'What are your hours and parking instructions?',
      'How does the guaranteed on-time appointment policy work?',
      "What services are offered for men, women, and seniors?",
      'Help me book an appointment with Joe or Roya',
    ],
  },
  barber: {
    name: 'Master Barber Joe',
    title: '40+ Years Italian Barber Craft',
    badge: 'Master Barber',
    avatar: '💈',
    welcome:
      "Buongiorno! I'm Joe. After 40 years behind the chair, I believe great hair starts with feeling the head shape, bone structure, and growth cowlicks before scissors touch hair. Ask me about scissor cuts, head contouring, or beard lines.",
    starterPrompts: [
      'How does your pre-cut skull assessment work?',
      'What haircut is best for my head shape & cowlicks?',
      'Why are scissor cuts superior to buzzers for lasting shape?',
      'Tell me about the traditional neck shave & beard sculpt',
    ],
  },
  stylist: {
    name: 'Senior Stylist Roya',
    title: 'Creative Color & Texture Specialist',
    badge: 'Senior Stylist',
    avatar: '✂️',
    welcome:
      "Hello and welcome! I'm Roya. I love helping clients find their signature shape with soft face-framing layers, dimensional color, and bouncy, long-lasting blowouts. What hair style are you dreaming of today?",
    starterPrompts: [
      'What face-framing layers suit my face shape?',
      'How can I get more volume and dimension in fine hair?',
      'Tell me about dimensional color & highlights consultations',
      'What is the wash and deep conditioning treatment?',
    ],
  },
};

const MODEL_CONFIGS: Record<
  GeminiModel,
  { label: string; tag: string; description: string; icon: React.ReactNode }
> = {
  'gemini-3.8-flash': {
    label: 'Standard',
    tag: 'gemini-3.8-flash',
    description: 'Balanced for in-depth style consultations and natural conversation (Recommended).',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
  },
  'gemini-3.1-flash-lite': {
    label: 'Fast',
    tag: 'gemini-3.1-flash-lite',
    description: 'Optimized for instant answers, store hours, parking, and quick pricing lookups.',
    icon: <Zap className="w-3.5 h-3.5 text-sky-400" />,
  },
  'gemini-4-argon': {
    label: 'Deep Analysis',
    tag: 'gemini-4-argon',
    description: 'High-reasoning engine for complex head contour geometry & multi-step advice.',
    icon: <Brain className="w-3.5 h-3.5 text-purple-400" />,
  },
};

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onBookWithStylist,
}) => {
  const [activePersona, setActivePersona] = useState<ChatRole>('concierge');
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.8-flash');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize messages with persistent storage or welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_gemini_messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore parsing error
        }
      }
    }
    return [
      {
        id: 'msg-init',
        role: 'model',
        text: PERSONA_DETAILS.concierge.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: 'concierge',
        modelUsed: 'gemini-3.8-flash',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bmch_gemini_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handlePersonaChange = (newPersona: ChatRole) => {
    setActivePersona(newPersona);
    // Add a persona switch system welcome if last message wasn't from this persona
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.persona !== newPersona) {
      const switchMessage: ChatMessage = {
        id: `switch-${Date.now()}`,
        role: 'model',
        text: PERSONA_DETAILS[newPersona].welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: newPersona,
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, switchMessage]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset this conversation?')) {
      const resetMessage: ChatMessage = {
        id: `reset-${Date.now()}`,
        role: 'model',
        text: PERSONA_DETAILS[activePersona].welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: activePersona,
        modelUsed: selectedModel,
      };
      setMessages([resetMessage]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history excluding errors or initial welcome if preferred
      const historyPayload = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          persona: activePersona,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const modelReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || 'I apologize, but I could not generate a response at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: activePersona,
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, modelReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text:
          "I'm experiencing a brief connectivity hiccup connecting to our salon AI system. Master Barber Joe and Roya are also readily available by phone at (416) 221-2321, or you can submit an on-time chair reservation directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: activePersona,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[820px] flex flex-col bg-[#121214] text-stone-100 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-[#161619] border-b border-stone-800 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
                {PERSONA_DETAILS[activePersona].avatar}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#161619]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-stone-100 text-base sm:text-lg tracking-wide">
                    {PERSONA_DETAILS[activePersona].name}
                  </h3>
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                    {PERSONA_DETAILS[activePersona].badge}
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-sans">
                  {PERSONA_DETAILS[activePersona].title} · Bayview-Cummer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Clear History Button */}
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 rounded-lg transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 rounded-lg transition-colors"
                aria-label="Close consultation modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Persona Tabs & Model Selector */}
          <div className="mt-3.5 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            {/* Persona Switcher */}
            <div className="flex items-center p-1 bg-stone-900/90 rounded-xl border border-stone-800 gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => handlePersonaChange('concierge')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePersona === 'concierge'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <span>🛎️</span>
                <span>Concierge</span>
              </button>
              <button
                type="button"
                onClick={() => handlePersonaChange('barber')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePersona === 'barber'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <span>💈</span>
                <span>Master Barber Joe</span>
              </button>
              <button
                type="button"
                onClick={() => handlePersonaChange('stylist')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePersona === 'stylist'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <span>✂️</span>
                <span>Stylist Roya</span>
              </button>
            </div>

            {/* Model & Reasoning Engine Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 hover:text-stone-100 transition-colors w-full sm:w-auto justify-between"
                title="Select Gemini Engine"
              >
                <div className="flex items-center gap-1.5">
                  {MODEL_CONFIGS[selectedModel].icon}
                  <span className="font-medium text-[11px]">
                    Engine: {MODEL_CONFIGS[selectedModel].label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {modelDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#1a1a1e] border border-stone-700/80 rounded-xl shadow-xl p-1.5 z-50">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Select Gemini Reasoning Model
                  </div>
                  {(Object.keys(MODEL_CONFIGS) as GeminiModel[]).map((mKey) => (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => {
                        setSelectedModel(mKey);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                        selectedModel === mKey
                          ? 'bg-amber-500/15 border border-amber-500/40 text-stone-100'
                          : 'hover:bg-stone-800/60 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1.5">
                          {MODEL_CONFIGS[mKey].icon}
                          {MODEL_CONFIGS[mKey].label}
                        </span>
                        <code className="text-[10px] text-stone-400 font-mono">
                          {MODEL_CONFIGS[mKey].tag}
                        </code>
                      </div>
                      <span className="text-[11px] text-stone-400 leading-tight">
                        {MODEL_CONFIGS[mKey].description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans bg-[#0f0f11]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser ? (
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {msg.persona ? PERSONA_DETAILS[msg.persona].avatar : '✂️'}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-stone-300 font-semibold">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                      : msg.isError
                      ? 'bg-red-950/40 border border-red-800/50 text-red-200 rounded-tl-none'
                      : 'bg-[#18181b] border border-stone-800 text-stone-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div
                    className={`mt-2 flex items-center gap-2 text-[10px] ${
                      isUser ? 'text-stone-900/70 justify-end' : 'text-stone-500 justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.modelUsed && (
                      <span className="flex items-center gap-1 font-mono text-[9px] bg-stone-900/60 px-1.5 py-0.5 rounded border border-stone-800 text-stone-400">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                {PERSONA_DETAILS[activePersona].avatar}
              </div>
              <div className="bg-[#18181b] border border-stone-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-stone-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>
                  Consulting {PERSONA_DETAILS[activePersona].name} with {selectedModel}...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Starter Chips (if not currently loading) */}
        {!isLoading && messages.length <= 4 && (
          <div className="px-4 py-2 bg-[#121214] border-t border-stone-850 overflow-x-auto flex gap-2 no-scrollbar">
            {PERSONA_DETAILS[activePersona].starterPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] text-stone-300 hover:text-amber-400 bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Booking Action Bar */}
        <div className="px-4 py-2 bg-[#141417] border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Guaranteed On-Time Chairs · Floor 1 Plaza</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:4162212321"
              className="inline-flex items-center gap-1 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>(416) 221-2321</span>
            </a>
            <span className="text-stone-700">·</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#161619] border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${PERSONA_DETAILS[activePersona].name} about cuts, head shape, styling...`}
                disabled={isLoading}
                className="w-full bg-stone-900/90 text-stone-100 placeholder-stone-500 text-sm rounded-xl px-4 py-3 border border-stone-700/80 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-semibold px-4 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs tracking-wider uppercase">Send</span>
            </button>
          </form>

          <p className="mt-2 text-[10px] text-center text-stone-500">
            Powered by Gemini AI · Conversational advice for Bayview Mall Creative Hair Dsn
          </p>
        </div>
      </div>
    </div>
  );
};
