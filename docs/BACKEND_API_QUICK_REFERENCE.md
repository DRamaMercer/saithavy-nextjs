# Backend API Quick Reference

**For Frontend Developers** - Blueprint Migration Project

---

## Base URL
```
Development: http://localhost:3000
Production:  https://yourdomain.com
```

---

## API Endpoints

### 1. Lead Capture

#### Capture Email Lead
```typescript
POST /api/lead-capture
```

**Request:**
```typescript
fetch('/api/lead-capture', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    lead_magnet: 'mindful-leadership',
    assessment_score: 85,  // Optional
    metadata: {             // Optional
      utm_source: 'twitter',
      utm_campaign: 'launch'
    }
  })
})
```

**Valid Lead Magnets:**
- `mindful-leadership`
- `ai-innovation`
- `resilience-toolkit`
- `remote-work-mastery`
- `personal-transformation`

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you! Your download link will be sent to your email.",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "lead_magnet": "mindful-leadership",
    "assessment_score": 85,
    "created_at": "2025-03-28T00:00:00Z"
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "validationIssues": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

### 2. Assessment

#### Save Assessment Results
```typescript
POST /api/assessment
```

**Request:**
```typescript
fetch('/api/assessment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    assessment_type: 'mindful-leadership',
    responses: {
      question1: 'answer1',
      question2: 'answer2'
    },
    score: 85,
    results: {
      score: 85,
      level: 'Advanced',
      recommendations: ['Tip 1', 'Tip 2'],
      strengths: ['Strength 1'],
      areas_for_improvement: ['Area 1']
    }
  })
})
```

**Valid Assessment Types:**
- `mindful-leadership`
- `ai-readiness`
- `resilience`
- `remote-work`
- `personal-transformation`

**Response (Success):**
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

---

## TypeScript Types

### Import Types
```typescript
import type {
  LeadCaptureInput,
  LeadCaptureResponse,
  LeadMagnetType
} from '@/types/lead-capture';

import type {
  AssessmentInput,
  AssessmentResponse,
  AssessmentType
} from '@/types/assessment';
```

### Lead Capture Types
```typescript
interface LeadCaptureInput {
  email: string;
  lead_magnet: LeadMagnetType;
  assessment_score?: number;  // 0-100
  metadata?: Record<string, unknown>;
}

interface LeadCaptureResponse {
  success: boolean;
  message?: string;
  data?: LeadCapture;
  error?: string;
  validationIssues?: Array<{
    field: string;
    message: string;
  }>;
}
```

### Assessment Types
```typescript
interface AssessmentInput {
  email: string;
  assessment_type: AssessmentType;
  responses: Record<string, unknown>;
  score: number;  // 0-100
  results: Record<string, unknown>;
}

interface AssessmentResponse {
  success: boolean;
  message?: string;
  data?: AssessmentResult;
  error?: string;
  validationIssues?: Array<{
    field: string;
    message: string;
  }>;
}
```

---

## Usage Examples

### React Component Example
```typescript
'use client';

import { useState } from 'react';
import type { LeadCaptureResponse } from '@/types/lead-capture';

export function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lead_magnet: 'mindful-leadership',
          metadata: {
            source: 'landing-page'
          }
        })
      });

      const data: LeadCaptureResponse = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Success!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Get Your Free Guide'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### Assessment Submission Example
```typescript
async function submitAssessment(
  email: string,
  responses: Record<string, unknown>,
  score: number,
  results: Record<string, unknown>
) {
  const response = await fetch('/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      assessment_type: 'mindful-leadership',
      responses,
      score,
      results
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Submission failed');
  }

  return data;
}
```

---

## Error Handling

### Common Errors

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "error": "Validation failed",
  "validationIssues": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Database error occurred while capturing lead"
}
```

### Error Handling Pattern
```typescript
try {
  const response = await fetch('/api/lead-capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!result.success) {
    // Handle validation errors
    if (result.validationIssues) {
      result.validationIssues.forEach(issue => {
        console.error(`${issue.field}: ${issue.message}`);
      });
    }
    // Handle general errors
    throw new Error(result.error || 'Request failed');
  }

  // Success!
  return result.data;

} catch (error) {
  // Handle network errors
  console.error('Network error:', error);
}
```

---

## Validation Rules

### Email
- Required
- Must be valid email format
- Max 255 characters

### Lead Magnet Type
- Required
- Must be one of 5 valid types

### Assessment Score
- Optional (for lead capture)
- Must be integer
- Range: 0-100

### Assessment Type
- Required
- Must be one of 5 valid types

### Responses
- Optional (defaults to {})
- Must be object
- Can be empty

### Results
- Optional (defaults to {})
- Must be object
- Must contain `score` field

---

## Testing Locally

### Test Lead Capture
```bash
curl -X POST http://localhost:3000/api/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "lead_magnet": "mindful-leadership"
  }'
```

### Test Assessment
```bash
curl -X POST http://localhost:3000/api/assessment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "assessment_type": "mindful-leadership",
    "responses": {"q1": "a1"},
    "score": 85,
    "results": {"score": 85, "level": "Advanced"}
  }'
```

---

## Environment Setup

The backend will work without configuration in development (returns success without database operations).

For production, set these in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-key  # Optional
RESEND_FROM_EMAIL=noreply@yourdomain.com  # Optional
```

---

## Need Help?

- **Backend Setup Guide:** `docs/BACKEND_SETUP_GUIDE.md`
- **Completion Report:** `docs/BACKEND_COMPLETION_REPORT.md`
- **Type Definitions:** `src/types/lead-capture.ts` and `src/types/assessment.ts`

---

**Last Updated:** 2025-03-28
**Backend Developer:** Backend API Development Agent
