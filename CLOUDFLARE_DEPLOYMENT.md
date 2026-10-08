# Cloudflare Workers Hosting & Leads Storage Guide
## Utkarsh Child Development Centre (UCDC)

---

### Part 1: How to Open the Admin Panel

To ensure a clean, professional experience for parents and families visiting the clinic website, **all admin and staff buttons have been completely removed from the public homepage**.

Only authorized clinic staff can access the admin login page:

1. **Direct URL Path (Recommended)**:
   - Navigate to `/admin` in your browser address bar:
     - Local Dev: `http://localhost:3000/admin` (or `http://localhost:3000/#admin`)
     - Live Site: `https://your-domain.com/admin` (or `https://your-domain.com/#admin`)

2. **Keyboard Shortcut**:
   - On any page of the website, press **`Ctrl + Shift + A`** (or **`Cmd + Shift + A`** on Mac) to instantly toggle into the `/admin` login screen.

3. **Search Engine & Sitemap Exclusion**:
   - `/admin` is **strictly excluded from `sitemap.xml`** and blocked in **`robots.txt`** (`Disallow: /admin`, `Disallow: /api/`).
   - The `/admin` page dynamically includes `<meta name="robots" content="noindex, nofollow" />` so it will never be indexed by Google or web crawlers.

#### Default Admin Credentials:
- **Username**: `admin`
- **Password**: `Utkarsh@2026`
*(You can customize these anytime in `.env` or in Cloudflare Worker secrets)*

---

### Part 2: How All Your Leads Are Stored

#### 1. In Local Development / VPS:
- Leads are stored persistently in `data/leads.json`.

#### 2. In Cloudflare Workers (Production Edge):
- **Why Cloudflare Workers is different**: Cloudflare Workers runs in a serverless, stateless sandbox distributed across 300+ data centers worldwide. There is **no persistent local hard drive (`fs`)**.
- **How leads are stored**: We have integrated **Cloudflare D1** (Cloudflare's native serverless SQL/SQLite database).
- **Features of Cloudflare D1 for UCDC**:
  - **100% Free Tier**: Cloudflare gives you **5,000,000 read queries and 100,000 write queries per month** for free.
  - **Relational Table**: Every lead is saved with:
    - Unique ID (`id`)
    - Source (`source`: "Booking Modal", "Contact Form", "Admissions Banner", "Manual")
    - Parent Name & Contact (`parentName`, `phoneNumber`, `email`)
    - Child Details (`childName`, `childAge`)
    - Selected Program/Therapy (`selectedService`)
    - Parent Message / Inquiry Notes (`message`)
    - Lead Status (`status`: "New", "Contacted", "Assessment Scheduled", "Enrolled", "Archived")
    - Staff Notes (`notes`)
    - Date & Timestamp (`createdAt`, `updatedAt`)
    - Email Delivery Status (`emailSent`, `emailError`)
  - **Direct Viewing & Backup**: You can view, search, export to CSV, or query all leads directly from the **Utkarsh Staff Portal UI** or from your **Cloudflare Dashboard (Workers & Pages > D1 > utkarsh_leads_db)**.

---

### Part 3: Step-by-Step Cloudflare Workers Deployment

Deploying your website and database to Cloudflare Workers takes **less than 3 minutes**:

#### Step 1: Log in to Cloudflare
In your terminal, authenticate Wrangler with your Cloudflare account:
```bash
npx wrangler login
```

#### Step 2: Create your Cloudflare D1 Database
Create the database with one command:
```bash
npm run d1:create
# or: npx wrangler d1 create utkarsh_leads_db
```
Wrangler will output something like:
```text
[[d1_databases]]
binding = "DB"
database_name = "utkarsh_leads_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Step 3: Update `wrangler.toml`
Open `wrangler.toml` and paste your `database_id` into the `[[d1_databases]]` section:
```toml
[[d1_databases]]
binding = "DB"
database_name = "utkarsh_leads_db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

#### Step 4: Run the Database Migration
Initialize the `leads` table and starter data:
```bash
npm run d1:migrate
# or: npx wrangler d1 execute utkarsh_leads_db --remote --file=./schema.sql
```

#### Step 5: (Optional) Set Admin Password & Email Secrets
Set your production admin password and email notification secrets:
```bash
npx wrangler secret put ADMIN_PASSWORD
# Enter your secure password (e.g., Utkarsh@2026)

# For instant email notifications on Cloudflare Workers, Resend is recommended:
npx wrangler secret put RESEND_API_KEY
# Enter your key from resend.com (free 3,000 emails/month)
```

#### Step 6: Deploy to Cloudflare Workers!
Run the deployment script:
```bash
npm run deploy:cf
```
Wrangler will build the React application and deploy both the static frontend and the edge API to Cloudflare:
```text
Total Upload: ... KiB / gzip: ... KiB
Uploaded utkarsh-cdc-web
Deployment complete!
URL: https://utkarsh-cdc-web.<your-subdomain>.workers.dev
```

You can also bind your custom domain (e.g., `www.utkarshcdc.com`) in the Cloudflare Dashboard under **Workers & Pages > utkarsh-cdc-web > Settings > Domains & Routes**.

---

### Part 4: Cloudflare Pages (Git Integration) Build Settings

If you connect your GitHub repository directly to **Cloudflare Pages**:

1. **Framework Preset**: `Vite`
2. **Build Command**: `npm run build`
3. **Build Output Directory**: `dist`
4. **Environment Variables**:
   - `NODE_VERSION`: `22` or `24`

#### Resolved: Bun Lockfile Version Compatibility
- **Issue**: Cloudflare build environments running `bun@1.2.15` fail if a `bun.lock` with `"lockfileVersion": 2` is committed (`UnknownLockfileVersion: failed to parse lockfile`).
- **Fix Applied**: `bun.lock` has been removed and replaced with standard `package-lock.json`. The build system will now cleanly install dependencies via `npm ci` without any version lock errors.
