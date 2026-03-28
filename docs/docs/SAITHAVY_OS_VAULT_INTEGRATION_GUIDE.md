---
title: "Saithavy_OS Vault Integration Guide"
category: "Resource Production System"
type: "MOC"
version: "1.0.0"
last_updated: "2026-03-13"
status: "active"
tags: [integration, vault, obsidian, saithavy-os, migration]
owner: "Content Operations Manager"
automation:
  triggers:
    - event: "new_resource_added"
      workflow: "validate-vault-compliance"
    - event: "document_update"
      workflow: "sync-relationship-mapping"
  dependencies:
    documents:
      - id: "Brand-OS-Dashboard"
        required: true
      - id: "Portfolio-Architecture"
        required: true
  consumers:
    - system: "n8n"
      workflows: ["resource-production-workflow", "vault-sync-workflow"]
  update_cadence:
    frequency: "quarterly"
    auto_draft: true
relationships:
  extends:
    - document: "Brand OS Dashboard"
      aspect: "Provides integration guidance for resource production"
  summarizes:
    documents:
      - "[[Resource Production SOP]]"
      - "[[Content Specifications]]"
      - "[[Brand Guidelines]]"
    aspect: "Vault formatting and organization standards"
  referenced_by:
    documents:
      - "[[All resource templates]]"
      - "[[Content production team]]"
    reason: "Vault compliance and formatting reference"
---

# Saithavy_OS Vault Integration Guide

Comprehensive guide for integrating Resources v2 into the Saithavy_OS Obsidian vault with strict adherence to all formatting standards, frontmatter requirements, relationship mapping protocols, and quality assurance frameworks. This guide ensures every resource document follows the Saithavy_OS architecture for seamless navigation, automation readiness, and brand consistency across the multi-brand portfolio.

---

## Executive Summary

### Integration Objectives

**Primary Goal**: Migrate 62 downloadable resources from `sai_resourcesv2` into Section 10 (_Resource Production System) of Saithavy_OS while maintaining full vault compliance with:

- Complete frontmatter metadata (all required fields)
- Proper WikiLink syntax throughout (no markdown links for internal docs)
- Relationship mapping at the bottom of every document
- 6-dimensional Quality Assurance Framework
- Proper section placement within the 00-10 structure

**Success Criteria**:
- All 62 resources have complete frontmatter (100% compliance)
- All internal links use `[[Document Name]]` syntax
- All documents include relationship mapping YAML blocks
- All documents score 4+ on all 6 QA dimensions
- MOCs created for each resource category
- Dashboard updated with Section 10 health panel

### Scope Overview

**In Scope**:
- 62 existing resource templates from `templates/production/`
- New Section 10 (_Resource Production System) structure
- MOC creation for 6 resource categories
- Enhanced documentation for Sections 01, 04, 07, 08
- Relationship mapping across all sections
- WikiLink conversion from markdown links

**Out of Scope**:
- Section 09 (_Archive) - already exists in Saithavy_OS
- Section 02, 03, 05, 06 - no changes required
- External brand OS integration (GPrismo_OS, PartlyOffice_OS)
- Obsidian plugin configuration

---

## Vault Architecture Overview

### Saithavy_OS Section Structure (00-10)

| Section | Directory | Purpose | Status | Enhancement Required |
|---------|-----------|---------|--------|---------------------|
| **00** | `_Master Index/` | Executive control center, navigation hub | ✅ Active | Add Section 10 MOC link |
| **01** | `_Brand Foundations/` | Brand identity, voice, values | ✅ Active | Add resource brand guidelines |
| **02** | `_Audience & Market/` | ICP, psychographics, customer journey | ✅ Active | None |
| **03** | `_Messaging System/` | Storytelling, communication playbooks | ✅ Active | None |
| **04** | `_Content Engine/` | Content strategy, pillars, playbooks | ✅ Active | Add resource production workflow |
| **05** | `_SEO & Search Intelligence/` | Keywords, SERP analysis, trends | ✅ Active | None |
| **06** | `_Offers, Products & Services/` | Offer suite, frameworks, delivery | ✅ Active | None |
| **07** | `_Operations & Systems/` | SOPs, automation, CRM, analytics | ✅ Active | Add resource production SOP |
| **08** | `_Templates & Assets/` | Reusable templates, messaging templates | ✅ Active | Add resource templates cross-reference |
| **09** | `_Archive/` | Historical documents, copilot history | ✅ Active | None |
| **10** | `_Resource Production System/` | **NEW: 62 resources, MOCs, production SOPs** | 🆕 New | **Create complete section** |

### Section 10 (_Resource Production System) Structure

```
10 _Resource Production System/
├── MOC – Resource Production System.md          (Main MOC)
├── Resource Production SOP.md                   (Production workflow)
├── Resource Quality Gates.md                    (QA standards)
├── 10.1 Growth Mindset Resources/
│   ├── MOC – Growth Mindset Resources.md
│   ├── Growth Mindset Reflection Prompts (Complete).md
│   ├── Growth Mindset Cards (Printable).md
│   ├── Growth Mindset Facilitator Guide.md
│   ├── Growth Mindset Progress Tracker.md
│   └── [7 more growth mindset resources]
├── 10.2 Habit Tracking Resources/
│   ├── MOC – Habit Tracking Resources.md
│   ├── Habit Tracking System (Complete).md
│   ├── Habit Tracking Printable Grids.md
│   ├── Habit Tracking Quick Start.md
│   ├── Habit Tracking Real Examples.md
│   └── [1 more habit tracking resource]
├── 10.3 Morning Routine Resources/
│   ├── MOC – Morning Routine Resources.md
│   ├── Morning Routine Complete Guide.md
│   ├── Morning Routine 5 Templates.md
│   ├── Morning Routine 30-Day Challenge.md
│   ├── Morning Routine Habit Stacking Guide.md
│   ├── Morning Routine Customization Worksheet.md
│   ├── Morning Routine Progress Tracker.md
│   └── Morning Routine Troubleshooting Guide.md
├── 10.4 Time Management Resources/
│   ├── MOC – Time Management Resources.md
│   ├── Time Blocking Complete Guide.md
│   ├── Time Blocking Daily Templates.md
│   ├── Time Blocking 30-Day Challenge.md
│   ├── Time Blocking Real Examples.md
│   └── Time Blocking Troubleshooting Guide.md
├── 10.5 Workspace Setup Resources/
│   ├── MOC – Workspace Setup Resources.md
│   ├── Workspace Setup Guide.md
│   ├── Workspace Quick Start.md
│   ├── Workspace Setup Checklist.md
│   └── Workspace Budget Guide.md
└── 10.6 No-Code Automation Resources/
    ├── MOC – No-Code Automation Resources.md
    ├── No-Code Automation Opportunity Map.md
    └── No-Code Automation User Guide.md
```

---

## Frontmatter Templates (Copy-Paste Ready)

### Template 1: MOC Frontmatter

**Use For**: Section index documents (MOC – Category Name)

```yaml
---
title: "MOC – [Category Name]"
type: "MOC"
category: "[Section Name]"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
status: "active"
tags: [saithavy-os, moc, resource-production, category-name]
owner: "Content Operations Manager"
automation:
  triggers:
    - event: "resource_added"
      workflow: "update-moc-index"
  dependencies:
    documents:
      - id: "Resource-Production-SOP"
        required: true
  update_cadence:
    frequency: "monthly"
    notification:
      slack: "#resource-updates"
relationships:
  extends:
    - document: "Brand OS Dashboard"
      aspect: "Provides navigation for [Category] resources"
  summarizes:
    documents:
      - "[[Resource Name 1]]"
      - "[[Resource Name 2]]"
      - "[[Resource Name 3]]"
    aspect: "High-level overview of [category] resources"
  referenced_by:
    documents:
      - "[[All [category] resource documents]]"
    reason: "Navigation back to parent index"
---
```

### Template 2: Resource Document Frontmatter

**Use For**: Individual resource files (the 62 downloadable resources)

```yaml
---
title: "[Resource Name]"
type: "resource"
category: "[Category Name]"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
status: "active"
tags: [saithavy-os, resource-production, category-name, format-type]
owner: "Content Operations Manager"
automation:
  triggers:
    - event: "resource_update"
      workflow: "sync-to-distribution"
    - event: "scheduled"
      workflow: "quarterly-resource-review"
      schedule: "0 9 1 */3 *"
  dependencies:
    documents:
      - id: "MOC-[Category]-Resources"
        required: true
      - id: "Content-Specifications"
        required: true
  consumers:
    - system: "n8n"
      workflows: ["resource-distribution-workflow", "format-conversion-workflow"]
  update_cadence:
    frequency: "quarterly"
    auto_draft: true
relationships:
  extends:
    - documents: ["[[MOC – [Category] Resources]]"]
      aspect: "Categorized under [category] resources"
  aligns_with:
    - documents: ["[[Brand Identity]]", "[[Content Guidelines]]"]
      reason: "Brand voice and content standards"
  referenced_by:
    - documents: ["[[Resource Production SOP]]", "[[Content Specifications]]"]
      reason: "Production and formatting guidance"
---
```

### Template 3: SOP Document Frontmatter

**Use For**: Standard Operating Procedures, workflows, process documents

```yaml
---
title: "[SOP Name]"
type: "SOP"
category: "[Section Name]"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
status: "active"
tags: [saithavy-os, sop, workflow, process-name]
owner: "Operations Manager"
automation:
  triggers:
    - event: "process_update"
      workflow: "notify-team-of-sop-change"
  dependencies:
    documents:
      - id: "Brand-Identity"
        required: true
      - id: "Content-Guidelines"
        required: true
  consumers:
    - system: "n8n"
      workflows: ["sop-execution-workflow"]
  update_cadence:
    frequency: "semi-annually"
    auto_draft: true
relationships:
  extends:
    - documents: ["[[MOC – [Section Name]]]"]
      aspect: "Operational guidance for [process]"
  informs:
    - documents: ["[[Related SOP 1]]", "[[Related SOP 2]]"]
      reason: "Process dependencies and handoffs"
  referenced_by:
    - documents: ["[[All team executing this SOP]]"]
      reason: "Process execution guidance"
---
```

### Template 4: Template Document Frontmatter

**Use For**: Reusable templates, frameworks, fill-in-the-blank documents

```yaml
---
title: "[Template Name]"
type: "template"
category: "[Section Name]"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
status: "active"
tags: [saithavy-os, template, format-type, use-case]
owner: "Content Operations Manager"
automation:
  triggers:
    - event: "template_usage"
      workflow: "track-template-engagement"
  dependencies:
    documents:
      - id: "Content-Specifications"
        required: true
      - id: "Brand-Guidelines"
        required: true
  consumers:
    - system: "n8n"
      workflows: ["template-distribution-workflow"]
  update_cadence:
    frequency: "annually"
    auto_draft: false
relationships:
  extends:
    - documents: ["[[MOC – [Section Name]]]"]
      aspect: "Reusable template for [purpose]"
  used_by:
    - documents: ["[[User Document 1]]", "[[User Document 2]]"]
      reason: "Template-based creation"
  aligns_with:
    - documents: ["[[Visual Identity System]]", "[[Brand Voice Rules]]"]
      reason: "Brand consistency in templates"
---
```

---

## Relationship Mapping Guide

### Relationship Mapping Format (Bottom of Every Document)

**Location**: At the very bottom of every document, after the QA Framework

**Format**: YAML code block with specific relationship types

```yaml
## Relationship Mapping

```yaml
relationships:
  depends_on:
    - document: "[[Document Name]]"
      reason: "Why this dependency exists"
    - document: "[[Another Document]]"
      reason: "Critical input for this document"
  extends:
    - documents: ["[[Parent Document]]", "[[Another Parent]]"]
      aspect: "What aspect this document extends"
  informs:
    - documents: ["[[Child Document 1]]", "[[Child Document 2]]"]
      reason: "How this document guides others"
  summarizes:
    documents:
      - id: "[[Document 1]]"
        aspect: "What aspect is summarized"
      - id: "[[Document 2]]"
        aspect: "What aspect is summarized"
  referenced_by:
    documents:
      - "[[Document 1]]"
      - "[[Document 2]]"
    reason: "Why those documents reference this"
  aligns_with:
    - documents: ["[[Related Document 1]]", "[[Related Document 2]]"]
      reason: "Strategic alignment or shared principles"
```

### Relationship Types Explained

| Relationship Type | When to Use | Example |
|------------------|-------------|---------|
| **depends_on** | This document requires input from another | Resource depends on Content Specifications |
| **extends** | This document expands on another | MOC extends Brand OS Dashboard |
| **informs** | This document guides creation of others | SOP informs content production workflow |
| **summarizes** | This document aggregates others | MOC summarizes all resources in category |
| **referenced_by** | Other documents link back to this | Brand Identity referenced by all content |
| **aligns_with** | Strategic alignment without dependency | Resource aligns with Brand Values |

### Example: Complete Relationship Mapping

**For**: `Growth Mindset Reflection Prompts (Complete).md`

```yaml
relationships:
  depends_on:
    - document: "[[MOC – Growth Mindset Resources]]"
      reason: "Category organization and navigation"
    - document: "[[Content Specifications]]"
      reason: "Format requirements and structure"
    - document: "[[Brand Guidelines]]"
      reason: "Voice and tone standards"
  extends:
    - documents: ["[[Growth Mindset Facilitator Guide]]"]
      aspect: "User-facing implementation of facilitator concepts"
  informs:
    - documents: ["[[Growth Mindset Progress Tracker]]", "[[Growth Mindset Cards (Printable)]]"]
      reason: "Core content prompts for tracker and cards"
  referenced_by:
    documents:
      - "[[Resource Production SOP]]"
      - "[[Content Specifications]]"
      - "[[Growth Mindset Facilitator Guide]]"
    reason: "Production workflow and format guidance"
  aligns_with:
    - documents: ["[[Brand Identity]]", "[[Content Guidelines]]"]
      reason: "Brand voice consistency and content quality standards"
```

---

## WikiLink Conversion Guide

### WikiLink Syntax Rules

**CRITICAL**: All internal links MUST use WikiLink syntax `[[Document Name]]`

**❌ FORBIDDEN** (Markdown-style links):
```markdown
[Link Text](./path/to/document.md)
[Link Text](../folder/document.md)
```

**✅ REQUIRED** (WikiLink syntax):
```markdown
[[Document Name]]
[[Document Name|Custom Display Text]]
```

### Conversion Examples

| Before (Markdown) | After (WikiLink) | Notes |
|-------------------|------------------|-------|
| `[Brand Identity](../01 _Brand Foundations/Brand Identity.md)` | `[[Brand Identity]]` | Remove path, use exact filename |
| `[See the guide](./guide.md)` | `[[See the guide|guide]]` | Custom display text with pipe |
| `[Content Guidelines](../../04 _Content Engine/Content Guidelines.md)` | `[[Content Guidelines]]` | Remove relative paths entirely |
| `[MOC – Resources](MOC - Resources.md)` | `[[MOC – Resources]]` | Remove .md extension |

### Link Type Decision Tree

```
Is this an internal document (within Saithavy_OS)?
├── YES → Use WikiLink: [[Document Name]]
│   └── Add custom text if needed: [[Document Name|Display Text]]
└── NO → Use markdown link: [Link Text](https://external-url.com)
```

### Batch Conversion Script (Optional)

**For existing markdown links in resource files**:

```bash
# Run in sai_resourcesv2/templates/production/
find . -name "*.md" -exec sed -i 's/\[\([^]]*\)\](\.\.\/[^)]*\.md)/[[\1]]/g' {} \;
find . -name "*.md" -exec sed -i 's/\[\([^]]*\)\](\.\/[^)]*\.md)/[[\1]]/g' {} \;
find . -name "*.md" -exec sed -i 's/\.md//g' {} \;
```

---

## Quality Assurance Framework (6 Dimensions)

### Dimension 1: Structural Completeness

**Checklist**:
- [ ] Frontmatter complete with all required fields (title, type, category, version, last_updated, status, tags, owner)
- [ ] Heading hierarchy follows H1→H2→H3 (no skipping levels)
- [ ] All required sections present (varies by document type)
- [ ] No placeholder text (TODO, TBD, coming soon - mark with ⚠️ if pending)
- [ ] Document length appropriate (MOCs: 300-500 words, Resources: 1000+ words, SOPs: 1500+ words)
- [ ] Code blocks properly formatted with language specified
- [ ] Tables properly formatted with headers

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### Dimension 2: Content Standards

**Checklist**:
- [ ] Content is specific, not vague (includes examples, numbers, actionable steps)
- [ ] No generic statements ("provide value", "best practices")
- [ ] Terminology consistent with official glossary
- [ ] Voice aligns with Brand Voice Rules (encouraging, expert, friendly)
- [ ] No off-brand language ("hustle", "crush it", "revolutionary")
- [ ] Status flags consistent throughout (✅ Complete / ⚠️ Needs Review / ❗ Missing / 🔄 In Progress)

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### Dimension 3: Link Integrity

**Checklist**:
- [ ] All internal links use `[[Document Name]]` syntax
- [ ] Every linked document exists in the vault or is flagged ❗ Missing
- [ ] No markdown-style links for internal documents
- [ ] No circular references (A→B→A loops)
- [ ] Backlinks section included (where applicable)
- [ ] External links use full URLs and work correctly

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### Dimension 4: SEO & Discoverability

**Checklist**:
- [ ] Title descriptive and searchable (not "Document", "Template")
- [ ] Frontmatter tags include relevant keywords (3-7 tags)
- [ ] Primary keywords present in first paragraph
- [ ] Document type in frontmatter (MOC, resource, SOP, template)
- [ ] Category matches section structure
- [ ] No duplicate titles within same section

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### Dimension 5: Automation Readiness

**Checklist**:
- [ ] Frontmatter includes update_cadence (frequency, auto_draft)
- [ ] Triggers defined (event, workflow)
- [ ] Dependencies listed with required flags
- [ ] Consumers specified (system, workflows)
- [ ] Status flags machine-readable (active, draft, pending)
- [ ] Relationship mapping present at bottom

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### Dimension 6: Brand Consistency

**Checklist**:
- [ ] Voice matches Brand Voice Rules (encouraging, expert, friendly)
- [ ] Terminology matches official glossary
- [ ] No contradictions with Brand Principles
- [ ] Visual specifications followed (spacing, formatting, headings)
- [ ] No off-brand metaphors or language
- [ ] Aligns with Brand Identity and Values

**Scoring**: 0-6 (6 items)
- **Pass**: 5+ items checked
- **Fail**: <5 items checked

### QA Scoring Protocol

**Overall Quality Score**:
- Sum of all 6 dimension scores (0-36 total)
- **Pass**: 24+ (average 4+ per dimension)
- **Fail**: <24 (requires rework)

**Quality Gates**:
- Pre-publication: All 6 dimensions must pass
- Content must score 4+ on EACH dimension
- Scores below 4 on any dimension require rework
- Re-review required after fixes

---

## Migration Checklist (Step-by-Step)

### Phase 1: Setup (Day 1)

**Section 10 Structure Creation**:
- [ ] Create `10 _Resource Production System/` directory in Saithavy_OS
- [ ] Create 6 subdirectories: `10.1 Growth Mindset Resources/` through `10.6 No-Code Automation Resources/`
- [ ] Update `.obsidian/workspace.json` to include Section 10 (if applicable)
- [ ] Backup existing resources from `sai_resourcesv2/templates/production/`

**MOC Creation**:
- [ ] Create main MOC: `MOC – Resource Production System.md`
- [ ] Create 6 category MOCs (one per subdirectory)
- [ ] Link main MOC to [[Brand OS Dashboard]]
- [ ] Add all MOCs to frontmatter navigation in Dashboard

### Phase 2: Frontmatter Addition (Days 2-3)

**Batch Frontmatter Insertion**:
- [ ] Add frontmatter to all 62 resource files using Template 2
- [ ] Set appropriate category for each resource
- [ ] Set status as "active" for all resources
- [ ] Set tags consistently (saithavy-os, resource-production, category-name, format-type)
- [ ] Set last_updated to "2026-03-13" for initial migration

**Frontmatter Validation**:
- [ ] Verify all 62 files have complete frontmatter
- [ ] Check for required fields: title, type, category, version, last_updated, status, tags, owner
- [ ] Verify automation fields present: triggers, dependencies, consumers, update_cadence

### Phase 3: WikiLink Conversion (Days 4-5)

**Internal Link Conversion**:
- [ ] Convert all markdown internal links to WikiLink syntax
- [ ] Remove file paths from internal links (use just document name)
- [ ] Remove .md extensions from all WikiLinks
- [ ] Verify no markdown-style internal links remain

**Link Validation**:
- [ ] Test all WikiLinks resolve correctly in Obsidian
- [ ] Flag broken links with ❗ Missing
- [ ] Update MOCs with proper WikiLinks to all resources

### Phase 4: Relationship Mapping (Days 6-7)

**Add Relationship Mapping**:
- [ ] Add relationship mapping YAML block to all 62 resources
- [ ] Define dependencies on category MOCs
- [ ] Define alignment with Brand Identity and Content Guidelines
- [ ] Define referenced_by relationships for SOPs and specifications

**Bidirectional Linking**:
- [ ] Ensure parent MOCs link to child resources
- [ ] Ensure child resources link back to parent MOCs
- [ ] Verify no circular references exist

### Phase 5: QA Validation (Days 8-9)

**6-Dimensional QA Check**:
- [ ] Run Structural Completeness check on all 62 resources
- [ ] Run Content Standards check on all 62 resources
- [ ] Run Link Integrity check on all 62 resources
- [ ] Run SEO & Discoverability check on all 62 resources
- [ ] Run Automation Readiness check on all 62 resources
- [ ] Run Brand Consistency check on all 62 resources

**Quality Gates**:
- [ ] Verify all resources score 4+ on each dimension
- [ ] Rework any resources scoring below 4 on any dimension
- [ ] Re-check failed resources after fixes

### Phase 6: Dashboard & Integration (Day 10)

**Dashboard Updates**:
- [ ] Add Section 10 to [[Brand OS Dashboard]] health panel
- [ ] Update "Quick Links" section with Section 10 MOC
- [ ] Add Section 10 row to "System Status Summary" table
- [ ] Update "Review Cadence" table for resources

**Section Enhancement** (01, 04, 07, 08):
- [ ] Update [[Brand Identity]] to include resource brand guidelines
- [ ] Update [[Content Guidelines]] to include resource production workflow
- [ ] Add [[Resource Production SOP]] to Section 07
- [ ] Cross-reference resource templates in Section 08 MOCs

### Phase 7: Testing & Launch (Days 11-12)

**Testing**:
- [ ] Test navigation from Dashboard to Section 10 MOC
- [ ] Test navigation from Section 10 MOC to category MOCs
- [ ] Test navigation from category MOCs to individual resources
- [ ] Verify all backlinks work correctly
- [ ] Test Obsidian search/discoverability

**Automation Testing**:
- [ ] Test n8n workflow triggers (if configured)
- [ ] Verify update_cadence fields are parseable
- [ ] Test relationship mapping extraction

**Launch**:
- [ ] Create git commit: "Add Section 10: Resource Production System to Saithavy_OS"
- [ ] Update vault version to 2.1.0
- [ ] Notify team of Section 10 availability
- [ ] Archive migration checklist in Section 09

---

## Section Enhancement Guide

### Section 01 (_Brand Foundations) Enhancements

**Add to**:
- [[Brand Identity]] - Add "Resource Brand Guidelines" section
- [[Brand Voice Rules]] - Add "Resource Voice Standards" subsection

**New Content to Add**:

```markdown
## Resource Brand Guidelines

Resources must align with core brand principles:
- Inner mastery enables outer leverage
- Resilience over hustle
- Human-first technology
- Authentic integration
- Sustainable systems

**Resource Voice Standards**:
- Encouraging: "You're building resilience" (not "fix your weakness")
- Expert: Backed by research and real examples (not "trust me")
- Friendly: Peer-to-peer navigation (not guru-to-disciple)
- Specific: 5-step frameworks with examples (not "strategies")
```

**Frontmatter Updates**:
- Add to `referenced_by`: [[MOC – Resource Production System]]

### Section 04 (_Content Engine) Enhancements

**Add to**:
- [[Content Guidelines]] - Add "Resource Production Workflow" section
- [[Content Pillars]] - Cross-reference resource categories

**New Content to Add**:

```markdown
## Resource Production Workflow

1. **Planning**: Resource selected from production calendar
2. **Brand Context**: Load Brand Identity → Voice → Pillars → ICP
3. **Drafting**: Create content following [[Content Specifications]]
4. **QA Validation**: 6-dimensional framework (4+ required per dimension)
5. **Distribution**: Convert to formats (PDF, Notion, Google Doc)
6. **Analytics**: Track downloads, engagement, feedback

**Resource Categories Align with Content Pillars**:
- Growth Mindset Resources → [[Content Pillar 1: Mindful Leadership]]
- Habit Tracking Resources → [[Content Pillar 2: Sustainable Systems]]
- Morning Routine Resources → [[Content Pillar 3: Daily Practices]]
- Time Management Resources → [[Content Pillar 2: Sustainable Systems]]
- Workspace Setup Resources → [[Content Pillar 2: Sustainable Systems]]
- No-Code Automation Resources → [[Content Pillar 4: Human-First Technology]]
```

**Frontmatter Updates**:
- Add to `informs`: [[Resource Production SOP]]
- Add to `referenced_by`: [[MOC – Resource Production System]]

### Section 07 (_Operations & Systems) Enhancements

**New Documents to Add**:
- [[Resource Production SOP]] (Use Template 3)
- [[Resource Quality Gates]] (QA standards document)
- [[Resource Distribution SOP]] (format conversion, publishing)

**Link from Existing SOPs**:
- [[Content Production SOP]] - Add "See also: [[Resource Production SOP]]"
- [[Creative Workflow SOP]] - Cross-reference resource creation

**Add to MOC – Operations**:
```markdown
## Resource Production Operations

- [[Resource Production SOP]] - Complete workflow for creating resources
- [[Resource Quality Gates]] - QA framework and validation standards
- [[Resource Distribution SOP]] - Format conversion and publishing
```

### Section 08 (_Templates & Assets) Enhancements

**Add to MOC – Templates & Assets**:

```markdown
## Resource Templates

See [[10 _Resource Production System]] for 62 production-ready resources:
- [[Growth Mindset Resources]] - Reflection prompts, cards, facilitator guides
- [[Habit Tracking Resources]] - Systems, printables, quick start guides
- [[Morning Routine Resources]] - Complete guides, templates, challenges
- [[Time Management Resources]] - Time blocking, daily templates
- [[Workspace Setup Resources]] - Setup guides, checklists, budget guides
- [[No-Code Automation Resources]] - Opportunity maps, user guides

**Relationship**: Resource templates extend brand templates with production-ready formats.
```

**Frontmatter Updates for MOC – Templates**:
- Add to `summarizes`: [[MOC – Resource Production System]]
- Add to `references`: All 6 category MOCs

---

## Backlink Strategy

### Backlink Sections

**Location**: Near the bottom of documents, before QA Framework

**Format**: Bulleted list with brief description

**Example** (from [[Growth Mindset Reflection Prompts (Complete)]]):
```markdown
## Backlinks

Documents that reference this resource:

- [[MOC – Growth Mindset Resources]] - Category index and navigation
- [[Resource Production SOP]] - Production workflow reference
- [[Content Specifications]] - Format and structure reference
- [[Growth Mindset Facilitator Guide]] - Facilitator implementation
- [[Growth Mindset Cards (Printable)]] - Derived from core prompts
```

### Backlink Types

| Backlink Type | When to Include | Example |
|---------------|----------------|---------|
| **Parent MOC** | Always | Category MOC links to all resources |
| **SOP References** | For process documents | Resource Production SOP links to resources |
| **Derived Works** | For source documents | Prompts document linked by Cards document |
| **Related Resources** | For related content | Morning Routine linked by Habit Stacking Guide |
| **Brand Documents** | For brand alignment | Brand Identity referenced by all content |

### Backlink Maintenance

**On Document Creation**:
- Add backlink section if referenced by 3+ documents
- List only high-value references (not trivial mentions)
- Keep descriptions brief (one line)

**On Document Update**:
- Update backlinks when new references added
- Remove broken backlinks
- Verify bidirectional linking monthly

---

## Automation Setup

### n8n Workflow Triggers

**Trigger 1: Resource Update Workflow**

```yaml
Trigger: document_update
Frontmatter Event:
  - event: "resource_update"
    workflow: "sync-to-distribution"
Workflow Actions:
  1. Parse resource frontmatter
  2. Update distribution status in CMS
  3. Trigger format conversion (PDF, Notion, Google Doc)
  4. Notify team via Slack: #resource-updates
  5. Update resource version history
```

**Trigger 2: MOC Update Workflow**

```yaml
Trigger: resource_added
Frontmatter Event:
  - event: "resource_added"
    workflow: "update-moc-index"
Workflow Actions:
  1. Detect new resource in Section 10
  2. Update category MOC with new resource link
  3. Update main MOC – Resource Production System
  4. Update [[Brand OS Dashboard]] health panel
  5. Run QA validation on new resource
```

**Trigger 3: Scheduled Review Workflow**

```yaml
Trigger: scheduled
Frontmatter Event:
  - event: "scheduled"
    workflow: "quarterly-resource-review"
    schedule: "0 9 1 */3 *"
Workflow Actions:
  1. Generate draft review for all resources
  2. Check last_updated date (older than 90 days flagged)
  3. Update status to "draft" for review
  4. Notify team via Slack: #resource-review
  5. Create review tickets in project management
```

### Dependency Management

**Frontmatter Dependencies Example**:

```yaml
automation:
  dependencies:
    documents:
      - id: "Content-Specifications"
        required: true
        version: ">=1.0.0"
      - id: "Brand-Guidelines"
        required: true
      - id: "MOC-Growth-Mindset-Resources"
        required: false
```

**Dependency Validation**:
- Required dependencies must exist for document to be "active"
- Optional dependencies allow "draft" status
- Version constraints enforce minimum versions

### Consumer Systems

**Frontmatter Consumers Example**:

```yaml
automation:
  consumers:
    - system: "n8n"
      workflows: ["resource-distribution", "format-conversion"]
    - system: "cms"
      actions: ["publish", "update", "archive"]
    - system: "analytics"
      events: ["download", "view", "share"]
```

**Consumer Integration**:
- n8n: Workflow automation and distribution
- CMS: Content publishing and updates
- Analytics: Usage tracking and reporting

---

## Common Errors to Avoid

### Frontmatter Errors

❌ **Bad**: Incomplete frontmatter
```yaml
---
title: "My Resource"
status: "active"
---
```

✅ **Good**: Complete frontmatter with all required fields
```yaml
---
title: "My Resource"
type: "resource"
category: "Growth Mindset Resources"
version: "1.0.0"
last_updated: "2026-03-13"
status: "active"
tags: [saithavy-os, resource-production, growth-mindset]
owner: "Content Operations Manager"
automation:
  triggers: [...]
  dependencies: [...]
  consumers: [...]
  update_cadence: [...]
---
```

### WikiLink Errors

❌ **Bad**: Markdown-style internal link
```markdown
See [Brand Identity](../01 _Brand Foundations/Brand Identity.md)
```

✅ **Good**: WikiLink syntax
```markdown
See [[Brand Identity]]
```

### Relationship Mapping Errors

❌ **Bad**: Missing relationship mapping
```markdown
# Document ends with no relationship mapping
```

✅ **Good**: Complete relationship mapping at bottom
```markdown
## Relationship Mapping

```yaml
relationships:
  depends_on:
    - document: "[[Document Name]]"
      reason: "Why dependency exists"
  extends:
    - documents: ["[[Parent Document]]"]
      aspect: "What this extends"
  # ... (all relationship types)
```

### QA Framework Errors

❌ **Bad**: Incomplete QA checklist
```markdown
## Quality Assurance Framework

- [ ] Frontmatter complete
- [ ] Links work
```

✅ **Good**: Complete 6-dimensional QA framework
```markdown
## Quality Assurance Framework

### Dimension 1: Structural Completeness
- [ ] Frontmatter complete with all required fields
- [ ] Heading hierarchy follows H1→H2→H3
- [ ] All required sections present
# ... (all 6 dimensions with 6 items each)
```

---

## Document Type Examples

### Example 1: Complete Resource Document

**File**: `10 _Resource Production System/10.1 Growth Mindset Resources/Growth Mindset Reflection Prompts (Complete).md`

```markdown
---
title: "Growth Mindset Reflection Prompts (Complete)"
type: "resource"
category: "Growth Mindset Resources"
version: "1.0.0"
last_updated: "2026-03-13"
status: "active"
tags: [saithavy-os, resource-production, growth-mindset, reflection, prompts]
owner: "Content Operations Manager"
automation:
  triggers:
    - event: "resource_update"
      workflow: "sync-to-distribution"
  dependencies:
    documents:
      - id: "MOC-Growth-Mindset-Resources"
        required: true
      - id: "Content-Specifications"
        required: true
  consumers:
    - system: "n8n"
      workflows: ["resource-distribution-workflow"]
  update_cadence:
    frequency: "quarterly"
    auto_draft: true
relationships:
  depends_on:
    - document: "[[MOC – Growth Mindset Resources]]"
      reason: "Category organization and navigation"
  extends:
    - documents: ["[[Growth Mindset Facilitator Guide]]"]
      aspect: "User-facing implementation of facilitator concepts"
  aligns_with:
    - documents: ["[[Brand Identity]]", "[[Content Guidelines]]"]
      reason: "Brand voice consistency and content quality"
---

# Growth Mindset Reflection Prompts (Complete)

Comprehensive collection of 32 growth mindset reflection prompts organized into 4 weekly themes: Self-Awareness, Challenge, Learning, and Resilience. These prompts help individuals transform fixed mindset patterns into growth mindset practices through daily reflection questions designed to build self-awareness, embrace discomfort as growth, and develop resilience in the face of setbacks.

---

## How to Use This Resource

**Daily Practice**:
1. Choose one prompt for the day (start with Card 1, progress sequentially)
2. Set aside 5-10 minutes for reflection
3. Write down your response in a journal or notebook
4. Review your response and notice patterns
5. Celebrate small wins and growth evidence

**Weekly Flow**:
- **Week 1**: Self-Awareness Cards (Cards 1-7) - Build awareness of fixed mindset thoughts
- **Week 2**: Challenge Cards (Cards 8-14) - Take small brave actions
- **Week 3**: Learning Cards (Cards 15-21) - Reframe mistakes as data
- **Week 4**: Resilience Cards (Cards 22-28) - Build anti-fragility
- **Bonus**: Cards 29-32 - Ongoing practice

**Facilitator Guide**: See [[Growth Mindset Facilitator Guide]] for workshop frameworks
**Printable Cards**: See [[Growth Mindset Cards (Printable)]] for physical cards
**Progress Tracking**: Use [[Growth Mindset Progress Tracker]] to document journey

---

## Self-Awareness Prompts (Week 1)

### Card 1: Daily Check-In

**What fixed mindset thought did I have today?**

Write it down. Then reframe it.

**Fixed thought**: _____________________________________________________

**Growth reframe**: ___________________________________________________

---

*[Continue with all 32 prompts organized by week]*

---

## Backlinks

Documents that reference this resource:

- [[MOC – Growth Mindset Resources]] - Category index and navigation
- [[Growth Mindset Facilitator Guide]] - Workshop framework using these prompts
- [[Growth Mindset Cards (Printable)]] - Printable version of these prompts
- [[Growth Mindset Progress Tracker]] - Progress tracking for prompts
- [[Resource Production SOP]] - Production workflow reference

---

## Quality Assurance Framework

### Dimension 1: Structural Completeness
- [x] Frontmatter complete with all required fields
- [x] Heading hierarchy H1→H2→H3
- [x] All 32 prompts present
- [x] How to Use section present
- [x] Backlinks section included
- [x] No placeholder text

### Dimension 2: Content Standards
- [x] Prompts are specific and actionable
- [x] Examples provided for each prompt
- [x] No generic statements
- [x] Voice: encouraging, expert, friendly
- [x] No off-brand language
- [x] Status flags consistent

### Dimension 3: Link Integrity
- [x] All links use [[Document Name]] syntax
- [x] Every linked document exists or flagged
- [x] No circular references
- [x] Backlinks section complete

### Dimension 4: SEO & Discoverability
- [x] Title descriptive: "Growth Mindset Reflection Prompts (Complete)"
- [x] Tags: growth-mindset, reflection, prompts, complete
- [x] Keywords: "growth mindset", "reflection prompts", "daily practice"
- [x] Category: Growth Mindset Resources
- [x] Type: resource

### Dimension 5: Automation Readiness
- [x] update_cadence specified (quarterly)
- [x] triggers defined (resource_update)
- [x] dependencies listed (MOC, Content Specifications)
- [x] consumers specified (n8n)
- [x] Status: active

### Dimension 6: Brand Consistency
- [x] Voice aligns with Brand Voice Rules
- [x] No contradictions with Brand Principles
- [x] Encouraging tone ("celebrate small wins")
- [x] Peer-to-peer navigation (not guru positioning)
- [x] Aligns with Brand Identity (resilience, growth)

---

## Relationship Mapping

```yaml
relationships:
  depends_on:
    - document: "[[MOC – Growth Mindset Resources]]"
      reason: "Category organization and navigation"
    - document: "[[Content Specifications]]"
      reason: "Format requirements and structure"
  extends:
    - documents: ["[[Growth Mindset Facilitator Guide]]"]
      aspect: "User-facing implementation of facilitator concepts"
  informs:
    - documents: ["[[Growth Mindset Cards (Printable)]]", "[[Growth Mindset Progress Tracker]]"]
      reason: "Core content prompts for cards and tracker"
  referenced_by:
    documents:
      - "[[MOC – Growth Mindset Resources]]"
      - "[[Growth Mindset Facilitator Guide]]"
      - "[[Resource Production SOP]]"
    reason: "Category navigation and production workflow"
  aligns_with:
    - documents: ["[[Brand Identity]]", "[[Content Guidelines]]"]
      reason: "Brand voice consistency and content quality standards"
```
```

---

## Appendix: Quick Reference

### Frontmatter Field Reference

| Field | Required? | Format | Example |
|-------|-----------|--------|---------|
| `title` | ✅ Yes | String | "Growth Mindset Reflection Prompts (Complete)" |
| `type` | ✅ Yes | Enum | "MOC", "resource", "SOP", "template", "document" |
| `category` | ✅ Yes | String | "Growth Mindset Resources" |
| `version` | ✅ Yes | Semantic | "1.0.0" |
| `last_updated` | ✅ Yes | Date | "2026-03-13" |
| `status` | ✅ Yes | Enum | "active", "draft", "pending", "archived" |
| `tags` | ✅ Yes | Array | [saithavy-os, resource-production, growth-mindset] |
| `owner` | ✅ Yes | String | "Content Operations Manager" |
| `automation.triggers` | ⚠️ Recommended | Array | [{event, workflow}] |
| `automation.dependencies` | ⚠️ Recommended | Array | [{id, required}] |
| `automation.consumers` | ⚠️ Recommended | Array | [{system, workflows}] |
| `automation.update_cadence` | ⚠️ Recommended | Object | {frequency, auto_draft} |

### Status Flag Reference

| Flag | Meaning | When to Use |
|------|---------|-------------|
| ✅ | Complete/Active | Document is production-ready |
| ⚠️ | Needs Review | Document requires attention or update |
| ❗ | Missing/Critical | Document is missing or has critical issues |
| 🔄 | In Progress | Document is being created or updated |

### Relationship Type Reference

| Type | Direction | Use Case |
|------|-----------|----------|
| `depends_on` | Downstream | This document requires input from another |
| `extends` | Downstream | This document expands on another |
| `informs` | Upstream | This document guides creation of others |
| `summarizes` | Upstream | This document aggregates others |
| `referenced_by` | Bidirectional | Others link back to this |
| `aligns_with` | Lateral | Strategic alignment without dependency |
| `used_by` | Upstream | This document is consumed by others |

---

## Support & Resources

**Documentation**:
- [[Brand OS Dashboard]] - Main vault navigation
- [[Portfolio Architecture]] - Multi-brand governance
- [[AI Agent Logic Layer]] - Event routing and orchestration

**Templates**:
- All templates in this document (copy-paste ready)
- Template files in `10 _Resource Production System/_Templates/`

**Team Contacts**:
- Content Operations Manager: Resource production and QA
- Brand Manager: Brand alignment and voice consistency
- Operations Manager: SOP and workflow questions
- Data Asset Manager: Vault health and automation

**Automation Support**:
- n8n workflows: `n8n-resource-production-workflow`
- Obsidian plugins: Smart Connections, Copilot
- Vault documentation: `Saithavy_OS/.planning/codebase/ARCHITECTURE.md`

---

**This integration guide ensures full Saithavy_OS vault compliance for all 62 resources while maintaining brand consistency, automation readiness, and seamless navigation across the multi-brand portfolio.**

---

## Relationship Mapping

```yaml
relationships:
  depends_on:
    - document: "[[Brand OS Dashboard]]"
      reason: "Executive navigation and vault structure"
    - document: "[[Portfolio Architecture]]"
      reason: "Multi-brand governance context"
  extends:
    - documents: ["[[Brand OS Dashboard]]"]
      aspect: "Provides detailed integration guidance for Section 10"
  summarizes:
    documents:
      - "[[Resource Production SOP]]"
      - "[[Content Specifications]]"
      - "[[All 62 resource templates]]"
    aspect: "Vault formatting and organization standards"
  informs:
    documents:
      - "[[All resource production workflows]]"
      - "[[QA validation processes]]"
      - "[[Automation setup procedures]]"
    reason: "Integration and migration guidance"
  referenced_by:
    documents:
      - "[[Content Operations Manager]]"
      - "[[Brand Manager]]"
      - "[[Operations Manager]]"
    reason: "Vault compliance reference"
  aligns_with:
    documents:
      - "[[Brand Identity]]"
      - "[[Content Guidelines]]"
      - "[[Quality Assurance Framework]]"
    reason: "Brand consistency and content quality standards"
```
