# Target Directory Structure
## Canonical Organization for Resource Content

**Purpose:** Define the standard structure where all resource content should live

---

## Directory Structure

```
src/content/resources/
│
├── mindful-leadership/                    # Category: Mindful Leadership (13 resources)
│   ├── mindful-leadership-reflection-journal.md (ID 2) ✅
│   ├── conscious-communication-playbook.md (ID 14) ⬅️ TO LINK
│   ├── weekly-leadership-reflection-template.md (ID 15) ⬅️ TO LINK
│   ├── strategic-pause-audio-practice.md (ID 17) ⬅️ TO LINK
│   ├── values-aligned-leadership-workbook.md (ID 18) ⬅️ TO LINK
│   ├── executive-presence-video-mini-course.md (ID 19) ⬅️ TO LINK
│   ├── leadership-one-on-one-agenda-template.md (ID 20) ⬅️ TO LINK
│   ├── mindful-team-rituals-guide.md (ID 21) ⬅️ TO LINK
│   ├── leadership-presence-workshop-video.md (ID 12) ⬅️ TO LINK
│   └── team-mindfulness-meditation-pack.md (ID 7) ⬅️ TO LINK
│
├── ai-automation/                          # Category: AI + Automation (13 resources)
│   ├── inclusive-automation-readiness-kit.md (ID 1) ✅
│   ├── ai-strategy-templates-small-business.md (ID 5) ⬅️ TO LINK
│   ├── ai-email-automation-templates.md (ID 11) ⬅️ TO LINK
│   ├── ai-opportunity-mapping-canvas.md (ID 23) ⬅️ TO LINK
│   ├── no-code-automation-starter-guide.md (ID 24) ⬅️ TO LINK
│   ├── ai-prompt-library-for-founders.md (ID 25) ⬅️ TO LINK
│   ├── lead-capture-automation-checklist.md (ID 26) ⬅️ TO LINK
│   ├── automated-content-workflow-template.md (ID 27) ⬅️ TO LINK
│   ├── ai-tool-evaluation-framework.md (ID 28) ✅
│   ├── automation-sop-builder-pdf.md (ID 29) ⬅️ TO LINK
│   ├── ai-systems-weekly-audit-checklist.md (ID 30) ⬅️ TO LINK
│   ├── voice-ai-assistant-setup-audio.md (ID 31) ⬅️ TO LINK
│   └── automation-stack-architecture-video.md (ID 32) ⬅️ TO LINK
│
├── personal-growth/                        # Category: Personal Growth (12 resources)
│   ├── anti-fragility-workbook.md (ID 4) ✅
│   ├── goal-setting-framework-canvas.md (ID 9) ⬅️ TO LINK
│   ├── personal-vision-clarity-workbook.md (ID 33) ⬅️ TO LINK
│   ├── growth-mindset-reframe-guide.md (ID 34) ⬅️ TO LINK
│   ├── 90-day-habit-tracker-template.md (ID 35) ⬅️ TO LINK
│   ├── self-reflection-sunday-checklist.md (ID 36) ⬅️ TO LINK
│   ├── confidence-building-template.md (ID 37) ⬅️ TO LINK
│   ├── identity-upgrade-field-guide.md (ID 38) ⬅️ TO LINK
│   ├── emotional-resilience-journal.md (ID 39) ⬅️ TO LINK
│   ├── monthly-reset-checklist.md (ID 40) ⬅️ TO LINK
│   ├── morning-momentum-audio-practice.md (ID 41) ⬅️ TO LINK
│   └── personal-reinvention-video-series.md (ID 42) ⬅️ TO LINK
│
├── remote-work/                            # Category: Remote Work (11 resources)
│   ├── remote-work-productivity-masterclass.md (ID 3) ⬅️ TO LINK (Featured!)
│   ├── digital-nomad-workspace-setup-guide.md (ID 8) ⬅️ TO LINK
│   ├── remote-work-focus-planner.md (ID 43) ⬅️ TO LINK
│   ├── async-communication-guide-for-teams.md (ID 44) ⬅️ TO LINK
│   ├── remote-onboarding-checklist.md (ID 45) ⬅️ TO LINK
│   ├── weekly-sprint-planning-template.md (ID 46) ⬅️ TO LINK
│   ├── distributed-team-productivity-playbook.md (ID 47) ⬅️ TO LINK
│   ├── home-office-ergonomics-pdf.md (ID 48) ⬅️ TO LINK
│   ├── remote-team-rituals-template.md (ID 49) ⬅️ TO LINK
│   ├── deep-work-environment-checklist.md (ID 50) ⬅️ TO LINK
│   ├── virtual-collaboration-tools-video.md (ID 52) ⬅️ TO LINK
│   └── remote-leadership-audio-coaching.md (ID 51) ⬅️ TO LINK
│
├── overcoming-adversity/                    # Category: Overcoming Adversity (12 resources)
│   ├── resilience-audio-series.md (ID 6) ⬅️ TO LINK (Featured!)
│   ├── overcoming-burnout-recovery-plan.md (ID 10) ⬅️ TO LINK
│   ├── resilience-under-pressure-workbook.md (ID 53) ⬅️ TO LINK
│   ├── adversity-response-framework.md (ID 54) ⬅️ TO LINK
│   ├── bounce-back-plan-template.md (ID 55) ⬅️ TO LINK
│   ├── crisis-clarity-checklist.md (ID 56) ⬅️ TO LINK
│   ├── post-setback-reflection-template.md (ID 57) ⬅️ TO LINK
│   ├── inner-strength-building-guide.md (ID 58) ⬅️ TO LINK
│   ├── healing-through-journaling.md (ID 59) ⬅️ TO LINK
│   ├── recovery-routine-checklist.md (ID 60) ⬅️ TO LINK
│   ├── grounding-practices-audio.md (ID 61) ⬅️ TO LINK
│   └── resilience-stories-video-series.md (ID 62) ⬅️ TO LINK
│
└── production/                             # Legacy production content (keep as-is)
    ├── week1/
    ├── week3/
    ├── burnout-prevention-checklist.md
    ├── burnout-prevention-summary.md
    ├── anti-fragility-workbook.md
    └── [... other production files]
```

---

## File Naming Convention

**Format:** `{kebab-case-slug}.md`

**Examples:**
- ✅ `conscious-communication-playbook.md`
- ✅ `ai-opportunity-mapping-canvas.md`
- ✅ `resilience-audio-series.md`
- ❌ `Conscious Communication Playbook.md` (no spaces or caps)
- ❌ `conscious_communication_playbook.md` (no underscores)

---

## Frontmatter Template

Each markdown file should have frontmatter at the top:

```yaml
---
title: "Resource Title"
description: "Brief description of the resource"
category: "category-slug"
slug: "resource-slug"
type: "PDF|Template|Guide|Audio|Video|Checklist|Workbook|Assessment|Framework"
difficulty: "Beginner|Intermediate|Advanced"
timeToRead: "10 min"
targetAudience: "Target audience"
featured: false
isPremium: false
downloads: 0
fileSize: "1.2 MB PDF"
keywords:
  - "keyword1"
  - "keyword2"
whatYoullLearn:
  - "Learning outcome 1"
  - "Learning outcome 2"
seoTitle: "SEO-optimized title"
seoDescription: "SEO-optimized description"
---
```

---

## contentPath Format

In `src/lib/resourcesData.ts`, the `contentPath` should be:

**For new structure:**
```typescript
contentPath: 'mindful-leadership/conscious-communication-playbook.md'
```

**For production files (legacy):**
```typescript
contentPath: 'production/week1/resource1-mindful-leadership-journal/summary.md'
```

---

## Migration Priority

### High Priority (Featured Resources)
1. ID 3: Remote Work Productivity Masterclass (Featured!)
2. ID 6: Resilience Audio Series (Featured!)
3. ID 1: Inclusive Automation Readiness Kit (Featured!) - Already linked ✅

### Medium Priority (High-Value Resources)
4. ID 2: Mindful Leadership Reflection Journal - Already linked ✅
5. ID 4: Anti-Fragility Workbook - Already linked ✅
6. ID 13: Mindful Decision-Making Blueprint - Already linked ✅

### Standard Priority
7. All other resources with existing content

### Low Priority
8. Resources without existing content (mark as coming soon)

---

## Directory Creation Commands

When you're ready to create directories:

```bash
# Create all category directories
mkdir -p src/content/resources/mindful-leadership
mkdir -p src/content/resources/ai-automation
mkdir -p src/content/resources/personal-growth
mkdir -p src/content/resources/remote-work
mkdir -p src/content/resources/overcoming-adversity
```

---

## File Copy Example

```bash
# Example: Copy conscious communication playbook
cp sai_resourcesv2/public/resources/mindful-leadership/conscious-communication-playbook.md \
   src/content/resources/mindful-leadership/conscious-communication-playbook.md
```

---

**Note:** After copying files, I'll update `resourcesData.ts` to point to the new locations and add proper frontmatter.
