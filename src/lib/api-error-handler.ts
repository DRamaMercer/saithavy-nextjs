/**
 * API Error Handler Utility
 *
 * Standardized error handling for API routes to ensure
 * consistent error responses across the application.
 */

import { NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Error context for logging
 */
export interface ErrorContext {
  endpoint: string;
  operation?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Standardized API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  requestId: string;
  validationIssues?: ValidationError[];
  timestamp: string;
}

/**
 * Handle API errors with standardized logging and response format
 *
 * @param error - The error object (can be Error, string, or unknown)
 * @param context - Context information for logging
 * @param status - HTTP status code (default: 500)
 * @returns Formatted error response
 *
 * @example
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return handleApiError(error, {
 *     endpoint: "contact",
 *     operation: "POST"
 *   });
 * }
 */
export function handleApiError(
  error: unknown,
  context: ErrorContext,
  status: number = 500,
): NextResponse<ApiErrorResponse> {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const requestId = crypto.randomUUID();

  // Log error with context
  logger.error(
    `API Error: ${context.endpoint}${context.operation ? ` - ${context.operation}` : ""}`,
    { ...context, requestId },
    error instanceof Error ? error : new Error(String(error)),
  );

  // Build error response
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: getUserFacingErrorMessage(status, errorMessage),
    requestId,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Handle validation errors with detailed field-level errors
 *
 * @param validationIssues - Array of validation error details
 * @param context - Context information for logging
 * @returns Formatted validation error response
 *
 * @example
 * const validationResult = schema.safeParse(body);
 * if (!validationResult.success) {
 *   const issues = validationResult.error.issues.map(issue => ({
 *     field: issue.path.join("."),
 *     message: issue.message
 *   }));
 *   return handleValidationError(issues, { endpoint: "contact" });
 * }
 */
export function handleValidationError(
  validationIssues: ValidationError[],
  context: ErrorContext,
): NextResponse<ApiErrorResponse> {
  const requestId = crypto.randomUUID();

  logger.warning(
    `Validation Error: ${context.endpoint}`,
    { ...context, requestId, validationIssues },
  );

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed. Please check your input and try again.",
      requestId,
      validationIssues,
      timestamp: new Date().toISOString(),
    },
    { status: 400 },
  );
}

/**
 * Handle rate limit exceeded errors
 *
 * @param retryAfter - Seconds until retry is allowed
 * @param context - Context information
 * @returns Rate limit error response with Retry-After header
 */
export function handleRateLimitError(
  retryAfter: number,
  context: ErrorContext,
): NextResponse<ApiErrorResponse> {
  const requestId = crypto.randomUUID();

  logger.info(
    `Rate Limit Exceeded: ${context.endpoint}`,
    { ...context, requestId },
  );

  return NextResponse.json(
    {
      success: false,
      error: "Rate limit exceeded. Please try again later.",
      requestId,
      timestamp: new Date().toISOString(),
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + retryAfter),
      },
    },
  );
}

/**
 * Handle not found errors
 *
 * @param resource - Resource type that was not found
 * @param resourceId - Optional resource identifier
 * @param context - Context information
 * @returns Not found error response
 */
export function handleNotFoundError(
  resource: string,
  resourceId?: string,
  context?: ErrorContext,
): NextResponse<ApiErrorResponse> {
  const requestId = crypto.randomUUID();
  const message = resourceId
    ? `${resource} with ID '${resourceId}' not found`
    : `${resource} not found`;

  logger.info(
    `Not Found: ${resource}`,
    { ...(context || {}), requestId, resourceId },
  );

  return NextResponse.json(
    {
      success: false,
      error: message,
      requestId,
      timestamp: new Date().toISOString(),
    },
    { status: 404 },
  );
}

/**
 * Handle unauthorized errors
 *
 * @param message - Optional custom error message
 * @param context - Context information
 * @returns Unauthorized error response
 */
export function handleUnauthorizedError(
  message: string = "Authentication required",
  context?: ErrorContext,
): NextResponse<ApiErrorResponse> {
  const requestId = crypto.randomUUID();

  logger.warning(
    `Unauthorized Access`,
    { ...(context || {}), requestId },
  );

  return NextResponse.json(
    {
      success: false,
      error: message,
      requestId,
      timestamp: new Date().toISOString(),
    },
    { status: 401 },
  );
}

/**
 * Map internal errors to user-friendly messages
 * Avoids exposing sensitive internal details
 *
 * @param status - HTTP status code
 * @param internalMessage - Internal error message
 * @returns User-facing error message
 */
function getUserFacingErrorMessage(
  status: number,
  internalMessage: string,
): string {
  // Map status codes to user-friendly messages
  const statusMessages: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "Authentication required. Please log in.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    429: "Too many requests. Please try again later.",
    500: "An unexpected error occurred. Please try again.",
    502: "Service temporarily unavailable. Please try again later.",
    503: "Service unavailable. Please try again later.",
  };

  return statusMessages[status] || "An error occurred. Please try again.";
}

/**
 * Create a successful API response
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns Success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
): NextResponse<{ success: true; data: T; timestamp: string }> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Create a success response with a custom message
 *
 * @param message - Success message
 * @param data - Optional response data
 * @param status - HTTP status code (default: 200)
 * @returns Success response with message
 */
export function createSuccessMessageResponse<T>(
  message: string,
  data?: T,
  status: number = 200,
): NextResponse<
  { success: true; message: string; data?: T; timestamp: string }
> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
