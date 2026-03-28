import { Loader2 } from "lucide-react";

export function ResourceCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} style={{ color: "var(--accent)" }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-64 mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-96 mx-auto" />
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
            </div>
            <div className="text-center">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
            </div>
            <div className="text-center">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
            </div>
          </div>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
