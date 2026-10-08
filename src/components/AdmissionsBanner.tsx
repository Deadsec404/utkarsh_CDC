import React from 'react';
import { Sparkles, Calendar, CheckCircle2, ArrowRight, BookOpen, GraduationCap, Clock, Star } from 'lucide-react';

interface AdmissionsBannerProps {
  onOpenBooking: () => void;
}

export const AdmissionsBanner: React.FC<AdmissionsBannerProps> = ({ onOpenBooking }) => {
  return (
    <section id="admissions" className="py-20 sm:py-28 bg-gradient-to-br from-[#0f3460] via-[#1a2e56] to-[#091b33] text-white relative overflow-hidden">
      {/* Decorative ambient multi-colored glow spheres */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Admissions Headline & Value Offer */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Admissions Badge with energetic ribbon styling */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
              <Star className="w-4 h-4 fill-slate-950 stroke-none shrink-0" />
              <span>School Admissions Open 2026–2027</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.18]">
              Give Your Child the <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                Right Developmental Foundation
              </span>
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Utkarsh Child Development Centre is now enrolling children for our specialized early intervention batches, school-readiness groups, and individualized remedial classrooms in Bhandup (East).
            </p>

            {/* 4 Feature Cards with Spacious, Professional Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-amber-400/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Ages 2–6 Batches
                  </div>
                  <div className="text-sm font-semibold text-slate-100 truncate">
                    Early Intervention
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-teal-400/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-teal-300 uppercase tracking-wide">
                    Ages 6–14 Batches
                  </div>
                  <div className="text-sm font-semibold text-slate-100 truncate">
                    Remedial Special Education
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-rose-400/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-rose-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                    1:1 Individualized Care
                  </div>
                  <div className="text-sm font-semibold text-slate-100 truncate">
                    Speech & OT Therapy
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-indigo-400/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-indigo-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                    ADL Life Skills Lab
                  </div>
                  <div className="text-sm font-semibold text-slate-100 truncate">
                    Daily Independence & Self-Help
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons with comfortable spacing */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform active:scale-95 text-center"
              >
                <span>Book Admission Assessment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              </button>

              <a
                href="tel:8828551185"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md text-center"
              >
                <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Visit Campus (Bhandup E)</span>
              </a>
            </div>

          </div>

          {/* Right Column: 4-Step Simple Admission Process with Spacious Step Cards */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-9 border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-6 h-6 text-amber-300 shrink-0" />
                <h3 className="text-lg font-black text-white">4-Step Enrollment</h3>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
                Session 2026–27
              </span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Free Initial Orientation</h4>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">Tour our child-friendly Bhandup facility and discuss your goals with our coordinator.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Developmental Milestone Review</h4>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">Gentle assessment of motor coordination, speech clarity, and cognitive attention.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-rose-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Customized Roadmap (IEP)</h4>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">We outline measurable quarterly goals tailored specifically for your child.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  04
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Classroom Start & Parent Coaching</h4>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">Begin supportive sessions with weekly parent check-ins and home activity guides.</p>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                Morning & Afternoon Batches
              </span>
              <span className="text-amber-300 font-bold">Limited Cohort Size</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
