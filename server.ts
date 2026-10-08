import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(process.cwd(), 'data');
const LEADS_FILE = path.resolve(DATA_DIR, 'leads.json');

// Ensure data folder and leads.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// In-memory token storage for admin sessions
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

app.use(express.json());

// Helper: Read Leads
function readLeads(): any[] {
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leads.json:', err);
    return [];
  }
}

// Helper: Save Leads
function writeLeads(leads: any[]): void {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leads.json:', err);
  }
}

// Helper: SMTP Transporter
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// Helper: Send Lead Email
async function sendLeadEmailNotification(lead: any): Promise<{ success: boolean; error?: string }> {
  const transporter = getSmtpTransporter();
  const recipient = process.env.SMTP_TO || process.env.SMTP_USER || 'swapnilbibrale9@gmail.com';
  const fromAddress = process.env.SMTP_FROM || `"Utkarsh CDC Leads" <${process.env.SMTP_USER || 'leads@utkarshcdc.com'}>`;

  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials not configured in environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS)',
    };
  }

  const cleanPhone = (lead.phoneNumber || '').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 24px 28px; color: #ffffff; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .badge { display: inline-block; background: #fef08a; color: #854d0e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-top: 10px; }
        .body { padding: 28px; }
        .item { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #0f172a; }
        .actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; }
        .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; text-align: center; }
        .btn-wa { background: #16a34a; color: #ffffff; }
        .btn-call { background: #0284c7; color: #ffffff; }
        .footer { background: #f8fafc; padding: 16px 28px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Lead Inquiry</h1>
          <p>Utkarsh Child Development Centre, Bhandup (E), Mumbai</p>
          <span class="badge">Source: ${lead.source || 'Website'}</span>
        </div>
        <div class="body">
          <div class="item">
            <div class="label">Parent / Guardian Name</div>
            <div class="value">${lead.parentName}</div>
          </div>
          <div class="item">
            <div class="label">Contact Phone Number</div>
            <div class="value">${lead.phoneNumber}</div>
          </div>
          ${lead.email ? `
          <div class="item">
            <div class="label">Email Address</div>
            <div class="value">${lead.email}</div>
          </div>
          ` : ''}
          ${lead.childName || lead.childAge ? `
          <div class="item">
            <div class="label">Child Details</div>
            <div class="value">${lead.childName || 'Child'} ${lead.childAge ? `(Age: ${lead.childAge})` : ''}</div>
          </div>
          ` : ''}
          <div class="item">
            <div class="label">Requested Service / Program</div>
            <div class="value" style="color: #0f766e;">${lead.selectedService || 'General Consultation'}</div>
          </div>
          ${lead.message ? `
          <div class="item">
            <div class="label">Inquiry Message / Notes</div>
            <div class="value" style="font-weight: 400; color: #334155; line-height: 1.5;">${lead.message}</div>
          </div>
          ` : ''}
          <div class="item" style="border: none;">
            <div class="label">Received On</div>
            <div class="value" style="font-size: 13px; font-weight: 500; color: #64748b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</div>
          </div>

          <div class="actions">
            <a href="tel:${lead.phoneNumber}" class="btn btn-call">📞 Call Parent</a>
            <a href="${waLink}" class="btn btn-wa">💬 Open WhatsApp</a>
          </div>
        </div>
        <div class="footer">
          Utkarsh Child Development Centre Lead Notification System &bull; Saurabh CHS, Bhandup East, Mumbai
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `🔔 New Admission/Consultation Lead: ${lead.parentName} (${lead.selectedService || 'Utkarsh CDC'})`,
      text: `New Lead Received:\n\nParent: ${lead.parentName}\nPhone: ${lead.phoneNumber}\nEmail: ${lead.email || 'N/A'}\nChild: ${lead.childName || 'N/A'} (Age: ${lead.childAge || 'N/A'})\nService: ${lead.selectedService || 'N/A'}\nMessage: ${lead.message || 'N/A'}\nSource: ${lead.source}\nTime: ${new Date().toISOString()}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err: any) {
    console.error('Failed to send lead email notification:', err);
    return { success: false, error: err.message || 'Error sending SMTP email' };
  }
}

// Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: missing token' });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  // Extend session expiry (24 hours)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  next();
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Submit a New Lead (Public)
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const {
      parentName,
      phoneNumber,
      email,
      childName,
      childAge,
      selectedService,
      message,
      source = 'Website Inquiry',
    } = req.body;

    if (!parentName || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Parent name and phone number are required.' });
    }

    const newLead = {
      id: `lead_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      source,
      parentName: parentName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim() || undefined,
      childName: childName?.trim() || undefined,
      childAge: childAge?.trim() || undefined,
      selectedService: selectedService?.trim() || 'General Consultation',
      message: message?.trim() || undefined,
      status: 'New',
      notes: '',
      createdAt: new Date().toISOString(),
      emailSent: false,
      emailError: undefined as string | undefined,
    };

    // Attempt to send email via SMTP if configured
    const emailResult = await sendLeadEmailNotification(newLead);
    newLead.emailSent = emailResult.success;
    if (!emailResult.success) {
      newLead.emailError = emailResult.error;
    }

    // Save lead to persistent storage
    const leads = readLeads();
    leads.unshift(newLead);
    writeLeads(leads);

    res.status(201).json({
      success: true,
      lead: newLead,
      emailSent: newLead.emailSent,
      emailMessage: newLead.emailSent
        ? 'Lead recorded and notification sent to email.'
        : `Lead recorded safely. Email status: ${newLead.emailError}`,
    });
  } catch (err: any) {
    console.error('Error in /api/leads:', err);
    res.status(500).json({ success: false, message: 'Internal server error processing lead' });
  }
});

// 2. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const configuredUser = process.env.ADMIN_USERNAME || 'admin';
  const configuredPass = process.env.ADMIN_PASSWORD || 'Utkarsh@2026';

  if (username === configuredUser && password === configuredPass) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    activeSessions.set(token, { username, expiresAt });

    return res.json({
      success: true,
      token,
      user: { username },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials. Please check your username and password.',
  });
});

// 3. Admin Check / Verify Session
app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, authenticated: true });
});

// 4. Get All Leads (Admin only)
app.get('/api/leads', requireAdminAuth, (req: Request, res: Response) => {
  const leads = readLeads();
  res.json({ success: true, leads });
});

// 5. Update Lead Status / Notes (Admin only)
app.patch('/api/leads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const leads = readLeads();
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  if (status !== undefined) leads[index].status = status;
  if (notes !== undefined) leads[index].notes = notes;
  leads[index].updatedAt = new Date().toISOString();

  writeLeads(leads);
  res.json({ success: true, lead: leads[index] });
});

// 6. Delete Lead (Admin only)
app.delete('/api/leads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  let leads = readLeads();
  const initialLength = leads.length;

  leads = leads.filter((l) => l.id !== id);
  if (leads.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  writeLeads(leads);
  res.json({ success: true, message: 'Lead deleted successfully.' });
});

// 7. Get SMTP Status & Configuration (Admin only)
app.get('/api/admin/smtp-status', requireAdminAuth, (req: Request, res: Response) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || '587';
  const user = process.env.SMTP_USER;
  const to = process.env.SMTP_TO || user || 'swapnilbibrale9@gmail.com';
  const configured = Boolean(host && user && process.env.SMTP_PASS);

  res.json({
    configured,
    host: host || 'Not configured',
    port,
    user: user ? `${user.substring(0, 3)}***@${user.split('@')[1] || ''}` : 'Not configured',
    recipient: to,
    adminUser: process.env.ADMIN_USERNAME || 'admin',
  });
});

// 8. Test Send Email (Admin only)
app.post('/api/admin/test-email', requireAdminAuth, async (req: Request, res: Response) => {
  const sampleLead = {
    source: 'Admin SMTP Test',
    parentName: 'Test Parent (Verification)',
    phoneNumber: '+91 8828551185',
    email: 'test@utkarshcdc.com',
    childName: 'Sample Child',
    childAge: '4 years',
    selectedService: 'SMTP Verification Check',
    message: 'This is a test notification confirming that Utkarsh CDC lead email alerts are functioning correctly.',
  };

  const result = await sendLeadEmailNotification(sampleLead);
  if (result.success) {
    return res.json({ success: true, message: `Test email sent successfully to ${process.env.SMTP_TO || process.env.SMTP_USER || 'destination email'}!` });
  } else {
    return res.status(400).json({ success: false, message: result.error || 'Failed to send test email.' });
  }
});

// -------------------------------------------------------------
// Vite Dev Server or Production Static Serving
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
