import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Download,
  Plus,
  RefreshCw,
  LogOut,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Trash2,
  Send,
  Eye,
  EyeOff,
  Baby,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  X
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
  getStoredAdminToken,
  getStoredAdminUser
} from '../services/leadService';

interface AdminPageProps {
  onExit: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getStoredAdminToken()));
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  // SMTP Test State & Modal
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Guarantee SEO Noindex on Admin route
  useEffect(() => {
    const originalTitle = document.title;
    document.title = isAuthenticated
      ? 'Lead Management Dashboard | Utkarsh CDC'
      : 'Staff Login | Utkarsh CDC';

    // Inject noindex, nofollow meta tag
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    const originalRobots = metaTag ? metaTag.getAttribute('content') : null;

    if (metaTag) {
      metaTag.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      metaTag.content = 'noindex, nofollow, noarchive';
      document.head.appendChild(metaTag);
    }

    return () => {
      document.title = originalTitle;
      if (metaTag) {
        if (originalRobots) {
          metaTag.setAttribute('content', originalRobots);
        } else {
          metaTag.remove();
        }
      }
    };
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

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
      setLoginError(result.message || 'Invalid credentials. Please verify your login details.');
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
    if (!window.confirm(`Are you sure you want to permanently remove inquiry from ${parentName}?`)) {
      return;
    }
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      console.error('Failed to delete lead', err);
      alert('Could not delete lead. Please try again.');
    }
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName || !newPhone) return;

    setIsSavingManual(true);
    try {
      const res = await submitLead({
        source: 'Phone / Walk-in',
        parentName: newParentName,
        phoneNumber: newPhone,
        email: newEmail || undefined,
        childName: newChildName || undefined,
        childAge: newChildAge || undefined,
        selectedService: newService,
        message: newMessage || 'Manual lead recorded by admin staff.',
      });

      if (res.success && res.lead) {
        setLeads((prev) => [res.lead!, ...prev]);
        setIsAddModalOpen(false);
        setNewParentName('');
        setNewPhone('');
        setNewEmail('');
        setNewChildName('');
        setNewChildAge('');
        setNewMessage('');
      } else {
        alert(res.message || 'Failed to save inquiry.');
      }
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await testSmtpEmail();
      setSmtpTestResult(res);
    } catch (err: any) {
      setSmtpTestResult({ success: false, message: err.message || 'Error executing email test.' });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = [
      'Lead ID',
      'Date Submitted',
      'Source',
      'Parent Name',
      'Phone Number',
      'Email',
      'Child Name',
      'Child Age',
      'Selected Service',
      'Message',
      'Status',
      'Staff Notes',
      'Email Dispatched'
    ];

    const rows = filteredLeads.map((lead) => [
      `"${lead.id}"`,
      `"${new Date(lead.createdAt).toLocaleString()}"`,
      `"${lead.source}"`,
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

  // =========================================================================
  // VIEW 1: Dedicated Full-Page Admin Login
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased selection:bg-teal-500 selection:text-white">
        {/* Top Header with Back Button */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-teal-300/80 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Protected Admin Area</span>
          </div>
        </div>

        {/* Center Login Card */}
        <div className="w-full max-w-md mx-auto my-8">
          <div className="bg-white text-slate-900 rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-200/80 space-y-6">
            
            {/* Brand Logo & Heading */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-1">
                <BrandLogo size="navbar" />
              </div>
              <div className="pt-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0f3460] tracking-tight">
                  Staff & Admin Portal
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in to access inquiries, parent communications & admissions.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  autoFocus
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Admin Dashboard'}
              </button>
            </form>

            {/* Credential Reference for Owner */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">
                Default Credentials (Configurable via Environment Variables):
              </p>
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-xs">
                <div>
                  <span className="text-slate-400">User: </span>
                  <span className="text-teal-800 font-bold">admin</span>
                </div>
                <div>
                  <span className="text-slate-400">Pass: </span>
                  <span className="text-teal-800 font-bold">Utkarsh@2026</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center text-[10px] text-slate-400 pt-1">
              Protected area &bull; Excluded from search indexing
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400/80 pb-2">
          &copy; {new Date().getFullYear()} Utkarsh Child Development Centre &bull; Bhandup (East), Mumbai
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: Dedicated Full-Page Lead Management Console
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <BrandLogo variant="compact" />
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Lead Management Console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Utkarsh Child Development Centre &bull; Bhandup (East), Mumbai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Return to the public homepage"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={() => setIsSmtpModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Inspect Email & SMTP Setup"
            >
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline">Email Status</span>
              {smtpInfo?.configured ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
              title="Log out from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</div>
            <div className="text-2xl sm:text-3xl font-black text-[#0f3460] mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All inquiries recorded</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">New Inquiries</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{stats.newCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Awaiting initial call</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Contacted</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{stats.contacted}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Parent communicated</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-xs">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Assessment</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{stats.scheduled}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Clinic appointment set</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Enrolled</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.enrolled}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">School / therapy confirmed</div>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads by parent name, phone, child, service..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={loadData}
                disabled={isLoadingLeads}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
                title="Refresh leads list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
                title="Export leads to CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </button>
            </div>

          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1">Status:</span>
            {['All', 'New', 'Contacted', 'Assessment Scheduled', 'Enrolled', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {isLoadingLeads ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Loading inquiries...</p>
            </div>
          ) : errorMsg ? (
            <div className="py-16 text-center space-y-3 px-4">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">{errorMsg}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xs hover:bg-teal-800"
              >
                Retry
              </button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-24 text-center space-y-3 px-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {searchTerm || statusFilter !== 'All' ? 'No Matching Inquiries' : 'No Inquiries Yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchTerm || statusFilter !== 'All'
                  ? 'Try clearing your search query or switching status filters.'
                  : 'New parent inquiries submitted via the website booking modal, Admissions form, and contact sections will automatically appear here.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record First Walk-In / Phone Lead</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="py-3 px-4">Date & Source</th>
                    <th className="py-3 px-4">Parent Details</th>
                    <th className="py-3 px-4">Child & Service</th>
                    <th className="py-3 px-4">Message / Inquiry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => {
                    const waText = encodeURIComponent(
                      `Hello ${lead.parentName}, thank you for contacting Utkarsh Child Development Centre regarding ${lead.selectedService || 'our therapies'}. How may we assist you?`
                    );
                    const cleanPhone = lead.phoneNumber.replace(/[^\d]/g, '');

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Date & Source */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="font-bold text-slate-800">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {lead.source}
                          </span>
                        </td>

                        {/* Parent Details */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900 text-sm">{lead.parentName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`tel:${lead.phoneNumber}`}
                              className="text-teal-700 hover:text-teal-900 font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{lead.phoneNumber}</span>
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold"
                              title="Chat on WhatsApp"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {lead.email && (
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                              {lead.email}
                            </div>
                          )}
                        </td>

                        {/* Child & Service */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-slate-900">
                            {lead.childName || 'Child info not provided'}
                            {lead.childAge ? ` (${lead.childAge})` : ''}
                          </div>
                          <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-100">
                            {lead.selectedService || 'General Consultation'}
                          </div>
                        </td>

                        {/* Message */}
                        <td className="py-3.5 px-4 align-top max-w-[260px]">
                          <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                            {lead.message || 'No additional message.'}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                              lead.status === 'New'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : lead.status === 'Contacted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : lead.status === 'Assessment Scheduled'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : lead.status === 'Enrolled'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Assessment Scheduled">Assessment Scheduled</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>

                        {/* Follow-up Notes */}
                        <td className="py-3.5 px-4 align-top min-w-[180px]">
                          <input
                            type="text"
                            defaultValue={lead.notes || ''}
                            onBlur={(e) => {
                              if (e.target.value !== (lead.notes || '')) {
                                handleNotesChange(lead.id, e.target.value);
                              }
                            }}
                            placeholder="Add staff notes..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none bg-slate-50/50"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.parentName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete lead permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Record New Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Name *</label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="e.g. Amit Patil"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="98200XXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Child Name</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Child Age</label>
                  <input
                    type="text"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="e.g. 4 years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry / Service</label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600 bg-white"
                >
                  <option value="School Admission Inquiry">School Admission Inquiry</option>
                  <option value="Occupational Therapy (OT)">Occupational Therapy (OT)</option>
                  <option value="Speech & Language Therapy">Speech & Language Therapy</option>
                  <option value="Special Education">Special Education</option>
                  <option value="Clinical Psychologist Assessment">Clinical Psychologist Assessment</option>
                  <option value="Standardized IQ Testing">Standardized IQ Testing</option>
                  <option value="Autism Assessment">Autism Assessment</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Message / Inquiry Notes</label>
                <textarea
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Notes from phone conversation or center visit..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs disabled:opacity-50"
                >
                  {isSavingManual ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMTP / Email Status Modal */}
      {isSmtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-black text-slate-900">Email Notification Status</h3>
              </div>
              <button
                onClick={() => setIsSmtpModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Delivery Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    smtpInfo?.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {smtpInfo?.configured ? 'Configured & Active' : 'SMTP Credentials Not Set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Destination Email:</span>
                  <span className="font-semibold text-slate-800">{smtpInfo?.recipient || 'swapnilbibrale9@gmail.com'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SMTP Host:</span>
                  <span className="font-mono text-slate-700">{smtpInfo?.host || 'Not configured'}</span>
                </div>
              </div>

              {smtpTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                  smtpTestResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {smtpTestResult.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{smtpTestResult.message}</span>
                </div>
              )}

              <p className="text-slate-500 leading-relaxed text-[11px]">
                When an inquiry is submitted, an instant alert is sent to the clinic administrator. To update your email settings, configure <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">SMTP_HOST</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">SMTP_USER</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">SMTP_PASS</code> in your environment variables.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestSmtp}
                  disabled={isTestingSmtp}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingSmtp ? 'Sending Test...' : 'Send Test Notification'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSmtpModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
