/**
 * Utkarsh Child Development Centre (UCDC)
 * Cloudflare Workers Full-Stack Application Entry Point
 * 
 * Handles:
 * 1. Cloudflare D1 Serverless SQL Database for Permanent Lead Storage
 * 2. High-performance Edge Single Page Application (SPA) Asset Serving via ASSETS binding
 * 3. Stateless HMAC-SHA256 Admin Authentication across all Cloudflare Edge Points of Presence
 * 4. Email notifications via Resend API / MailChannels / Webhook
 */

import type { D1Database, KVNamespace, ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
  DB?: D1Database;
  LEADS_KV?: KVNamespace;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  SMTP_TO?: string;
  RESEND_API_KEY?: string;
}

// In-memory fallback if D1 is not yet provisioned in developer account
let inMemoryFallbackLeads: any[] = [];

// Helper: HMAC-SHA256 for Stateless Edge Session Tokens
async function generateHmacSignature(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyHmacToken(token: string, secret: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    const [username, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) {
      return { valid: false };
    }
    const expectedSig = await generateHmacSignature(`${username}.${expiryStr}`, secret);
    if (expectedSig !== signature) {
      return { valid: false };
    }
    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

// Helper: Auto-ensure D1 database table exists
async function ensureD1Table(db: D1Database): Promise<void> {
  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          source TEXT,
          parentName TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          email TEXT,
          childName TEXT,
          childAge TEXT,
          selectedService TEXT,
          message TEXT,
          status TEXT DEFAULT 'New',
          notes TEXT DEFAULT '',
          createdAt TEXT NOT NULL,
          updatedAt TEXT,
          emailSent INTEGER DEFAULT 0,
          emailError TEXT
        )`
      )
      .run();
  } catch (err) {
    console.error('Failed to auto-create D1 table:', err);
  }
}

// Helper: Send Lead Email Notification at Cloudflare Edge
async function sendEdgeEmailNotification(
  lead: any,
  env: Env
): Promise<{ success: boolean; error?: string }> {
  const recipient = env.SMTP_TO || env.ADMIN_NOTIFICATION_EMAIL || env.SMTP_USER || 'swapnilbibrale9@gmail.com';
  const cleanPhone = (lead.phoneNumber || '').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;

  const emailSubject = `🔔 New Lead: ${lead.parentName} (${lead.selectedService || 'General Inquiry'}) - Utkarsh CDC`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 24px 28px; color: #ffffff;">
          <h1 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800;">Utkarsh Child Development Centre</h1>
          <p style="margin: 0; font-size: 13px; opacity: 0.9;">New Student & Therapy Lead Captured</p>
          <span style="display: inline-block; background: #fef08a; color: #854d0e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-top: 10px;">${lead.source || 'Website'}</span>
        </div>
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 10px 0; color: #64748b; width: 140px;">Parent Name:</td><td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${lead.parentName}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Phone:</td><td style="padding: 10px 0; font-weight: 700;"><a href="tel:${lead.phoneNumber}" style="color: #0f766e; text-decoration: none;">${lead.phoneNumber}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Email:</td><td style="padding: 10px 0;">${lead.email || 'Not provided'}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Child:</td><td style="padding: 10px 0;">${lead.childName || 'Not specified'} ${lead.childAge ? `(${lead.childAge})` : ''}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Service:</td><td style="padding: 10px 0; font-weight: 700; color: #be185d;">${lead.selectedService || 'General Consultation'}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Inquiry Details:</td><td style="padding: 10px 0; color: #334155; line-height: 1.5;">${lead.message || 'No additional note.'}</td></tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${waLink}" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px;">Message on WhatsApp</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b;">
          Lead stored in Cloudflare D1 Database • Utkarsh CDC, Seawoods, Navi Mumbai
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Resend API (Recommended for Cloudflare Workers)
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.SMTP_FROM || 'Utkarsh CDC <onboarding@resend.dev>',
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, error: (errJson as any)?.message || `Resend API returned ${res.status}` };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 2. MailChannels API (Free edge email delivery on Cloudflare Workers)
  try {
    const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient, name: 'Utkarsh CDC Admin' }] }],
        from: {
          email: env.SMTP_USER || 'leads@utkarshcdc.com',
          name: 'Utkarsh CDC Leads Portal',
        },
        subject: emailSubject,
        content: [{ type: 'text/html', value: emailHtml }],
      }),
    });

    if (res.ok || res.status === 202) {
      return { success: true };
    }
  } catch {
    // Ignore MailChannels network failure and record info
  }

  // 3. Fallback: Log & safely return notification guidance
  return {
    success: false,
    error: 'Configure RESEND_API_KEY in Cloudflare Worker secrets (npx wrangler secret put RESEND_API_KEY) for instant edge emails.',
  };
}

// -----------------------------------------------------------------------------
// Cloudflare Worker Fetch Router
// -----------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Preflight Handling
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const jsonHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const secretKey = env.ADMIN_PASSWORD || 'Utkarsh@2026';

    // Auth verification helper
    const checkAuth = async (): Promise<{ authenticated: boolean; username?: string }> => {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (!token) return { authenticated: false };
      const verified = await verifyHmacToken(token, secretKey);
      return { authenticated: verified.valid, username: verified.username };
    };

    // Auto-create D1 database table if D1 is configured
    if (env.DB) {
      ctx.waitUntil(ensureD1Table(env.DB));
    }

    // -------------------------------------------------------------------------
    // API Routes (/api/*)
    // -------------------------------------------------------------------------

    // 1. Submit New Lead (Public)
    if (path === '/api/leads' && method === 'POST') {
      try {
        const body: any = await request.json();
        const {
          parentName,
          phoneNumber,
          email,
          childName,
          childAge,
          selectedService,
          message,
          source = 'Website Inquiry',
        } = body;

        if (!parentName || !phoneNumber) {
          return new Response(
            JSON.stringify({ success: false, message: 'Parent name and phone number are required.' }),
            { status: 400, headers: jsonHeaders }
          );
        }

        const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();

        const newLead: any = {
          id,
          source,
          parentName: parentName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email?.trim() || null,
          childName: childName?.trim() || null,
          childAge: childAge?.trim() || null,
          selectedService: selectedService?.trim() || 'General Consultation',
          message: message?.trim() || null,
          status: 'New',
          notes: '',
          createdAt: now,
          updatedAt: now,
          emailSent: false,
          emailError: null,
        };

        // Dispatch Email Notification
        const emailRes = await sendEdgeEmailNotification(newLead, env);
        newLead.emailSent = emailRes.success;
        if (!emailRes.success) {
          newLead.emailError = emailRes.error;
        }

        // Store Lead in Cloudflare D1 Database
        if (env.DB) {
          try {
            await ensureD1Table(env.DB);
            await env.DB.prepare(
              `INSERT INTO leads (
                id, source, parentName, phoneNumber, email, childName, childAge, selectedService, message, status, notes, createdAt, updatedAt, emailSent, emailError
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                newLead.id,
                newLead.source,
                newLead.parentName,
                newLead.phoneNumber,
                newLead.email,
                newLead.childName,
                newLead.childAge,
                newLead.selectedService,
                newLead.message,
                newLead.status,
                newLead.notes,
                newLead.createdAt,
                newLead.updatedAt,
                newLead.emailSent ? 1 : 0,
                newLead.emailError
              )
              .run();
          } catch (dbErr) {
            console.error('Error inserting into D1:', dbErr);
            inMemoryFallbackLeads.unshift(newLead);
          }
        } else {
          // Fallback if D1 is not attached yet
          inMemoryFallbackLeads.unshift(newLead);
        }

        return new Response(
          JSON.stringify({
            success: true,
            lead: newLead,
            emailSent: newLead.emailSent,
            emailMessage: newLead.emailSent
              ? 'Lead recorded safely and notification sent to your email.'
              : `Lead recorded safely in database. Email note: ${newLead.emailError || 'Email queued'}`,
          }),
          { status: 201, headers: jsonHeaders }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, message: err.message || 'Error processing lead' }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }

    // 2. Admin Login
    if (path === '/api/admin/login' && method === 'POST') {
      try {
        const body: any = await request.json();
        const { username, password } = body;
        const configuredUser = env.ADMIN_USERNAME || 'admin';
        const configuredPass = env.ADMIN_PASSWORD || 'Utkarsh@2026';

        if (username === configuredUser && password === configuredPass) {
          const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
          const payload = `${username}.${expiry}`;
          const sig = await generateHmacSignature(payload, configuredPass);
          const token = `${payload}.${sig}`;

          return new Response(
            JSON.stringify({
              success: true,
              token,
              user: { username },
            }),
            { status: 200, headers: jsonHeaders }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid administrator credentials. Please check your username and password.',
          }),
          { status: 401, headers: jsonHeaders }
        );
      } catch {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid login request payload' }),
          { status: 400, headers: jsonHeaders }
        );
      }
    }

    // 3. Admin Session Check
    if (path === '/api/admin/me' && method === 'GET') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Session expired or invalid.' }),
          { status: 401, headers: jsonHeaders }
        );
      }
      return new Response(JSON.stringify({ success: true, authenticated: true }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    // 4. Get All Leads (Admin Only)
    if (path === '/api/leads' && method === 'GET') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Unauthorized. Admin login required.' }),
          { status: 401, headers: jsonHeaders }
        );
      }

      let leads: any[] = [];
      if (env.DB) {
        try {
          await ensureD1Table(env.DB);
          const results = await env.DB.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
          leads = (results.results || []).map((row: any) => ({
            ...row,
            emailSent: Boolean(row.emailSent),
          }));
        } catch (dbErr) {
          console.error('Error fetching leads from D1:', dbErr);
          leads = inMemoryFallbackLeads;
        }
      } else {
        leads = inMemoryFallbackLeads;
      }

      return new Response(JSON.stringify({ success: true, leads }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    // 5. Update Lead Status or Staff Notes (Admin Only)
    if (path.startsWith('/api/leads/') && method === 'PATCH') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Unauthorized.' }),
          { status: 401, headers: jsonHeaders }
        );
      }

      const id = path.replace('/api/leads/', '').trim();
      const body: any = await request.json().catch(() => ({}));
      const { status, notes } = body;
      const updatedAt = new Date().toISOString();

      if (env.DB) {
        try {
          let updatedLead: any = null;
          if (status !== undefined && notes !== undefined) {
            await env.DB.prepare('UPDATE leads SET status = ?, notes = ?, updatedAt = ? WHERE id = ?')
              .bind(status, notes, updatedAt, id)
              .run();
          } else if (status !== undefined) {
            await env.DB.prepare('UPDATE leads SET status = ?, updatedAt = ? WHERE id = ?')
              .bind(status, updatedAt, id)
              .run();
          } else if (notes !== undefined) {
            await env.DB.prepare('UPDATE leads SET notes = ?, updatedAt = ? WHERE id = ?')
              .bind(notes, updatedAt, id)
              .run();
          }

          const fresh = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
          if (fresh) {
            updatedLead = { ...fresh, emailSent: Boolean((fresh as any).emailSent) };
          }

          return new Response(JSON.stringify({ success: true, lead: updatedLead }), {
            status: 200,
            headers: jsonHeaders,
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: jsonHeaders,
          });
        }
      } else {
        const item = inMemoryFallbackLeads.find((l) => l.id === id);
        if (!item) {
          return new Response(JSON.stringify({ success: false, message: 'Lead not found' }), {
            status: 404,
            headers: jsonHeaders,
          });
        }
        if (status !== undefined) item.status = status;
        if (notes !== undefined) item.notes = notes;
        item.updatedAt = updatedAt;
        return new Response(JSON.stringify({ success: true, lead: item }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
    }

    // 6. Delete Lead (Admin Only)
    if (path.startsWith('/api/leads/') && method === 'DELETE') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Unauthorized.' }),
          { status: 401, headers: jsonHeaders }
        );
      }

      const id = path.replace('/api/leads/', '').trim();
      if (env.DB) {
        try {
          await env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
          return new Response(JSON.stringify({ success: true, message: 'Lead deleted.' }), {
            status: 200,
            headers: jsonHeaders,
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: jsonHeaders,
          });
        }
      } else {
        inMemoryFallbackLeads = inMemoryFallbackLeads.filter((l) => l.id !== id);
        return new Response(JSON.stringify({ success: true, message: 'Lead deleted.' }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
    }

    // 7. Get SMTP & Database Status (Admin Only)
    if (path === '/api/admin/smtp-status' && method === 'GET') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Unauthorized.' }),
          { status: 401, headers: jsonHeaders }
        );
      }

      const emailConfigured = Boolean(env.RESEND_API_KEY || (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS));

      return new Response(
        JSON.stringify({
          configured: emailConfigured,
          storageType: env.DB ? 'Cloudflare D1 (Serverless SQLite)' : 'In-Memory / Local Storage',
          host: env.RESEND_API_KEY ? 'Resend Edge API (Active)' : env.SMTP_HOST || 'Not configured',
          port: env.SMTP_PORT || '587',
          user: env.SMTP_USER || (env.RESEND_API_KEY ? 'Resend' : 'Not configured'),
          recipient: env.SMTP_TO || env.ADMIN_NOTIFICATION_EMAIL || 'swapnilbibrale9@gmail.com',
          adminUser: env.ADMIN_USERNAME || 'admin',
        }),
        { status: 200, headers: jsonHeaders }
      );
    }

    // 8. Test Email Notification (Admin Only)
    if (path === '/api/admin/test-email' && method === 'POST') {
      const auth = await checkAuth();
      if (!auth.authenticated) {
        return new Response(
          JSON.stringify({ success: false, message: 'Unauthorized.' }),
          { status: 401, headers: jsonHeaders }
        );
      }

      const sampleLead = {
        source: 'Admin Edge Test',
        parentName: 'Test Parent (Cloudflare Worker Verification)',
        phoneNumber: '+91 8828551185',
        email: 'test@utkarshcdc.com',
        childName: 'Sample Child',
        childAge: '4 years',
        selectedService: 'Verification Check',
        message: 'This confirms that Utkarsh CDC lead email alerts are functioning correctly on Cloudflare Workers.',
      };

      const result = await sendEdgeEmailNotification(sampleLead, env);
      if (result.success) {
        return new Response(
          JSON.stringify({ success: true, message: `Test email sent successfully to ${env.SMTP_TO || env.ADMIN_NOTIFICATION_EMAIL || 'swapnilbibrale9@gmail.com'}!` }),
          { status: 200, headers: jsonHeaders }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: result.error || 'Failed to send test email.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
    }

    // -------------------------------------------------------------------------
    // Fallback: Serve Static SPA Assets from Vite build (dist/)
    // -------------------------------------------------------------------------
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Utkarsh CDC API Server (Edge Worker Active)', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
