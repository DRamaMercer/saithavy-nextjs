# Content DNA Front Matter Template

*Comprehensive YAML metadata structure for tracking content attribution, psychological profiles, SEO optimization, and tool integrations across the Swarm Agency platform.*

---

## Purpose

This template provides a standardized front matter structure that:

1. **Tracks Content Attribution** - Who created, reviewed, and approved content
2. **Captures Content DNA** - Psychological frameworks, emotions, hooks, CTAs
3. **Enables SEO Optimization** - Keywords, geo-targeting, hashtags
4. **Integrates 80+ Tools** - Scheduling, analytics, AI, design platforms
5. **Builds Relational Graphs** - Content connections, repurposing, A/B tests
6. **Tracks Performance** - KPIs, baselines, targets, iterations
7. **Enables Analysis** - Swarm-wide learning and optimization

---

## Complete Front Matter Template

```yaml
---
# ===== IDENTIFICATION =====
content_id: "{platform}-{type}-{yyyy}-{nnn}"
title: "Content Title Here"
subtitle: "Optional subtitle or hook"
created_date: "2025-01-13"
modified_date: "2025-01-14"
scheduled_date: "2025-01-15"
published_date: "2025-01-15"
content_status: "draft|scheduled|published|archived"

# ===== PLATFORM & FORMAT =====
platform: "[tiktok|instagram|youtube|twitter|linkedin|pinterest|facebook|blog|podcast|email]"
content_type: "[video|image|text|carousel|thread|story|reel|short|post|article|episode|newsletter]"
content_format: "[vertical|horizontal|square|audio|long-form|short-form]"
content_duration: "{seconds or minutes}"

# ===== SWARM ATTRIBUTION =====
swarm_attribution:
  creator: "@handle or name"
  concept_by: "@handle or name"
  writer: "@handle or name"
  designer: "@handle or name"
  editor: "@handle or name"
  photographer: "@handle or name"
  videographer: "@handle or name"
  host_presenter: "@handle or name"
  reviewers: ["@handle1", "@handle2"]
  approvers: ["@handle"]
  stakeholders: ["@handle1", "@handle2"]

# ===== CONTENT DNA =====
content_dna:
  # Psychological Framework
  psychological_framework: |
    [curiosity-gap|social-proof|scarcity|reciprocity|authority|
    liking|commitment|unity|loss-aversion|anchoring|framing|
    priming|halo-effect|bandwagon|fear-of-missing-out]

  # Target Emotion
  target_emotion: |
    [surprise|joy|inspiration|relief|curiosity|excitement|
    amusement|anger|fear|sadness|disgust|anticipation|trust]

  # Hook Type
  hook_type: |
    [visual-shock|pattern-interrupt|question|challenge|
    bold-statement|story|counterintuitive|comparison|
    before-after|how-to|listicle|case-study]

  # CTA Type
  cta_type: |
    [follow|like|comment|share|subscribe|link-click|
    save|bookmark|dm|reply|tag|mention|join|sign-up|
    download|register|attend|watch|read|listen]

  # Content Category
  content_category: "[educational|entertainment|inspiration|promotional|community|behind-scenes]"
  content_pillar: "[pillar-name-or-content-series]"
  content_series: "[series-name-or-standalone]"

  # Value Proposition
  value_proposition: "Brief statement of value delivered"
  unique_angle: "What makes this content unique"
  audience_takeaway: "What the audience will gain"

# ===== SEO OPTIMIZATION =====
seo_optimization:
  # Keywords
  primary_keyword: "main target keyword phrase"
  secondary_keywords: ["related keyword 1", "related keyword 2", "related keyword 3"]
  long_tail_keywords: ["specific long-tail phrase 1", "specific long-tail phrase 2"]
  keyword_density: "2.5%" # Optional

  # Hashtags
  hashtags: ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  hashtag_strategy: "broad|specific|mixed|trending|branded"

  # Geo-Targeting
  geo_targeting: "[country|region|city|global]"
  language: "[en|es|fr|de|etc]"
  locale: "[en-US|en-GB|etc]"

  # Platform-Specific SEO
  title_seo: "SEO-optimized title (60 chars max)"
  description_seo: "SEO-optimized description (160 chars max)"
  alt_text: "Descriptive text for images and accessibility"
  caption_keywords: ["keyword1", "keyword2", "keyword3"]

  # Structured Data
  schema_type: "[Article|Video|Image|Recipe|FAQ|Review|etc]"
  structured_data: "{optional JSON-LD structured data}"

# ===== TOOL INTEGRATION =====
tool_integration:
  # Scheduling & Publishing
  scheduling: "[buffer|hootsuite|later|sprout-social|meta-business-suite|youtube-studio|native]"
  publishing: "[buffer|hootsuite|later|sprout-social|meta-business-suite|youtube-studio|native]"

  # Analytics & Monitoring
  analytics: "[google-analytics|meta-business-suite|tiktok-analytics|youtube-studio|sprout-social|iconosquare|later]"
  monitoring: "[mention|brandwatch|hootsuite-insights]"
  social_listening: "[brandwatch|mention|hootsuite]"

  # Creation Tools
  writing: "[chatgpt|claude|notion|google-docs|word]"
  design: "[canva|figma|photoshop|illustrator]"
  photo_editing: "[lightroom|vsco|snapseed|photoshop]"
  video_editing: "[premiere|final-cut|da-vinci|capcut|after-effects|imovie]"
  audio_editing: "[audacity|adobe-audition|garage-band]"

  # AI Tools
  ai_writing: "[chatgpt|claude|jasper|copy-ai|writesonic]"
  ai_image: "[midjourney|dall-e|stable-diffusion|leonardo]"
  ai_video: "[runwayml|synthesia|d-id|heygen]"
  ai_audio: "[eleven-labs|murf|play-ht]"
  ai_ideas: "[chatgpt|claude|notion-ai]"

  # Project Management
  project_management: "[notion|airtable|trello|asana|monday|clickup]"
  calendar: "[notion|airtable|google-calendar|calendly]"
  file_storage: "[google-drive|dropbox|box|onedrive]"

  # Communication
  team_communication: "[slack|discord|teams|zoom]"
  client_communication: "[slack|email|notion]"

  # Email Marketing
  email_platform: "[mailchimp|convertkit|activecampaign|mailerlite]"
  email_sequences: "[mailchimp|convertkit|activecampaign]"

  # CRM & Sales
  crm: "[hubspot|salesforce|pipedrive|notion]"
  landing_pages: "[leadpages|unbounce|webflow|wordpress]"

  # Additional Tools
  additional_tools: ["tool1", "tool2", "tool3"]

# ===== PERFORMANCE TRACKING =====
performance_tracking:
  # Target KPI
  target_kpi: |
    [views|impressions|reach|engagement-rate|clicks|ctr|
    shares|comments|likes|saves|follows|subscribers|
    watch-time|completion-rate|click-to-play|conversions|
    revenue|roi|cpm|cpc]

  # Baseline Metrics
  baseline_value: 0000
  baseline_date: "2025-01-01"
  baseline_period: "7-days|30-days|90-days"

  # Target Metrics
  target_value: 0000
  target_date: "2025-02-01"
  target_period: "7-days|30-days|90-days"

  # Actual Performance
  actual_value: 0000
  actual_date: "2025-01-20"
  actual_period: "24-hours|7-days|30-days"

  # Performance Metrics
  performance_vs_target: "{percentage}%"
  performance_vs_baseline: "{percentage}%"
  performance_rating: "[excellent|good|average|below-average|poor]"

  # Measurement Window
  measurement_window: "[24-hours|7-days|30-days|quarterly|yearly]"
  next_review_date: "2025-01-22"

# ===== RELATIONAL GRAPH =====
relational_graph:
  # Related Content
  related_content: ["content-id-1", "content-id-2", "content-id-3"]
  related_campaigns: ["campaign-id-1", "campaign-id-2"]

  # Content Lineage
  repurposed_from: "source-content-id"
  repurposed_to: ["target-content-id-1", "target-content-id-2"]

  # Content Series
  content_series: ["series-id-1", "series-id-2"]
  episode_number: 1
  total_episodes: 10

  # A/B Testing
  a_b_test_group: "test-group-name"
  a_b_test_variants: ["content-id-1-b", "content-id-1-c"]
  a_b_test_winner: "content-id-1-b"

  # Cross-Platform Links
  cross_platform_links:
    tiktok: "url-or-content-id"
    instagram: "url-or-content-id"
    youtube: "url-or-content-id"
    twitter: "url-or-content-id"
    linkedin: "url-or-content-id"
    pinterest: "url-or-content-id"
    facebook: "url-or-content-id"
    blog: "url-or-content-id"

  # Internal Links
  internal_references: ["internal-content-id-1", "internal-content-id-2"]
  external_references: ["external-url-1", "external-url-2"]

# ===== CONTENT ASSETS =====
content_assets:
  # Image Assets
  thumbnail: "path/to/thumbnail.jpg"
  featured_image: "path/to/featured-image.jpg"
  additional_images: ["path/to/image-1.jpg", "path/to/image-2.jpg"]

  # Video Assets
  main_video: "path/to/main-video.mp4"
  teaser_video: "path/to/teaser-video.mp4"
  behind_scenes: "path/to/behind-scenes.mp4"

  # Audio Assets
  background_music: "track-name-or-artist"
  voice_over: "path/to/voiceover.mp3"

  # Document Assets
  transcript: "path/to/transcript.pdf"
    show_notes: "path/to/show-notes.md"
  resources: "path/to/resources.pdf"

  # Design Assets
  canva_template: "canva-template-link"
  design_source: "path/to/design-source.fig"

# ===== AUDIENCE TARGETING =====
audience_targeting:
  # Demographics
  target_age_range: "[18-24|25-34|35-44|45-54|55-64|65+]"
  target_gender: "[all|male|female|non-binary|prefer-not-to-say]"
  target_location: "[country|region|city|global]"

  # Psychographics
  target_interests: ["interest1", "interest2", "interest3"]
  target_behaviors: ["behavior1", "behavior2"]
  target_pain_points: ["pain-point-1", "pain-point-2"]

  # Platform-Specific Targeting
  tiktok_audience: "[gen-z|millennials|parents|professionals|etc]"
  instagram_audience: "[millennials|gen-z|business|creatives|etc]"
  youtube_audience: "[general|niche|age-specific|etc]"
  linkedin_audience: "[professionals|industry-specific|job-level]"

  # Custom Audiences
  custom_audiences: ["custom-audience-id-1", "custom-audience-id-2"]
  lookalike_audiences: ["lookalike-audience-id-1"]

# ===== MONETIZATION =====
monetization:
  # Sponsored Content
  is_sponsored: false
  sponsor: "@sponsor-handle or company-name"
  sponsorship_type: "[post|video|series|campaign]"
  sponsorship_value: "$0000.00"

  # Affiliate Links
  has_affiliate_links: false
  affiliate_products: ["product-1", "product-2"]
  affiliate_disclosure: "This post contains affiliate links"

  # Product Links
  product_links: ["product-url-1", "product-url-2"]
  service_links: ["service-url-1", "service-url-2"]

  # Revenue Tracking
  projected_revenue: "$0000.00"
  actual_revenue: "$0000.00"
  revenue_date: "2025-01-20"

# ===== LEGAL & COMPLIANCE =====
legal_compliance:
  # Copyright
  copyright_holder: "[your-name-or-company]"
  copyright_notice: "© 2025 [Company Name]. All rights reserved."
  license: "[all-rights-reserved|creative-commons|public-domain]"

  # Disclosures
  ad_disclosure_required: false
  ad_disclosure_text: "This post contains sponsored content"
  affiliate_disclosure_required: false
  affiliate_disclosure_text: "This post contains affiliate links"

  # Permissions
  music_license: "[licensed|royalty-free|fair-use|custom]"
  image_rights: "[owned|licensed|stock|fair-use|custom]"
  video_rights: "[owned|licensed|stock|fair-use|custom]"

  # Data Privacy
  data_collection: false
  data_usage: "[analytics|personalization|none]"

# ===== NOTES & COMMENTS =====
content_notes: |
  Free-form notes about the content.
  Include context, decisions made, lessons learned,
  or any other relevant information.

creation_notes: |
  Notes about the creation process.
  Include challenges, solutions, and insights.

performance_notes: |
  Notes about performance and lessons learned.
  Include what worked, what didn't, and why.

iteration_notes:
  version: 1
  changes: "Description of changes made"
  date: "2025-01-14"
  reason: "Why changes were made"
  impact: "Observed impact of changes"

# ===== CUSTOM FIELDS =====
custom_fields:
  field_1: "Custom value 1"
  field_2: "Custom value 2"
  field_3: "Custom value 3"

# ===== METADATA =====
template_version: "1.0"
last_updated: "2025-01-13"
updated_by: "@handle"
tags: ["tag1", "tag2", "tag3"]
categories: ["category1", "category2"]
priority: "[high|medium|low]"
---
```

---

## Simplified Front Matter Template

For basic content, use this simplified version:

```yaml
---
content_id: "tiktok-video-2025-001"
title: "Your Content Title"
platform: "tiktok"
content_type: "video"
created_date: "2025-01-13"
scheduled_date: "2025-01-15"

swarm_attribution:
  creator: "@handle"
  reviewers: ["@handle1"]
  approvers: ["@handle"]

content_dna:
  psychological_framework: "curiosity-gap"
  target_emotion: "surprise"
  hook_type: "visual-shock"
  cta_type: "follow"

seo_optimization:
  primary_keyword: "keyword phrase"
  hashtags: ["#tag1", "#tag2", "#tag3"]
  caption_keywords: ["keyword1", "keyword2"]

performance_tracking:
  target_kpi: "views"
  target_value: 10000

tool_integration:
  editing: "capcut"
  scheduling: "later"
  ai_tools: ["chatgpt-script"]

relational_graph:
  repurposed_to: ["instagram-reels-2025-001"]
  a_b_test_variants: ["tiktok-video-2025-001-b"]
---
```

---

## Field Definitions

### Identification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content_id` | string | Yes | Unique identifier: `{platform}-{type}-{year}-{number}` |
| `title` | string | Yes | Content title (SEO-optimized for posts) |
| `created_date` | date | Yes | Date content was created |
| `scheduled_date` | date | No | Date content is scheduled to publish |
| `published_date` | date | No | Actual date content was published |

### Swarm Attribution Fields

| Field | Type | Description |
|-------|------|-------------|
| `creator` | string | Primary creator handle or name |
| `concept_by` | string | Person who developed the concept |
| `reviewers` | array | Handles of people who reviewed |
| `approvers` | array | Handles of people who approved |

### Content DNA Fields

| Field | Type | Description |
|-------|------|-------------|
| `psychological_framework` | enum | Psychological trigger used |
| `target_emotion` | enum | Emotion content aims to evoke |
| `hook_type` | enum | Type of hook used to grab attention |
| `cta_type` | enum | Call-to-action type |

### Performance Tracking Fields

| Field | Type | Description |
|-------|------|-------------|
| `target_kpi` | enum | Key performance indicator to track |
| `baseline_value` | number | Starting metric value |
| `target_value` | number | Goal metric value |
| `actual_value` | number | Actual achieved value |

### Tool Integration Fields

| Category | Tools (examples) |
|----------|------------------|
| **Scheduling** | Buffer, Hootsuite, Later, Sprout Social |
| **Analytics** | Google Analytics, Meta Business Suite, TikTok Analytics |
| **Creation** | Canva, Figma, Adobe Creative Suite |
| **AI Tools** | ChatGPT, Claude, Midjourney, RunwayML |
| **Project Management** | Notion, Airtable, Trello, Asana |

---

## Best Practices

### 1. Consistency

- Use the same field values across similar content
- Standardize handles, platform names, and categories
- Follow naming conventions for content IDs

### 2. Completeness

- Fill out all required fields
- Include optional fields when relevant
- Update fields as content changes or performance data comes in

### 3. Accuracy

- Use real dates and metrics
- Be honest about performance
- Document actual tools used

### 4. Analysis

- Review performance data regularly
- Update iteration notes with learnings
- Use data to inform future content decisions

### 5. Integration

- Link related content in relational graph
- Connect tool integrations to actual workflows
- Track content lineage for repurposing analysis

---

## Tool Integration Reference

### Scheduling & Publishing Platforms

- **Buffer**: Multi-platform scheduling
- **Hootsuite**: Social media management
- **Later**: Visual content calendar
- **Sprout Social**: Enterprise social management
- **Meta Business Suite**: Facebook/Instagram native
- **YouTube Studio**: YouTube native
- **TikTok Native**: TikTok scheduler

### Analytics Platforms

- **Google Analytics**: Web analytics
- **Meta Business Suite**: Facebook/Instagram insights
- **TikTok Analytics**: TikTok insights
- **YouTube Studio**: YouTube analytics
- **Iconosquare**: Instagram analytics
- **Sprout Social**: Cross-platform analytics

### Creation Tools

- **Canva**: Graphic design
- **Figma**: UI/UX design
- **Adobe Creative Suite**: Professional design
- **Lightroom**: Photo editing
- **CapCut**: Video editing
- **Premiere Pro**: Professional video editing

### AI Tools

- **ChatGPT**: AI writing assistant
- **Claude**: AI writing assistant
- **Jasper**: AI copywriting
- **Midjourney**: AI image generation
- **RunwayML**: AI video editing
- **ElevenLabs**: AI voice generation

### Project Management

- **Notion**: All-in-one workspace
- **Airtable**: Database + workflow
- **Trello**: Kanban project management
- **Asana**: Task and project management
- **Monday**: Work management

---

## Template Version History

- **v1.0** (2025-01-13): Initial comprehensive front matter template
  - 80+ tool integration support
  - Complete content DNA tracking
  - Performance tracking framework
  - Relational graph structure
  - Legal and compliance fields

---

**Remember**: Good metadata enables better analysis, learning, and optimization across the entire swarm. Invest time in accurate, complete front matter.
