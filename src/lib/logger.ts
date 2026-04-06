/**
 * Unified Logger
 *
 * Works in Node.js (API routes), Edge Runtime, and Browser contexts.
 * Provides consistent logging interface across all environments.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  component?: string;
  route?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Generate a unique correlation ID
 */
function generateCorrelationId(): string {
  return `cid_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Format log entry as string
 */
function formatMessage(entry: LogEntry): string {
  const { level, message, timestamp, context, error } = entry;

  let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

  if (context && Object.keys(context).length > 0) {
    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(" ");
    formatted += ` | ${contextStr}`;
  }

  if (error) {
    formatted += ` | ${error.name}: ${error.message}`;
    if (error.stack) {
      formatted += `\n${error.stack}`;
    }
  }

  return formatted;
}

/**
 * Check if running in development
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in Edge Runtime
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isEdgeRuntime(): boolean {
  // @ts-expect-error - Edge Runtime check
  return typeof EdgeRuntime !== "undefined" && EdgeRuntime.isEdgeRuntime;
}

/**
 * Core logging function
 */
function log(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error,
): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      correlationId: context?.correlationId || context?.requestId || generateCorrelationId(),
    },
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined,
  };

  const formatted = formatMessage(entry);

  // In development or browser, use colored console output
  if (isDevelopment() || typeof window !== "undefined") {
    // Colors for terminal
    const colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[32m", // Green
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    };
    const reset = "\x1b[0m";

    switch (level) {
      case "debug":
      case "info":
        console.log(colors[level] + formatted + reset);
        break;
      case "warn":
        console.warn(colors.warn + formatted + reset);
        break;
      case "error":
        console.error(colors.error + formatted + reset);
        break;
    }
  } else {
    // In production, use plain console
    switch (level) {
      case "debug":
      case "info":
        console.log(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        break;
    }
  }
}

/**
 * Unified logger class
 */
class UnifiedLogger {
  debug(message: string, context?: LogContext): void {
    if (isDevelopment()) {
      log("debug", message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    log("warn", message, context);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    log("error", message, context, error);
  }
}

// Export singleton instance
export const logger = new UnifiedLogger();

// Convenience functions for direct import
export const debug = (message: string, context?: LogContext) =>
  logger.debug(message, context);
export const info = (message: string, context?: LogContext) =>
  logger.info(message, context);
export const warn = (message: string, context?: LogContext) =>
  logger.warn(message, context);
export const error = (message: string, context?: LogContext, err?: Error) =>
  logger.error(message, context, err);

/**
 * Create a logger with preset context
 */
export function createLogger(presetContext: LogContext): typeof logger {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...presetContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...presetContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...presetContext, ...context }),
    error: (message: string, context?: LogContext, err?: Error) =>
      logger.error(message, { ...presetContext, ...context }, err),
  } as typeof logger;
}
