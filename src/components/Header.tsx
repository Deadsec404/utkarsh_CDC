import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Menu, 
  X, 
  Phone, 
  CalendarCheck, 
  Sparkles, 
  MapPin, 
  Instagram, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Pre-Header Announcement Strip */}
      <div className="bg-gradient-to-r from-[#0f3460] via-teal-900 to-[#1e1b4b] text-white text-xs py-2 px-4 sm:px-6 relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Announcement with glowing indicator */}
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-semibold text-amber-300 shrink-0">Admissions Open 2026–27:</span>
            <span className="text-slate-200 truncate hidden sm:inline">
              Early Intervention & Therapies in Bhandup (E), Mumbai
            </span>
          </div>

          {/* Quick Connect & Instagram */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-[11px] font-medium">
            <a
              href="tel:8828551185"
              className="flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors"
              title="Call Utkarsh CDC Helpdesk"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span className="font-bold whitespace-nowrap">8828551185</span>
            </a>
            <span className="text-white/25 hidden md:inline">|</span>
            <a
              href="https://www.instagram.com/ucdc_2026"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-rose-300 hover:text-white transition-colors"
            >
              <Instagram className="w-3 h-3 shrink-0" />
              <span>@ucdc_2026</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean & Professional Navigation Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90 py-3'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Zone 1: Brand Wordmark / Logo */}
            <a
              href="#"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-2xl shrink-0"
              aria-label="Utkarsh Child Development Centre Home"
            >
              <BrandLogo size="navbar" />
            </a>

            {/* Zone 2: Streamlined 4 Core Links (Fits perfectly on all desktop screens) */}
            <nav
              className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-semibold text-slate-700"
              aria-label="Primary Navigation"
            >
              <a
                href="#programs"
                className="hover:text-teal-800 transition-colors whitespace-nowrap py-1"
              >
                Programs & Therapies
              </a>
              <a
                href="#assessments"
                className="hover:text-rose-800 transition-colors whitespace-nowrap py-1"
              >
                Assessments & IQ
              </a>
              <a
                href="#why-utkarsh"
                className="hover:text-indigo-800 transition-colors whitespace-nowrap py-1"
              >
                Why Utkarsh
              </a>
              <a
                href="#contact"
                className="hover:text-teal-800 transition-colors whitespace-nowrap py-1"
              >
                Contact & Visit
              </a>
            </nav>

            {/* Zone 3: Clean Primary Action CTA */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Admissions CTA */}
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4 text-white shrink-0" />
                <span>School Admissions</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0 hidden sm:inline" />
              </button>

              {/* Mobile / Tablet Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-teal-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-rose-600" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Full Links */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-5 pt-5 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Admissions Open</span>
            </button>
            <a
              href="tel:8828551185"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>8828551185</span>
            </a>
          </div>

          <div className="divide-y divide-slate-100 font-semibold text-sm text-slate-800">
            <a
              href="#programs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>8 Core Therapies & Programs</span>
                <span className="px-2 py-0.5 text-[10px] bg-teal-100 text-teal-800 rounded-full font-bold">
                  OT, Speech, ADL
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#assessments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>Psychologist, IQ & Autism Tests</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#triage"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>Milestone & Therapy Guide</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#why-utkarsh"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>Why Choose Utkarsh</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>About Centre</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>Frequently Asked Questions</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 hover:text-teal-700 transition-colors"
            >
              <span>Location, Directions & Hours</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Bhandup (E), Mumbai 400042
            </span>
            <a
              href="https://www.instagram.com/ucdc_2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 font-semibold hover:underline"
            >
              @ucdc_2026
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
