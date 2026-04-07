import React from "react";
import Link from "next/link";

interface ToolRecommendationProps {
  name: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
  category?: string;
  badge?: string;
  featured?: boolean;
}

export default function ToolRecommendation({
  name,
  description,
  url,
  icon,
  category,
  badge,
  featured = false,
}: ToolRecommendationProps): React.JSX.Element {
  const baseStyles = "my-6 p-5 rounded-lg border transition-all duration-200 hover:shadow-lg";
  const featuredStyles = featured
    ? "border-blueprint-terracotta bg-gradient-to-br from-orange-50 to-white shadow-md"
    : "border-gray-200 bg-white hover:border-blueprint-terracotta";

  return (
    <div className={`${baseStyles} ${featuredStyles}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 mt-1 text-blueprint-terracotta">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {badge}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {category}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blueprint-terracotta rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueprint-terracotta transition-colors"
          >
            Learn More
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
