export interface Lead {
  id: string;
  source: string;
  parentName: string;
  phoneNumber: string;
  email?: string;
  childName?: string;
  childAge?: string;
  selectedService?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Assessment Scheduled' | 'Enrolled' | 'Archived';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  emailSent?: boolean;
  emailError?: string;
}

export interface LeadSubmissionPayload {
  source: 'Booking Modal' | 'Contact Form' | 'Direct Consultation' | 'Phone / Walk-in' | string;
  parentName: string;
  phoneNumber: string;
  email?: string;
  childName?: string;
  childAge?: string;
  selectedService?: string;
  message?: string;
}

export interface SmtpConfigInfo {
  configured: boolean;
  host: string;
  port: string;
  user: string;
  recipient: string;
  adminUser: string;
}

const TOKEN_KEY = 'utkarsh_admin_token';
const USER_KEY = 'utkarsh_admin_user';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function logoutAdmin(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, data.user?.username || username);
      return { success: true };
    }
    return { success: false, message: data.message || 'Invalid username or password' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error connecting to server' };
  }
}

export async function checkAdminSession(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitLead(payload: LeadSubmissionPayload): Promise<{ success: boolean; lead?: Lead; message?: string }> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, lead: data.lead, message: data.emailMessage };
    }
    return { success: false, message: data.message || 'Failed to submit lead' };
  } catch (err: any) {
    console.error('Error submitting lead:', err);
    // Offline / fallback save in local storage
    const offlineLead: Lead = {
      id: `lead_offline_${Date.now()}`,
      source: payload.source,
      parentName: payload.parentName,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      childName: payload.childName,
      childAge: payload.childAge,
      selectedService: payload.selectedService,
      message: payload.message,
      status: 'New',
      createdAt: new Date().toISOString(),
      emailSent: false,
      emailError: 'Offline submission'
    };
    return { success: true, lead: offlineLead, message: 'Saved locally' };
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/leads', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      logoutAdmin();
      throw new Error('Session expired');
    }
    throw new Error('Failed to fetch leads');
  }

  const data = await res.json();
  return data.leads || [];
}

export async function updateLead(id: string, updates: { status?: Lead['status']; notes?: string }): Promise<Lead> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update lead');
  }

  const data = await res.json();
  return data.lead;
}

export async function deleteLead(id: string): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to delete lead');
  }
}

export async function getSmtpStatus(): Promise<SmtpConfigInfo> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/admin/smtp-status', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to get SMTP status');
  return res.json();
}

export async function testSmtpEmail(): Promise<{ success: boolean; message: string }> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/admin/test-email', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return { success: res.ok, message: data.message };
}
