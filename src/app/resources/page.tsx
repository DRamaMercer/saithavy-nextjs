import { Metadata } from "next";
import { resources, categories } from "@/lib/resourcesData";
import ResourcesLayout from "@/components/ResourcesLayout";

export const metadata: Metadata = {
  title: "Resource Hub | Saithavy",
  description: "Downloadable e-books, Notion templates, and playbooks for remote work and authentic leadership.",
  openGraph: {
    title: "Resource Hub | Saithavy",
    description: "Downloadable e-books, Notion templates, and playbooks for remote work and authentic leadership.",
  }
};

export default function ResourcesPage() {
  const resourceCounts = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const featuredResources = resources.filter(r => r.featured);
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  // JSON-LD structured data for the main collection page
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
    // Adding category names as keywords/about
    "about": categories.filter(c => c.id !== "all").map(c => ({
      "@type": "Thing",
      "name": c.name
    }))
  };

  return (
    <>
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourcesLayout 
        selectedCategory="all"
        filteredResources={resources}
        featuredResources={featuredResources}
        resourceCounts={resourceCounts}
        totalDownloads={totalDownloads}
        totalResources={resources.length}
      />
    </>
  );
}
