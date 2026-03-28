# Resource System Testing Plan

## Overview
Comprehensive testing plan for the migrated resource system with 18 resources across 6 categories.

## Test Environment
- **Node Version**: v20+
- **Framework**: Next.js 15 (App Router)
- **Testing Framework**: Vitest + Playwright
- **Target Browsers**: Chrome, Firefox, Safari, Edge
- **Viewports**: Mobile (375px), Tablet (768px), Desktop (1920px)

## Test Categories

### 1. Resource Data Integrity Tests

#### 1.1 Resource Count Verification
- **Test**: Verify total resource count
- **Expected**: 18 resources total
- **Method**: Count items in resourcesData.tsx

#### 1.2 Category Distribution
- **Test**: Verify resources per category
- **Expected Distribution**:
  - Leadership: 3 resources
  - Team Management: 3 resources
  - Productivity: 3 resources
  - Communication: 3 resources
  - Templates: 3 resources
  - Assessments: 3 resources

#### 1.3 Required Fields Validation
- **Test**: All resources have required fields
- **Required Fields**:
  - id (string, unique)
  - title (string)
  - description (string)
  - category (string, valid category)
  - type (string)
  - icon (ReactNode)
  - url (string)
  - fileSize (string)
  - difficulty (string)
  - timeToRead (string)
  - targetAudience (string)
  - whatYoullLearn (array, min 3 items)
  - featured (boolean)
  - downloads (number)

#### 1.4 URL Accessibility
- **Test**: All resource URLs are accessible
- **Method**: HEAD request to each URL
- **Expected**: 200 OK or valid redirect

### 2. Page Rendering Tests

#### 2.1 Main Resources Page (`/resources`)
- **Test**: Page renders without errors
- **Expected Elements**:
  - Header with "Resource Hub" title
  - Stats display (Resources, Downloads, Categories)
  - Featured Resources section (3 items)
  - Category Filter
  - Resources Grid (all 18 resources)
  - Premium Upgrade Teaser
  - JSON-LD structured data

#### 2.2 Category Pages (`/resources/category/[slug]`)
- **Test**: Each category page renders correctly
- **Pages to Test**:
  - /resources/category/leadership
  - /resources/category/team-management
  - /resources/category/productivity
  - /resources/category/communication
  - /resources/category/templates
  - /resources/category/assessments

- **Expected Elements**:
  - Category-specific title
  - Filtered resources (3 per category)
  - Active category highlighted
  - JSON-LD structured data

#### 2.3 SSG Generation
- **Test**: Static generation works for all routes
- **Method**: Check build output
- **Expected**:
  - /resources (index)
  - /resources/category/[slug] (6 pages)

### 3. Component Tests

#### 3.1 ResourceCard Component
- **Test Cases**:
  - Renders correctly with all props
  - Expand/collapse functionality
  - Premium badge shows when isPremium=true
  - Download button triggers modal for premium
  - Download link works for free resources
  - Hover effects work
  - Responsive layout

#### 3.2 CategoryFilter Component
- **Test Cases**:
  - All categories render
  - Active category highlighted
  - Click navigates to correct page
  - Resource counts display correctly
  - Responsive layout

#### 3.3 DownloadModal Component
- **Test Cases**:
  - Modal opens on premium resource click
  - Modal closes on X button click
  - Modal closes on backdrop click
  - Form validation works (firstName required, email required)
  - Form submission shows loading state
  - Form submission shows success state
  - Download triggers after success
  - Accessibility: focus trap, ESC to close

#### 3.4 ResourcesLayout Component
- **Test Cases**:
  - Renders all sections correctly
  - Props pass through correctly
  - Stats calculate correctly
  - Featured section hides on category pages

### 4. SEO & Metadata Tests

#### 4.1 Page Titles
- **Test**: Each page has correct title
- **Expected**:
  - Main: "Resource Hub | Saithavy"
  - Category: "{Category} Resources - Free Downloads | Saithavy"

#### 4.2 Meta Descriptions
- **Test**: Each page has unique description
- **Expected**: 120-160 characters

#### 4.3 Open Graph Tags
- **Test**: OG tags present and correct
- **Tags**: title, description

#### 4.4 JSON-LD Structured Data
- **Test**: Valid JSON-LD on all pages
- **Expected**:
  - @context: https://schema.org
  - @type: CollectionPage
  - Required fields present

#### 4.5 Canonical URLs
- **Test**: Canonical tags present
- **Expected**: Self-referencing canonical

### 5. Analytics Tests

#### 5.1 Event Tracking
- **Test Events**:
  - resource_download (with format)
  - email_signup
  - resource_view
  - cta_click
  - page_view

- **Method**: Mock window.gtag and verify calls

#### 5.2 GA4 Integration
- **Test**: Events push to dataLayer
- **Method**: Verify dataLayer.push() calls

### 6. Accessibility Tests (WCAG 2.1 AA)

#### 6.1 Keyboard Navigation
- **Test**: All interactive elements accessible via keyboard
- **Expected**:
  - Tab order logical
  - Focus indicators visible
  - Enter/Space activate buttons
  - ESC closes modals

#### 6.2 Screen Reader Compatibility
- **Test**: Screen reader announces correctly
- **Tools**: NVDA (Windows), VoiceOver (Mac)
- **Expected**:
  - Buttons announced as buttons
  - Links announced as links
  - Form labels associated with inputs
  - Modal announced as dialog

#### 6.3 Color Contrast
- **Test**: All text meets WCAG AA ratios
- **Expected**:
  - Normal text: 4.5:1
  - Large text: 3:1
  - UI components: 3:1

#### 6.4 ARIA Attributes
- **Test**: Proper ARIA labels and roles
- **Expected**:
  - aria-label on icon-only buttons
  - aria-expanded on expandable content
  - role="dialog" on modal
  - aria-modal="true"

### 7. Performance Tests

#### 7.1 Core Web Vitals
- **Targets**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

#### 7.2 Build Performance
- **Test**: Build time acceptable
- **Expected**: <5 minutes for full build

#### 7.3 Bundle Size
- **Test**: JavaScript bundle size
- **Expected**: <200KB gzipped (vendor + main)

#### 7.4 Image Optimization
- **Test**: Images use Next.js Image component
- **Expected**: All images optimized

### 8. Cross-Browser Tests

#### 8.1 Browser Compatibility
- **Browsers**:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

- **Test**: Visual consistency and functionality

#### 8.2 Mobile Browsers
- **Test**: iOS Safari, Android Chrome
- **Expected**: Touch interactions work

### 9. Error Handling Tests

#### 9.1 Invalid Category
- **Test**: Access /resources/category/invalid
- **Expected**: 404 page

#### 9.2 Missing Resource
- **Test**: Resource with broken URL
- **Expected**: Graceful error handling

#### 9.3 Form Errors
- **Test**: Submit with invalid email
- **Expected**: Validation error shows

#### 9.4 Network Errors
- **Test**: Network failure during download
- **Expected**: Error message shows

### 10. Edge Cases

#### 10.1 Empty Category
- **Test**: Category with no resources
- **Expected**: "No resources found" message

#### 10.2 Long Titles
- **Test**: Resource with very long title
- **Expected**: Truncates gracefully

#### 10.3 Special Characters
- **Test**: Special chars in titles/descriptions
- **Expected**: Renders correctly, no XSS

#### 10.4 Concurrent Downloads
- **Test**: Multiple downloads at once
- **Expected**: All downloads work

### 11. Integration Tests

#### 11.1 User Flow: Browse Resources
1. Navigate to /resources
2. View all resources
3. Click category filter
4. View filtered resources
5. Click back to all resources

#### 11.2 User Flow: Download Premium Resource
1. Navigate to /resources
2. Find premium resource
3. Click download button
4. Modal opens
5. Enter firstName and email
6. Submit form
7. Success message shows
8. Download starts

#### 11.3 User Flow: Download Free Resource
1. Navigate to /resources
2. Find free resource
3. Click download button
4. Download starts directly

### 12. Security Tests

#### 12.1 XSS Prevention
- **Test**: Inject scripts in user input
- **Expected**: Scripts sanitized

#### 12.2 CSRF Protection
- **Test**: Form submission has CSRF token
- **Expected**: Token validated

#### 12.3 Email Validation
- **Test**: Various email formats
- **Expected**: Invalid emails rejected

### 13. Manual Testing Checklist

#### Visual Testing
- [ ] Layout consistent across breakpoints
- [ ] Colors match design system
- [ ] Icons render correctly
- [ ] Animations smooth
- [ ] No visual glitches

#### Functional Testing
- [ ] All links work
- [ ] All buttons clickable
- [ ] Forms validate correctly
- [ ] Modals open/close properly
- [ ] Downloads complete successfully

#### Content Testing
- [ ] All 18 resources visible
- [ ] Titles spelled correctly
- [ ] Descriptions accurate
- [ ] Categories correct
- [ ] Stats accurate

## Test Execution Priority

### P0 (Critical - Must Pass)
- Resource count and data integrity
- Page rendering without errors
- SSG generation
- Build succeeds
- No console errors

### P1 (High - Should Pass)
- SEO metadata correct
- Analytics events fire
- Accessibility (keyboard nav)
- Core functionality works
- No console warnings

### P2 (Medium - Nice to Have)
- Cross-browser testing
- Performance optimization
- Edge case handling
- Advanced accessibility

### P3 (Low - Future Enhancement)
- Load testing
- Stress testing
- Advanced security testing

## Success Criteria

### Must Have (P0)
- All 18 resources accessible
- All pages render without errors
- Build succeeds
- No console errors
- SEO metadata present

### Should Have (P1)
- Lighthouse Performance >90
- Lighthouse Accessibility >90
- Lighthouse SEO >90
- All P1 tests pass

### Nice to Have (P2)
- Lighthouse Score =100
- All edge cases handled
- Perfect cross-browser support

## Test Reporting

### Bug Severity
- **Critical**: Blocks all users
- **High**: Affects many users
- **Medium**: Affects some users
- **Low**: Minor issues

### Test Result Format
```
Test ID: TC-001
Name: Resource count verification
Priority: P0
Status: PASS/FAIL
Expected: 18 resources
Actual: 18 resources
Notes: None
```

## Continuous Testing

### Pre-Commit
- Run linter
- Run unit tests
- Type checking

### Pre-Merge
- Full test suite
- Build verification
- Manual smoke test

### Pre-Production
- Full regression test
- Performance audit
- Security scan
- Cross-browser test
