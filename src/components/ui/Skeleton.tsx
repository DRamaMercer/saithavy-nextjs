import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton Component - Loading placeholder for content
 *
 * Provides visual feedback while content is loading.
 * Supports different shapes and animation types.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="100%" height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className = "",
      variant = "rectangular",
      width,
      height,
      animation = "pulse",
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-block";

    const variantStyles: Record<string, string> = {
      text: "rounded",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    };

    const animationStyles: Record<string, string> = {
      pulse: "animate-pulse",
      wave: "",
      none: "",
    };

    const combinedStyle: React.CSSProperties = {
      ...style,
      width: width || style?.width,
      height: height || style?.height,
      backgroundColor: "var(--surface-alt)",
    };

    // Add wave animation gradient
    if (animation === "wave") {
      combinedStyle.backgroundImage =
        "linear-gradient(90deg, var(--surface-alt) 0%, var(--border) 50%, var(--surface-alt) 100%)";
      combinedStyle.backgroundSize = "200% 100%";
      combinedStyle.animation = "skeleton-wave 1.5s ease-in-out infinite";
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
        style={combinedStyle}
        role="status"
        aria-label="Loading..."
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

/**
 * Card Skeleton - Pre-styled skeleton for card components
 */
export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton variant="text" width={100} height={14} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

/**
 * Blog Post Skeleton - Pre-styled skeleton for blog posts
 */
export function BlogPostSkeleton() {
  return (
    <article className="space-y-4">
      {/* Title */}
      <Skeleton variant="text" width="100%" height={32} />
      <Skeleton variant="text" width="70%" height={32} />

      {/* Meta */}
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="30%" height={16} />
          <Skeleton variant="text" width="20%" height={14} />
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2 pt-4">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </article>
  );
}

/**
 * Resource Card Skeleton - Pre-styled skeleton for resource cards
 */
export function ResourceCardSkeleton() {
  return (
    <div className="p-6 rounded-xl space-y-4" style={{ backgroundColor: "var(--surface)" }}>
      {/* Icon */}
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </div>

      {/* Content */}
      <div className="space-y-3 pt-2">
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>

      {/* Footer */}
      <div className="pt-4 flex items-center justify-between">
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </div>
    </div>
  );
}

export default Skeleton;
