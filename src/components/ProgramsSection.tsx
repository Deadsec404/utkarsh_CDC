import React, { useState } from 'react';
import { PROGRAMS, ProgramItem } from '../data/contentData';
import { 
  Activity, 
  MessageSquare, 
  BookOpen, 
  Dumbbell, 
  HeartHandshake, 
  Palette, 
  Monitor, 
  UtensilsCrossed,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ProgramsSectionProps {
  onSelectProgram: (programName: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgram }) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  const getProgramTheme = (id: string) => {
    switch (id) {
      case 'occupational-therapy':
        return {
          icon: <Activity className="w-6 h-6 text-white" />,
          grad: 'from-emerald-600 to-teal-500',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          hoverBorder: 'hover:border-emerald-400',
          accentBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white'
        };
      case 'speech-language-therapy':
        return {
          icon: <MessageSquare className="w-6 h-6 text-white" />,
          grad: 'from-rose-600 to-pink-500',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          hoverBorder: 'hover:border-rose-400',
          accentBtn: 'bg-rose-700 hover:bg-rose-800 text-white'
        };
      case 'special-education':
        return {
          icon: <BookOpen className="w-6 h-6 text-white" />,
          grad: 'from-amber-500 to-orange-500',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          hoverBorder: 'hover:border-amber-400',
          accentBtn: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      case 'physical-sports':
        return {
          icon: <Dumbbell className="w-6 h-6 text-white" />,
          grad: 'from-sky-600 to-blue-500',
          badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
          hoverBorder: 'hover:border-sky-400',
          accentBtn: 'bg-sky-700 hover:bg-sky-800 text-white'
        };
      case 'counseling-parent-support':
        return {
          icon: <HeartHandshake className="w-6 h-6 text-white" />,
          grad: 'from-purple-600 to-indigo-500',
          badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          hoverBorder: 'hover:border-purple-400',
          accentBtn: 'bg-purple-700 hover:bg-purple-800 text-white'
        };
      case 'art-craft-creative':
        return {
          icon: <Palette className="w-6 h-6 text-white" />,
          grad: 'from-fuchsia-600 to-rose-500',
          badgeBg: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
          hoverBorder: 'hover:border-fuchsia-400',
          accentBtn: 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white'
        };
      case 'computer-education':
        return {
          icon: <Monitor className="w-6 h-6 text-white" />,
          grad: 'from-cyan-600 to-blue-600',
          badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          hoverBorder: 'hover:border-cyan-400',
          accentBtn: 'bg-cyan-700 hover:bg-cyan-800 text-white'
        };
      case 'kitchen-adl-lifeskills':
        return {
          icon: <UtensilsCrossed className="w-6 h-6 text-white" />,
          grad: 'from-orange-500 to-amber-500',
          badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
          hoverBorder: 'hover:border-orange-400',
          accentBtn: 'bg-orange-600 hover:bg-orange-700 text-white'
        };
      default:
        return {
          icon: <Activity className="w-6 h-6 text-white" />,
          grad: 'from-teal-600 to-emerald-500',
          badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
          hoverBorder: 'hover:border-teal-400',
          accentBtn: 'bg-teal-700 hover:bg-teal-800 text-white'
        };
    }
  };

  const filteredPrograms = PROGRAMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="programs" className="py-20 sm:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with generous spacing */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-50 via-rose-50 to-amber-50 border border-slate-200 text-slate-800 text-xs font-bold mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Comprehensive Multidisciplinary Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight">
            Our 8 Core Programs & Therapies
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every child experiences developmental leaps when provided the right multisensory stimulus. We combine specialized pediatric therapy, schooling readiness, and everyday practical life skills.
          </p>

          {/* Interactive Filter Tabs with clean wrapping */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-100 rounded-2xl max-w-2xl mx-auto shadow-inner">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 8 Programs
            </button>
            <button
              onClick={() => setFilter('therapy')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === 'therapy'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Therapies (OT & Speech)
            </button>
            <button
              onClick={() => setFilter('education')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === 'education'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              Special Ed & Digital
            </button>
            <button
              onClick={() => setFilter('development')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === 'development'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              Sports & Creative Arts
            </button>
            <button
              onClick={() => setFilter('lifeskills')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === 'lifeskills'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-700'
              }`}
            >
              ADL Life Skills
            </button>
          </div>
        </div>

        {/* 8 Programs Responsive Grid with Spacious Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredPrograms.map((program: ProgramItem) => {
            const isExpanded = expandedProgramId === program.id;
            const theme = getProgramTheme(program.id);

            return (
              <div
                key={program.id}
                className={`flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl ${theme.hoverBorder} hover:-translate-y-1.5 transition-all duration-300 group`}
              >
                <div>
                  {/* Top Bar with Colorful Icon Box & Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${theme.grad} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300`}
                    >
                      {theme.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${theme.badgeBg}`}
                    >
                      {program.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0f3460] transition-colors leading-snug">
                    {program.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {program.shortDesc}
                  </p>

                  {/* Expandable deeper info */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>Who it supports:</span>
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {program.whoItIsFor}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                          Therapeutic Outcomes:
                        </h4>
                        <ul className="space-y-1.5">
                          {program.keyBenefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card footer actions with generous tap targets */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedProgramId(isExpanded ? null : program.id)}
                    className="text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors py-1.5 focus:outline-none"
                  >
                    {isExpanded ? 'Less Details' : 'View Full Details'}
                  </button>

                  <button
                    onClick={() => onSelectProgram(program.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white transition-all shadow-2xs"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrated Multidisciplinary Callout Banner with Spacious Padding */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-r from-[#0f3460] via-teal-900 to-indigo-900 text-white p-7 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  Need a Combined Multi-Therapy Package?
                </h4>
                <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl font-normal">
                  Many children thrive best with an integrated routine (such as Occupational Therapy + Speech Therapy + Special Education). Our team works together to synchronize goals so your child progresses faster.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectProgram('Integrated Multidisciplinary Program')}
              className="shrink-0 w-full sm:w-auto px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all transform active:scale-95 text-center"
            >
              Consult Clinical Team
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
