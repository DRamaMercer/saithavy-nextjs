/**
 * Download API Endpoint
 *
 * Handles resource download requests with:
 * - Rate limiting (5 requests per hour per IP)
 * - Email capture and validation
 * - Analytics tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveRateLimiter } from '@/lib/di/services';
import { z } from 'zod';

// Rate limit configuration
const DOWNLOAD_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 downloads per hour per IP
};

// Zod schema for email validation
const downloadSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  resourceId: z.string().min(1, 'Resource ID is required'),
  format: z.enum(['pdf', 'web', 'print'], {
    errorMap: () => ({ message: 'Invalid download format' }),
  }),
  firstName: z.string().optional(),
});

/**
 * POST /api/download
 *
 * Handles download requests with rate limiting and validation
 */
export async function POST(request: NextRequest) {
  try {
    // Extract IP address
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'anonymous';

    // Check rate limit
    const rateLimiter = resolveRateLimiter();
    const rateLimitResult = await rateLimiter.checkLimit(ip, DOWNLOAD_RATE_LIMIT);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many download attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() ?? '',
            'Retry-After': rateLimitResult.retryAfter?.toString() ?? '3600',
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const validationResult = downloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          issues: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, resourceId, format, firstName } = validationResult.data;

    // TODO: Store lead in database
    // await storeLead({ email, firstName, resourceId, format, ip });

    // TODO: Trigger actual download
    // For now, return success with download URL

    return NextResponse.json(
      {
        success: true,
        message: 'Download started',
        downloadUrl: `/resources/${resourceId}/download?format=${format}`,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset?.toString() ?? '',
        },
      }
    );
  } catch (error) {
    console.error('[Download API] Error:', error);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
