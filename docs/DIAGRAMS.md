# Architecture Diagrams - Saithavy Next.js

**Version**: 1.0.0
**Last Updated**: 2025-01-16

This document contains comprehensive architecture diagrams for the Saithavy website.

---

## Table of Contents

1. [System Context Diagram](#system-context-diagram)
2. [Container Architecture](#container-architecture)
3. [Component Architecture](#component-architecture)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Deployment Architecture](#deployment-architecture)
6. [Security Architecture](#security-architecture)

---

## System Context Diagram

```mermaid
C4Context
    title "Saithavy Website - System Context"

    Person(user, "Website Visitor", "A person interested in remote work, AI automation, or mindful leadership")

    System(saithavy, "Saithavy Website", "Personal brand website with blog, resources, and contact form")

    System_Ext(upstash, "Upstash Redis", "Rate limiting service (5 req/hour per IP)")
    System_Ext(supabase, "Supabase", "Cloud database (future - contact storage)")
    System_Ext(vercel, "Vercel", "Hosting platform with edge network and analytics")
    System_Ext(google, "Google", "Search engine for SEO indexing")

    Rel(user, saithavy, "Views blog posts", "HTTPS")
    Rel(user, saithavy, "Downloads 62 resources", "HTTPS")
    Rel(user, saithavy, "Submits contact form", "HTTPS")
    Rel(user, saithavy, "Toggles dark/light mode", "JavaScript")

    Rel(saithavy, upstash, "Check rate limits", "REST API")
    Rel(saithavy, supabase, "Stores contact submissions", "PostgreSQL (future)")
    Rel(saithavy, vercel, "Hosted on", "Edge Deployment")
    Rel(saithavy, vercel, "Sends analytics", "SDK")
    Rel(google, saithavy, "Crawls for SEO", "HTTPS")
```

**Key Stakeholders**:
- **Website Visitor**: End user consuming content
- **Site Owner**: Content creator and administrator

**External Systems**:
- **Upstash Redis**: Distributed rate limiting
- **Supabase**: Future database for contact storage
- **Vercel**: Hosting and analytics platform
- **Google**: Search indexing

---

## Container Architecture

```mermaid
C4Container
    title "Container Architecture - Detailed View"

    Person(user, "Website Visitor")

    Container(web, "Next.js Application", "Next.js 16 with App Router", "
        Server-rendered website with:
        - Static Site Generation (SSG)
        - Incremental Static Regeneration (ISR)
        - Server Components
        - API Routes
    ")

    ContainerDb(redis, "Rate Limit Cache", "Upstash Redis", "
        Distributed Redis cache:
        - Stores rate limit counters
        - 1-hour TTL
        - Edge-optimized
    ")

    ContainerDb(db, "Contact Database", "Supabase PostgreSQL", "
        Cloud database (future):
        - Contact form submissions
        - Email leads
        - Download tracking
    ")

    Container(analytics, "Analytics Platform", "Vercel Analytics", "
        Web analytics:
        - Page views
        - Custom events
        - Core Web Vitals
    ")

    Rel(user, web, "View pages", "HTTPS")
    Rel(user, web, "Submit contact form", "POST /api/contact")
    Rel(user, web, "Download resources", "POST /api/download")

    Rel(web, redis, "Check/increment rate limit", "REST API")
    Rel(web, db, "Store contact data", "PostgreSQL (future)")
    Rel(web, analytics, "Track page views", "JavaScript SDK")
    Rel(web, analytics, "Track events", "JavaScript SDK")
```

**Technology Stack**:
- **Web Framework**: Next.js 16.1.6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Rate Limiting**: Upstash Redis
- **Database**: Supabase PostgreSQL (future)
- **Analytics**: Vercel Analytics + Speed Insights

---

## Component Architecture

### Contact Form Flow

```mermaid
C4Component
    title "Contact Form - Component Architecture"

    Container(spa, "Next.js Application")

    Component(ui, "ContactSection", "React Component", "
        Contact form UI with:
        - Form fields (firstName, lastName, email, message)
        - Client-side validation
        - Error handling
        - Loading states
    ")

    Component(api, "Contact API Route", "Next.js API Route", "
        HTTP endpoint handler:
        - Parse request body
        - Extract IP from headers
        - Return HTTP response
    ")

    Component(usecase, "SubmitContactUseCase", "Use Case", "
        Business logic orchestrator:
        - Rate limit check
        - Input validation
        - Spam detection (honeypot)
        - Entity creation
        - Persistence
    ")

    Component(ratelimiter, "UpstashRateLimiterAdapter", "Adapter", "
        Rate limiting implementation:
        - Redis INCR command
        - TTL expiration
        - Counter reset logic
    ")

    Component(validator, "contactSchema", "Zod Schema", "
        Input validation:
        - Type checking
        - Format validation
        - Required fields
    ")

    Component(repo, "LoggerContactRepository", "Repository", "
        Data persistence:
        - Console logging
        - Future: Database storage
    ")

    Rel(ui, api, "POST /api/contact", "HTTP JSON")
    Rel(api, usecase, "execute({ip, body})", "TypeScript")
    Rel(usecase, ratelimiter, "checkLimit(ip)", "Promise<RateLimitResult>")
    Rel(usecase, validator, "safeParse(body)", "ValidationResult")
    Rel(usecase, repo, "save(contact)", "Promise<void>")
```

### Resource Download Flow

```mermaid
C4Component
    title "Resource Download - Component Architecture"

    Container(spa, "Next.js Application")

    Component(modal, "ResourceDownloadModal", "React Component", "
        Download modal with:
        - 3 format options (PDF/Web/Print)
        - Email capture (firstName, email)
        - Client-side validation
        - Loading states
    ")

    Component(api, "Download API Route", "Next.js API Route", "
        HTTP endpoint handler:
        - Rate limit enforcement
        - Request validation
        - Download tracking
    ")

    Component(didi, "DI Container", "Dependency Injection", "
        Service resolution:
        - Rate limiter resolution
        - Singleton lifecycle
    ")

    Component(ratelimiter, "RateLimiter", "Interface", "
        Rate limiting contract:
        - checkLimit(ip) method
        - Return RateLimitResult
    ")

    Component(upstash, "UpstashAdapter", "Adapter", "
        Upstash implementation:
        - Redis client
        - INCR command
        - EXPIRE command
    ")

    Component(zod, "downloadSchema", "Zod Schema", "
        Request validation:
        - email format
        - resourceId required
        - format enum
    ")

    Component(analytics, "Analytics", "Analytics", "
        Event tracking:
        - GA4
        - Facebook Pixel
        - Google Tag Manager
    ")

    Rel(modal, api, "POST /api/download", "HTTP JSON")
    Rel(api, didi, "resolveRateLimiter()", "Symbol key")
    Rel(didi, upstash, "resolve()", "Factory function")
    Rel(api, zod, "safeParse(body)", "ValidationResult")
    Rel(api, upstash, "checkLimit(ip)", "Promise")
    Rel(modal, analytics, "trackEvent()", "JavaScript")
```

---

## Data Flow Diagrams

### Contact Form Submission

```mermaid
sequenceDiagram
    actor User
    participant UI as ContactSection
    participant API as /api/contact
    participant UseCase as SubmitContactUseCase
    participant RateLimiter as UpstashRateLimiter
    participant Validator as contactSchema
    participant Repo as ContactRepository
    participant Redis as Upstash Redis
    participant Log as Console

    User->>UI: Fill form and submit
    UI->>UI: Client-side validation
    UI->>API: POST /api/contact {firstName, lastName, email, message, honeypot}

    API->>API: Extract IP from headers (x-forwarded-for, x-real-ip)
    API->>UseCase: execute({ip, body})

    UseCase->>RateLimiter: checkLimit(ip)
    RateLimiter->>Redis: INCR ratelimit:contact:192.168.1.1
    Redis-->>RateLimiter: 1
    RateLimiter->>Redis: EXPIRE ratelimit:contact:192.168.1.1 3600
    RateLimiter-->>UseCase: {success: true, remaining: 4, reset: 1642357200}

    UseCase->>Validator: safeParse(body)
    Validator-->>UseCase: {success: true, data: {...}}

    UseCase->>UseCase: Check honeypot field (spam detection)
    UseCase->>Repo: save(contact)
    Repo->>Log: console.log(contact)
    Log-->>Repo: void
    Repo-->>UseCase: void

    UseCase-->>API: {success: true, rateLimitInfo, statusCode: 200}
    API-->>UI: JSON Response
    UI-->>User: Show success message
```

### Resource Download with Email Capture

```mermaid
sequenceDiagram
    actor User
    participant UI as ResourceDownloadModal
    participant API as /api/download
    participant RateLimiter as DI Container
    participant Validator as Zod Schema
    participant Analytics as GA4/GTM
    participant Redis as Upstash Redis

    User->>UI: Click "PDF Download" button
    UI->>UI: Check if email is provided
    UI->>UI: Validate email format (client-side)
    UI->>API: POST /api/download {email, resourceId: "1", format: "pdf", firstName}

    API->>API: Extract IP from headers
    API->>RateLimiter: resolveRateLimiter()
    RateLimiter-->>API: UpstashRateLimiterAdapter instance
    API->>RateLimiter: checkLimit(ip)
    RateLimiter->>Redis: INCR ratelimit:download:192.168.1.1
    Redis-->>RateLimiter: 2
    RateLimiter-->>API: {success: true, remaining: 3}

    API->>Validator: safeParse(body)
    Validator-->>API: {success: true, data: {...}}

    API->>Analytics: trackResourceDownload(resourceId, title, format)
    Analytics-->>API: void

    API-->>UI: {success: true, downloadUrl: "/resources/.../download?format=pdf"}
    UI->>Analytics: trackEmailSignup('resource_download', resourceId)
    Analytics-->>UI: void
    UI-->>User: Trigger file download
```

### Static Site Generation Build Process

```mermaid
flowchart TD
    A[Build Start] --> B[next build]
    B --> C[Next.js Build Process]

    C --> D[Generate Static Params]
    D --> E[resourcesData.ts - 62 resources]
    E --> F[Create route params: {category, slug}]

    F --> G[For each resource...]
    G --> H[Fetch markdown content]
    H --> I[Parse frontmatter]
    I --> J[Generate metadata]
    J --> K[Render Server Component]
    K --> L[Generate static HTML]

    L --> M[Optimize assets]
    M --> N[Minify JavaScript]
    N --> O[Optimize images]
    O --> P[Generate CSS]

    P --> Q[Build output: .next/]
    Q --> R[Public: static files]

    R --> S[Deployment Ready]

    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style F fill:#fff3e0
```

---

## Deployment Architecture

```mermaid
flowchart TB
    subgraph "Development"
        Dev[Developer Machine]
        Local[Local Development<br/>localhost:3000]
        Dev -->|git push| Local
    end

    subgraph "CI/CD"
        GitHub[GitHub Repository]
        VercelCI[Vercel CI/CD Pipeline]
        Build[Build Step<br/>npm run build]
        Deploy[Deploy to Edge]
        GitHub --> VercelCI
        VercelCI --> Build
        Build --> Deploy
    end

    subgraph "Production"
        Edge[Vercel Edge Network<br/>Global CDN]
        CDN[Static Assets<br/>JS, CSS, Images]
        Functions[Serverless Functions<br/>API Routes]
        KV[Upstash Redis<br/>Rate Limiting]
        DB[Supabase PostgreSQL<br/>Future Database]
        Analytics[Vercel Analytics<br/>Page Views & Events]
    end

    subgraph "User"
        User[Website Visitor]
        Browser[Web Browser]
    end

    Deploy --> Edge
    Edge --> CDN
    Edge --> Functions
    Functions --> KV
    Functions --> DB
    Edge --> Analytics
    User --> Browser
    Browser --> Edge

    style Dev fill:#e3f2fd
    style User fill:#fff3e0
    style Edge fill:#c8e6c9
```

### Infrastructure Layers

| Layer | Service | Purpose | Region |
|-------|---------|---------|--------|
| **CDN** | Vercel Edge Network | Static asset delivery | Global |
| **Compute** | Vercel Serverless Functions | API routes, SSR | us-east-1 |
| **Cache** | Upstash Redis | Rate limiting | Global |
| **Database** | Supabase PostgreSQL | Contact storage | us-east-1 |
| **Analytics** | Vercel Analytics | Page views, events | Global |

---

## Security Architecture

```mermaid
flowchart TB
    subgraph "Edge Security"
        TLS[TLS 1.3 Encryption]
        HTTPS[HTTPS Only]
        CORS[CORS Policy]
    end

    subgraph "Application Security"
        RateLimit[Rate Limiting<br/>5 req/hour per IP]
        Validation[Zod Validation<br/>Type-safe schemas]
        Sanitization[Input Sanitization<br/>XSS prevention]
        CSRF[CSRF Protection<br/>SameSite cookies]
    end

    subgraph "Business Logic Security"
        Honeypot[Honeypot Field<br/>Spam detection]
        SilentRejection[Silent Rejection<br/>Don't tip off bots]
        MinPII[Minimal PII<br/>No passwords]
    end

    subgraph "Data Security"
        EnvVars[Environment Variables<br/>No secrets in code]
        Logging[Audit Logging<br/>All submissions]
        Encryption[Data Encryption<br/>At rest and transit]
    end

    User[User Request] --> TLS
    TLS --> HTTPS
    HTTPS --> RateLimit
    RateLimit --> Validation
    Validation --> Sanitization
    Sanitization --> Honeypot
    Honeypot --> SilentRejection
    Validation --> MinPII
    SilentRejection --> EnvVars
    EnvVars --> Logging
    Logging --> Encryption

    style User fill:#e3f2fd
    style Encryption fill:#c8e6c9
```

### Security Layers Detail

| Layer | Protection | Implementation |
|-------|-------------|----------------|
| **Network** | TLS 1.3 | Vercel automatic HTTPS |
| **Edge** | DDoS Protection | Vercel edge network |
| **Application** | Rate Limiting | Upstash Redis, 5 req/hour |
| **Input** | Validation | Zod schemas, type-safe |
| **Output** | XSS Prevention | React auto-escaping |
| **Forms** | CSRF Protection | SameSite cookies |
| **Spam** | Honeypot | Silent rejection |
| **Data** | Minimal PII | No passwords, minimal data |

---

## Performance Architecture

```mermaid
flowchart LR
    subgraph "Performance Optimization"
        SSG[Static Site Generation<br/>Pre-render at build time]
        ISR[Incremental Static Regeneration<br/>Update without rebuild]
        CodeSplit[Code Splitting<br/>Automatic route splitting]
        LazyLoad[Lazy Loading<br/>Components and images]
        Cache[Edge Caching<br/>Vercel CDN]
    end

    subgraph "Asset Optimization"
        Images[Image Optimization<br/>next/image]
        Fonts[Font Optimization<br/>next/font]
        CSS[CSS Optimization<br/>Tailwind CSS]
        JS[JavaScript Minification<br/>Terser]
    end

    subgraph "Core Web Vitals"
        FCP[First Contentful Paint<br/>Target: <1.8s]
        LCP[Largest Contentful Paint<br/>Target: <2.5s]
        TBT[Total Blocking Time<br/>Target: <200ms]
        CLS[Cumulative Layout Shift<br/>Target: <0.1]
        TTI[Time to Interactive<br/>Target: <3.8s]
    end

    SSG --> FCP
    ISR --> LCP
    CodeSplit --> TBT
    LazyLoad --> CLS
    Cache --> TTI
    Images --> LCP
    Fonts --> FCP
    CSS --> TBT
    JS --> TBT

    style SSG fill:#e1f5fe
    style FCP fill:#c8e6c9
    style LCP fill:#c8e6c9
    style TBT fill:#c8e6c9
    style CLS fill:#c8e6c9
    style TTI fill:#c8e6c9
```

---

## Glossary

| Term | Definition |
|------|------------|
| **SSG** | Static Site Generation - Pre-rendering pages at build time |
| **ISR** | Incremental Static Regeneration - Update static pages without rebuild |
| **DI** | Dependency Injection - Pattern for injecting dependencies |
| **DDD** | Domain-Driven Design - Architectural pattern focused on domain logic |
| **C4 Model** | Context, Containers, Components, Code - Diagramming model |
| **Zod** | TypeScript-first schema validation library |
| **Upstash** | Serverless Redis-compatible data platform |

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-16
**Maintained By**: Development Team
