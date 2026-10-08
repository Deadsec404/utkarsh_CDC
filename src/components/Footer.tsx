import React from 'react';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, Mail, Instagram, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-16 sm:pt-24 sm:pb-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-14 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="sm:col-span-2 space-y-4">
            <BrandLogo lightText showTagline size="footer" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-2 font-normal">
              Utkarsh Child Development Centre is a specialized multidisciplinary pediatric centre in Bhandup (East), Mumbai. Dedicated to empowering abilities, nurturing young minds, and building bright futures through personalized care.
            </p>
            <div className="text-xs text-slate-400 pt-1 font-medium">
              <strong className="text-white">Admissions Open:</strong> School batches, early intervention, and therapy sessions.
            </div>
          </div>

          {/* Col 3: Programs Directory */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Core Therapies
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#programs" className="hover:text-white transition-colors">Occupational Therapy (OT)</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Speech & Language Therapy</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Special Education</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Kitchen & ADL Life Skills</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Physical & Sports Activities</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Art & Craft Creative Play</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Computer Education</a></li>
            </ul>
          </div>

          {/* Col 4: Clinical & Testing */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Assessments & Testing
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#assessments" className="hover:text-white transition-colors">Clinical Psychologist</a></li>
              <li><a href="#assessments" className="hover:text-white transition-colors">Standardized IQ Test</a></li>
              <li><a href="#assessments" className="hover:text-white transition-colors">Autism Assessment (ASD)</a></li>
              <li><a href="#assessments" className="hover:text-white transition-colors">Cognitive Profiles</a></li>
              <li><a href="#triage" className="hover:text-white transition-colors">Developmental Screening</a></li>
              <li><a href="#why-utkarsh" className="hover:text-white transition-colors">Parent Coaching</a></li>
            </ul>
          </div>

          {/* Col 5: Contact Summary */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Visit Us in Mumbai
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Saurabh CHS, B Wing, Hanuman Mandir Rd, Datar Colony, Bhandup (E), Mumbai 400042</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:8828551185" className="hover:text-white">+91 8828551185</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:utkarshcdc2026@gmail.com" className="hover:text-white truncate">utkarshcdc2026@gmail.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="https://www.instagram.com/ucdc_2026" target="_blank" rel="noopener noreferrer" className="hover:text-white">@ucdc_2026</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Clean Spacing */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Utkarsh Child Development Centre. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#programs" className="hover:text-white transition-colors">Programs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
