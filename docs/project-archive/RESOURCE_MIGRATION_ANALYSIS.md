# Resource Migration Analysis
## sai_resourcesv2 → saithavy-nextjs

### Overview
This document analyzes the migration of resources from the `sai_resourcesv2` project to the Next.js application.

### Source Project Structure (sai_resourcesv2)

```
sai_resourcesv2/
└── content/
    ├── production/
    │   ├── anti-fragility-workbook.md (49KB)
    │   ├── burnout-prevention-checklist.md (40KB)
    │   ├── burnout-prevention-summary.md (8KB)
    │   ├── workbook-quick-reference.md (8KB)
    │   ├── workbook-summary.md (9KB)
    │   ├── outline.md (9KB)
    │   ├── resource2-strategic-pause-guide/
    │   │   ├── outline.md
    │   │   └── [pages]
    │   ├── week1/
    │   │   ├── resource1-mindful-leadership-journal/
    │   │   │   ├── outline.md
    │   │   │   └── summary.md
    │   │   ├── resource2-strategic-pause-guide/
    │   │   │   ├── audio-companion-script.md
    │   │   │   ├── CONTENT-CHECKLIST.md
    │   │   │   ├── outline.md
    │   │   │   ├── PRODUCTION-SUMMARY.md
    │   │   │   ├── strategic-pause-guide-page1.md
    │   │   │   ├── strategic-pause-guide-page6.md
    │   │   │   ├── strategic-pause-guide-pages2-3.md
    │   │   │   └── strategic-pause-guide-pages4-5.md
    │   │   └── resource3-mindful-meeting-checklist/
    │   │       ├── mindful-meeting-checklist.md
    │   │       └── outline.md
    │   └── week3/
    │       ├── resource3-inclusive-automation-readiness-kit/
    │       │   ├── CONTENT-CHECKLIST.md
    │       │   ├── inclusive-automation-readiness-kit-complete.md
    │       │   ├── outline.md
    │       │   ├── PRODUCTION-SUMMARY.md
    │       │   └── quick-reference.md
    │       └── resource5-ai-tools-evaluation-framework/
    │           ├── ai-tools-evaluation-framework.md
    │           ├── outline.md
    │           └── summary.md
    └── [social media templates]
```

### Current State (saithavy-nextjs)

**Resources Defined:** 62 resources in `src/lib/resourcesData.ts`

**Content Files Present:** 34 markdown files in `src/content/resources/`

**Issues Identified:**
1. ❌ Many resources defined in `resourcesData.ts` lack corresponding content files
2. ❌ Some content paths in `resourcesData.ts` don't match actual file locations
3. ❌ Missing properties (`isPremium`, `fileSize`) were just added
4. ❌ Syntax errors (missing commas) were just fixed

### Content Mapping

#### ✅ Content Exists (34 files)
- `production/anti-fragility-workbook.md` → Resource ID 4
- `production/burnout-prevention-checklist.md` → Resource ID 22
- `production/week1/resource1-mindful-leadership-journal/summary.md` → Resource ID 2
- `production/week1/resource2-strategic-pause-guide/*` → Resource ID 13
- `production/week1/resource3-mindful-meeting-checklist/*` → Resource ID 16
- `production/week3/resource3-inclusive-automation-readiness-kit/*` → Resource ID 1
- `production/week3/resource5-ai-tools-evaluation-framework/*` → Resource ID 28
- `mindful-leadership/mindful-leadership-reflection-journal.md` → Resource ID 2
- `ai-automation/inclusive-automation-readiness-kit.md` → Resource ID 1

#### ❌ Content Missing (28 resources need content)
The following resources are defined but have no content files:
- Resource ID 3: Remote Work Productivity Masterclass
- Resource ID 5: AI Strategy Templates for Small Business
- Resource ID 6: Resilience Audio Series
- Resource ID 7: Team Mindfulness Meditation Pack
- Resource ID 8: Digital Nomad Workspace Setup Guide
- Resource ID 9: Goal Setting Framework Canvas
- Resource ID 10: Overcoming Burnout Recovery Plan
- Resource ID 11: AI Email Automation Templates
- [and 18 more...]

### Migration Tasks

#### Phase 1: Copy Missing Content ✅ READY
1. Copy all production resources from `sai_resourcesv2` to `saithavy-nextjs/src/content/resources/`
2. Preserve directory structure for organized resources
3. Update `contentPath` in `resourcesData.ts` where needed

#### Phase 2: Create Individual Landing Pages ✅ READY
1. Verify `/resources/[category]/[slug]` route works for all 62 resources
2. Ensure content loads correctly from markdown files
3. Add "Content coming soon" message for resources without content
4. Implement download functionality

#### Phase 3: Content Enhancement 📋 PENDING
1. Create placeholder content for missing resources
2. Add frontmatter to all markdown files for metadata
3. Implement PDF generation/download
4. Add email capture for premium resources

### Next Steps

1. **Immediate:** Copy all content from sai_resourcesv2 → saithavy-nextjs
2. **Then:** Update contentPath mappings in resourcesData.ts
3. **Finally:** Test all 62 resource landing pages

---

**Generated:** 2025-03-23
**Status:** Ready for migration execution
