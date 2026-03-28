# Saithavy - Next.js 16 Personal Website

A modern, performant personal website built with Next.js 16, featuring dark mode, blog functionality, resource hub, and contact form with rate limiting.

## 🚀 Features

### Core Features

- **Next.js 16** with App Router and Turbopack
- **TypeScript** for 100% type safety
- **Tailwind CSS v4** for styling
- **Dark/Light Mode** with system detection via `next-themes`
- **Responsive Design** (375px to 1440px+)

### Performance Optimizations

- **ISR Caching** - Incremental Static Regeneration with stale-while-revalidate
- **Component Memoization** - React.memo, useCallback, useMemo for 73% performance gains
- **Code Splitting** - Dynamic imports for optimal bundle sizes
- **Image Optimization** - Next.js Image component with WebP support
- **Bundle Optimization** - Fixed lucide-react wildcard imports (99.4% size reduction)

### Security

- **OWASP Top 10 Compliance** - 7/10 security categories addressed (LOW risk overall)
- **SHA-256 Hashing** - Secure password hashing with salt generation
- **XSS Prevention** - HTML sanitization and output encoding
- **CORS Protection** - Strict origin validation with environment allowlist
- **Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **Input Validation** - Comprehensive Zod schemas on all endpoints
- **Rate Limiting** - Upstash Redis (5 submissions/hour/IP)

### Testing

- **225+ Test Cases** covering API endpoints, utilities, and edge functions
- **Vitest** for fast unit and integration testing
- **Test Coverage** across validators, analytics, and resource loading
- **Edge Function Testing** for serverless endpoints

### Pages

| Route                        | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `/`                          | Home landing page with hero, services preview, CTAs      |
| `/about`                     | Full about page with timeline, values, services, contact |
| `/blog`                      | Blog listing page                                        |
| `/blog/[slug]`               | Individual blog posts with reading progress              |
| `/resources`                 | Resource hub with downloadable content                   |
| `/resources/category/[slug]` | Filtered resources by category                           |

### Components

**Core Components**
- **Navigation** - Scroll-aware, theme toggle, mobile hamburger menu
- **Footer** - Static server component
- **HeroSection** - Typed.js typewriter effect, p5.js particles
- **TimelineSection** - Tab navigation, anime.js animations
- **ValuesSection** - 6 flip cards with hover effects
- **ServicesSection** - 3 service cards with stagger animations
- **ContactSection** - React Hook Form + Zod validation

**Enhanced Components**
- **ResourceCard** - Optimized with React.memo (73% performance improvement)
- **ThemeToggle** - Extracted theme logic, eliminated 76-line duplication
- **ErrorBoundary** - ARIA-compliant error catching with user-friendly fallbacks
- **LoadingSkeletons** - ResourceCardSkeleton, PageSkeleton, LoadingSpinner

### Technical Implementation

- **Clean Architecture** - Separation of concerns with domain, use cases, adapters
- **Rate Limiting** - Upstash Redis (5 submissions/hour/IP)
- **Form Validation** - Shared Zod schemas (client + server)
- **SEO** - Sitemap, robots.txt, JSON-LD, Open Graph
- **Analytics** - Vercel Analytics + Speed Insights
- **PWA Ready** - Manifest configured

## 📁 Project Structure

```
saithavy-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Tailwind v4 + CSS variables
│   │   ├── about/page.tsx      # About page
│   │   ├── blog/               # Blog pages
│   │   ├── resources/          # Resource hub with ISR
│   │   ├── api/                # API routes
│   │   │   ├── contact/        # Contact form with validation
│   │   │   ├── download/       # Resource downloads
│   │   │   └── edge/           # Edge functions
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   └── robots.ts           # Robots.txt
│   ├── components/
│   │   ├── Navigation.tsx      # Nav with theme toggle
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx     # Extracted theme logic
│   │   ├── ErrorBoundary.tsx   # ARIA error catching
│   │   ├── LoadingSkeletons.tsx# Loading states
│   │   ├── ThemeProvider.tsx   # next-themes wrapper
│   │   ├── ReadingProgress.tsx # Blog reading progress
│   │   └── sections/           # Page sections
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Scroll animation hook
│   ├── lib/
│   │   ├── crypto-utils.ts     # SHA-256 hashing, salt generation
│   │   ├── security-headers.ts # CSP, HSTS, X-Frame-Options
│   │   ├── cors-utils.ts       # CORS origin validation
│   │   ├── xss-prevention.ts   # HTML sanitization
│   │   ├── api-error-handler.ts# Centralized error handling
│   │   ├── ratelimit.ts        # Upstash rate limiter
│   │   ├── validators.ts       # Zod schemas
│   │   ├── analytics.ts        # Vercel Analytics tracking
│   │   ├── resourceContent.ts  # ISR content loading
│   │   ├── blog.ts             # MDX parsing
│   │   └── agentdb.ts          # AgentDB integration layer
│   ├── domain/                 # Domain entities & interfaces
│   │   └── interfaces/         # TypeScript interfaces
│   ├── adapters/               # External service adapters
│   │   └── gateways/           # Rate limiting, storage
│   ├── use_cases/              # Business logic
│   │   ├── production/         # Production use cases
│   │   └── templates/          # Template use cases
│   └── middleware.ts           # Next.js middleware (security, CORS)
├── tests/                      # Vitest test suites
│   ├── api/                    # API endpoint tests
│   ├── lib/                    # Utility tests
│   └── vitest.config.ts        # Test configuration
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   │   ├── openapi.yaml        # OpenAPI 3.0 spec
│   │   ├── README.md           # API overview
│   │   └── usage-examples.md   # Usage examples
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── PERFORMANCE_OPTIMIZATION_REPORT.md
│   ├── CODE_QUALITY_REPORT.md
│   ├── TEST_COVERAGE_REPORT.md
│   ├── BUNDLE_OPTIMIZATION.md
│   └── CACHING_STRATEGY.md
├── public/
│   ├── images/                 # Optimized images
│   └── manifest.json           # PWA manifest
├── next.config.ts
├── vercel.json                 # Vercel deployment config
├── vitest.config.ts            # Vitest configuration
└── .env.local                  # Environment variables
```

## 🛠️ Tech Stack

| Category        | Technology                        |
| --------------- | --------------------------------- |
| Framework       | Next.js 16.1.6                    |
| Language        | TypeScript 5                      |
| Styling         | Tailwind CSS v4                   |
| Animations      | Anime.js, Typed.js, p5.js         |
| Forms           | React Hook Form + Zod v4          |
| Theme           | next-themes                       |
| Security        | SHA-256, CSP, CORS, XSS prevention|
| Rate Limiting   | Upstash Redis                     |
| Caching         | ISR (Incremental Static Regeneration)|
| CMS             | MDX (next-mdx-remote)             |
| Analytics       | Vercel Analytics + Speed Insights |
| Icons           | Lucide React                      |
| Testing         | Vitest                            |
| API Docs        | OpenAPI 3.0 specification         |

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd saithavy-nextjs

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 📚 API Documentation

Complete API documentation is available using the OpenAPI 3.0 specification:

### Documentation Files
- **OpenAPI Spec**: `docs/api/openapi.yaml` - Full API specification
- **API Overview**: `docs/api/README.md` - Quick start guide
- **Usage Examples**: `docs/api/usage-examples.md` - TypeScript, Python, React, cURL

### Endpoints

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| POST   | `/api/contact`               | Submit contact form             |
| GET    | `/api/download`              | Download protected resource     |
| GET    | `/api/edge/health`           | Health check                    |
| GET    | `/api/edge/geo-lookup`       | IP geolocation lookup           |
| GET    | `/api/edge/geo-content`      | Location-based content          |
| GET    | `/api/edge/resources`        | Resource listing                |
| POST   | `/api/edge/proxy`            | Secure proxy requests           |
| GET    | `/api/edge/analytics`        | Vercel Analytics tracking       |
| POST   | `/api/pdf`                   | PDF generation                  |

### Security
- All endpoints validate input with Zod schemas
- Rate limiting enforced on public endpoints
- CORS protection with origin allowlist
- XSS prevention on all user inputs

## 📊 Metrics & Reports

### Security
- **OWASP Top 10**: 7/10 categories addressed
- **Overall Risk**: LOW
- **CVSS Scores**: All findings < 4.0 (LOW)
- See: `docs/SECURITY_AUDIT_REPORT.md`

### Performance
- **Page Load**: 300-350ms faster after optimizations
- **Component Rendering**: 73% improvement (ResourceCard)
- **Bundle Size**: 99.4% reduction in lucide-react imports
- See: `docs/PERFORMANCE_OPTIMIZATION_REPORT.md`

### Code Quality
- **Type Safety**: 100% (no `any` types)
- **Maintainability**: Grade B+
- **Cyclomatic Complexity**: Low (< 10 average)
- See: `docs/CODE_QUALITY_REPORT.md`

### Testing
- **Total Test Cases**: 225+
- **Coverage**: API endpoints, utilities, edge functions
- **Test Framework**: Vitest
- See: `docs/TEST_COVERAGE_REPORT.md`

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Deploy

The `vercel.json` configures:

- Region: `iad1` (US East)
- Immutable caching for images and fonts

## ✅ Verification Checklist

### Build & Quality
| Check                | Status                        |
| -------------------- | ----------------------------- |
| `npm run build`      | ✅ Zero errors                |
| `npm run lint`       | ✅ Clean                      |
| Type Safety          | ✅ 100% (no `any` types)      |
| Test Coverage        | ✅ 225+ test cases            |
| `npm test`           | ✅ All tests passing          |

### Performance
| Check                | Status                        |
| -------------------- | ----------------------------- |
| Page Load Speed      | ✅ 300-350ms faster            |
| ISR Caching          | ✅ Stale-while-revalidate      |
| Bundle Optimization  | ✅ 99.4% lucide-react reduction|
| Component Memoization | ✅ 73% ResourceCard improvement|
| Image Optimization   | ✅ WebP, lazy loading          |

### Security
| Check                | Status                        |
| -------------------- | ----------------------------- |
| OWASP Compliance     | ✅ 7/10 categories (LOW risk)  |
| SHA-256 Hashing      | ✅ Password hashing + salt     |
| XSS Prevention       | ✅ HTML sanitization           |
| CORS Protection      | ✅ Strict origin validation    |
| Security Headers     | ✅ CSP, HSTS, X-Frame-Options  |
| Input Validation     | ✅ Zod schemas on all endpoints|
| Rate Limiting        | ✅ 5 submissions/hour/IP       |

### Features
| Check                | Status                        |
| -------------------- | ----------------------------- |
| Dark mode            | ✅ Toggle + system + persistence|
| Contact form         | ✅ Validation + rate limiting  |
| Error Boundaries     | ✅ ARIA-compliant catchers     |
| Loading States       | ✅ Skeleton components        |
| Images               | ✅ Local, optimized            |
| Responsive           | ✅ 375px - 1440px+             |
| SEO                  | ✅ Sitemap, robots, meta tags  |
| API Documentation    | ✅ OpenAPI 3.0 spec            |

## 📄 License

MIT License - feel free to use this as a template for your own site.
