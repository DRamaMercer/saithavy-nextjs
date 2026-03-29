"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component with Retry Functionality
 *
 * Catches JavaScript errors in component tree and displays user-friendly error messages.
 * Provides retry button to attempt recovery from errors.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log to external service if available
    if (typeof window !== "undefined" && (window as any).logError) {
      (window as any).logError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI component with retry functionality
 */
function DefaultErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div
      className="min-h-[400px] flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)" }}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <AlertTriangle
            className="w-8 h-8"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2
            className="text-2xl font-bold font-[family-name:var(--font-poppins)]"
            style={{ color: "var(--heading)" }}
          >
            Oops! Something went wrong
          </h2>
          <p style={{ color: "var(--foreground)" }}>
            We encountered an unexpected error. Don&apos;t worry, your work is
            safe. Please try refreshing or click the button below.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <details className="text-left">
            <summary
              className="cursor-pointer text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Error details
            </summary>
            <pre
              className="mt-2 p-4 rounded-lg overflow-auto text-xs"
              style={{
                backgroundColor: "var(--surface-alt)",
                color: "var(--foreground)",
              }}
            >
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}

        {/* Retry Button */}
        <button
          onClick={retry}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </button>

        {/* Additional Help */}
        <p className="text-sm" style={{ color: "var(--foreground)" }}>
          If the problem persists, please{" "}
          <a
            href="/contact"
            className="underline"
            style={{ color: "var(--accent)" }}
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
