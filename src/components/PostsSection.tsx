import React, { useState } from 'react';
import { Sparkles, Calendar, User, ArrowRight, Tag, PlusCircle, Bookmark, Newspaper } from 'lucide-react';
import { SalonPost } from '../types';

interface PostsSectionProps {
  posts: SalonPost[];
  onSelectPost: (post: SalonPost) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  onSelectPost,
  isAdmin,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const publishedPosts = posts.filter((p) => p.isPublished);

  const categories = [
    'All',
    'Announcement',
    'Style Showcase',
    'Barber Craft',
    'Shop News',
    'Holiday Hours',
  ];

  const filteredPosts =
    selectedCategory === 'All'
      ? publishedPosts
      : publishedPosts.filter((p) => p.category === selectedCategory);

  const pinnedPost = publishedPosts.find((p) => p.isPinned);
  const remainingPosts = pinnedPost
    ? filteredPosts.filter((p) => p.id !== pinnedPost.id)
    : filteredPosts;

  return (
    <section
      id="journal"
      className="py-24 bg-[#FAF9F6] dark:bg-[#141414] text-[#1D1D1D] dark:text-[#FAF9F6] border-b border-[#1D1D1D]/10 dark:border-white/10 transition-colors duration-300 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#9A8C73]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A8C73] font-semibold">
                Journal & Announcements
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1D1D1D] dark:text-white font-normal tracking-tight">
              Stories, Craft & Shop News
            </h2>
            <p className="text-sm text-[#1D1D1D]/60 dark:text-white/60 max-w-xl mt-3 font-normal">
              Direct dispatches from Master Barber Joe & Senior Stylist Roya at Bayview-Cummer Shopping Centre.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 bg-[#9A8C73] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1D1D1D] dark:hover:bg-white dark:hover:text-[#1D1D1D] transition-colors cursor-pointer"
              >
                <PlusCircle size={14} /> Create New Post
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#1D1D1D]/10 dark:border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                  : 'bg-transparent text-[#1D1D1D]/70 dark:text-white/70 hover:text-[#9A8C73] border border-[#1D1D1D]/15 dark:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#1D1D1D]/20 dark:border-white/20 p-8">
            <Newspaper size={36} className="mx-auto text-[#9A8C73] mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#1D1D1D] dark:text-white mb-2">
              No stories published in this category yet
            </h3>
            <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60 mb-6">
              Check back soon for new updates, style archives, and salon notices.
            </p>
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 bg-[#9A8C73] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                <PlusCircle size={14} /> Write First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Pinned Post (if selected category is All) */}
            {selectedCategory === 'All' && pinnedPost && (
              <div
                onClick={() => onSelectPost(pinnedPost)}
                className="group relative bg-[#1D1D1D]/5 dark:bg-white/5 border border-[#1D1D1D]/15 dark:border-white/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12 cursor-pointer hover:border-[#9A8C73] transition-all duration-300"
              >
                <div className="lg:col-span-7 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-black">
                  {pinnedPost.imageUrl ? (
                    <img
                      src={pinnedPost.imageUrl}
                      alt={pinnedPost.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1D1D1D] text-white/40">
                      <Newspaper size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-[#9A8C73] text-white text-[9px] uppercase font-bold tracking-[0.2em] px-2.5 py-1">
                      {pinnedPost.category}
                    </span>
                    <span className="bg-white text-[#1D1D1D] text-[9px] uppercase font-bold tracking-[0.2em] px-2.5 py-1 flex items-center gap-1">
                      <Sparkles size={10} className="text-[#9A8C73]" /> Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-[#1D1D1D]/60 dark:text-white/60">
                      <span className="flex items-center gap-1.5 font-medium text-[#1D1D1D] dark:text-white">
                        <User size={12} className="text-[#9A8C73]" /> {pinnedPost.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {pinnedPost.date}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1D1D1D] dark:text-white font-normal leading-snug group-hover:text-[#9A8C73] transition-colors">
                      {pinnedPost.title}
                    </h3>

                    <p className="text-sm text-[#1D1D1D]/70 dark:text-white/70 leading-relaxed font-normal">
                      {pinnedPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#1D1D1D]/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#9A8C73] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                      Read Full Story <ArrowRight size={14} />
                    </span>
                    {pinnedPost.tags && pinnedPost.tags[0] && (
                      <span className="text-[11px] text-[#1D1D1D]/50 dark:text-white/50 font-mono">
                        #{pinnedPost.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Standard Posts Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && pinnedPost ? remainingPosts : filteredPosts).map(
                (post) => (
                  <article
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group bg-[#1D1D1D]/5 dark:bg-white/5 border border-[#1D1D1D]/10 dark:border-white/10 overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#9A8C73] transition-all duration-300"
                  >
                    <div>
                      {post.imageUrl && (
                        <div className="h-48 w-full relative overflow-hidden bg-black">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-[#9A8C73] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                            {post.category}
                          </span>
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-[#1D1D1D]/50 dark:text-white/50">
                          <span className="flex items-center gap-1">
                            <User size={11} className="text-[#9A8C73]" /> {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {post.date}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl text-[#1D1D1D] dark:text-white font-normal leading-snug group-hover:text-[#9A8C73] transition-colors line-clamp-2">
                          {post.title}
                        </h4>

                        <p className="text-xs text-[#1D1D1D]/70 dark:text-white/70 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between border-t border-[#1D1D1D]/10 dark:border-white/10 mt-4">
                      <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#9A8C73] group-hover:text-[#1D1D1D] dark:group-hover:text-white transition-colors flex items-center gap-1 pt-3">
                        Read Story <ArrowRight size={12} />
                      </span>
                      {post.tags && post.tags[0] && (
                        <span className="text-[10px] text-[#1D1D1D]/40 dark:text-white/40 font-mono pt-3">
                          #{post.tags[0]}
                        </span>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
