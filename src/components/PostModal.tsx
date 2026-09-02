import React from 'react';
import { X, Calendar, User, Tag, Sparkles, Share2, Phone, Check } from 'lucide-react';
import { SalonPost } from '../types';
import { BRAND_DATA } from '../data/salonData';

interface PostModalProps {
  post: SalonPost | null;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, onClose, onOpenBooking }) => {
  const [copied, setCopied] = React.useState(false);

  if (!post) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#post-${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="bg-[#FAF9F6] dark:bg-[#141414] text-[#1D1D1D] dark:text-[#FAF9F6] w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#1D1D1D]/10 dark:border-white/10 shadow-2xl relative transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1D1D1D]">
            <img
              src={post.imageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2">
              <span className="bg-[#9A8C73] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1">
                {post.category}
              </span>
              {post.isPinned && (
                <span className="bg-white text-[#1D1D1D] text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-1 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#9A8C73]" /> Featured Story
                </span>
              )}
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#1D1D1D]/60 dark:text-white/60 border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-[#1D1D1D] dark:text-white">
                <User size={13} className="text-[#9A8C73]" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#9A8C73]" /> {post.date}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-[#9A8C73] hover:text-[#1D1D1D] dark:hover:text-white transition-colors cursor-pointer font-medium"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" /> Copied Link
                </>
              ) : (
                <>
                  <Share2 size={13} /> Share Story
                </>
              )}
            </button>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1D1D1D] dark:text-white font-normal leading-tight">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-[#9A8C73] font-serif italic border-l-2 border-[#9A8C73] pl-4 py-1 leading-relaxed">
              “{post.excerpt}”
            </p>
          )}

          {/* Content paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-[#1D1D1D]/80 dark:text-white/80 leading-relaxed">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <Tag size={13} className="text-[#9A8C73]" />
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-[#1D1D1D]/5 dark:bg-white/5 border border-[#1D1D1D]/10 dark:border-white/10 px-2.5 py-1 text-[#1D1D1D]/70 dark:text-white/70 tracking-wide font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Call to action footer */}
          <div className="mt-8 pt-6 border-t border-[#1D1D1D]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1D1D1D]/5 dark:bg-white/5 p-6">
            <div>
              <p className="font-serif text-base text-[#1D1D1D] dark:text-white">
                Visit Master Barber Joe & Roya
              </p>
              <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                Floor 1 · Bayview-Cummer Shopping Centre
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={BRAND_DATA.phoneTel}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-[#1D1D1D]/20 dark:border-white/20 text-[#1D1D1D] dark:text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-[#9A8C73] transition-colors"
              >
                <Phone size={13} /> {BRAND_DATA.phone}
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#9A8C73] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1D1D1D] dark:hover:bg-white dark:hover:text-[#1D1D1D] transition-colors cursor-pointer"
              >
                Book Chair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
