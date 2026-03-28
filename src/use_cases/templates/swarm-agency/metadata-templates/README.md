# Metadata Templates

*Comprehensive YAML front matter and metadata tracking templates for the Swarm Agency platform.*

---

## Overview

This directory contains templates for:

1. **Content DNA Front Matter** - Complete metadata structure with 80+ tool integrations
2. **Swarm Attribution Template** - Track creators, reviewers, and approvers

---

## Templates

### Content DNA Front Matter (`content-dna-frontmatter.md`)

**Purpose**: Comprehensive YAML front matter template for tracking all content metadata.

**What It Tracks**:
- **Content Identification**: IDs, titles, dates, status
- **Swarm Attribution**: Who created, reviewed, and approved
- **Content DNA**: Psychological frameworks, emotions, hooks, CTAs
- **SEO Optimization**: Keywords, hashtags, geo-targeting
- **Tool Integration**: 80+ scheduling, analytics, and creation tools
- **Performance Tracking**: KPIs, baselines, targets
- **Relational Graph**: Content connections and repurposing
- **Audience Targeting**: Demographics, psychographics
- **Monetization**: Sponsored content, affiliate links
- **Legal & Compliance**: Copyright, disclosures, permissions

**When to Use**:
- Every piece of content should include front matter
- Use full template for comprehensive tracking
- Use simplified version for quick content

**How to Use**:
1. Copy the YAML block at the top of your content file
2. Fill in required fields (marked as required)
3. Include optional fields when relevant
4. Update fields as content evolves

**Field Reference**:
- See template for complete field definitions
- Fields are grouped by category
- Examples provided for each field type

---

## Best Practices

### 1. Consistency

- Use the same field names across all content
- Standardize platform names (e.g., "twitter-x" not "Twitter" or "X")
- Use consistent date formats (ISO 8601: YYYY-MM-DD)
- Follow naming conventions for content IDs

### 2. Completeness

- Fill out all required fields
- Include optional fields when relevant
- Update fields as content changes or performance data comes in
- Add iteration notes as you optimize content

### 3. Accuracy

- Use real dates and metrics (not placeholders)
- Be honest about performance (don't inflate numbers)
- Document actual tools used (not aspirational)
- Track actual team members involved

### 4. Integration

- Link related content in relational graph
- Connect tool integrations to actual workflows
- Track content lineage for repurposing analysis
- Use cross-platform links for connected content

---

## Tool Integration Reference

### Supported Tools (80+)

**Scheduling & Publishing**:
- Buffer, Hootsuite, Later, Sprout Social, Meta Business Suite, YouTube Studio, TikTok Native

**Analytics & Monitoring**:
- Google Analytics, Meta Business Suite, TikTok Analytics, YouTube Studio, Iconosquare

**Creation Tools**:
- Canva, Figma, Adobe Creative Suite, Lightroom, Premiere Pro, CapCut, After Effects

**AI Tools**:
- ChatGPT, Claude, Jasper, Midjourney, RunwayML, ElevenLabs

**Project Management**:
- Notion, Airtable, Trello, Asana, Monday, ClickUp

**Email Marketing**:
- Mailchimp, ConvertKit, ActiveCampaign, MailerLite

**CRM & Sales**:
- HubSpot, Salesforce, Pipedrive, Notion

---

## Metadata Categories

### Content Identification
- Unique content ID
- Title and subtitle
- Creation and publishing dates
- Content status

### Swarm Attribution
- Creator, writer, designer
- Editors, reviewers, approvers
- Stakeholders

### Content DNA
- Psychological frameworks
- Target emotions
- Hook types
- CTA strategies

### SEO Optimization
- Keywords (primary, secondary, long-tail)
- Hashtags
- Geo-targeting
- Platform-specific SEO

### Performance Tracking
- Target KPIs
- Baseline and target metrics
- Actual performance
- Performance ratings

### Relational Graph
- Related content
- Content lineage (repurposing)
- Cross-platform links
- A/B testing data

---

## Quick Start

### For New Content

```yaml
---
content_id: "tiktok-video-2025-001"
title: "Your Content Title"
platform: "tiktok"
content_type: "video"
created_date: "2025-01-13"
swarm_attribution:
  creator: "@handle"
content_dna:
  psychological_framework: "curiosity-gap"
  target_emotion: "surprise"
seo_optimization:
  primary_keyword: "keyword phrase"
performance_tracking:
  target_kpi: "views"
  target_value: 10000
---
```

### For Existing Content

1. Add front matter to existing content files
2. Fill in historical data (dates, team members, etc.)
3. Add current performance metrics
4. Link to related content

---

## Field Naming Conventions

### Content IDs
- Format: `{platform}-{type}-{yyyy}-{nnn}`
- Example: `tiktok-video-2025-001`
- Use lowercase, hyphen-separated

### Platform Names
- `tiktok`
- `instagram`
- `youtube`
- `twitter-x`
- `linkedin`
- `pinterest`
- `facebook`
- `blog`
- `podcast`
- `email`

### Content Types
- `video`
- `image`
- `text`
- `carousel`
- `thread`
- `story`
- `reel`
- `short`
- `post`
- `article`
- `episode`
- `newsletter`

---

## Template Version History

- **v1.0** (2025-01-13): Initial metadata templates
  - Complete Content DNA front matter
  - 80+ tool integration support
  - Comprehensive field documentation

---

## Support

For questions about metadata templates:
- Review field definitions in templates
- Check examples for proper formatting
- Consult with team for specific use cases
- Update templates based on team needs

---

**Remember**: Good metadata enables better analysis, learning, and optimization across the entire swarm. Invest time in accurate, complete front matter.
