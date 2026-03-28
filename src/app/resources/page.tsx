/**
 * Resources Hub - Main resources page
 *
 * Premium content discovery experience with:
 * - Hero header with dark gradient
 * - Featured resource grid (70/30 layout)
 * - Pillar/category cards for navigation
 * - Advanced filtering with sticky toolbar
 * - Responsive card grid (3/2/1 columns)
 * - Save/bookmark functionality
 * - API-driven with pagination and debounced search
 */

import { Metadata } from "next";
import { Suspense } from "react";
import { resources, categories } from "@/lib/resourcesData";
import ClientResourcesPage from "./ClientResourcesPage";

// ISR: Revalidate every 30 minutes for resource library updates
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Resource Hub | Saithavy - Free Guides, Templates & Tools for Growth",
  description:
    "Browse 84+ free resources on mindful leadership, AI automation, personal growth, remote work, and overcoming adversity. Download templates, guides, workbooks, and more.",
  keywords: [
    "mindful leadership resources",
    "AI automation templates",
    "personal growth workbooks",
    "remote work guides",
    "resilience building tools",
    "leadership development",
    "free business templates",
    "professional development resources",
  ],
  authors: [{ name: "Saithavy" }],
  alternates: {
    canonical: "https://saithavy.com/resources",
  },
  openGraph: {
    title:
      "Resource Hub | Saithavy - 84+ Free Resources for Professional Growth",
    description:
      "Discover free guides, templates, and tools for mindful leadership, AI automation, personal growth, remote work, and building resilience.",
    url: "https://saithavy.com/resources",
    siteName: "Saithavy",
    type: "website",
    images: [
      {
        url: "https://saithavy.com/api/og/resources",
        width: 1200,
        height: 630,
        alt: "Saithavy Resource Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resource Hub | Saithavy - 84+ Free Resources",
    description:
      "Discover free guides, templates, and tools for professional growth and development.",
    images: ["https://saithavy.com/api/og/resources"],
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://saithavy.com/resources#collectionpage",
      url: "https://saithavy.com/resources",
      name: "Saithavy Resource Hub",
      description:
        "Browse 84+ free resources on mindful leadership, AI automation, personal growth, remote work, and overcoming adversity.",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://saithavy.com/#website",
        url: "https://saithavy.com",
        name: "Saithavy",
      },
      about: categories
        .filter((c) => c.id !== "all")
        .map((c) => ({
          "@type": "Thing",
          name: c.name,
          description: c.description,
        })),
      numberOfItems: resources.length,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://saithavy.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resources",
          item: "https://saithavy.com/resources",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://saithavy.com/#website",
      url: "https://saithavy.com",
      name: "Saithavy",
      description:
        "Free resources for mindful leadership, AI automation, and personal growth",
      publisher: {
        "@type": "Organization",
        name: "Saithavy",
        logo: {
          "@type": "ImageObject",
          url: "https://saithavy.com/logo.png",
        },
      },
    },
  ],
};

// Get initial data for server-side rendering
const featuredResources = resources.filter((r) => r.featured).slice(0, 4);
const mainFeatured = featuredResources[0];
const supportingFeatured = featuredResources.slice(1);

export default function ResourcesPage() {
  return (
    <>
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Client-side page with hooks and interactivity */}
      <Suspense fallback={<ResourcesLoading />}>
        <ClientResourcesPage
          initialCategories={categories}
          initialFeatured={mainFeatured}
          initialSupporting={supportingFeatured}
          initialTotal={resources.length}
        />
      </Suspense>
    </>
  );
}

function ResourcesLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Hero skeleton */}
        <div
          className="h-64 rounded-2xl animate-pulse"
          style={{
            background:
              "linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)",
          }}
        />

        {/* Featured skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="md:col-span-2 h-64 rounded-xl animate-pulse"
            style={{ backgroundColor: "var(--surface-alt)" }}
          />
          <div className="space-y-4">
            <div
              className="h-28 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--surface-alt)" }}
            />
            <div
              className="h-28 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--surface-alt)" }}
            />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--surface-alt)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
