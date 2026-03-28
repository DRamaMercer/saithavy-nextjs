# 🚀 Week 1: Quick Start Guide
## Technical Infrastructure Setup - Days 3-4

**Time Required:** 6-8 hours
**Status:** Ready to begin

---

## 📋 Overview

This guide will help you set up all technical infrastructure for the 62 resources production in just 6-8 hours.

**Platforms to Set Up:**
1. ✅ Supabase (Database, Auth, Storage)
2. ✅ Cloudflare R2 (File Storage)
3. ✅ Vercel (Hosting)
4. ✅ Resend (Email Service)
5. ✅ Plausible (Analytics)

---

## ⚡ Quick Start (Follow in Order)

### 1️⃣ Supabase (45-60 minutes)

**Step 1:** Go to https://supabase.com

**Step 2:** Click "Start your project" → Sign in with GitHub

**Step 3:** Create project
- Name: `sai-resources-v2`
- Database password: [Generate and SAVE!]
- Region: Choose nearest region
- Plan: Free tier

**Step 4:** Run this SQL in Supabase SQL Editor:
<details>
<summary>Click to expand SQL script</summary>

```sql
-- Create categories
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

-- Create indexes
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_featured ON resources(featured);

-- Create downloads table
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

-- Create subscribers table
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
```

</details>

**Step 5:** Enable RLS (Row Level Security)
```sql
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
```

**Step 6:** Get API Keys
- Go to: Project Settings → API
- Copy: Project URL, anon key, service_role key
- **SAVE SECURELY!** ⚠️

**✅ Supabase Done!**

---

### 2️⃣ Cloudflare R2 (20-30 minutes)

**Step 1:** Go to https://dash.cloudflare.com/sign-up

**Step 2:** Sign up with email (free account)

**Step 3:** Go to R2 Object Storage

**Step 4:** Create bucket
- Name: `sai-resources-v2-[random]` (add random for uniqueness)
- Location: Choose nearest region
- Click "Create bucket"

**Step 5:** Create API Token
- Go to: R2 Overview → Manage R2 API Tokens
- Click: Create API Token
- Name: `Sai Resources Upload`
- Permissions: Admin Read & Write
- **SAVE CREDENTIALS!** ⚠️ (displayed only once)

**Step 6:** Get Account ID
- Found in right sidebar of dashboard
- Copy Account ID

**✅ Cloudflare R2 Done!**

---

### 3️⃣ Vercel Deployment (30-45 minutes)

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Login
```bash
vercel login
```
(Follow browser authentication)

**Step 3:** Initialize project
```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
vercel
```
- Set up and deploy: Y
- Which scope: Y
- Link to existing project: N
- Project name: sai-resources-v2

**Step 4:** Configure environment variables in Vercel dashboard:
- Settings → Environment Variables → Add
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_R2_ACCOUNT_ID=your-r2-account-id
VITE_R2_ACCESS_KEY_ID=your-r2-access-key-id
VITE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
VITE_RESEND_API_KEY=your-resend-key
VITE_PLAUSIBLE_DOMAIN=resources.yourdomain.com
```

**Step 5:** Deploy
```bash
vercel --prod
```

**✅ Vercel Done!**

---

### 4️⃣ Resend Email (20-30 minutes)

**Step 1:** Go to https://resend.com

**Step 2:** Sign up with email

**Step 3:** Add domain
- For testing: Use `@resend.com`
- For production: Add your domain
- Verify DNS (if using custom domain)

**Step 4:** Get API key
- Go to: API Keys
- Create API key: "Sai Resources Production"
- Copy: `re_xxxxxxxxxxxx`

**Step 5:** Test email
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test from Sai Resources",
    "html": "<strong>Test successful!</strong>"
  }'
```

**✅ Resend Done!**

---

### 5️⃣ Plausible Analytics (20-30 minutes)

**Step 1:** Go to https://plausible.io

**Step 2:** Sign up (14-day free trial, then $9/mo)

**Step 3:** Add site
- Site domain: `resources.yourdomain.com`
- Or use Vercel integration (auto-detects)

**Step 4:** Verify DNS
- Add CNAME: `resources → plausible.io` (if custom domain)
- Wait 24-48 hours for propagation

**Step 5:** Add tracking script
```html
<!-- Add to index.html <head> -->
<script defer data-domain="resources.yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**✅ Plausible Done!**

---

## 🔧 Final Configuration

### Step 6: Configure Environment

**1. Create .env file**
```bash
cd C:\Users\Saith\dyad-apps\sai_resourcesv2
cp .env.example .env
```

**2. Edit .env**
```bash
# Replace all placeholders with actual values:
# VITE_SUPABASE_URL → your actual URL
# VITE_SUPABASE_ANON_KEY → your actual key
# etc.
```

**3. Install dependencies**
```bash
npm install
```

**4. Test everything**
```bash
npm run dev
```

Check browser console for:
- Database connection test
- Environment variables test

**5. Deploy to production**
```bash
vercel --prod
```

**✅ All Done!**

---

## 🎯 Success Checklist

**Infrastructure:**
- [ ] Supabase project created
- [ ] Database schema created (12 tables)
- [ ] 5 categories inserted
- [ ] API keys obtained and stored
- [ ] R2 bucket created
- [ ] R2 API token obtained
- [ ] Vercel project deployed
- [ ] Resend API key obtained
- [ ] Plausible site added
- [ ] Environment variables configured
- [ ] Dependencies installed

**Testing:**
- [ ] Local dev server runs
- [ ] Database connection works
- [ ] Environment variables load
- [ ] Production deployment works
- [ ] Test email sent and received
- [ ] Analytics tracking works

**Estimated Time:** 6-8 hours

---

## 🚨 Troubleshooting

**Issue:** Database connection fails
**Fix:** Check .env file, restart dev server, verify API keys

**Issue:** Email not sending
**Fix:** Verify API key, check domain DNS, ensure sender email verified

**Issue:** Analytics not tracking
**Fix:** Check script in <head>, verify DNS propagation, ensure site is public

---

## 📞 Quick Reference

**Files Created:**
- `TECHNICAL_SETUP_GUIDE.md` - Detailed setup instructions
- `SETUP_INSTRUCTIONS.md` - Step-by-step guide
- `.env.example` - Environment variables template

**Files to Edit:**
- `.env` - Add your actual credentials

**Documentation:**
- `WEEK_1_CHECKLIST.md` - Week 1 task checklist
- `BRAND_GUIDELINES.md` - Design system reference

---

## 🎉 You're Ready!

Once complete, you'll have:
- ✅ Production database with 5 categories
- ✅ File storage for all 62 resources
- ✅ Production hosting
- ✅ Email service for lead magnets
- ✅ Analytics tracking

**Next:** Day 5 - Design System
**Create:** Brand guidelines, color palette, typography, templates

---

**Need Help?**
- See TECHNICAL_SETUP_GUIDE.md for detailed instructions
- See SETUP_INSTRUCTIONS.md for step-by-step guide
- See WEEK_1_CHECKLIST.md for tracking progress

**Good luck! 🚀**
