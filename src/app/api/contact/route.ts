import { NextRequest, NextResponse } from "next/server";
import { SubmitContactUseCase } from "@/use_cases/SubmitContactUseCase";
import {
  resolveContactRepository,
  resolveRateLimiter,
} from "@/lib/di/services";
import { logger } from "@/lib/logger";

/**
 * Contact API Endpoint
 *
 * POST /api/contact
 *
 * Submit a contact form message with rate limiting and validation.
 *
 * @openapi
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: |
 *       Submit a contact form message with rate limiting and validation.
 *
 *       **Rate Limit:** 3 requests per hour per IP
 *
 *       **Validation:**
 *       - Email must be valid
 *       - Name required (min 2 characters)
 *       - Message required (min 10 characters)
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - message
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email address
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 description: Contact name
 *                 example: "John Doe"
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 description: Contact message
 *                 example: "I'd like to learn more about your leadership programs."
 *     responses:
 *       '200':
 *         description: Message submitted successfully
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
 *                   example: "Thank you! Your message has been received."
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "email"
 *                       message:
 *                         type: string
 *                         example: "Invalid email format"
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Too many contact form submissions. Please try again later."
 *                 retryAfter:
 *                   type: integer
 *                   description: Seconds until retry is allowed
 *                   example: 3600
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again."
 *     headers:
 *       X-RateLimit-Limit:
 *         schema:
 *           type: integer
 *         description: Rate limit quota
 *       X-RateLimit-Remaining:
 *         schema:
 *           type: integer
 *         description: Remaining requests in current window
 *       X-RateLimit-Reset:
 *         schema:
 *           type: integer
 *         description: Unix timestamp when rate limit resets
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with success/error status
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize dependencies from DI container
    const [rateLimiter, contactRepository] = await Promise.all([
      resolveRateLimiter(),
      Promise.resolve(resolveContactRepository()),
    ]);

    const submitContactUseCase = new SubmitContactUseCase(
      rateLimiter,
      contactRepository,
    );
    // Extract infrastructure concerns (IP, Body)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Execute application business rules
    const response = await submitContactUseCase.execute({ ip, body });

    // Map Use Case response to HTTP Response (Interface Adapter logic)
    const headers: Record<string, string> = {};
    if (response.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = response.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] =
        response.rateLimitInfo.remaining.toString();
      if (response.rateLimitInfo.reset) {
        headers["X-RateLimit-Reset"] = response.rateLimitInfo.reset.toString();
      }
    }

    if (!response.success) {
      if (response.statusCode === 429) {
        return NextResponse.json(
          {
            success: false,
            error: response.error,
            retryAfter: response.rateLimitInfo?.retryAfter,
          },
          { status: 429, headers },
        );
      }

      if (response.statusCode === 400) {
        return NextResponse.json(
          {
            success: false,
            error: response.error,
            issues: response.validationIssues,
          },
          { status: 400, headers },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received.",
      },
      { status: 200, headers },
    );
  } catch (error) {
    logger.error(
      "Contact API Controller error",
      { endpoint: "contact" },
      error as Error,
    );
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
