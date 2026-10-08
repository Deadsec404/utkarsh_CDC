import React, { useState } from 'react';
import { TRIAGE_CONCERNS, PROGRAMS } from '../data/contentData';
import { Search, Check, ArrowRight, Compass } from 'lucide-react';

interface InteractiveTriageProps {
  onSelectRecommended: (serviceTitle: string) => void;
}

export const InteractiveTriage: React.FC<InteractiveTriageProps> = ({ onSelectRecommended }) => {
  const [selectedConcernId, setSelectedConcernId] = useState<string>(TRIAGE_CONCERNS[0].id);

  const selectedConcern = TRIAGE_CONCERNS.find((c) => c.id === selectedConcernId) || TRIAGE_CONCERNS[0];

  const matchedPrograms = PROGRAMS.filter((p) =>
    selectedConcern.recommendedPrograms.includes(p.id)
  );

  return (
    <section id="triage" className="py-20 sm:py-28 bg-gradient-to-br from-[#0c2e59] via-[#0f3460] to-[#0a1e38] text-white relative overflow-hidden">
      {/* Dynamic ambient color gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with generous spacing */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 text-xs font-bold mb-3.5 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Interactive Developmental Triage Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Find the Right Support for Your Child
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Unsure which therapy or assessment your child needs first? Choose the area where you notice challenges below to discover a proven pathway.
          </p>
        </div>

        {/* Interactive Grid: Left Selectors, Right Recommendations with Spacious Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
          
          {/* Left: Concern Selector Buttons with comfortable touch areas */}
          <div className="lg:col-span-5 space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-1">
              Select What You'd Like Support With:
            </span>

            {TRIAGE_CONCERNS.map((concern, idx) => {
              const isSelected = selectedConcernId === concern.id;
              return (
                <button
                  key={concern.id}
                  onClick={() => setSelectedConcernId(concern.id)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border transform active:scale-98 ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-xl sm:translate-x-1'
                      : 'bg-white/10 hover:bg-white/15 text-slate-100 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sm sm:text-base leading-snug">
                      {concern.label}
                    </span>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">0{idx + 1}</span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      isSelected ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {concern.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Recommendation Card with Glassmorphic styling and generous inner padding */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-7 sm:p-9 lg:p-10 shadow-2xl border border-slate-100 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>Personalized Guidance</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              Recommended Plan for: <br />
              <span className="text-teal-700">{selectedConcern.label}</span>
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Based on these developmental signs, our multidisciplinary team recommends beginning with the following evidence-based sessions:
            </p>

            {/* Matched Programs Grid with Clean Gaps */}
            <div className="mt-6 sm:mt-7 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Primary Recommended Therapies:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{prog.title}</h4>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {prog.shortDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectRecommended(prog.title)}
                      className="mt-3.5 text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5"
                    >
                      <span>Inquire for {prog.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic recommendation note */}
            <div className="mt-6 sm:mt-7 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong className="font-bold text-amber-900 block mb-1">
                Diagnostic Assessment Guidance:
              </strong>
              {selectedConcern.recommendedAssessments.includes('autism-assessment')
                ? 'We recommend scheduling a formal Autism Spectrum Assessment or Clinical Psychology evaluation with our psychologist for early identification and milestone mapping.'
                : 'A Standardized IQ / Cognitive Profile or Developmental Screening will identify learning styles, attention span, and school curriculum accommodations.'}
            </div>

            {/* Action Bar */}
            <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                Our specialists will tailor a program specifically for your child.
              </span>
              <button
                onClick={() => onSelectRecommended(`Consultation for ${selectedConcern.label}`)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-95 text-center"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
