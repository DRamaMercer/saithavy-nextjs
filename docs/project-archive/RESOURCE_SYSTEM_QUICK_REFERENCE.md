# Resource System Quick Reference

## File Locations

### Core Files
```
src/types/resources.ts                    # Type definitions (2.5K)
src/lib/resourcesData.ts                  # All 62 resources (28K)
src/lib/resourceContent.ts                # Content loading system (5.2K)
src/components/ResourceDownloadModal.tsx  # Download modal (9.7K)
src/app/resources/[category]/[slug]/page.tsx  # Detail page (1.9K)
src/app/api/pdf/route.ts                  # PDF generation API
```

### Content Directory
```
src/content/resources/
├── mindful-leadership/       # 13 resources
├── ai-automation/            # 13 resources
├── personal-growth/          # 12 resources
├── remote-work/              # 11 resources
└── overcoming-adversity/     # 12 resources
```

## Key Functions

### resourcesData.ts
```typescript
getResourceBySlug(slug)           // Get single resource
getResourcesByCategory(category)  // Filter by category
getFeaturedResources()            // Get featured items
searchResources(query)            // Search titles/descriptions
getRelatedResources(resource)     // Get related items
```

### resourceContent.ts
```typescript
getResourceContent(resource)      // Load with metadata
getResourceContentSync(resource)  // Sync (cached only)
resourceContentExists(resource)   // Check file exists
clearContentCache()               // Clear cache
preloadResourceContents(list)     // Batch preload
```

## Type Usage

```typescript
import { Resource, DownloadFormat } from '@/types/resources';

// Resource object
const resource: Resource = {
  id: '1',
  slug: 'mindful-leadership-journal',
  title: 'Mindful Leadership Journal',
  category: 'mindful-leadership',
  type: 'Template',
  // ... other fields
};

// Download format
const format: DownloadFormat = 'pdf'; // or 'web' | 'print'
```

## Page URLs

Resource detail pages follow this pattern:
```
/resources/{category}/{slug}

Examples:
/resources/mindful-leadership/mindful-leadership-reflection-journal
/resources/ai-automation/inclusive-automation-readiness-kit
/resources/personal-growth/anti-fragility-workbook
```

## Content File Format

Each markdown file should have frontmatter:
```markdown
---
title: Resource Title
description: Resource description
category: mindful-leadership
type: Template
featured: true
difficulty: Beginner
timeToRead: 10 min
targetAudience: All Leaders
keywords:
  - keyword1
  - keyword2
lastUpdated: 2025-01-15
---

# Content here
```

## Analytics Events

```typescript
import { trackEvent, trackResourceDownload, trackEmailSignup } from '@/lib/analytics';

// Track download
trackResourceDownload(resourceId, resourceTitle, format);

// Track email signup
trackEmailSignup('resource_download', resourceId);

// Custom event
trackEvent('custom_event', { param1: 'value' });
```

## Download Flow

1. User clicks "Download Resource"
2. Modal opens with 3 options
3. **PDF**: Requires email → validates → tracks → downloads
4. **Web**: No email → tracks → opens new tab
5. **Print**: No email → tracks → print dialog

## TODO for Production

### Required
- [ ] Configure PDF generation (Puppeteer/jsPDF)
- [ ] Set up email capture API
- [ ] Migrate all 62 content files
- [ ] Test all download flows

### Optional
- [ ] Add search functionality
- [ ] Implement ratings/reviews
- [ ] Create analytics dashboard
- [ ] Add resource recommendations

## Testing Checklist

```bash
# Type checking
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint

# Start dev server
npm run dev
```

Then test:
- Navigate to `/resources`
- Click a resource
- Click "Download Resource"
- Test PDF (email capture)
- Test Web version
- Test Print version
- Check analytics events
