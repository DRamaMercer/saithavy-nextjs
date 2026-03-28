import { Metadata } from "next";
import { notFound } from "next/navigation";
import { resources, categories } from "@/lib/resourcesData";
import ResourcesLayout from "@/components/ResourcesLayout";

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: Generate static pages for all categories at build time for ultimate SEO/performance
export async function generateStaticParams() {
  return categories
    .filter((c) => c.id !== "all")
    .map((category) => ({
      slug: category.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Resources - Free Downloads | Saithavy`,
    description: `Explore free playbooks, templates, and guides about ${category.name.toLowerCase()} tailored for modern remote teams.`,
    openGraph: {
      title: `${category.name} Resources | Saithavy`,
      description: `Explore free playbooks, templates, and guides about ${category.name.toLowerCase()} tailored for modern remote teams.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const resourceCounts = resources.reduce(
    (acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filteredResources = resources.filter((r) => r.category === slug);
  const featuredResources = resources.filter((r) => r.featured);
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  // Structured Data specific to this category
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Resources`,
    description: `Free resources and tools about ${category.name.toLowerCase()}`,
    url: `https://saithavy.com/resources/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Saithavy",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourcesLayout
        selectedCategory={slug}
        filteredResources={filteredResources}
        featuredResources={featuredResources}
        resourceCounts={resourceCounts}
        totalDownloads={totalDownloads}
        totalResources={resources.length}
      />
    </>
  );
}
