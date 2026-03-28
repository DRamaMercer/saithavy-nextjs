"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

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
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="p-6 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            An error occurred while rendering this component. Please refresh the
            page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-sm font-medium text-red-800 dark:text-red-200 cursor-pointer">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-red-900 dark:text-red-100 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
