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

export const metadata: Metadata = {
  title: "Resource Hub | Saithavy",
  description: "Guides, templates, and tools for personal and professional growth. Browse 62+ free resources on mindful leadership, AI automation, and more.",
  openGraph: {
    title: "Resource Hub | Saithavy",
    description: "Guides, templates, and tools for personal and professional growth.",
  }
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": metadata.title,
  "description": metadata.description,
  "url": "https://saithavy.com/resources",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Saithavy"
  },
  "about": categories.filter(c => c.id !== "all").map(c => ({
    "@type": "Thing",
    "name": c.name
  }))
};

// Get initial data for server-side rendering
const featuredResources = resources.filter(r => r.featured).slice(0, 4);
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
        <div className="h-64 rounded-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)' }} />

        {/* Featured skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-alt)' }} />
          <div className="space-y-4">
            <div className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-alt)' }} />
            <div className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-alt)' }} />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-alt)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
