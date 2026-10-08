import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <article id="about" className="py-20 sm:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual feature matrix with rich gradient & floating badge */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl bg-gradient-to-tr from-[#0f3460] via-teal-900 to-indigo-950 p-7 sm:p-9 lg:p-10 text-white shadow-2xl overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-rose-500/15 blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-white/20 overflow-hidden">
                  <img
                    src="/Utrkarsh_logo.jpeg"
                    alt="Utkarsh Child Development Centre Logo"
                    className="w-full h-full object-cover object-center"
                    width="56"
                    height="56"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight uppercase">
                    Utkarsh Child Development Centre
                  </div>
                  <div className="text-xs text-amber-300 font-semibold tracking-wide">
                    Empowering Abilities · Enriching Lives
                  </div>
                </div>
              </div>

              <blockquote className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-white">
                "Every child blooms in their own time when given the right warmth, guidance, and patience."
              </blockquote>

              <p className="mt-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                At Utkarsh, we believe a diagnosis does not define a child's future. Our mission is to unlock each child's inherent potential so they can communicate clearly, play joyfully, and step into school and community life with pride.
              </p>

              {/* Statistics & Credibility metrics with mixed vibrant colors */}
              <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-300">8+</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-1">Core Therapies</div>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-teal-300">1 : 1</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-1">Personal Care</div>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-300">100%</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-1">Child Safe</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Story & Core Pillars with Comfortable Hierarchy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 sm:space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>About Utkarsh Child Development Centre</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight leading-tight">
              A Warm, Multidisciplinary Haven in Bhandup (East), Mumbai
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Utkarsh Child Development Centre was established with a clear goal: to provide children and their families with unified, compassionate developmental healthcare. Parents no longer need to shuttle across different clinics across Mumbai for occupational therapy, speech sessions, IQ tests, and special education.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Our multidisciplinary team—comprising certified Clinical Psychologists, Occupational Therapists, Speech-Language Pathologists, Special Educators, and Behavioral Counselors—works together as one cohesive family. We coordinate each child's milestones so exercises in speech align with sensory work in OT and daily routines at home.
            </p>

            {/* Checklist with Generous Spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  Standardized IQ and Autism evaluations with formal diagnostic reports
                </span>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  Dedicated Activities of Daily Living (ADL) & practical kitchen lab
                </span>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  Computer-assisted learning & assistive communication software
                </span>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  Empowering parent counseling & positive behavioral strategies
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 uppercase tracking-wider underline underline-offset-4"
              >
                Plan a Visit to our Bhandup (E) Centre
              </a>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
