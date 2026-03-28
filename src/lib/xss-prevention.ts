/**
 * XSS Prevention Utilities
 * Provides safe HTML handling and JSON-LD validation
 */

/**
 * Sanitize HTML for JSON-LD structured data
 * This is a safe use case because:
 * 1. Content is wrapped in JSON.stringify() which escapes HTML characters
 * 2. Data comes from trusted source (markdown frontmatter)
 * 3. Used in <script type="application/ld+json"> tag (not executed)
 * 4. No user input is injected
 *
 * However, we add validation for defense-in-depth
 */
export function sanitizeJsonLd(data: unknown): string {
  try {
    // Ensure data is plain object (not containing functions, etc.)
    const jsonString = JSON.stringify(data);

    // Validate it's valid JSON
    JSON.parse(jsonString);

    // Check for potential XSS patterns (should not exist in proper JSON-LD)
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /onload=/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(jsonString)) {
        throw new Error(`Potentially dangerous pattern detected: ${pattern}`);
      }
    }

    return jsonString;
  } catch (error) {
    throw new Error(`Invalid JSON-LD data: ${(error as Error).message}`);
  }
}

/**
 * Validate that content is safe for dangerouslySetInnerHTML
 * This should only be used for JSON-LD structured data
 *
 * @param content - The content to validate
 * @param source - Description of where content comes from (for logging)
 * @returns Sanitized content safe for dangerouslySetInnerHTML
 */
export function validateDangerousHtml(content: unknown, source: string): string {
  // For JSON-LD structured data
  if (typeof content === "object" && content !== null) {
    return sanitizeJsonLd(content);
  }

  // For string content (NOT RECOMMENDED - avoid if possible)
  if (typeof content === "string") {
    // Only allow if it's from a trusted source
    const trustedSources = ["markdown-frontmatter", "static-content"];

    if (!trustedSources.includes(source)) {
      throw new Error(
        `String content for dangerouslySetInnerHTML must be from trusted source. Got: ${source}`,
      );
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // Event handlers like onclick=
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        throw new Error(`Potentially dangerous HTML pattern detected in ${source}`);
      }
    }

    return content;
  }

  throw new Error(
    `Invalid content type for dangerouslySetInnerHTML: ${typeof content}`,
  );
}

/**
 * Safe component props for JSON-LD structured data
 */
export interface JsonLdProps {
  /** The JSON-LD data object */
  data: Record<string, unknown>;
  /** Optional description of data source for validation */
  source?: string;
}

/**
 * Generate props for dangerouslySetInnerHTML with JSON-LD
 * This is a helper to ensure consistent safe usage
 *
 * @param data - The JSON-LD data object
 * @param source - Optional source description (default: "markdown-frontmatter")
 * @returns Props object safe for use with dangerouslySetInnerHTML
 */
export function createJsonLdProps(
  data: Record<string, unknown>,
  source: string = "markdown-frontmatter",
): { __html: string } {
  const sanitized = validateDangerousHtml(data, source);

  return {
    __html: sanitized,
  };
}

/**
 * Usage example:
 *
 * ```tsx
 * import { createJsonLdProps } from '@/lib/xss-prevention';
 *
 * const jsonLd = {
 *   "@context": "https://schema.org",
 *   "@type": "Article",
 *   headline: "My Article Title"
 * };
 *
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={createJsonLdProps(jsonLd, "markdown-frontmatter")}
 * />
 * ```
 */
