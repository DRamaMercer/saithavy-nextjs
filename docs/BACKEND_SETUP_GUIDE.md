# Backend Setup Guide - Blueprint Migration

This guide covers the complete backend infrastructure for the Blueprint migration project.

## Overview

The backend system includes:
- **Supabase Database**: Lead captures and assessment results storage
- **API Routes**: Next.js API routes for lead capture and assessments
- **Email Service**: Resend integration for confirmation emails
- **Type Safety**: Full TypeScript type definitions

## Architecture

```
┌─────────────┐
│   Client    │
│  (Next.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     API Routes (Next.js)            │
│  ┌──────────────────────────────┐  │
│  │ /api/lead-capture            │  │
│  │ /api/assessment              │  │
│  └──────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Services Layer                  │
│  ┌──────────────┐  ┌─────────────┐ │
│  │  Supabase    │  │   Resend    │ │
│  │  Database    │  │   Email     │ │
│  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────┘
```

## Database Schema

### Lead Captures Table

```sql
CREATE TABLE lead_captures (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  lead_magnet TEXT NOT NULL,
  assessment_score INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Indexes:**
- `email` - For fast lookups by user
- `lead_magnet` - For filtering by magnet type
- `created_at` - For chronological queries

### Assessment Results Table

```sql
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  assessment_type TEXT NOT NULL,
  responses JSONB,
  score INTEGER NOT NULL,
  results JSONB,
  created_at TIMESTAMPTZ
);
```

**Indexes:**
- `email` - For user history
- `assessment_type` - For type filtering
- `score` - For analytics
- `created_at` - For chronological queries

## API Endpoints

### POST /api/lead-capture

**Description:** Captures email leads from lead magnets

**Request Body:**
```json
{
  "email": "user@example.com",
  "lead_magnet": "mindful-leadership",
  "assessment_score": 85,
  "metadata": {
    "utm_source": "twitter",
    "utm_campaign": "launch"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your download link will be sent to your email.",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "lead_magnet": "mindful-leadership",
    "created_at": "2025-03-28T00:00:00Z"
  }
}
```

**Valid Lead Magnets:**
- `mindful-leadership`
- `ai-innovation`
- `resilience-toolkit`
- `remote-work-mastery`
- `personal-transformation`

### GET /api/lead-capture?email=user@example.com

**Description:** Retrieves lead captures by email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "lead_magnet": "mindful-leadership",
      "created_at": "2025-03-28T00:00:00Z"
    }
  ]
}
```

### POST /api/assessment

**Description:** Saves assessment results

**Request Body:**
```json
{
  "email": "user@example.com",
  "assessment_type": "mindful-leadership",
  "responses": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "score": 85,
  "results": {
    "score": 85,
    "level": "Advanced",
    "recommendations": ["Tip 1", "Tip 2"],
    "strengths": ["Strength 1"],
    "areas_for_improvement": ["Area 1"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your assessment has been saved. Your results will be sent to your email.",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "assessment_type": "mindful-leadership",
    "score": 85,
    "created_at": "2025-03-28T00:00:00Z"
  }
}
```

**Valid Assessment Types:**
- `mindful-leadership`
- `ai-readiness`
- `resilience`
- `remote-work`
- `personal-transformation`

### GET /api/assessment?email=user@example.com&type=mindful-leadership

**Description:** Retrieves assessments by email (and optionally type)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "assessment_type": "mindful-leadership",
      "score": 85,
      "created_at": "2025-03-28T00:00:00Z"
    }
  ]
}
```

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Lead Captures:**
- Public insert (anyone can submit their email)
- Service role can read all leads
- Users can read their own leads

**Assessment Results:**
- Public insert (anyone can submit assessment)
- Service role can read all results
- Users can read their own results

### Input Validation

All API endpoints use Zod for runtime validation:
- Email format validation
- Enum validation for lead magnet/assessment types
- Score range validation (0-100)
- Type checking for JSON fields

### Rate Limiting

The existing Upstash rate limiter is used for all endpoints (inherited from contact route).

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `resend` - Email service
- `zod` - Schema validation

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings > API
3. Copy the following:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 3. Run Database Migrations

```bash
# Using Supabase CLI
supabase migration up

# Or manually in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Run each migration file in order:
#    - supabase/migrations/20250328_create_lead_captures_table.sql
#    - supabase/migrations/20250328_create_assessment_results_table.sql
#    - supabase/migrations/20250328_add_rls_policies.sql
```

### 4. Set Up Resend (Optional)

1. Create an account at https://resend.com
2. Verify your sender domain
3. Create an API key
4. Add to environment variables

### 5. Configure Environment Variables

Copy `.env.example.local` to `.env.local`:

```bash
cp .env.example.local .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email Service (optional)
RESEND_API_KEY=re-your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 6. Verify Setup

```bash
# Build the project
npm run build

# Start development server
npm run dev
```

## Testing the API

### Test Lead Capture

```bash
curl -X POST http://localhost:3000/api/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "lead_magnet": "mindful-leadership",
    "assessment_score": 85
  }'
```

### Test Assessment

```bash
curl -X POST http://localhost:3000/api/assessment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "assessment_type": "mindful-leadership",
    "responses": {
      "question1": "answer1"
    },
    "score": 85,
    "results": {
      "score": 85,
      "level": "Advanced"
    }
  }'
```

## File Structure

```
src/
├── app/api/
│   ├── lead-capture/
│   │   └── route.ts              # Lead capture API
│   └── assessment/
│       └── route.ts              # Assessment API
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── email.ts                  # Email service
└── types/
    ├── lead-capture.ts           # Lead capture types
    └── assessment.ts             # Assessment types

supabase/
└── migrations/
    ├── 20250328_create_lead_captures_table.sql
    ├── 20250328_create_assessment_results_table.sql
    └── 20250328_add_rls_policies.sql
```

## Type Definitions

All types are fully documented in:
- `src/types/lead-capture.ts`
- `src/types/assessment.ts`

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "validationIssues": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Validation error
- `500` - Server error

## Email Templates

Email templates are included in `src/lib/email.ts`:

1. **Lead Magnet Email** - Download link delivery
2. **Assessment Results Email** - Score and insights

Both templates are fully customizable HTML.

## Best Practices

1. **Always validate input** - Zod schemas are provided
2. **Use service role carefully** - Only on server-side routes
3. **Keep RLS policies simple** - Public insert, user read own
4. **Index frequently queried fields** - Already done for you
5. **Monitor rate limits** - Upstash is configured
6. **Test with real emails** - Resend has a generous free tier

## Troubleshooting

### Supabase Connection Failed

Check that:
- `NEXT_PUBLIC_SUPABASE_URL` is correct
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Supabase project is active

### Email Not Sending

Check that:
- `RESEND_API_KEY` is set
- `RESEND_FROM_EMAIL` is verified in Resend
- Email isn't in spam folder

### Migration Failed

Check that:
- Supabase project is created
- You have the right permissions
- SQL syntax is correct (run in Supabase dashboard)

## Next Steps

1. Run migrations in Supabase dashboard
2. Configure environment variables
3. Test API endpoints
4. Set up Resend (optional)
5. Integrate with frontend components

## Support

For issues or questions:
- Check Supabase logs in dashboard
- Check Resend logs for email errors
- Review browser console for API errors
- Check server logs with `npm run dev`
