# Swarm Agency Platform Content Templates

*A comprehensive template system for content creation, metadata management, intelligence reporting, and performance analytics.*

---

## Overview

This template system provides standardized structures for:

1. **Platform-Specific Content Templates** - TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Pinterest, Facebook
2. **Metadata Front Matter Template** - YAML-based content DNA tracking with 80+ tool integrations
3. **Weekly Intelligence Brief Template** - Algorithm updates, trends, competitive intelligence
4. **Performance Dashboard Template** - Platform health, content performance, resource allocation

---

## Directory Structure

```
swarm-agency/
├── platform-content-templates/
│   ├── README.md (this file)
│   ├── tiktok-template.md
│   ├── instagram-template.md
│   ├── youtube-template.md
│   ├── twitter-x-template.md
│   ├── linkedin-template.md
│   ├── pinterest-template.md
│   └── facebook-template.md
├── metadata-templates/
│   ├── README.md
│   ├── content-dna-frontmatter.md
│   └── swarm-attribution-template.md
├── intelligence-templates/
│   ├── README.md
│   ├── weekly-intelligence-brief.md
│   └── competitive-intelligence-report.md
└── performance-templates/
    ├── README.md
    ├── platform-health-dashboard.md
    └── content-performance-report.md
```

---

## Quick Start

### Using Platform Content Templates

1. **Select your platform** - Choose the template matching your target platform
2. **Fill in the metadata** - Complete the YAML front matter for tracking
3. **Create content** - Follow the platform-specific guidelines
4. **Add to intelligence brief** - Track performance and iterations

### Using Metadata Templates

1. **Copy the YAML front matter** - Use the Content DNA template
2. **Customize fields** - Adjust for your specific content
3. **Link to tools** - Connect with 80+ integrated platforms
4. **Track performance** - Monitor in performance dashboard

### Using Intelligence Templates

1. **Weekly updates** - Fill out the Weekly Intelligence Brief
2. **Track algorithms** - Note platform algorithm changes
3. **Monitor competitors** - Use competitive intelligence template
4. **Inform strategy** - Adjust content strategy based on insights

### Using Performance Templates

1. **Weekly reviews** - Update Platform Health Dashboard
2. **Analyze top content** - Identify high-performing pieces
3. **Resource allocation** - Adjust based on performance data
4. **Report to stakeholders** - Use Performance Report format

---

## Template Conventions

### YAML Front Matter

All content templates use YAML front matter with the following structure:

```yaml
---
content_id: UNIQUE-ID-2024-001
title: Content Title
platform: [tiktok|instagram|youtube|twitter|linkedin|pinterest|facebook]
content_type: [video|image|text|carousel|thread|story|reel]
created_date: 2025-01-13
swarm_attribution:
  creator: "@handle"
  reviewers: ["@handle1", "@handle2"]
  approvers: ["@handle"]
content_dna:
  psychological_framework: "framework-name"
  target_emotion: "emotion-state"
  hook_type: "hook-type"
  cta_type: "cta-type"
seo_optimization:
  primary_keyword: "keyword"
  secondary_keywords: ["keyword1", "keyword2"]
  geo_targeting: "region/country"
tool_integration:
  scheduling: "tool-name"
  analytics: "tool-name"
  ai_tools: ["tool1", "tool2"]
performance_tracking:
  target_kpi: "metric-name"
  baseline_value: 0000
  target_value: 0000
relational_graph:
  related_content: ["id1", "id2"]
  repurposed_from: "source-id"
  repurposed_to: ["target-id1", "target-id2"]
---
```

### Naming Conventions

- **Content IDs**: `{PLATFORM}-{TYPE}-{YYYY}-{NUMBER}`
  - Example: `tiktok-video-2025-001`
- **File Names**: `{content_id}.md`
- **Directory Names**: `kebab-case` for all directories

### Version Control

- Major template updates: Increment version number (v1.0 → v2.0)
- Minor adjustments: Add date to filename
- Always document changes in template README

---

## Platform-Specific Guidelines

### TikTok

- **Video Specs**: 9:16 ratio, 15-60 seconds, 1080x1920 minimum
- **Hook Strategy**: Visual hook in first 0-3 seconds
- **Content DNA**: Focus on trends, challenges, sound-based content

### Instagram

- **Reels**: 9:16 ratio, 15-90 seconds
- **Carousels**: 7-10 slides, educational focus
- **Stories**: 24-hour lifespan, interactive elements

### YouTube

- **Shorts**: 9:16 ratio, under 60 seconds
- **Long-form**: 10+ minutes, SEO-optimized titles

### Twitter/X

- **Threads**: 5-7 tweets, narrative arc
- **Single tweets**: Under 280 characters, engagement hooks

### LinkedIn

- **Document posts**: Professional insights, 3+ paragraphs
- **Standard posts**: Business-focused, softer CTA

### Pinterest

- **Pins**: Vertical 2:3 ratio, keyword-rich descriptions
- **Idea Pins**: Step-by-step visual tutorials

### Facebook

- **Community posts**: Discussion-focused, group engagement
- **Event templates**: Clear date/time/location information

---

## Best Practices

### Content Creation

1. **Start with the hook** - First 3 seconds determine 80% of success
2. **Focus on one idea** - Don't dilute your message
3. **Include strong CTA** - Every piece should have a purpose
4. **Optimize for platform** - Respect platform-specific behaviors

### Metadata Management

1. **Be consistent** - Use the same fields across all content
2. **Track iterations** - Note what works and what doesn't
3. **Link content** - Build relational graphs for insights
4. **Update regularly** - Keep performance data current

### Intelligence Gathering

1. **Weekly reviews** - Stay current with algorithm changes
2. **Competitive monitoring** - Watch what works for others
3. **Trend spotting** - Identify emerging patterns early
4. **Knowledge sharing** - Distribute insights across the swarm

### Performance Analysis

1. **Track metrics** - Monitor KPIs consistently
2. **A/B testing** - Experiment with variations
3. **Resource optimization** - Double down on what works
4. **Stakeholder reporting** - Clear, data-driven updates

---

## Tool Integrations

This template system supports 80+ tools including:

**Scheduling & Publishing**: Buffer, Hootsuite, Later, Sprout Social
**Analytics**: Google Analytics, Meta Business Suite, TikTok Analytics
**AI Tools**: Claude, ChatGPT, Midjourney, RunwayML
**Design**: Canva, Figma, Adobe Creative Suite
**Video Editing**: CapCut, Premiere Pro, DaVinci Resolve
**Project Management**: Notion, Airtable, Trello, Asana

---

## Version History

- **v1.0** (2025-01-13): Initial template system launch
- Platform-specific templates for 7 major platforms
- Metadata front matter with Content DNA tracking
- Intelligence and performance reporting templates
- 80+ tool integration support

---

## Contributing

To improve these templates:

1. Use the templates in real scenarios
2. Document what works and what doesn't
3. Suggest improvements based on performance data
4. Share learnings with the swarm

---

## Support

For questions or issues:
- Review platform-specific template documentation
- Check intelligence briefs for algorithm updates
- Consult performance dashboard for metrics guidance
- Engage with the swarm for collaborative problem-solving

---

**Remember**: Templates are starting points, not rigid rules. Adapt them to your specific needs, brand voice, and audience preferences.

**Innovation isn't about new tools—it's about better questions.**
