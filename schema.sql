-- Utkarsh Child Development Centre (UCDC)
-- Cloudflare D1 SQL Database Schema for Leads Management
-- Run this migration using: npx wrangler d1 execute utkarsh_leads_db --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  source TEXT DEFAULT 'Website Inquiry',
  parentName TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  email TEXT,
  childName TEXT,
  childAge TEXT,
  selectedService TEXT DEFAULT 'General Consultation',
  message TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT DEFAULT '',
  createdAt TEXT NOT NULL,
  updatedAt TEXT,
  emailSent INTEGER DEFAULT 0,
  emailError TEXT
);

-- Optimize fast index searches by creation time and inquiry status
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
