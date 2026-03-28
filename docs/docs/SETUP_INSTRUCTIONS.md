# Week 1 Day 3-4: Technical Setup Script
## Automated Setup Guide

**Follow this guide step-by-step to set up all technical infrastructure.**

---

## 🚀 Quick Start (60-90 minutes each platform)

### Step 1: Supabase (30-60 minutes)

**1. Create Account**
```bash
# Visit: https://supabase.com
# Click: "Start your project"
# Sign in with GitHub
# Project name: sai-resources-v2
# Region: Choose nearest region
# Pricing: Free tier
```

**2. Run Database Setup**
```sql
-- Copy and paste this in Supabase SQL Editor

-- Categories (5 rows)
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

INSERT INTO categories (name, slug, description, icon, gradient, accent_color, hero_headline, hero_subtext) VALUES
('Mindful Leadership', 'mindful-leadership', 'Reflection tools, guided meditations, leadership prompts', 'Brain', 'from-[#1B263B] to-[#2D3A50]', '#A8DADC', 'Lead with Clarity and Intention', 'Discover reflection tools, guided meditations, and leadership prompts to cultivate conscious decision-making and authentic influence.'),
('AI + Automation', 'ai-automation', 'Lead magnets, calculators, workflows, tutorials on business automation', 'Zap', 'from-[#1B263B] to-[#E07A5F]', '#F4A261', 'Work Smarter with AI', 'Leverage lead magnets, calculators, workflows, and tutorials to automate your business while maintaining your human touch.'),
('Personal Growth', 'personal-growth', 'Self-coaching worksheets, anti-fragility guides, introspection exercises', 'Sprout', 'from-[#1B263B] to-[#A8DADC]', '#E07A5F', 'Embrace Your Evolution', 'Unlock your potential with self-coaching worksheets, anti-fragility guides, and powerful introspection exercises.'),
('Remote Work Resources', 'remote-work', 'Productivity checklists, workspace setup guides, time-blocking templates', 'Home', 'from-[#1B263B] to-[#5E6472]', '#A8DADC', 'Thrive Anywhere', 'Optimize your remote work journey with productivity checklists, workspace setup guides, and time-blocking templates.'),
('Overcoming Adversity', 'overcoming-adversity', 'Audio stories, journaling prompts, resilience maps', 'Target', 'from-[#1B263B] to-[#6D28D9]', '#E07A5F', 'Rise Through Challenges', 'Find strength and resilience with audio stories, journaling prompts, and resilience maps designed to help you bounce back.');

-- Resources table
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

-- Downloads table
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  email_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_token TEXT
);

-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribe_token TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB
);

-- Download tokens table
CREATE TABLE download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);
CREATE INDEX idx_downloads_created_at ON downloads(downloaded_at DESC);
CREATE INDEX idx_subscribers_email ON subscribers(email);
```

**3. Enable RLS**
```sql
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
```

---

### Step 2: Cloudflare R2 (20-30 minutes)

**1. Create Account**
```bash
# Visit: https://dash.cloudflare.com/sign-up
# Email: your-email@example.com
# Password: [create strong password]
# Plan: Free
```

**2. Create R2 Bucket**
```bash
# Navigate to: R2 Object Storage
# Click: Create bucket
# Bucket name: sai-resources-v2-XXXXX (add random string to make unique)
# Location: Choose nearest region
# Click: Create bucket
```

**3. Create API Token**
```bash
# Navigate to: R2 Overview → Manage R2 API Tokens
# Click: Create API Token
# Name: Sai Resources Upload
# Permissions: Admin Read & Write
# TTL: [Leave blank]
# Click: Create API Token
# SAVE credentials (displayed only once!)
```

**4. Get Account ID**
```bash
# Found in right sidebar of dashboard
# Copy: Account ID (32 character string)
# SAVE to .env file
```

---

### Step 3: Vercel Deployment (30-45 minutes)

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Login to Vercel**
```bash
vercel login
# Follow browser authentication
```

**3. Initialize Project**
```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
vercel
# Prompts:
# Set up and deploy? → Y
# Which scope? → Y (all)
# Link to existing project? → N
# Project name → sai-resources-v2
# Directory → ./
# Override settings? → N
```

**4. Configure Environment Variables**
```bash
# In Vercel dashboard → Settings → Environment Variables
# Add each variable:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_R2_ACCOUNT_ID
# VITE_R2_ACCESS_KEY_ID
# VITE_R2_SECRET_ACCESS_KEY
# VITE_RESEND_API_KEY
# VITE_PLAUSIBLE_DOMAIN
```

**5. Deploy**
```bash
vercel --prod
```

---

### Step 4: Resend Email (20-30 minutes)

**1. Create Account**
```bash
# Visit: https://resend.com
# Email: your-email@example.com
# Password: [create strong password]
# Plan: Free (3,000 emails/month)
```

**2. Add Domain**
```bash
# Navigate to: Domains
# Click: Add domain
# For testing: Use @resend.com
# For production: Add yourdomain.com
# Click: Add domain
```

**3. Get API Key**
```bash
# Navigate to: API Keys
# Click: Create API Key
# Name: Sai Resources Production
# Copy: re_xxxxxxxxxxxx
# SAVE to .env file
```

**4. Send Test Email**
```bash
# Via API:
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test from Sai Resources",
    "html": "<strong>Test successful!</strong>"
  }'

# Or use Resend dashboard → Emails → Send Test Email
```

---

### Step 5: Plausible Analytics (20-30 minutes)

**1. Create Account**
```bash
# Visit: https://plausible.io
# Email: your-email@example.com
# Password: [create strong password]
# Account name: Sai Resources
# Plan: Free trial (14 days), then $9/month (50k pageviews)
```

**2. Add Website**
```bash
# Navigate to: Websites → Add website
# Site domain: resources.yourdomain.com
# Or use Vercel's integration (auto-detects)
# Click: Add site
```

**3. Verify DNS**
```bash
# If using custom domain:
# Add CNAME to your DNS:
# resources → plausible.io
# Wait 24-48 hours for DNS propagation

# If using Vercel:
# Plausible auto-detects Vercel
# Follow integration wizard
```

**4. Add Tracking Script**
```html
<!-- Add to index.html <head> -->
<script defer data-domain="resources.yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

### Step 6: Configure Environment (15 minutes)

**1. Create .env File**
```bash
# Copy .env.example to .env
cp .env.example .env
```

**2. Fill in Actual Values**
```bash
# Edit .env and replace all placeholders with actual values:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_SUPABASE_SERVICE_ROLE_KEY
# - VITE_R2_ACCOUNT_ID
# - VITE_R2_ACCESS_KEY_ID
# - VITE_R2_SECRET_ACCESS_KEY
# - VITE_RESEND_API_KEY
# - VITE_PLAUSIBLE_DOMAIN
```

**3. Verify .env**
```bash
# Ensure all values are set and no placeholders remain
# Check for extra spaces or quotes
```

---

### Step 7: Install Dependencies (5 minutes)

```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
npm install
```

---

### Step 8: Test Everything (15-30 minutes)

**1. Test Local Dev**
```bash
npm run dev
```
Check browser console for:
- "Testing database connection..."
- "Testing environment variables..."

**2. Test Deployment**
```bash
vercel --prod
```
Verify:
- Site deploys successfully
- Site loads at Vercel URL
- No console errors

**3. Test Database**
```bash
# Run test file (if created)
# Or check Supabase dashboard
# Should see 5 categories
```

**4. Test Email**
```bash
# Send test email via Resend dashboard
# Check your email inbox
```

---

## ✅ Success Criteria

**You'll know setup is complete when:**

✅ **Supabase:**
- Database accessible
- 5 categories visible
- API keys working

✅ **Cloudflare R2:**
- Bucket created
- API token generated
- Credentials saved

✅ **Vercel:**
- Site deployed
- Environment variables configured
- Site loads successfully

✅ **Resend:**
- API key generated
- Test email received
- Template created

✅ **Plausible:**
- Site added
- Tracking script added
- Analytics receiving data

---

## 🚨 Troubleshooting

**Problem:** Database connection fails
**Solution:**
- Check .env file is loaded
- Verify API keys are correct
- Restart dev server

**Problem:** Environment variables not loading
**Solution:**
- Ensure VITE_ prefix on all variables
- Restart dev server after .env changes
- Check Vercel environment variables

**Problem:** Email not sending
**Solution:**
- Verify Resend API key
- Check domain DNS settings
- Ensure sender email is verified

**Problem:** Analytics not tracking
**Solution:**
- Verify plausible script is in <head>
- Check domain DNS propagation
- Ensure site is publicly accessible

---

## 📞 Need Help?

**Documentation:**
- Supabase: https://supabase.com/docs
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Vercel: https://vercel.com/docs
- Resend: https://resend.com/docs
- Plausible: https://plausible.io/docs

**Support Email:**
- Each platform has email support
- Community forums available
- Stack Overflow for technical issues

---

## 🎯 What's Next?

After completing Days 3-4:
- ✅ Technical infrastructure operational
- ✅ All services connected and tested
- ✅ Ready for Day 5: Design System

**Next:** Create brand guidelines and templates

---

**Created:** March 12, 2026
**Part of:** Week 1 Foundation Setup
**Next:** Day 5: Design System
