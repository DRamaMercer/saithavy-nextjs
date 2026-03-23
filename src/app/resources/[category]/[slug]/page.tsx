/**
 * Resource Detail Page
 *
 * Server Component implementation with:
 * - SSG with generateStaticParams
 * - Markdown content loading
 * - PDF download functionality
 * - Email capture modal integration
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import {getResourceContent, resourceContentExists} from '@/lib/resourceContent';
import {getResourceBySlug, getRelatedResources, resources} from '@/lib/resourcesData';
import {Resource} from '@/types/resources';
import ResourceDownloadModal from '@/components/ResourceDownloadModal';
import DownloadClient from './DownloadClient';

/**
 * Generate static params for SSG
 * Creates all possible resource detail page paths at build time
 */
export async function generateStaticParams() {
  const paths: Array<{ category: string; slug: string }> = [];

  for (const resource of resources) {
    paths.push({
      category: resource.category,
      slug: resource.slug,
    });
  }

  return paths;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return {
      title: 'Resource Not Found',
    };
  }

  return {
    title: resource.seoTitle || resource.title,
    description: resource.seoDescription || resource.description,
    keywords: resource.keywords,
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.description,
    },
  };
}

/**
 * Resource Detail Page Component
 */
export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  // Get resource
  const resource = getResourceBySlug(slug);

  if (!resource || resource.category !== category) {
    notFound();
  }

  // Check if content exists
  const hasContent = resourceContentExists(resource);

  // Get related resources
  const relatedResources = getRelatedResources(resource);

  // Get content with metadata (if exists)
  let contentWithMetadata = null;
  if (hasContent) {
    try {
      contentWithMetadata = await getResourceContent(resource);
    } catch (error) {
      console.error(`[ResourceDetailPage] Failed to load content for ${slug}:`, error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
            <span className="capitalize">{resource.category.replace('-', ' ')}</span>
            <span>/</span>
            <span className="capitalize">{resource.type.toLowerCase()}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 font-poppins mb-4">
            {resource.title}
          </h1>
          <p className="text-xl text-stone-600 mb-6">{resource.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            {resource.difficulty && (
              <span className="px-3 py-1 bg-stone-100 rounded-full">
                {resource.difficulty}
              </span>
            )}
            {resource.timeToRead && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {resource.timeToRead}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {resource.downloads.toLocaleString()} downloads
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Download Button */}
        <DownloadClient resource={resource} />

        {/* Content */}
        {contentWithMetadata ? (
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown>{contentWithMetadata.content}</ReactMarkdown>
          </article>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-amber-800">
              Content is coming soon! In the meantime, download the resource to access
              the full material.
            </p>
          </div>
        )}

        {/* What You'll Learn */}
        {resource.whatYoullLearn && resource.whatYoullLearn.length > 0 && (
          <section className="mt-12 p-6 bg-stone-50 rounded-lg">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-2">
              {resource.whatYoullLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-stone-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Related Resources
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedResources.map((related) => (
                <a
                  key={related.slug}
                  href={`/resources/${related.category}/${related.slug}`}
                  className="block p-6 bg-white border border-stone-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="text-sm text-stone-500 mb-2 capitalize">
                    {related.type.toLowerCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-stone-600 text-sm">{related.description}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
