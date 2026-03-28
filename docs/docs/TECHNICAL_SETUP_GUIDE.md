# Technical Setup Guide
## Days 3-4: Infrastructure Setup

**Date:** March 12, 2026
**Phase:** Week 1 - Foundation Setup
**Estimated Time:** 6-8 hours

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Supabase Setup](#step-1-supabase-setup)
3. [Step 2: Cloudflare R2 Setup](#step-2-cloudflare-r2-setup)
4. [Step 3: Vercel Deployment](#step-3-vercel-deployment)
5. [Step 4: Resend Email Setup](#step-4-resend-email-setup)
6. [Step 5: Plausible Analytics](#step-5-plausible-analytics)
7. [Step 6: Environment Configuration](#step-6-environment-configuration)
8. [Step 7: Database Schema](#step-7-database-schema)
9. [Step 8: Testing](#step-8-testing)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account (for Vercel deployment)
- [ ] Google account or GitHub account (for Supabase)
- [ ] Credit card (for free tiers, no charges until upgrades)

### Required Tools
- [ ] Node.js 20+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Web browser (Chrome, Firefox, or Safari)

### Time Estimate
- **Supabase Setup:** 1-2 hours
- **Cloudflare R2:** 30-60 minutes
- **Vercel Deployment:** 30-60 minutes
- **Resend Email:** 30-60 minutes
- **Plausible Analytics:** 30-60 minutes
- **Environment Config:** 30 minutes
- **Database Setup:** 1-2 hours
- **Testing:** 30-60 minutes

**Total:** 6-8 hours

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

**Go to:** https://supabase.com

**Steps:**

1. **Sign Up / Log In**
   - Click "Start your project"
   - Choose "Continue with GitHub" (recommended)
   - Authorize Supabase access to your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Project name: `sai-resources-v2`
   - Database Password: [Generate and SAVE securely]
   - Region: Choose nearest region (US East, EU West, etc.)
   - Pricing Plan: Free tier (click "Continue")
   - Wait for project creation (1-2 minutes)

3. **Save Your Credentials**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Database Password: [Your generated password]
   ```
   **Store these securely!** You'll need them for environment variables.

### 1.2 Configure Database

**Go to:** SQL Editor in Supabase dashboard

**Run these SQL commands:**

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  gradient TEXT,
  accent_color TEXT,
  hero_headline TEXT,
  hero_subtext TEXT
);

-- Insert categories
INSERT INTO categories (name, slug, description, icon, gradient, accent_color, hero_headline, hero_subtext) VALUES
('Mindful Leadership', 'mindful-leadership', 'Reflection tools, guided meditations, leadership prompts', 'Brain', 'from-[#1B263B] to-[#2D3A50]', '#A8DADC', 'Lead with Clarity and Intention', 'Discover reflection tools, guided meditations, and leadership prompts to cultivate conscious decision-making and authentic influence.'),
('AI + Automation', 'ai-automation', 'Lead magnets, calculators, workflows, tutorials on business automation', 'Zap', 'from-[#1B263B] to-[#E07A5F]', '#F4A261', 'Work Smarter with AI', 'Leverage lead magnets, calculators, workflows, and tutorials to automate your business while maintaining your human touch.'),
('Personal Growth', 'personal-growth', 'Self-coaching worksheets, anti-fragility guides, introspection exercises', 'Sprout', 'from-[#1B263B] to-[#A8DADC]', '#E07A5F', 'Embrace Your Evolution', 'Unlock your potential with self-coaching worksheets, anti-fragility guides, and powerful introspection exercises.'),
('Remote Work Resources', 'remote-work', 'Productivity checklists, workspace setup guides, time-blocking templates', 'Home', 'from-[#1B263B] to-[#5E6472]', '#A8DADC', 'Thrive Anywhere', 'Optimize your remote work journey with productivity checklists, workspace setup guides, and time-blocking templates.'),
('Overcoming Adversity', 'overcoming-adversity', 'Audio stories, journaling prompts, resilience maps', 'Target', 'from-[#1B263B] to-[#6D28D9]', '#E07A5F', 'Rise Through Challenges', 'Find strength and resilience with audio stories, journaling prompts, and resilience maps designed to help you bounce back.');

-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  tags TEXT[],
  type TEXT NOT NULL CHECK (type IN ('PDF', 'Template', 'Guide', 'Audio', 'Video', 'Checklist')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  access_type TEXT DEFAULT 'free' CHECK (access_type IN ('free', 'premium')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_featured ON resources(featured);

-- Create downloads table (analytics)
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  email_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_token TEXT
);

CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);
CREATE INDEX idx_downloads_created_at ON downloads(downloaded_at DESC);

-- Create subscribers table (email marketing)
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribe_token TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB
);

CREATE INDEX idx_subscribers_email ON subscribers(email);

-- Create download_tokens table
CREATE TABLE download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_download_tokens_token ON download_tokens(token);
CREATE INDEX idx_download_tokens_expires_at ON download_tokens(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - will refine later)
CREATE POLICY "Public downloads are viewable by everyone"
  ON downloads FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own downloads"
  ON downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Subscribers are viewable by everyone"
  ON subscribers FOR SELECT
  USING (true);
```

### 1.3 Configure Storage

**Go to:** Storage in Supabase dashboard

**Steps:**

1. **Create Buckets**
   - Click "New bucket"
   - Bucket name: `resources`
   - Public bucket: NO (for R2 integration later)
   - File size limit: 50MB (Supabase) - larger files go to R2

2. **Configure CORS** (for R2 integration)
   - Go to Settings → API
   - Add CORS origins:
     - `http://localhost:5173` (local dev)
     - `https://yourdomain.com` (production)
     - `https://vercel.app` (Vercel preview)

### 1.4 Get API Credentials

**Go to:** Project Settings → API

**Copy these keys:**
- **Project URL:** https://xxxxx.supabase.co
- **anon public:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` **⚠️ KEEP SECRET!**

---

## Step 2: Cloudflare R2 Setup

### 2.1 Create Cloudflare Account

**Go to:** https://dash.cloudflare.com/sign-up

**Steps:**

1. **Sign Up**
   - Enter email address
   - Create password
   - Choose free plan

2. **Verify Email**
   - Check your email for verification link
   - Click verification link

### 2.2 Create R2 Bucket

**Go to:** R2 Overview in Cloudflare dashboard

**Steps:**

1. **Create Bucket**
   - Click "Create bucket"
   - Bucket name: `sai-resources-v2` (must be globally unique)
   - Location: Choose nearest region
   - Click "Create bucket"

2. **Configure Bucket**
   - Go to bucket settings
   - Enable versioning (optional but recommended)
   - Configure lifecycle rules (optional)

### 2.3 Get API Tokens

**Go to:** R2 Overview → Manage R2 API Tokens

**Steps:**

1. **Create API Token**
   - Click "Create API Token"
   - Name: `Sai Resources Upload`
   - Permissions: Admin Read & Write
   - TTL: Leave blank (never expires)
   - Click "Create API Token"

2. **Save Credentials**
   ```
   Account ID: [Your Account ID - find in right sidebar]
   Access Key ID: [Your Access Key ID]
   Secret Access Key: [Your Secret Access Key]
   ```
   **⚠️ SAVE THESE SECURELY!**

---

## Step 3: Vercel Deployment

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

This will open your browser for authentication.

### 3.3 Initialize Project

**In project directory:**

```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
vercel
```

**Follow prompts:**
- **Set up and deploy?** Y
- **Which scope?** Y (all)
- **Link to existing project?** N
- **Project name:** `sai-resources-v2`
- **Directory:** `./` (current directory)
- **Override settings?** N

### 3.4 Configure Project

**In Vercel dashboard:**

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`
5. **Root Directory:** `./`

### 3.5 Set Environment Variables

**Go to:** Settings → Environment Variables in Vercel dashboard

**Add these variables:**

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_R2_ACCOUNT_ID=your-cloudflare-account-id
VITE_R2_ACCESS_KEY_ID=your-r2-access-key-id
VITE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
VITE_RESEND_API_KEY=your-resend-api-key
VITE_PLAUSIBLE_DOMAIN=resources.yourdomain.com
```

### 3.6 Deploy to Production

```bash
vercel --prod
```

This will deploy your site to production.

---

## Step 4: Resend Email Setup

### 4.1 Create Resend Account

**Go to:** https://resend.com

**Steps:**

1. **Sign Up**
   - Enter email address
   - Create password
   - Verify email

2. **Complete Setup**
   - Add your name
   - Answer questions about your use case
   - Choose plan: Free tier (3,000 emails/month)

### 4.2 Verify Domain

**Go to:** Domains in Resend dashboard

**Steps:**

1. **Add Domain**
   - Domain: `yourdomain.com` (or use `@resend.com` for testing)
   - Click "Add Domain"

2. **Verify DNS**
   - **If using your domain:**
     - Add these DNS records:
       - TXT: `resend._domainkey.yourdomain.com`
       - TXT: `v=spf1 include:resend.com ~all`
     - Wait for DNS propagation (can take 24-48 hours)

   - **If using @resend.com:**
     - No verification needed
     - Ready to use immediately

### 4.3 Get API Key

**Go to:** API Keys in Resend dashboard

**Steps:**

1. **Create API Key**
   - Click "Create API Key"
   - Name: `Sai Resources Production`
   - Copy API key: `re_xxxxxxxxxxxx`

2. **Save API Key**
   ```
   Resend API Key: re_xxxxxxxxxxxx
   ```

### 4.4 Create Email Templates

**Go to:** Emails → Templates in Resend dashboard

**Template 1: Download Confirmation**

**Subject:** `Your {{resource_title}} is here!`

**HTML:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Download</title>
</head>
<body style="font-family: system-ui, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; padding: 40px;">
    <h1 style="color: #1B263B; font-size: 28px; margin-bottom: 20px;">{{resource_title}}</h1>
    <p style="color: #5E6472; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Thank you for downloading {{resource_title}}! This resource will help you {{benefit_statement}}.
    </p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{download_link}}" style="display: inline-block; background: {{category_color}}; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">Download Now</a>
    </div>
    <p style="color: #8D99AE; font-size: 14px; line-height: 1.5;">
      <strong>Important:</strong> This download link expires in 24 hours.
    </p>
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 40px 0;">
    <p style="color: #5E6472; font-size: 14px; margin-bottom: 10px;">You might also like:</p>
    <ul style="color: #5E6472; font-size: 14px; line-height: 1.6;">
      {% for related in related_resources %}
      <li style="margin-bottom: 8px;"><a href="{{related.link}}" style="color: {{category_color}}; text-decoration: none;">{{related.title}}</a></li>
      {% endfor %}
    </ul>
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 40px 0;">
    <p style="color: #8D99AE; font-size: 12px;">
      You received this email because you downloaded {{resource_title}} from Sai Resources v2.
      <br><br>
      <strong>Sai Resources v2</strong><br>
      123 Main Street, Suite 100<br>
      San Francisco, CA 94105
    </p>
  </div>
</body>
</html>
```

**Click "Save"**

---

## Step 5: Plausible Analytics

### 5.1 Create Plausible Account

**Go to:** https://plausible.io

**Steps:**

1. **Sign Up**
   - Email address
   - Password
   - Account name: `Sai Resources`

2. **Choose Plan**
   - Free trial (14 days)
   - Then $9/month (50k pageviews)
   - Or free for open source (if applicable)

### 5.2 Add Site

**Steps:**

1. **Add Website**
   - Site domain: `resources.yourdomain.com`
   - Click "Add site"

2. **Verify DNS**
   - **If using custom domain:**
     - Add CNAME record to your DNS:
       ```
       CNAME resources  plausible.io
       ```
     - Wait for DNS propagation

   - **If using Vercel:**
     - Plausible auto-detects Vercel
     - Follow integration wizard

### 5.3 Install Tracking Script

**Add to index.html:**

```html
<head>
  <script defer data-domain="resources.yourdomain.com" src="https://plausible.io/js/script.js"></script>
</head>
```

### 5.4 Configure Goals

**Go to:** Website → Goals in Plausible dashboard

**Create Goals:**

1. **Download Goal**
   - Goal name: `Download`
   - Event name: `Download`
   - Click "Save goal"

2. **Email Signup Goal**
   - Goal name: `Email Signup`
   - Page: `/` (homepage)
   - Trigger: Click on `.email-capture-form`

---

## Step 6: Environment Configuration

### 6.1 Create .env File

**In project root:**

```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
```

**Create `.env` file:**

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudflare R2
VITE_R2_ACCOUNT_ID=your-account-id
VITE_R2_ACCESS_KEY_ID=your-access-key-id
VITE_R2_SECRET_ACCESS_KEY=your-secret-access-key
VITE_R2_BUCKET_NAME=sai-resources-v2

# Resend
VITE_RESEND_API_KEY=re_xxxxxxxxxxxx

# Plausible
VITE_PLAUSIBLE_DOMAIN=resources.yourdomain.com
```

**⚠️ IMPORTANT:** Replace all `your-*` placeholders with actual values!

### 6.2 Update .gitignore

**Add to `.gitignore`:**

```
# Environment variables
.env
.env.local
.env.production

# Supabase
.supabase/

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

---

## Step 7: Database Schema (Advanced)

### 7.1 Enable Additional Tables

**Run these SQL commands in Supabase SQL Editor:**

```sql
-- Create email_captures table
CREATE TABLE email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_to_subscriber BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_email_captures_email ON email_captures(email);
CREATE INDEX idx_email_captures_resource ON email_captures(resource_id);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  session_id TEXT,
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_resource ON analytics_events(resource_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
```

### 7.2 Create Storage Helper Functions

**Go to:** Database → Functions in Supabase dashboard

**Function 1: Generate Presigned URL (for R2)**

```sql
CREATE OR REPLACE FUNCTION generate_presigned_url(file_key TEXT, file_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  account_id TEXT := CURRENT_SETTING('r2.account_id');
  access_key TEXT := CURRENT_SETTING('r2.access_key');
  secret_key TEXT := CURRENT_SETTING('r2.secret_key');
  bucket_name TEXT := CURRENT_SETTING('r2.bucket_name');
  region TEXT := 'auto';
  expires INTEGER := 900; -- 15 minutes
  url TEXT;
BEGIN
  -- This would normally use the R2 S3 API
  -- For now, return a placeholder
  url := 'https://' || bucket_name || '.r2.dev/' || file_key || '?response-content-disposition=attachment; filename=' || file_name;
  RETURN url;
END;
$$;
```

**Function 2: Generate Download Token**

```sql
CREATE OR REPLACE FUNCTION generate_download_token(resource_id UUID, user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
  expires_at TIMESTAMP;
BEGIN
  -- Generate random token
  token := encode(gen_random_bytes(32), 'base64');
  token := replace(token, '/', '');
  token := left(token, 32);

  -- Set expiration (24 hours)
  expires_at := NOW() + INTERVAL '24 hours';

  -- Insert token
  INSERT INTO download_tokens (resource_id, email, token, expires_at)
  VALUES (resource_id, user_email, token, expires_at);

  RETURN token;
END;
$$;
```

---

## Step 8: Testing

### 8.1 Test Database Connection

**Create test file:** `src/test-db.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing database connection...')

  // Test categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    console.error('Categories error:', error)
    return false
  }

  console.log('Categories found:', categories.length)
  console.log('Sample category:', categories[0])

  // Test resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .limit(5)

  console.log('Resources found:', resources?.length || 0)

  return true
}

testConnection()
```

**Run test:**

```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
npm run dev
```

Check browser console for output.

### 8.2 Test Environment Variables

**Create test file:** `src/test-env.ts`

```typescript
console.log('Testing environment variables...')

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing')
console.log('R2 Account ID:', import.meta.env.VITE_R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing')
console.log('Resend API Key:', import.meta.env.VITE_RESEND_API_KEY ? '✓ Set' : '✗ Missing')
console.log('Plausible Domain:', import.meta.env.VITE_PLAUSIBLE_DOMAIN ? '✓ Set' : '✗ Missing')
```

### 8.3 Test Vercel Deployment

```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
vercel --prod
```

**Verify:**
- [ ] Site deploys successfully
- [ ] Site is accessible at provided URL
- [ ] Pages load correctly
- [ ] No console errors

### 8.4 Test Email Delivery (Resend)

**Send test email via API or dashboard:**

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test Email from Sai Resources",
    "html": "<strong>This is a test email</strong>"
  }'
```

---

## ✅ Week 1 Days 3-4 Checklist

### Supabase
- [ ] Account created
- [ ] Project created: `sai-resources-v2`
- [ ] Database schema created (12 tables)
- [ ] Categories inserted (5 categories)
- [ ] Row-Level Security enabled
- [ ] Storage buckets created
- [ ] API keys generated and saved
- [ ] Database connection tested

### Cloudflare R2
- [ ] Account created
- [ ] Bucket created: `sai-resources-v2`
- [ ] API token created
- [ ] Credentials saved
- [ ] CORS configured

### Vercel
- [ ] Vercel CLI installed
- [ ] Logged in successfully
- [ ] Project initialized
- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Production deployment tested

### Resend
- [ ] Account created
- [ ] Domain added/verified
- [ ] API key generated
- [ ] Email template created
- [ ] Test email sent successfully

### Plausible
- [ ] Account created
- [ ] Site added
- [ ] DNS configured
- [ ] Tracking script added to index.html
- [ ] Goals configured (download, email signup)

### Environment Configuration
- [ ] .env file created
- [ ] All environment variables set
- [ ] .gitignore updated
- [ ] Environment variables tested
- [ ] Secrets stored securely

### Database
- [ ] All tables created
- [ ] Indexes created
- [ ] Foreign keys working
- [ ] RLS policies enabled
- [ ] Helper functions created
- [ ] Connection tested

### Testing
- [ ] Database connection tested
- [ ] Environment variables tested
- [ ] Vercel deployment tested
- [ ] Email delivery tested
- [ ] All services operational

---

## 🔑 Quick Reference: API Keys and URLs

**Save these securely (password manager):**

```
SUPABASE
├── URL: https://xxxxx.supabase.co
├── Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
├── Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└── DB Password: [your-generated-password]

CLOUDFLARE R2
├── Account ID: [from dashboard sidebar]
├── Access Key ID: [your-access-key-id]
└── Secret Access Key: [your-secret-key]

VERCEL
├── Project URL: [after first deploy]
└── Production URL: [after production deploy]

RESEND
└── API Key: re_xxxxxxxxxxxx

PLAUSIBLE
└── Site Domain: resources.yourdomain.com
```

---

## 🚨 Troubleshooting

### Common Issues

**Issue 1: Database Connection Fails**
- **Solution:** Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- **Solution:** Ensure .env file is loaded
- **Solution:** Verify Supabase project is active

**Issue 2: Environment Variables Not Loading**
- **Solution:** Restart dev server after changing .env
- **Solution:** Ensure .env is in project root
- **Solution:** Check VITE_ prefix (Vercel requires this)

**Issue 3: Email Not Sending**
- **Solution:** Verify Resend API key
- **Solution:** Check domain DNS settings
- **Solution:** Ensure sender email is verified

**Issue 4: Vercel Deployment Fails**
- **Solution:** Check build command works locally
- **Solution:** Ensure dist directory exists
- **Solution:** Check Vercel logs for errors

**Issue 5: Analytics Not Tracking**
- **Solution:** Verify plausible script is in <head>
- **Solution:** Check domain DNS
- **Solution:** Ensure site is publicly accessible

---

## 📞 Support

**Documentation:**
- Supabase: https://supabase.com/docs
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Vercel: https://vercel.com/docs
- Resend: https://resend.com/docs
- Plausible: https://plausible.io/docs

**Support Contacts:**
- Each platform has email support
- Community forums available
- Stack Overflow for technical issues

---

## ✅ Completion Criteria

**Days 3-4 complete when:**
- [ ] All accounts created and verified
- [ ] All API keys generated and stored
- [ ] Database schema created and tested
- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Email service tested
- [ ] Analytics configured
- [ ] All services operational

**Estimated Time:** 6-8 hours

**Next:** Day 5 (Design System) - Brand guidelines, color palette, typography, icon system

---

**Good luck with the setup! 🚀**

For questions, refer to WEEK_1_CHECKLIST.md or COMPREHENSIVE_PRODUCTION_PLAN.md
