# Master Design System - Saithavy

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing](#spacing-system)
5. [Component Library](#component-library)
6. [Layout Standards](#layout-standards)
7. [Accessibility](#accessibility-standards)
8. [Animation & Interaction](#animation--interaction)
9. [Dark Mode](#dark-mode)
10. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

**Core Principles:**
- **Holistic Growth**: Design supports personal and professional development
- **Consistency**: Unified visual language across all touchpoints
- **Accessibility**: WCAG AA compliance as baseline
- **Performance**: Fast, responsive, mobile-first
- **Clarity**: Clear visual hierarchy and intuitive interactions

**Technical Stack:**
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS + CSS Variables
- Icons: Lucide React
- Fonts: Poppins, Roboto, Playfair Display (Google Fonts)

---

## Color System

### Brand Colors

| Name | Hex | Usage | Contrast (White) |
|------|-----|-------|------------------|
| Terracotta | `#E07A5F` | Primary actions, links | 4.5:1 ✓ |
| Navy | `#1B263B` | Headings, backgrounds | 12.6:1 ✓ |
| Sage | `#A8DADC` | Accents, highlights | 2.8:1 ✗ (dark text) |

### Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| Purple | `#7B2CBF` | Secondary accent |
| Emerald | `#10B981` | Success states |
| Orange | `#F59E0B` | Warning states |
| Rose | `#EF4444` | Error states |

### Semantic Colors

```css
/* Success */
--color-success: #10B981;
--color-success-bg: #D1FAE5;
--color-success-border: #34D399;

/* Warning */
--color-warning: #F59E0B;
--color-warning-bg: #FEF3C7;
--color-warning-border: #FBBF24;

/* Error */
--color-error: #EF4444;
--color-error-bg: #FEE2E2;
--color-error-border: #F87171;

/* Info */
--color-info: #3B82F6;
--color-info-bg: #DBEAFE;
--color-info-border: #60A5FA;
```

### Neutral Colors

```css
/* Text */
--color-text-primary: #1A365D;   /* 12.6:1 on white */
--color-text-secondary: #4A5568; /* 7.5:1 on white */
--color-text-tertiary: #718096;   /* 4.5:1 on white */
--color-text-inverse: #FFFFFF;

/* Backgrounds */
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #F9FAFB;
--color-bg-tertiary: #F3F4F6;
--color-bg-overlay: rgba(0, 0, 0, 0.5);

/* Borders */
--color-border-default: #E5E7EB;
--color-border-strong: #D1D5DB;
--color-border-subtle: #F3F4F6;
```

---

## Typography

### Font Families

```css
--font-display: 'Poppins', sans-serif;
--font-body: 'Roboto', sans-serif;
--font-accent: 'Playfair Display', serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 48px | 700 | 1.25 | Page titles |
| H2 | 40px | 600 | 1.25 | Section titles |
| H3 | 32px | 600 | 1.25 | Card titles |
| H4 | 24px | 600 | 1.25 | Subsection titles |
| H5 | 20px | 500 | 1.5 | Component titles |
| H6 | 16px | 500 | 1.5 | Small titles |

### Body Text

| Variant | Size | Line Height | Usage |
|---------|------|-------------|-------|
| Large | 18px | 1.5 | Lead paragraphs |
| Base | 16px | 1.5 | Body text |
| Small | 14px | 1.5 | Secondary text |
| XSmall | 12px | 1.5 | Captions, labels |

---

## Spacing System

### 8-Point Grid

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Usage Guidelines

| Context | Spacing |
|---------|---------|
| Button padding | 12px 24px (--space-3, --space-6) |
| Card padding | 24px (--space-6) |
| Section spacing | 80px (--space-20) |
| Component gaps | 16px (--space-4) |

---

## Component Library

### Button

**Variants:** primary, secondary, outline, ghost
**Sizes:** sm, md, lg
**States:** default, hover, active, disabled, focus

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Specifications:**
- Border radius: 8px
- Font weight: 500 (medium), 600 (semibold)
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Focus ring: 2px solid primary color, 2px offset

### Card

**Types:** standard, interactive, featured
**Sections:** header, content, footer

```tsx
interface CardProps {
  variant?: 'standard' | 'interactive' | 'featured';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Specifications:**
- Border radius: 12px (standard), 16px (featured)
- Shadow: md (standard), lg (hover)
- Hover lift: -4px translate, 200ms transition

### Badge

**Variants:** default, primary, secondary, success, warning, error, info, outline, ghost

```tsx
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

### Form Elements

**Input, Select, Checkbox, Radio** with states:
- default, focus, error, disabled
- Label positioning
- Helper text
- Error messages

---

## Layout Standards

### Container Widths

| Name | Max Width | Padding |
|------|-----------|---------|
| xs | 100% | 16px |
| sm | 640px | 16px |
| md | 768px | 24px |
| lg | 1024px | 24px |
| xl | 1280px | 32px |
| 2xl | 1536px | 32px |

### Grid System

12-column grid with responsive breakpoints:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large: 4 columns

### Responsive Breakpoints

| Name | Width | Devices |
|------|-------|---------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

---

## Accessibility Standards

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Touch Targets

Minimum 44x44px for all interactive elements.

### Color Contrast

- Normal text: 4.5:1 minimum (AA)
- Large text (18px+): 3:1 minimum (AA)
- UI components: 3:1 minimum (AA)

### Screen Reader Support

- Semantic HTML elements
- ARIA labels for icon-only buttons
- Live regions for dynamic content
- Skip navigation link

---

## Animation & Interaction

### Principles

1. **Purposeful**: Animations serve a function
2. **Natural**: Follows real-world physics
3. **Subtle**: Doesn't distract from content

### Transition Timing

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations

| Interaction | Effect | Duration |
|-------------|--------|----------|
| Button hover | Subtle lift | 200ms |
| Card hover | Lift + shadow | 200ms |
| Modal open | Fade + scale | 300ms |
| Page load | Fade in | 500ms |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode

### Color Palette

```css
.dark {
  --color-text-primary: #F7FAFC;
  --color-text-secondary: #E2E8F0;
  --color-text-tertiary: #CBD5E0;
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #334155;
  --color-border-default: #334155;
  --color-border-strong: #475569;
}
```

### Best Practices

- Don't invert colors (maintain brand identity)
- Maintain 4.5:1 contrast ratios
- Test on actual dark backgrounds
- Provide user-controlled toggle

---

## Implementation Guide

### Phase 1: Foundation (Week 1)

1. **Add Design Tokens to globals.css**
   ```css
   :root {
     /* Colors, typography, spacing, etc. */
   }
   ```

2. **Create Base Components**
   - `src/components/ui/Button.tsx`
   - `src/components/ui/Card.tsx`
   - `src/components/ui/Badge.tsx`

3. **Setup Accessibility**
   - Add focus-visible styles
   - Add skip navigation
   - Configure ARIA labels

### Phase 2: Migration (Weeks 2-3)

1. **Update existing components** to use design tokens
2. **Replace hardcoded values** with CSS variables
3. **Test accessibility** with axe DevTools

### Phase 3: Enhancement (Weeks 4-5)

1. **Add missing components** (skeletons, empty states)
2. **Implement dark mode** with next-themes
3. **Add animations** and transitions

### Phase 4: Documentation (Week 6)

1. **Create Storybook** for components
2. **Document usage examples**
3. **Create design system page**

---

## Maintenance

### Versioning

- Major version: Breaking changes
- Minor version: New features, backward compatible
- Patch version: Bug fixes

### Testing

- Visual regression tests (Chromatic)
- Accessibility tests (axe-core)
- Unit tests (Vitest)

### Resources

- **Design Tools**: Figma, Sketch
- **Development Tools**: Storybook, Chromatic
- **Accessibility Tools**: axe DevTools, Lighthouse, WAVE

---

**Document Version:** 1.0.0
**Last Updated:** 2026-03-28
**Maintained By:** Design System Team
