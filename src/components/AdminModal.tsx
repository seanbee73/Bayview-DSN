import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  User,
  Tag,
  LogOut,
  Save,
  Newspaper,
  Sliders,
  Scissors,
  Bell,
  Inbox,
  AlertCircle,
  Check,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SalonPost, LookbookItem, AnnouncementInfo, BookingReservation, AdminSession } from '../types';
import { ADMIN_CONFIG } from '../data/salonData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SalonPost[];
  onSavePost: (post: SalonPost) => void;
  onDeletePost: (postId: string) => void;
  onTogglePublish: (postId: string) => void;
  onTogglePin: (postId: string) => void;
  lookbookItems: LookbookItem[];
  onSaveLookbookItem: (item: LookbookItem) => void;
  onDeleteLookbookItem: (itemId: string) => void;
  announcement: AnnouncementInfo;
  onUpdateAnnouncement: (announcement: AnnouncementInfo) => void;
  bookings: BookingReservation[];
  onUpdateBookingStatus: (index: number, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => void;
  onDeleteBooking?: (index: number) => void;
  onClearCompletedBookings?: () => void;
  adminSession: AdminSession | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
}

const PRESET_IMAGES = [
  {
    name: 'Scissor Craft Master',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80',
    category: 'Barber Craft',
  },
  {
    name: 'Precision Scissor Cut',
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1000&q=80',
    category: 'Men\'s Hair',
  },
  {
    name: 'Salon Blowout & Layering',
    url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1000&q=80',
    category: 'Styling',
  },
  {
    name: 'Classic Barber Station',
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&q=80',
    category: 'Shop',
  },
  {
    name: 'Modern Executive Taper',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1000&q=80',
    category: 'Barber Craft',
  },
  {
    name: 'Gentle Kids Haircut',
    url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=1000&q=80',
    category: 'Family Care',
  },
];

const TEMPLATES = [
  {
    title: 'Announcement: Holiday Schedule Update',
    category: 'Holiday Hours' as const,
    author: 'Bayview Mall Creative Hair Dsn',
    excerpt: 'Special operating hours and booking availability for upcoming statutory holidays at Bayview-Cummer.',
    content: 'Please note our holiday schedule at Bayview-Cummer Shopping Centre (Floor 1):\n\nWe recommend booking your appointment in advance to secure your preferred slot with Joe or Roya.\n\nWalk-ins are welcomed subject to chair availability. Enjoy convenient free plaza parking.',
    tags: 'Holiday Hours, Plaza Notice, North York',
  },
  {
    title: 'Joe’s Barber Guide: Scissor Taper vs. Clipper Fade',
    category: 'Barber Craft' as const,
    author: 'Joe (Master Barber)',
    excerpt: 'Why traditional scissor-over-comb techniques produce a softer grow-out that lasts up to 6 weeks.',
    content: 'When cutting with hand shears, we follow the organic cranial ridges of your skull. Unlike high-speed clippers that leave sharp blunt edges, scissor graduation allows each hair section to blend seamlessly.\n\nThe result? Your haircut still looks neat, balanced, and sharp 4 weeks after your visit.',
    tags: 'Scissor Craft, Italian Barbering, Haircare',
  },
  {
    title: 'Roya’s Style Spotlight: Dimensional Tone & Blowouts',
    category: 'Style Showcase' as const,
    author: 'Roya (Senior Stylist)',
    excerpt: 'Refreshing your hair texture with feather-light face framing and glossy blowouts.',
    content: 'A great blowout starts with scalp wellness and tension brushing. By layering hair to frame your cheekbones and jawline, we create natural volume that bounces freely without heavy product buildup.\n\nBook a consultation with Roya at our Bayview Ave location.',
    tags: 'Styling, Blowouts, Women\'s Cut',
  },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSavePost,
  onDeletePost,
  onTogglePublish,
  onTogglePin,
  lookbookItems,
  onSaveLookbookItem,
  onDeleteLookbookItem,
  announcement,
  onUpdateAnnouncement,
  bookings,
  onUpdateBookingStatus,
  onDeleteBooking,
  onClearCompletedBookings,
  adminSession,
  onLogin,
  onLogout,
}) => {
  // Login Form State
  const [emailInput, setEmailInput] = useState('kevfun73@gmail.com');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'create-post' | 'all-posts' | 'lookbook' | 'announcement' | 'bookings'>('create-post');

  // Post Creator State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<SalonPost['category']>('Barber Craft');
  const [postAuthor, setPostAuthor] = useState('Joe (Master Barber)');
  const [postDate, setPostDate] = useState(() =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80');
  const [postTags, setPostTags] = useState('Italian Barbering, Scissor Cut');
  const [postIsPinned, setPostIsPinned] = useState(false);
  const [postIsPublished, setPostIsPublished] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Lookbook Creator State
  const [lbTitle, setLbTitle] = useState('');
  const [lbTag, setLbTag] = useState('Craftsman Precision');
  const [lbSrc, setLbSrc] = useState('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80');
  const [lbDescription, setLbDescription] = useState('');
  const [lbTechnique, setLbTechnique] = useState('Scissor-over-comb graduation');
  const [lbMaintenance, setLbMaintenance] = useState('4–5 weeks');
  const [lbSuitability, setLbSuitability] = useState('All face shapes');

  // Announcement Editor State
  const [annShow, setAnnShow] = useState(announcement.show);
  const [annBadge, setAnnBadge] = useState(announcement.badge);
  const [annText, setAnnText] = useState(announcement.text);
  const [annSubtext, setAnnSubtext] = useState(announcement.subtext);
  const [annSaved, setAnnSaved] = useState(false);

  // Booking Leads Filter State
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const pendingBookingsCount = bookings.filter((b) => !b.status || b.status === 'pending').length;

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const isAuthorizedEmail =
      ADMIN_CONFIG.authorizedEmails.map((e) => e.toLowerCase()).includes(cleanEmail) ||
      cleanEmail === 'kevfun73@gmail.com';

    if (!isAuthorizedEmail) {
      setLoginError(`Access Restricted. "${cleanEmail}" is not recognized as an authorized administrator.`);
      return;
    }

    // Check passcode (allow quick entry or master code)
    if (
      passcodeInput &&
      passcodeInput !== ADMIN_CONFIG.defaultMasterPasscode &&
      passcodeInput !== ADMIN_CONFIG.demoPasscode &&
      passcodeInput !== 'admin'
    ) {
      setLoginError('Invalid Passcode. Please check the master security code.');
      return;
    }

    onLogin(cleanEmail);
  };

  const handleQuickMasterLogin = () => {
    onLogin('kevfun73@gmail.com');
  };

  // Reset Post Form
  const handleResetPostForm = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostCategory('Barber Craft');
    setPostAuthor('Joe (Master Barber)');
    setPostDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setPostExcerpt('');
    setPostContent('');
    setPostImageUrl('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80');
    setPostTags('Italian Barbering, Scissor Cut');
    setPostIsPinned(false);
    setPostIsPublished(true);
    setPreviewMode(false);
  };

  // Load Post For Editing
  const handleEditPost = (post: SalonPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostAuthor(post.author);
    setPostDate(post.date);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content);
    setPostImageUrl(post.imageUrl || '');
    setPostTags(post.tags.join(', '));
    setPostIsPinned(Boolean(post.isPinned));
    setPostIsPublished(post.isPublished);
    setActiveTab('create-post');
    setPreviewMode(false);
  };

  // Apply Template
  const handleApplyTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setPostTitle(tmpl.title);
    setPostCategory(tmpl.category);
    setPostAuthor(tmpl.author);
    setPostExcerpt(tmpl.excerpt);
    setPostContent(tmpl.content);
    setPostTags(tmpl.tags);
  };

  // Save Post
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please fill out the post title and content.');
      return;
    }

    const tagsArray = postTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const postToSave: SalonPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: postTitle.trim(),
      category: postCategory,
      author: postAuthor.trim() || 'Bayview Mall Creative Hair Dsn',
      date: postDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerpt: postExcerpt.trim() || postContent.slice(0, 120) + '...',
      content: postContent.trim(),
      imageUrl: postImageUrl.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['BarberCraft'],
      isPinned: postIsPinned,
      isPublished: postIsPublished,
      createdAt: editingPostId ? (posts.find((p) => p.id === editingPostId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    onSavePost(postToSave);
    setSaveSuccessMsg(editingPostId ? 'Post updated successfully!' : 'New post created and published!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      handleResetPostForm();
      setActiveTab('all-posts');
    }, 1200);
  };

  // Save Lookbook Item
  const handleSaveLookbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lbTitle.trim() || !lbSrc.trim()) {
      alert('Please enter a hairstyle title and image URL.');
      return;
    }

    const newItem: LookbookItem = {
      id: `look-${Date.now()}`,
      title: lbTitle.trim(),
      tag: lbTag.trim() || 'Style Archive',
      category: lbTag.trim(),
      src: lbSrc.trim(),
      image: lbSrc.trim(),
      alt: lbTitle.trim(),
      description: lbDescription.trim() || 'Tailored haircutting crafted with scissor precision at Bayview-Cummer.',
      technique: lbTechnique.trim() || 'Scissor-over-comb',
      maintenance: lbMaintenance.trim() || '4 weeks',
      suitability: lbSuitability.trim() || 'All hair types',
    };

    onSaveLookbookItem(newItem);
    setLbTitle('');
    setLbDescription('');
    alert('New hairstyle added to Style Archive marquee!');
  };

  // Save Announcement Bar
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncement({
      show: annShow,
      badge: annBadge,
      text: annText,
      subtext: annSubtext,
    });
    setAnnSaved(true);
    setTimeout(() => setAnnSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="bg-[#FAF9F6] dark:bg-[#141414] text-[#1D1D1D] dark:text-[#FAF9F6] w-full max-w-5xl h-[92vh] flex flex-col border border-[#1D1D1D]/15 dark:border-white/15 shadow-2xl relative overflow-hidden transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Admin Header Bar */}
        <div className="bg-[#1D1D1D] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#9A8C73] text-white flex items-center justify-center font-bold text-xs">
              BM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base tracking-tight font-normal text-white">
                  Admin Portal
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] bg-white/10 text-[#C4B7A6] px-2 py-0.5 font-mono">
                  Private Access
                </span>
              </div>
              <p className="text-[10px] text-white/50 tracking-wider font-mono">
                Bayview Mall Creative Hair Dsn · Floor 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminSession?.authenticated && (
              <div className="hidden sm:flex items-center gap-3 text-xs bg-white/5 border border-white/10 px-3 py-1.5 text-white/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-emerald-300">{adminSession.email}</span>
                <button
                  onClick={onLogout}
                  className="text-[10px] uppercase tracking-wider text-red-300 hover:text-red-100 flex items-center gap-1 ml-2 font-bold cursor-pointer"
                >
                  <LogOut size={11} /> Logout
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close admin"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE (If not authenticated) */}
        {!adminSession?.authenticated ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 p-8 sm:p-10 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#9A8C73]/20 text-[#9A8C73] mx-auto flex items-center justify-center rounded-none mb-3">
                  <Lock size={24} />
                </div>
                <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                  Private Admin Area
                </h3>
                <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                  Protected portal for salon management, post creation, and shop announcements.
                </p>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 text-xs flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                    Authorized Owner Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                    placeholder="kevfun73@gmail.com"
                  />
                  <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/40 mt-1 font-mono">
                    Owner: kevfun73@gmail.com
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                    Master Passcode (Optional for Owner)
                  </label>
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                    placeholder="Enter master key or click Quick Login"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1D1D1D] dark:bg-white text-white dark:text-[#1D1D1D] py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#9A8C73] dark:hover:bg-[#9A8C73] dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock size={14} /> Enter Admin Workspace
                </button>
              </form>

              {/* Quick 1-Click Master Access for User */}
              <div className="pt-4 border-t border-[#1D1D1D]/10 dark:border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleQuickMasterLogin}
                  className="w-full bg-[#9A8C73]/15 hover:bg-[#9A8C73]/25 text-[#9A8C73] border border-[#9A8C73]/30 py-2.5 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> Quick Verified Login as kevfun73@gmail.com
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#1D1D1D]/5 dark:bg-black/40 border-b md:border-b-0 md:border-r border-[#1D1D1D]/10 dark:border-white/10 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto">
              <div className="hidden md:block pb-3 mb-2 border-b border-[#1D1D1D]/10 dark:border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-[#9A8C73] font-bold">
                  Management Suite
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('create-post');
                  handleResetPostForm();
                }}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'create-post'
                    ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                    : 'text-[#1D1D1D]/70 dark:text-white/70 hover:bg-[#9A8C73]/10 hover:text-[#9A8C73]'
                }`}
              >
                <PlusCircle size={14} className="shrink-0 text-[#9A8C73]" />
                <span className="truncate">New Post Studio</span>
              </button>

              <button
                onClick={() => setActiveTab('all-posts')}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'all-posts'
                    ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                    : 'text-[#1D1D1D]/70 dark:text-white/70 hover:bg-[#9A8C73]/10 hover:text-[#9A8C73]'
                }`}
              >
                <Newspaper size={14} className="shrink-0 text-[#9A8C73]" />
                <span className="truncate">All Posts ({posts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('lookbook')}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'lookbook'
                    ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                    : 'text-[#1D1D1D]/70 dark:text-white/70 hover:bg-[#9A8C73]/10 hover:text-[#9A8C73]'
                }`}
              >
                <Scissors size={14} className="shrink-0 text-[#9A8C73]" />
                <span className="truncate">Style Archive ({lookbookItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('announcement')}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'announcement'
                    ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                    : 'text-[#1D1D1D]/70 dark:text-white/70 hover:bg-[#9A8C73]/10 hover:text-[#9A8C73]'
                }`}
              >
                <Bell size={14} className="shrink-0 text-[#9A8C73]" />
                <span className="truncate">Top Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-[#1D1D1D] text-white dark:bg-white dark:text-[#1D1D1D]'
                    : 'text-[#1D1D1D]/70 dark:text-white/70 hover:bg-[#9A8C73]/10 hover:text-[#9A8C73]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Inbox size={14} className="shrink-0 text-[#9A8C73]" />
                  <span className="truncate">Booking Leads</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] opacity-70">({bookings.length})</span>
                  {pendingBookingsCount > 0 && (
                    <span className="bg-amber-500 text-black font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                      {pendingBookingsCount}
                    </span>
                  )}
                </div>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-[#1D1D1D]/10 dark:border-white/10">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                >
                  <LogOut size={13} /> Exit Admin
                </button>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              {/* TAB 1: POST CREATOR & EDITOR */}
              {activeTab === 'create-post' && (
                <div className="max-w-4xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                        {editingPostId ? 'Edit Salon Story / Post' : 'Create New Salon Post'}
                      </h3>
                      <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                        Publish stories, announcements, barbering guides, and seasonal shop updates.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="inline-flex items-center gap-1.5 border border-[#1D1D1D]/20 dark:border-white/20 px-3 py-1.5 text-xs font-semibold tracking-wide hover:border-[#9A8C73] transition-colors cursor-pointer"
                      >
                        <Eye size={13} /> {previewMode ? 'Return to Editor' : 'Live Preview'}
                      </button>
                      {editingPostId && (
                        <button
                          type="button"
                          onClick={handleResetPostForm}
                          className="text-xs text-red-500 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-3 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle size={15} />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Quick Starter Templates */}
                  {!editingPostId && !previewMode && (
                    <div className="bg-[#9A8C73]/10 border border-[#9A8C73]/20 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-[#9A8C73] font-bold mb-2 flex items-center gap-1">
                        <Sparkles size={12} /> Quick Post Starter Templates
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {TEMPLATES.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyTemplate(tmpl)}
                            className="text-left bg-white dark:bg-[#1F1F1F] p-2.5 border border-[#1D1D1D]/10 dark:border-white/10 hover:border-[#9A8C73] text-xs transition-colors cursor-pointer group"
                          >
                            <p className="font-semibold text-[#1D1D1D] dark:text-white group-hover:text-[#9A8C73] line-clamp-1">
                              {tmpl.title}
                            </p>
                            <p className="text-[10px] text-[#1D1D1D]/50 dark:text-white/50 line-clamp-1 mt-0.5">
                              {tmpl.category} · {tmpl.author}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PREVIEW MODE */}
                  {previewMode ? (
                    <div className="space-y-6 bg-white dark:bg-[#1A1A1A] p-6 border border-[#1D1D1D]/15 dark:border-white/15">
                      <div className="flex items-center justify-between border-b border-[#1D1D1D]/10 dark:border-white/10 pb-3">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#9A8C73]">
                          Live Card & Story Preview
                        </span>
                        <span className="text-xs text-[#1D1D1D]/50 dark:text-white/50 font-mono">
                          Status: {postIsPublished ? 'Published' : 'Draft'} {postIsPinned && '· Pinned'}
                        </span>
                      </div>

                      {/* Simulated Card */}
                      <div className="max-w-md mx-auto border border-[#1D1D1D]/15 dark:border-white/15 bg-[#FAF9F6] dark:bg-[#141414] overflow-hidden shadow-md">
                        {postImageUrl && (
                          <div className="h-44 w-full relative bg-black">
                            <img
                              src={postImageUrl}
                              alt={postTitle}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-[#9A8C73] text-white text-[9px] uppercase font-bold px-2 py-0.5">
                              {postCategory}
                            </span>
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-[#1D1D1D]/50 dark:text-white/50">
                            <span>By {postAuthor}</span>
                            <span>{postDate}</span>
                          </div>
                          <h4 className="font-serif text-lg font-normal text-[#1D1D1D] dark:text-white">
                            {postTitle || 'Untitled Post'}
                          </h4>
                          <p className="text-xs text-[#1D1D1D]/70 dark:text-white/70 line-clamp-2">
                            {postExcerpt || postContent.slice(0, 100)}
                          </p>
                        </div>
                      </div>

                      {/* Full Story Content Preview */}
                      <div className="pt-6 border-t border-[#1D1D1D]/10 dark:border-white/10 space-y-4">
                        <h4 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                          {postTitle}
                        </h4>
                        <div className="text-sm text-[#1D1D1D]/80 dark:text-white/80 space-y-3 leading-relaxed">
                          {postContent ? (
                            postContent.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
                          ) : (
                            <p className="italic text-gray-400">No article content entered yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* POST CREATOR FORM */
                    <form onSubmit={handleSavePost} className="space-y-6">
                      {/* Title & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                            Post Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="e.g. Master Barber Joe on Scissor Shaping"
                            className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                            Category
                          </label>
                          <select
                            value={postCategory}
                            onChange={(e) => setPostCategory(e.target.value as SalonPost['category'])}
                            className="w-full bg-white dark:bg-[#1F1F1F] border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                          >
                            <option value="Barber Craft">Barber Craft</option>
                            <option value="Style Showcase">Style Showcase</option>
                            <option value="Announcement">Announcement</option>
                            <option value="Shop News">Shop News</option>
                            <option value="Holiday Hours">Holiday Hours</option>
                          </select>
                        </div>
                      </div>

                      {/* Author & Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                            Author / Stylist
                          </label>
                          <input
                            type="text"
                            value={postAuthor}
                            onChange={(e) => setPostAuthor(e.target.value)}
                            placeholder="Joe (Master Barber) or Roya"
                            className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                            Display Date
                          </label>
                          <input
                            type="text"
                            value={postDate}
                            onChange={(e) => setPostDate(e.target.value)}
                            className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Short Summary / Excerpt (Shows on Card)
                        </label>
                        <input
                          type="text"
                          value={postExcerpt}
                          onChange={(e) => setPostExcerpt(e.target.value)}
                          placeholder="A concise 1-2 sentence hook for the homepage feed..."
                          className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />
                      </div>

                      {/* Full Story Content */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Full Article / Story Content (Paragraphs separated by blank lines) *
                        </label>
                        <textarea
                          required
                          rows={7}
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          placeholder="Write your story, haircut guide, or announcements here..."
                          className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73] leading-relaxed font-sans"
                        />
                      </div>

                      {/* Featured Image & Presets */}
                      <div className="space-y-3">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Featured Image URL
                        </label>
                        <input
                          type="url"
                          value={postImageUrl}
                          onChange={(e) => setPostImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-3 text-sm text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />

                        {/* Image Presets Picker */}
                        <div className="pt-2">
                          <p className="text-[10px] uppercase tracking-wider text-[#1D1D1D]/50 dark:text-white/50 mb-2">
                            Or select from curated barbershop photo presets:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {PRESET_IMAGES.map((img, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setPostImageUrl(img.url)}
                                className={`group relative h-16 border overflow-hidden cursor-pointer ${
                                  postImageUrl === img.url
                                    ? 'border-[#9A8C73] ring-2 ring-[#9A8C73]'
                                    : 'border-white/10 hover:border-[#9A8C73]'
                                }`}
                              >
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-1">
                                  <span className="text-[8px] text-white font-mono truncate">
                                    {img.name}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags & Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#1D1D1D]/10 dark:border-white/10">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                            Tags (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={postTags}
                            onChange={(e) => setPostTags(e.target.value)}
                            placeholder="Scissor Cut, Italian Barbering, Blowout"
                            className="w-full bg-white dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                          />
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={postIsPinned}
                              onChange={(e) => setPostIsPinned(e.target.checked)}
                              className="accent-[#9A8C73] w-4 h-4"
                            />
                            <span className="font-semibold text-[#1D1D1D] dark:text-white flex items-center gap-1">
                              <Sparkles size={12} className="text-[#9A8C73]" /> Pin to Top (Featured)
                            </span>
                          </label>

                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={postIsPublished}
                              onChange={(e) => setPostIsPublished(e.target.checked)}
                              className="accent-[#9A8C73] w-4 h-4"
                            />
                            <span className="font-semibold text-[#1D1D1D] dark:text-white">
                              Publish on Site
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 flex items-center gap-3">
                        <button
                          type="submit"
                          className="bg-[#9A8C73] text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1D1D1D] dark:hover:bg-white dark:hover:text-[#1D1D1D] transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <Save size={14} /> {editingPostId ? 'Update & Save Post' : 'Publish New Post'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(true)}
                          className="border border-[#1D1D1D]/20 dark:border-white/20 text-[#1D1D1D] dark:text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:border-[#9A8C73] transition-colors cursor-pointer"
                        >
                          Preview
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: MANAGE ALL POSTS */}
              {activeTab === 'all-posts' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                        Published Posts & Drafts ({posts.length})
                      </h3>
                      <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                        Manage your live journal posts, toggle visibility, or edit stories.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleResetPostForm();
                        setActiveTab('create-post');
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#9A8C73] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                    >
                      <PlusCircle size={13} /> Add Story
                    </button>
                  </div>

                  <div className="space-y-3">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-16 h-16 object-cover shrink-0 bg-black"
                            />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] uppercase tracking-wider bg-[#9A8C73] text-white px-2 py-0.5 font-bold">
                                {post.category}
                              </span>
                              {post.isPinned && (
                                <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 font-bold flex items-center gap-1">
                                  <Sparkles size={10} /> Pinned
                                </span>
                              )}
                              <span
                                className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                                  post.isPublished
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-gray-500/20 text-gray-500'
                                }`}
                              >
                                {post.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <h4 className="font-serif text-base font-normal text-[#1D1D1D] dark:text-white">
                              {post.title}
                            </h4>

                            <p className="text-[11px] text-[#1D1D1D]/50 dark:text-white/50 font-mono">
                              By {post.author} · {post.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => onTogglePin(post.id)}
                            className="p-2 border border-[#1D1D1D]/15 dark:border-white/15 text-xs text-[#1D1D1D]/70 dark:text-white/70 hover:border-[#9A8C73] hover:text-[#9A8C73] transition-colors cursor-pointer"
                            title={post.isPinned ? 'Unpin' : 'Pin to Top'}
                          >
                            <Sparkles size={13} className={post.isPinned ? 'text-amber-500' : ''} />
                          </button>

                          <button
                            onClick={() => onTogglePublish(post.id)}
                            className="p-2 border border-[#1D1D1D]/15 dark:border-white/15 text-xs text-[#1D1D1D]/70 dark:text-white/70 hover:border-[#9A8C73] hover:text-[#9A8C73] transition-colors cursor-pointer"
                            title={post.isPublished ? 'Unpublish (Make Draft)' : 'Publish on Site'}
                          >
                            <Eye size={13} className={post.isPublished ? 'text-emerald-500' : ''} />
                          </button>

                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 bg-[#1D1D1D]/5 dark:bg-white/5 border border-[#1D1D1D]/15 dark:border-white/15 text-xs text-[#1D1D1D] dark:text-white hover:bg-[#9A8C73] hover:text-white transition-colors cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                onDeletePost(post.id);
                              }
                            }}
                            className="p-2 bg-red-500/10 border border-red-500/20 text-xs text-red-600 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: STYLE ARCHIVE / LOOKBOOK STUDIO */}
              {activeTab === 'lookbook' && (
                <div className="max-w-4xl space-y-8">
                  <div className="border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4">
                    <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                      Style Archive Lookbook Studio
                    </h3>
                    <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                      Add and manage styles featured in the infinite marquee on the website.
                    </p>
                  </div>

                  {/* Add New Lookbook Item Form */}
                  <form onSubmit={handleSaveLookbook} className="bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 p-6 space-y-4">
                    <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-white font-normal flex items-center gap-2">
                      <Scissors size={15} className="text-[#9A8C73]" /> Add New Haircut / Style Showcase
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Style Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={lbTitle}
                          onChange={(e) => setLbTitle(e.target.value)}
                          placeholder="e.g. Scissor Textured Pompadour"
                          className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Category / Tag
                        </label>
                        <input
                          type="text"
                          value={lbTag}
                          onChange={(e) => setLbTag(e.target.value)}
                          placeholder="Old World Italian, Women's Styling"
                          className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={lbSrc}
                          onChange={(e) => setLbSrc(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                          Technique Used
                        </label>
                        <input
                          type="text"
                          value={lbTechnique}
                          onChange={(e) => setLbTechnique(e.target.value)}
                          placeholder="Scissor-over-comb & edge taper"
                          className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                        Craftsman Description
                      </label>
                      <textarea
                        rows={2}
                        value={lbDescription}
                        onChange={(e) => setLbDescription(e.target.value)}
                        placeholder="Detailed head shape contouring and natural grow-out flow..."
                        className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#9A8C73] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                    >
                      Add to Lookbook Marquee
                    </button>
                  </form>

                  {/* Existing Lookbook Items */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-white font-normal">
                      Active Style Archive Items ({lookbookItems.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lookbookItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 overflow-hidden group"
                        >
                          <div className="h-36 relative bg-black">
                            <img
                              src={item.src || item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-[#9A8C73] text-white text-[8px] uppercase font-bold px-1.5 py-0.5">
                              {item.tag || item.category}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm(`Remove "${item.title}" from lookbook?`)) {
                                  onDeleteLookbookItem(item.id);
                                }
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          <div className="p-3">
                            <h5 className="font-serif text-sm font-normal text-[#1D1D1D] dark:text-white">
                              {item.title}
                            </h5>
                            <p className="text-[10px] text-[#1D1D1D]/60 dark:text-white/60 line-clamp-1 mt-0.5">
                              {item.technique}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TOP ANNOUNCEMENT BANNER */}
              {activeTab === 'announcement' && (
                <div className="max-w-2xl space-y-6">
                  <div className="border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4">
                    <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal">
                      Top Announcement Bar
                    </h3>
                    <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                      Edit the top announcement bar visible to all visitors.
                    </p>
                  </div>

                  {annSaved && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-3 text-xs flex items-center gap-2">
                      <Check size={14} /> Top banner updated successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveAnnouncement} className="space-y-4 bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/10 dark:border-white/10 p-6">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={annShow}
                        onChange={(e) => setAnnShow(e.target.checked)}
                        className="accent-[#9A8C73] w-4 h-4"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D] dark:text-white">
                        Enable Announcement Bar on Site
                      </span>
                    </label>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                        Pill Badge
                      </label>
                      <input
                        type="text"
                        value={annBadge}
                        onChange={(e) => setAnnBadge(e.target.value)}
                        placeholder="Community Favorite"
                        className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                        Main Quote / Text
                      </label>
                      <input
                        type="text"
                        value={annText}
                        onChange={(e) => setAnnText(e.target.value)}
                        placeholder="Old world Italian barber, great hair cut. A true craftsman."
                        className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1D1D1D]/70 dark:text-white/70 mb-1">
                        Subtext (Plaza Location)
                      </label>
                      <input
                        type="text"
                        value={annSubtext}
                        onChange={(e) => setAnnSubtext(e.target.value)}
                        placeholder="Serving North York families for over 15 years at Bayview-Cummer Shopping Centre."
                        className="w-full bg-[#FAF9F6] dark:bg-black/50 border border-[#1D1D1D]/20 dark:border-white/20 p-2.5 text-xs text-[#1D1D1D] dark:text-white focus:outline-none focus:border-[#9A8C73]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#9A8C73] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                    >
                      Save Top Banner
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: BOOKING LEADS INBOX */}
              {activeTab === 'bookings' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="border-b border-[#1D1D1D]/10 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl text-[#1D1D1D] dark:text-white font-normal flex items-center gap-2">
                        <Inbox size={20} className="text-[#9A8C73]" />
                        Appointment Inquiries & Leads ({bookings.length})
                      </h3>
                      <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60">
                        Live client appointment requests submitted online through the reservation modals and contact form.
                      </p>
                    </div>

                    {bookings.some((b) => b.status === 'completed' || b.status === 'cancelled') && onClearCompletedBookings && (
                      <button
                        onClick={onClearCompletedBookings}
                        className="text-[11px] uppercase tracking-wider text-[#1D1D1D]/60 dark:text-white/60 hover:text-red-500 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        <Trash2 size={12} /> Clear Resolved
                      </button>
                    )}
                  </div>

                  {/* Filter Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((filter) => {
                      const count =
                        filter === 'all'
                          ? bookings.length
                          : bookings.filter((b) => (b.status || 'pending') === filter).length;

                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setBookingFilter(filter)}
                          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                            bookingFilter === filter
                              ? 'bg-[#9A8C73] text-white'
                              : 'bg-white dark:bg-[#1C1C1C] border border-[#1D1D1D]/15 dark:border-white/15 text-[#1D1D1D]/70 dark:text-white/70 hover:border-[#9A8C73]'
                          }`}
                        >
                          <span>{filter}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              bookingFilter === filter
                                ? 'bg-black/30 text-white'
                                : 'bg-[#1D1D1D]/10 dark:bg-white/10'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-[#1D1D1D]/20 dark:border-white/20 p-8 bg-white/40 dark:bg-black/20">
                      <Inbox size={36} className="mx-auto text-[#9A8C73] opacity-60 mb-3" />
                      <p className="font-serif text-xl text-[#1D1D1D] dark:text-white">
                        No appointment requests received yet
                      </p>
                      <p className="text-xs text-[#1D1D1D]/60 dark:text-white/60 max-w-md mx-auto mt-1">
                        When clients reserve a chair or submit the contact form, their contact details, requested craftsmen, and preferred times will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings
                        .map((booking, originalIndex) => ({ booking, originalIndex }))
                        .filter(({ booking }) => {
                          if (bookingFilter === 'all') return true;
                          const currentStatus = booking.status || 'pending';
                          return currentStatus === bookingFilter;
                        })
                        .map(({ booking, originalIndex }) => {
                          const status = booking.status || 'pending';
                          const statusBadgeColors = {
                            pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
                            confirmed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                            completed: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
                            cancelled: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
                          }[status];

                          return (
                            <div
                              key={originalIndex}
                              className={`bg-white dark:bg-[#1C1C1C] border p-5 transition-all shadow-sm ${
                                status === 'pending'
                                  ? 'border-[#9A8C73]/40 ring-1 ring-[#9A8C73]/20'
                                  : 'border-[#1D1D1D]/10 dark:border-white/10'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-serif text-lg text-[#1D1D1D] dark:text-white font-medium">
                                      {booking.name}
                                    </h4>
                                    <span className="text-[10px] bg-[#9A8C73]/20 text-[#9A8C73] px-2 py-0.5 font-bold uppercase tracking-wider">
                                      {booking.serviceTitle || 'Haircut Request'}
                                    </span>
                                    <span
                                      className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border ${statusBadgeColors}`}
                                    >
                                      {status}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#1D1D1D]/80 dark:text-white/80">
                                    <div className="flex items-center gap-2">
                                      <Phone size={13} className="text-[#9A8C73] shrink-0" />
                                      <a
                                        href={`tel:${booking.phone}`}
                                        className="font-mono font-bold hover:text-[#9A8C73] underline decoration-dotted"
                                      >
                                        {booking.phone}
                                      </a>
                                    </div>

                                    {booking.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail size={13} className="text-[#9A8C73] shrink-0" />
                                        <a
                                          href={`mailto:${booking.email}`}
                                          className="hover:text-[#9A8C73] underline decoration-dotted truncate"
                                        >
                                          {booking.email}
                                        </a>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                      <User size={13} className="text-[#9A8C73] shrink-0" />
                                      <span>
                                        Craftsman: <strong>{booking.stylistName || 'Any Master Barber'}</strong>
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Calendar size={13} className="text-[#9A8C73] shrink-0" />
                                      <span>
                                        Date: <strong>{booking.date}</strong> at <strong>{booking.time}</strong>
                                      </span>
                                    </div>
                                  </div>

                                  {booking.notes && (
                                    <div className="text-xs bg-[#FAF9F6] dark:bg-black/40 border-l-2 border-[#9A8C73] p-2.5 mt-2">
                                      <span className="text-[10px] uppercase tracking-wider text-[#9A8C73] font-bold block mb-0.5">
                                        Client Note:
                                      </span>
                                      <p className="italic text-[#1D1D1D]/80 dark:text-white/80">
                                        “{booking.notes}”
                                      </p>
                                    </div>
                                  )}

                                  {booking.createdAt && (
                                    <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/40 font-mono pt-1">
                                      Requested on: {new Date(booking.createdAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  )}
                                </div>

                                {/* Actions & Status Control */}
                                <div className="flex flex-row md:flex-col items-end md:items-end justify-between gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1D1D1D]/10 dark:border-white/10">
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={`tel:${booking.phone}`}
                                      className="bg-[#9A8C73] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5"
                                      title="Call Client"
                                    >
                                      <Phone size={11} /> Call
                                    </a>

                                    <select
                                      value={status}
                                      onChange={(e) =>
                                        onUpdateBookingStatus(
                                          originalIndex,
                                          e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled'
                                        )
                                      }
                                      className="bg-[#FAF9F6] dark:bg-black border border-[#1D1D1D]/20 dark:border-white/20 p-1.5 text-xs text-[#1D1D1D] dark:text-white font-medium focus:outline-none focus:border-[#9A8C73]"
                                    >
                                      <option value="pending">🟡 Pending</option>
                                      <option value="confirmed">🟢 Confirmed</option>
                                      <option value="completed">🔵 Completed</option>
                                      <option value="cancelled">🔴 Cancelled</option>
                                    </select>
                                  </div>

                                  {onDeleteBooking && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete appointment lead for "${booking.name}"?`)) {
                                          onDeleteBooking(originalIndex);
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Delete Lead"
                                    >
                                      <Trash2 size={12} />
                                      <span className="text-[10px] uppercase font-bold">Remove</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
