/**
 * Edge Runtime Logger
 *
 * Edge-compatible logger that doesn't use Node.js APIs.
 * For use in Vercel Edge Functions and middleware.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  correlationId?: string;
  userId?: string;
  requestId?: string;
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

class EdgeLogger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(entry: LogEntry): string {
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
      if (error.stack && this.isDevelopment) {
        formatted += `\n${error.stack}`;
      }
    }

    return formatted;
  }

  private log(
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
        correlationId: context?.correlationId || generateCorrelationId(),
      },
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    const formatted = this.formatMessage(entry);

    // In development, use colored console output
    if (this.isDevelopment) {
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

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log("error", message, context, error);
  }
}

// Export singleton instance
export const edgeLogger = new EdgeLogger();

// Convenience functions for direct import
export const debug = (message: string, context?: LogContext) =>
  edgeLogger.debug(message, context);
export const info = (message: string, context?: LogContext) =>
  edgeLogger.info(message, context);
export const warn = (message: string, context?: LogContext) =>
  edgeLogger.warn(message, context);
export const error = (message: string, context?: LogContext, err?: Error) =>
  edgeLogger.error(message, context, err);

/**
 * Create a logger with preset context
 */
export function createEdgeLogger(presetContext: LogContext): typeof edgeLogger {
  return {
    debug: (message: string, context?: LogContext) =>
      edgeLogger.debug(message, { ...presetContext, ...context }),
    info: (message: string, context?: LogContext) =>
      edgeLogger.info(message, { ...presetContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      edgeLogger.warn(message, { ...presetContext, ...context }),
    error: (message: string, context?: LogContext, err?: Error) =>
      edgeLogger.error(message, { ...presetContext, ...context }, err),
  } as typeof edgeLogger;
}
