# Saithavy - Next.js 16 Personal Website

A modern, performant personal website built with Next.js 16, featuring dark mode, blog functionality, resource hub, and contact form with rate limiting.

## 🚀 Features

### Core Features

- **Next.js 16** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Dark/Light Mode** with system detection via `next-themes`
- **Responsive Design** (375px to 1440px+)

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

- **Navigation** - Scroll-aware, theme toggle, mobile hamburger menu
- **Footer** - Static server component
- **HeroSection** - Typed.js typewriter effect, p5.js particles
- **TimelineSection** - Tab navigation, anime.js animations
- **ValuesSection** - 6 flip cards with hover effects
- **ServicesSection** - 3 service cards with stagger animations
- **ContactSection** - React Hook Form + Zod validation

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
│   │   ├── resources/          # Resource hub
│   │   ├── api/contact/        # Contact API route
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   └── robots.ts           # Robots.txt
│   ├── components/
│   │   ├── Navigation.tsx      # Nav with theme toggle
│   │   ├── Footer.tsx
│   │   ├── ThemeProvider.tsx   # next-themes wrapper
│   │   ├── ReadingProgress.tsx # Blog reading progress
│   │   └── sections/           # Page sections
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Scroll animation hook
│   ├── lib/
│   │   ├── ratelimit.ts        # Upstash rate limiter
│   │   ├── validators.ts       # Zod schemas
│   │   ├── blog.ts             # MDX parsing
│   │   └── resourcesData.tsx   # Resources data
│   ├── domain/                 # Domain entities & interfaces
│   ├── adapters/               # External service adapters
│   └── use_cases/              # Business logic
├── public/
│   ├── images/                 # Optimized images
│   └── manifest.json           # PWA manifest
├── next.config.ts
├── vercel.json                 # Vercel deployment config
└── .env.local                  # Environment variables
```

## 🛠️ Tech Stack

| Category      | Technology                        |
| ------------- | --------------------------------- |
| Framework     | Next.js 16.1.6                    |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS v4                   |
| Animations    | Anime.js, Typed.js, p5.js         |
| Forms         | React Hook Form + Zod             |
| Theme         | next-themes                       |
| Rate Limiting | Upstash Redis                     |
| CMS           | MDX (next-mdx-remote)             |
| Analytics     | Vercel Analytics + Speed Insights |
| Icons         | Lucide React                      |

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

| Check           | Status                                     |
| --------------- | ------------------------------------------ |
| `npm run build` | ✅ Zero errors                             |
| `npm run lint`  | ✅ Clean                                   |
| Dark mode       | ✅ Toggle + system detection + persistence |
| Contact form    | ✅ Validation + rate limiting (5/hr)       |
| Images          | ✅ Local, optimized                        |
| Responsive      | ✅ 375px - 1440px+                         |
| SEO             | ✅ Sitemap, robots, meta tags              |

## 📄 License

MIT License - feel free to use this as a template for your own site.
