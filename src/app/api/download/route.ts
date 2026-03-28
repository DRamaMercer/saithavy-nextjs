/**
 * Download API Endpoint
 *
 * Handles resource download requests with:
 * - Rate limiting (5 requests per hour per IP)
 * - Email capture and validation
 * - Analytics tracking
 *
 * @openapi
 * /api/download:
 *   post:
 *     summary: Request resource download
 *     description: |
 *       Request a resource download with email capture and rate limiting.
 *
 *       **Rate Limit:** 5 downloads per hour per IP
 *
 *       **Process:**
 *       1. Validate email and resource ID
 *       2. Check rate limits
 *       3. Capture lead information
 *       4. Return download URL
 *     tags:
 *       - Downloads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - resourceId
 *               - format
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for lead capture
 *                 example: "user@example.com"
 *               resourceId:
 *                 type: string
 *                 description: Resource ID to download
 *                 example: "1"
 *               format:
 *                 type: string
 *                 enum: [pdf, web, print]
 *                 description: Download format
 *                 example: "pdf"
 *               firstName:
 *                 type: string
 *                 description: Optional first name for personalization
 *                 example: "John"
 *     responses:
 *       '200':
 *         description: Download initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Download started"
 *                 downloadUrl:
 *                   type: string
 *                   example: "/resources/mindful-leadership-reflection-journal/download?format=pdf"
 *       '400':
 *         description: Validation error
 *       '429':
 *         description: Rate limit exceeded
 *       '500':
 *         description: Internal server error
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with download URL or error
 */

import { NextRequest, NextResponse } from "next/server";
import { resolveRateLimiter } from "@/lib/di/services";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Rate limit configuration
const _DOWNLOAD_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 downloads per hour per IP
};

// Zod schema for email validation
const downloadSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  resourceId: z.string().min(1, "Resource ID is required"),
  format: z.enum(["pdf", "web", "print"]),
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
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    // Check rate limit
    const rateLimiter = await resolveRateLimiter();
    const rateLimitResult = await rateLimiter.checkLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many download attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            "Retry-After": (rateLimitResult.retryAfter ?? 3600).toString(),
          },
        },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const validationResult = downloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { email: _email, resourceId, format, firstName: _firstName } = validationResult.data;

    // TODO: Store lead in database
    // await storeLead({ email, firstName, resourceId, format, ip });

    // TODO: Trigger actual download
    // For now, return success with download URL

    return NextResponse.json(
      {
        success: true,
        message: "Download started",
        downloadUrl: `/resources/${resourceId}/download?format=${format}`,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      },
    );
  } catch (error) {
    logger.error(
      "[Download API] Error",
      { endpoint: "download" },
      error as Error,
    );

    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
