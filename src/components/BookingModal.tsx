import React, { useState } from 'react';
import { X, CheckCircle, Send, MessageSquare, Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { submitLead } from '../services/leadService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  presetService = 'School Admission Inquiry'
}) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [childAge, setChildAge] = useState('');
  const [service, setService] = useState(presetService);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (presetService) {
      setService(presetService);
    }
  }, [presetService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) {
      setError('Please provide parent name and contact number.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await submitLead({
        source: 'Booking Modal',
        parentName: parentName.trim(),
        phoneNumber: phone.trim(),
        childAge: childAge.trim() || undefined,
        selectedService: service,
        message: 'Lead captured via school admission & consultation booking modal'
      });
    } catch (leadErr) {
      console.log('Lead capture note:', leadErr);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Utkarsh Child Development Centre, I would like to book an appointment/admission visit for: ${service}. Parent: ${parentName}. Child Age: ${childAge || 'Not specified'}.`
    );
    window.open(`https://wa.me/918828551185?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 lg:p-9 my-auto overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Thank you, <strong className="text-slate-800">{parentName}</strong>. Our team at Utkarsh CDC will contact you at <strong className="text-slate-800">{phone}</strong> shortly to finalize your appointment.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect on WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
            <div>
              <BrandLogo variant="compact" />
              <h3 id="modal-title" className="text-lg sm:text-xl font-black text-slate-900 mt-3">
                School Admissions & Consultation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Visit our Bhandup centre or speak with our clinical coordinator.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit Mobile"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Child's Age
                </label>
                <input
                  type="text"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  placeholder="e.g. 3.5 yrs"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selected Program or Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white transition-all"
              >
                <option value="School Admission Inquiry">School Admissions Open (2026–2027)</option>
                <option value="Occupational Therapy (OT)">Occupational Therapy (OT)</option>
                <option value="Speech & Language Therapy">Speech & Language Therapy</option>
                <option value="Special Education">Special Education</option>
                <option value="Clinical Psychologist Consultation">Clinical Psychologist Consultation</option>
                <option value="Standardized IQ Test">IQ Test & Cognitive Profile</option>
                <option value="Comprehensive Autism Assessment">Autism Assessment (ASD)</option>
                <option value="Kitchen Activity & ADL Life Skills">Kitchen Activity & ADL (Life Skills)</option>
                <option value="Physical & Sports Activities">Physical & Sports Activities</option>
                <option value="Art & Craft Creative Development">Art & Craft / Creative Development</option>
                <option value="Computer Education">Computer Education</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSubmitting ? 'Recording...' : 'Submit Booking'}</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
