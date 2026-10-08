import React from 'react';
import { ASSESSMENTS, AssessmentItem } from '../data/contentData';
import { Brain, FileCheck, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface ClinicalAssessmentsProps {
  onBookAssessment: (assessmentName: string) => void;
}

export const ClinicalAssessments: React.FC<ClinicalAssessmentsProps> = ({ onBookAssessment }) => {
  const getCardDesign = (id: string) => {
    switch (id) {
      case 'clinical-psychologist':
        return {
          icon: <Brain className="w-6 h-6 text-white" />,
          grad: 'from-emerald-600 to-teal-500',
          borderColor: 'border-emerald-200 hover:border-emerald-400',
          tagBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
          btnBg: 'bg-emerald-700 hover:bg-emerald-800'
        };
      case 'iq-test':
        return {
          icon: <FileCheck className="w-6 h-6 text-white" />,
          grad: 'from-sky-600 to-indigo-600',
          borderColor: 'border-sky-200 hover:border-sky-400',
          tagBg: 'bg-sky-50 text-sky-800 border border-sky-200',
          btnBg: 'bg-sky-700 hover:bg-sky-800'
        };
      case 'autism-assessment':
        return {
          icon: <Sparkles className="w-6 h-6 text-white" />,
          grad: 'from-rose-600 to-pink-500',
          borderColor: 'border-rose-200 hover:border-rose-400',
          tagBg: 'bg-rose-50 text-rose-800 border border-rose-200',
          btnBg: 'bg-rose-700 hover:bg-rose-800'
        };
      default:
        return {
          icon: <Brain className="w-6 h-6 text-white" />,
          grad: 'from-teal-600 to-emerald-500',
          borderColor: 'border-teal-200 hover:border-teal-400',
          tagBg: 'bg-teal-50 text-teal-800 border border-teal-200',
          btnBg: 'bg-teal-700 hover:bg-teal-800'
        };
    }
  };

  return (
    <section id="assessments" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with generous spacing */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3.5">
            <Award className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Certified Diagnostic & Psychological Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight">
            Clinical Psychologist & Standardized Testing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Understanding your child’s cognitive processing, emotional patterns, and neurodivergent profile replaces doubt with clarity. Our on-site Clinical Psychologist provides certified testing in a warm, child-friendly atmosphere.
          </p>
        </div>

        {/* 3 Core Clinical Services Cards with Spacious Padding */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-9">
          {ASSESSMENTS.map((item: AssessmentItem) => {
            const design = getCardDesign(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-7 sm:p-8 lg:p-9 border ${design.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Header Icon + Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${design.grad} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {design.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-[#0f3460] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className={`text-xs font-bold px-3 py-1.5 rounded-xl mb-4.5 ${design.tagBg}`}>
                    {item.tagline}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                  {/* What We Evaluate */}
                  <div className="space-y-2.5 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Standardized Evaluation Includes:
                    </h4>
                    <ul className="space-y-2">
                      {item.whatWeEvaluate.map((point, index) => (
                        <li key={index} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome Box */}
                  <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Formal Report & Next Steps:
                    </strong>
                    {item.outcome}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-7 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onBookAssessment(item.title)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white ${design.btnBg} transition-all shadow-xs`}
                  >
                    <span>Schedule {item.title.split(' ')[0]} Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Early Assessment Matters Callout with Mixed Colors */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-r from-amber-50 via-teal-50 to-sky-50 border border-slate-200/80 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              Why Early Identification Empowers Your Child
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Between ages 2 and 7, neural pathways form rapidly. Certified psychological assessments pinpoint exact strengths, sensory triggers, and cognitive patterns—empowering parents and educators with an actionable game plan rather than guesswork.
            </p>
          </div>
          <button
            onClick={() => onBookAssessment('Psychological Consultation')}
            className="shrink-0 w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md transform active:scale-95 text-center"
          >
            Speak to Psychologist
          </button>
        </div>

      </div>
    </section>
  );
};
