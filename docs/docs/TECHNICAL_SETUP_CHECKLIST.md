# Technical Setup Checklist
## Days 3-4: Infrastructure Configuration

**Estimated Time:** 6-8 hours
**Status:** Ready to begin

---

## Progress Overview

- [ ] **Phase 1: Supabase Setup** (45-60 minutes)
- [ ] **Phase 2: Cloudflare R2 Setup** (20-30 minutes)
- [ ] **Phase 3: Vercel Deployment** (30-45 minutes)
- [ ] **Phase 4: Resend Email Setup** (20-30 minutes)
- [ ] **Phase 5: Plausible Analytics** (20-30 minutes)
- [ ] **Phase 6: Environment Configuration** (15 minutes)
- [ ] **Phase 7: Testing & Verification** (30 minutes)

**Overall Progress:** 0/7 phases complete

---

## Phase 1: Supabase Setup (45-60 minutes)

### Account Creation
- [ ] Go to https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign in with GitHub
- [ ] Create new project:
  - [ ] Name: `sai-resources-v2`
  - [ ] Database password: [Generate and SAVE securely]
  - [ ] Region: Choose nearest to your users
  - [ ] Pricing: Free tier

### Database Configuration
- [ ] Open SQL Editor in Supabase dashboard
- [ ] Copy and run the SQL schema from `SETUP_INSTRUCTIONS.md`
- [ ] Verify 5 categories were created
- [ ] Verify all tables exist:
  - [ ] categories
  - [ ] resources
  - [ ] downloads
  - [ ] subscribers
  - [ ] download_tokens

### Security Setup
- [ ] Enable Row Level Security (RLS):
  ```sql
  ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
  ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
  ```

### API Keys
- [ ] Go to Project Settings → API
- [ ] Copy these credentials to a secure location:
  - [ ] Project URL
  - [ ] anon key (public)
  - [ ] service_role key (admin - NEVER expose to client)
- [ ] Store credentials in password manager

**✅ Supabase Complete**

---

## Phase 2: Cloudflare R2 Setup (20-30 minutes)

### Account Creation
- [ ] Go to https://dash.cloudflare.com/sign-up
- [ ] Sign up with email
- [ ] Verify email address

### Bucket Creation
- [ ] Navigate to R2 Object Storage
- [ ] Click "Create bucket"
- [ ] Configure bucket:
  - [ ] Name: `sai-resources-v2-[random]` (add random string for uniqueness)
  - [ ] Location: Choose nearest region
- [ ] Click "Create bucket"

### API Token Creation
- [ ] Go to R2 Overview → Manage R2 API Tokens
- [ ] Click "Create API Token"
- [ ] Configure token:
  - [ ] Name: `Sai Resources Upload`
  - [ ] Permissions: Admin Read & Write
  - [ ] TTL: Leave blank (indefinite)
- [ ] Click "Create API Token"
- [ ] **IMPORTANT:** Copy credentials immediately (shown only once!)
  - [ ] Access Key ID
  - [ ] Secret Access Key

### Account ID
- [ ] Find Account ID in right sidebar of dashboard
- [ ] Copy Account ID (32 character string)

**✅ Cloudflare R2 Complete**

---

## Phase 3: Vercel Deployment (30-45 minutes)

### CLI Installation
- [ ] Install Vercel CLI:
  ```bash
  npm install -g vercel
  ```
- [ ] Verify installation: `vercel --version`

### Login & Authentication
- [ ] Login to Vercel:
  ```bash
  vercel login
  ```
- [ ] Follow browser authentication
- [ ] Verify login: `vercel whoami`

### Project Initialization
- [ ] Navigate to project directory:
  ```bash
  cd C:\Users\Saith\dyad-apps\sai_resourcesv2
  ```
- [ ] Initialize project:
  ```bash
  vercel
  ```
- [ ] Answer prompts:
  - [ ] Set up and deploy? → **Y**
  - [ ] Which scope? → **Y** (all)
  - [ ] Link to existing project? → **N**
  - [ ] Project name → `sai-resources-v2`
  - [ ] Directory → `./`
  - [ ] Override settings? → **N**

### Environment Variables
- [ ] Go to Vercel dashboard → Project → Settings → Environment Variables
- [ ] Add each variable (use values from Phases 1-2):
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `VITE_R2_ACCOUNT_ID`
  - [ ] `VITE_R2_ACCESS_KEY_ID`
  - [ ] `VITE_R2_SECRET_ACCESS_KEY`
  - [ ] `VITE_R2_BUCKET_NAME`
  - [ ] `VITE_RESEND_API_KEY`
  - [ ] `VITE_RESEND_FROM_EMAIL`
  - [ ] `VITE_PLAUSIBLE_DOMAIN`

### Production Deployment
- [ ] Deploy to production:
  ```bash
  vercel --prod
  ```
- [ ] Verify deployment succeeds
- [ ] Copy production URL

**✅ Vercel Complete**

---

## Phase 4: Resend Email Setup (20-30 minutes)

### Account Creation
- [ ] Go to https://resend.com
- [ ] Sign up with email
- [ ] Verify email address

### Domain Configuration
- [ ] Navigate to Domains
- [ ] Click "Add domain"
- [ ] For testing: Use `@resend.com`
- [ ] For production: Add your domain
  - [ ] Add domain: `yourdomain.com`
  - [ ] Verify DNS records (SPF, DKIM)
  - [ ] Wait for verification

### API Key Creation
- [ ] Navigate to API Keys
- [ ] Click "Create API Key"
- [ ] Configure:
  - [ ] Name: `Sai Resources Production`
  - [ ] Permissions: Full access
- [ ] Copy API key: `re_xxxxxxxxxxxx`

### Test Email
- [ ] Send test email via API:
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
- [ ] Verify email received
- [ ] Check spam folder if not received

**✅ Resend Complete**

---

## Phase 5: Plausible Analytics (20-30 minutes)

### Account Creation
- [ ] Go to https://plausible.io
- [ ] Sign up (14-day free trial)
- [ ] Choose plan: $9/month (50k pageviews)

### Site Configuration
- [ ] Navigate to Websites → Add website
- [ ] Configure site:
  - [ ] Site domain: `resources.yourdomain.com`
  - [ ] Or use Vercel integration (auto-detects)
- [ ] Click "Add site"

### DNS Verification (if using custom domain)
- [ ] Add CNAME record to your DNS:
  ```
  resources → plausible.io
  ```
- [ ] Wait 24-48 hours for DNS propagation

### Tracking Script
- [ ] Copy tracking script from Plausible dashboard
- [ ] Add to `index.html` <head>:
  ```html
  <script defer data-domain="resources.yourdomain.com" src="https://plausible.io/js/script.js"></script>
  ```

### Goals Configuration
- [ ] Set up goals:
  - [ ] File downloads
  - [ ] Email signups
  - [ ] Resource views

**✅ Plausible Complete**

---

## Phase 6: Environment Configuration (15 minutes)

### Local Environment File
- [ ] Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- [ ] Edit `.env` with actual values from Phases 1-5
- [ ] Verify no placeholder values remain
- [ ] Save file

### .gitignore Verification
- [ ] Ensure `.env` is in `.gitignore`:
  ```
  .env
  .env.local
  .env.*.local
  ```
- [ ] Verify `.env.example` is NOT ignored
- [ ] Commit `.env.example` to git

### Dependency Installation
- [ ] Install dependencies:
  ```bash
  pnpm install
  # or
  npm install
  ```
- [ ] Verify no errors
- [ ] Check `node_modules` exists

**✅ Environment Configuration Complete**

---

## Phase 7: Testing & Verification (30 minutes)

### Local Development Test
- [ ] Start dev server:
  ```bash
  pnpm run dev
  # or
  npm run dev
  ```
- [ ] Open browser to `http://localhost:5173`
- [ ] Check browser console for:
  - [ ] "Testing database connection..." ✓
  - [ ] "Testing environment variables..." ✓
  - [ ] No errors

### Database Connection Test
- [ ] Create test file `src/lib/test-db.ts` (temporary)
- [ ] Run Supabase connection test
- [ ] Verify connection successful
- [ ] Delete test file

### Environment Variables Test
- [ ] Verify all variables load correctly
- [ ] Check `import.meta.env` in browser console
- [ ] Confirm no undefined values

### Production Deployment Test
- [ ] Deploy to production:
  ```bash
  vercel --prod
  ```
- [ ] Open production URL
- [ ] Verify site loads
- [ ] Check browser console (no errors)
- [ ] Test responsive design (mobile)

### Email Delivery Test
- [ ] Send test email via Resend
- [ ] Verify delivery
- [ ] Check email formatting
- [ ] Verify links work

### Analytics Test
- [ ] Visit site in browser
- [ ] Check Plausible dashboard
- [ ] Verify visit recorded
- [ ] Test goals tracking

### End-to-End Test
- [ ] Test resource download flow
- [ ] Test email capture
- [ ] Verify database records created
- [ ] Check file storage (R2)

**✅ Testing Complete**

---

## Success Criteria

### Infrastructure
- [ ] Supabase database accessible with 5 categories
- [ ] R2 bucket created and accessible
- [ ] Vercel site deployed and functional
- [ ] Resend email sending successfully
- [ ] Plausible tracking visits

### Configuration
- [ ] All environment variables set
- [ ] No secrets in code
- [ ] `.gitignore` properly configured
- [ ] Dependencies installed

### Functionality
- [ ] Local dev server runs
- [ ] Database connection works
- [ ] Production deployment works
- [ ] Email delivery tested
- [ ] Analytics tracking verified

---

## Troubleshooting

### Database Connection Fails
**Symptoms:** "Database connection failed" error

**Solutions:**
1. Check `.env` file for correct values
2. Restart dev server
3. Verify API keys in Supabase dashboard
4. Check network connectivity
5. Clear browser cache

### Environment Variables Not Loading
**Symptoms:** `undefined` values for `import.meta.env`

**Solutions:**
1. Ensure `VITE_` prefix on all variables
2. Restart dev server after `.env` changes
3. Check for typos in variable names
4. Verify `.env` file exists
5. Check Vercel environment variables

### Email Not Sending
**Symptoms:** No email received

**Solutions:**
1. Verify Resend API key
2. Check domain DNS settings
3. Verify sender email is confirmed
4. Check spam folder
5. Test via Resend dashboard

### Analytics Not Tracking
**Symptoms:** No data in Plausible

**Solutions:**
1. Verify script in `<head>` of index.html
2. Check DNS propagation (24-48 hours)
3. Ensure site is publicly accessible
4. Verify correct data-domain attribute
5. Check browser console for errors

---

## Credentials Record

**Store these securely in your password manager:**

### Supabase
- Project URL: `______________________`
- Database password: `______________________`
- anon key: `______________________`
- service_role key: `______________________`

### Cloudflare R2
- Account ID: `______________________`
- Access Key ID: `______________________`
- Secret Access Key: `______________________`
- Bucket Name: `______________________`

### Vercel
- Project URL: `______________________`
- Production URL: `______________________`

### Resend
- API Key: `______________________`
- From Email: `______________________`

### Plausible
- Site Domain: `______________________`
- Dashboard URL: `______________________`

---

## Next Steps

After completing this checklist:

1. **Day 5:** Design System (brand guidelines already created)
2. **Days 6-7:** Template Creation
3. **Week 2:** Begin MVP Development (first 5 featured resources)

---

**Created:** March 12, 2026
**Part of:** Week 1 Foundation Setup
**Status:** Ready to execute
