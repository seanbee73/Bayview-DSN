import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { ServicesMenu } from './components/ServicesMenu';
import { Testimonial } from './components/Testimonial';
import { ConsultationProcess } from './components/ConsultationProcess';
import { TeamSection } from './components/TeamSection';
import { ReviewsSection } from './components/ReviewsSection';
import { SanctuaryCard } from './components/SanctuaryCard';
import { LookbookMarquee } from './components/LookbookMarquee';
import { PostsSection } from './components/PostsSection';
import { ContactCta } from './components/ContactCta';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { LookbookModal } from './components/LookbookModal';
import { StylistModal } from './components/StylistModal';
import { PostModal } from './components/PostModal';
import { AdminModal } from './components/AdminModal';
import {
  Stylist,
  LookbookItem,
  SignatureService,
  AdditionalService,
  SalonPost,
  AdminSession,
  AnnouncementInfo,
  BookingReservation,
} from './types';
import { DEFAULT_POSTS, LOOKBOOK_DATA, ANNOUNCEMENT_DATA } from './data/salonData';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SignatureService | AdditionalService | null>(null);
  const [selectedStylistForBooking, setSelectedStylistForBooking] = useState<string | undefined>(undefined);
  const [activeLookbookItem, setActiveLookbookItem] = useState<LookbookItem | null>(null);
  const [activeStylistModal, setActiveStylistModal] = useState<Stylist | null>(null);
  const [activePostModal, setActivePostModal] = useState<SalonPost | null>(null);

  // Persistent Posts State
  const [posts, setPosts] = useState<SalonPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_posts');
      if (saved) {
        try {
          const parsed: SalonPost[] = JSON.parse(saved);
          // Sync default post images so updates to salonData immediately reflect
          return parsed.map((p) => {
            const def = DEFAULT_POSTS.find((dp) => dp.id === p.id);
            if (def) {
              return { ...p, imageUrl: def.imageUrl };
            }
            return p;
          });
        } catch {
          return DEFAULT_POSTS;
        }
      }
    }
    return DEFAULT_POSTS;
  });

  // Persistent Lookbook Items State
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_lookbook');
      if (saved) {
        try {
          const parsed: LookbookItem[] = JSON.parse(saved);
          return parsed.map((item) => {
            const def = LOOKBOOK_DATA.items.find((di) => di.id === item.id);
            if (def) {
              return { ...item, src: def.src, image: def.image };
            }
            return item;
          });
        } catch {
          return LOOKBOOK_DATA.items;
        }
      }
    }
    return LOOKBOOK_DATA.items;
  });

  // Persistent Announcement Bar State
  const [announcement, setAnnouncement] = useState<AnnouncementInfo>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_announcement');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ANNOUNCEMENT_DATA;
        }
      }
    }
    return ANNOUNCEMENT_DATA;
  });

  // Persistent Bookings State
  const [bookings, setBookings] = useState<BookingReservation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_bookings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Persistent Admin Session State
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmch_admin_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Save to LocalStorage when states change
  useEffect(() => {
    localStorage.setItem('bmch_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('bmch_lookbook', JSON.stringify(lookbookItems));
  }, [lookbookItems]);

  useEffect(() => {
    localStorage.setItem('bmch_announcement', JSON.stringify(announcement));
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('bmch_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem('bmch_admin_session', JSON.stringify(adminSession));
    } else {
      localStorage.removeItem('bmch_admin_session');
    }
  }, [adminSession]);

  // Sync dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Intersection Observer for fade-in animations on sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section, header');
    sections.forEach((section) => {
      section.classList.add('fade-in');
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Handlers for Booking
  const handleOpenBooking = () => {
    setSelectedService(null);
    setSelectedStylistForBooking(undefined);
    setBookingModalOpen(true);
  };

  const handleSelectService = (service: SignatureService | AdditionalService) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleSelectStylist = (stylist: Stylist) => {
    setActiveStylistModal(stylist);
  };

  const handleBookWithStylist = (stylist: Stylist) => {
    setSelectedStylistForBooking(stylist.id);
    setBookingModalOpen(true);
  };

  const handleSelectLook = (item: LookbookItem) => {
    setActiveLookbookItem(item);
  };

  const handleBookLook = (_look: LookbookItem) => {
    setSelectedService(null);
    setBookingModalOpen(true);
  };

  // Handlers for Admin
  const handleAdminLogin = (email: string) => {
    const session: AdminSession = {
      email,
      authenticated: true,
      loginTime: new Date().toISOString(),
      role: 'Master Admin',
    };
    setAdminSession(session);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
  };

  const handleSavePost = (newOrUpdatedPost: SalonPost) => {
    setPosts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === newOrUpdatedPost.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newOrUpdatedPost;
        return updated;
      }
      return [newOrUpdatedPost, ...prev];
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleTogglePublish = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  const handleTogglePin = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isPinned: !p.isPinned };
        }
        // If pinning this one, unpin others so only one is main featured
        if (!p.isPinned) return p;
        return { ...p, isPinned: false };
      })
    );
  };

  const handleSaveLookbookItem = (item: LookbookItem) => {
    setLookbookItems((prev) => [item, ...prev]);
  };

  const handleDeleteLookbookItem = (itemId: string) => {
    setLookbookItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleUpdateAnnouncement = (newAnn: AnnouncementInfo) => {
    setAnnouncement(newAnn);
  };

  const handleUpdateBookingStatus = (
    index: number,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    setBookings((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], status };
      }
      return updated;
    });
  };

  const handleCreateBooking = (booking: BookingReservation) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const handleDeleteBooking = (index: number) => {
    setBookings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCompletedBookings = () => {
    setBookings((prev) => prev.filter((b) => b.status === 'pending' || b.status === 'confirmed'));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121212] text-[#1D1D1D] dark:text-[#FAF9F6] transition-colors duration-300 font-sans">
      {/* Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenBooking={handleOpenBooking}
        announcement={announcement}
        isAdmin={Boolean(adminSession?.authenticated)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero onOpenBooking={handleOpenBooking} />

      {/* Heritage / Philosophy Section */}
      <Philosophy />

      {/* Services Menu */}
      <ServicesMenu
        onSelectService={handleSelectService}
        onOpenBooking={handleOpenBooking}
      />

      {/* Featured Testimonial Highlight */}
      <Testimonial />

      {/* Head Contour Consultation & Analysis Process */}
      <ConsultationProcess />

      {/* Master Craftsmen: Joe & Roya */}
      <TeamSection onSelectStylist={handleSelectStylist} />

      {/* Verified Google Reviews Section */}
      <ReviewsSection />

      {/* Hours & Mall Location (Bayview-Cummer Shopping Centre) */}
      <SanctuaryCard onOpenBooking={handleOpenBooking} />

      {/* Style Archive Lookbook */}
      <LookbookMarquee onSelectLook={handleSelectLook} />

      {/* Salon Stories, Craft Guides & Announcements (Post Section) */}
      <PostsSection
        posts={posts}
        onSelectPost={(post) => setActivePostModal(post)}
        isAdmin={Boolean(adminSession?.authenticated)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Appointment Request & Direct Contact */}
      <ContactCta
        onOpenBooking={handleOpenBooking}
        onBookingSubmit={handleCreateBooking}
      />

      {/* Footer - Admin Login located right after Hours & Location in Explore */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={() => setAdminModalOpen(true)}
        isAdmin={Boolean(adminSession?.authenticated)}
      />

      {/* Modals & Dialogs */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedService}
        initialStylistId={selectedStylistForBooking}
        onBookingSubmit={handleCreateBooking}
      />

      <LookbookModal
        item={activeLookbookItem}
        onClose={() => setActiveLookbookItem(null)}
        onBookThisLook={handleBookLook}
      />

      <StylistModal
        stylist={activeStylistModal}
        onClose={() => setActiveStylistModal(null)}
        onBookWithStylist={handleBookWithStylist}
      />

      <PostModal
        post={activePostModal}
        onClose={() => setActivePostModal(null)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Private Admin Modal Area */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        posts={posts}
        onSavePost={handleSavePost}
        onDeletePost={handleDeletePost}
        onTogglePublish={handleTogglePublish}
        onTogglePin={handleTogglePin}
        lookbookItems={lookbookItems}
        onSaveLookbookItem={handleSaveLookbookItem}
        onDeleteLookbookItem={handleDeleteLookbookItem}
        announcement={announcement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        bookings={bookings}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onDeleteBooking={handleDeleteBooking}
        onClearCompletedBookings={handleClearCompletedBookings}
        adminSession={adminSession}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
