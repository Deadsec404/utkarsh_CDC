import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { submitLead } from '../services/leadService';

interface ContactSectionProps {
  initialService?: string;
  onClearInitialService?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  initialService = '', 
  onClearInitialService 
}) => {
  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedService, setSelectedService] = useState(initialService || 'School Admission Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await submitLead({
        source: 'Contact Form',
        parentName: parentName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        childName: childName.trim() || undefined,
        childAge: childAge.trim() || undefined,
        selectedService: selectedService,
        message: message.trim() || 'Direct consultation request from website contact form'
      });
    } catch (leadErr) {
      console.log('Lead capture note:', leadErr);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Utkarsh Child Development Centre, I would like to inquire about: ${selectedService || 'Developmental Services'}. Child: ${childName || 'Child'} (Age: ${childAge || 'N/A'}). Parent Name: ${parentName || 'Parent'}.`
    );
    window.open(`https://wa.me/918828551185?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const quickPills = [
    'School Admission Inquiry',
    'Occupational Therapy (OT)',
    'Speech & Language Therapy',
    'Autism Assessment',
    'Standardized IQ Test',
    'Kitchen & ADL Life Skills'
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Decorative ambient color spots */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with generous vertical rhythm */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Connect with Our Bhandup Centre</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3460] tracking-tight">
            Schedule a Visit or Consultation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We are here to support your child's journey with warmth, patience, and clinical excellence. Reach out to tour our centre, inquire about admissions, or book an evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          
          {/* Left Column: Official Contact & Address Details */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Centre Location Card with Comfortable Padding */}
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Utkarsh Child Development Centre
                  </h3>
                  <span className="text-xs text-teal-700 font-semibold">Bhandup (East), Mumbai</span>
                </div>
              </div>

              <address className="not-italic text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 font-normal">
                Saurabh CHS, B Wing,<br />
                Hanuman Mandir Road, Datar Colony,<br />
                Bhandup (East), Mumbai, Maharashtra – 400042
              </address>

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Monday – Saturday: 9:00 AM – 7:00 PM</span>
              </div>
            </div>

            {/* Direct Connect Action Cards with Color Accents */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Phone */}
              <a
                href="tel:8828551185"
                className="flex items-center gap-4 p-4.5 sm:p-5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Direct Call / Helpdesk
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-700">
                    +91 8828551185
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:utkarshcdc2026@gmail.com"
                className="flex items-center gap-4 p-4.5 sm:p-5 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Official Email
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 truncate">
                    utkarshcdc2026@gmail.com
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ucdc_2026"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4.5 sm:p-5 rounded-2xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Instagram Updates & Stories
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-700">
                    @ucdc_2026
                  </div>
                </div>
              </a>
            </div>

            {/* Location Advantage Note */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200/80 text-xs sm:text-sm text-teal-950 leading-relaxed font-normal">
              <strong className="text-teal-900 font-bold block mb-1">Location Note:</strong>
              Conveniently situated in Bhandup (East) near Hanuman Mandir Road, with direct road connectivity from Mulund, Kanjurmarg, and Powai.
            </div>

          </div>

          {/* Right Column: Interactive Consultation & Admission Form with Generous Padding */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 lg:p-10 shadow-lg">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Thank You, {parentName}!
                </h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed font-normal">
                  We have received your request for <strong className="text-slate-900 font-bold">{selectedService}</strong>. Our clinical coordinator will call you at <strong className="text-slate-900 font-bold">{phoneNumber}</strong> to confirm your slot and guide you with next steps.
                </p>

                <div className="pt-5 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-95 text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      if (onClearInitialService) onClearInitialService();
                    }}
                    className="w-full sm:w-auto px-5 py-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors text-center"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Book a Consultation / Admission Visit
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Fill out the form below and our clinical team will get in touch within 24 hours.
                  </p>
                </div>

                {/* Quick Select Pills for Services with Clean Wrapping */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Quick Choose Your Interest:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickPills.map((pill) => (
                      <button
                        type="button"
                        key={pill}
                        onClick={() => setSelectedService(pill)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors border ${
                          selectedService === pill
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Meera Patil"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 98200XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Child’s Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Child’s first name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Child’s Age
                    </label>
                    <input
                      type="text"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      placeholder="e.g. 4.5 years"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Selected Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all"
                  >
                    <option value="School Admission Inquiry">School Admissions (2026–2027)</option>
                    <option value="Occupational Therapy (OT)">Occupational Therapy (OT)</option>
                    <option value="Speech & Language Therapy">Speech & Language Therapy</option>
                    <option value="Special Education">Special Education & Remedial Learning</option>
                    <option value="Clinical Psychologist Consultation">Clinical Psychologist Consultation</option>
                    <option value="Standardized IQ Test">IQ Test & Cognitive Assessment</option>
                    <option value="Comprehensive Autism Assessment">Autism Assessment (ASD)</option>
                    <option value="Kitchen Activity & ADL Life Skills">Kitchen Activity & ADL (Life Skills)</option>
                    <option value="Physical & Sports Activities">Physical & Sports Activities</option>
                    <option value="Art & Craft Creative Development">Art & Craft / Creative Development</option>
                    <option value="Computer Education">Computer Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Questions or Child’s Current Needs (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your child's milestones, school experience, or any questions you have..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-95 text-center disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Recording...' : 'Submit Request'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-95 text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 pt-1 font-normal">
                  All discussions and records are treated with complete medical confidentiality.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
