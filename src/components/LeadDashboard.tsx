import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Users,
  Search,
  Download,
  Plus,
  RefreshCw,
  LogOut,
  Lock,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  Send,
  SlidersHorizontal,
  FileSpreadsheet,
  Check,
  Baby,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  Lead,
  SmtpConfigInfo,
  loginAdmin,
  logoutAdmin,
  fetchLeads,
  updateLead,
  deleteLead,
  getSmtpStatus,
  testSmtpEmail,
  submitLead,
  getStoredAdminToken
} from '../services/leadService';

interface LeadDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getStoredAdminToken()));
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Leads Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [smtpInfo, setSmtpInfo] = useState<SmtpConfigInfo | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  // Manual Lead Creation Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newService, setNewService] = useState('School Admission Inquiry');
  const [newMessage, setNewMessage] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  // SMTP Test State
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load data when authenticated and open
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    setIsLoadingLeads(true);
    setErrorMsg('');
    try {
      const [leadsData, smtpData] = await Promise.allSettled([
        fetchLeads(),
        getSmtpStatus()
      ]);

      if (leadsData.status === 'fulfilled') {
        setLeads(leadsData.value);
      } else {
        if (leadsData.reason?.message?.includes('Session expired')) {
          setIsAuthenticated(false);
        }
        setErrorMsg('Could not fetch latest leads. Please check your session.');
      }

      if (smtpData.status === 'fulfilled') {
        setSmtpInfo(smtpData.value);
      }
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setLoginError('Please enter both username and password.');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    const result = await loginAdmin(usernameInput.trim(), passwordInput);
    setIsLoggingIn(false);

    if (result.success) {
      setIsAuthenticated(true);
      setPasswordInput('');
      loadData();
    } else {
      setLoginError(result.message || 'Login failed. Check your credentials.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setLeads([]);
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const updated = await updateLead(leadId, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleNotesChange = async (leadId: string, notes: string) => {
    try {
      const updated = await updateLead(leadId, { notes });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    } catch (err) {
      console.error('Failed to update notes', err);
    }
  };

  const handleDeleteLead = async (leadId: string, parentName: string) => {
    if (!window.confirm(`Are you sure you want to delete lead inquiry from "${parentName}"?`)) {
      return;
    }
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      alert('Failed to delete lead.');
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await testSmtpEmail();
      setSmtpTestResult(res);
    } catch (err: any) {
      setSmtpTestResult({ success: false, message: err.message || 'Test failed' });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName || !newPhone) return;

    setIsSavingManual(true);
    try {
      await submitLead({
        source: 'Phone / Walk-in',
        parentName: newParentName,
        phoneNumber: newPhone,
        email: newEmail || undefined,
        childName: newChildName || undefined,
        childAge: newChildAge || undefined,
        selectedService: newService,
        message: newMessage || undefined
      });
      setIsAddModalOpen(false);
      setNewParentName('');
      setNewPhone('');
      setNewEmail('');
      setNewChildName('');
      setNewChildAge('');
      setNewMessage('');
      await loadData();
    } catch (err) {
      alert('Failed to add manual lead.');
    } finally {
      setIsSavingManual(false);
    }
  };

  // CSV Export Functionality
  const exportToCsv = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = [
      'Lead ID',
      'Date (UTC)',
      'Source',
      'Parent Name',
      'Phone Number',
      'Email',
      'Child Name',
      'Child Age',
      'Requested Service',
      'Message / Inquiry',
      'Status',
      'Staff Notes',
      'Email Dispatched'
    ];

    const rows = leads.map((lead) => [
      `"${lead.id}"`,
      `"${new Date(lead.createdAt).toLocaleString('en-IN')}"`,
      `"${lead.source || ''}"`,
      `"${(lead.parentName || '').replace(/"/g, '""')}"`,
      `"${lead.phoneNumber || ''}"`,
      `"${lead.email || ''}"`,
      `"${(lead.childName || '').replace(/"/g, '""')}"`,
      `"${lead.childAge || ''}"`,
      `"${(lead.selectedService || '').replace(/"/g, '""')}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      `"${lead.status}"`,
      `"${(lead.notes || '').replace(/"/g, '""')}"`,
      `"${lead.emailSent ? 'Yes' : 'No'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `utkarsh_cdc_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !searchTerm ||
        lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phoneNumber.includes(searchTerm) ||
        (lead.childName && lead.childName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.selectedService && lead.selectedService.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Metrics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contacted = leads.filter((l) => l.status === 'Contacted').length;
    const scheduled = leads.filter((l) => l.status === 'Assessment Scheduled').length;
    const enrolled = leads.filter((l) => l.status === 'Enrolled').length;
    return { total, newCount, contacted, scheduled, enrolled };
  }, [leads]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top App Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo variant="compact" />
            <div className="border-l border-slate-300 pl-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Lead Management Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  Admin Center
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Utkarsh Child Development Centre &bull; Real-time Admissions & Consultation Inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/60">
          
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Staff Authentication
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sign in to access parent leads, phone numbers, and child assessment notes.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-600">
                    Configured via Environment Variables:
                  </p>
                  <p>
                    Username & password are set in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">ADMIN_USERNAME</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">ADMIN_PASSWORD</code>.
                  </p>
                  <p className="text-slate-500">
                    Default access: <span className="font-mono text-teal-800 font-bold">admin</span> / <span className="font-mono text-teal-800 font-bold">Utkarsh@2026</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Dashboard View */
            <div className="space-y-6">
              
              {/* Top Control & Notification Banner */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* SMTP Status Overview */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${smtpInfo?.configured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      <Mail className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          Automated Lead Email Alerts
                        </h4>
                        {smtpInfo?.configured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                            <CheckCircle className="w-3 h-3" /> Active (SMTP)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wide">
                            <AlertCircle className="w-3 h-3" /> Setup Needed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {smtpInfo?.configured
                          ? `New leads are automatically emailed to: ${smtpInfo.recipient} via ${smtpInfo.host}`
                          : `Configure SMTP in .env (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_TO) to receive every lead directly in your inbox.`}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Test Email, Manual Lead, Export CSV, Refresh */}
                  <div className="flex flex-wrap items-center gap-2">
                    {smtpInfo?.configured && (
                      <button
                        onClick={handleTestSmtp}
                        disabled={isTestingSmtp}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                        title="Send a sample verification lead to the configured email"
                      >
                        <Send className="w-3.5 h-3.5 text-teal-600" />
                        <span>{isTestingSmtp ? 'Sending...' : 'Test Email Alert'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Manual Lead</span>
                    </button>

                    <button
                      onClick={exportToCsv}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      onClick={loadData}
                      disabled={isLoadingLeads}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Refresh Leads"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* SMTP Test Alert Feedback */}
                {smtpTestResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center justify-between gap-3 font-medium ${
                      smtpTestResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {smtpTestResult.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{smtpTestResult.message}</span>
                    </div>
                    <button
                      onClick={() => setSmtpTestResult(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* Statistics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Inquiries
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {stats.total}
                  </div>
                  <span className="text-[11px] text-slate-500">Across all sources</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                    New / Pending
                  </span>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    {stats.newCount}
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">Needs call/response</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs bg-teal-50/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                    Contacted
                  </span>
                  <div className="text-2xl font-black text-teal-900 mt-1">
                    {stats.contacted}
                  </div>
                  <span className="text-[11px] text-teal-700 font-medium">In conversation</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs bg-indigo-50/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Scheduled
                  </span>
                  <div className="text-2xl font-black text-indigo-900 mt-1">
                    {stats.scheduled}
                  </div>
                  <span className="text-[11px] text-indigo-700 font-medium">Center assessment</span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Enrolled
                  </span>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    {stats.enrolled}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Active admissions</span>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search parent, child, phone..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto w-full md:w-auto">
                    {['All', 'New', 'Contacted', 'Assessment Scheduled', 'Enrolled', 'Archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors whitespace-nowrap ${
                          statusFilter === status
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Source Select */}
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="All">All Sources</option>
                    <option value="Booking Modal">Booking Modal</option>
                    <option value="Contact Form">Contact Form</option>
                    <option value="Phone / Walk-in">Phone / Walk-in</option>
                  </select>
                </div>
              </div>

              {/* Leads List / Table */}
              {isLoadingLeads ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">Loading leads...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">No leads found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchTerm || statusFilter !== 'All'
                      ? 'No inquiries match your current filters. Try resetting search or status filters.'
                      : 'No inquiries have been recorded yet. When parents submit the admission or contact form, they will appear here.'}
                  </p>
                  {(searchTerm || statusFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('All');
                        setSourceFilter('All');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => {
                    const cleanPhone = (lead.phoneNumber || '').replace(/[^0-9]/g, '');
                    const waNum = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
                    const waGreeting = encodeURIComponent(
                      `Hello ${lead.parentName}, this is Utkarsh Child Development Centre regarding your inquiry for ${lead.childName ? lead.childName : 'your child'} (${lead.selectedService || 'Developmental Services'}). How may we assist you today?`
                    );

                    return (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-3.5"
                      >
                        {/* Lead Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-black text-slate-900 text-base">
                              {lead.parentName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                              {lead.source}
                            </span>
                            {lead.emailSent && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <Check className="w-2.5 h-2.5" /> Email Alert Sent
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(lead.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>

                            {/* Status Selector Dropdown */}
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                              className={`ml-2 text-xs font-bold px-3 py-1 rounded-xl border outline-none cursor-pointer transition-colors ${
                                lead.status === 'New'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : lead.status === 'Contacted'
                                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                                  : lead.status === 'Assessment Scheduled'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                  : lead.status === 'Enrolled'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Assessment Scheduled">Assessment Scheduled</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Archived">Archived</option>
                            </select>

                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.parentName)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                          {/* Contact Info */}
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                              Parent Contact
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">{lead.phoneNumber}</span>
                            </div>
                            {lead.email && (
                              <div className="text-slate-500 truncate" title={lead.email}>
                                {lead.email}
                              </div>
                            )}

                            {/* Direct Connect Buttons */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <a
                                href={`tel:${lead.phoneNumber}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-[11px] transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${waNum}?text=${waGreeting}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Child Details */}
                          <div className="space-y-1">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                              Child Profile
                            </span>
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <Baby className="w-3.5 h-3.5 text-teal-600" />
                              <span>{lead.childName || 'Not specified'}</span>
                            </div>
                            <div className="text-slate-600">
                              Age: <strong className="text-slate-800">{lead.childAge || 'Not specified'}</strong>
                            </div>
                          </div>

                          {/* Program / Concern */}
                          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                              Requested Program
                            </span>
                            <span className="inline-block font-extrabold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                              {lead.selectedService || 'General Consultation'}
                            </span>
                            {lead.message && (
                              <p className="text-slate-600 italic line-clamp-2 pt-1 font-normal">
                                "{lead.message}"
                              </p>
                            )}
                          </div>

                          {/* Staff Notes */}
                          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                              Staff Notes & Follow-up
                            </span>
                            <input
                              type="text"
                              defaultValue={lead.notes || ''}
                              placeholder="Add follow-up notes here..."
                              onBlur={(e) => handleNotesChange(lead.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-1 focus:ring-teal-600 outline-none"
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Utkarsh CDC Lead Hub &bull; Local Secure JSON Database</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Export to CSV anytime to open in Microsoft Excel or Google Sheets.
          </div>
        </div>

      </div>

      {/* Manual Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">
                Add Manual Lead Inquiry
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Name *</label>
                <input
                  type="text"
                  required
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="e.g. Smt. Neha Joshi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="parent@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Child Name</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Child's name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Child Age</label>
                  <input
                    type="text"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="e.g. 4.5 years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service / Program</label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none"
                >
                  <option value="School Admission Inquiry">School Admission Inquiry</option>
                  <option value="Occupational Therapy (OT)">Occupational Therapy (OT)</option>
                  <option value="Speech & Language Therapy">Speech & Language Therapy</option>
                  <option value="Special Education">Special Education</option>
                  <option value="Autism Assessment (ASD)">Autism Assessment (ASD)</option>
                  <option value="Standardized IQ Testing">Standardized IQ Testing</option>
                  <option value="Clinical Psychologist Consultation">Clinical Psychologist Consultation</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry Details / Message</label>
                <textarea
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Notes from call or walk-in visit..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold disabled:opacity-50"
                >
                  {isSavingManual ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
