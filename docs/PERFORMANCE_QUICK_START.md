# Performance Optimization Quick Start
**Implementation Guide for Critical Performance Improvements**

---

## Part 1: Add React.memo to Key Components (30 minutes)

### 1. Optimize ResourceCard
**File:** `src/components/ResourceCard.tsx`

```typescript
// Add React.memo export
export const ResourceCard = React.memo(({ resource }) => {
  // ... existing component code
});

ResourceCard.displayName = 'ResourceCard';
```

### 2. Optimize ResourceCardGrid
**File:** `src/components/resources/ResourceCardGrid.tsx`

```typescript
export const ResourceCardGrid = React.memo(({ resources, filters, onFilterChange }) => {
  // ... existing component code
});
```

### 3. Optimize DownloadModal
**File:** `src/components/DownloadModal.tsx`

```typescript
const DownloadModal = React.memo(({ resource, onClose }) => {
  // ... existing component code
});

export default DownloadModal;
```

### 4. Optimize FiltersBar
**File:** `src/components/resources/FiltersBar.tsx`

```typescript
export const FiltersBar = React.memo(({
  filters,
  availableCategories,
  availableTags,
  onFilterChange,
  onReset
}) => {
  // ... existing component code
});
```

---

## Part 2: Dynamic Import Heavy Components (1 hour)

### 1. Dynamic Import HeroSection (p5.js is heavy)
**File:** `src/app/page.tsx`

```typescript
import dynamic from 'next/dynamic';

// Replace static import
// import HeroSection from "@/components/sections/HeroSection";

// With dynamic import
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), {
  loading: () => (
    <div className="h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 animate-pulse" />
  ),
  ssr: false, // p5.js requires browser environment
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* rest of page */}
    </>
  );
}
```

### 2. Dynamic Import DownloadModal
**File:** `src/components/resources/ResourceCard.tsx`

```typescript
import dynamic from 'next/dynamic';

// Replace static import
// import DownloadModal from '@/components/DownloadModal';

// With dynamic import
const DownloadModal = dynamic(() => import('@/components/DownloadModal'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 animate-pulse">Loading...</div>
    </div>
  ),
  ssr: false,
});
```

### 3. Dynamic Import ContactSection
**File:** `src/app/page.tsx`

```typescript
import dynamic from 'next/dynamic';

const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => (
    <section className="py-20 animate-pulse bg-gray-100">
      <div className="max-w-2xl mx-auto h-64"></div>
    </section>
  ),
});
```

---

## Part 3: Optimize Images (30 minutes)

### 1. Compress Hero Images

**Option A: Using Squoosh.app (Web GUI)**
1. Go to https://squoosh.app
2. Upload these images:
   - `public/images/hero-image.jpg` (374KB)
   - `public/images/saithavy-photo.jpg` (324KB)
   - `public/images/transformation-bg.jpg` (343KB)
3. Settings:
   - Format: WebP
   - Quality: 85
   - Resize: Max width 1200px
4. Download and replace original files

**Option B: Using ImageMagick (CLI)**
```bash
# Install ImageMagick if needed
# choco install imagemagick

# Compress hero images
magick public/images/hero-image.jpg -quality 85 -resize 1200x public/images/hero-image.webp
magick public/images/saithavy-photo.jpg -quality 85 -resize 800x public/images/saithavy-photo.webp
magick public/images/transformation-bg.jpg -quality 85 -resize 1200x public/images/transformation-bg.webp
```

### 2. Update Image Components with Blur Placeholders

**Step 1: Generate blur data URLs**
```bash
# Install sharp for image processing
npm install sharp --save-dev

# Run this script to generate blur placeholders
# scripts/generate-blur-placeholders.js
```

**Step 2: Update Image components**
```typescript
// Example for hero image
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative h-[600px]">
      <Image
        src="/hero-image.webp" // Use WebP
        alt="Hero"
        fill
        priority // Above the fold
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA..." // Generated from script
        className="object-cover"
      />
    </div>
  );
}
```

---

## Part 4: Add Performance Monitoring (15 minutes)

### 1. Create Performance Tracker
**File:** `src/lib/performance.ts`

```typescript
export function reportWebVitals(metric: any) {
  const { name, value, id } = metric;

  // Send to analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value,
        id,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}:`, value);
  }
}
```

### 2. Add to Root Layout
**File:** `src/app/layout.tsx`

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { reportWebVitals } from '@/lib/performance';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  // Import web-vitals library dynamically
                  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                    getCLS(reportWebVitals);
                    getFID(reportWebVitals);
                    getFCP(reportWebVitals);
                    getLCP(reportWebVitals);
                    getTTFB(reportWebVitals);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
```

### 3. Create Analytics API Route
**File:** `src/app/api/analytics/web-vitals/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Log in development (replace with your analytics service)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', body);
  }

  // TODO: Send to your analytics service
  // Example: Vercel Analytics, Google Analytics, etc.

  return NextResponse.json({ success: true });
}
```

---

## Part 5: Verify Improvements (15 minutes)

### 1. Run Build
```bash
npm run build
```

### 2. Check Bundle Sizes
```bash
# Check largest chunks
ls -lah .next/static/chunks/*.js | sort -k5 -hr | head -10
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Test Performance
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

---

## Expected Results

After implementing these changes:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Largest Chunk | 1003KB | ~250KB | **75% reduction** |
| Initial Bundle | ~500KB | ~300KB | **40% reduction** |
| Lighthouse Score | ~75 | ~90 | **+15 points** |
| First Contentful Paint | ~1.8s | ~1.2s | **33% faster** |
| Time to Interactive | ~3.5s | ~2.1s | **40% faster** |

---

## Troubleshooting

### Issue: Dynamic import not working
**Solution:** Make sure the component has a default export
```typescript
// Add this
ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

### Issue: p5.js errors in SSR
**Solution:** Always use `ssr: false` for p5.js components
```typescript
const P5Component = dynamic(() => import('./P5Component'), {
  ssr: false,
});
```

### Issue: Images not optimizing
**Solution:** Make sure images are in `public/` folder and use correct imports
```typescript
import Image from 'next/image';
import heroImage from '@/public/images/hero-image.jpg'; // For local imports
```

---

## Next Steps

After completing this quick start:

1. **Monitor performance** in production using Vercel Analytics
2. **Set up Lighthouse CI** to catch regressions
3. **Optimize more components** based on profiling data
4. **Consider service worker** optimization for PWA

---

**Time Estimate:** 2 hours total
**Difficulty:** Beginner-friendly
**Impact:** High (40% faster load times)
