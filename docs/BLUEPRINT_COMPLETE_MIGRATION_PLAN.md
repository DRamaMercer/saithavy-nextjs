# Blueprint → Saithavy-NextJS: Complete Migration Plan
## Frontend, Backend & Content

**Created:** 2026-03-28
**Status:** Ready for Execution
**Estimated Time:** 8-12 hours

---

## Executive Summary

This plan covers migrating **ALL** blueprint content and features to saithavy-nextjs:
- 5 comprehensive content packages (~105K words)
- 3 bonus guides (~16K words)
- 23 individual resources
- 6 landing pages (React → Next.js)
- Email capture API integration
- Assessment components

---

## Architecture Comparison

### Blueprint (Source)
```
Framework: React 19 + Vite
Router: React Router v7
Styling: Tailwind CSS
API: Fetch to /api endpoints
State: useState, useEffect
Location: src/pages/lead-magnets/
```

### Saithavy-NextJS (Target)
```
Framework: Next.js 15 (App Router)
Router: File-based routing
Styling: Tailwind CSS + CSS Variables
API: Next.js API Routes + Edge Functions
State: React Server Components + Client Components
Location: src/app/
```

---

## Part 1: Frontend Migration Plan

### 1.1 Route Mapping

| Blueprint Route | Next.js Route | File Location |
|-----------------|---------------|---------------|
| `/mindful-leadership` | `/lead-magnets/mindful-leadership` | `src/app/lead-magnets/mindful-leadership/page.tsx` |
| `/ai-innovation` | `/lead-magnets/ai-innovation` | `src/app/lead-magnets/ai-innovation/page.tsx` |
| `/resilience-toolkit` | `/lead-magnets/resilience-toolkit` | `src/app/lead-magnets/resilience-toolkit/page.tsx` |
| `/remote-work-mastery` | `/lead-magnets/remote-work-mastery` | `src/app/lead-magnets/remote-work-mastery/page.tsx` |
| `/personal-transformation` | `/lead-magnets/personal-transformation` | `src/app/lead-magnets/personal-transformation/page.tsx` |
| `/resources-hub` | `/resources` | **Already exists** ✅ |

### 1.2 Landing Page Structure

Each landing page will follow this Next.js structure:

```typescript
src/app/lead-magnets/
├── mindful-leadership/
│   ├── page.tsx                    // Main landing page (Server Component)
│   └── components/
│       ├── Hero.tsx                // Client Component
│       ├── Benefits.tsx            // Client Component
│       ├── WhatsIncluded.tsx       // Client Component
│       ├── Testimonials.tsx        // Client Component
│       ├── EmailCapture.tsx        // Client Component
│       └── FinalCTA.tsx            // Client Component
├── ai-innovation/
│   └── [same structure]
├── resilience-toolkit/
│   └── [same structure]
├── remote-work-mastery/
│   └── [same structure]
├── personal-transformation/
│   └── [same structure]
└── layout.tsx                      // Shared layout for lead magnets
```

### 1.3 Component Conversion Strategy

#### Blueprint Landing Page → Next.js

**Blueprint (React Router):**
```tsx
// MindfulLeadershipLanding.tsx (400+ lines, single file)
export function MindfulLeadershipLanding({ onNavigate }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br...">
      {/* Hero, Benefits, Form, etc. all in one file */}
    </div>
  );
}
```

**Next.js (Split approach):**
```tsx
// page.tsx (Server Component)
import { Metadata } from "next";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import EmailCapture from "./components/EmailCapture";

export const metadata: Metadata = {
  title: "Mindful Leadership Framework | Saithavy",
  description: "Complete 7-module framework for mindful leadership...",
  openGraph: {
    title: "Mindful Leadership Framework | Saithavy",
    description: "50+ pages of actionable content",
    images: ["/og/mindful-leadership.png"],
  },
};

export default function MindfulLeadershipPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <WhatsIncluded />
      <WhoItsFor />
      <Testimonials />
      <EmailCapture leadMagnet="mindful-leadership-framework" />
      <FinalCTA />
    </div>
  );
}

// components/Hero.tsx (Client Component)
"use client";
import { useState } from "react";
import { ArrowRight, Brain } from "lucide-react";

export default function Hero() {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return <MindfulLeadershipAssessment onComplete={() => setShowAssessment(false)} />;
  }

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero content */}
    </header>
  );
}
```

### 1.4 Color Theme Mapping

Blueprint uses direct Tailwind colors. Saithavy uses CSS variables. Map as follows:

| Content Package | Blueprint Color | Saithavy CSS Variable |
|----------------|-----------------|----------------------|
| Mindful Leadership | Blue (#E07A5F, #1B263B, #A8DADC) | Use existing or create new |
| AI Innovation | Purple (purple, violet) | `--accent-purple` |
| Resilience Toolkit | Emerald (emerald, teal) | `--accent-emerald` |
| Remote Work Mastery | Orange (orange, amber) | `--accent-orange` |
| Personal Transformation | Rose (rose, pink) | `--accent-rose` |

**Implementation:**
```css
/* src/app/globals.css - Add theme colors */
:root {
  --accent-blue: #3B82F6;
  --accent-purple: #8B5CF6;
  --accent-emerald: #10B981;
  --accent-orange: #F97316;
  --accent-rose: #F43F5E;

  /* Blueprint brand colors */
  --blue-terracotta: #E07A5F;
  --blue-navy: #1B263B;
  --blue-sage: #A8DADC;
}
```

### 1.5 Shared Components to Create

```typescript
src/components/lead-magnets/
├── LeadMagnetLayout.tsx          // Shared layout wrapper
├── LeadMagnetHero.tsx            // Reusable hero component
├── BenefitCard.tsx               // Reusable benefit card
├── DeliverableCard.tsx           // "What's Included" card
├── TestimonialCard.tsx           // Social proof card
├── EmailCaptureForm.tsx          // Email capture with validation
└── AssessmentLauncher.tsx        // Assessment trigger button
```

---

## Part 2: Backend Migration Plan

### 2.1 API Routes to Create

| Blueprint API | Next.js API Route | Purpose |
|----------------|------------------|---------|
| `/api/lead-capture` | `src/app/api/lead-capture/route.ts` | Email capture for lead magnets |
| `/api/assessment` | `src/app/api/assessment/route.ts` | Save assessment results |
| `/api/download` | **Already exists** ✅ | Resource download tracking |

### 2.2 Email Capture API Implementation

**Create:** `src/app/api/lead-capture/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, leadMagnet, metadata } = await request.json();

    // Validate input
    if (!email || !leadMagnet) {
      return NextResponse.json(
        { error: 'Email and leadMagnet are required' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('lead_captures')
      .insert({
        email,
        lead_magnet: leadMagnet,
        metadata,
        created_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Check if duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Already subscribed', existing: true },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      data
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2.3 Database Schema Updates

**Table:** `lead_captures` (create if not exists)

```sql
CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  lead_magnet TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_email_lead_magnet UNIQUE (email, lead_magnet)
);

CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_lead_magnet ON lead_captures(lead_magnet);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON lead_captures(created_at);
```

### 2.4 Email Service Integration

**Option 1: Direct Supabase (Simple)**
- Store leads in Supabase
- Use Supabase Dashboard to export to email service
- Simple, no external dependencies

**Option 2: ConvertKit Integration**
```typescript
// ConvertKit API helper
async function subscribeToConvertKit(email: string, formId: string, tags: number[]) {
  const response = await fetch('https://api.convertkit.com/v3/forms/' + formId + '/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Secret ${process.env.CONVERTKIT_API_SECRET}`
    },
    body: JSON.stringify({
      email,
      tags,
      fields: {
        source: 'lead-magnet'
      }
    })
  });

  return response.json();
}
```

**Option 3: Resend Integration (Recommended for Next.js)**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(email: string, leadMagnet: string) {
  await resend.emails.send({
    from: 'Saithavy <noreply@saithavy.com>',
    to: email,
    subject: `Your ${leadMagnet} is ready!`,
    template: 'lead-magnet-welcome',
    variables: {
      leadMagnet,
      downloadLink: `https://saithavy.com/resources/${leadMagnet}`
    }
  });
}
```

---

## Part 3: Component Migration Checklist

### 3.1 Components to Convert

| Blueprint Component | Target Location | Priority |
|--------------------|-----------------|----------|
| `MindfulLeadershipLanding.tsx` | `src/app/lead-magnets/mindful-leadership/page.tsx` | HIGH |
| `AIInnovationLanding.tsx` | `src/app/lead-magnets/ai-innovation/page.tsx` | HIGH |
| `ResilienceToolkitLanding.tsx` | `src/app/lead-magnets/resilience-toolkit/page.tsx` | HIGH |
| `RemoteWorkMasteryLanding.tsx` | `src/app/lead-magnets/remote-work-mastery/page.tsx` | HIGH |
| `PersonalTransformationLanding.tsx` | `src/app/lead-magnets/personal-transformation/page.tsx` | HIGH |
| `LeadMagnetsHub.tsx` | `src/app/resources/page.tsx` (update existing) | MEDIUM |
| `MindfulLeadershipAssessment.tsx` | `src/components/assessments/MindfulLeadershipAssessment.tsx` | MEDIUM |

### 3.2 Component Conversion Pattern

**For each landing page:**

1. **Split into subcomponents** (Hero, Benefits, etc.)
2. **Convert to Client Components** where needed (`"use client"`)
3. **Replace React Router** with Next.js Link
4. **Update styling** to use CSS variables where appropriate
5. **Add metadata** for SEO
6. **Integrate email capture**

**Example conversion:**

```tsx
// BEFORE: Blueprint
import { useNavigate } from "react-router-dom";

export function MindfulLeadershipLanding({ onNavigate }) {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/resources')}>Back</button>;
}

// AFTER: Next.js
"use client";

import Link from "next/link";

export default function MindfulLeadershipLanding() {
  return <Link href="/resources"><button>Back</button></Link>;
}
```

---

## Part 4: Content Migration Plan

### 4.1 Content Files to Copy

**From:** `blueprint/content/`, `blueprint/docs/`
**To:** `src/content/resources/`

#### Content Package Mapping

| Source | Target | Word Count |
|--------|--------|------------|
| `content/mindful-leadership-framework/*` | `mindful-leadership/mindful-leadership-framework-complete.md` | 35K |
| `docs/ai-innovation-playbook/*` | `ai-automation/ai-innovation-playbook-complete.md` | 25K |
| `content/resilience-toolkit/*` | `overcoming-adversity/resilience-toolkit-complete.md` | 15K |
| `docs/lead-magnets/remote-work-mastery/*` | `remote-work/remote-work-mastery-complete.md` | 12K |
| `content/personal-transformation/*` | `personal-growth/personal-transformation-complete.md` | 18K |

**Action:** Combine multi-file packages into single comprehensive markdown files with:
```yaml
---
title: Mindful Leadership Framework (Complete)
description: 7-module comprehensive framework...
category: mindful-leadership
type: workbook
featured: true
difficulty: intermediate
timeToRead: 90
isPremium: true
fileSize: 3.2 MB
---
```

### 4.2 Frontmatter Standardization

All migrated content needs this frontmatter structure:

```yaml
---
title: Resource Title
description: Brief 1-2 sentence description
category: mindful-leadership | ai-automation | personal-growth | remote-work | overcoming-adversity
type: guide | checklist | template | workbook | framework
featured: false
difficulty: beginner | intermediate | advanced
timeToRead: 15 (in minutes)
targetAudience:
  - Leaders
  - Managers
  - Founders
keywords:
  - keyword1
  - keyword2
  - keyword3
lastUpdated: 2026-03-28
isPremium: true
fileSize: 2.5 MB
downloadCount: 15000
rating: 4.9
---

# Content begins here...
```

---

## Part 5: Implementation Phases

### Phase 1: Backend Setup (2 hours)
- [ ] Create `lead_captures` table in Supabase
- [ ] Create `/api/lead-capture` route
- [ ] Set up email service integration (Resend/ConvertKit)
- [ ] Create `/api/assessment` route
- [ ] Test API endpoints

### Phase 2: Content Migration (3 hours)
- [ ] Copy 5 content packages (combine files)
- [ ] Add frontmatter to all files
- [ ] Copy 23 individual resources
- [ ] Copy 3 bonus guides
- [ ] Update `resourcesData.ts` with new entries
- [ ] Test content loading

### Phase 3: Landing Page Creation (4 hours)
- [ ] Create shared components
- [ ] Build Mindful Leadership landing page
- [ ] Build AI Innovation landing page
- [ ] Build Resilience Toolkit landing page
- [ ] Build Remote Work Mastery landing page
- [ ] Build Personal Transformation landing page
- [ ] Update resources hub with lead magnet section

### Phase 4: Assessment Components (2 hours)
- [ ] Convert MindfulLeadershipAssessment component
- [ ] Create assessment results API
- [ ] Integrate with landing pages
- [ ] Add progress tracking

### Phase 5: Testing & Launch (1 hour)
- [ ] Test all landing pages
- [ ] Test email capture flow
- [ ] Test assessment flow
- [ ] Test download functionality
- [ ] SEO check (metadata, OpenGraph)
- [ ] Mobile responsive test
- [ ] Accessibility audit

---

## Part 6: File Structure

### Final Structure

```
saithavy-nextjs/
├── src/
│   ├── app/
│   │   ├── lead-magnets/                    # NEW: Landing pages
│   │   │   ├── mindful-leadership/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   ├── ai-innovation/
│   │   │   ├── resilience-toolkit/
│   │   │   ├── remote-work-mastery/
│   │   │   ├── personal-transformation/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── lead-capture/
│   │   │   │   └── route.ts               # NEW
│   │   │   └── assessment/
│   │   │       └── route.ts                # NEW
│   │   └── resources/                      # UPDATE: Add lead magnet section
│   ├── components/
│   │   ├── lead-magnets/                   # NEW: Shared components
│   │   │   ├── LeadMagnetHero.tsx
│   │   │   ├── BenefitCard.tsx
│   │   │   ├── DeliverableCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── EmailCaptureForm.tsx
│   │   └── assessments/                    # NEW: Assessment components
│   │       └── MindfulLeadershipAssessment.tsx
│   ├── content/resources/                  # UPDATE: Add migrated content
│   │   ├── mindful-leadership/
│   │   │   └── mindful-leadership-framework-complete.md
│   │   ├── ai-automation/
│   │   │   └── ai-innovation-playbook-complete.md
│   │   ├── overcoming-adversity/
│   │   │   └── resilience-toolkit-complete.md
│   │   ├── remote-work/
│   │   │   └── remote-work-mastery-complete.md
│   │   └── personal-growth/
│   │       └── personal-transformation-complete.md
│   ├── lib/
│   │   └── resourcesData.ts                # UPDATE: Add new resources
│   └── types/
│       └── resources.ts                    # UPDATE: Add LeadMagnet type
└── docs/
    └── BLUEPRINT_MIGRATION_PLAN.md        # This document
```

---

## Part 7: Success Criteria

Migration is complete when:

### Content ✅
- [ ] All 5 content packages accessible
- [ ] All 23 individual resources accessible
- [ ] All 3 bonus guides accessible
- [ ] Frontmatter metadata on all files
- [ ] Content loads correctly on pages

### Frontend ✅
- [ ] All 5 landing pages functional
- [ ] Email capture forms working
- [ ] Assessment components working
- [ ] Mobile responsive on all pages
- [ ] Dark mode support working
- [ ] Accessibility (WCAG AA compliant)

### Backend ✅
- [ ] Lead capture API working
- [ ] Assessment API working
- [ ] Email service integrated
- [ ] Database schema created
- [ ] Error handling in place

### Integration ✅
- [ ] Navigation includes lead magnet links
- [ ] Resources hub showcases lead magnets
- [ ] Download tracking working
- [ ] Analytics tracking events

### SEO ✅
- [ ] Metadata on all pages
- [ ] OpenGraph tags configured
- [ ] Structured data (JSON-LD)
- [ ] Sitemap updated
- [ ] Robots.txt configured

---

## Part 8: Rollback Plan

If issues arise:

1. **Git revert** to pre-migration commit
2. **Database cleanup**: Drop `lead_captures` table
3. **Remove files**: Delete copied content files
4. **Restore** resourcesData.ts from backup

**Safe migration approach:**
1. Create feature branch
2. Implement incrementally
3. Test each phase
4. Merge to main when stable

---

## Part 9: Quick Start Commands

```bash
# 1. Create migration branch
git checkout -b migrate-blueprint-lead-magnets

# 2. Create directory structure
mkdir -p src/app/lead-magnets/{mindful-leadership,ai-innovation,resilience-toolkit,remote-work-mastery,personal-transformation}/components
mkdir -p src/components/lead-magnets
mkdir -p src/components/assessments

# 3. Copy content files (manual or script)
# Copy from blueprint to src/content/resources/

# 4. Update resourcesData.ts
# Add new resource entries

# 5. Test build
npm run build

# 6. Test dev server
npm run dev

# 7. Create Supabase table
# Use Supabase Dashboard or migration SQL

# 8. Test API endpoints
curl -X POST http://localhost:3000/api/lead-capture \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","leadMagnet":"mindful-leadership"}'

# 9. Commit and push
git add .
git commit -m "feat: migrate blueprint lead magnets"
git push origin migrate-blueprint-lead-magnets

# 10. Create PR and merge
```

---

## Part 10: Dependencies & Requirements

### Install if needed

```bash
# Email service (Resend - recommended)
npm install resend

# Or use built-in Supabase (no install needed)

# Icons (lucide-react - already installed)
npm install lucide-react

# Forms (react-hook-form - optional)
npm install react-hook-form zod @hookform/resolvers
```

### Environment Variables

```env
# .env.local

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxx

# Or Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Part 11: Priority Matrix

| Task | Priority | Time | Dependencies |
|------|----------|------|--------------|
| Database schema | HIGH | 30min | None |
| API routes | HIGH | 1hr | Database |
| Content migration | HIGH | 3hr | None |
| Shared components | MEDIUM | 1hr | None |
| Mindful Leadership LP | HIGH | 1hr | Shared components |
| AI Innovation LP | MEDIUM | 1hr | Shared components |
| Resilience Toolkit LP | MEDIUM | 1hr | Shared components |
| Remote Work Mastery LP | MEDIUM | 1hr | Shared components |
| Personal Transformation LP | MEDIUM | 1hr | Shared components |
| Assessment components | LOW | 2hr | None |
| Testing & QA | HIGH | 1hr | All above |

**Critical Path:** Database → API → Content → 1 Landing Page → Test → Remaining Pages

---

## Part 12: Next Steps

1. **Review this plan** with stakeholders
2. **Confirm email service** choice (Resend vs Supabase vs ConvertKit)
3. **Set up database** schema
4. **Begin Phase 1** (Backend Setup)
5. **Execute phases incrementally**
6. **Test thoroughly** before launch
7. **Monitor analytics** post-launch

---

**Prepared by:** Claude Code
**Project:** Saith Blueprint → Next.js Migration
**Source:** Blueprint (React + Vite)
**Target:** Saithavy-NextJS (Next.js App Router)
**Total Scope:** ~121K words, 6 landing pages, backend APIs, database integration
