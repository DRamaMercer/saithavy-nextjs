/**
 * HeroHeader - Hero section for resources hub
 *
 * Displays category name, description, and metadata with dark gradient background
 */

import Link from 'next/link';

interface HeroHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  totalCount?: number;
}

export default function HeroHeader({
  title = 'Resource Hub',
  subtitle = 'Guides, templates, and tools for personal and professional growth',
  breadcrumb,
  totalCount = 62,
}: HeroHeaderProps) {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        background: 'linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mb-4">
            <Link
              href="/resources"
              className="text-sm font-medium text-gray-200 hover:text-white dark:text-gray-700 dark:hover:text-gray-900 transition-colors duration-200"
            >
              ← Back to Resources
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl text-white dark:text-gray-900 mb-6">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-100 dark:text-gray-800 mb-6 max-w-3xl">
          {subtitle}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 dark:text-gray-700">
          <span className="font-medium">{totalCount} Resources</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>Updated regularly</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>Free to download</span>
        </div>
      </div>
    </section>
  );
}
