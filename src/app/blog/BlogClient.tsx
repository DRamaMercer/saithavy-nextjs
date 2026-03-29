"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/blog";
import { BlogPostSkeleton } from "@/components/ui/Skeleton";

interface BlogClientProps {
  posts: Post[];
  categories: string[];
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [isLoading, setIsLoading] = useState(false);

  // Filter posts by category
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      if (selectedCategory === "all") {
        setFilteredPosts(posts);
      } else {
        setFilteredPosts(posts.filter((post) => post.category === selectedCategory));
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, posts]);

  // Sync with URL for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");

    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
  }, [categories]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    const newUrl = params.toString() ? `?${params}` : "";
    window.history.replaceState({}, "", newUrl);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1
            className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Insights & <span className="text-gradient">Reflections</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Deep dives into authentic leadership, the future of remote work, and
            how to harness AI for personal growth.
          </p>
        </header>

        {/* Categories - Interactive */}
        <nav aria-label="Blog categories" className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
            style={{
              backgroundColor:
                selectedCategory === "all" ? "var(--accent)" : "var(--surface)",
              color: selectedCategory === "all" ? "white" : "var(--heading)",
            }}
            aria-label="Show all posts"
            aria-pressed={selectedCategory === "all"}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-opacity-80 focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? "var(--accent)"
                    : "var(--surface)",
                color:
                  selectedCategory === category ? "white" : "var(--heading)",
              }}
              aria-label={`Filter by ${category}`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Results count */}
        <p className="text-center mb-8" style={{ color: "var(--foreground)" }}>
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </p>

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface)" }}>
                <BlogPostSkeleton />
              </div>
            ))
          ) : (
            // Show actual posts
            filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--accent)",
                  }}
                >
                  {post.category}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--foreground)" }}
                >
                  {post.readingTime}
                </span>
              </div>
              <h2
                className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-3 group-hover:text-amber-500 transition-colors"
                style={{ color: "var(--heading)" }}
              >
                {post.title}
              </h2>
              <p
                className="text-sm mb-4 line-clamp-3"
                style={{ color: "var(--foreground)" }}
              >
                {post.description}
              </p>
              <div
                className="flex items-center text-sm font-medium mt-auto border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--foreground)" }}>
                  {post.date ? format(parseISO(post.date), "MMMM d, yyyy") : "Unknown date"}
                </span>
                <span
                  className="ml-auto inline-flex items-center"
                  style={{ color: "var(--accent)" }}
                >
                  Read Article
                  <svg
                    className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
            ))
          )}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p
              className="text-lg mb-4"
              style={{ color: "var(--foreground)" }}
            >
              No posts found in this category.
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-3 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
              style={{
                backgroundColor: "var(--accent)",
                color: "white",
              }}
            >
              View All Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
