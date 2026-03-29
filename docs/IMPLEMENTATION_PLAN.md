# Implementation Plan - Saithavy UX/UI Overhaul

## Executive Summary

This implementation plan addresses 42 identified issues across the resources and blog pages, organized into 4 phases over 6 weeks. The plan prioritizes critical accessibility fixes, design system foundation, and progressive enhancement.

**Total Effort Estimate:** ~200 hours (5 weeks)
**Team:** Senior Developer + Full-stack Guardian

---

## Phase 1: Foundation (Week 1) - 40 hours

### Objectives
- Establish design token system
- Create core UI components
- Setup accessibility infrastructure

### Success Criteria
- ✅ All design tokens defined in globals.css
- ✅ Core component library created (Button, Card, Badge)
- ✅ Accessibility baseline established (WCAG AA)
- ✅ Zero hardcoded colors in new code

### Tasks

#### 1.1 Design Tokens (8 hours)
**File:** [src/app/globals.css](src/app/globals.css)

```css
:root {
  /* Brand Colors */
  --color-primary: #E07A5F;
  --color-primary-hover: #C96B52;
  --color-secondary: #1B263B;
  --color-accent: #A8DADC;

  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Text Colors */
  --color-text-primary: #1A365D;
  --color-text-secondary: #4A5568;
  --color-text-tertiary: #718096;
  --color-text-inverse: #FFFFFF;

  /* Backgrounds */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;

  /* Spacing (8-point grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Typography */
  --font-display: 'Poppins', sans-serif;
  --font-body: 'Roboto', sans-serif;

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}
```

#### 1.2 Core Components (16 hours)
**Files:**
- [src/components/ui/Button.tsx](src/components/ui/Button.tsx)
- [src/components/ui/Card.tsx](src/components/ui/Card.tsx)
- [src/components/ui/Badge.tsx](src/components/ui/Badge.tsx)

**Button Component:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  // Implementation with design tokens
}
```

#### 1.3 Accessibility Infrastructure (8 hours)
**File:** [src/app/globals.css](src/app/globals.css)

```css
/* Focus visible styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip navigation */
.skip-to-content {
  position: absolute;
  left: -9999px;
}

.skip-to-content:focus {
  left: 10px;
  top: 10px;
  z-index: 9999;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 1.4 Testing Setup (8 hours)
- Configure Vitest for component testing
- Setup axe-core for accessibility testing
- Create test templates

### Dependencies
- None (foundation phase)

### Risks
- **Medium:** Existing components may conflict with new design tokens
- **Mitigation:** Use CSS cascade carefully, test thoroughly

### Testing
- Visual regression test for all components
- Accessibility audit with axe DevTools
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Phase 2: Critical Fixes (Week 2) - 40 hours

### Objectives
- Fix all 8 critical issues
- Implement keyboard navigation
- Add error states

### Success Criteria
- ✅ All critical issues resolved
- ✅ WCAG AA compliance achieved
- ✅ Keyboard navigation works across all interactive elements

### Tasks

#### 2.1 Blog Category Filtering (8 hours)
**File:** [src/app/blog/page.tsx](src/app/blog/page.tsx)

**Issue:** Categories are static, non-functional

**Solution:**
```tsx
// Add state management for category filter
const [selectedCategory, setSelectedCategory] = useState<string>('all');

// Add click handlers to category pills
<button onClick={() => setSelectedCategory(category)}>
  {category}
</button>

// Filter posts by category
const filteredPosts = selectedCategory === 'all'
  ? posts
  : posts.filter(post => post.category === selectedCategory);

// Sync with URL
useEffect(() => {
  const params = new URLSearchParams();
  if (selectedCategory !== 'all') params.set('category', selectedCategory);
  const newUrl = params.toString() ? `?${params}` : '';
  window.history.replaceState({}, '', newUrl);
}, [selectedCategory]);
```

#### 2.2 Theme Toggle (8 hours)
**File:** [src/components/Navigation.tsx](src/components/Navigation.tsx) (create if not exists)

**Issue:** No way to switch between light/dark mode

**Solution:**
```tsx
import { ThemeProvider } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

#### 2.3 Keyboard Navigation for Save Buttons (8 hours)
**File:** [src/components/resources/ResourceCardGrid.tsx](src/components/resources/ResourceCardGrid.tsx)

**Issue:** Bookmark buttons not keyboard accessible

**Solution:**
```tsx
<button
  onClick={(e) => onSaveToggle(e, resource.slug)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSaveToggle(e, resource.slug);
    }
  }}
  aria-label={`Save ${resource.title}`}
>
  <Bookmark />
</button>
```

#### 2.4 Previous/Next Navigation (8 hours)
**File:** [src/app/resources/[category]/[slug]/page.tsx](src/app/resources/[category]/[slug]/page.tsx)

**Issue:** No way to navigate between resources

**Solution:**
```tsx
// Get current resource index
const currentIndex = resources.findIndex(r => r.slug === resource.slug);
const previousResource = resources[currentIndex - 1];
const nextResource = resources[currentIndex + 1];

// Add navigation buttons
<div className="flex justify-between">
  {previousResource && (
    <Link href={`/resources/${previousResource.category}/${previousResource.slug}`}>
      ← Previous
    </Link>
  )}
  {nextResource && (
    <Link href={`/resources/${nextResource.category}/${nextResource.slug}`}>
      Next →
    </Link>
  )}
</div>
```

#### 2.5 Error States (8 hours)
**File:** [src/components/resources/ClientResourcesPage.tsx](src/components/resources/ClientResourcesPage.tsx)

**Issue:** Failed API calls show no user feedback

**Solution:**
```tsx
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchResources(filters);
  setResources(data);
  setError(null);
} catch (err) {
  setError('Failed to load resources. Please try again.');
  clientLogger.error('Failed to fetch resources', { error: err });
}

// Display error message
{error && (
  <div role="alert" className="bg-red-50 text-red-800 p-4 rounded-lg">
    <p>{error}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
)}
```

### Dependencies
- Phase 1 must be complete

### Risks
- **Low:** Well-defined issues with clear solutions

### Testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)
- Error state testing (simulate API failures)

---

## Phase 3: Enhanced UX (Weeks 3-4) - 60 hours

### Objectives
- Implement high-severity UX improvements
- Add missing features
- Enhance mobile experience

### Success Criteria
- ✅ All high-severity issues resolved
- ✅ Mobile usability score >90%
- ✅ Search/filter functionality improved

### Tasks

#### 3.1 Search Feedback (6 hours)
**File:** [src/components/resources/FiltersBar.tsx](src/components/resources/FiltersBar.tsx)

**Features:**
- Loading spinner during search
- Results count badge
- "No results" message

#### 3.2 Loading Skeletons (8 hours)
**File:** [src/app/blog/page.tsx](src/app/blog/page.tsx)

**Create shared skeleton component:**
```tsx
// src/components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}
```

#### 3.3 Standardize Hover States (6 hours)
**Files:** All card components

**Consistent hover effect:**
```tsx
className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
```

#### 3.4 Focus Trap for Modals (8 hours)
**File:** [src/components/resources/ResourcePreviewModal.tsx](src/components/resources/ResourcePreviewModal.tsx)

**Implement focus trap:**
```tsx
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal() {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  return <div ref={ref}>...</div>;
}
```

#### 3.5 Improved Mobile Filters (10 hours)
**File:** [src/components/resources/FiltersBar.tsx](src/components/resources/FiltersBar.tsx)

**Features:**
- Collapsible filters on mobile
- Touch-friendly controls (44px minimum)
- Sticky behavior that works

#### 3.6 Filter State Persistence (6 hours)
**File:** [src/components/resources/FiltersBar.tsx](src/components/resources/FiltersBar.tsx)

**Persist to sessionStorage:**
```tsx
useEffect(() => {
  const saved = sessionStorage.getItem('resourceFilters');
  if (saved) setFilters(JSON.parse(saved));
}, []);

useEffect(() => {
  sessionStorage.setItem('resourceFilters', JSON.stringify(filters));
}, [filters]);
```

#### 3.7 Breadcrumb Enhancement (6 hours)
**File:** [src/app/resources/[category]/[slug]/page.tsx](src/app/resources/[category]/[slug]/page.tsx)

**Add current resource title:**
```tsx
<Breadcrumb>
  <BreadcrumbItem href="/resources">Resources</BreadcrumbItem>
  <BreadcrumbItem href={`/resources/${category}`}>{category}</BreadcrumbItem>
  <BreadcrumbItem current>{truncate(resource.title, 30)}</BreadcrumbItem>
</Breadcrumb>
```

#### 3.8 Recently Viewed Section (10 hours)
**File:** [src/components/resources/RecentlyViewed.tsx](src/components/resources/RecentlyViewed.tsx) (new)

**Track viewed resources:**
```tsx
// Track viewed resources
useEffect(() => {
  const viewed = JSON.parse(localStorage.getItem('viewedResources') || '[]');
  const updated = [resource, ...viewued.filter(r => r.slug !== resource.slug)].slice(0, 5);
  localStorage.setItem('viewedResources', JSON.stringify(updated));
}, [resource.slug]);
```

### Dependencies
- Phase 2 must be complete

### Risks
- **Medium:** Multiple features may interact unexpectedly
- **Mitigation:** Thorough integration testing

### Testing
- Mobile device testing (iOS, Android)
- Cross-browser testing
- Integration testing for filter persistence

---

## Phase 4: Polish & Optimization (Week 5) - 40 hours

### Objectives
- Resolve medium/low severity issues
- Performance optimization
- Final polish and documentation

### Success Criteria
- ✅ All medium/low issues resolved
- ✅ Lighthouse score >90
- ✅ Zero accessibility violations

### Tasks

#### 4.1 Shared Components (12 hours)
**Files:**
- [src/components/ui/EmptyState.tsx](src/components/ui/EmptyState.tsx) (new)
- [src/components/ui/TextField.tsx](src/components/ui/TextField.tsx) (new)
- [src/components/ui/Select.tsx](src/components/ui/Select.tsx) (new)

#### 4.2 Color Contrast Fixes (8 hours)
**Files:** All components with gray text

**Audit and fix all contrast ratios:**
- Use contrast checker tool
- Replace gray-200/300 with darker variants
- Test on gradient backgrounds

#### 4.3 Touch Target Sizing (6 hours)
**Files:** All interactive components

**Ensure 44px minimum:**
```tsx
<button className="min-h-[44px] min-w-[44px]">
```

#### 4.4 Print Styles (4 hours)
**File:** [src/app/globals.css](src/app/globals.css)

```css
@media print {
  .no-print { display: none; }
  a[href]:after { content: " (" attr(href) ")"; }
}
```

#### 4.5 Performance Optimization (10 hours)
- Lazy load images with next/image
- Code split heavy components
- Optimize bundle size

### Dependencies
- Phase 3 must be complete

### Risks
- **Low:** Polish phase, low risk

### Testing
- Lighthouse audit
- Page speed test
- Final accessibility audit

---

## Phase 5: Documentation & Handoff (Week 6) - 20 hours

### Objectives
- Document all changes
- Create component documentation
- Team handoff

### Success Criteria
- ✅ Complete changelog
- ✅ Component documentation in Storybook
- ✅ Team trained on new patterns

### Tasks

#### 5.1 Changelog (4 hours)
**File:** [docs/CHANGELOG.md](docs/CHANGELOG.md)

Document all changes with issue references.

#### 5.2 Storybook Setup (8 hours)
- Configure Storybook
- Create stories for all components
- Document props and usage

#### 5.3 Design System Docs (4 hours)
**File:** [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)

Complete design system documentation.

#### 5.4 Team Training (4 hours)
- Walkthrough of new components
- Best practices training
- Q&A session

### Dependencies
- Phase 4 must be complete

---

## Rollback Strategy

Each phase creates a git branch. If issues arise:

1. **Identify the breaking change**
2. **Revert to previous phase tag**
3. **Fix the issue in isolation**
4. **Re-test thoroughly**
5. **Re-merge**

**Git Strategy:**
```bash
git checkout -b phase-1-foundation
# ... work ...
git tag phase-1-complete

git checkout -b phase-2-critical-fixes
# ... work ...
git tag phase-2-complete
```

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lighthouse Performance | ? | >90 | Lighthouse audit |
| Lighthouse Accessibility | ~60 | 95+ | Lighthouse audit |
| Design System Coverage | ~30% | 90% | Component audit |
| Mobile Usability | ~65% | 90% | Mobile testing |
| Search Success Rate | ? | 70% | Analytics |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | Medium | Medium | Strict adherence to plan |
| Design conflicts | Low | High | Early design reviews |
| Performance regression | Low | Medium | Performance testing each phase |
| Accessibility regression | Low | High | Continuous a11y testing |

---

## Resources

### Team
- Senior Developer: Implementation lead
- Full-stack Guardian: Quality assurance, review

### Tools
- **Development:** VS Code, Git, npm
- **Testing:** Vitest, Testing Library, axe DevTools
- **Documentation:** Storybook, MDX
- **Communication:** Slack, GitHub Issues

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Document Version:** 1.0.0
**Last Updated:** 2026-03-28
**Next Review:** End of Phase 1
