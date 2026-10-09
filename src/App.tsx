/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdmissionsBanner } from './components/AdmissionsBanner';
import { AboutSection } from './components/AboutSection';
import { ProgramsSection } from './components/ProgramsSection';
import { ClinicalAssessments } from './components/ClinicalAssessments';
import { InteractiveTriage } from './components/InteractiveTriage';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPage } from './components/AdminPage';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('School Admission Inquiry');

  // Check if current URL is the private /admin route
  const checkIsAdminRoute = () => {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    return (
      hash === '#admin' ||
      hash.startsWith('#admin') ||
      hash === '#login' ||
      pathname === '/admin' ||
      pathname.startsWith('/admin') ||
      search.includes('admin=true')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Staff hotkey: Ctrl + Shift + A or Cmd + Shift + A toggles admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminRoute((prev) => {
          const next = !prev;
          if (next) {
            window.history.pushState(null, '', '/admin');
          } else {
            window.history.pushState(null, '', '/');
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    } else {
      setSelectedService('School Admission Inquiry');
    }
    setIsBookingModalOpen(true);
  };

  const handleScrollToContactWithService = (serviceName: string) => {
    setSelectedService(serviceName);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello Utkarsh Child Development Centre, I would like to inquire about School Admissions and Therapies.'
    );
    window.open(`https://wa.me/918828551185?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
  };

  // ---------------------------------------------------------------------------
  // Dedicated /admin Route: Staff Login & Lead Management Dashboard
  // ---------------------------------------------------------------------------
  if (isAdminRoute) {
    return <AdminPage onExit={handleExitAdmin} />;
  }

  // ---------------------------------------------------------------------------
  // Public Website: 100% Clean, No Staff/Admin buttons visible
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 pb-20 sm:pb-0">
      {/* Skip to Main Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-teal-700 text-white rounded-md font-semibold text-xs shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navigation Bar (No admin or staff buttons) */}
      <Header
        onOpenBooking={() => handleOpenBooking('School Admission Inquiry')}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking('School Admission Inquiry')} />

        {/* Admissions Spotlight Announcement */}
        <AdmissionsBanner onOpenBooking={() => handleOpenBooking('School Admission Inquiry')} />

        {/* About Section */}
        <AboutSection />

        {/* 8 Core Programs & Therapies with Distinct Themes */}
        <ProgramsSection onSelectProgram={handleScrollToContactWithService} />

        {/* Clinical Psychologist, IQ & Autism Assessments */}
        <ClinicalAssessments onBookAssessment={handleScrollToContactWithService} />

        {/* Interactive Milestone & Therapy Triage Tool */}
        <InteractiveTriage onSelectRecommended={handleScrollToContactWithService} />

        {/* Why Choose Utkarsh */}
        <WhyChooseUs onContactClick={() => handleOpenBooking('General Inquiry')} />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Location, Contact & Interactive Booking Form */}
        <ContactSection
          initialService={selectedService}
          onClearInitialService={() => setSelectedService('')}
        />
      </main>

      {/* Footer (No staff or admin buttons) */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button at Corner */}
      <FloatingWhatsApp />

      {/* Quick Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        presetService={selectedService}
      />

      {/* Floating Bottom Quick-Action Dock for Mobile Users with iOS Safe Area support */}
      <aside
        aria-label="Quick Mobile Actions"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl block sm:hidden"
      >
        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:8828551185"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold active:bg-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Call</span>
          </a>

          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold active:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => handleOpenBooking('School Admission Inquiry')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-bold shadow-xs active:opacity-90 transition-opacity"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Admissions</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
