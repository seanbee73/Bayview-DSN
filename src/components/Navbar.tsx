import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Phone, MapPin, Sparkles, Lock, Newspaper } from 'lucide-react';
import { BRAND_DATA, ANNOUNCEMENT_DATA } from '../data/salonData';
import { AnnouncementInfo } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenBooking: () => void;
  announcement?: AnnouncementInfo;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  onOpenBooking,
  announcement = ANNOUNCEMENT_DATA,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 transition-colors duration-300">
      {/* Announcement Bar */}
      {announcement.show && (
        <div className="bg-[#1D1D1D] dark:bg-black text-[#FAF9F6] border-b border-white/10 px-4 py-2 text-[11px] font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="bg-[#9A8C73] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                {announcement.badge}
              </span>
              <span className="font-serif italic text-white/90 hidden md:inline">
                {announcement.text}
              </span>
              <span className="text-white/70 text-[11px]">
                {announcement.subtext}
              </span>
            </div>
            <a
              href={BRAND_DATA.phoneTel}
              className="inline-flex items-center gap-1.5 text-[#C4B7A6] hover:text-white transition-colors font-medium tracking-wide"
            >
              <Phone size={12} />
              <span>{BRAND_DATA.phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="w-full bg-[#FAF9F6]/95 dark:bg-[#141414]/95 backdrop-blur-md border-b border-[#1D1D1D]/10 dark:border-white/10 h-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group" id="brand-logo">
            <div className="w-9 h-9 bg-[#1D1D1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#1D1D1D] flex items-center justify-center rounded-none group-hover:bg-[#9A8C73] group-hover:text-white transition-colors duration-300 font-bold text-xs tracking-wider">
              {BRAND_DATA.logoInitials}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl tracking-tight text-[#1D1D1D] dark:text-[#FAF9F6] font-normal leading-tight">
                BAYVIEW MALL
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#9A8C73] font-semibold">
                Creative Hair Dsn
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-7 font-sans">
            <a
              href="#heritage"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Heritage
            </a>
            <a
              href="#services"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Services
            </a>
            <a
              href="#craftsmen"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Craftsmen
            </a>
            <a
              href="#reviews"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Reviews
            </a>
            <a
              href="#lookbook"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Archive
            </a>
            <a
              href="#journal"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Journal
            </a>
            <a
              href="#location"
              className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity font-medium text-[#1D1D1D]/80 dark:text-white/80"
            >
              Hours & Location
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={BRAND_DATA.phoneTel}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#1D1D1D] dark:text-[#FAF9F6] hover:text-[#9A8C73] transition-colors py-2 px-3 border border-transparent hover:border-[#9A8C73]"
            >
              <Phone size={14} className="text-[#9A8C73]" />
              <span className="font-mono">{BRAND_DATA.phone}</span>
            </a>

            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 text-[#1D1D1D] dark:text-[#FAF9F6] hover:text-[#9A8C73] dark:hover:text-[#9A8C73] transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={20} id="sun-icon" className="transition-transform hover:rotate-45" />
              ) : (
                <Moon size={20} id="moon-icon" className="transition-transform hover:-rotate-12" />
              )}
            </button>

            <button
              id="nav-book-now"
              onClick={onOpenBooking}
              className="hidden sm:flex items-center gap-2 bg-[#1D1D1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#1D1D1D] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#9A8C73] hover:text-white dark:hover:bg-[#9A8C73] dark:hover:text-white transition-colors rounded-none cursor-pointer"
            >
              Book Cut
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF9F6] dark:bg-[#141414] border-b border-[#1D1D1D]/10 dark:border-white/10 px-6 py-6 transition-all duration-300">
            <div className="flex flex-col space-y-4 font-sans">
              <a
                href="#heritage"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                The Heritage
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Services & Pricing
              </a>
              <a
                href="#craftsmen"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Master Craftsmen
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Client Reviews (4.7 ★)
              </a>
              <a
                href="#lookbook"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Style Archive
              </a>
              <a
                href="#journal"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Journal & News
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium"
              >
                Hours & Mall Location
              </a>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-left text-xs uppercase tracking-[0.2em] text-[#9A8C73] hover:text-white font-semibold flex items-center gap-1.5 pt-1"
                >
                  <Lock size={12} /> Admin Portal {isAdmin && '(Active)'}
                </button>
              )}

              <button
                onClick={onToggleTheme}
                className="text-left text-xs uppercase tracking-[0.2em] text-[#1D1D1D] dark:text-white hover:text-[#9A8C73] font-medium flex items-center justify-between py-2 border-t border-[#1D1D1D]/10 dark:border-white/10 mt-2"
              >
                <span className="flex items-center gap-2">
                  {darkMode ? <Sun size={14} className="text-[#9A8C73]" /> : <Moon size={14} className="text-[#9A8C73]" />}
                  <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </span>
                <span className="text-[10px] text-[#9A8C73] font-bold uppercase">{darkMode ? 'Dark' : 'Light'}</span>
              </button>
              <div className="pt-4 border-t border-[#1D1D1D]/10 dark:border-white/10 flex flex-col gap-3">
                <a
                  href={BRAND_DATA.phoneTel}
                  className="w-full bg-white/10 dark:bg-white/5 border border-[#1D1D1D]/15 dark:border-white/15 text-[#1D1D1D] dark:text-white py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#9A8C73] hover:text-white transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Phone size={14} /> Call {BRAND_DATA.phone}
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full bg-[#1D1D1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#1D1D1D] py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#9A8C73] hover:text-white transition-colors rounded-none"
                >
                  Request Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

