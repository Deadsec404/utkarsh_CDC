import React, { useState } from 'react';
import { FAQS } from '../data/contentData';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with comfortable spacing */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold mb-3.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>Parent Questions & Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Clear, honest answers to help parents make informed decisions for their child’s development.
          </p>
        </div>

        {/* Accordion List with Spacious Padding */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-5 sm:py-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-teal-100 text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner with generous spacing */}
        <div className="mt-12 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">Have a specific question about your child?</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Our compassionate team is always happy to talk and guide you.</p>
          </div>
          <a
            href="tel:8828551185"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 8828551185</span>
          </a>
        </div>

      </div>
    </section>
  );
};
