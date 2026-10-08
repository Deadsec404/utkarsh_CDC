import React from 'react';
import { WHY_CHOOSE_ITEMS } from '../data/contentData';
import { CheckCircle2, Heart, Award, Building, Star } from 'lucide-react';

interface WhyChooseUsProps {
  onContactClick: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onContactClick }) => {
  const getPillarColor = (idx: number) => {
    const colors = [
      { border: 'hover:border-teal-400', iconBg: 'bg-teal-100 text-teal-700' },
      { border: 'hover:border-rose-400', iconBg: 'bg-rose-100 text-rose-700' },
      { border: 'hover:border-amber-400', iconBg: 'bg-amber-100 text-amber-700' },
      { border: 'hover:border-indigo-400', iconBg: 'bg-indigo-100 text-indigo-700' },
      { border: 'hover:border-emerald-400', iconBg: 'bg-emerald-100 text-emerald-700' },
      { border: 'hover:border-purple-400', iconBg: 'bg-purple-100 text-purple-700' }
    ];
    return colors[idx % colors.length];
  };

  return (
    <section id="why-utkarsh" className="py-20 sm:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with generous vertical rhythm */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>Dedicated to Your Child's Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight">
            Why Parents Choose Utkarsh CDC
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We understand that navigating developmental delays can feel stressful. At Utkarsh, we combine clinical expertise with warm, human empathy to guide your family with confidence.
          </p>
        </div>

        {/* 6 Core Pillars Grid with Spacious Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const styling = getPillarColor(index);
            return (
              <div
                key={index}
                className={`p-7 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:bg-white ${styling.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl ${styling.iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-110 transition-transform`}>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#0f3460] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Facility Showcase Cards with Spacious Padding */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-r from-teal-50 via-slate-50 to-amber-50 border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-center text-center md:text-left">
            
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">100% Child-Centered</div>
                <div className="text-xs sm:text-sm text-slate-600 mt-0.5">Patience, warmth, and individualized respect</div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building className="w-7 h-7" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">Modern Bhandup Centre</div>
                <div className="text-xs sm:text-sm text-slate-600 mt-0.5">Sensory gym, OT equipment, life skills kitchen</div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">Empowering Families</div>
                <div className="text-xs sm:text-sm text-slate-600 mt-0.5">Practical home coaching for lasting progress</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
