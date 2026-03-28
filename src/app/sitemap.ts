import type { MetadataRoute } from "next";
import { resources } from "@/lib/resourcesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://saithavy.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Resource pages
  const resourcePages = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.category}/${resource.slug}`,
    lastModified: resource.lastUpdated
      ? new Date(resource.lastUpdated)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: resource.featured ? 0.8 : 0.7,
  }));

  // Category pages
  const categories = [
    "mindful-leadership",
    "ai-automation",
    "personal-growth",
    "remote-work",
    "overcoming-adversity",
  ];
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/resources/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...resourcePages];
}
