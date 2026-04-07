/**
 * Resource Detail Page
 *
 * Server Component implementation with:
 * - SSG with generateStaticParams
 * - Markdown content loading
 * - PDF download functionality
 * - Email capture modal integration
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  getResourceContent,
  resourceContentExists,
} from "@/lib/resourceContent";
import {
  getResourceBySlug,
  getRelatedResources,
  resources,
} from "@/lib/resourcesData";
import { Resource } from "@/types/resources";
import { logger } from "@/lib/logger";
import DownloadClient from "./DownloadClient";
import ShareClient from "./ShareClient";
import ScrollToTop from "@/components/ScrollToTop";

// ISR: Revalidate every hour for resource detail updates
export const revalidate = 3600;

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
 * Generate SEO-optimized description
 */
function generateSeoDescription(resource: Resource): string {
  const { title, type, description, targetAudience, whatYoullLearn: _whatYoullLearn } = resource;

  // Build compelling description with benefit statement
  let seoDesc = "";

  // Start with action verb + what it is
  const actionVerbs = ["Download", "Get", "Access", "Discover"];
  const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

  // Format type for readability
  const formatMap: Record<string, string> = {
    PDF: "PDF guide",
    Template: "template",
    Guide: "guide",
    Workbook: "workbook",
    Checklist: "checklist",
    Assessment: "assessment",
    Framework: "framework",
    Audio: "audio",
    Video: "video",
  };

  const format = formatMap[type] || type.toLowerCase();

  // Extract key benefit from description (first sentence)
  const benefitMatch = description.match(/^([^.]+)\./);
  const benefit = benefitMatch
    ? benefitMatch[1].toLowerCase()
    : description.slice(0, 60).toLowerCase();

  // Build description: [Action] [Title] - [Format] for [Benefit]
  seoDesc = `${verb} ${title} - A free ${format}`;

  // Add benefit if space allows
  if (seoDesc.length < 100) {
    seoDesc += ` that helps you ${benefit}`;
  }

  // Add target audience if useful and space allows
  if (targetAudience && seoDesc.length < 130) {
    seoDesc += `. Perfect for ${targetAudience.toLowerCase()}`;
  }

  // Ensure it ends with CTA
  if (!seoDesc.endsWith("download")) {
    seoDesc += `. Free instant download.`;
  }

  // Truncate to 160 chars max for SEO
  return seoDesc.slice(0, 160);
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
      title: "Resource Not Found",
    };
  }

  const baseUrl = "https://saithavy.com";
  const resourceUrl = `${baseUrl}/resources/${category}/${slug}`;
  const ogImageUrl =
    resource.ogImage ||
    `${baseUrl}/api/og/resource?slug=${slug}&title=${encodeURIComponent(resource.title)}&category=${category}`;

  // Generate SEO-optimized description
  const seoDescription = generateSeoDescription(resource);

  return {
    title: resource.seoTitle || resource.title,
    description: resource.seoDescription || seoDescription,
    keywords: resource.keywords,
    authors: [{ name: "Saithavy" }],
    alternates: {
      canonical: resourceUrl,
    },
    openGraph: {
      title: resource.title,
      description: seoDescription,
      type: "article",
      locale: "en_US",
      url: resourceUrl,
      siteName: "Saithavy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: seoDescription,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate JSON-LD structured data for resource
 */
function generateResourceJsonLd(
  resource: Resource,
  category: string,
  slug: string,
) {
  const baseUrl = "https://saithavy.com";
  const resourceUrl = `${baseUrl}/resources/${category}/${slug}`;
  const categoryInfo = {
    "mindful-leadership": {
      name: "Mindful Leadership",
      description:
        "Leadership development and emotional intelligence resources",
    },
    "ai-automation": {
      name: "AI + Automation",
      description: "AI implementation and automation resources",
    },
    "personal-growth": {
      name: "Personal Growth",
      description: "Self-improvement and personal development resources",
    },
    "remote-work": {
      name: "Remote Work",
      description: "Remote work productivity and collaboration resources",
    },
    "overcoming-adversity": {
      name: "Overcoming Adversity",
      description: "Resilience and adversity recovery resources",
    },
  }[category];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${resourceUrl}#article`,
        headline: resource.title,
        description: resource.description,
        image: resource.ogImage || `${baseUrl}/api/og/resource?slug=${slug}`,
        author: {
          "@type": "Organization",
          name: "Saithavy",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Saithavy",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
          },
        },
        datePublished: resource.lastUpdated || new Date().toISOString(),
        dateModified: resource.lastUpdated || new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": resourceUrl,
        },
        keywords: resource.keywords?.join(", "),
        articleSection: categoryInfo?.name,
        about: {
          "@type": "Thing",
          name: categoryInfo?.name,
          description: categoryInfo?.description,
        },
        learningResourceType: resource.type.toLowerCase(),
        educationalLevel: resource.difficulty?.toLowerCase(),
        timeRequired: resource.timeToRead,
      },
      {
        "@type": "WebPage",
        "@id": resourceUrl,
        url: resourceUrl,
        name: resource.title,
        description: resource.description,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          url: baseUrl,
          name: "Saithavy",
        },
        about: {
          "@type": "Thing",
          name: categoryInfo?.name,
          description: categoryInfo?.description,
        },
        inLanguage: "en-US",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Resources",
              item: `${baseUrl}/resources`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: categoryInfo?.name,
              item: `${baseUrl}/resources/${category}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: resource.title,
              item: resourceUrl,
            },
          ],
        },
      },
      {
        "@type": "CreativeWork",
        name: resource.title,
        description: resource.description,
        educationalUse: resource.whatYoullLearn,
        audience: {
          "@type": "Audience",
          audienceType: resource.targetAudience,
        },
        genre: resource.type,
        keywords: resource.keywords,
      },
    ],
  };

  return jsonLd;
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

  // Get all resources for navigation
  const allResources = resources;

  // Find current resource index
  const currentIndex = allResources.findIndex(
    (r) => r.slug === resource.slug && r.category === resource.category
  );
  const previousResource = currentIndex > 0 ? allResources[currentIndex - 1] : null;
  const nextResource = currentIndex < allResources.length - 1 ? allResources[currentIndex + 1] : null;

  // Get content with metadata (if exists)
  let contentWithMetadata = null;
  if (hasContent) {
    try {
      contentWithMetadata = await getResourceContent(resource);
    } catch (error) {
      logger.error(
        `Failed to load content for resource`,
        { slug, category: resource.category },
        error as Error,
      );
    }
  }

  // Generate JSON-LD structured data
  const jsonLd = generateResourceJsonLd(resource, category, slug);

  return (
    <>
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section with Gradient */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[var(--blueprint-navy)] via-[var(--deep-navy)] to-[var(--blueprint-purple)]">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(168, 218, 220, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(224, 122, 95, 0.3) 0%, transparent 50%)`,
              }}
            ></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[var(--blueprint-sage)] mb-6 font-medium">
              <Link
                href="/resources"
                className="hover:underline transition-colors"
              >
                Resources
              </Link>
              <span className="text-[var(--blueprint-terracotta)]">/</span>
              <Link
                href={`/resources/${resource.category}`}
                className="hover:underline transition-colors capitalize"
              >
                {resource.category.replace("-", " ")}
              </Link>
              <span className="text-[var(--blueprint-terracotta)]">/</span>
              <span className="capitalize text-white">
                {resource.type.toLowerCase()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-poppins mb-6 leading-tight">
              {resource.title}
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
              {resource.description}
            </p>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {resource.difficulty && (
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20 font-medium">
                  {resource.difficulty}
                </span>
              )}
              {resource.timeToRead && (
                <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {resource.timeToRead}
                </span>
              )}
              <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {resource.downloads.toLocaleString()} downloads
              </span>
            </div>
          </div>

          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="var(--background)"
              />
            </svg>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-4">
          {/* Download Button */}
          <div className="mb-8">
            <DownloadClient resource={resource} />
          </div>

          {/* Social Share Buttons */}
          <ShareClient resource={resource} category={category} slug={slug} />

          {/* Tags Section */}
          {resource.keywords && resource.keywords.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--blueprint-purple)] to-[var(--blueprint-navy)] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7Zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7Zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7ZM7 11a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2Zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2Zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2Z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--heading)] font-poppins">
                  Tags
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.keywords.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/resources?tags=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  >
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
                        d="M7 7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7Z"
                      />
                    </svg>
                    {tag}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Content */}
          {contentWithMetadata ? (
            <article
              className="prose prose-lg max-w-none
            prose-headings:font-poppins
            prose-headings:font-bold
            prose-h1:text-3xl
            prose-h1:text-[var(--heading)]
            prose-h1:mt-8
            prose-h1:mb-4
            prose-h2:text-2xl
            prose-h2:text-[var(--heading)]
            prose-h2:mt-6
            prose-h2:mb-3
            prose-h3:text-xl
            prose-h3:text-[var(--heading)]
            prose-h3:mt-4
            prose-h3:mb-2
            prose-p:text-[var(--foreground)]
            prose-p:leading-relaxed
            prose-p:mb-4
            prose-a:text-[var(--accent)]
            prose-a:no-underline
            prose-a:font-medium
            hover:prose-a:underline
            prose-strong:text-[var(--heading)]
            prose-strong:font-semibold
            prose-code:text-[var(--accent)]
            prose-code:bg-[var(--surface-alt)]
            prose-code:px-1.5
            prose-code:py-0.5
            prose-code:rounded
            prose-code:text-sm
            prose-pre:bg-[var(--surface-alt)]
            prose-pre:border
            prose-pre:border-[var(--border)]
            prose-ul:space-y-2
            prose-li:text-[var(--foreground)]
            prose-blockquote:border-l-4
            prose-blockquote:border-[var(--accent)]
            prose-blockquote:bg-[var(--surface-alt)]
            prose-blockquote:py-2
            prose-blockquote:px-4
            prose-blockquote:italic
          "
            >
              <ReactMarkdown>{contentWithMetadata.content}</ReactMarkdown>
            </article>
          ) : (
            <div className="bg-gradient-to-br from-[var(--blueprint-orange)]/10 to-[var(--blueprint-rose)]/10 border border-[var(--blueprint-orange)]/20 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--blueprint-orange)]/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--blueprint-orange)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-[var(--heading)] font-semibold text-lg mb-2">
                Content Coming Soon
              </p>
              <p className="text-[var(--foreground)]">
                Download the resource to access the full material.
              </p>
            </div>
          )}

          {/* What You'll Learn */}
          {resource.whatYoullLearn && resource.whatYoullLearn.length > 0 && (
            <section className="mt-16 p-8 bg-gradient-to-br from-[var(--surface-alt)] to-white rounded-2xl border border-[var(--border)] shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--blueprint-emerald)] to-[var(--blueprint-sage)] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--heading)] font-poppins">
                  What You&apos;ll Learn
                </h2>
              </div>
              <ul className="space-y-4">
                {resource.whatYoullLearn.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[var(--border)] hover:shadow-md transition-shadow"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[var(--blueprint-emerald)] to-[var(--blueprint-emerald)]/70 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-[var(--foreground)] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Previous/Next Navigation */}
          {(previousResource || nextResource) && (
            <nav
              aria-label="Resource navigation"
              className="mt-16 flex justify-between items-center gap-4 p-6 bg-gradient-to-r from-[var(--surface-alt)] to-white rounded-2xl border border-[var(--border)] shadow-lg"
            >
              {previousResource && (
                <Link
                  href={`/resources/${previousResource.category}/${previousResource.slug}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
                  style={{
                    color: "var(--heading)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7 7"
                    />
                  </svg>
                  <span className="hidden sm:inline">
                    {previousResource.title}
                  </span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              )}

              {nextResource && (
                <Link
                  href={`/resources/${nextResource.category}/${nextResource.slug}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
                  style={{
                    color: "var(--heading)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <span className="hidden sm:inline">
                    {nextResource.title}
                  </span>
                  <span className="sm:hidden">Next</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </nav>
          )}

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--blueprint-purple)] to-[var(--blueprint-navy)] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--heading)] font-poppins">
                  Related Resources
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedResources.map((related) => (
                  <a
                    key={related.slug}
                    href={`/resources/${related.category}/${related.slug}`}
                    className="group block p-6 bg-white rounded-2xl border border-[var(--border)] hover:shadow-xl hover:border-[var(--accent)] transition-all duration-300"
                  >
                    <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-3">
                      {related.type.toLowerCase()}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--heading)] mb-3 font-poppins group-hover:text-[var(--accent)] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-[var(--foreground)] text-sm leading-relaxed mb-4">
                      {related.description}
                    </p>
                    <div className="flex items-center text-[var(--accent)] text-sm font-medium">
                      Explore
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
