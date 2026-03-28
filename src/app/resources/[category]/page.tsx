/**
 * Category Landing Page - All resources in a category
 *
 * Route: /resources/[category]
 * Shows filtered resources for a specific category
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, resources } from "@/lib/resourcesData";
import ClientCategoryPage from "./ClientCategoryPage";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = categories.find((c) => c.id === category);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryData.name} Resources | Saithavy`,
    description: categoryData.description,
    openGraph: {
      title: `${categoryData.name} Resources | Saithavy`,
      description: categoryData.description,
    },
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Get category data
  const categoryData = categories.find((c) => c.id === category);

  if (!categoryData) {
    notFound();
  }

  // Get resources for this category
  const categoryResources = resources.filter((r) => r.category === category);
  const featuredResources = categoryResources.filter((r) => r.featured);

  return (
    <>
      {/* Client-side page with hooks and interactivity */}
      <Suspense fallback={<CategoryLoading />}>
        <ClientCategoryPage
          category={categoryData}
          initialResources={categoryResources}
          initialFeatured={featuredResources}
          initialTotal={categoryResources.length}
        />
      </Suspense>
    </>
  );
}

function CategoryLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero skeleton */}
      <div
        className="h-48 rounded-2xl animate-pulse mb-8"
        style={{
          background:
            "linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)",
        }}
      />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-6 animate-pulse"
            style={{ backgroundColor: "var(--surface-alt)" }}
          >
            <div
              className="h-4 rounded mb-4"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="h-6 rounded mb-2 w-3/4"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="h-4 rounded mb-4 w-1/2"
              style={{ backgroundColor: "var(--border)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
