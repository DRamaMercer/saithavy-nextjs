# AI_RULES.md

## Tech Stack Overview

- **Framework**: Next.js 16 (App Router, Turbopack) — Full-stack React framework with server-side rendering and static site generation
- **Language**: TypeScript 5 — Type-safe JavaScript for maintainable code
- **Styling**: Tailwind CSS v4 — Utility-first CSS framework with CSS variables for theming
- **Theme Management**: next-themes — Dark/light mode with system detection and persistence
- **Forms**: React Hook Form + Zod — Performant form handling with schema validation
- **Animations**: Typed.js (text), p5.js (particles), anime.js — Lightweight animation libraries
- **Content**: MDX (next-mdx-remote) — Markdown with React components for blog content
- **Icons**: Lucide React — Consistent, lightweight SVG icons
- **Database/Rate Limiting**: Upstash Redis — Serverless Redis for rate limiting contact form
- **Analytics**: Vercel Analytics + Speed Insights — Performance and usage tracking

---

## Library Usage Rules

### Styling & Theming
- **Use Tailwind CSS v4** for all styling — no custom CSS unless for complex animations
- **Use CSS variables** defined in `globals.css` for brand colors (--accent, --heading, --surface, etc.)
- **Use next-themes** for all theme-related functionality — never implement dark mode manually

### Forms & Validation
- **Use React Hook Form** for all form handling — manages form state, submission, and validation
- **Use Zod** for all form validation schemas — define schemas in `src/lib/validators.ts`, share between client and server
- **Never use controlled inputs** (useForm's register) — let RHF handle state management

### Animations & Effects
- **Use Typed.js** for typewriter/typing effects on text
- **Use p5.js** for particle backgrounds and canvas-based visual effects
- **Use anime.js** for complex timeline animations and transitions
- **Avoid Framer Motion** — existing animation libraries cover all needs

### Data Fetching & Content
- **Use Server Components** by default for data fetching — keep client-side JS minimal
- **Use MDX (next-mdx-remote)** for blog posts and markdown content
- **Use gray-matter** for parsing frontmatter in MDX files
- **Use date-fns** for date formatting — lightweight compared to Moment.js

### External Services
- **Use Upstash Redis** for rate limiting — configured in `src/lib/ratelimit.ts`
- **Use Vercel Analytics** for tracking — already integrated in layout.tsx
- **Avoid adding new analytics** unless explicitly requested

### Icons
- **Use Lucide React** for all icons — never use Font Awesome or other icon libraries
- **Import icons directly** from lucide-react (e.g., `import { X } from 'lucide-react'`)

### State Management
- **Avoid global state libraries** (Redux, Zustand) — use React's built-in useState/useContext for local state
- **Use URL state** (searchParams) for filtering — keeps state shareable and bookmarkable

### Type Safety
- **Never use `any`** — define proper TypeScript interfaces for all data structures
- **Keep domain types** in `src/domain/entities/` — separate from UI components

---

## Architecture Patterns

- **Clean Architecture**: Separate domain (entities, interfaces), use cases, and adapters (gateways, repositories)
- **Server Actions**: Prefer Next.js Server Actions over API routes for form submissions when possible
- **Static Generation**: Use `generateStaticParams` for blog posts and resource category pages for SEO