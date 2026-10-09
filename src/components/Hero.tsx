import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  PhoneCall, 
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Activity,
  MessageSquare,
  BookOpen,
  UtensilsCrossed
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'ot' | 'speech' | 'education' | 'adl'>('ot');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/90 via-sky-50/50 to-white pt-8 pb-20 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28 border-b border-slate-200">
      {/* Decorative mixed-color ambient mesh orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-200/35 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Banner with Comfortable Padding */}
        <div className="flex justify-center mb-6 sm:mb-10 w-full px-1">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 shadow-xs text-slate-800 text-[11px] sm:text-sm font-semibold hover:border-rose-400 transition-all max-w-full">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 bg-clip-text text-transparent font-bold">
              School Admissions Open 2026–2027
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-teal-700 font-medium hidden sm:inline truncate">
              Nurturing Young Minds · Building Bright Futures
            </span>
          </div>
        </div>

        {/* 2-Column Hero: Left Headline & CTA, Right Interactive Visual Centre Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column (Headline, Value Proposition, Action CTAs) */}
          <div className="lg:col-span-7 text-left space-y-5 sm:space-y-7">
            <div className="space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100/80 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>Empowering Abilities · Enriching Lives</span>
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#0f3460] tracking-tight leading-[1.2] break-words">
                Every Child Deserves to <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  Shine, Speak & Grow
                </span>
                <span className="text-amber-500">.</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal pt-1 max-w-2xl">
                At <strong className="text-slate-900 font-semibold">Utkarsh Child Development Centre</strong> in Bhandup (East), Mumbai, we provide comprehensive, joyful care for children. From early intervention and speech clarity to sensory integration, standardized IQ & Autism testing, and everyday life skills.
              </p>
            </div>

            {/* Quick Action CTAs with generous tap targets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 text-center"
              >
                <span>Apply for School Admission</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href="tel:8828551185"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all hover:border-teal-400 text-center"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <span>Call 8828551185</span>
              </a>

              <a
                href="#triage"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-4 rounded-xl text-teal-800 hover:text-teal-950 font-bold text-xs transition-colors hover:underline text-center"
              >
                <span>Milestone Guide</span>
              </a>
            </div>

            {/* Micro Trust Indicators with generous spacing */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Bhandup (E), Mumbai 400042</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Mon – Sat: 9 AM – 7 PM</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Clinical Psychologist On-Site</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Visual Centre Preview Card with Clean Responsive Tabs */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white p-5 sm:p-8 shadow-xl border border-slate-200/90 overflow-hidden">
              {/* Decorative top ribbon */}
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-rose-500" />

              <div className="flex items-center justify-between mb-4 sm:mb-5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Explore Learning Facilities
                  </span>
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Bhandup Centre
                </span>
              </div>

              {/* Segmented responsive tabs (2x2 on mobile, 4 in row on sm+) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 sm:p-1.5 bg-slate-100 rounded-2xl mb-5 sm:mb-6">
                <button
                  onClick={() => setActiveTab('ot')}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    activeTab === 'ot'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sensory OT
                </button>
                <button
                  onClick={() => setActiveTab('speech')}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    activeTab === 'speech'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Speech Lab
                </button>
                <button
                  onClick={() => setActiveTab('education')}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    activeTab === 'education'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Special Ed
                </button>
                <button
                  onClick={() => setActiveTab('adl')}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    activeTab === 'adl'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ADL Kitchen
                </button>
              </div>

              {/* Dynamic Content Panel based on active tab with Generous Padding */}
              {activeTab === 'ot' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-emerald-950 leading-tight">
                          Pediatric Sensory Integration Gym
                        </h3>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Sensory swings, tactile mats & fine motor tools
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-xs text-emerald-900 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Balances sensory reactivity & calming routines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Improves pencil grip, sitting tolerance & handwriting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Boosts bilateral hand coordination & body balance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'speech' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-rose-950 leading-tight">
                          Speech & Language Development Studio
                        </h3>
                        <p className="text-xs text-rose-800 mt-0.5">
                          Gentle acoustics, mirror therapy & visual flashcard tools
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-xs text-rose-900 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Early word formation and vocabulary expansion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Articulation, stammering & pronunciation support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Social conversational turn-taking with peers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-amber-950 leading-tight">
                          Remedial & Special Education Class
                        </h3>
                        <p className="text-xs text-amber-800 mt-0.5">
                          Customized IEPs (Individualized Education Programs)
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-xs text-amber-900 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>Multisensory reading, phonics and numeracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>Strengthens memory retention & school readiness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>Remediation for dyslexia, dyscalculia and ADHD</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'adl' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-indigo-950 leading-tight">
                          ADL (Life Skills) Practice Lab
                        </h3>
                        <p className="text-xs text-indigo-800 mt-0.5">
                          Child-safe kitchen, dining & personal hygiene practice
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-xs text-indigo-900 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>Self-feeding, pouring drinks & table manners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>Packing school bags, buttoning & personal hygiene</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>Independence in real everyday home situations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Bottom Quick Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Want to tour our facilities?</span>
                <button
                  onClick={onOpenBooking}
                  className="text-teal-700 hover:text-teal-900 font-bold underline underline-offset-4"
                >
                  Book a Visit Today
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Guiding Pillars from Poster (Spacious & Clean Layout) */}
        <div className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-slate-200/90">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-[#0f3460]">
              Our 4 Guiding Commitments to Every Child
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Pillar 1 - Teal */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-400 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mb-4 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Safe & Child-Friendly
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Padded sensory gym floors, calming lighting, and non-toxic equipment for anxiety-free development.
              </p>
            </div>

            {/* Pillar 2 - Rose */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-rose-200/80 shadow-xs hover:shadow-md hover:border-rose-400 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center mb-4 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Personalized 1:1 Attention
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Small batches and customized therapy sessions crafted specifically around your child's pace.
              </p>
            </div>

            {/* Pillar 3 - Amber */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mb-4 shadow-xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Overall Holistic Growth
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connecting physical strength, speech clarity, cognitive learning, emotional calmness, and life skills.
              </p>
            </div>

            {/* Pillar 4 - Indigo */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center mb-4 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Qualified Professionals
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Licensed Clinical Psychologists, Occupational Therapists, Speech Pathologists, and Special Educators.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
