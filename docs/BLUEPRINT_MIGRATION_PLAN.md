# Blueprint → Saithavy-NextJS Migration Plan

**Created:** 2026-03-26
**Status:** Ready for Execution
**Estimated Time:** 4-6 hours

---

## Executive Summary

This plan outlines migrating all resources from the **blueprint** project (React + Vite) to **saithavy-nextjs** (Next.js App Router). The blueprint project contains high-quality, production-ready content that needs to be integrated into the Next.js resource library.

---

## Source Analysis: Blueprint Project

### Content Structure

```
blueprint/
├── content/                          # Source content packages (3 bundles)
│   ├── mindful-leadership-framework/  # 7 files (~35,000 words)
│   │   ├── README.md
│   │   ├── 01-email-sequence.md
│   │   ├── 02-self-awareness-assessment.md
│   │   ├── 03-intention-setting-framework.md
│   │   ├── 04-communication-templates.md
│   │   ├── 05-team-culture-playbook.md
│   │   ├── 06-conflict-resolution-guide.md
│   │   └── 07-bonus-materials.md
│   ├── personal-transformation/       # 7 files
│   │   ├── README.md
│   │   ├── 01-email-sequence.md
│   │   ├── 02-vision-clarification.md
│   │   ├── 03-gap-analysis-worksheet.md
│   │   ├── 04-90-day-action-plan.md
│   │   ├── 05-weekly-review-template.md
│   │   ├── 06-progress-tracker.md
│   │   └── 07-reflection-prompts.md
│   └── resilience-toolkit/            # 8 files
│       ├── 00-welcome-guide.md
│       ├── 01-email-sequence.md
│       ├── 02-self-assessment.md
│       ├── 03-stress-response-toolkit.md
│       ├── 04-emotional-regulation.md
│       ├── 05-recovery-routines.md
│       ├── 06-support-network.md
│       └── 07-bonus-materials.md
├── dist/resources/                   # Individual resources (23 files)
│   ├── ai-implementation-checklist.md
│   ├── ai-prompt-engineering-guide.md
│   ├── ai-tools-productivity.md
│   ├── async-communication-mastery.md
│   ├── career-growth-playbook.md
│   ├── cross-cultural-communication.md
│   ├── decision-making-frameworks.md
│   ├── deep-work-protocol.md
│   ├── energy-management-system.md
│   ├── enterprise-ai-adoption-strategy.md
│   ├── enterprise-innovation-framework.md
│   ├── habit-building-blueprint.md
│   ├── innovation-system-guide.md
│   ├── meeting-optimization-toolkit.md
│   ├── mindful-leadership-workbook.md
│   ├── negotiation-scripts-library.md
│   ├── personal-branding-toolkit.md
│   ├── remote-team-communication-toolkit.md
│   ├── remote-work-setup-guide.md
│   ├── stress-management-framework.md
│   └── prompt-templates/              # 3 AI prompt files
│       ├── ai-content-prompts.md
│       ├── ai-analysis-prompts.md
│       └── ai-operations-prompts.md
└── docs/resources/                   # Additional documentation
    ├── BONUS_CONTENT_SUMMARY.md
    ├── HIGH_VALUE_RESOURCES_CONTENT.md
    └── IMPLEMENTATION_PLAN_BUNDLE.md
```

### Content Format

**Individual Resources** (dist/resources/) use frontmatter:
```yaml
---
Category: Productivity
Tier: PREMIUM
Tags: #deep-work, #focus, #productivity, #protocol
---

# Title

## Description
...

## Table of Contents
...

## Content
...
```

**Content Packages** (content/) are structured bundles with README + numbered modules.

---

## Target Analysis: Saithavy-NextJS

### Current Structure

```
saithavy-nextjs/
├── src/
│   ├── content/resources/            # Content files (34 existing)
│   │   ├── mindful-leadership/
│   │   ├── ai-automation/
│   │   ├── personal-growth/
│   │   ├── remote-work/
│   │   ├── overcoming-adversity/
│   │   └── production/
│   ├── lib/
│   │   ├── resourceContent.ts        # Content loader with gray-matter
│   │   └── resourcesData.ts          # Resource definitions (62 items)
│   ├── types/
│   │   └── resources.ts              # TypeScript interfaces
│   └── app/
│       └── resources/[category]/[slug]/  # Dynamic routes
│           └── page.tsx
```

### Resource Schema

```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  slug: string;
  contentPath?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  timeToRead?: number;
  targetAudience?: string[];
  keywords?: string[];
  lastUpdated?: string;
  isPremium?: boolean;
  fileSize?: string;
}
```

---

## Migration Strategy

### Phase 1: Content Migration (Priority: HIGH)

#### 1.1 Migrate Content Packages (3 bundles)

**Mindful Leadership Framework**
- Source: `blueprint/content/mindful-leadership-framework/`
- Target: `src/content/resources/mindful-leadership/mindful-leadership-framework-complete.md`
- Action: Combine all 7 modules into single comprehensive resource
- Add frontmatter metadata
- Create new resource entry in resourcesData.ts

**Personal Transformation**
- Source: `blueprint/content/personal-transformation/`
- Target: `src/content/resources/personal-growth/personal-transformation-complete.md`
- Action: Combine all 7 modules
- Add frontmatter metadata
- Create new resource entry

**Resilience Toolkit**
- Source: `blueprint/content/resilience-toolkit/`
- Target: `src/content/resources/overcoming-adversity/resilience-toolkit-complete.md`
- Action: Combine all 8 modules
- Add frontmatter metadata
- Create new resource entry

#### 1.2 Migrate Individual Resources (23 files)

Map each blueprint resource to appropriate category:

| Blueprint Resource | Target Category | Target Slug |
|-------------------|-----------------|-------------|
| ai-implementation-checklist.md | ai-automation | ai-implementation-checklist |
| ai-prompt-engineering-guide.md | ai-automation | ai-prompt-engineering-guide |
| ai-tools-productivity.md | ai-automation | ai-tools-productivity |
| async-communication-mastery.md | remote-work | async-communication-mastery |
| career-growth-playbook.md | personal-growth | career-growth-playbook |
| cross-cultural-communication.md | mindful-leadership | cross-cultural-communication |
| decision-making-frameworks.md | mindful-leadership | decision-making-frameworks |
| deep-work-protocol.md | personal-growth | deep-work-protocol |
| energy-management-system.md | personal-growth | energy-management-system |
| enterprise-ai-adoption-strategy.md | ai-automation | enterprise-ai-adoption-strategy |
| enterprise-innovation-framework.md | ai-automation | enterprise-innovation-framework |
| habit-building-blueprint.md | personal-growth | habit-building-blueprint |
| innovation-system-guide.md | ai-automation | innovation-system-guide |
| meeting-optimization-toolkit.md | mindful-leadership | meeting-optimization-toolkit |
| mindful-leadership-workbook.md | mindful-leadership | mindful-leadership-workbook |
| negotiation-scripts-library.md | mindful-leadership | negotiation-scripts-library |
| personal-branding-toolkit.md | personal-growth | personal-branding-toolkit |
| remote-team-communication-toolkit.md | remote-work | remote-team-communication-toolkit |
| remote-work-setup-guide.md | remote-work | remote-work-setup-guide |
| stress-management-framework.md | personal-growth | stress-management-framework |

#### 1.3 Migrate AI Prompt Templates

- Source: `blueprint/dist/resources/prompt-templates/`
- Target: `src/content/resources/ai-automation/`
- Files: 3 prompt template collections
- Combine or keep separate based on content size

### Phase 2: Frontmatter Standardization

#### 2.1 Add Frontmatter to All Migrated Content

Each markdown file needs consistent frontmatter:

```yaml
---
title: Resource Title
description: Brief description (1-2 sentences)
category: mindful-leadership | ai-automation | personal-growth | remote-work | overcoming-adversity
type: guide | checklist | template | workbook | framework
featured: false
difficulty: beginner | intermediate | advanced
timeToRead: 15
targetAudience:
  - Leaders
  - Managers
  - Founders
keywords:
  - keyword1
  - keyword2
  - keyword3
lastUpdated: 2026-03-26
isPremium: true
fileSize: 2.5 MB
---

# Content begins here...
```

#### 2.2 Extract Metadata from Blueprint Content

- Parse existing frontmatter from blueprint resources
- Extract categories, tags, tiers
- Map to saithavy-nextjs schema
- Add missing required fields

### Phase 3: Resource Registry Updates

#### 3.1 Update resourcesData.ts

Add entries for all migrated resources:

```typescript
export const resources: Resource[] = [
  // ... existing 62 resources

  // NEW: Blueprint content packages
  {
    id: '63',
    title: 'Mindful Leadership Framework (Complete)',
    description: 'Comprehensive 7-module framework covering self-awareness, intention-setting, communication, team culture, and conflict resolution with 50+ pages of actionable content.',
    category: 'mindful-leadership',
    type: 'workbook',
    slug: 'mindful-leadership-framework-complete',
    contentPath: 'mindful-leadership/mindful-leadership-framework-complete.md',
    featured: true,
    difficulty: 'intermediate',
    timeToRead: 90,
    targetAudience: ['Leaders', 'Managers', 'Executives'],
    keywords: ['leadership', 'mindfulness', 'communication', 'team-culture', 'conflict-resolution'],
    lastUpdated: '2026-03-26',
    isPremium: true,
    fileSize: '3.2 MB'
  },
  // ... add all other migrated resources
];
```

#### 3.2 Resource ID Assignment

- Continue from ID 63 (existing: 1-62)
- Assign unique IDs to all migrated resources
- Total new resources: ~26-30

### Phase 4: Content Processing

#### 4.1 Content Enrichment

For each migrated file:
1. **Validate markdown syntax**
2. **Check for broken links** (internal references)
3. **Update internal links** to new paths
4. **Add call-to-action** sections
5. **Ensure consistent formatting**

#### 4.2 Content Optimization

1. **Add table of contents** for long content
2. **Add summary sections** at top
3. **Include "What's Included"** sections for packages
4. **Add implementation checklists**
5. **Create quick-reference summaries**

### Phase 5: Testing & Validation

#### 5.1 Build Verification

```bash
cd saithavy-nextjs
npm run build
```

Ensure:
- ✅ Zero TypeScript errors
- ✅ Zero build warnings
- ✅ All routes generate successfully

#### 5.2 Content Loading Tests

```typescript
// Test each migrated resource
for (const resource of newResources) {
  const content = await getResourceContent(resource);
  assert(content.metadata, 'has metadata');
  assert(content.content, 'has content');
  assert(content.content.length > 0, 'content not empty');
}
```

#### 5.3 Route Testing

Test each resource page:
- `/resources/mindful-leadership/mindful-leadership-framework-complete`
- `/resources/ai-automation/ai-implementation-checklist`
- etc.

Verify:
- Page loads without errors
- Content displays correctly
- Metadata renders properly
- Download functionality works

---

## Implementation Checklist

### Pre-Migration
- [ ] Backup saithavy-nextjs (git commit)
- [ ] Create migration branch
- [ ] Review all blueprint content files
- [ ] Map categories and slugs

### Content Migration
- [ ] Copy mindful-leadership-framework (7 files → 1)
- [ ] Copy personal-transformation (7 files → 1)
- [ ] Copy resilience-toolkit (8 files → 1)
- [ ] Copy 20 individual resources
- [ ] Copy 3 AI prompt template files

### Frontmatter & Metadata
- [ ] Add frontmatter to all migrated files
- [ ] Extract metadata from blueprint
- [ ] Map categories to target schema
- [ ] Add missing required fields

### Registry Updates
- [ ] Add ~26-30 new resource entries to resourcesData.ts
- [ ] Assign unique IDs (63+)
- [ ] Verify all slugs are unique
- [ ] Check category assignments

### Testing
- [ ] Run TypeScript compilation
- [ ] Run build process
- [ ] Test content loading for all resources
- [ ] Test all resource pages
- [ ] Test download functionality

### Post-Migration
- [ ] Update resource count in UI
- [ ] Test search/filter with new resources
- [ ] Update sitemap
- [ ] Commit changes
- [ ] Deploy to staging

---

## File Operations Summary

### Files to Copy
- **3 content packages** → 3 comprehensive resources
- **23 individual resources** → 23 separate resources
- **3 AI prompt files** → 3 resources (or combine)
- **Total**: ~29 new content files

### Files to Modify
- `src/lib/resourcesData.ts` - Add ~26-30 resource entries

### Estimated Content Volume
- **Words**: ~60,000+ words
- **Pages**: ~120+ pages (PDF equivalent)
- **Files**: ~29 markdown files

---

## Potential Issues & Solutions

### Issue 1: Category Mapping
**Problem**: Blueprint uses different category names
**Solution**: Create mapping table and standardize

### Issue 2: Content Bundles
**Problem**: Blueprint has multi-file bundles, saithavy expects single files
**Solution**: Combine bundles with clear section separators

### Issue 3: Internal Links
**Problem**: Links within blueprint content reference old structure
**Solution**: Update all internal links to new paths

### Issue 4: Missing Frontmatter
**Problem**: Some blueprint content lacks frontmatter
**Solution**: Generate frontmatter from filename and content analysis

### Issue 5: Large File Sizes
**Problem**: Combined bundles may be very large
**Solution**: Consider splitting or implementing pagination

---

## Success Criteria

Migration is complete when:
1. ✅ All blueprint content is accessible in saithavy-nextjs
2. ✅ All resource pages load without errors
3. ✅ Content displays with proper formatting
4. ✅ Metadata renders correctly
5. ✅ Build passes with zero errors
6. ✅ Search/filter includes all new resources
7. ✅ Download functionality works for premium content

---

## Rollback Plan

If issues arise:
1. Git revert to pre-migration commit
2. Restore resourcesData.ts from backup
3. Remove copied content files
4. Investigate issue and retry

---

## Next Steps

1. **Review this plan** and confirm approach
2. **Create migration branch**: `git checkout -b migrate-blueprint-resources`
3. **Begin Phase 1**: Content migration
4. **Test incrementally** after each phase
5. **Deploy** when all tests pass

---

**Prepared by:** Claude Code
**Project:** Saith Next.js Resource Migration
**Source:** Blueprint Project (React + Vite)
**Target:** Saithavy-NextJS (Next.js App Router)
